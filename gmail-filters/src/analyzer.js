// ─── src/analyzer.js ──────────────────────────────────────────────────────────
// Sends email samples to Claude API and gets back semantic clusters.
// Each cluster groups emails by sender domain / topic / pattern and
// suggests a filter action (label, archive, mark-read, etc.).
// ──────────────────────────────────────────────────────────────────────────────

import Anthropic from '@anthropic-ai/sdk';
import { config } from '../config.js';

const client = new Anthropic({ apiKey: config.anthropic.apiKey });

// ── Format threads into a compact text payload for Claude ─────────────────────
function formatEmailsForClaude(threads) {
  return threads
    .map((t, i) =>
      `[${i + 1}] FROM: ${t.from}\n    SUBJECT: ${t.subject}\n    SNIPPET: ${t.snippet.slice(0, 120)}`
    )
    .join('\n\n');
}

// ── Main clustering function ───────────────────────────────────────────────────
/**
 * analyzeThreads(threads) → clusters[]
 *
 * Each cluster:
 * {
 *   name: string,           // human-readable cluster name
 *   pattern: string,        // e.g. sender domain, keyword, etc.
 *   emails: number[],       // 1-based indices into `threads`
 *   senderDomains: string[],
 *   keywords: string[],
 *   suggestedAction: {
 *     label?: string,       // Gmail label name to apply
 *     archive?: boolean,    // skip inbox
 *     markRead?: boolean,
 *     delete?: boolean,
 *   },
 *   reason: string,         // why these are grouped together
 * }
 */
export async function analyzeThreads(threads) {
  if (threads.length === 0) return [];

  const emailsText = formatEmailsForClaude(threads);

  const systemPrompt = `You are an expert at analyzing email patterns and creating Gmail filter rules.
Your job is to group emails into semantic clusters and suggest Gmail filter actions for each cluster.

Rules:
- Only create clusters of at least ${config.filters.minClusterSize} emails (by count of emails in the cluster).
- Focus on actionable patterns: newsletters, notifications, receipts, social networks, automated alerts, supplier emails, etc.
- Prefer grouping by sender domain when it's a clear signal.
- Suggested actions should reflect the nature of the emails: newsletters → label + skip inbox; receipts → label; alerts → mark read; spam-like → delete.
- Respond ONLY with valid JSON. No markdown, no explanation outside the JSON.`;

  const userPrompt = `Here are ${threads.length} emails. Analyze and cluster them:

${emailsText}

Respond with a JSON array of clusters. Each cluster must have these fields:
{
  "name": "Cluster label (e.g. 'Newsletters Substack')",
  "pattern": "What unifies them (e.g. '@substack.com', 'invoice', 'noreply@')",
  "emails": [1, 5, 12],  // 1-based indices of matching emails
  "senderDomains": ["substack.com"],
  "keywords": ["newsletter", "unsubscribe"],
  "suggestedAction": {
    "label": "Newsletters",  // optional Gmail label
    "archive": true,         // optional: skip inbox
    "markRead": false,       // optional
    "delete": false          // optional: for real junk
  },
  "reason": "All from Substack newsletter platform, can be auto-labeled and archived"
}

Return ONLY the JSON array, nothing else.`;

  const message = await client.messages.create({
    model: config.anthropic.model,
    max_tokens: config.anthropic.maxTokens,
    messages: [{ role: 'user', content: userPrompt }],
    system: systemPrompt,
  });

  const raw = message.content[0].text.trim();

  // Strip markdown code fences if Claude wraps the JSON
  const jsonStr = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

  let clusters;
  try {
    clusters = JSON.parse(jsonStr);
  } catch {
    throw new Error(`Claude returned invalid JSON:\n${raw.slice(0, 500)}`);
  }

  if (!Array.isArray(clusters)) {
    throw new Error('Claude response is not an array.');
  }

  // Enrich clusters with the actual thread objects for downstream use
  return clusters.map(cluster => ({
    ...cluster,
    threads: (cluster.emails || [])
      .map(idx => threads[idx - 1])
      .filter(Boolean),
  }));
}
