import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { google } from 'googleapis'
import { listAllGmailThreadIds, getGmailThread, categorizeEmail } from '@/lib/gmail'
import { listOutlookMessages, categorizeOutlookEmail, refreshOutlookToken } from '@/lib/outlook'
import { listZohoMessages, getZohoUserInfo, categorizeZohoEmail, refreshZohoToken } from '@/lib/zoho'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

function applyFilterRules(
  sender: string,
  subject: string,
  rules: Array<{ field: string; pattern: string; category: string }>
): string | null {
  for (const rule of rules) {
    try {
      const regex = new RegExp(rule.pattern, 'i')
      const haystack = rule.field === 'sender' ? sender : subject
      if (regex.test(haystack)) return rule.category
    } catch { /* pattern invalide */ }
  }
  return null
}

async function getValidToken(account: any): Promise<string> {
  const isExpired = !account.expiresAt || new Date(account.expiresAt).getTime() < Date.now() + 60_000
  if (!isExpired || !account.refreshToken) return account.accessToken
  try {
    if (account.provider === 'google') {
      const client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET)
      client.setCredentials({ access_token: account.accessToken, refresh_token: account.refreshToken })
      const { credentials } = await client.refreshAccessToken()
      if (credentials.access_token) {
        await (prisma as any).emailAccount.update({ where: { id: account.id }, data: { accessToken: credentials.access_token, ...(credentials.expiry_date ? { expiresAt: new Date(credentials.expiry_date) } : {}) } })
        return credentials.access_token
      }
    } else if (account.provider === 'outlook' || account.provider === 'microsoft') {
      const t = await refreshOutlookToken(account.refreshToken)
      await (prisma as any).emailAccount.update({ where: { id: account.id }, data: { accessToken: t.access_token, ...(t.refresh_token ? { refreshToken: t.refresh_token } : {}), ...(t.expires_in ? { expiresAt: new Date(Date.now() + t.expires_in * 1000) } : {}) } })
      return t.access_token
    } else if (account.provider === 'zoho') {
      const t = await refreshZohoToken(account.refreshToken)
      await (prisma as any).emailAccount.update({ where: { id: account.id }, data: { accessToken: t.access_token, ...(t.expires_in ? { expiresAt: new Date(Date.now() + t.expires_in * 1000) } : {}) } })
      return t.access_token
    }
  } catch (e) { console.warn('Token refresh failed:', e) }
  return account.accessToken
}

export async function GET(request: NextRequest) {
  // Vérification du secret cron
  const secret = request.headers.get('authorization')?.replace('Bearer ', '')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const accounts = await (prisma as any).emailAccount.findMany()
  const filterRules = await (prisma as any).filterRule.findMany({
    orderBy: { priority: 'desc' },
    select: { field: true, pattern: true, category: true },
  })

  const results: Record<string, { new: number; errors: string[] }> = {}

  for (const account of accounts) {
    const res = { new: 0, errors: [] as string[] }
    results[account.email] = res
    try {
      const token = await getValidToken(account)

      if (account.provider === 'google') {
        const allIds = await listAllGmailThreadIds(token, account.refreshToken ?? undefined, '-in:spam -in:trash', 100)
        const existing = await (prisma as any).emailThread.findMany({ where: { accountId: account.id, threadId: { in: allIds } }, select: { threadId: true } })
        const existingSet = new Set(existing.map((r: any) => r.threadId))
        const newIds = allIds.filter((id: string) => !existingSet.has(id))
        const BATCH = 25
        for (let i = 0; i < newIds.length; i += BATCH) {
          await Promise.allSettled(newIds.slice(i, i + BATCH).map(async (threadId: string) => {
            try {
              const detail = await getGmailThread(token, account.refreshToken ?? undefined, threadId)
              const last = (detail.messages || []).slice(-1)[0]
              if (!last) return
              const h = (n: string) => (last.payload?.headers || []).find((x: any) => x.name?.toLowerCase() === n.toLowerCase())?.value || ''
              const subject = h('Subject') || '(Sans objet)'
              const sender = h('From') || ''
              const date = h('Date') ? new Date(h('Date')) : new Date()
              const category = applyFilterRules(sender, subject, filterRules) ?? categorizeEmail(sender, subject)
              await (prisma as any).emailThread.create({ data: { threadId, accountId: account.id, subject, sender, snippet: last.snippet || '', date, category, labels: last.labelIds || [], isUnread: (last.labelIds || []).includes('UNREAD') } })
              res.new++
            } catch {}
          }))
        }

      } else if (account.provider === 'outlook' || account.provider === 'microsoft') {
        const messages = await listOutlookMessages(token, 100)
        const ids = messages.map((m: any) => m.conversationId || m.id).filter(Boolean)
        const existing = await (prisma as any).emailThread.findMany({ where: { accountId: account.id, threadId: { in: ids } }, select: { threadId: true } })
        const existingSet = new Set(existing.map((r: any) => r.threadId))
        const newMsgs = messages.filter((m: any) => !existingSet.has(m.conversationId || m.id))
        await Promise.allSettled(newMsgs.map(async (msg: any) => {
          try {
            const subject = msg.subject || '(Sans objet)'
            const sender = msg.from?.emailAddress?.address ? `${msg.from.emailAddress.name || ''} <${msg.from.emailAddress.address}>`.trim() : ''
            const category = applyFilterRules(sender, subject, filterRules) ?? categorizeOutlookEmail(subject, sender, msg.bodyPreview || '')
            await (prisma as any).emailThread.create({ data: { threadId: msg.conversationId || msg.id, messageId: msg.id, accountId: account.id, subject, sender, snippet: msg.bodyPreview || '', date: new Date(msg.receivedDateTime), category, labels: msg.categories || [], isUnread: !msg.isRead, attachmentCount: msg.hasAttachments ? 1 : 0 } })
            res.new++
          } catch {}
        }))

      } else if (account.provider === 'zoho') {
        const userInfo = await getZohoUserInfo(token)
        if (!userInfo.accountId) continue
        const messages = await listZohoMessages(token, userInfo.accountId, 50)
        const ids = messages.map((m: any) => m.threadId || m.messageId || String(m.mid)).filter(Boolean)
        const existing = await (prisma as any).emailThread.findMany({ where: { accountId: account.id, threadId: { in: ids } }, select: { threadId: true } })
        const existingSet = new Set(existing.map((r: any) => r.threadId))
        const newMsgs = messages.filter((m: any) => !existingSet.has(m.threadId || m.messageId || String(m.mid)))
        await Promise.allSettled(newMsgs.map(async (msg: any) => {
          try {
            const subject = msg.subject || '(Sans objet)'
            const sender = msg.fromAddress || msg.sender || ''
            const category = applyFilterRules(sender, subject, filterRules) ?? categorizeZohoEmail(subject, sender, msg.summary || '')
            const threadId = msg.threadId || msg.messageId || String(msg.mid)
            await (prisma as any).emailThread.create({ data: { threadId, messageId: msg.messageId || String(msg.mid), accountId: account.id, subject, sender, snippet: msg.summary || '', date: msg.receivedTime ? new Date(Number(msg.receivedTime)) : new Date(), category, labels: msg.flagged ? ['flagged'] : [], isUnread: msg.status === 'unread' || msg.isUnread === true, attachmentCount: msg.hasAttachment ? 1 : 0 } })
            res.new++
          } catch {}
        }))
      }
    } catch (e: any) {
      res.errors.push(e?.message || 'Erreur inconnue')
    }
  }

  console.log('[cron/sync] résultats:', JSON.stringify(results))
  return NextResponse.json({ ok: true, results })
}
