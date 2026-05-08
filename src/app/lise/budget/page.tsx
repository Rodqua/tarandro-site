import { getEvjfSession } from "@/lib/evjf-auth";
import { redirect } from "next/navigation";
import EvjfNav from "@/components/evjf/EvjfNav";
import BudgetView from "@/components/evjf/BudgetView";

export default async function BudgetPage() {
  const session = await getEvjfSession();
  if (!session) redirect("/lise/login");

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-fuchsia-50">
      <EvjfNav userName={session.name} role={session.role} />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800" style={{ fontFamily: "var(--font-outfit)" }}>
            💰 Budget EVJF
          </h1>
          <p className="text-gray-500 text-sm mt-1">Suivi des dépenses et répartition par personne</p>
        </div>
        <BudgetView isOrganizer={session.role === "ORGANIZER"} currentUserId={session.sub} />
      </main>
    </div>
  );
}
