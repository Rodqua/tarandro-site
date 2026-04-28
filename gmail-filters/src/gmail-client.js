// ─── src/gmail-client.js ──────────────────────────────────────────────────────
// Gmail API wrapper using tokens from the shared Postgres DB.
// ──────────────────────────────────────────────────────────────────────────────

import { google } from 'googleapis';
import { config } from '../config.js';
import { loadAccounts, updateToken } from './db.js';

function buildOAuth2Client() {
  return new google.auth.OAuth2(
    config.google.clientId,
    config.google.clientSecret,
    config.google.redirectUri
  );
}

async function getFreshToken(account) {
  const isExpired = !account.expiresAt || new Date(account.expiresAt) <= new Date();
  if (!isExpired) return account.accessToken;

  const oauth2 = buildOAuth2Client();
  oauth2.setCredentials({
    access_token: account.accessToken,
    refresh_token: account.refreshToken,
  });
  const { credentials } = await oauth2.refreshAccessToken();
  const newToken = credentials.access_token;
  const newExpiry = credentials.expiry_date ? new Date(credentials.expiry_date).toISOString() : null;
  await updateToken(account.id, newToken, newExpiry);
  return newToken;
}

async function getGmailClient(account) {
  const token = await getFreshToken(account);
  const auth = buildOAuth2Client();
  auth.setCredentials({ access_token: token });
  return google.gmail({ version: 'v1', auth });
}

export async function loadGmailAccounts() {
  return loadAccounts('google');
}

export async function listThreadIds(account, { query = config.gmailQuery, maxTotal = config.filters.defaultLimit } = {}) {
  const gmail = await getGmailClient(account);
  const ids = [];
  let pageToken;
  do {
    const res = await gmail.users.threads.list({
      userId: 'me',
      q: query,
      maxResults: Math.min(500, maxTotal - ids.length),
      pageToken,
    });
    ids.push(...(res.data.threads || []).map(t => t.id));
    pageToken = res.data.nextPageToken;
  } while (pageToken && ids.length < maxTotal);
  return ids.slice(0, maxTotal);
}

export async function getThreadDetail(account, threadId) {
  const gmail = await getGmailClient(account);
  const res = await gmail.users.threads.get({
    userId: 'me',
    id: threadId,
    format: 'metadata',
    metadataHeaders: ['From', 'To', 'Subject', 'Date'],
  });
  const messages = res.data.messages || [];
  const firstMsg = messages[0] || {};
  const headers = Object.fromEntries((firstMsg.payload?.headers || []).map(h => [h.name, h.value]));
  return {
    threadId,
    provider: 'google',
    account: account.email,
    messageCount: messages.length,
    snippet: firstMsg.snippet || '',
    from: headers['From'] || '',
    to: headers['To'] || '',
    subject: headers['Subject'] || '(no subject)',
    date: headers['Date'] || '',
  };
}

export async function fetchThreadDetails(account, threadIds, { batchSize = 10, onProgress } = {}) {
  const results = [];
  for (let i = 0; i < threadIds.length; i += batchSize) {
    const batch = threadIds.slice(i, i + batchSize);
    const details = await Promise.all(batch.map(id => getThreadDetail(account, id).catch(() => null)));
    results.push(...details.filter(Boolean));
    if (onProgress) onProgress(results.length, threadIds.length);
  }
  return results;
}

// ── Gmail Filters API ──────────────────────────────────────────────────────────

export async function listFilters(account) {
  const gmail = await getGmailClient(account);
  const res = await gmail.users.settings.filters.list({ userId: 'me' });
  return res.data.filter || [];
}

export async function createFilter(account, filterDef) {
  const gmail = await getGmailClient(account);
  const res = await gmail.users.settings.filters.create({ userId: 'me', requestBody: filterDef });
  return res.data;
}

export async function deleteFilter(account, filterId) {
  const gmail = await getGmailClient(account);
  await gmail.users.settings.filters.delete({ userId: 'me', id: filterId });
}

export async function listLabels(account) {
  const gmail = await getGmailClient(account);
  const res = await gmail.users.labels.list({ userId: 'me' });
  return res.data.labels || [];
}

export async function ensureLabel(account, labelName) {
  const labels = await listLabels(account);
  const existing = labels.find(l => l.name.toLowerCase() === labelName.toLowerCase());
  if (existing) return existing.id;
  const gmail = await getGmailClient(account);
  const res = await gmail.users.labels.create({
    userId: 'me',
    requestBody: { name: labelName, labelListVisibility: 'labelShow', messageListVisibility: 'show' },
  });
  return res.data.id;
}
