import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { trashGmailThread } from '@/lib/gmail'
import { deleteOutlookMessage, refreshOutlookToken } from '@/lib/outlook'
import { deleteZohoMessage, getZohoUserInfo, refreshZohoToken } from '@/lib/zoho'

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
    await (prisma as any).emailAccount.update({
      where: { id: account.id },
      data: { accessToken: tokens.access_token, expiresAt: tokens.expires_in ? new Date(Date.now() + tokens.expires_in * 1000) : null },
    })
    return tokens.access_token
  } catch {
    return account.accessToken
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { ids } = await request.json()
  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: 'ids manquants' }, { status: 400 })
  }

  const threads = await (prisma as any).emailThread.findMany({
    where: { id: { in: ids } },
    include: { account: true },
  })

  const zohoAccountIds: Record<string, string> = {}
  const tokenCache: Record<string, string> = {}

  const providerResults = await Promise.allSettled(
    threads.map(async (thread: any) => {
      const { account } = thread
      if (!tokenCache[account.id]) {
        tokenCache[account.id] = await getFreshToken(account)
      }
      const token = tokenCache[account.id]

      if (account.provider === 'google') {
        await trashGmailThread(token, account.refreshToken ?? undefined, thread.threadId)
      } else if (account.provider === 'outlook' || account.provider === 'microsoft') {
        await deleteOutlookMessage(token, thread.messageId || thread.threadId)
      } else if (account.provider === 'zoho') {
        if (!zohoAccountIds[account.id]) {
          const info = await getZohoUserInfo(token)
          if (info.accountId) zohoAccountIds[account.id] = info.accountId
        }
        const zohoId = zohoAccountIds[account.id]
        if (zohoId) await deleteZohoMessage(token, zohoId, thread.messageId || thread.threadId)
      }
      return thread.id
    })
  )

  // Supprimer de la DB uniquement ceux que le provider a confirmé
  const deletedIds = providerResults
    .filter(r => r.status === 'fulfilled')
    .map(r => (r as PromiseFulfilledResult<string>).value)

  const failedCount = providerResults.filter(r => r.status === 'rejected').length

  if (deletedIds.length > 0) {
    await (prisma as any).emailThread.deleteMany({ where: { id: { in: deletedIds } } })
  }

  return NextResponse.json({
    success: true,
    deleted: deletedIds.length,
    failed: failedCount,
    message: failedCount > 0
      ? `${deletedIds.length} supprimé(s), ${failedCount} échec(s) côté provider`
      : `${deletedIds.length} email(s) supprimé(s)`,
  })
}
