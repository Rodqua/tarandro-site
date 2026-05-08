"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import ImageUpload from "@/components/evjf/ImageUpload";
import AttachmentUpload, { Attachment } from "@/components/evjf/AttachmentUpload";

const CATEGORIES = [
  { value: "ACTIVITY",      label: "Activité",    emoji: "🎉" },
  { value: "FOOD",          label: "Repas & Bar", emoji: "🍽️" },
  { value: "TRANSPORT",     label: "Transport",   emoji: "🚗" },
  { value: "ACCOMMODATION", label: "Hébergement", emoji: "🏠" },
  { value: "DECO",          label: "Déco",        emoji: "🎀" },
  { value: "OTHER",         label: "Autre",       emoji: "✨" },
];

export default function ModifierIdeePage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState({
    title: "", description: "", category: "ACTIVITY",
    estimatedBudget: "", referenceUrl: "", imageUrl: "",
  });
  const [loadingIdea, setLoadingIdea] = useState(true);
  const [error, setError] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/evjf/ideas")
      .then(r => r.json())
      .then((ideas: { id: string; title: string; description: string | null; category: string; estimatedBudget: number | null; referenceUrl: string | null; imageUrl: string | null; attachments: Attachment[] | null }[]) => {
        const idea = ideas.find((i) => i.id === id);
        if (idea) {
          setForm({
            title: idea.title,
            description: idea.description ?? "",
            category: idea.category,
            estimatedBudget: idea.estimatedBudget ? String(idea.estimatedBudget) : "",
            referenceUrl: idea.referenceUrl ?? "",
            imageUrl: idea.imageUrl ?? "",
          });
          if (idea.attachments) setAttachments(idea.attachments as Attachment[]);
        }
        setLoadingIdea(false);
      });
  }, [id]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) { setError("Le titre est obligatoire"); return; }
    setError(""); setSaving(true);
    const res = await fetch(`/api/evjf/ideas/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        description: form.description || null,
        category: form.category,
        estimatedBudget: form.estimatedBudget ? Number(form.estimatedBudget) : null,
        referenceUrl: form.referenceUrl || null,
        imageUrl: form.imageUrl || null,
        attachments: attachments.length > 0 ? attachments : null,
      }),
    });
    if (res.ok) { router.push("/lise/idees"); }
    else { setError((await res.json()).error || "Erreur lors de la sauvegarde"); }
    setSaving(false);
  }

  if (loadingIdea) return <div className="flex justify-center py-20 text-gray-400">Chargement...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-fuchsia-50">
      <div className="bg-white border-b border-pink-100 shadow-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/lise/idees" className="text-gray-400 hover:text-pink-500 transition-colors">← Retour</Link>
          <span className="text-lg font-bold text-pink-600" style={{ fontFamily: "var(--font-outfit)" }}>✏️ Modifier l&apos;idée</span>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl shadow-sm border border-pink-100 p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Photo de présentation</label>
              <ImageUpload value={form.imageUrl} onChange={url => setForm(f => ({ ...f, imageUrl: url }))} />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Titre <span className="text-pink-500">*</span></label>
              <input type="text" maxLength={80} required value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border-2 border-pink-100 focus:border-pink-400 focus:outline-none bg-pink-50 text-gray-800" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
              <textarea rows={4} value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border-2 border-pink-100 focus:border-pink-400 focus:outline-none bg-pink-50 text-gray-800 resize-none" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Catégorie</label>
              <div className="grid grid-cols-3 gap-2">
                {CATEGORIES.map(cat => (
                  <button key={cat.value} type="button" onClick={() => setForm(f => ({ ...f, category: cat.value }))}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${form.category===cat.value ? "border-pink-400 bg-pink-50 shadow-md scale-105" : "border-gray-100 hover:border-pink-200"}`}>
                    <span className="text-2xl">{cat.emoji}</span>
                    <span className="text-xs font-medium text-gray-600">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Budget estimé (€)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">€</span>
                  <input type="number" min="0" value={form.estimatedBudget}
                    onChange={e => setForm(f => ({ ...f, estimatedBudget: e.target.value }))}
                    className="w-full pl-8 pr-4 py-3 rounded-xl border-2 border-pink-100 focus:border-pink-400 focus:outline-none bg-pink-50 text-gray-800" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Lien de référence</label>
                <input type="url" placeholder="https://..." value={form.referenceUrl}
                  onChange={e => setForm(f => ({ ...f, referenceUrl: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border-2 border-pink-100 focus:border-pink-400 focus:outline-none bg-pink-50 text-gray-800 placeholder-gray-300" />
              </div>
            </div>

            {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">{error}</div>}

            <div className="flex gap-3 pt-2">
              <Link href="/lise/idees" className="flex-1 text-center border-2 border-pink-200 text-pink-600 font-semibold py-3 rounded-xl hover:bg-pink-50 transition-colors">
                Annuler
              </Link>
              <button type="submit" disabled={saving}
                className="flex-1 bg-gradient-to-r from-pink-500 to-fuchsia-500 disabled:opacity-60 text-white font-bold py-3 rounded-xl shadow-md hover:opacity-90 transition-all">
                {saving ? "Sauvegarde..." : "Enregistrer ✅"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
