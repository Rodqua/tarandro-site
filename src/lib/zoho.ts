// Zoho EU par défaut — modifier si le compte est sur .com ou .in
const ZOHO_AUTH_URL = 'https://accounts.zoho.eu/oauth/v2/auth'
const ZOHO_TOKEN_URL = 'https://accounts.zoho.eu/oauth/v2/token'
const ZOHO_API_BASE = 'https://mail.zoho.eu/api'

export function getZohoAuthUrl(): string {
  const redirectUri = process.env.ZOHO_REDIRECT_URI ||
    `${process.env.NEXTAUTH_URL}/api/mail/connect/zoho/callback`
  const params = new URLSearchParams({
    client_id: process.env.ZOHO_CLIENT_ID!,
    response_type: 'code',
    redirect_uri: redirectUri,
    scope: 'ZohoMail.messages.READ,ZohoMail.accounts.READ',
    access_type: 'offline',
    prompt: 'consent',
  })
  return `${ZOHO_AUTH_URL}?${params.toString()}`
}

export async function exchangeZohoCodeForTokens(code: string) {
  const redirectUri = process.env.ZOHO_REDIRECT_URI ||
    `${process.env.NEXTAUTH_URL}/api/mail/connect/zoho/callback`
  const params = new URLSearchParams({
    client_id: process.env.ZOHO_CLIENT_ID!,
    client_secret: process.env.ZOHO_CLIENT_SECRET!,
    code,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
  })
  const response = await fetch(ZOHO_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  })
  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Zoho token exchange failed: ${err}`)
  }
  return response.json()
}

export async function refreshZohoToken(refreshToken: string) {
  const params = new URLSearchParams({
    client_id: process.env.ZOHO_CLIENT_ID!,
    client_secret: process.env.ZOHO_CLIENT_SECRET!,
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
  })
  const response = await fetch(ZOHO_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  })
  if (!response.ok) throw new Error('Zoho token refresh failed')
  return response.json()
}

export async function getZohoUserInfo(accessToken: string) {
  const response = await fetch(`${ZOHO_API_BASE}/accounts`, {
    headers: { Authorization: `Zoho-oauthtoken ${accessToken}` },
  })
  if (!response.ok) throw new Error('Failed to get Zoho user info')
  const data = await response.json()
  const account = data.data?.[0]
  return {
    email: account?.emailAddress || account?.mailId,
    displayName: account?.displayName || account?.firstName,
    accountId: account?.accountId,
  }
}

export async function listZohoMessages(accessToken: string, accountId: string, maxResults = 50) {
  const url = `${ZOHO_API_BASE}/accounts/${accountId}/messages/view?limit=${maxResults}&sortBy=date&sortOrder=desc&folder=INBOX`
  const response = await fetch(url, {
    headers: { Authorization: `Zoho-oauthtoken ${accessToken}` },
  })
  if (!response.ok) throw new Error('Failed to list Zoho messages')
  const data = await response.json()
  return data.data || []
}

export function categorizeZohoEmail(subject: string, from: string, summary: string): string {
  const text = `${subject} ${from} ${summary}`.toLowerCase()
  if (/facture|invoice|paiement|payment|receipt|reçu/.test(text)) return 'compta'
  if (/newsletter|unsubscribe|désabonner|no-reply|noreply|donotreply/.test(text)) return 'newsletter'
  if (/conférence|webinar|webinaire|event|événement|invitation|meetup/.test(text)) return 'events'
  if (/veille|digest|weekly|monthly|résumé|summary/.test(text)) return 'veille'
  return 'important'
}

// ---- Nouvelles fonctions reply / delete ----

export async function getZohoMessage(accessToken: string, accountId: string, messageId: string) {
  const response = await fetch(`${ZOHO_API_BASE}/accounts/${accountId}/messages/${messageId}/content`, {
    headers: { Authorization: `Zoho-oauthtoken ${accessToken}` },
  })
  if (!response.ok) throw new Error('Failed to get Zoho message')
  return response.json()
}

export async function replyToZohoMessage(
  accessToken: string,
  accountId: string,
  messageId: string,
  to: string,
  subject: string,
  body: string
) {
  const replySubject = subject.startsWith('Re:') ? subject : `Re: ${subject}`
  const response = await fetch(`${ZOHO_API_BASE}/accounts/${accountId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Zoho-oauthtoken ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fromAddress: accountId,
      toAddress: to,
      subject: replySubject,
      content: body,
      mailFormat: 'plaintext',
      inReplyTo: messageId,
    }),
  })
  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Zoho reply failed: ${err}`)
  }
  return response.json()
}

export async function deleteZohoMessage(accessToken: string, accountId: string, messageId: string) {
  const response = await fetch(`${ZOHO_API_BASE}/accounts/${accountId}/messages/${messageId}`, {
    method: 'DELETE',
    headers: { Authorization: `Zoho-oauthtoken ${accessToken}` },
  })
  if (!response.ok) throw new Error('Zoho delete failed')
}

export async function markZohoMessageRead(accessToken: string, accountId: string, messageId: string) {
  await fetch(`${ZOHO_API_BASE}/accounts/${accountId}/updatemessage`, {
    method: 'PUT',
    headers: {
      Authorization: `Zoho-oauthtoken ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ mode: 'markAsRead', messageId }),
  })
}
