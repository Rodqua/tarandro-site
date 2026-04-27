import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { listGmailThreads, getGmailThread, categorizeEmail } from "@/lib/gmail";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const filter = searchParams.get("filter") || "all";
  const sync = searchParams.get("sync") === "true";

  // Synchronisation si demandée
  if (sync) {
    const accounts = await (prisma as any).emailAccount.findMany();

    for (const account of accounts) {
      if (account.provider === "google") {
        try {
          const threads = await listGmailThreads(
            account.accessToken,
            account.refreshToken ?? undefined,
            "is:unread newer_than:14d",
            30
          );

          for (const thread of threads) {
            if (!thread.id) continue;
            try {
              const detail = await getGmailThread(
                account.accessToken,
                account.refreshToken ?? undefined,
                thread.id
              );

              const messages = detail.messages || [];
              const last = messages[messages.length - 1];
              if (!last) continue;

              const headers = last.payload?.headers || [];
              const h = (name: string) =>
                headers.find((x) => x.name?.toLowerCase() === name.toLowerCase())?.value || "";

              const subject = h("Subject") || "(Sans objet)";
              const sender = h("From") || "";
              const date = h("Date") ? new Date(h("Date")) : new Date();
              const snippet = last.snippet || "";
              const labels = last.labelIds || [];
              const category = categorizeEmail(sender, subject);

              await (prisma as any).emailThread.upsert({
                where: { accountId_threadId: { accountId: account.id, threadId: thread.id } },
                update: { subject, sender, snippet, date, category, labels, isUnread: labels.includes("UNREAD"), updatedAt: new Date() },
                create: { threadId: thread.id, accountId: account.id, subject, sender, snippet, date, category, labels, isUnread: labels.includes("UNREAD") },
              });
            } catch {}
          }
        } catch (e) {
          console.error(`Sync error for ${account.email}:`, e);
        }
      }
    }
  }

  // Construction de la requête filtrée
  const where: Record<string, unknown> = {};
  if (filter === "unread") where.isUnread = true;
  if (["urgent", "important", "veille", "loge", "compta", "newsletter", "events"].includes(filter)) {
    where.category = filter;
  }

  const threads = await (prisma as any).emailThread.findMany({
    where,
    include: { account: { select: { email: true, provider: true } } },
    orderBy: { date: "desc" },
    take: 150,
  });

  return NextResponse.json(threads);
}
