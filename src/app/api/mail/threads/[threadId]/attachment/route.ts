import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { google } from 'googleapis'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { threadId: string } }
) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const attachmentId = searchParams.get('id') || ''
  const filename = searchParams.get('filename') || 'attachment'

  const thread = await (prisma as any).emailThread.findUnique({
    where: { id: params.threadId },
    include: { account: true },
  })
  if (!thread) return NextResponse.json({ error: 'Introuvable' }, { status: 404 })

  const { account } = thread

  try {
    if (account.provider === 'google') {
      const client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
      )
      client.setCredentials({ access_token: account.accessToken, refresh_token: account.refreshToken })
      const gmail = google.gmail({ version: 'v1', auth: client })

      const msgId = thread.messageId || thread.threadId
      const { data } = await gmail.users.messages.attachments.get({
        userId: 'me',
        messageId: msgId,
        id: attachmentId,
      })

      if (!data.data) return NextResponse.json({ error: 'Pièce jointe introuvable' }, { status: 404 })
      const buffer = Buffer.from(data.data.replace(/-/g, '+').replace(/_/g, '/'), 'base64')
      return new NextResponse(buffer, {
        headers: {
          'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
          'Content-Type': 'application/octet-stream',
          'Content-Length': String(buffer.length),
        },
      })

    } else if (account.provider === 'outlook' || account.provider === 'microsoft') {
      const msgId = thread.messageId || thread.threadId
      const res = await fetch(
        `https://graph.microsoft.com/v1.0/me/messages/${msgId}/attachments/${attachmentId}/$value`,
        { headers: { Authorization: `Bearer ${account.accessToken}` } }
      )
      if (!res.ok) throw new Error(`Outlook attachment fetch failed: ${res.status}`)
      const buffer = Buffer.from(await res.arrayBuffer())
      return new NextResponse(buffer, {
        headers: {
          'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
          'Content-Type': res.headers.get('content-type') || 'application/octet-stream',
        },
      })

    } else if (account.provider === 'zoho') {
      const zohoBase = process.env.ZOHO_REGION === 'eu'
        ? 'https://mail.zoho.eu/api'
        : 'https://mail.zoho.com/api'
      const accRes = await fetch(`${zohoBase}/accounts`, {
        headers: { Authorization: `Zoho-oauthtoken ${account.accessToken}` },
      })
      const accData = await accRes.json()
      const zohoAccountId = accData.data?.[0]?.accountId
      const msgId = thread.messageId || thread.threadId
      const res = await fetch(
        `${zohoBase}/accounts/${zohoAccountId}/messages/${msgId}/attachments/${attachmentId}`,
        { headers: { Authorization: `Zoho-oauthtoken ${account.accessToken}` } }
      )
      if (!res.ok) throw new Error(`Zoho attachment failed: ${res.status}`)
      const buffer = Buffer.from(await res.arrayBuffer())
      return new NextResponse(buffer, {
        headers: {
          'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
          'Content-Type': 'application/octet-stream',
        },
      })
    }

    return NextResponse.json({ error: 'Provider non supporté' }, { status: 400 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
