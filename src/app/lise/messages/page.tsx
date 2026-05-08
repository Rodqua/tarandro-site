import { getEvjfSession } from "@/lib/evjf-auth";
import { redirect } from "next/navigation";
import EvjfNav from "@/components/evjf/EvjfNav";
import MessagesView from "@/components/evjf/MessagesView";

export default async function MessagesPage() {
  const session = await getEvjfSession();
  if (!session) redirect("/lise/login");

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-fuchsia-50 flex flex-col">
      <EvjfNav userName={session.name} role={session.role} />
      <div className="flex-1 max-w-2xl w-full mx-auto px-0 sm:px-4">
        <div className="px-4 py-4 sm:px-0">
          <h1 className="text-2xl font-bold text-gray-800" style={{ fontFamily: "var(--font-playfair)" }}>
            💬 Messages
          </h1>
          <p className="text-gray-500 text-sm mt-1">Le chat du groupe — tout le monde peut écrire ici</p>
        </div>
        <MessagesView
          isOrganizer={session.role === "ORGANIZER"}
          currentUserId={session.sub}
          currentUserName={session.name}
        />
      </div>
    </div>
  );
}
