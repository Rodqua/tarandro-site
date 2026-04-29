import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { google } from 'googleapis'
import { refreshOutlookToken } from '@/lib/outlook'
import { refreshZohoToken } from '@/lib/zoho'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

// ── Token helpers ──────────────────────────────────────────────────────────────

function buildOAuth2() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI || 'https://tarandro.org/api/mail/connect/callback'
  )
}

async function freshGoogleToken(account: any): Promise<string> {
  const isExpired = !account.expiresAt || new Date(account.expiresAt) <= new Date()
  if (!isExpired) return account.accessToken
  const oauth2 = buildOAuth2()
  oauth2.setCredentials({ access_token: account.accessToken, refresh_token: account.refreshToken })
  const { credentials } = await oauth2.refreshAccessToken()
  await (prisma as any).emailAccount.update({
    where: { id: account.id },
    data: { accessToken: credentials.access_token, expiresAt: credentials.expiry_date ? new Date(credentials.expiry_date) : null },
  })
  return credentials.access_token as string
}

async function freshOutlookToken(account: any): Promise<string> {
  const isExpired = !account.expiresAt || new Date(account.expiresAt) <= new Date()
  if (!isExpired) return account.accessToken
  const data = await refreshOutlookToken(account.refreshToken)
  const newExpiry = data.expires_in ? new Date(Date.now() + data.expires_in * 1000) : null
  await (prisma as any).emailAccount.update({
    where: { id: account.id },
    data: { accessToken: data.access_token, expiresAt: newExpiry },
  })
  return data.access_token
}

async function freshZohoToken(account: any): Promise<string> {
  const isExpired = !account.expiresAt || new Date(account.expiresAt) <= new Date()
  if (!isExpired) return account.accessToken
  const data = await refreshZohoToken(account.refreshToken)
  if (data.error) throw new Error(`Zoho refresh: ${data.error}`)
  const newExpiry = data.expires_in ? new Date(Date.now() + data.expires_in * 1000) : null
  await (prisma as any).emailAccount.update({
    where: { id: account.id },
    data: { accessToken: data.access_token, expiresAt: newExpiry },
  })
  return data.access_token
}

// ── Zoho domain helper ────────────────────────────────────────────────────────

function getZohoApiBase() {
  const r = process.env.ZOHO_REGION || 'eu'
  const domain = r === 'com' ? 'zoho.com' : r === 'in' ? 'zoho.in' : r === 'com.au' ? 'zoho.com.au' : 'zoho.eu'
  return `https://mail.${domain}/api`
}

// ── Email collectors ──────────────────────────────────────────────────────────

interface EmailSample {
  provider: string
  account: string
  from: string
  subject: string
  snippet: string
}

async function collectGmail(account: any, limit: number): Promise<EmailSample[]> {
  const token = await freshGoogleToken(account)
  const oauth2 = buildOAuth2()
  oauth2.setCredentials({ access_token: token })
  const gmail = google.gmail({ version: 'v1', auth: oauth2 })

  const listRes = await gmail.users.threads.list({ userId: 'me', q: '-in:spam -in:trash', maxResults: limit })
  const threadIds = (listRes.data.threads || []).map((t: any) => t.id).filter(Boolean)

  const results: EmailSample[] = []
  // Batch in groups of 10
  for (let i = 0; i < threadIds.length; i += 10) {
    const batch = threadIds.slice(i, i + 10)
    const details = await Promise.all(
      batch.map((id: string) =>
        gmail.users.threads.get({ userId: 'me', id, format: 'metadata', metadataHeaders: ['From', 'Subject'] })
          .then(r => r.data).catch(() => null)
      )
    )
    for (const thread of details) {
      if (!thread) continue
      const msg = thread.messages?.[0]
      if (!msg) continue
      const headers = Object.fromEntries((msg.payload?.headers || []).map((h: any) => [h.name, h.value]))
      results.push({
        provider: 'gmail',
        account: account.email,
        from: headers['From'] || '',
        subject: headers['Subject'] || '',
        snippet: msg.snippet || '',
      })
    }
  }
  return results
}

async function collectOutlook(account: any, limit: number): Promise<EmailSample[]> {
  const token = await freshOutlookToken(account)
  const res = await fetch(
    `https://graph.microsoft.com/v1.0/me/messages?$select=subject,from,bodyPreview&$top=${Math.min(limit, 50)}&$orderby=receivedDateTime desc`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  if (!res.ok) throw new Error(`Outlook: ${await res.text()}`)
  const data = await res.json()
  return (data.value || []).map((m: any) => ({
    provider: 'outlook',
    account: account.email,
    from: m.from?.emailAddress ? `${m.from.emailAddress.name} <${m.from.emailAddress.address}>` : '',
    subject: m.subject || '',
    snippet: m.bodyPreview || '',
  }))
}

async function collectZoho(account: any, limit: number): Promise<EmailSample[]> {
  const token = await freshZohoToken(account)
  const apiBase = getZohoApiBase()

  // Get zoho account id
  const accRes = await fetch(`${apiBase}/accounts`, { headers: { Authorization: `Zoho-oauthtoken ${token}` } })
  if (!accRes.ok) throw new Error(`Zoho accounts: ${await accRes.text()}`)
  const accData = await accRes.json()
  const zohoAccounts = accData.data || []
  const primary = zohoAccounts.find((a: any) => a.isPrimary) || zohoAccounts[0]
  if (!primary) throw new Error('No Zoho account found')

  const msgsRes = await fetch(
    `${apiBase}/accounts/${primary.accountId}/messages/view?limit=${Math.min(limit, 200)}&start=0&sortby=date&order=desc`,
    { headers: { Authorization: `Zoho-oauthtoken ${token}` } }
  )
  if (!msgsRes.ok) throw new Error(`Zoho messages: ${await msgsRes.text()}`)
  const msgsData = await msgsRes.json()
  return (msgsData.data || []).map((m: any) => {
    const fromAddr = Array.isArray(m.fromAddress) ? (m.fromAddress[0]?.address || m.fromAddress[0] || '') : (m.fromAddress || '')
    return {
      provider: 'zoho',
      account: account.email,
      from: m.fromName ? `${m.fromName} <${fromAddr}>` : fromAddr,
      subject: m.subject || '',
      snippet: m.summary || '',
    }
  })
}

// ── Claude clustering ─────────────────────────────────────────────────────────

async function clusterWithClaude(emails: EmailSample[], minClusterSize = 3) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY manquante')

  const emailsText = emails
    .map((e, i) => `[${i + 1}] FROM: ${e.from}\n    SUBJECT: ${e.subject}\n    SNIPPET: ${e.snippet.slice(0, 100)}`)
    .join('\n\n')

  const systemPrompt = `Tu es un expert en analyse d'emails et création de filtres Gmail.
Groupe les emails en clusters sémantiques et propose des actions de filtrage pour chaque cluster.
Ne crée des clusters qu'avec au moins ${minClusterSize} emails.
Réponds UNIQUEMENT avec du JSON valide, sans markdown.`

  const userPrompt = `Voici ${emails.length} emails provenant de plusieurs comptes (Gmail, Outlook, Zoho). Analyse et groupe-les :

${emailsText}

Réponds avec un tableau JSON de clusters :
[{
  "name": "Nom du cluster",
  "pattern": "Ce qui les unit (ex: domaine @substack.com)",
  "emails": [1, 5, 12],
  "senderDomains": ["substack.com"],
  "keywords": ["newsletter"],
  "suggestedAction": {
    "label": "Newsletters",
    "archive": true,
    "markRead": false
  },
  "reason": "Pourquoi ces emails sont groupés"
}]

Retourne UNIQUEMENT le tableau JSON.`

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-opus-4-6',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  })

  if (!res.ok) throw new Error(`Claude API: ${await res.text()}`)
  const data = await res.json()
  const raw = (data.content?.[0]?.text || '').trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '')

  const clusters = JSON.parse(raw)
  if (!Array.isArray(clusters)) throw new Error('Claude response is not an array')

  return clusters.map((c: any) => ({
    ...c,
    emailSamples: (c.emails || []).map((idx: number) => emails[idx - 1]).filter(Boolean),
  }))
}

// ── Apply Gmail filters ───────────────────────────────────────────────────────

async function applyGmailFilter(account: any, cluster: any) {
  const token = await freshGoogleToken(account)
  const oauth2 = buildOAuth2()
  oauth2.setCredentials({ access_token: token })
  const gmail = google.gmail({ version: 'v1', auth: oauth2 })

  // Build criteria from sender domains
  const from = (cluster.senderDomains || []).map((d: string) => (d.includes('@') ? d : `@${d}`)).join(' OR ')
  if (!from && !cluster.keywords?.length) return { status: 'skipped', reason: 'Pas de critère' }

  const criteria: any = {}
  if (from) criteria.from = from
  else if (cluster.keywords?.length) criteria.subject = cluster.keywords.slice(0, 3).join(' ')

  // Resolve or create label
  const action: any = {}
  if (cluster.suggestedAction?.label) {
    const labelsRes = await gmail.users.labels.list({ userId: 'me' })
    const labels = labelsRes.data.labels || []
    let labelId = labels.find((l: any) => l.name.toLowerCase() === cluster.suggestedAction.label.toLowerCase())?.id
    if (!labelId) {
      const created = await gmail.users.labels.create({
        userId: 'me',
        requestBody: { name: cluster.suggestedAction.label, labelListVisibility: 'labelShow', messageListVisibility: 'show' },
      })
      labelId = created.data.id
    }
    action.addLabelIds = [labelId]
  }
  if (cluster.suggestedAction?.archive) action.removeLabelIds = [...(action.removeLabelIds || []), 'INBOX']
  if (cluster.suggestedAction?.markRead) action.removeLabelIds = [...(action.removeLabelIds || []), 'UNREAD']

  const created = await gmail.users.settings.filters.create({
    userId: 'me',
    requestBody: { criteria, action },
  })

  return { status: 'created', gmailFilterId: created.data.id }
}

// ── Main handler ──────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { limit = 50, apply = false, clusterIndex } = await request.json()

  // Load all accounts
  const accounts = await (prisma as any).emailAccount.findMany({
    select: { id: true, email: true, provider: true, accessToken: true, refreshToken: true, expiresAt: true, metadata: true },
  })

  const googleAccounts = accounts.filter((a: any) => a.provider === 'google')
  const microsoftAccounts = accounts.filter((a: any) => a.provider === 'microsoft')
  const zohoAccounts = accounts.filter((a: any) => a.provider === 'zoho')

  const allEmails: EmailSample[] = []
  const errors: string[] = []
  const providerCounts: Record<string, number> = {}

  // Collect from all providers
  for (const acc of googleAccounts) {
    try {
      const emails = await collectGmail(acc, limit)
      allEmails.push(...emails)
      providerCounts['gmail'] = (providerCounts['gmail'] || 0) + emails.length
    } catch (e: any) {
      errors.push(`Gmail ${acc.email}: ${e.message}`)
    }
  }

  for (const acc of microsoftAccounts) {
    try {
      const emails = await collectOutlook(acc, limit)
      allEmails.push(...emails)
      providerCounts['outlook'] = (providerCounts['outlook'] || 0) + emails.length
    } catch (e: any) {
      errors.push(`Outlook ${acc.email}: ${e.message}`)
    }
  }

  for (const acc of zohoAccounts) {
    try {
      const emails = await collectZoho(acc, limit)
      allEmails.push(...emails)
      providerCounts['zoho'] = (providerCounts['zoho'] || 0) + emails.length
    } catch (e: any) {
      errors.push(`Zoho ${acc.email}: ${e.message}`)
    }
  }

  if (allEmails.length === 0) {
    return NextResponse.json({ error: 'Aucun email collecté', errors }, { status: 422 })
  }

  // Cluster with Claude
  let clusters: any[]
  try {
    clusters = await clusterWithClaude(allEmails)
  } catch (e: any) {
    return NextResponse.json({ error: `Claude: ${e.message}` }, { status: 500 })
  }

  // If apply=true and clusterIndex provided: apply that specific cluster to all Gmail accounts
  if (apply && typeof clusterIndex === 'number') {
    const cluster = clusters[clusterIndex]
    if (!cluster) return NextResponse.json({ error: 'Cluster introuvable' }, { status: 404 })

    const applyResults = []
    for (const acc of googleAccounts) {
      try {
        const result = await applyGmailFilter(acc, cluster)
        applyResults.push({ account: acc.email, ...result })
      } catch (e: any) {
        applyResults.push({ account: acc.email, status: 'error', reason: e.message })
      }
    }
    return NextResponse.json({ clusters, applyResults, providerCounts, errors })
  }

  return NextResponse.json({ clusters, providerCounts, totalEmails: allEmails.length, errors })
}
