import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const results: Record<string, unknown> = {};

  // 1. Vérifier DATABASE_URL
  results.database_url_set = !!process.env.DATABASE_URL;
  results.database_url_prefix = process.env.DATABASE_URL?.substring(0, 20) + "...";

  // 2. Tester la connexion DB
  try {
    await (prisma as any).$queryRaw`SELECT 1`;
    results.db_connection = "✅ OK";
  } catch (e: any) {
    results.db_connection = `❌ ${e.message}`;
  }

  // 3. Vérifier si les tables existent
  try {
    const count = await (prisma as any).emailAccount.count();
    results.email_accounts_table = `✅ OK (${count} comptes)`;
  } catch (e: any) {
    results.email_accounts_table = `❌ ${e.message}`;
  }

  try {
    const count = await (prisma as any).emailThread.count();
    results.email_threads_table = `✅ OK (${count} threads)`;
  } catch (e: any) {
    results.email_threads_table = `❌ ${e.message}`;
  }

  // 4. Vérifier les vars Google
  results.google_client_id_set = !!process.env.GOOGLE_CLIENT_ID;
  results.google_secret_set = !!process.env.GOOGLE_CLIENT_SECRET;
  results.google_redirect_uri = process.env.GOOGLE_REDIRECT_URI || "❌ manquante";
  results.nextauth_url = process.env.NEXTAUTH_URL || "❌ manquante";

  return NextResponse.json(results, { status: 200 });
}
