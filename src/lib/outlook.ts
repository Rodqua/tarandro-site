const MICROSOFT_AUTH_URL = 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize'
const MICROSOFT_TOKEN_URL = 'https://login.microsoftonline.com/common/oauth2/v2.0/token'
const GRAPH_API_BASE = 'https://graph.microsoft.com/v1.0'

export function getOutlookAuthUrl(): string {
  const redirectUri = process.env.MICROSOFT_REDIRECT_URI || 
    `${process.env.NEXTAUTH_URL}/api/mail/connect/outlook/callback`
  const params = new URLSearchParams({
    client_id: process.env.MICROSOFT_CLIENT_ID!,
    response_type: 'code',
    redirect_uri: redirectUri,
    scope: 'https://graph.microsoft.com/Mail.Read https://graph.microsoft.com/User.Read offline_access',
    response_mode: 'query',
    prompt: 'select_account',
  })
  return `${MICROSOFT_AUTH_URL}?${params.toString()}`
}

export async function exchangeOutlookCodeForTokens(code: string) {
  const redirectUri = process.env.MICROSOFT_REDIRECT_URI || 
    `${process.env.NEXTAUTH_URL}/api/mail/connect/outlook/callback`
  const params = new URLSearchParams({
    client_id: process.env.MICROSOFT_CLIENT_ID!,
    client_secret: process.env.MICROSOFT_CLIENT_SECRET!,
    code,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
  })
  const response = await fetch(MICROSOFT_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  })
  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Outlook token exchange failed: ${err}`)
  }
  return response.json()
}

export async function refreshOutlookToken(refreshToken: string) {
  const params = new URLSearchParams({
    client_id: process.env.MICROSOFT_CLIENT_ID!,
    client_secret: process.env.MICROSOFT_CLIENT_SECRET!,
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
  })
  const response = await fetch(MICROSOFT_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  })
  if (!response.ok) throw new Error('Outlook token refresh failed')
  return response.json()
}

export async function getOutlookUserInfo(accessToken: string) {
  const response = await fetch(`${GRAPH_API_BASE}/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!response.ok) throw new Error('Failed to get Outlook user info')
  const data = await response.json()
  return {
    email: data.mail || data.userPrincipalName,
    displayName: data.displayName,
  }
}

export async function listOutlookMessages(accessToken: string, maxResults = 50) {
  const select = 'id,conversationId,subject,bodyPreview,from,receivedDateTime,isRead,categories'
  const url = `${GRAPH_API_BASE}/me/mailFolders/inbox/messages?$top=${maxResults}&$select=${select}&$orderby=receivedDateTime desc`
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!response.ok) throw new Error('Failed to list Outlook messages')
  const data = await response.json()
  return data.value || []
}

export function categorizeOutlookEmail(subject: string, from: string, preview: string): string {
  const text = `${subject} ${from} ${preview}`.toLowerCase()
  if (/facture|invoice|paiement|payment|receipt|reçu/.test(text)) return 'compta'
  if (/newsletter|unsubscribe|désabonner|no-reply|noreply|donotreply/.test(text)) return 'newsletter'
  if (/conférence|webinar|webinaire|event|événement|invitation|meetup/.test(text)) return 'events'
  if (/veille|digest|weekly|monthly|résumé|summary/.test(text)) return 'veille'
  return 'important'
}

// ---- Nouvelles fonctions reply / delete ----

export async function getOutlookMessage(accessToken: string, messageId: string) {
  const response = await fetch(`${GRAPH_API_BASE}/me/messages/${messageId}?$select=id,subject,body,from,toRecipients,receivedDateTime,isRead`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!response.ok) throw new Error('Failed to get Outlook message')
  return response.json()
}

export async function replyToOutlookMessage(
  accessToken: string,
  messageId: string,
  body: string
) {
  const response = await fetch(`${GRAPH_API_BASE}/me/messages/${messageId}/reply`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      comment: body,
    }),
  })
  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Outlook reply failed: ${err}`)
  }
}

export async function deleteOutlookMessage(accessToken: string, messageId: string) {
  const response = await fetch(`${GRAPH_API_BASE}/me/messages/${messageId}/move`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ destinationId: 'deleteditems' }),
  })
  if (!response.ok) throw new Error('Outlook delete failed')
}

export async function markOutlookMessageRead(accessToken: string, messageId: string) {
  await fetch(`${GRAPH_API_BASE}/me/messages/${messageId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ isRead: true }),
  })
}
