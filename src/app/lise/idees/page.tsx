import { getEvjfSession } from "@/lib/evjf-auth";
import { redirect } from "next/navigation";
import EvjfNav from "@/components/evjf/EvjfNav";
import IdeesList from "@/components/evjf/IdeesList";

export default async function IdeesPage() {
  const session = await getEvjfSession();
  if (!session) redirect("/lise/login");

  return (
    <div className="min-h-screen">
      <EvjfNav userName={session.name} role={session.role} />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800" style={{ fontFamily: "var(--font-outfit)" }}>
              💡 Les Idées
            </h1>
            <p className="text-gray-500 text-sm mt-1">Vote pour les activités qui te plaisent !</p>
          </div>
          <a
            href="/lise/idees/nouvelle"
            className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors shadow-md"
          >
            + Proposer
          </a>
        </div>
        <IdeesList currentUserId={session.sub} currentUserRole={session.role} />
      </main>
    </div>
  );
}
