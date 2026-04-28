import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { trashGmailThread, markGmailThreadRead } from '@/lib/gmail'
import { deleteOutlookMessage, markOutlookMessageRead } from '@/lib/outlook'
import { deleteZohoMessage, getZohoUserInfo, markZohoMessageRead } from '@/lib/zoho'

export const dynamic = 'force-dynamic'

// DELETE → supprime / envoie à la corbeille
export async function DELETE(
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

  const { account } = thread

  // Tentative de suppression côté provider (non bloquante)
  try {
    if (account.provider === 'google') {
      await trashGmailThread(account.accessToken, account.refreshToken ?? undefined, thread.threadId)
    } else if (account.provider === 'outlook') {
      await deleteOutlookMessage(account.accessToken, thread.messageId || thread.threadId)
    } else if (account.provider === 'zoho') {
      const userInfo = await getZohoUserInfo(account.accessToken)
      if (userInfo.accountId && (thread.messageId || thread.threadId)) {
        await deleteZohoMessage(account.accessToken, userInfo.accountId, thread.messageId || thread.threadId)
      }
    }
  } catch (providerErr) {
    // On log mais on continue — la suppression locale reste valide
    console.warn('Provider delete failed (non-blocking):', providerErr)
  }

  // Toujours supprimer de la DB locale
  await (prisma as any).emailThread.delete({ where: { id: params.threadId } })
  return NextResponse.json({ success: true })
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

  // Tentative de marquage côté provider (non bloquante)
  if (markRead) {
    try {
      if (account.provider === 'google') {
        await markGmailThreadRead(account.accessToken, account.refreshToken ?? undefined, thread.threadId)
      } else if (account.provider === 'outlook') {
        await markOutlookMessageRead(account.accessToken, thread.messageId || thread.threadId)
      } else if (account.provider === 'zoho') {
        const userInfo = await getZohoUserInfo(account.accessToken)
        if (userInfo.accountId && (thread.messageId || thread.threadId)) {
          await markZohoMessageRead(account.accessToken, userInfo.accountId, thread.messageId || thread.threadId)
        }
      }
    } catch (providerErr) {
      console.warn('Provider markRead failed (non-blocking):', providerErr)
    }
  }

  // Toujours mettre à jour la DB locale
  const updated = await (prisma as any).emailThread.update({
    where: { id: params.threadId },
    data: {
      ...(markRead !== undefined ? { isUnread: !markRead } : {}),
      ...(archive !== undefined ? { isArchived: archive } : {}),
    },
  })
  return NextResponse.json(updated)
}
