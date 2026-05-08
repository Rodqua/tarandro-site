"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const CATEGORIES = [
  { value: "ACTIVITY",      label: "Activité",    emoji: "🎉" },
  { value: "FOOD",          label: "Repas & Bar", emoji: "🍽️" },
  { value: "TRANSPORT",     label: "Transport",   emoji: "🚗" },
  { value: "ACCOMMODATION", label: "Hébergement", emoji: "🏠" },
  { value: "DECO",          label: "Déco",        emoji: "🎀" },
  { value: "OTHER",         label: "Autre",       emoji: "✨" },
];

export default function NouvelleIdeePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "ACTIVITY",
    estimatedBudget: "",
    referenceUrl: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) { setError("Le titre est obligatoire"); return; }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/evjf/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          estimatedBudget: form.estimatedBudget ? Number(form.estimatedBudget) : null,
          referenceUrl: form.referenceUrl || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Erreur");
        return;
      }
      router.push("/lise/idees");
    } catch {
      setError("Erreur réseau");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen">
      {/* Mini header */}
      <div className="bg-white border-b border-pink-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/lise/idees" className="text-gray-400 hover:text-pink-500 transition-colors">← Retour</Link>
          <span className="text-lg font-bold text-pink-600" style={{ fontFamily: "var(--font-playfair)" }}>
            💡 Proposer une idée
          </span>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl shadow-sm border border-pink-100 p-6 md:p-8">
          <p className="text-gray-500 text-sm mb-6">
            Tu as une super idée pour l&apos;EVJF de Lise ? Lance-toi ! Les autres voteront pour ou contre 🥂
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Titre */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Titre de l&apos;idée <span className="text-pink-500">*</span>
              </label>
              <input
                type="text"
                maxLength={80}
                placeholder="Ex : Cours de poterie, Spa journée, Escape game..."
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border-2 border-pink-100 focus:border-pink-400 focus:outline-none bg-pink-50 text-gray-800 placeholder-gray-300"
                required
              />
              <span className="text-xs text-gray-400 mt-1 block text-right">{form.title.length}/80</span>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description (optionnel)</label>
              <textarea
                rows={3}
                placeholder="Décris l'idée, pourquoi tu la proposes, ce qui sera mémorable..."
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border-2 border-pink-100 focus:border-pink-400 focus:outline-none bg-pink-50 text-gray-800 placeholder-gray-300 resize-none"
              />
            </div>

            {/* Catégorie */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Catégorie <span className="text-pink-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, category: cat.value }))}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${
                      form.category === cat.value
                        ? "border-pink-400 bg-pink-50 shadow-md scale-105"
                        : "border-gray-100 hover:border-pink-200 hover:bg-pink-50"
                    }`}
                  >
                    <span className="text-2xl">{cat.emoji}</span>
                    <span className="text-xs font-medium text-gray-600">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Budget estimé */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Budget estimé (€) <span className="text-gray-400 font-normal">— optionnel</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">€</span>
                <input
                  type="number"
                  min="0"
                  placeholder="Ex : 50"
                  value={form.estimatedBudget}
                  onChange={(e) => setForm((f) => ({ ...f, estimatedBudget: e.target.value }))}
                  className="w-full pl-8 pr-4 py-3 rounded-xl border-2 border-pink-100 focus:border-pink-400 focus:outline-none bg-pink-50 text-gray-800"
                />
              </div>
            </div>

            {/* Lien */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Lien de référence <span className="text-gray-400 font-normal">— optionnel</span>
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={form.referenceUrl}
                onChange={(e) => setForm((f) => ({ ...f, referenceUrl: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border-2 border-pink-100 focus:border-pink-400 focus:outline-none bg-pink-50 text-gray-800 placeholder-gray-300"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Link
                href="/lise/idees"
                className="flex-1 text-center border-2 border-pink-200 text-pink-600 font-semibold py-3 rounded-xl hover:bg-pink-50 transition-colors"
              >
                Annuler
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-pink-500 to-fuchsia-500 hover:from-pink-600 hover:to-fuchsia-600 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-all shadow-md"
              >
                {loading ? "Envoi..." : "Proposer l'idée 🚀"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
