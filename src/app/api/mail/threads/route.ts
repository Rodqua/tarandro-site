import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { listGmailThreads, listAllGmailThreadIds, getGmailThread, categorizeEmail } from '@/lib/gmail'
import { listOutlookMessages, categorizeOutlookEmail, refreshOutlookToken } from '@/lib/outlook'
import { listZohoMessages, getZohoUserInfo, categorizeZohoEmail, refreshZohoToken } from '@/lib/zoho'
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

// Supprime de la DB les threads Gmail mis à la corbeille ou supprimés côté provider
async function cleanupGmailTrashed(accountId: string, accessToken: string, refreshToken?: string) {
  try {
    // Récupérer les IDs en corbeille récents
    const trashed = await listGmailThreads(accessToken, refreshToken, 'in:trash newer_than:30d', 100)
    // Récupérer aussi les supprimés définitivement (dans Bin)
    const deleted = await listGmailThreads(accessToken, refreshToken, 'in:spam newer_than:14d', 50)
    
    const idsToRemove = [
      ...trashed.map(t => t.id),
      ...deleted.map(t => t.id),
    ].filter(Boolean) as string[]

    if (idsToRemove.length > 0) {
      await (prisma as any).emailThread.deleteMany({
        where: { accountId, threadId: { in: idsToRemove } },
      })
    }

    // Supprimer aussi les threads lus depuis plus de 30 jours (nettoyage général)
    const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    await (prisma as any).emailThread.deleteMany({
      where: { accountId, isUnread: false, date: { lt: cutoff } },
    })
  } catch (e) {
    console.warn('Gmail cleanup failed:', e)
  }
}

// Supprime de la DB les threads Outlook qui ne sont plus dans l'inbox
async function cleanupOutlookDeleted(accountId: string, currentIds: string[], accessToken: string) {
  // Supprimer threads absents de la dernière sync et plus anciens que 7 jours
  const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  await (prisma as any).emailThread.deleteMany({
    where: {
      accountId,
      threadId: { notIn: currentIds },
      date: { lt: cutoff },
    },
  })

  // Vérifier aussi le dossier Deleted Items
  try {
    const url = 'https://graph.microsoft.com/v1.0/me/mailFolders/deleteditems/messages?$top=50&$select=id,conversationId'
    const res = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } })
    if (res.ok) {
      const data = await res.json()
      const deletedIds = (data.value || []).map((m: any) => m.conversationId || m.id)
      if (deletedIds.length > 0) {
        await (prisma as any).emailThread.deleteMany({
          where: { accountId, threadId: { in: deletedIds } },
        })
      }
    }
  } catch (e) {
    console.warn('Outlook deleted items cleanup failed:', e)
  }
}

export async function GET(request: NextRequest) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const filter = searchParams.get('filter') || 'all'
  const accountFilter = searchParams.get('account') || null
  const sync = searchParams.get('sync') === 'true'
  const skip = parseInt(searchParams.get('skip') || '0', 10)
  const take = parseInt(searchParams.get('take') || '50', 10)

  if (sync) {
    const accounts = await (prisma as any).emailAccount.findMany()

    for (const account of accounts) {
      try {
        const token = await getValidToken(account)

        if (account.provider === 'google') {
          // 1. Récupère TOUS les IDs via pagination (sans date limite, sans spam/trash)
          const allIds = await listAllGmailThreadIds(
            token,
            account.refreshToken ?? undefined,
            '-in:spam -in:trash',
            500
          )

          // 2. Quels IDs sont déjà en DB ? On ne re-fetch que les nouveaux
          const existingRows = await (prisma as any).emailThread.findMany({
            where: { accountId: account.id, threadId: { in: allIds } },
            select: { threadId: true },
          })
          const existingSet = new Set(existingRows.map((r: any) => r.threadId))
          const newIds = allIds.filter((id: string) => !existingSet.has(id))

          // 3. Fetch les détails uniquement pour les nouveaux threads, par batches de 10
          const BATCH = 10
          for (let i = 0; i < newIds.length; i += BATCH) {
            const batch = newIds.slice(i, i + BATCH)
            await Promise.allSettled(batch.map(async (threadId: string) => {
              try {
                const detail = await getGmailThread(token, account.refreshToken ?? undefined, threadId)
                const messages = detail.messages || []
                const last = messages[messages.length - 1]
                if (!last) return
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
                  where: { accountId_threadId: { accountId: account.id, threadId } },
                  update: { subject, sender, snippet, date, category, labels, isUnread: labels.includes('UNREAD'), updatedAt: new Date() },
                  create: { threadId, accountId: account.id, subject, sender, snippet, date, category, labels, isUnread: labels.includes('UNREAD') },
                })
              } catch {}
            }))
          }

          // 4. Nettoyer les emails mis à la corbeille côté Gmail
          await cleanupGmailTrashed(account.id, token, account.refreshToken ?? undefined)

        } else if (account.provider === 'outlook' || account.provider === 'microsoft') {
          const messages = await listOutlookMessages(token, 500)
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
              const messageId = msg.id  // ID réel du message pour delete/reply
              currentIds.push(threadId)
              await (prisma as any).emailThread.upsert({
                where: { accountId_threadId: { accountId: account.id, threadId } },
                update: { subject, sender, snippet, date, category, labels, isUnread, messageId, updatedAt: new Date() },
                create: { threadId, messageId, accountId: account.id, subject, sender, snippet, date, category, labels, isUnread },
              })
            } catch {}
          }
          // Nettoyer les emails supprimés côté Outlook
          await cleanupOutlookDeleted(account.id, currentIds, token)

        } else if (account.provider === 'zoho') {
          const userInfo = await getZohoUserInfo(token)
          if (!userInfo.accountId) continue
          const messages = await listZohoMessages(token, userInfo.accountId, 200)
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
              const messageId = msg.messageId || String(msg.mid)
              await (prisma as any).emailThread.upsert({
                where: { accountId_threadId: { accountId: account.id, threadId } },
                update: { subject, sender, snippet, date, category, labels, isUnread, messageId, updatedAt: new Date() },
                create: { threadId, messageId, accountId: account.id, subject, sender, snippet, date, category, labels, isUnread },
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

  const [threads, total] = await Promise.all([
    (prisma as any).emailThread.findMany({
      where,
      include: { account: { select: { id: true, email: true, provider: true, displayName: true } } },
      orderBy: { date: 'desc' },
      skip,
      take,
    }),
    (prisma as any).emailThread.count({ where }),
  ])

  return NextResponse.json({ threads, total, skip, take })
}
