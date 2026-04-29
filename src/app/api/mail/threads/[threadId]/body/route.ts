import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { google } from 'googleapis'
import { refreshOutlookToken } from '@/lib/outlook'
import { refreshZohoToken } from '@/lib/zoho'

export const dynamic = 'force-dynamic'

function getOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  )
}

async function getFreshToken(account: any): Promise<string> {
  const isExpired = !account.expiresAt || new Date(account.expiresAt).getTime() < Date.now() + 60_000
  if (!isExpired) return account.accessToken
  try {
    if (account.provider === 'google') {
      const client = getOAuth2Client()
      client.setCredentials({ access_token: account.accessToken, refresh_token: account.refreshToken })
      const { credentials } = await client.refreshAccessToken()
      if (credentials.access_token) {
        await (prisma as any).emailAccount.update({
          where: { id: account.id },
          data: { accessToken: credentials.access_token, ...(credentials.expiry_date ? { expiresAt: new Date(credentials.expiry_date) } : {}) },
        })
        return credentials.access_token
      }
    } else if (account.provider === 'outlook' || account.provider === 'microsoft') {
      const tokens = await refreshOutlookToken(account.refreshToken)
      await (prisma as any).emailAccount.update({
        where: { id: account.id },
        data: { accessToken: tokens.access_token, ...(tokens.refresh_token ? { refreshToken: tokens.refresh_token } : {}), ...(tokens.expires_in ? { expiresAt: new Date(Date.now() + tokens.expires_in * 1000) } : {}) },
      })
      return tokens.access_token
    } else if (account.provider === 'zoho') {
      const tokens = await refreshZohoToken(account.refreshToken)
      await (prisma as any).emailAccount.update({
        where: { id: account.id },
        data: { accessToken: tokens.access_token, ...(tokens.expires_in ? { expiresAt: new Date(Date.now() + tokens.expires_in * 1000) } : {}) },
      })
      return tokens.access_token
    }
  } catch (e) { console.warn('Token refresh failed in body route:', e) }
  return account.accessToken
}

function decodeBase64Url(data: string): string {
  const base64 = data.replace(/-/g, '+').replace(/_/g, '/')
  return Buffer.from(base64, 'base64').toString('utf-8')
}

interface Attachment {
  id: string
  name: string
  size: number
  mimeType: string
}

function parseGmailParts(
  parts: any[],
  result: { html?: string; text?: string; attachments: Attachment[] }
) {
  for (const part of parts) {
    const mime = part.mimeType || ''
    if (part.parts) {
      parseGmailParts(part.parts, result)
    } else if (mime === 'text/html' && part.body?.data && !result.html) {
      result.html = decodeBase64Url(part.body.data)
    } else if (mime === 'text/plain' && part.body?.data && !result.text) {
      result.text = decodeBase64Url(part.body.data)
    } else if (part.filename && (part.body?.attachmentId || part.body?.data)) {
      result.attachments.push({
        id: part.body.attachmentId || part.partId || '',
        name: part.filename,
        size: part.body.size || 0,
        mimeType: mime,
      })
    }
  }
}

async function getGmailBody(account: any, thread: any) {
  const token = await getFreshToken(account)
  const client = getOAuth2Client()
  client.setCredentials({ access_token: token, refresh_token: account.refreshToken })
  const gmail = google.gmail({ version: 'v1', auth: client })

  // Get the latest message in the thread with full format
  const msgId = thread.messageId || thread.threadId
  const { data } = await gmail.users.messages.get({
    userId: 'me',
    id: msgId,
    format: 'full',
  })

  const result: { html?: string; text?: string; attachments: Attachment[] } = { attachments: [] }

  if (data.payload?.body?.data) {
    const mime = data.payload.mimeType || ''
    if (mime === 'text/html') result.html = decodeBase64Url(data.payload.body.data)
    else result.text = decodeBase64Url(data.payload.body.data)
  }

  if (data.payload?.parts) {
    parseGmailParts(data.payload.parts, result)
  }

  return result
}

async function getOutlookBody(account: any, thread: any) {
  const token = await getFreshToken(account)
  const msgId = thread.messageId || thread.threadId
  const res = await fetch(
    `https://graph.microsoft.com/v1.0/me/messages/${msgId}?$select=body,hasAttachments`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  if (!res.ok) throw new Error(`Outlook fetch failed: ${res.status}`)
  const data = await res.json()

  const result: { html?: string; text?: string; attachments: Attachment[] } = { attachments: [] }

  if (data.body?.contentType === 'html') result.html = data.body.content
  else result.text = data.body?.content || ''

  if (data.hasAttachments) {
    const attRes = await fetch(
      `https://graph.microsoft.com/v1.0/me/messages/${msgId}/attachments?$select=id,name,size,contentType`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    if (attRes.ok) {
      const attData = await attRes.json()
      for (const att of attData.value || []) {
        if (att['@odata.type'] !== '#microsoft.graph.itemAttachment') {
          result.attachments.push({
            id: att.id,
            name: att.name,
            size: att.size,
            mimeType: att.contentType,
          })
        }
      }
    }
  }

  return result
}

async function getZohoBody(account: any, thread: any) {
  const token = await getFreshToken(account)
  const zohoBase = process.env.ZOHO_REGION === 'eu'
    ? 'https://mail.zoho.eu/api'
    : 'https://mail.zoho.com/api'

  // Get Zoho accountId
  const accRes = await fetch(`${zohoBase}/accounts`, {
    headers: { Authorization: `Zoho-oauthtoken ${token}` },
  })
  if (!accRes.ok) throw new Error('Zoho accounts fetch failed')
  const accData = await accRes.json()
  const zohoAccountId = accData.data?.[0]?.accountId
  if (!zohoAccountId) throw new Error('Zoho accountId not found')

  const msgId = thread.messageId || thread.threadId
  const res = await fetch(
    `${zohoBase}/accounts/${zohoAccountId}/messages/${msgId}/content`,
    { headers: { Authorization: `Zoho-oauthtoken ${token}` } }
  )
  if (!res.ok) throw new Error(`Zoho message fetch failed: ${res.status}`)
  const data = await res.json()

  const result: { html?: string; text?: string; attachments: Attachment[] } = { attachments: [] }
  const content = data.data?.content || ''
  if (content.trim().startsWith('<')) result.html = content
  else result.text = content

  // Attachments
  const atts = data.data?.attachments || []
  for (const att of atts) {
    result.attachments.push({
      id: att.attachmentId || att.storeName,
      name: att.attachmentName,
      size: att.attachmentSize || 0,
      mimeType: att.attachmentType || 'application/octet-stream',
    })
  }

  return result
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { threadId: string } }
) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const thread = await (prisma as any).emailThread.findUnique({
    where: { id: params.threadId },
    include: { account: true },
  })
  if (!thread) return NextResponse.json({ error: 'Introuvable' }, { status: 404 })

  try {
    const { account } = thread
    let body

    if (account.provider === 'google') {
      body = await getGmailBody(account, thread)
    } else if (account.provider === 'outlook' || account.provider === 'microsoft') {
      body = await getOutlookBody(account, thread)
    } else if (account.provider === 'zoho') {
      body = await getZohoBody(account, thread)
    } else {
      return NextResponse.json({ error: 'Provider non supporté' }, { status: 400 })
    }

    return NextResponse.json(body)
  } catch (err: any) {
    console.error('Body fetch error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
