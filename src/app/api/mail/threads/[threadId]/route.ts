import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { trashGmailThread, markGmailThreadRead } from '@/lib/gmail'
import { deleteOutlookMessage, markOutlookMessageRead, refreshOutlookToken } from '@/lib/outlook'
import { deleteZohoMessage, getZohoUserInfo, markZohoMessageRead, refreshZohoToken } from '@/lib/zoho'

export const dynamic = 'force-dynamic'

async function getFreshToken(account: any): Promise<string> {
  if (!account.expiresAt) return account.accessToken
  const isExpired = new Date(account.expiresAt).getTime() < Date.now() + 60_000
  if (!isExpired) return account.accessToken
  if (!account.refreshToken) return account.accessToken

  try {
    let tokens: any
    if (account.provider === 'outlook' || account.provider === 'microsoft') {
      tokens = await refreshOutlookToken(account.refreshToken)
    } else if (account.provider === 'zoho') {
      tokens = await refreshZohoToken(account.refreshToken)
    } else {
      return account.accessToken
    }
    const newToken = tokens.access_token
    const expiresAt = tokens.expires_in ? new Date(Date.now() + tokens.expires_in * 1000) : null
    await (prisma as any).emailAccount.update({
      where: { id: account.id },
      data: { accessToken: newToken, ...(expiresAt ? { expiresAt } : {}) },
    })
    return newToken
  } catch {
    return account.accessToken
  }
}

// DELETE → supprime côté provider puis en DB
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
  const token = await getFreshToken(account)

  try {
    if (account.provider === 'google') {
      await trashGmailThread(token, account.refreshToken ?? undefined, thread.threadId)
    } else if (account.provider === 'outlook' || account.provider === 'microsoft') {
      await deleteOutlookMessage(token, thread.messageId || thread.threadId)
    } else if (account.provider === 'zoho') {
      const userInfo = await getZohoUserInfo(token)
      if (!userInfo.accountId) throw new Error('Zoho accountId introuvable')
      await deleteZohoMessage(token, userInfo.accountId, thread.messageId || thread.threadId)
    }
  } catch (providerErr: any) {
    console.error('Provider delete failed:', providerErr)
    return NextResponse.json(
      { error: `Erreur provider : ${providerErr.message}` },
      { status: 502 }
    )
  }

  // Supprimer de la DB seulement si le provider a confirmé
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
  const token = await getFreshToken(account)

  // Marquage côté provider (non bloquant — l'état local prime)
  if (markRead) {
    try {
      if (account.provider === 'google') {
        await markGmailThreadRead(token, account.refreshToken ?? undefined, thread.threadId)
      } else if (account.provider === 'outlook' || account.provider === 'microsoft') {
        await markOutlookMessageRead(token, thread.messageId || thread.threadId)
      } else if (account.provider === 'zoho') {
        const userInfo = await getZohoUserInfo(token)
        if (userInfo.accountId && (thread.messageId || thread.threadId)) {
          await markZohoMessageRead(token, userInfo.accountId, thread.messageId || thread.threadId)
        }
      }
    } catch (e) {
      // "Lu" localement même si le provider n'a pas répondu
      console.warn('Provider markRead failed (non-blocking):', e)
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
}
