import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { google } from 'googleapis'
import { sendGmailReply } from '@/lib/gmail'
import { replyToOutlookMessage, refreshOutlookToken } from '@/lib/outlook'
import { replyToZohoMessage, getZohoUserInfo, refreshZohoToken } from '@/lib/zoho'

export const dynamic = 'force-dynamic'

async function getFreshToken(account: any): Promise<string> {
  if (!account.refreshToken) return account.accessToken
  const isExpired = !account.expiresAt || new Date(account.expiresAt).getTime() < Date.now() + 60_000
  if (!isExpired) return account.accessToken

  try {
    if (account.provider === 'google') {
      const client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET
      )
      client.setCredentials({ access_token: account.accessToken, refresh_token: account.refreshToken })
      const { credentials } = await client.refreshAccessToken()
      if (credentials.access_token) {
        await (prisma as any).emailAccount.update({
          where: { id: account.id },
          data: {
            accessToken: credentials.access_token,
            ...(credentials.expiry_date ? { expiresAt: new Date(credentials.expiry_date) } : {}),
          },
        })
        return credentials.access_token
      }
    } else if (account.provider === 'outlook' || account.provider === 'microsoft') {
      const tokens = await refreshOutlookToken(account.refreshToken)
      await (prisma as any).emailAccount.update({
        where: { id: account.id },
        data: {
          accessToken: tokens.access_token,
          ...(tokens.refresh_token ? { refreshToken: tokens.refresh_token } : {}),
          ...(tokens.expires_in ? { expiresAt: new Date(Date.now() + tokens.expires_in * 1000) } : {}),
        },
      })
      return tokens.access_token
    } else if (account.provider === 'zoho') {
      const tokens = await refreshZohoToken(account.refreshToken)
      await (prisma as any).emailAccount.update({
        where: { id: account.id },
        data: {
          accessToken: tokens.access_token,
          ...(tokens.expires_in ? { expiresAt: new Date(Date.now() + tokens.expires_in * 1000) } : {}),
        },
      })
      return tokens.access_token
    }
  } catch (e) {
    console.warn('Token refresh failed in reply:', e)
  }
  return account.accessToken
}

export async function POST(
  request: NextRequest,
  { params }: { params: { threadId: string } }
) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { body, attachments = [] } = await request.json()
  if (!body?.trim()) {
    return NextResponse.json({ error: 'Corps du message vide' }, { status: 400 })
  }

  const thread = await (prisma as any).emailThread.findUnique({
    where: { id: params.threadId },
    include: { account: true },
  })
  if (!thread) return NextResponse.json({ error: 'Introuvable' }, { status: 404 })

  const { account } = thread
  const token = await getFreshToken(account)

  // Extraire l'adresse email du destinataire
  const toMatch = thread.sender.match(/<(.+)>/)
  const to = toMatch ? toMatch[1] : thread.sender

  try {
    if (account.provider === 'google') {
      const inReplyTo = thread.messageId || thread.threadId
      await sendGmailReply(
        token,
        account.refreshToken ?? undefined,
        thread.threadId,
        inReplyTo,
        to,
        thread.subject,
        body,
        attachments
      )
    } else if (account.provider === 'outlook' || account.provider === 'microsoft') {
      const msgId = thread.messageId || thread.threadId
      await replyToOutlookMessage(token, msgId, body)
    } else if (account.provider === 'zoho') {
      const userInfo = await getZohoUserInfo(token)
      if (!userInfo.accountId) throw new Error('Zoho accountId manquant')
      await replyToZohoMessage(
        token,
        userInfo.accountId,
        thread.messageId || thread.threadId,
        to,
        thread.subject,
        body
      )
    } else {
      return NextResponse.json({ error: 'Provider non supporté' }, { status: 400 })
    }

    await (prisma as any).emailThread.update({
      where: { id: params.threadId },
      data: { isUnread: false },
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Reply error:', err)
    // Message d'erreur lisible
    const msg = err?.message || String(err)
    const isPermission = msg.toLowerCase().includes('insufficient') || msg.toLowerCase().includes('permission')
    return NextResponse.json(
      {
        error: isPermission
          ? 'Permissions insuffisantes — reconnectez ce compte dans Paramètres pour accorder les droits d\'envoi'
          : msg
      },
      { status: isPermission ? 403 : 500 }
    )
  }
}
