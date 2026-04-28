// ─── config.js ────────────────────────────────────────────────────────────────
import 'dotenv/config';

export const config = {
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY,
    model: 'claude-opus-4-6',
    maxTokens: 4096,
  },

  // Postgres DATABASE_URL — same as the Next.js app (Supabase pooler)
  database: {
    url: process.env.DATABASE_URL,
  },

  // Google OAuth — same app as tarandro.org
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URI || 'https://tarandro.org/api/mail/connect/callback',
  },

  // Microsoft OAuth — same app as tarandro.org
  microsoft: {
    clientId: process.env.MICROSOFT_CLIENT_ID,
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
  },

  // Zoho OAuth — same app as tarandro.org
  zoho: {
    clientId: process.env.ZOHO_CLIENT_ID,
    clientSecret: process.env.ZOHO_CLIENT_SECRET,
    region: process.env.ZOHO_REGION || 'eu',
  },

  filters: {
    minClusterSize: 3,
    defaultLimit: 50,
    defaultPeriodDays: 30,
    historyFile: new URL('./data/filter_history.json', import.meta.url).pathname,
  },

  gmailQuery: '-in:spam -in:trash',
};

// ── Validation ─────────────────────────────────────────────────────────────────
export function validateConfig() {
  const required = [
    ['ANTHROPIC_API_KEY', config.anthropic.apiKey],
    ['DATABASE_URL', config.database.url],
    ['GOOGLE_CLIENT_ID', config.google.clientId],
    ['GOOGLE_CLIENT_SECRET', config.google.clientSecret],
  ];
  const missing = required.filter(([, v]) => !v).map(([k]) => k);
  if (missing.length > 0) {
    console.error('\n❌  Missing environment variables:');
    missing.forEach(k => console.error(`   • ${k}`));
    console.error('\nCreate a .env file at the project root. See .env.example.\n');
    process.exit(1);
  }
}
