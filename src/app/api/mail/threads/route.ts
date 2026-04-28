import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { listGmailThreads, getGmailThread, categorizeEmail } from '@/lib/gmail'
import { listOutlookMessages, categorizeOutlookEmail, refreshOutlookToken } from '@/lib/outlook'
import { listZohoMessages, getZohoUserInfo, categorizeZohoEmail, refreshZohoToken } from '@/lib/zoho'
import { google } from 'googleapis'

export const dynamic = 'force-dynamic'

async function getValidToken(account: {
  id: string; provider: string; accessToken: string
  refreshToken: string | null; expiresAt: Date | null
}): Promise<string> {
  if (!account.expiresAt || account.expiresAt.getTime() > Date.now() + 5 * 60 * 1000) {
    return account.accessToken
  }
  if (!account.refreshToken) return account.accessToken
  try {
    let newTokens: { access_token: string; expires_in?: number; refresh_token?: string }
    if (account.provider === 'outlook' || account.provider === 'microsoft') {
      newTokens = await refreshOutlookToken(account.refreshToken)
    } else if (account.provider === 'zoho') {
      newTokens = await refreshZohoToken(account.refreshToken)
    } else {
      return account.accessToken
    }
    const expiresAt = newTokens.expires_in ? new Date(Date.now() + newTokens.expires_in * 1000) : null
    await (prisma as any).emailAccount.update({
      where: { id: account.id },
      data: { accessToken: newTokens.access_token, refreshToken: newTokens.refresh_token || account.refreshToken, expiresAt },
    })
    return newTokens.access_token
  } catch {
    return account.accessToken
  }
}

// Supprime de la DB les threads qui ont été mis à la corbeille côté Gmail
async function cleanupGmailTrashed(accountId: string, accessToken: string, refreshToken?: string) {
  try {
    const client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    )
    client.setCredentials({ access_token: accessToken, refresh_token: refreshToken })
    const gmail = google.gmail({ version: 'v1', auth: client })

    // Récupérer les threads récemment mis à la corbeille
    const { data } = await gmail.users.threads.list({
      userId: 'me',
      q: 'in:trash newer_than:30d',
      maxResults: 100,
    })
    const trashedIds = (data.threads || []).map(t => t.id).filter(Boolean) as string[]
    if (trashedIds.length > 0) {
      await (prisma as any).emailThread.deleteMany({
        where: { accountId, threadId: { in: trashedIds } },
      })
    }
  } catch (e) {
    console.warn('Gmail trash cleanup failed:', e)
  }
}

// Supprime de la DB les threads Outlook qui ne sont plus dans l'inbox
async function cleanupOutlookDeleted(accountId: string, currentIds: string[]) {
  if (currentIds.length === 0) return
  // Supprimer les threads en DB qui ne sont PAS dans les 50 derniers messages récupérés
  // (uniquement pour les threads plus anciens que 3 jours pour éviter les faux positifs)
  const cutoff = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  await (prisma as any).emailThread.deleteMany({
    where: {
      accountId,
      threadId: { notIn: currentIds },
      date: { lt: cutoff },
    },
  })
}

export async function GET(request: NextRequest) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const filter = searchParams.get('filter') || 'all'
  const accountFilter = searchParams.get('account') || null
  const sync = searchParams.get('sync') === 'true'

  if (sync) {
    const accounts = await (prisma as any).emailAccount.findMany()

    for (const account of accounts) {
      try {
        const token = await getValidToken(account)

        if (account.provider === 'google') {
          // Sync Gmail unread
          const threads = await listGmailThreads(token, account.refreshToken ?? undefined, 'is:unread newer_than:14d', 30)
          for (const thread of threads) {
            if (!thread.id) continue
            try {
              const detail = await getGmailThread(token, account.refreshToken ?? undefined, thread.id)
              const messages = detail.messages || []
              const last = messages[messages.length - 1]
              if (!last) continue
              const headers = last.payload?.headers || []
              const h = (name: string) =>
                headers.find((x: { name?: string | null }) => x.name?.toLowerCase() === name.toLowerCase())?.value || ''
              const subject = h('Subject') || '(Sans objet)'
              const sender = h('From') || ''
              const date = h('Date') ? new Date(h('Date')) : new Date()
              const snippet = last.snippet || ''
              const labels = last.labelIds || []
              const category = categorizeEmail(sender, subject)
              await (prisma as any).emailThread.upsert({
                where: { accountId_threadId: { accountId: account.id, threadId: thread.id } },
                update: { subject, sender, snippet, date, category, labels, isUnread: labels.includes('UNREAD'), updatedAt: new Date() },
                create: { threadId: thread.id, accountId: account.id, subject, sender, snippet, date, category, labels, isUnread: labels.includes('UNREAD') },
              })
            } catch {}
          }
          // Nettoyer les emails supprimés côté Gmail
          await cleanupGmailTrashed(account.id, token, account.refreshToken ?? undefined)

        } else if (account.provider === 'outlook' || account.provider === 'microsoft') {
          const messages = await listOutlookMessages(token, 50)
          const currentIds: string[] = []
          for (const msg of messages) {
            try {
              const subject = msg.subject || '(Sans objet)'
              const sender = msg.from?.emailAddress?.address
                ? `${msg.from.emailAddress.name || ''} <${msg.from.emailAddress.address}>`.trim()
                : msg.from?.emailAddress?.name || ''
              const date = new Date(msg.receivedDateTime)
              const snippet = msg.bodyPreview || ''
              const labels: string[] = msg.categories || []
              const category = categorizeOutlookEmail(subject, sender, snippet)
              const isUnread = !msg.isRead
              const threadId = msg.conversationId || msg.id
              currentIds.push(threadId)
              await (prisma as any).emailThread.upsert({
                where: { accountId_threadId: { accountId: account.id, threadId } },
                update: { subject, sender, snippet, date, category, labels, isUnread, updatedAt: new Date() },
                create: { threadId, accountId: account.id, subject, sender, snippet, date, category, labels, isUnread },
              })
            } catch {}
          }
          // Nettoyer les emails supprimés côté Outlook
          await cleanupOutlookDeleted(account.id, currentIds)

        } else if (account.provider === 'zoho') {
          const userInfo = await getZohoUserInfo(token)
          if (!userInfo.accountId) continue
          const messages = await listZohoMessages(token, userInfo.accountId, 50)
          for (const msg of messages) {
            try {
              const subject = msg.subject || '(Sans objet)'
              const sender = msg.fromAddress || msg.sender || ''
              const date = msg.receivedTime ? new Date(Number(msg.receivedTime)) : new Date()
              const snippet = msg.summary || msg.content || ''
              const labels: string[] = msg.flagged ? ['flagged'] : []
              const category = categorizeZohoEmail(subject, sender, snippet)
              const isUnread = msg.status === 'unread' || msg.isUnread === true
              const threadId = msg.threadId || msg.messageId || String(msg.mid)
              await (prisma as any).emailThread.upsert({
                where: { accountId_threadId: { accountId: account.id, threadId } },
                update: { subject, sender, snippet, date, category, labels, isUnread, updatedAt: new Date() },
                create: { threadId, accountId: account.id, subject, sender, snippet, date, category, labels, isUnread },
              })
            } catch {}
          }
        }
      } catch (e) {
        console.error(`Sync error for ${account.email} (${account.provider}):`, e)
      }
    }
  }

  // Filtrage
  const where: Record<string, unknown> = {}
  if (filter === 'unread') where.isUnread = true
  if (['urgent', 'important', 'veille', 'loge', 'compta', 'newsletter', 'events'].includes(filter)) {
    where.category = filter
  }
  // Filtre par compte (adresse email)
  if (accountFilter) {
    const acc = await (prisma as any).emailAccount.findFirst({ where: { email: accountFilter } })
    if (acc) where.accountId = acc.id
  }

  const threads = await (prisma as any).emailThread.findMany({
    where,
    include: { account: { select: { id: true, email: true, provider: true, displayName: true } } },
    orderBy: { date: 'desc' },
    take: 150,
  })

  return NextResponse.json(threads)
}
