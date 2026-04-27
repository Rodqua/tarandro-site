import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { trashGmailThread, markGmailThreadRead } from '@/lib/gmail'
import { deleteOutlookMessage, markOutlookMessageRead } from '@/lib/outlook'
import { deleteZohoMessage, getZohoUserInfo, markZohoMessageRead } from '@/lib/zoho'

export const dynamic = 'force-dynamic'

// DELETE → supprime / envoie à la corbeille
export async function DELETE(
  request: NextRequest,
  { params }: { params: { threadId: string } }
) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const thread = await (prisma as any).emailThread.findUnique({
    where: { id: params.threadId },
    include: { account: true },
  })
  if (!thread) return NextResponse.json({ error: 'Introuvable' }, { status: 404 })

  const { account } = thread

  try {
    if (account.provider === 'google') {
      await trashGmailThread(account.accessToken, account.refreshToken ?? undefined, thread.threadId)
    } else if (account.provider === 'outlook') {
      const msgId = thread.messageId || thread.threadId
      await deleteOutlookMessage(account.accessToken, msgId)
    } else if (account.provider === 'zoho') {
      const userInfo = await getZohoUserInfo(account.accessToken)
      if (userInfo.accountId && thread.messageId) {
        await deleteZohoMessage(account.accessToken, userInfo.accountId, thread.messageId)
      }
    }
    await (prisma as any).emailThread.delete({ where: { id: params.threadId } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Delete error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

// PATCH → mark as read / archive
export async function PATCH(
  request: NextRequest,
  { params }: { params: { threadId: string } }
) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const body = await request.json()
  const { markRead, archive } = body

  const thread = await (prisma as any).emailThread.findUnique({
    where: { id: params.threadId },
    include: { account: true },
  })
  if (!thread) return NextResponse.json({ error: 'Introuvable' }, { status: 404 })

  const { account } = thread

  try {
    if (markRead) {
      if (account.provider === 'google') {
        await markGmailThreadRead(account.accessToken, account.refreshToken ?? undefined, thread.threadId)
      } else if (account.provider === 'outlook') {
        const msgId = thread.messageId || thread.threadId
        await markOutlookMessageRead(account.accessToken, msgId)
      } else if (account.provider === 'zoho') {
        const userInfo = await getZohoUserInfo(account.accessToken)
        if (userInfo.accountId && thread.messageId) {
          await markZohoMessageRead(account.accessToken, userInfo.accountId, thread.messageId)
        }
      }
    }
    const updated = await (prisma as any).emailThread.update({
      where: { id: params.threadId },
      data: {
        ...(markRead !== undefined ? { isUnread: !markRead } : {}),
        ...(archive !== undefined ? { isArchived: archive } : {}),
      },
    })
    return NextResponse.json(updated)
  } catch (err) {
    console.error('Patch error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
