// ─── src/enricher.js ──────────────────────────────────────────────────────────
// Enrichment of existing Gmail filters.
//   1. Fetches all active Gmail filters
//   2. Fetches recent emails that match each filter
//   3. Asks Claude if the filter should be extended (new criteria / actions)
//   4. Replaces the filter with the enriched version (or dry-runs it)
// ──────────────────────────────────────────────────────────────────────────────

import Anthropic from '@anthropic-ai/sdk';
import { readFileSync, writeFileSync } from 'fs';
import { listFilters, listThreadIds, fetchThreadDetails, createFilter, deleteFilter, listLabels } from './gmail-client.js';
import { config } from '../config.js';

const client = new Anthropic({ apiKey: config.anthropic.apiKey });

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

// ── Convert a period string like "30d" or "7d" to a Gmail date query ──────────
function periodToGmailQuery(period) {
  const match = period.match(/^(\d+)([dw])$/i);
  if (!match) throw new Error(`Invalid period format: "${period}". Use e.g. "30d" or "4w".`);
  const [, n, unit] = match;
  const days = unit.toLowerCase() === 'w' ? parseInt(n) * 7 : parseInt(n);
  const date = new Date();
  date.setDate(date.getDate() - days);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `after:${yyyy}/${mm}/${dd}`;
}

// ── Describe a filter in human-readable text for Claude ───────────────────────
function describeFilter(f) {
  const c = f.criteria || {};
  const a = f.action || {};
  const parts = [];
  if (c.from) parts.push(`from: ${c.from}`);
  if (c.to) parts.push(`to: ${c.to}`);
  if (c.subject) parts.push(`subject: ${c.subject}`);
  if (c.query) parts.push(`query: ${c.query}`);
  const actions = [];
  if (a.addLabelIds?.length) actions.push(`add labels: ${a.addLabelIds.join(', ')}`);
  if (a.removeLabelIds?.includes('INBOX')) actions.push('skip inbox');
  if (a.removeLabelIds?.includes('UNREAD')) actions.push('mark read');
  return `Criteria(${parts.join(', ')}) → Actions(${actions.join(', ')})`;
}

// ── Ask Claude whether a filter should be updated ─────────────────────────────
async function askClaudeToEnrichFilter(existingFilter, recentThreads, labels) {
  const labelMap = Object.fromEntries(labels.map(l => [l.id, l.name]));

  const filterDesc = describeFilter(existingFilter);
  const emailsSample = recentThreads
    .slice(0, 20)
    .map((t, i) => `[${i + 1}] FROM: ${t.from}\n    SUBJECT: ${t.subject}\n    SNIPPET: ${t.snippet.slice(0, 100)}`)
    .join('\n\n');

  // Resolve label IDs in action to names for readability
  const resolvedAction = {
    ...existingFilter.action,
    addLabelIds: (existingFilter.action?.addLabelIds || []).map(id => labelMap[id] || id),
    removeLabelIds: existingFilter.action?.removeLabelIds || [],
  };

  const systemPrompt = `You are an expert Gmail filter optimizer.
You will be given an existing Gmail filter and a sample of recent emails it matched (or should match).
Your job is to suggest improvements: broader criteria, additional actions, or corrections.
Respond ONLY with valid JSON — no markdown, no explanation outside the JSON.`;

  const userPrompt = `Existing filter:
  ${filterDesc}

  Resolved action: ${JSON.stringify(resolvedAction)}

  Recent matching emails (${recentThreads.length} total, showing up to 20):
  ${emailsSample || '(none found)'}

  Should this filter be improved? Respond with JSON in this exact shape:
  {
    "shouldUpdate": true | false,
    "reason": "why or why not",
    "updatedCriteria": {
      "from": "...",      // optional, include if criteria should change
      "subject": "...",   // optional
      "query": "..."      // optional, raw Gmail search query
    },
    "updatedAction": {
      "label": "LabelName",  // optional
      "archive": true,       // optional
      "markRead": false,     // optional
      "delete": false        // optional
    }
  }

  If shouldUpdate is false, updatedCriteria and updatedAction can be empty objects.
  Return ONLY the JSON object.`;

  const message = await client.messages.create({
    model: config.anthropic.model,
    max_tokens: 1024,
    messages: [{ role: 'user', content: userPrompt }],
    system: systemPrompt,
  });

  const raw = message.content[0].text.trim();
  const jsonStr = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

  try {
    return JSON.parse(jsonStr);
  } catch {
    return { shouldUpdate: false, reason: `Parse error: ${raw.slice(0, 200)}` };
  }
}

// ── Build updated filter def from Claude's suggestion ─────────────────────────
function buildUpdatedFilterDef(existing, suggestion, labels) {
  const labelByName = Object.fromEntries(labels.map(l => [l.name.toLowerCase(), l.id]));

  const criteria = {
    ...(existing.criteria || {}),
    ...(suggestion.updatedCriteria || {}),
  };
  // Remove empty strings
  Object.keys(criteria).forEach(k => { if (!criteria[k]) delete criteria[k]; });

  const action = { ...(existing.action || {}) };

  if (suggestion.updatedAction?.label) {
    const labelId = labelByName[suggestion.updatedAction.label.toLowerCase()];
    if (labelId && !action.addLabelIds?.includes(labelId)) {
      action.addLabelIds = [...(action.addLabelIds || []), labelId];
    }
  }
  if (suggestion.updatedAction?.archive && !action.removeLabelIds?.includes('INBOX')) {
    action.removeLabelIds = [...(action.removeLabelIds || []), 'INBOX'];
  }
  if (suggestion.updatedAction?.markRead && !action.removeLabelIds?.includes('UNREAD')) {
    action.removeLabelIds = [...(action.removeLabelIds || []), 'UNREAD'];
  }
  if (suggestion.updatedAction?.delete && !action.addLabelIds?.includes('TRASH')) {
    action.addLabelIds = [...(action.addLabelIds || []), 'TRASH'];
  }

  return { criteria, action };
}

// ── Main enrichment function ───────────────────────────────────────────────────
/**
 * enrichFilters(account, { period, dryRun }) → results[]
 *
 * result entry:
 * {
 *   filterId, description, shouldUpdate, reason,
 *   updatedFilterDef, status: 'updated' | 'skipped' | 'error' | 'dry-run',
 *   newGmailFilterId
 * }
 */
export async function enrichFilters(account, { period = '30d', dryRun = false } = {}) {
  const [existingFilters, labels] = await Promise.all([
    listFilters(account),
    listLabels(account),
  ]);

  if (existingFilters.length === 0) {
    return [];
  }

  const dateQuery = periodToGmailQuery(period);
  const results = [];
  const history = loadHistory();

  for (const filter of existingFilters) {
    // Build a Gmail query from filter criteria to find matching recent emails
    const { criteria = {} } = filter;
    const queryParts = [dateQuery];
    if (criteria.from) queryParts.push(`from:(${criteria.from})`);
    if (criteria.subject) queryParts.push(`subject:(${criteria.subject})`);
    if (criteria.query) queryParts.push(criteria.query);
    const query = queryParts.join(' ');

    let recentThreads = [];
    try {
      const ids = await listThreadIds(account, { query, maxTotal: 30 });
      recentThreads = await fetchThreadDetails(account, ids);
    } catch {
      // No matching emails — still ask Claude with empty sample
    }

    let suggestion;
    try {
      suggestion = await askClaudeToEnrichFilter(filter, recentThreads, labels);
    } catch (err) {
      results.push({
        filterId: filter.id,
        description: describeFilter(filter),
        shouldUpdate: false,
        reason: `Claude error: ${err.message}`,
        status: 'error',
      });
      continue;
    }

    const entry = {
      filterId: filter.id,
      description: describeFilter(filter),
      shouldUpdate: suggestion.shouldUpdate,
      reason: suggestion.reason,
      recentMatchCount: recentThreads.length,
      dryRun,
      status: 'skipped',
      newGmailFilterId: null,
      updatedFilterDef: null,
    };

    if (suggestion.shouldUpdate) {
      const updatedDef = buildUpdatedFilterDef(filter, suggestion, labels);
      entry.updatedFilterDef = updatedDef;

      if (!dryRun) {
        try {
          // Gmail doesn't support PATCH on filters — delete + recreate
          await deleteFilter(account, filter.id);
          const created = await createFilter(account, updatedDef);
          entry.newGmailFilterId = created.id;
          entry.status = 'updated';
        } catch (err) {
          entry.status = 'error';
          entry.error = err.message;
        }
      } else {
        entry.status = 'dry-run';
      }
    }

    history.push({
      date: new Date().toISOString(),
      account: account.email,
      type: 'enrich',
      ...entry,
    });
    results.push(entry);
  }

  saveHistory(history);
  return results;
}
