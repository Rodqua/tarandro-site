import { getEvjfSession } from "@/lib/evjf-auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import EvjfNav from "@/components/evjf/EvjfNav";
import Countdown from "@/components/evjf/Countdown";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getEvjfSession();
  if (!session) redirect("/lise/login");

  const [ideasStats, latestMessages, latestIdeas] = await Promise.all([
    prisma.evjfIdea.groupBy({
      by: ["status"],
      _count: { id: true },
    }),
    prisma.evjfMessage.findMany({
      take: 3,
      orderBy: { createdAt: "desc" },
      include: { author: { select: { name: true } } },
    }),
    prisma.evjfIdea.findMany({
      take: 4,
      where: { status: { in: ["PENDING", "VALIDATED"] } },
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { name: true } },
        _count: { select: { votes: true, comments: true } },
      },
    }),
  ]);

  const stats = {
    pending: ideasStats.find((s) => s.status === "PENDING")?._count.id ?? 0,
    validated: ideasStats.find((s) => s.status === "VALIDATED")?._count.id ?? 0,
    retained: ideasStats.find((s) => s.status === "RETAINED")?._count.id ?? 0,
  };

  const partyDate = process.env.EVJF_PARTY_DATE
    ? new Date(process.env.EVJF_PARTY_DATE)
    : null;

  return (
    <div className="min-h-screen">
      <EvjfNav userName={session.name} role={session.role} />

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Hero */}
        <div className="bg-gradient-to-r from-pink-500 to-fuchsia-500 rounded-3xl p-8 text-white shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-pink-100 text-sm font-medium mb-1">Bienvenue,</p>
              <h1 className="text-3xl font-bold mb-2"
                  style={{ fontFamily: "var(--font-playfair)" }}>
                {session.name} 🥂
              </h1>
              <p className="text-pink-100">
                L&apos;EVJF de Lise se prépare ici, en secret !
              </p>
            </div>
            <div className="text-center bg-white/20 rounded-2xl p-4 backdrop-blur-sm">
              <p className="text-pink-100 text-xs mb-1">Avant le grand jour</p>
              {partyDate ? (
                <Countdown targetDate={partyDate.toISOString()} />
              ) : (
                <p className="text-2xl font-bold">📅 Date TBD</p>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Idées en attente", value: stats.pending, icon: "🕐", color: "bg-amber-50 border-amber-200 text-amber-700" },
            { label: "Idées validées", value: stats.validated, icon: "✅", color: "bg-green-50 border-green-200 text-green-700" },
            { label: "Au programme", value: stats.retained, icon: "⭐", color: "bg-pink-50 border-pink-200 text-pink-700" },
          ].map((s) => (
            <div key={s.label} className={`rounded-2xl border-2 p-4 text-center ${s.color}`}>
              <div className="text-3xl mb-1">{s.icon}</div>
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-xs font-medium mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Dernières idées + Messages */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Dernières idées */}
          <div className="bg-white rounded-2xl border border-pink-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-800 flex items-center gap-2">
                💡 Dernières idées
              </h2>
              <Link href="/lise/idees" className="text-xs text-pink-500 hover:underline">
                Voir tout →
              </Link>
            </div>
            <div className="space-y-3">
              {latestIdeas.length === 0 && (
                <p className="text-gray-400 text-sm text-center py-4">
                  Aucune idée pour l&apos;instant. Sois la première ! 🌟
                </p>
              )}
              {latestIdeas.map((idea) => (
                <Link
                  key={idea.id}
                  href={`/lise/idees`}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-pink-50 transition-colors group"
                >
                  <span className="text-xl">{categoryEmoji(idea.category)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate group-hover:text-pink-600">
                      {idea.title}
                    </p>
                    <p className="text-xs text-gray-400">
                      par {idea.author.name} · {idea._count.votes} vote{idea._count.votes > 1 ? "s" : ""}
                    </p>
                  </div>
                  <StatusBadge status={idea.status} />
                </Link>
              ))}
            </div>
            <Link
              href="/lise/idees/nouvelle"
              className="mt-4 w-full flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
            >
              + Proposer une idée
            </Link>
          </div>

          {/* Messages récents */}
          <div className="bg-white rounded-2xl border border-pink-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-800 flex items-center gap-2">
                💬 Messages récents
              </h2>
              <Link href="/lise/messages" className="text-xs text-pink-500 hover:underline">
                Voir tout →
              </Link>
            </div>
            <div className="space-y-3">
              {latestMessages.length === 0 && (
                <p className="text-gray-400 text-sm text-center py-4">
                  Pas encore de messages. Dis bonjour ! 👋
                </p>
              )}
              {latestMessages.map((msg) => (
                <div key={msg.id} className="p-3 rounded-xl bg-pink-50">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-pink-600">{msg.author.name}</span>
                    <span className="text-xs text-gray-400">
                      {new Date(msg.createdAt).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-2">{msg.content}</p>
                </div>
              ))}
            </div>
            <Link
              href="/lise/messages"
              className="mt-4 w-full flex items-center justify-center gap-2 border-2 border-pink-200 hover:bg-pink-50 text-pink-600 text-sm font-semibold py-2.5 rounded-xl transition-colors"
            >
              Aller aux messages
            </Link>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href: "/lise/idees/nouvelle", icon: "💡", label: "Proposer une idée" },
            { href: "/lise/programme", icon: "📅", label: "Voir le programme" },
            { href: "/lise/budget", icon: "💰", label: "Voir le budget" },
            { href: "/lise/messages", icon: "💬", label: "Écrire un message" },
          ].map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="bg-white border border-pink-100 hover:border-pink-300 hover:bg-pink-50 rounded-2xl p-4 text-center transition-colors group shadow-sm"
            >
              <div className="text-3xl mb-2">{a.icon}</div>
              <p className="text-xs font-semibold text-gray-600 group-hover:text-pink-600">
                {a.label}
              </p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

function categoryEmoji(cat: string) {
  return (
    { ACTIVITY: "🎉", FOOD: "🍽️", TRANSPORT: "🚗", ACCOMMODATION: "🏠", DECO: "🎀", OTHER: "✨" }[cat] ?? "✨"
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    PENDING: { label: "En attente", className: "bg-amber-100 text-amber-700" },
    VALIDATED: { label: "Validée", className: "bg-green-100 text-green-700" },
    REJECTED: { label: "Rejetée", className: "bg-red-100 text-red-600" },
    RETAINED: { label: "Au programme", className: "bg-pink-100 text-pink-700" },
  };
  const s = map[status] ?? map.PENDING;
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.className} whitespace-nowrap`}>
      {s.label}
    </span>
  );
}
