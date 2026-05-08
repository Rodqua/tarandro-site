import { getEvjfSession } from "@/lib/evjf-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EvjfNav from "@/components/evjf/EvjfNav";
import ProgrammeView from "@/components/evjf/ProgrammeView";

export default async function ProgrammePage() {
  const session = await getEvjfSession();
  if (!session) redirect("/lise/login");

  const blocks = await prisma.evjfProgramBlock.findMany({
    orderBy: [{ day: "asc" }, { order: "asc" }, { startTime: "asc" }],
  });

  return (
    <div className="min-h-screen">
      <EvjfNav userName={session.name} role={session.role} />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-800" style={{ fontFamily: "var(--font-playfair)" }}>
              📅 Le Programme
            </h1>
            <p className="text-gray-500 text-sm mt-1">Le planning officiel de l&apos;EVJF de Lise ✨</p>
          </div>
          {session.role === "ORGANIZER" && (
            <a
              href="/lise/programme/nouveau-bloc"
              className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors shadow-md"
            >
              + Ajouter un bloc
            </a>
          )}
        </div>
        <ProgrammeView
          initialBlocks={blocks}
          isOrganizer={session.role === "ORGANIZER"}
        />
      </main>
    </div>
  );
}
