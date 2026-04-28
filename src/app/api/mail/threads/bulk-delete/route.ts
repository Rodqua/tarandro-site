import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { trashGmailThread } from '@/lib/gmail'
import { deleteOutlookMessage } from '@/lib/outlook'
import { deleteZohoMessage, getZohoUserInfo } from '@/lib/zoho'

export const dynamic = 'force-dynamic'

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

  // Cache Zoho accountId par compte pour éviter les appels répétés
  const zohoAccountIds: Record<string, string> = {}

  const results = await Promise.allSettled(
    threads.map(async (thread: any) => {
      const { account } = thread
      try {
        if (account.provider === 'google') {
          await trashGmailThread(account.accessToken, account.refreshToken ?? undefined, thread.threadId)
        } else if (account.provider === 'outlook') {
          await deleteOutlookMessage(account.accessToken, thread.messageId || thread.threadId)
        } else if (account.provider === 'zoho') {
          if (!zohoAccountIds[account.id]) {
            const info = await getZohoUserInfo(account.accessToken)
            if (info.accountId) zohoAccountIds[account.id] = info.accountId
          }
          const zohoId = zohoAccountIds[account.id]
          if (zohoId && (thread.messageId || thread.threadId)) {
            await deleteZohoMessage(account.accessToken, zohoId, thread.messageId || thread.threadId)
          }
        }
      } catch (e) {
        console.warn(`Provider delete failed for ${thread.id}:`, e)
      }
    })
  )

  // Supprimer tous de la DB (même si provider a échoué)
  await (prisma as any).emailThread.deleteMany({ where: { id: { in: ids } } })

  const failed = results.filter(r => r.status === 'rejected').length
  return NextResponse.json({ success: true, deleted: ids.length, providerFailed: failed })
}
