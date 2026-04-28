// ─── src/generator.js ─────────────────────────────────────────────────────────
// Turns Claude clusters into Gmail API filter definitions and applies them.
// Also saves each applied filter to the local history file.
// ──────────────────────────────────────────────────────────────────────────────

import { readFileSync, writeFileSync } from 'fs';
import { createFilter, listLabels } from './gmail-client.js';
import { config } from '../config.js';

// ── Load / save history ────────────────────────────────────────────────────────
function loadHistory() {
  try {
    return JSON.parse(readFileSync(config.filters.historyFile, 'utf8'));
  } catch {
    return [];
  }
}

function saveHistory(history) {
  writeFileSync(config.filters.historyFile, JSON.stringify(history, null, 2));
}

// ── Build a Gmail filter criteria object from a cluster ────────────────────────
function buildCriteria(cluster) {
  const criteria = {};

  // Use sender domains for "from" filter
  if (cluster.senderDomains && cluster.senderDomains.length > 0) {
    criteria.from = cluster.senderDomains
      .map(d => (d.includes('@') ? d : `@${d}`))
      .join(' OR ');
  }

  // Fallback: use pattern as subject/query hint
  if (!criteria.from && cluster.keywords && cluster.keywords.length > 0) {
    criteria.subject = cluster.keywords.slice(0, 3).join(' ');
  }

  return criteria;
}

// ── Build the filter action from a cluster's suggestedAction ─────────────────
function buildAction(cluster, labelId) {
  const action = {};
  const { suggestedAction = {} } = cluster;

  if (labelId) {
    action.addLabelIds = [labelId];
  }
  if (suggestedAction.archive) {
    action.removeLabelIds = [...(action.removeLabelIds || []), 'INBOX'];
  }
  if (suggestedAction.markRead) {
    action.removeLabelIds = [...(action.removeLabelIds || []), 'UNREAD'];
  }
  if (suggestedAction.delete) {
    action.addLabelIds = [...(action.addLabelIds || []), 'TRASH'];
  }

  return action;
}

// ── Ensure a Gmail label exists, return its ID ────────────────────────────────
async function ensureLabel(account, labelName, labels) {
  const existing = labels.find(l => l.name.toLowerCase() === labelName.toLowerCase());
  if (existing) return existing.id;

  // Create the label via Gmail API (re-use auth from account)
  const { google } = await import('googleapis');
  const { config: cfg } = await import('../config.js');
  const { createClient } = await import('@supabase/supabase-js');

  // Quick inline token fetch (mirrors gmail-client approach)
  const supabase = createClient(cfg.supabase.url, cfg.supabase.serviceKey);
  const { data: acc } = await supabase
    .from('EmailAccount')
    .select('accessToken')
    .eq('id', account.id)
    .single();

  const auth = new google.auth.OAuth2(
    cfg.google.clientId,
    cfg.google.clientSecret,
    cfg.google.redirectUri
  );
  auth.setCredentials({ access_token: acc.accessToken });
  const gmail = google.gmail({ version: 'v1', auth });

  const res = await gmail.users.labels.create({
    userId: 'me',
    requestBody: {
      name: labelName,
      labelListVisibility: 'labelShow',
      messageListVisibility: 'show',
    },
  });

  return res.data.id;
}

// ── Convert clusters → Gmail filter definitions (dry-run safe) ────────────────
export function clustersToFilterDefs(clusters) {
  return clusters
    .filter(c => c.threads && c.threads.length >= config.filters.minClusterSize)
    .map(cluster => {
      const criteria = buildCriteria(cluster);
      // Skip if we can't build a meaningful criteria
      if (!criteria.from && !criteria.subject && !criteria.query) return null;

      return {
        cluster,
        filterDef: {
          criteria,
          // action is filled in during apply phase (needs label IDs)
        },
      };
    })
    .filter(Boolean);
}

// ── Apply filter proposals to Gmail (skips dry-run) ──────────────────────────
export async function applyFilters(account, proposals, { dryRun = false } = {}) {
  const results = [];
  const history = loadHistory();

  let labels;
  try {
    labels = await listLabels(account);
  } catch {
    labels = [];
  }

  for (const { cluster, filterDef } of proposals) {
    const action = buildAction(cluster, null);
    let labelId = null;

    // Resolve label ID
    if (cluster.suggestedAction?.label) {
      if (!dryRun) {
        labelId = await ensureLabel(account, cluster.suggestedAction.label, labels);
      } else {
        const existing = labels.find(
          l => l.name.toLowerCase() === cluster.suggestedAction.label.toLowerCase()
        );
        labelId = existing?.id || '(new label)';
      }
    }

    const fullFilterDef = {
      criteria: filterDef.criteria,
      action: buildAction(cluster, labelId),
    };

    const entry = {
      date: new Date().toISOString(),
      account: account.email,
      clusterName: cluster.name,
      pattern: cluster.pattern,
      emailCount: cluster.threads.length,
      filterDef: fullFilterDef,
      dryRun,
      gmailFilterId: null,
    };

    if (!dryRun) {
      try {
        const created = await createFilter(account, fullFilterDef);
        entry.gmailFilterId = created.id;
        entry.status = 'created';
      } catch (err) {
        entry.status = 'error';
        entry.error = err.message;
      }
    } else {
      entry.status = 'dry-run';
    }

    history.push(entry);
    results.push(entry);
  }

  saveHistory(history);
  return results;
}
