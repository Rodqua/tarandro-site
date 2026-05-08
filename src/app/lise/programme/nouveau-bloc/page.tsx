"use client";

import { useState, FormEvent, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import ImageUpload from "@/components/evjf/ImageUpload";

const CATEGORIES = [
  { value: "ACTIVITY",      label: "Activité",    emoji: "🎉" },
  { value: "FOOD",          label: "Repas & Bar", emoji: "🍽️" },
  { value: "TRANSPORT",     label: "Transport",   emoji: "🚗" },
  { value: "ACCOMMODATION", label: "Hébergement", emoji: "🏠" },
  { value: "DECO",          label: "Déco",        emoji: "🎀" },
  { value: "OTHER",         label: "Autre",       emoji: "✨" },
];

type User = { id: string; name: string };

function NouveauBlocForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState({
    title: searchParams.get("title") ?? "",
    description: searchParams.get("description") ?? "",
    startTime: "10:00", endTime: "11:00",
    category: searchParams.get("category") ?? "ACTIVITY",
    location: "", locationUrl: "",
    imageUrl: searchParams.get("imageUrl") ?? "",
    budget: searchParams.get("budget") ?? "",
    paidById: "", isPaid: false,
    notes: "", day: "1",
    createBudgetItem: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fromIdea = searchParams.get("ideaId");

  useEffect(() => {
    fetch("/api/evjf/users")
      .then(r => r.ok ? r.json() : [])
      .then(setUsers);
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) { setError("Le titre est obligatoire"); return; }
    setError(""); setLoading(true);
    try {
      const payload = {
        title: form.title,
        description: form.description || null,
        startTime: form.startTime,
        endTime: form.endTime,
        category: form.category,
        location: form.location || null,
        locationUrl: form.locationUrl || null,
        imageUrl: form.imageUrl || null,
        budget: form.budget ? Number(form.budget) : null,
        paidById: form.paidById || null,
        isPaid: form.isPaid,
        notes: form.notes || null,
        day: Number(form.day),
        createBudgetItem: form.createBudgetItem && !!form.budget,
      };
      const res = await fetch("/api/evjf/programme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) { setError((await res.json()).error || "Erreur"); return; }
      router.push("/lise/programme");
    } catch { setError("Erreur réseau"); }
    finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-fuchsia-50">
      <div className="bg-white border-b border-pink-100 shadow-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/lise/programme" className="text-gray-400 hover:text-pink-500 transition-colors">← Retour</Link>
          <span className="text-lg font-bold text-pink-600" style={{ fontFamily: "var(--font-outfit)" }}>
            📅 {fromIdea ? "Ajouter au programme" : "Nouveau bloc"}
          </span>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {fromIdea && (
          <div className="mb-4 bg-fuchsia-50 border border-fuchsia-200 rounded-2xl px-4 py-3 text-sm text-fuchsia-700">
            💡 Pré-rempli depuis l&apos;idée — vérifie les informations et complète le planning.
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-sm border border-pink-100 p-6 md:p-8 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Photo */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Photo de présentation</label>
              <ImageUpload value={form.imageUrl} onChange={url => setForm(f => ({ ...f, imageUrl: url }))} label="Ajouter une photo" />
            </div>

            {/* Titre */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Titre <span className="text-pink-500">*</span></label>
              <input type="text" required maxLength={80} value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border-2 border-pink-100 focus:border-pink-400 focus:outline-none bg-pink-50 text-gray-800" />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
              <textarea rows={3} value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border-2 border-pink-100 focus:border-pink-400 focus:outline-none bg-pink-50 text-gray-800 resize-none" />
            </div>

            {/* Catégorie */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Catégorie</label>
              <div className="grid grid-cols-3 gap-2">
                {CATEGORIES.map(cat => (
                  <button key={cat.value} type="button" onClick={() => setForm(f => ({ ...f, category: cat.value }))}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${form.category===cat.value ? "border-pink-400 bg-pink-50 shadow-md" : "border-gray-100 hover:border-pink-200"}`}>
                    <span className="text-2xl">{cat.emoji}</span>
                    <span className="text-xs font-medium text-gray-600">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Jour + Horaires */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Jour</label>
                <select value={form.day} onChange={e => setForm(f => ({ ...f, day: e.target.value }))}
                  className="w-full px-3 py-3 rounded-xl border-2 border-pink-100 focus:border-pink-400 focus:outline-none bg-pink-50 text-gray-800">
                  <option value="1">Jour 1 — Jeudi</option>
                  <option value="2">Jour 2 — Vendredi</option>
                  <option value="3">Jour 3 — Samedi</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Début</label>
                <input type="time" value={form.startTime} onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))}
                  className="w-full px-3 py-3 rounded-xl border-2 border-pink-100 focus:border-pink-400 focus:outline-none bg-pink-50 text-gray-800" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Fin</label>
                <input type="time" value={form.endTime} onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))}
                  className="w-full px-3 py-3 rounded-xl border-2 border-pink-100 focus:border-pink-400 focus:outline-none bg-pink-50 text-gray-800" />
              </div>
            </div>

            {/* Lieu */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Lieu</label>
                <input type="text" placeholder="Nom de l'endroit" value={form.location}
                  onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border-2 border-pink-100 focus:border-pink-400 focus:outline-none bg-pink-50 text-gray-800 placeholder-gray-300" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Google Maps</label>
                <input type="url" placeholder="https://maps.google.com/..." value={form.locationUrl}
                  onChange={e => setForm(f => ({ ...f, locationUrl: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border-2 border-pink-100 focus:border-pink-400 focus:outline-none bg-pink-50 text-gray-800 placeholder-gray-300" />
              </div>
            </div>

            {/* Budget & Paiement */}
            <div className="border-2 border-fuchsia-100 rounded-2xl p-4 bg-fuchsia-50/40 space-y-4">
              <h3 className="font-semibold text-fuchsia-700 text-sm">💰 Budget & Paiement</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Coût total (€)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">€</span>
                    <input type="number" min="0" step="0.01" placeholder="0.00" value={form.budget}
                      onChange={e => setForm(f => ({ ...f, budget: e.target.value }))}
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl border-2 border-fuchsia-100 focus:border-fuchsia-400 focus:outline-none bg-white text-gray-800" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Avancé par</label>
                  <select value={form.paidById} onChange={e => setForm(f => ({ ...f, paidById: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border-2 border-fuchsia-100 focus:border-fuchsia-400 focus:outline-none bg-white text-gray-800">
                    <option value="">— Personne définie —</option>
                    {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isPaid} onChange={e => setForm(f => ({ ...f, isPaid: e.target.checked }))}
                    className="w-4 h-4 rounded accent-fuchsia-500" />
                  <span className="text-sm text-gray-700">Déjà réglé</span>
                </label>
                {form.budget && (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.createBudgetItem} onChange={e => setForm(f => ({ ...f, createBudgetItem: e.target.checked }))}
                      className="w-4 h-4 rounded accent-fuchsia-500" />
                    <span className="text-sm text-gray-700">Ajouter automatiquement au budget</span>
                  </label>
                )}
              </div>
            </div>

            {/* Notes internes */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Notes internes (organisateur)</label>
              <textarea rows={2} placeholder="Infos privées, contacts, accès..." value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border-2 border-pink-100 focus:border-pink-400 focus:outline-none bg-pink-50 text-gray-800 resize-none" />
            </div>

            {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">{error}</div>}

            <div className="flex gap-3 pt-2">
              <Link href="/lise/programme" className="flex-1 text-center border-2 border-pink-200 text-pink-600 font-semibold py-3 rounded-xl hover:bg-pink-50 transition-colors">
                Annuler
              </Link>
              <button type="submit" disabled={loading}
                className="flex-1 bg-gradient-to-r from-pink-500 to-fuchsia-500 disabled:opacity-60 text-white font-bold py-3 rounded-xl shadow-md hover:opacity-90 transition-all">
                {loading ? "Création..." : "Créer le bloc 📅"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default function NouveauBlocPage() {
  return <Suspense><NouveauBlocForm /></Suspense>;
}
