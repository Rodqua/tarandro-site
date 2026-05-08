"use client";

import Image from "next/image";
import AttachmentList from "@/components/evjf/AttachmentList";
import { Attachment } from "@/components/evjf/AttachmentUpload";

import { useState, useCallback } from "react";

type Block = {
  id: string;
  title: string;
  description: string | null;
  startTime: string;
  endTime: string;
  category: string;
  location: string | null;
  locationUrl: string | null;
  imageUrl: string | null;
  notes: string | null;
  budget: number | null;
  order: number;
  attachments: Attachment[] | null;
  day: number;
};

const CAT: Record<string, { emoji: string; label: string; color: string }> = {
  ACTIVITY:      { emoji: "🎉", label: "Activité",    color: "from-pink-400 to-rose-400" },
  FOOD:          { emoji: "🍽️", label: "Repas & Bar", color: "from-orange-400 to-amber-400" },
  TRANSPORT:     { emoji: "🚗", label: "Transport",   color: "from-blue-400 to-sky-400" },
  ACCOMMODATION: { emoji: "🏠", label: "Hébergement", color: "from-green-400 to-emerald-400" },
  DECO:          { emoji: "🎀", label: "Déco",        color: "from-fuchsia-400 to-purple-400" },
  OTHER:         { emoji: "✨", label: "Autre",       color: "from-gray-400 to-slate-400" },
};

export default function ProgrammeView({
  initialBlocks,
  isOrganizer,
}: {
  initialBlocks: Block[];
  isOrganizer: boolean;
}) {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Block>>({});
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);
  const [printMode, setPrintMode] = useState(false);

  // Grouper par jour
  const days = Array.from(new Set(blocks.map((b) => b.day))).sort();

  // ── Drag & drop ────────────────────────────────────────────────────────────
  function handleDragStart(id: string) { setDragId(id); }
  function handleDragOver(e: React.DragEvent, id: string) {
    e.preventDefault();
    setDragOverId(id);
  }
  async function handleDrop(targetId: string, day: number) {
    if (!dragId || dragId === targetId) { setDragId(null); setDragOverId(null); return; }

    const dayBlocks = blocks.filter((b) => b.day === day).sort((a, b) => a.order - b.order);
    const dragIdx = dayBlocks.findIndex((b) => b.id === dragId);
    const targetIdx = dayBlocks.findIndex((b) => b.id === targetId);
    if (dragIdx === -1 || targetIdx === -1) { setDragId(null); setDragOverId(null); return; }

    const reordered = [...dayBlocks];
    const [moved] = reordered.splice(dragIdx, 1);
    reordered.splice(targetIdx, 0, moved);
    const orderedIds = reordered.map((b) => b.id);

    // Optimistic update
    const updated = blocks.map((b) => {
      const idx = orderedIds.indexOf(b.id);
      return idx !== -1 ? { ...b, order: idx } : b;
    });
    setBlocks(updated);
    setDragId(null);
    setDragOverId(null);

    await fetch("/api/evjf/programme/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderedIds }),
    });
  }

  // ── Edit ────────────────────────────────────────────────────────────────────
  function startEdit(block: Block) {
    setEditingId(block.id);
    setEditForm({ ...block });
  }

  async function saveEdit() {
    if (!editingId) return;
    setSaving(true);
    const res = await fetch(`/api/evjf/programme/${editingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    if (res.ok) {
      const updated = await res.json();
      setBlocks((prev) => prev.map((b) => (b.id === editingId ? updated : b)));
    }
    setEditingId(null);
    setSaving(false);
  }

  // ── Delete ──────────────────────────────────────────────────────────────────
  async function deleteBlock(id: string) {
    if (!confirm("Supprimer ce bloc du programme ?")) return;
    setDeletingId(id);
    await fetch(`/api/evjf/programme/${id}`, { method: "DELETE" });
    setBlocks((prev) => prev.filter((b) => b.id !== id));
    setDeletingId(null);
  }

  // ── Duplicate ───────────────────────────────────────────────────────────────
  async function duplicateBlock(block: Block) {
    setDuplicatingId(block.id);
    const res = await fetch("/api/evjf/programme", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: `${block.title} (copie)`,
        description: block.description,
        startTime: block.startTime,
        endTime: block.endTime,
        category: block.category,
        location: block.location,
        locationUrl: block.locationUrl,
        imageUrl: block.imageUrl,
        notes: block.notes,
        budget: block.budget,
        day: block.day,
        order: block.order + 1,
      }),
    });
    if (res.ok) {
      const newBlock = await res.json();
      setBlocks((prev) => [...prev, newBlock]);
    }
    setDuplicatingId(null);
  }

  // ── Refresh depuis le serveur ───────────────────────────────────────────────
  const refresh = useCallback(async () => {
    const res = await fetch("/api/evjf/programme");
    if (res.ok) setBlocks(await res.json());
  }, []);

  // ── Empty state ─────────────────────────────────────────────────────────────
  if (blocks.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">📅</div>
        <h2 className="text-xl font-bold text-gray-600 mb-2">Programme vide</h2>
        <p className="text-gray-400 mb-6">
          {isOrganizer
            ? "Commence à construire le planning en ajoutant des blocs !"
            : "L'organisateur n'a pas encore défini le programme. Reviens bientôt !"}
        </p>
        {isOrganizer && (
          <a
            href="/lise/programme/nouveau-bloc"
            className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-md"
          >
            + Ajouter le premier bloc
          </a>
        )}
      </div>
    );
  }

  return (
    <div>
      {/* Bouton impression */}
      <div className="flex justify-end mb-4 gap-2">
        <button
          onClick={() => { setPrintMode(!printMode); setTimeout(() => window.print(), 200); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-pink-200 text-pink-600 text-sm hover:bg-pink-50 transition-colors"
        >
          🖨️ Imprimer / PDF
        </button>
        {isOrganizer && (
          <button
            onClick={refresh}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-500 text-sm hover:bg-gray-50 transition-colors"
          >
            🔄 Actualiser
          </button>
        )}
      </div>

      {/* Timeline par jour */}
      {days.map((day) => {
        const dayBlocks = blocks
          .filter((b) => b.day === day)
          .sort((a, b) => a.startTime.localeCompare(b.startTime) || a.order - b.order);

        return (
          <div key={day} className="mb-10">
            {(() => {
              const DAY_INFO: Record<number, { label: string; date: string; emoji: string; gradient: string; bg: string }> = {
                1: { label: "Jour 1", date: "Vendredi 19 juin", emoji: "🌅", gradient: "from-orange-400 to-pink-500", bg: "bg-orange-50 border-orange-200" },
                2: { label: "Jour 2", date: "Samedi 20 juin",   emoji: "☀️", gradient: "from-pink-500 to-fuchsia-500", bg: "bg-pink-50 border-pink-200" },
                3: { label: "Jour 3", date: "Dimanche 21 juin", emoji: "🌙", gradient: "from-fuchsia-500 to-purple-600", bg: "bg-fuchsia-50 border-fuchsia-200" },
              };
              const info = DAY_INFO[day] ?? { label: `Jour ${day}`, date: "", emoji: "📅", gradient: "from-gray-400 to-gray-500", bg: "bg-gray-50 border-gray-200" };
              return (
                <div className={`flex items-center gap-4 mb-6 p-4 rounded-2xl border-2 ${info.bg}`}>
                  <div className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${info.gradient} flex flex-col items-center justify-center text-white shadow-md`}>
                    <span className="text-xl leading-none">{info.emoji}</span>
                    <span className="text-xs font-bold leading-none mt-0.5">{info.label}</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-lg leading-tight">{info.label}</p>
                    <p className="text-sm text-gray-500 font-medium">{info.date}</p>
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-r from-current to-transparent opacity-20 ml-2" />
                </div>
              );
            })()}

            {/* Ligne verticale de timeline */}
            <div className="relative">
              <div className="absolute left-[36px] sm:left-[52px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-pink-300 to-fuchsia-200" />

              <div className="space-y-4">
                {dayBlocks.map((block, idx) => {
                  const cat = CAT[block.category] ?? CAT.OTHER;
                  const isDragging = dragId === block.id;
                  const isDragOver = dragOverId === block.id;
                  const isEditing = editingId === block.id;

                  return (
                    <div
                      key={block.id}
                      draggable={isOrganizer}
                      onDragStart={() => handleDragStart(block.id)}
                      onDragOver={(e) => handleDragOver(e, block.id)}
                      onDrop={() => handleDrop(block.id, day)}
                      onDragEnd={() => { setDragId(null); setDragOverId(null); }}
                      className={`relative flex gap-4 transition-all ${
                        isDragging ? "opacity-40 scale-95" : ""
                      } ${isDragOver ? "scale-102" : ""}`}
                    >
                      {/* Heure */}
                      <div className="flex flex-col items-center w-[36px] sm:w-[52px] flex-shrink-0 pt-3">
                        <span className="text-[10px] sm:text-xs font-bold text-pink-500 leading-none">{block.startTime}</span>
                        <span className="text-[9px] sm:text-xs text-gray-300 leading-none mt-0.5">{block.endTime}</span>
                      </div>

                      {/* Dot sur la timeline */}
                      <div className={`absolute left-[30px] sm:left-[46px] top-4 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-gradient-to-br ${cat.color} border-2 border-white shadow-md z-10`} />

                      {/* Carte */}
                      <div className={`flex-1 bg-white rounded-2xl border-2 shadow-sm overflow-hidden transition-all ${
                        isDragOver ? "border-pink-400 shadow-pink-200 shadow-lg" : "border-pink-100 hover:border-pink-200"
                      } ${isOrganizer ? "cursor-grab active:cursor-grabbing" : ""}`}>
                        {isEditing ? (
                          /* ── Mode édition ── */
                          <div className="p-5 space-y-3">
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-xs font-semibold text-gray-500 block mb-1">Titre</label>
                                <input className="w-full px-3 py-2 rounded-lg border border-pink-200 text-sm focus:outline-none focus:border-pink-400" value={editForm.title ?? ""} onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))} />
                              </div>
                              <div className="grid grid-cols-2 gap-1">
                                <div>
                                  <label className="text-xs font-semibold text-gray-500 block mb-1">Début</label>
                                  <input type="time" className="w-full px-3 py-2 rounded-lg border border-pink-200 text-sm focus:outline-none focus:border-pink-400" value={editForm.startTime ?? ""} onChange={(e) => setEditForm((f) => ({ ...f, startTime: e.target.value }))} />
                                </div>
                                <div>
                                  <label className="text-xs font-semibold text-gray-500 block mb-1">Fin</label>
                                  <input type="time" className="w-full px-3 py-2 rounded-lg border border-pink-200 text-sm focus:outline-none focus:border-pink-400" value={editForm.endTime ?? ""} onChange={(e) => setEditForm((f) => ({ ...f, endTime: e.target.value }))} />
                                </div>
                              </div>
                            </div>
                            <div>
                              <label className="text-xs font-semibold text-gray-500 block mb-1">Jour</label>
                              <select
                                className="w-full px-3 py-2 rounded-lg border border-pink-200 text-sm focus:outline-none focus:border-pink-400 bg-white"
                                value={editForm.day ?? 1}
                                onChange={(e) => setEditForm((f) => ({ ...f, day: Number(e.target.value) }))}
                              >
                                <option value={1}>Jour 1 — Vendredi 19 juin</option>
                                <option value={2}>Jour 2 — Samedi 20 juin</option>
                                <option value={3}>Jour 3 — Dimanche 21 juin</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-xs font-semibold text-gray-500 block mb-1">Description</label>
                              <textarea rows={2} className="w-full px-3 py-2 rounded-lg border border-pink-200 text-sm focus:outline-none focus:border-pink-400 resize-none" value={editForm.description ?? ""} onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))} />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-xs font-semibold text-gray-500 block mb-1">Lieu</label>
                                <input className="w-full px-3 py-2 rounded-lg border border-pink-200 text-sm focus:outline-none focus:border-pink-400" value={editForm.location ?? ""} onChange={(e) => setEditForm((f) => ({ ...f, location: e.target.value }))} />
                              </div>
                              <div>
                                <label className="text-xs font-semibold text-gray-500 block mb-1">Budget (€)</label>
                                <input type="number" className="w-full px-3 py-2 rounded-lg border border-pink-200 text-sm focus:outline-none focus:border-pink-400" value={editForm.budget ?? ""} onChange={(e) => setEditForm((f) => ({ ...f, budget: e.target.value ? Number(e.target.value) : null }))} />
                              </div>
                            </div>
                            <div>
                              <label className="text-xs font-semibold text-gray-500 block mb-1">Notes internes</label>
                              <textarea rows={2} className="w-full px-3 py-2 rounded-lg border border-pink-200 text-sm focus:outline-none focus:border-pink-400 resize-none" value={editForm.notes ?? ""} onChange={(e) => setEditForm((f) => ({ ...f, notes: e.target.value }))} />
                            </div>
                            <div className="flex gap-2 pt-1">
                              <button onClick={() => setEditingId(null)} className="flex-1 border border-gray-200 text-gray-500 py-2 rounded-xl text-sm hover:bg-gray-50">Annuler</button>
                              <button onClick={saveEdit} disabled={saving} className="flex-1 bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-xl text-sm font-semibold disabled:opacity-60">
                                {saving ? "Sauvegarde..." : "✓ Sauvegarder"}
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* ── Mode lecture ── */
                          <div className="p-3 sm:p-4">
                            <div className="flex items-start gap-3">
                              {/* Icône catégorie */}
                              <div className={`flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-lg shadow-sm`}>
                                {cat.emoji}
                              </div>

                              {/* Contenu principal */}
                              <div className="flex-1 min-w-0">
                                {/* Titre + heure mobile */}
                                <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0">
                                    <h3 className="font-bold text-gray-800 text-sm sm:text-base leading-tight truncate">{block.title}</h3>
                                    <span className="text-xs text-gray-400">{cat.label}</span>
                                  </div>
                                  <div className="sm:hidden text-right flex-shrink-0">
                                    <span className="text-xs font-bold text-pink-500 block">{block.startTime}</span>
                                    <span className="text-xs text-gray-300">{block.endTime}</span>
                                  </div>
                                </div>

                                {/* Image vignette + description */}
                                <div className="flex gap-3 mt-2">
                                  {block.imageUrl && (
                                    <div className="relative flex-shrink-0 w-20 h-16 sm:w-28 sm:h-20 rounded-lg overflow-hidden border border-gray-100">
                                      <Image src={block.imageUrl} alt={block.title} fill className="object-cover" sizes="112px" />
                                    </div>
                                  )}
                                  <div className="flex-1 min-w-0 space-y-1">
                                    {block.description && (
                                      <p className="text-gray-500 text-xs sm:text-sm line-clamp-2">{block.description}</p>
                                    )}
                                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-gray-400">
                                      {block.location && (
                                        <span className="flex items-center gap-0.5">
                                          📍{block.locationUrl ? (
                                            <a href={block.locationUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{block.location}</a>
                                          ) : block.location}
                                        </span>
                                      )}
                                      {block.budget != null && block.budget > 0 && <span>💰 ~{block.budget}€</span>}
                                    </div>
                                  </div>
                                </div>

                                {/* Note interne */}
                                {block.notes && isOrganizer && (
                                  <div className="mt-2 bg-amber-50 border border-amber-100 rounded-lg px-2.5 py-1.5 text-xs text-amber-700">
                                    🔒 {block.notes}
                                  </div>
                                )}

                                {/* PJ */}
                                {block.attachments && block.attachments.length > 0 && (
                                  <AttachmentList attachments={block.attachments} />
                                )}
                              </div>

                              {/* Actions organisateur — colonne droite */}
                              {isOrganizer && (
                                <div className="flex flex-col gap-0.5 flex-shrink-0">
                                  <button onClick={() => startEdit(block)} className="p-1.5 rounded-lg hover:bg-pink-50 text-gray-300 hover:text-pink-500 transition-colors text-sm" title="Modifier">✏️</button>
                                  <button onClick={() => duplicateBlock(block)} disabled={duplicatingId === block.id} className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-300 hover:text-blue-500 transition-colors text-sm" title="Dupliquer">{duplicatingId === block.id ? "⏳" : "📋"}</button>
                                  <button onClick={() => deleteBlock(block.id)} disabled={deletingId === block.id} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors text-sm" title="Supprimer">🗑️</button>
                                  <div className="p-1.5 text-gray-200 cursor-grab text-sm" title="Réordonner">⠿</div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}

      {/* Légende */}
      <div className="mt-8 p-4 bg-white rounded-2xl border border-pink-100 shadow-sm">
        <p className="text-xs font-semibold text-gray-500 mb-3">Légende</p>
        <div className="flex flex-wrap gap-3">
          {Object.entries(CAT).map(([key, { emoji, label, color }]) => (
            <div key={key} className="flex items-center gap-1.5 text-xs text-gray-600">
              <div className={`w-5 h-5 rounded-md bg-gradient-to-br ${color} flex items-center justify-center text-xs`}>{emoji}</div>
              {label}
            </div>
          ))}
        </div>
        {isOrganizer && (
          <p className="text-xs text-gray-400 mt-3">
            💡 <span className="font-medium">Glisse les blocs</span> pour les réordonner • Les <span className="font-medium">notes internes</span> ne sont visibles que par toi
          </p>
        )}
      </div>
    </div>
  );
}
