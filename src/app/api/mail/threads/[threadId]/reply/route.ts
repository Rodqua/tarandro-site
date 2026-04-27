import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { sendGmailReply } from '@/lib/gmail'
import { replyToOutlookMessage } from '@/lib/outlook'
import { replyToZohoMessage, getZohoUserInfo } from '@/lib/zoho'

export const dynamic = 'force-dynamic'

export async function POST(
  request: NextRequest,
  { params }: { params: { threadId: string } }
) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { body } = await request.json()
  if (!body?.trim()) {
    return NextResponse.json({ error: 'Corps du message vide' }, { status: 400 })
  }

  const thread = await (prisma as any).emailThread.findUnique({
    where: { id: params.threadId },
    include: { account: true },
  })
  if (!thread) return NextResponse.json({ error: 'Introuvable' }, { status: 404 })

  const { account } = thread

  // Extraire l'email du sender
  const toMatch = thread.sender.match(/<(.+)>/)
  const to = toMatch ? toMatch[1] : thread.sender

  try {
    if (account.provider === 'google') {
      const inReplyTo = thread.messageId || thread.threadId
      await sendGmailReply(
        account.accessToken,
        account.refreshToken ?? undefined,
        thread.threadId,
        inReplyTo,
        to,
        thread.subject,
        body
      )
    } else if (account.provider === 'outlook') {
      const msgId = thread.messageId || thread.threadId
      await replyToOutlookMessage(account.accessToken, msgId, body)
    } else if (account.provider === 'zoho') {
      const userInfo = await getZohoUserInfo(account.accessToken)
      if (!userInfo.accountId) throw new Error('Zoho accountId manquant')
      await replyToZohoMessage(
        account.accessToken,
        userInfo.accountId,
        thread.messageId || thread.threadId,
        to,
        thread.subject,
        body
      )
    } else {
      return NextResponse.json({ error: 'Provider non supporté' }, { status: 400 })
    }

    // Marquer comme lu dans la DB
    await (prisma as any).emailThread.update({
      where: { id: params.threadId },
      data: { isUnread: false },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Reply error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
