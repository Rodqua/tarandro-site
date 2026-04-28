#!/usr/bin/env node
// ─── gmail-filters.js ─────────────────────────────────────────────────────────
// Main CLI entry point.
//
// Usage:
//   node gmail-filters.js generate [--limit 50] [--account user@gmail.com] [--dry-run]
//   node gmail-filters.js enrich   [--period 30d] [--account user@gmail.com] [--dry-run]
//   node gmail-filters.js history  [--limit 20]
//
// Collects emails from ALL providers (Gmail, Outlook, Zoho), analyses them
// together with Claude, then creates Gmail filters for Google accounts.
// For Outlook/Zoho, shows what filters would be useful (manual creation).
// ──────────────────────────────────────────────────────────────────────────────

import { program } from 'commander';
import ora from 'ora';
import chalk from 'chalk';

import { validateConfig, config } from './config.js';
import { loadGmailAccounts, listThreadIds, fetchThreadDetails } from './src/gmail-client.js';
import { loadOutlookAccounts, fetchOutlookMessages } from './src/outlook-client.js';
import { loadZohoAccounts, fetchZohoMessages } from './src/zoho-client.js';
import { analyzeThreads } from './src/analyzer.js';
import { clustersToFilterDefs, applyFilters } from './src/generator.js';
import { enrichFilters } from './src/enricher.js';
import { reportGenerate, reportEnrich, reportHistory } from './src/reporter.js';
import { closePool } from './src/db.js';

// ── Banner ─────────────────────────────────────────────────────────────────────
function printBanner() {
  console.log(chalk.bold.cyan('\n  ╔════════════════════════════════════════╗'));
  console.log(chalk.bold.cyan('  ║   📧  Email Filters AI CLI (3 providers)  ║'));
  console.log(chalk.bold.cyan('  ╚════════════════════════════════════════╝\n'));
}

// ── Collect emails from all providers ─────────────────────────────────────────
async function collectAllEmails({ limit, accountFilter, spinner }) {
  const allThreads = [];
  const gmailAccounts = [];

  // ── Google ───────────────────────────────────────────────────────────────────
  spinner.text = '  Chargement des comptes Gmail…';
  let googleAccounts = [];
  try {
    googleAccounts = await loadGmailAccounts();
    if (accountFilter) googleAccounts = googleAccounts.filter(a => a.email === accountFilter);
  } catch (err) {
    spinner.warn(`  Gmail: ${err.message}`);
  }

  for (const account of googleAccounts) {
    try {
      spinner.text = `  Gmail: ${account.email} — récupération des threads…`;
      const ids = await listThreadIds(account, { query: config.gmailQuery, maxTotal: limit });
      const threads = await fetchThreadDetails(account, ids, {
        batchSize: 10,
        onProgress: (done, total) => {
          spinner.text = `  Gmail: ${account.email} — ${done}/${total} threads`;
        },
      });
      allThreads.push(...threads);
      gmailAccounts.push(account);
      spinner.text = `  Gmail ${account.email} : ${threads.length} threads chargés`;
    } catch (err) {
      spinner.warn(`  Gmail ${account.email}: ${err.message}`);
    }
  }

  // ── Outlook ───────────────────────────────────────────────────────────────────
  spinner.text = '  Chargement des comptes Outlook…';
  let outlookAccounts = [];
  try {
    outlookAccounts = await loadOutlookAccounts();
    if (accountFilter) outlookAccounts = outlookAccounts.filter(a => a.email === accountFilter);
  } catch (err) {
    spinner.warn(`  Outlook: ${err.message}`);
  }

  for (const account of outlookAccounts) {
    try {
      spinner.text = `  Outlook: ${account.email} — récupération des messages…`;
      const messages = await fetchOutlookMessages(account, { maxTotal: limit });
      allThreads.push(...messages);
      spinner.text = `  Outlook ${account.email} : ${messages.length} messages chargés`;
    } catch (err) {
      spinner.warn(`  Outlook ${account.email}: ${err.message}`);
    }
  }

  // ── Zoho ──────────────────────────────────────────────────────────────────────
  spinner.text = '  Chargement des comptes Zoho…';
  let zohoAccounts = [];
  try {
    zohoAccounts = await loadZohoAccounts();
    if (accountFilter) zohoAccounts = zohoAccounts.filter(a => a.email === accountFilter);
  } catch (err) {
    spinner.warn(`  Zoho: ${err.message}`);
  }

  for (const account of zohoAccounts) {
    try {
      spinner.text = `  Zoho: ${account.email} — récupération des messages…`;
      const messages = await fetchZohoMessages(account, { maxTotal: limit });
      allThreads.push(...messages);
      spinner.text = `  Zoho ${account.email} : ${messages.length} messages chargés`;
    } catch (err) {
      spinner.warn(`  Zoho ${account.email}: ${err.message}`);
    }
  }

  return { allThreads, gmailAccounts };
}

// ─────────────────────────────────────────────────────────────────────────────
//  COMMAND: generate
// ─────────────────────────────────────────────────────────────────────────────
program
  .command('generate')
  .description('Analyse tous les emails (Gmail + Outlook + Zoho) et génère des filtres Gmail')
  .option('-l, --limit <n>', 'Nombre d\'emails à analyser par compte', '50')
  .option('-a, --account <email>', 'Analyser uniquement ce compte (tous les providers sinon)')
  .option('-d, --dry-run', 'Afficher les filtres proposés sans les créer')
  .action(async (opts) => {
    printBanner();
    validateConfig();

    const limit = parseInt(opts.limit, 10);
    const dryRun = !!opts.dryRun;

    console.log(chalk.bold('  ▶  Commande: generate'));
    console.log(chalk.gray(`     limit=${limit} par compte  dry-run=${dryRun}\n`));

    // 1. Collecter les emails de tous les providers
    const spinner = ora('  Collecte des emails…').start();
    let allThreads, gmailAccounts;
    try {
      ({ allThreads, gmailAccounts } = await collectAllEmails({
        limit,
        accountFilter: opts.account,
        spinner,
      }));
      spinner.succeed(`  ${allThreads.length} emails collectés au total (Gmail + Outlook + Zoho)`);
    } catch (err) {
      spinner.fail(`  Erreur de collecte : ${err.message}`);
      await closePool();
      process.exit(1);
    }

    if (allThreads.length === 0) {
      console.log(chalk.gray('\n  Aucun email trouvé. Vérifiez les comptes et les tokens.\n'));
      await closePool();
      return;
    }

    // Affiche le récap par provider
    const byProvider = {};
    for (const t of allThreads) {
      byProvider[t.provider] = (byProvider[t.provider] || 0) + 1;
    }
    Object.entries(byProvider).forEach(([p, n]) => {
      console.log(chalk.gray(`     • ${p.padEnd(10)} : ${n} emails`));
    });
    console.log('');

    // 2. Clustering Claude (tous providers confondus)
    const spinner2 = ora(`  Analyse par Claude (${config.anthropic.model})…`).start();
    let clusters;
    try {
      clusters = await analyzeThreads(allThreads);
      spinner2.succeed(`  ${clusters.length} cluster(s) identifiés`);
    } catch (err) {
      spinner2.fail(`  Erreur Claude : ${err.message}`);
      await closePool();
      process.exit(1);
    }

    if (clusters.length === 0) {
      console.log(chalk.gray('  Aucun cluster suffisamment grand pour créer des filtres.\n'));
      await closePool();
      return;
    }

    // 3. Créer les filtres Gmail pour chaque compte Google
    const proposals = clustersToFilterDefs(clusters);
    console.log(chalk.gray(`\n  ${proposals.length} proposition(s) de filtre(s)`));

    if (gmailAccounts.length === 0) {
      console.log(chalk.yellow('\n  ⚠  Aucun compte Gmail — les filtres seront affichés mais non créés.'));
      reportGenerate(proposals.map(p => ({
        ...p,
        clusterName: p.cluster.name,
        emailCount: p.cluster.threads.length,
        status: 'dry-run',
      })), { dryRun: true });
      await closePool();
      return;
    }

    for (const account of gmailAccounts) {
      console.log(chalk.bold.white(`\n  ── Création des filtres pour ${account.email} ──\n`));
      const spinner3 = ora(dryRun ? '  Simulation…' : '  Création des filtres Gmail…').start();
      try {
        const results = await applyFilters(account, proposals, { dryRun });
        spinner3.succeed(dryRun ? '  Simulation terminee' : '  Filtres traites');
        reportGenerate(results, { dryRun });
      } catch (err) {
        spinner3.fail(`  Erreur : ${err.message}`);
      }
    }

    await closePool();
  });

// ─────────────────────────────────────────────────────────────────────────────
//  COMMAND: enrich
// ─────────────────────────────────────────────────────────────────────────────
program
  .command('enrich')
  .description('Ameliore les filtres Gmail existants en se basant sur les emails recents')
  .option('-p, --period <period>', 'Periode d\'analyse (ex: 30d, 4w)', '30d')
  .option('-a, --account <email>', 'Uniquement ce compte Gmail')
  .option('-d, --dry-run', 'Afficher les ameliorations sans les appliquer')
  .action(async (opts) => {
    printBanner();
    validateConfig();

    const dryRun = !!opts.dryRun;

    console.log(chalk.bold('  Commande: enrich'));
    console.log(chalk.gray(`     period=${opts.period}  dry-run=${dryRun}\n`));

    const spinner = ora('  Chargement des comptes Gmail...').start();
    let accounts;
    try {
      accounts = await loadGmailAccounts();
      if (opts.account) accounts = accounts.filter(a => a.email === opts.account);
      spinner.succeed(`  ${accounts.length} compte(s) Gmail trouve(s)`);
    } catch (err) {
      spinner.fail(`  Erreur : ${err.message}`);
      await closePool();
      process.exit(1);
    }

    for (const account of accounts) {
      console.log(chalk.bold.white(`\n  -- Compte: ${account.email} --\n`));
      const spinner2 = ora('  Analyse des filtres existants...').start();
      try {
        const results = await enrichFilters(account, { period: opts.period, dryRun });
        spinner2.succeed(`  ${results.length} filtre(s) analyse(s)`);
        reportEnrich(results, { dryRun });
      } catch (err) {
        spinner2.fail(`  Erreur : ${err.message}`);
      }
    }

    await closePool();
  });

// ─────────────────────────────────────────────────────────────────────────────
//  COMMAND: history
// ─────────────────────────────────────────────────────────────────────────────
program
  .command('history')
  .description('Affiche l\'historique des filtres generes et enrichis')
  .option('-n, --limit <n>', 'Nombre d\'entrees a afficher', '20')
  .action(async (opts) => {
    printBanner();
    reportHistory({ limit: parseInt(opts.limit, 10) });
    await closePool();
  });

// ─────────────────────────────────────────────────────────────────────────────
program
  .name('gmail-filters')
  .description('AI-powered email filter CLI -- Gmail, Outlook, Zoho -> filtres Gmail')
  .version('1.1.0');

program.parse(process.argv);

if (process.argv.length < 3) {
  program.help();
}
