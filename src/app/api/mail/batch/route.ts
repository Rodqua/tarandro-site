import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { google } from 'googleapis'
import { trashGmailThread } from '@/lib/gmail'
import { deleteOutlookMessage, refreshOutlookToken } from '@/lib/outlook'
import { deleteZohoMessage, getZohoUserInfo, refreshZohoToken } from '@/lib/zoho'

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
      client.setCredentials({
        access_token: account.accessToken,
        refresh_token: account.refreshToken,
      })
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
    console.warn('Token refresh failed in batch:', e)
  }
  return account.accessToken
}

async function deleteOutlookConversation(conversationId: string, token: string): Promise<void> {
  const qs = new URLSearchParams({
    '$filter': `conversationId eq '${conversationId}'`,
    '$select': 'id',
    '$top': '50',
  })
  const res = await fetch(
    `https://graph.microsoft.com/v1.0/me/messages?${qs.toString()}`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  if (!res.ok) throw new Error(`Outlook conversation fetch failed: ${res.status}`)
  const data = await res.json()
  const messages: { id: string }[] = data.value || []
  if (messages.length === 0) throw new Error('Aucun message dans la conversation')
  await Promise.all(messages.map((msg) => deleteOutlookMessage(token, msg.id)))
}

// POST /api/mail/batch  { action: 'remove', ids: string[] }
export async function POST(request: NextRequest) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const body = await request.json()
  const { action, ids } = body

  if (action !== 'remove' || !Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: 'Paramètres invalides' }, { status: 400 })
  }

  const threads = await (prisma as any).emailThread.findMany({
    where: { id: { in: ids } },
    include: { account: true },
  })

  const zohoAccountIds: Record<string, string> = {}
  const tokenCache: Record<string, string> = {}

  // Séquentiel par compte pour éviter les refreshs concurrents
  const accountIds = [...new Set(threads.map((t: any) => t.account.id))]
  for (const accId of accountIds) {
    const acc = threads.find((t: any) => t.account.id === accId)?.account
    if (acc) tokenCache[accId] = await getFreshToken(acc)
  }

  const providerResults = await Promise.allSettled(
    threads.map(async (thread: any) => {
      const { account } = thread
      const token = tokenCache[account.id] || account.accessToken

      if (account.provider === 'google') {
        await trashGmailThread(token, account.refreshToken ?? undefined, thread.threadId)
      } else if (account.provider === 'outlook' || account.provider === 'microsoft') {
        if (thread.messageId) {
          await deleteOutlookMessage(token, thread.messageId)
        } else {
          await deleteOutlookConversation(thread.threadId, token)
        }
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
