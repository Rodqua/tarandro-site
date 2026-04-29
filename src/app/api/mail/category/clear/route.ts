import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { google } from 'googleapis'
import { trashGmailThread } from '@/lib/gmail'
import { deleteOutlookMessage, refreshOutlookToken } from '@/lib/outlook'
import { deleteZohoMessage, getZohoUserInfo, refreshZohoToken } from '@/lib/zoho'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

// POST /api/mail/category/clear  { category: string }
// Supprime tous les emails d'une catégorie chez le provider + en DB
export async function POST(request: NextRequest) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { category } = await request.json()
  if (!category) return NextResponse.json({ error: 'category manquant' }, { status: 400 })

  const threads = await (prisma as any).emailThread.findMany({
    where: { category },
    include: { account: true },
    take: 200,
  })

  if (threads.length === 0) return NextResponse.json({ deleted: 0, failed: 0 })

  // Refresh tokens par compte
  const tokenCache: Record<string, string> = {}
  const accountIds = Array.from(new Set<string>(threads.map((t: any) => t.account.id)))
  for (const accId of accountIds) {
    const acc = threads.find((t: any) => t.account.id === accId)?.account
    if (!acc) continue
    try {
      if (acc.provider === 'google') {
        const client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET)
        client.setCredentials({ access_token: acc.accessToken, refresh_token: acc.refreshToken })
        const { credentials } = await client.refreshAccessToken()
        tokenCache[accId] = credentials.access_token || acc.accessToken
      } else if (acc.provider === 'outlook' || acc.provider === 'microsoft') {
        const t = await refreshOutlookToken(acc.refreshToken)
        tokenCache[accId] = t.access_token
      } else if (acc.provider === 'zoho') {
        const t = await refreshZohoToken(acc.refreshToken)
        tokenCache[accId] = t.access_token
      } else {
        tokenCache[accId] = acc.accessToken
      }
    } catch { tokenCache[accId] = acc.accessToken }
  }

  const zohoAccountIds: Record<string, string> = {}
  const deletedIds: string[] = []
  const CHUNK = 5

  for (let i = 0; i < threads.length; i += CHUNK) {
    const chunk = threads.slice(i, i + CHUNK)
    const results = await Promise.allSettled(chunk.map(async (thread: any) => {
      const token = tokenCache[thread.account.id] || thread.account.accessToken
      if (thread.account.provider === 'google') {
        await trashGmailThread(token, thread.account.refreshToken ?? undefined, thread.threadId)
      } else if (thread.account.provider === 'outlook' || thread.account.provider === 'microsoft') {
        const msgId = thread.messageId || thread.threadId
        const del = await fetch(`https://graph.microsoft.com/v1.0/me/messages/${msgId}`, {
          method: 'DELETE', headers: { Authorization: `Bearer ${token}` },
        })
        if (!del.ok && del.status !== 204) throw new Error(`Outlook DELETE ${del.status}`)
      } else if (thread.account.provider === 'zoho') {
        if (!zohoAccountIds[thread.account.id]) {
          const info = await getZohoUserInfo(token)
          if (info.accountId) zohoAccountIds[thread.account.id] = info.accountId
        }
        const zid = zohoAccountIds[thread.account.id]
        if (zid) await deleteZohoMessage(token, zid, thread.messageId || thread.threadId)
      }
      return thread.id
    }))
    for (const r of results) {
      if (r.status === 'fulfilled') deletedIds.push((r as PromiseFulfilledResult<string>).value)
    }
  }

  if (deletedIds.length > 0) {
    await (prisma as any).emailThread.deleteMany({ where: { id: { in: deletedIds } } })
  }

  return NextResponse.json({ deleted: deletedIds.length, failed: threads.length - deletedIds.length })
}
