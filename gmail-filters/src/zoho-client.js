// ─── src/zoho-client.js ───────────────────────────────────────────────────────
// Zoho Mail API wrapper — fetches Zoho emails.
// Token refresh mirrors the logic in src/lib/zoho.ts of the Next.js app.
// ──────────────────────────────────────────────────────────────────────────────

import { config } from '../config.js';
import { loadAccounts, updateToken } from './db.js';

function getZohoDomain() {
  const r = config.zoho.region || 'eu';
  if (r === 'com') return 'zoho.com';
  if (r === 'in') return 'zoho.in';
  if (r === 'com.au') return 'zoho.com.au';
  return 'zoho.eu';
}
function getZohoTokenUrl() {
  return `https://accounts.${getZohoDomain()}/oauth/v2/token`;
}
function getZohoApiBase() {
  return `https://mail.${getZohoDomain()}/api`;
}

async function getFreshToken(account) {
  const isExpired = !account.expiresAt || new Date(account.expiresAt) <= new Date();
  if (!isExpired) return account.accessToken;

  if (!config.zoho.clientId || !config.zoho.clientSecret) {
    throw new Error('ZOHO_CLIENT_ID / ZOHO_CLIENT_SECRET not set in .env');
  }

  const params = new URLSearchParams({
    client_id: config.zoho.clientId,
    client_secret: config.zoho.clientSecret,
    refresh_token: account.refreshToken,
    grant_type: 'refresh_token',
  });

  const res = await fetch(getZohoTokenUrl(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });
  if (!res.ok) throw new Error(`Zoho token refresh failed: ${await res.text()}`);
  const data = await res.json();
  if (data.error) throw new Error(`Zoho token refresh error: ${data.error}`);

  const newToken = data.access_token;
  const newExpiry = data.expires_in
    ? new Date(Date.now() + data.expires_in * 1000).toISOString()
    : null;
  await updateToken(account.id, newToken, newExpiry);
  return newToken;
}

/** Extract the Zoho account ID from stored metadata or fetch it */
async function getZohoAccountId(account, token) {
  // Metadata may store zohoAccountId from the connect flow
  if (account.metadata?.zohoAccountId) return account.metadata.zohoAccountId;

  const res = await fetch(`${getZohoApiBase()}/accounts`, {
    headers: { Authorization: `Zoho-oauthtoken ${token}` },
  });
  if (!res.ok) throw new Error(`Zoho accounts list failed: ${await res.text()}`);
  const data = await res.json();
  const accounts = data.data || [];
  const primary = accounts.find(a => a.isPrimary) || accounts[0];
  if (!primary) throw new Error('No Zoho accounts found');
  return primary.accountId;
}

export async function loadZohoAccounts() {
  return loadAccounts('zoho');
}

/** Fetch recent messages from Zoho — returns thread-like objects */
export async function fetchZohoMessages(account, { maxTotal = 50 } = {}) {
  const token = await getFreshToken(account);
  const zohoAccountId = await getZohoAccountId(account, token);
  const results = [];
  let start = 0;
  const limit = Math.min(200, maxTotal);

  while (results.length < maxTotal) {
    const url = `${getZohoApiBase()}/accounts/${zohoAccountId}/messages/view?limit=${limit}&start=${start}&sortby=date&order=desc`;
    const res = await fetch(url, {
      headers: { Authorization: `Zoho-oauthtoken ${token}` },
    });
    if (!res.ok) throw new Error(`Zoho messages failed: ${await res.text()}`);
    const data = await res.json();
    const messages = data.data || [];
    if (messages.length === 0) break;

    for (const msg of messages) {
      const fromName = msg.fromName || '';
      const fromAddr = Array.isArray(msg.fromAddress)
        ? msg.fromAddress[0]?.address || msg.fromAddress[0] || ''
        : typeof msg.fromAddress === 'string' ? msg.fromAddress : '';

      results.push({
        threadId: msg.threadId || msg.messageId,
        provider: 'zoho',
        account: account.email,
        messageCount: 1,
        snippet: msg.summary || '',
        from: fromName ? `${fromName} <${fromAddr}>` : fromAddr,
        to: msg.toAddress || '',
        subject: msg.subject || '(no subject)',
        date: msg.receivedTime ? new Date(parseInt(msg.receivedTime)).toISOString() : '',
      });
      if (results.length >= maxTotal) break;
    }

    if (messages.length < limit) break;
    start += limit;
  }

  return results.slice(0, maxTotal);
}
