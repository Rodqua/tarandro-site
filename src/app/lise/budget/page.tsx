import { getEvjfSession } from "@/lib/evjf-auth";
import { redirect } from "next/navigation";
import EvjfNav from "@/components/evjf/EvjfNav";

export default async function BudgetPage() {
  const session = await getEvjfSession();
  if (!session) redirect("/lise/login");

  return (
    <div className="min-h-screen">
      <EvjfNav userName={session.name} role={session.role} />
      <main className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="text-7xl mb-6">💰</div>
        <h1 className="text-2xl font-bold text-gray-700 mb-3" style={{ fontFamily: "var(--font-playfair)" }}>
          Budget — Bientôt disponible !
        </h1>
        <p className="text-gray-400 max-w-md mx-auto">
          Cette section est en cours de développement. Reviens vite !
        </p>
      </main>
    </div>
  );
}
