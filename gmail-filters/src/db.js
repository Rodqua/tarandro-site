// ─── src/db.js ────────────────────────────────────────────────────────────────
// Postgres client — loads EmailAccount rows for all providers.
// Uses the same DATABASE_URL as the Next.js/Prisma app (Supabase pooler).
// ──────────────────────────────────────────────────────────────────────────────

import pg from 'pg';
import { config } from '../config.js';

const { Pool } = pg;

let pool;
function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: config.database.url,
      ssl: { rejectUnauthorized: false },
      max: 3,
    });
  }
  return pool;
}

export async function closePool() {
  if (pool) await pool.end();
}

/**
 * Load all EmailAccount rows for a given provider (or all providers).
 * Returns: { id, email, provider, accessToken, refreshToken, expiresAt, metadata }[]
 */
export async function loadAccounts(provider = null) {
  const client = await getPool().connect();
  try {
    const query = provider
      ? `SELECT id, email, provider, "accessToken", "refreshToken", "expiresAt", metadata
           FROM "EmailAccount"
          WHERE provider = $1
          ORDER BY email`
      : `SELECT id, email, provider, "accessToken", "refreshToken", "expiresAt", metadata
           FROM "EmailAccount"
          ORDER BY provider, email`;
    const res = await client.query(query, provider ? [provider] : []);
    return res.rows;
  } finally {
    client.release();
  }
}

/** Persist a refreshed access token back to the DB */
export async function updateToken(id, accessToken, expiresAt) {
  const client = await getPool().connect();
  try {
    await client.query(
      `UPDATE "EmailAccount" SET "accessToken" = $1, "expiresAt" = $2 WHERE id = $3`,
      [accessToken, expiresAt, id]
    );
  } finally {
    client.release();
  }
}
