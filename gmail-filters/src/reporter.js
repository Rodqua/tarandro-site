// ─── src/reporter.js ──────────────────────────────────────────────────────────
// Formatted CLI output using chalk + cli-table3.
// ──────────────────────────────────────────────────────────────────────────────

import chalk from 'chalk';
import Table from 'cli-table3';
import { readFileSync } from 'fs';
import { config } from '../config.js';

// ── Helpers ───────────────────────────────────────────────────────────────────
function statusColor(status) {
  switch (status) {
    case 'created':  return chalk.green(status);
    case 'updated':  return chalk.blue(status);
    case 'dry-run':  return chalk.yellow(status);
    case 'skipped':  return chalk.gray(status);
    case 'error':    return chalk.red(status);
    default:         return status;
  }
}

function shortDate(iso) {
  return iso ? new Date(iso).toLocaleDateString('fr-FR') : '—';
}

function truncate(str, len = 50) {
  return str && str.length > len ? str.slice(0, len - 1) + '…' : (str || '—');
}

// ── Report: generate results ──────────────────────────────────────────────────
export function reportGenerate(results, { dryRun } = {}) {
  console.log('');
  if (dryRun) {
    console.log(chalk.yellow.bold('  🔍  DRY RUN — no filters were created\n'));
  }

  if (results.length === 0) {
    console.log(chalk.gray('  No filter proposals generated.'));
    console.log(chalk.gray('  Try increasing --limit or check that emails are accessible.\n'));
    return;
  }

  const table = new Table({
    head: [
      chalk.bold('Cluster'),
      chalk.bold('Pattern'),
      chalk.bold('Emails'),
      chalk.bold('Action'),
      chalk.bold('Label'),
      chalk.bold('Status'),
    ],
    colWidths: [24, 26, 8, 22, 18, 10],
    wordWrap: true,
    style: { head: [], border: [] },
  });

  for (const r of results) {
    const fd = r.filterDef || {};
    const criteria = fd.criteria || {};
    const action = fd.action || {};

    const actionParts = [];
    if (action.removeLabelIds?.includes('INBOX')) actionParts.push('skip inbox');
    if (action.removeLabelIds?.includes('UNREAD')) actionParts.push('mark read');
    if (action.addLabelIds?.includes('TRASH')) actionParts.push('trash');

    const labels = (action.addLabelIds || []).filter(id => id !== 'TRASH');

    table.push([
      truncate(r.clusterName, 22),
      truncate(criteria.from || criteria.subject || '—', 24),
      String(r.emailCount || '—'),
      actionParts.join(', ') || '—',
      truncate(labels.join(', ') || '—', 16),
      statusColor(r.status),
    ]);
  }

  console.log(table.toString());

  const created = results.filter(r => r.status === 'created').length;
  const dryrun  = results.filter(r => r.status === 'dry-run').length;
  const errors  = results.filter(r => r.status === 'error').length;

  console.log('');
  if (dryRun) {
    console.log(chalk.yellow(`  ${dryrun} filter(s) would be created. Run without --dry-run to apply.\n`));
  } else {
    console.log(chalk.green(`  ✅  ${created} filter(s) created.`) + (errors ? chalk.red(`  ❌  ${errors} error(s).`) : '') + '\n');
  }
}

// ── Report: enrich results ────────────────────────────────────────────────────
export function reportEnrich(results, { dryRun } = {}) {
  console.log('');
  if (dryRun) {
    console.log(chalk.yellow.bold('  🔍  DRY RUN — no filters were modified\n'));
  }

  if (results.length === 0) {
    console.log(chalk.gray('  No existing Gmail filters found.\n'));
    return;
  }

  const table = new Table({
    head: [
      chalk.bold('Filter'),
      chalk.bold('Recent matches'),
      chalk.bold('Update?'),
      chalk.bold('Reason'),
      chalk.bold('Status'),
    ],
    colWidths: [32, 16, 10, 34, 11],
    wordWrap: true,
    style: { head: [], border: [] },
  });

  for (const r of results) {
    table.push([
      truncate(r.description, 30),
      String(r.recentMatchCount ?? '—'),
      r.shouldUpdate ? chalk.cyan('yes') : chalk.gray('no'),
      truncate(r.reason, 32),
      statusColor(r.status),
    ]);
  }

  console.log(table.toString());

  const updated  = results.filter(r => r.status === 'updated').length;
  const dryrun   = results.filter(r => r.status === 'dry-run').length;
  const skipped  = results.filter(r => r.status === 'skipped').length;
  const errors   = results.filter(r => r.status === 'error').length;

  console.log('');
  if (dryRun) {
    console.log(chalk.yellow(`  ${dryrun} filter(s) would be updated, ${skipped} skipped. Run without --dry-run to apply.\n`));
  } else {
    const parts = [];
    if (updated) parts.push(chalk.green(`✅  ${updated} updated`));
    if (skipped) parts.push(chalk.gray(`${skipped} skipped`));
    if (errors)  parts.push(chalk.red(`❌  ${errors} error(s)`));
    console.log('  ' + parts.join('  ') + '\n');
  }
}

// ── Report: history ───────────────────────────────────────────────────────────
export function reportHistory({ limit = 20 } = {}) {
  let history;
  try {
    history = JSON.parse(readFileSync(config.filters.historyFile, 'utf8'));
  } catch {
    history = [];
  }

  if (history.length === 0) {
    console.log(chalk.gray('\n  No history yet. Run `generate` or `enrich` first.\n'));
    return;
  }

  const recent = history.slice(-limit).reverse();

  console.log('');
  console.log(chalk.bold(`  📋  Last ${recent.length} operation(s):\n`));

  const table = new Table({
    head: [
      chalk.bold('Date'),
      chalk.bold('Account'),
      chalk.bold('Type'),
      chalk.bold('Name / Filter'),
      chalk.bold('Emails'),
      chalk.bold('Status'),
    ],
    colWidths: [13, 26, 9, 30, 8, 10],
    wordWrap: true,
    style: { head: [], border: [] },
  });

  for (const entry of recent) {
    const type = entry.type === 'enrich' ? chalk.blue('enrich') : chalk.magenta('generate');
    table.push([
      shortDate(entry.date),
      truncate(entry.account, 24),
      type,
      truncate(entry.clusterName || entry.description, 28),
      String(entry.emailCount || entry.recentMatchCount || '—'),
      statusColor(entry.status),
    ]);
  }

  console.log(table.toString());
  console.log(`\n  Total: ${history.length} entries in history.\n`);
}
