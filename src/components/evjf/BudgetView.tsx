"use client";

import { useState, useEffect, useCallback } from "react";

type BudgetItem = {
  id: string;
  label: string;
  amount: number;
  category: string;
  paidBy: { id: string; name: string } | null;
  splitCount: number;
  isPaid: boolean;
  note: string | null;
  createdAt: string;
};

type BudgetData = {
  items: BudgetItem[];
  total: number;
  perPerson: number;
};

type User = { id: string; name: string };

const CATEGORIES: Record<string, { label: string; emoji: string; color: string }> = {
  ACTIVITY: { label: "Activité", emoji: "🎉", color: "bg-fuchsia-100 text-fuchsia-700" },
  FOOD: { label: "Repas / Boissons", emoji: "🍾", color: "bg-pink-100 text-pink-700" },
  TRANSPORT: { label: "Transport", emoji: "🚗", color: "bg-rose-100 text-rose-700" },
  ACCOMMODATION: { label: "Hébergement", emoji: "🏠", color: "bg-purple-100 text-purple-700" },
  DECORATION: { label: "Déco / Costumes", emoji: "✨", color: "bg-amber-100 text-amber-700" },
  OTHER: { label: "Autre", emoji: "📦", color: "bg-gray-100 text-gray-700" },
};

export default function BudgetView({
  isOrganizer,
  currentUserId,
}: {
  isOrganizer: boolean;
  currentUserId: string;
}) {
  const [data, setData] = useState<BudgetData | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    label: "",
    amount: "",
    category: "ACTIVITY",
    paidById: "",
    splitCount: "7",
    note: "",
  });

  const fetchData = useCallback(async () => {
    const [budgetRes, usersRes] = await Promise.all([
      fetch("/api/evjf/budget"),
      fetch("/api/evjf/users"),
    ]);
    if (budgetRes.ok) setData(await budgetRes.json());
    if (usersRes.ok) setUsers(await usersRes.json());
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const resetForm = () => {
    setForm({ label: "", amount: "", category: "ACTIVITY", paidById: "", splitCount: "7", note: "" });
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (item: BudgetItem) => {
    setForm({
      label: item.label,
      amount: String(item.amount),
      category: item.category,
      paidById: item.paidBy?.id || "",
      splitCount: String(item.splitCount),
      note: item.note || "",
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, amount: parseFloat(form.amount), splitCount: parseInt(form.splitCount) };
    const url = editingId ? `/api/evjf/budget/${editingId}` : "/api/evjf/budget";
    const method = editingId ? "PATCH" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (res.ok) { await fetchData(); resetForm(); }
    setSaving(false);
  };

  const togglePaid = async (item: BudgetItem) => {
    await fetch(`/api/evjf/budget/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPaid: !item.isPaid }),
    });
    await fetchData();
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Supprimer cette dépense ?")) return;
    await fetch(`/api/evjf/budget/${id}`, { method: "DELETE" });
    await fetchData();
  };

  if (loading) return <div className="text-center py-20 text-gray-400">Chargement du budget...</div>;

  return (
    <div className="space-y-6">
      {/* Résumé */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-fuchsia-500 to-pink-500 rounded-2xl p-5 text-white text-center shadow">
          <div className="text-3xl font-bold">{data?.total.toFixed(2)}€</div>
          <div className="text-pink-100 text-sm mt-1">Total estimé</div>
        </div>
        <div className="bg-white rounded-2xl p-5 text-center shadow border border-pink-100">
          <div className="text-3xl font-bold text-fuchsia-600">{data?.perPerson.toFixed(2)}€</div>
          <div className="text-gray-400 text-sm mt-1">Par personne (moyenne)</div>
        </div>
        <div className="bg-white rounded-2xl p-5 text-center shadow border border-pink-100">
          <div className="text-3xl font-bold text-pink-500">{data?.items.filter(i => i.isPaid).length}/{data?.items.length}</div>
          <div className="text-gray-400 text-sm mt-1">Dépenses réglées</div>
        </div>
      </div>

      {/* Bouton ajouter (orga seulement) */}
      {isOrganizer && !showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white font-semibold shadow hover:opacity-90 transition"
        >
          + Ajouter une dépense
        </button>
      )}

      {/* Formulaire */}
      {showForm && isOrganizer && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow border border-pink-100 space-y-4">
          <h3 className="font-bold text-fuchsia-700 text-lg">{editingId ? "Modifier la dépense" : "Nouvelle dépense"}</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Intitulé *</label>
              <input required value={form.label} onChange={e => setForm({ ...form, label: e.target.value })}
                className="w-full border border-pink-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-fuchsia-300"
                placeholder="ex: Escape game" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Montant (€) *</label>
              <input required type="number" step="0.01" min="0" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })}
                className="w-full border border-pink-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-fuchsia-300"
                placeholder="0.00" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {Object.entries(CATEGORIES).map(([key, cat]) => (
              <button key={key} type="button"
                onClick={() => setForm({ ...form, category: key })}
                className={`py-2 px-3 rounded-xl text-sm font-medium border-2 transition ${form.category === key ? "border-fuchsia-500 bg-fuchsia-50" : "border-gray-100 hover:border-pink-200"}`}>
                {cat.emoji} {cat.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payé par</label>
              <select value={form.paidById} onChange={e => setForm({ ...form, paidById: e.target.value })}
                className="w-full border border-pink-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-fuchsia-300">
                <option value="">— Non défini —</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Divisé entre (personnes)</label>
              <input type="number" min="1" max="20" value={form.splitCount} onChange={e => setForm({ ...form, splitCount: e.target.value })}
                className="w-full border border-pink-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-fuchsia-300" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
            <input value={form.note} onChange={e => setForm({ ...form, note: e.target.value })}
              className="w-full border border-pink-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-fuchsia-300"
              placeholder="Détails..." />
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={saving}
              className="flex-1 py-2 bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white font-semibold rounded-xl hover:opacity-90 transition disabled:opacity-50">
              {saving ? "Enregistrement..." : editingId ? "Mettre à jour" : "Ajouter"}
            </button>
            <button type="button" onClick={resetForm}
              className="px-4 py-2 text-gray-500 hover:text-gray-700 rounded-xl border border-gray-200 hover:border-gray-300 transition">
              Annuler
            </button>
          </div>
        </form>
      )}

      {/* Liste des dépenses */}
      {!data?.items.length ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-3">💰</div>
          <p>Aucune dépense enregistrée pour l&apos;instant</p>
          {isOrganizer && <p className="text-sm mt-1">Clique sur &quot;Ajouter une dépense&quot; pour commencer</p>}
        </div>
      ) : (
        <div className="space-y-3">
          {data.items.map(item => {
            const cat = CATEGORIES[item.category] || CATEGORIES.OTHER;
            const perHead = item.amount / item.splitCount;
            return (
              <div key={item.id} className={`bg-white rounded-2xl p-4 shadow border transition ${item.isPaid ? "border-green-200 opacity-75" : "border-pink-100"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <span className="text-2xl">{cat.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-gray-800">{item.label}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cat.color}`}>{cat.label}</span>
                        {item.isPaid && <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">✅ Réglé</span>}
                      </div>
                      <div className="text-sm text-gray-500 mt-0.5">
                        {item.paidBy ? `Avancé par ${item.paidBy.name}` : "Payeur non défini"} · {item.splitCount} participants · <span className="text-fuchsia-600 font-medium">{perHead.toFixed(2)}€/pers.</span>
                      </div>
                      {item.note && <div className="text-xs text-gray-400 mt-0.5 italic">{item.note}</div>}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="text-lg font-bold text-gray-800">{item.amount.toFixed(2)}€</span>
                    {isOrganizer && (
                      <div className="flex gap-1">
                        <button onClick={() => togglePaid(item)}
                          className="text-xs px-2 py-1 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition">
                          {item.isPaid ? "↩ Dé-régler" : "✅ Réglé"}
                        </button>
                        <button onClick={() => startEdit(item)}
                          className="text-xs px-2 py-1 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100 transition">✏️</button>
                        <button onClick={() => deleteItem(item.id)}
                          className="text-xs px-2 py-1 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 transition">🗑</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Récap par catégorie */}
      {!!data?.items.length && (
        <div className="bg-white rounded-2xl p-5 shadow border border-pink-100">
          <h3 className="font-bold text-gray-700 mb-3">Répartition par catégorie</h3>
          <div className="space-y-2">
            {Object.entries(
              data.items.reduce((acc, item) => {
                acc[item.category] = (acc[item.category] || 0) + item.amount;
                return acc;
              }, {} as Record<string, number>)
            ).sort((a, b) => b[1] - a[1]).map(([cat, total]) => {
              const c = CATEGORIES[cat] || CATEGORIES.OTHER;
              const pct = data.total > 0 ? (total / data.total) * 100 : 0;
              return (
                <div key={cat}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{c.emoji} {c.label}</span>
                    <span className="font-medium">{total.toFixed(2)}€ ({pct.toFixed(0)}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-gradient-to-r from-fuchsia-400 to-pink-400 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
