import { getEvjfSession } from "@/lib/evjf-auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import EvjfNav from "@/components/evjf/EvjfNav";
import Countdown from "@/components/evjf/Countdown";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getEvjfSession();
  if (!session) redirect("/lise/login");

  const [ideasStats, latestMessages, latestIdeas, programBlocks] = await Promise.all([
    prisma.evjfIdea.groupBy({ by: ["status"], _count: { id: true } }),
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
        _count: { select: { votes: true } },
      },
    }),
    prisma.evjfProgramBlock.findMany({
      orderBy: [{ day: "asc" }, { order: "asc" }],
    }),
  ]);

  const stats = {
    pending:   ideasStats.find((s) => s.status === "PENDING")?._count.id   ?? 0,
    validated: ideasStats.find((s) => s.status === "VALIDATED")?._count.id ?? 0,
    retained:  ideasStats.find((s) => s.status === "RETAINED")?._count.id  ?? 0,
  };

  const partyDate = process.env.EVJF_PARTY_DATE ? new Date(process.env.EVJF_PARTY_DATE) : null;
  const totalBudget = programBlocks.reduce((acc, b) => acc + (b.budget ?? 0), 0);

  return (
    <div className="min-h-screen">
      <EvjfNav userName={session.name} role={session.role} />

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">

        {/* Hero */}
        <div className="bg-gradient-to-r from-pink-500 to-fuchsia-500 rounded-3xl p-8 text-white shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-pink-100 text-sm font-medium mb-1">Espace secret EVJF 🤫</p>
              <h1 className="text-3xl font-bold mb-1" style={{ fontFamily: "var(--font-outfit)" }}>
                Salut {session.name} 🥂
              </h1>
              <p className="text-pink-100 text-sm">On prépare quelque chose de mémorable pour Lise !</p>
            </div>
            <div className="text-center bg-white/20 rounded-2xl p-4 backdrop-blur-sm min-w-[180px]">
              {partyDate ? (
                <>
                  <p className="text-pink-100 text-xs mb-2 font-medium">Avant le grand jour 🎉</p>
                  <Countdown targetDate={partyDate.toISOString()} />
                </>
              ) : (
                <p className="text-white/70 text-sm">📅 Date à définir</p>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Idées en attente", value: stats.pending,   icon: "🕐", color: "bg-amber-50 border-amber-200 text-amber-700" },
            { label: "Idées validées",   value: stats.validated, icon: "✅", color: "bg-green-50 border-green-200 text-green-700" },
            { label: "Au programme",     value: programBlocks.length, icon: "📅", color: "bg-blue-50 border-blue-200 text-blue-700" },
            { label: "Budget programme", value: totalBudget > 0 ? `${totalBudget}€` : "—", icon: "💰", color: "bg-pink-50 border-pink-200 text-pink-700" },
          ].map((s) => (
            <div key={s.label} className={`rounded-2xl border-2 p-4 text-center ${s.color}`}>
              <div className="text-3xl mb-1">{s.icon}</div>
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-xs font-medium mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Programme aperçu + Idées récentes */}
        <div className="grid md:grid-cols-2 gap-5">

          {/* Programme */}
          <div className="bg-white rounded-2xl border border-pink-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-800">📅 Programme</h2>
              <Link href="/lise/programme" className="text-xs text-pink-500 hover:underline">Voir tout →</Link>
            </div>
            {programBlocks.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-400 text-sm">Programme en cours de construction…</p>
                {session.role === "ORGANIZER" && (
                  <Link href="/lise/programme/nouveau-bloc" className="mt-3 inline-block text-sm text-pink-500 hover:underline font-medium">
                    + Ajouter le premier bloc
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {programBlocks.slice(0, 4).map((block) => (
                  <div key={block.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-pink-50">
                    <div className="text-center w-12 flex-shrink-0">
                      <span className="text-xs font-bold text-pink-500 block">{block.startTime}</span>
                      <span className="text-xs text-gray-300">{block.endTime}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{block.title}</p>
                      {block.location && <p className="text-xs text-gray-400 truncate">📍 {block.location}</p>}
                    </div>
                  </div>
                ))}
                {programBlocks.length > 4 && (
                  <p className="text-xs text-center text-gray-400 pt-1">+{programBlocks.length - 4} autres blocs</p>
                )}
              </div>
            )}
          </div>

          {/* Idées récentes */}
          <div className="bg-white rounded-2xl border border-pink-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-800">💡 Idées récentes</h2>
              <Link href="/lise/idees" className="text-xs text-pink-500 hover:underline">Voir tout →</Link>
            </div>
            {latestIdeas.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-6">Aucune idée pour l&apos;instant 🌟</p>
            ) : (
              <div className="space-y-2">
                {latestIdeas.map((idea) => (
                  <Link key={idea.id} href="/lise/idees"
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-pink-50 transition-colors group">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate group-hover:text-pink-600">{idea.title}</p>
                      <p className="text-xs text-gray-400">par {idea.author.name} · {idea._count.votes} vote{idea._count.votes > 1 ? "s" : ""}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${
                      idea.status === "PENDING" ? "bg-amber-100 text-amber-700" :
                      idea.status === "VALIDATED" ? "bg-green-100 text-green-700" : "bg-pink-100 text-pink-700"
                    }`}>
                      {idea.status === "PENDING" ? "En attente" : idea.status === "VALIDATED" ? "Validée ✅" : "⭐ Retenue"}
                    </span>
                  </Link>
                ))}
              </div>
            )}
            <Link href="/lise/idees/nouvelle"
              className="mt-3 w-full flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors">
              + Proposer une idée
            </Link>
          </div>
        </div>

        {/* Messages récents */}
        <div className="bg-white rounded-2xl border border-pink-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800">💬 Messages récents</h2>
            <Link href="/lise/messages" className="text-xs text-pink-500 hover:underline">Voir tout →</Link>
          </div>
          {latestMessages.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">Pas encore de messages. Dis bonjour ! 👋</p>
          ) : (
            <div className="grid sm:grid-cols-3 gap-3">
              {latestMessages.map((msg) => (
                <div key={msg.id} className="p-3 rounded-xl bg-pink-50 border border-pink-100">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-pink-600">{msg.author.name}</span>
                    <span className="text-xs text-gray-400">{new Date(msg.createdAt).toLocaleDateString("fr-FR")}</span>
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-3">{msg.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href: "/lise/idees/nouvelle",       icon: "💡", label: "Proposer une idée" },
            { href: "/lise/programme",            icon: "📅", label: "Voir le programme" },
            { href: "/lise/budget",               icon: "💰", label: "Budget" },
            { href: "/lise/messages",             icon: "💬", label: "Messages" },
          ].map((a) => (
            <Link key={a.href} href={a.href}
              className="bg-white border border-pink-100 hover:border-pink-300 hover:bg-pink-50 rounded-2xl p-4 text-center transition-colors group shadow-sm">
              <div className="text-3xl mb-2">{a.icon}</div>
              <p className="text-xs font-semibold text-gray-600 group-hover:text-pink-600">{a.label}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
