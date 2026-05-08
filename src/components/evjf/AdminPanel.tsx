"use client";

type User = { id: string; name: string; role: string; isActive: boolean; createdAt: Date };

export default function AdminPanel({ users }: { users: User[] }) {
  return (
    <div className="space-y-6">
      {/* Participants */}
      <div className="bg-white rounded-2xl border border-pink-100 shadow-sm p-6">
        <h2 className="font-bold text-gray-700 mb-4">👥 Participantes ({users.length})</h2>
        <div className="space-y-2">
          {users.map((u) => (
            <div key={u.id} className="flex items-center justify-between p-3 rounded-xl bg-pink-50 border border-pink-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-pink-200 flex items-center justify-center font-bold text-pink-700 text-sm">
                  {u.name[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{u.name}</p>
                  <p className="text-xs text-gray-400">{u.role === "ORGANIZER" ? "👑 Organisatrice" : "🥂 Participante"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {u.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Infos */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
        <p className="text-sm text-amber-700 font-medium">💡 Pour ajouter des participantes</p>
        <p className="text-xs text-amber-600 mt-1">
          Lance <code className="bg-amber-100 px-1 rounded">npx tsx prisma/seed-evjf.ts</code> avec la liste des prénoms à ajouter dans le fichier de seed.
        </p>
      </div>
    </div>
  );
}
