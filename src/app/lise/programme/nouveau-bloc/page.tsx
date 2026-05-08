"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
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

export default function NouveauBlocPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    startTime: "10:00",
    endTime: "11:00",
    category: "ACTIVITY",
    location: "",
    locationUrl: "",
    notes: "",
    imageUrl: "",
    budget: "",
    day: "1",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) { setError("Le titre est obligatoire"); return; }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/evjf/programme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          budget: form.budget ? Number(form.budget) : null,
          day: Number(form.day),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Erreur");
        return;
      }
      router.push("/lise/programme");
    } catch {
      setError("Erreur réseau");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen">
      <div className="bg-white border-b border-pink-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/lise/programme" className="text-gray-400 hover:text-pink-500">← Retour</Link>
          <span className="text-lg font-bold text-pink-600" style={{ fontFamily: "var(--font-outfit)" }}>
            📅 Nouveau bloc programme
          </span>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl shadow-sm border border-pink-100 p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Photo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Photo de présentation</label>
              <ImageUpload
                value={form.imageUrl}
                onChange={url => setForm(f => ({ ...f, imageUrl: url }))}
                label="Ajouter une photo pour ce bloc"
              />
            </div>

            {/* Titre */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Titre <span className="text-pink-500">*</span></label>
              <input type="text" required placeholder="Ex : Spa détente, Déjeuner sur le port..." value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border-2 border-pink-100 focus:border-pink-400 focus:outline-none bg-pink-50 text-gray-800" />
            </div>

            {/* Horaires + Jour */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Début <span className="text-pink-500">*</span></label>
                <input type="time" required value={form.startTime} onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border-2 border-pink-100 focus:border-pink-400 focus:outline-none bg-pink-50 text-gray-800" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Fin <span className="text-pink-500">*</span></label>
                <input type="time" required value={form.endTime} onChange={(e) => setForm((f) => ({ ...f, endTime: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border-2 border-pink-100 focus:border-pink-400 focus:outline-none bg-pink-50 text-gray-800" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Jour</label>
                <select value={form.day} onChange={(e) => setForm((f) => ({ ...f, day: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border-2 border-pink-100 focus:border-pink-400 focus:outline-none bg-pink-50 text-gray-800">
                  {[1, 2, 3].map((d) => <option key={d} value={d}>Jour {d}</option>)}
                </select>
              </div>
            </div>

            {/* Catégorie */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Catégorie <span className="text-pink-500">*</span></label>
              <div className="grid grid-cols-3 gap-2">
                {CATEGORIES.map((cat) => (
                  <button key={cat.value} type="button" onClick={() => setForm((f) => ({ ...f, category: cat.value }))}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${form.category === cat.value ? "border-pink-400 bg-pink-50 shadow-md scale-105" : "border-gray-100 hover:border-pink-200"}`}>
                    <span className="text-2xl">{cat.emoji}</span>
                    <span className="text-xs font-medium text-gray-600">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
              <textarea rows={2} placeholder="Quelques mots sur l'activité..." value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border-2 border-pink-100 focus:border-pink-400 focus:outline-none bg-pink-50 text-gray-800 resize-none" />
            </div>

            {/* Lieu + Budget */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Lieu</label>
                <input type="text" placeholder="Ex : Spa du Port, Caen" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border-2 border-pink-100 focus:border-pink-400 focus:outline-none bg-pink-50 text-gray-800" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Budget (€)</label>
                <input type="number" min="0" placeholder="Ex : 120" value={form.budget} onChange={(e) => setForm((f) => ({ ...f, budget: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border-2 border-pink-100 focus:border-pink-400 focus:outline-none bg-pink-50 text-gray-800" />
              </div>
            </div>

            {/* Lien Maps */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Lien Google Maps</label>
              <input type="url" placeholder="https://maps.google.com/..." value={form.locationUrl} onChange={(e) => setForm((f) => ({ ...f, locationUrl: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border-2 border-pink-100 focus:border-pink-400 focus:outline-none bg-pink-50 text-gray-800" />
            </div>

            {/* Notes internes */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Notes internes <span className="text-gray-400 font-normal">(visible seulement par toi)</span>
              </label>
              <textarea rows={2} placeholder="Réservation à confirmer, contact prestataire..." value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border-2 border-amber-100 focus:border-amber-400 focus:outline-none bg-amber-50 text-gray-800 resize-none" />
            </div>

            {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">{error}</div>}

            <div className="flex gap-3 pt-2">
              <Link href="/lise/programme" className="flex-1 text-center border-2 border-pink-200 text-pink-600 font-semibold py-3 rounded-xl hover:bg-pink-50 transition-colors">Annuler</Link>
              <button type="submit" disabled={loading}
                className="flex-1 bg-gradient-to-r from-pink-500 to-fuchsia-500 hover:from-pink-600 hover:to-fuchsia-600 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-all shadow-md">
                {loading ? "Ajout..." : "Ajouter au programme 📅"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
