// ─── src/outlook-client.js ────────────────────────────────────────────────────
// Microsoft Graph API wrapper — fetches Outlook/Hotmail emails.
// Token refresh mirrors the logic in src/lib/outlook.ts of the Next.js app.
// ──────────────────────────────────────────────────────────────────────────────

import { config } from '../config.js';
import { loadAccounts, updateToken } from './db.js';

const MICROSOFT_TOKEN_URL = 'https://login.microsoftonline.com/common/oauth2/v2.0/token';
const GRAPH_API_BASE = 'https://graph.microsoft.com/v1.0';

async function getFreshToken(account) {
  const isExpired = !account.expiresAt || new Date(account.expiresAt) <= new Date();
  if (!isExpired) return account.accessToken;

  if (!config.microsoft.clientId || !config.microsoft.clientSecret) {
    throw new Error('MICROSOFT_CLIENT_ID / MICROSOFT_CLIENT_SECRET not set in .env');
  }

  const params = new URLSearchParams({
    client_id: config.microsoft.clientId,
    client_secret: config.microsoft.clientSecret,
    refresh_token: account.refreshToken,
    grant_type: 'refresh_token',
  });

  const res = await fetch(MICROSOFT_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });
  if (!res.ok) throw new Error(`Outlook token refresh failed: ${await res.text()}`);
  const data = await res.json();
  const newToken = data.access_token;
  const newExpiry = data.expires_in
    ? new Date(Date.now() + data.expires_in * 1000).toISOString()
    : null;
  await updateToken(account.id, newToken, newExpiry);
  return newToken;
}

export async function loadOutlookAccounts() {
  return loadAccounts('microsoft');
}

/** Fetch recent messages from Outlook — returns thread-like objects */
export async function fetchOutlookMessages(account, { maxTotal = 50 } = {}) {
  const token = await getFreshToken(account);
  const results = [];
  let url = `${GRAPH_API_BASE}/me/messages?$select=id,conversationId,subject,from,toRecipients,bodyPreview,receivedDateTime&$top=50&$orderby=receivedDateTime desc`;

  while (url && results.length < maxTotal) {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error(`Outlook messages failed: ${await res.text()}`);
    const data = await res.json();
    const messages = data.value || [];

    for (const msg of messages) {
      results.push({
        threadId: msg.conversationId || msg.id,
        provider: 'microsoft',
        account: account.email,
        messageCount: 1,
        snippet: msg.bodyPreview || '',
        from: msg.from?.emailAddress
          ? `${msg.from.emailAddress.name} <${msg.from.emailAddress.address}>`
          : '',
        to: (msg.toRecipients || [])
          .map(r => r.emailAddress?.address || '')
          .join(', '),
        subject: msg.subject || '(no subject)',
        date: msg.receivedDateTime || '',
      });
      if (results.length >= maxTotal) break;
    }

    url = results.length < maxTotal ? data['@odata.nextLink'] : null;
  }

  return results.slice(0, maxTotal);
}
