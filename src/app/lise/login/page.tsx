"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Image from "next/image";

type Participant = { name: string; avatarUrl: string | null; role: string };

const AVATAR_COLORS = [
  "bg-fuchsia-400","bg-pink-400","bg-rose-400",
  "bg-purple-400","bg-amber-400","bg-teal-400","bg-blue-400",
];
function getColor(name: string) {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) % AVATAR_COLORS.length;
  return AVATAR_COLORS[h];
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/lise/dashboard";

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/evjf/auth/participants")
      .then(r => r.ok ? r.json() : [])
      .then(setParticipants)
      .catch(() => {});
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setError("Sélectionne ton prénom !"); return; }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/evjf/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Erreur de connexion"); return; }
      router.push(from);
    } catch {
      setError("Erreur réseau, réessaie !");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-50 to-fuchsia-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">💍</div>
            <h1 className="text-2xl font-bold text-pink-600 mb-1"
                style={{ fontFamily: "var(--font-outfit)" }}>
              Bienvenue !
            </h1>
            <p className="text-gray-400 text-sm">Qui es-tu ? 👇</p>
          </div>

          {/* Avatar grid */}
          {participants.length > 0 && (
            <div className="grid grid-cols-4 gap-3 mb-6">
              {participants.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => setName(p.name)}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl transition-all ${
                    name === p.name
                      ? "bg-pink-50 ring-2 ring-fuchsia-400 scale-105 shadow-md"
                      : "hover:bg-gray-50 hover:scale-102"
                  }`}
                >
                  <div className="relative">
                    {p.avatarUrl ? (
                      <div className="w-14 h-14 rounded-full overflow-hidden relative">
                        <Image src={p.avatarUrl} alt={p.name} fill className="object-cover" sizes="56px" />
                      </div>
                    ) : (
                      <div className={`w-14 h-14 rounded-full ${getColor(p.name)} text-white flex items-center justify-center text-xl font-bold`}>
                        {p.name[0].toUpperCase()}
                      </div>
                    )}
                    {p.role === "ORGANIZER" && (
                      <span className="absolute -top-1 -right-1 text-sm">👑</span>
                    )}
                    {name === p.name && (
                      <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-fuchsia-500 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                    )}
                  </div>
                  <span className={`text-xs font-medium truncate w-full text-center ${name === p.name ? "text-fuchsia-600" : "text-gray-600"}`}>
                    {p.name}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Fallback text input si pas de participants chargés */}
          {participants.length === 0 && (
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Ton prénom</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex : Simon, Louis…"
                autoFocus
                className="w-full px-4 py-3 rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none transition-colors text-gray-800 placeholder-gray-300 bg-pink-50"
              />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Le mot de passe commun"
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none transition-colors text-gray-800 placeholder-gray-300 bg-pink-50"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="w-full bg-gradient-to-r from-pink-500 to-fuchsia-500 hover:from-pink-600 hover:to-fuchsia-600 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              {loading ? "Connexion..." : name ? `Entrer en tant que ${name} ✨` : "Sélectionne ton prénom"}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-5">
            Tu n&apos;as pas le mot de passe ? Contacte Bibi 💌
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
