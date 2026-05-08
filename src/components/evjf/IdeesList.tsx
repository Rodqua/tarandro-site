"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

type Vote = { id: string; userId: string; type: "POSITIVE" | "VETO" };
type Comment = { id: string; content: string; createdAt: string; user: { id: string; name: string } };
type Idea = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  estimatedBudget: number | null;
  referenceUrl: string | null;
  status: string;
  score: number;
  userVote: "POSITIVE" | "VETO" | null;
  author: { id: string; name: string };
  votes: Vote[];
  comments: Comment[];
  createdAt: string;
};

const CATEGORIES: Record<string, { label: string; emoji: string }> = {
  ACTIVITY:      { label: "Activité",    emoji: "🎉" },
  FOOD:          { label: "Repas & Bar", emoji: "🍽️" },
  TRANSPORT:     { label: "Transport",   emoji: "🚗" },
  ACCOMMODATION: { label: "Hébergement", emoji: "🏠" },
  DECO:          { label: "Déco",        emoji: "🎀" },
  OTHER:         { label: "Autre",       emoji: "✨" },
};

const STATUSES: Record<string, { label: string; className: string }> = {
  PENDING:   { label: "En attente", className: "bg-amber-100 text-amber-700" },
  VALIDATED: { label: "Validée ✅",  className: "bg-green-100 text-green-700" },
  REJECTED:  { label: "Rejetée",    className: "bg-red-100 text-red-500" },
  RETAINED:  { label: "⭐ Au programme", className: "bg-pink-100 text-pink-700" },
};

export default function IdeesList({
  currentUserId,
  currentUserRole,
}: {
  currentUserId: string;
  currentUserRole: string;
}) {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("ALL");
  const [catFilter, setCatFilter] = useState<string>("ALL");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [newComment, setNewComment] = useState<Record<string, string>>({});
  const [submittingComment, setSubmittingComment] = useState<string | null>(null);
  const [voting, setVoting] = useState<string | null>(null);

  const fetchIdeas = useCallback(async () => {
    const res = await fetch("/api/evjf/ideas");
    if (res.ok) setIdeas(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { fetchIdeas(); }, [fetchIdeas]);

  async function handleVote(ideaId: string, type: "POSITIVE" | "VETO" | null) {
    setVoting(ideaId);
    const res = await fetch(`/api/evjf/ideas/${ideaId}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type }),
    });
    if (res.ok) await fetchIdeas();
    setVoting(null);
  }

  async function handleComment(ideaId: string) {
    const content = newComment[ideaId]?.trim();
    if (!content) return;
    setSubmittingComment(ideaId);
    const res = await fetch(`/api/evjf/ideas/${ideaId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    if (res.ok) {
      setNewComment((prev) => ({ ...prev, [ideaId]: "" }));
      await fetchIdeas();
    }
    setSubmittingComment(null);
  }

  async function handleStatusChange(ideaId: string, status: string) {
    await fetch(`/api/evjf/ideas/${ideaId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await fetchIdeas();
  }

  async function handleDelete(ideaId: string) {
    if (!confirm("Supprimer cette idée ?")) return;
    await fetch(`/api/evjf/ideas/${ideaId}`, { method: "DELETE" });
    await fetchIdeas();
  }

  const filtered = ideas
    .filter((i) => filter === "ALL" || i.status === filter)
    .filter((i) => catFilter === "ALL" || i.category === catFilter)
    .sort((a, b) => b.score - a.score);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-4xl animate-bounce">💡</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filtres statut */}
      <div className="flex flex-wrap gap-2">
        {[["ALL", "Toutes"], ["PENDING", "En attente"], ["VALIDATED", "Validées"], ["RETAINED", "Au programme"]].map(
          ([val, label]) => (
            <button
              key={val}
              onClick={() => setFilter(val)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filter === val
                  ? "bg-pink-500 text-white shadow-md"
                  : "bg-white border border-pink-200 text-gray-600 hover:bg-pink-50"
              }`}
            >
              {label}
            </button>
          )
        )}
      </div>

      {/* Filtres catégories */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setCatFilter("ALL")}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            catFilter === "ALL" ? "bg-fuchsia-500 text-white" : "bg-white border border-fuchsia-200 text-gray-500 hover:bg-fuchsia-50"
          }`}
        >
          Toutes catégories
        </button>
        {Object.entries(CATEGORIES).map(([key, { label, emoji }]) => (
          <button
            key={key}
            onClick={() => setCatFilter(key)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              catFilter === key ? "bg-fuchsia-500 text-white" : "bg-white border border-fuchsia-200 text-gray-500 hover:bg-fuchsia-50"
            }`}
          >
            {emoji} {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🌟</div>
          <p className="text-gray-500 font-medium">Aucune idée ici.</p>
          <Link href="/lise/idees/nouvelle" className="mt-4 inline-block bg-pink-500 text-white px-5 py-2 rounded-xl font-semibold hover:bg-pink-600 transition-colors">
            Sois la première !
          </Link>
        </div>
      )}

      {/* Cartes idées */}
      {filtered.map((idea) => {
        const cat = CATEGORIES[idea.category];
        const st = STATUSES[idea.status];
        const positives = idea.votes.filter((v) => v.type === "POSITIVE").length;
        const vetos = idea.votes.filter((v) => v.type === "VETO").length;
        const isExpanded = expandedId === idea.id;
        const isVoting = voting === idea.id;

        return (
          <div key={idea.id} className="bg-white rounded-2xl border border-pink-100 shadow-sm overflow-hidden">
            {/* Header carte */}
            <div className="p-5">
              <div className="flex items-start gap-3">
                <span className="text-3xl flex-shrink-0">{cat.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${st.className} mr-2`}>
                        {st.label}
                      </span>
                      <span className="text-xs text-gray-400">{cat.label}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <span className="font-bold text-pink-500">Score {idea.score.toFixed(1)}</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-800 mt-1 text-lg leading-tight">{idea.title}</h3>
                  {idea.description && (
                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">{idea.description}</p>
                  )}
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400 flex-wrap">
                    <span>par <span className="font-semibold text-pink-500">{idea.author.name}</span></span>
                    {idea.estimatedBudget && <span>💰 ~{idea.estimatedBudget}€</span>}
                    {idea.referenceUrl && (
                      <a href={idea.referenceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">🔗 Lien</a>
                    )}
                    <span>{new Date(idea.createdAt).toLocaleDateString("fr-FR")}</span>
                  </div>
                </div>
              </div>

              {/* Actions vote */}
              <div className="flex items-center gap-2 mt-4 flex-wrap">
                <button
                  disabled={isVoting}
                  onClick={() => handleVote(idea.id, idea.userVote === "POSITIVE" ? null : "POSITIVE")}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    idea.userVote === "POSITIVE"
                      ? "bg-green-500 text-white shadow-md scale-105"
                      : "bg-green-50 border border-green-200 text-green-700 hover:bg-green-100"
                  }`}
                >
                  💜 {positives} {positives > 1 ? "votes" : "vote"}
                </button>
                <button
                  disabled={isVoting}
                  onClick={() => handleVote(idea.id, idea.userVote === "VETO" ? null : "VETO")}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    idea.userVote === "VETO"
                      ? "bg-red-500 text-white shadow-md scale-105"
                      : "bg-red-50 border border-red-200 text-red-600 hover:bg-red-100"
                  }`}
                >
                  🚫 {vetos} véto{vetos > 1 ? "s" : ""}
                </button>
                <button
                  onClick={() => setExpandedId(isExpanded ? null : idea.id)}
                  className="ml-auto flex items-center gap-1 px-3 py-2 rounded-xl text-sm text-gray-500 hover:bg-pink-50 transition-colors"
                >
                  💬 {idea.comments.length} {isExpanded ? "▲" : "▼"}
                </button>
                {/* Admin actions */}
                {currentUserRole === "ORGANIZER" && (
                  <div className="flex gap-1 ml-1">
                    <select
                      value={idea.status}
                      onChange={(e) => handleStatusChange(idea.id, e.target.value)}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1 text-gray-600 bg-white"
                    >
                      <option value="PENDING">En attente</option>
                      <option value="VALIDATED">Validée</option>
                      <option value="REJECTED">Rejetée</option>
                      <option value="RETAINED">Au programme</option>
                    </select>
                    <button
                      onClick={() => handleDelete(idea.id)}
                      className="text-xs text-red-400 hover:text-red-600 px-2 py-1 rounded-lg hover:bg-red-50"
                    >
                      🗑️
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Zone commentaires */}
            {isExpanded && (
              <div className="border-t border-pink-50 bg-pink-50/50 p-4 space-y-3">
                {idea.comments.length === 0 && (
                  <p className="text-xs text-gray-400 text-center py-2">Aucun commentaire. Dis ce que tu en penses !</p>
                )}
                {idea.comments.map((c) => (
                  <div key={c.id} className="bg-white rounded-xl px-3 py-2 shadow-sm">
                    <span className="text-xs font-bold text-pink-500">{c.user.name}</span>
                    <span className="text-xs text-gray-400 ml-2">
                      {new Date(c.createdAt).toLocaleDateString("fr-FR")}
                    </span>
                    <p className="text-sm text-gray-700 mt-0.5">{c.content}</p>
                  </div>
                ))}
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    placeholder="Ton avis..."
                    value={newComment[idea.id] || ""}
                    onChange={(e) => setNewComment((prev) => ({ ...prev, [idea.id]: e.target.value }))}
                    onKeyDown={(e) => { if (e.key === "Enter") handleComment(idea.id); }}
                    className="flex-1 text-sm px-3 py-2 rounded-xl border border-pink-200 focus:border-pink-400 focus:outline-none bg-white"
                  />
                  <button
                    disabled={submittingComment === idea.id}
                    onClick={() => handleComment(idea.id)}
                    className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-60"
                  >
                    Envoyer
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
