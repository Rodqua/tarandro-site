import { getEvjfSession } from "@/lib/evjf-auth";
import { redirect } from "next/navigation";
import EvjfNav from "@/components/evjf/EvjfNav";
import AdminPanel from "@/components/evjf/AdminPanel";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  const session = await getEvjfSession();
  if (!session) redirect("/lise/login");
  if (session.role !== "ORGANIZER") redirect("/lise/dashboard");

  const users = await prisma.evjfUser.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div className="min-h-screen">
      <EvjfNav userName={session.name} role={session.role} />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6" style={{ fontFamily: "var(--font-outfit)" }}>
          ⚙️ Administration EVJF
        </h1>
        <AdminPanel users={users} />
      </main>
    </div>
  );
}
