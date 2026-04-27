"use client";

import { useState, useEffect, useCallback } from "react";
import { EmailThread, EmailAccount, EmailCategory, CATEGORY_CONFIG } from "@/types/mail";

const GMAIL_THREAD_URL = "https://mail.google.com/mail/u/0/#inbox/";

const FILTERS: { key: string; label: string; emoji: string }[] = [
  { key: "all", label: "Tous", emoji: "📬" },
  { key: "unread", label: "Non lus", emoji: "🔵" },
  { key: "urgent", label: "Urgent", emoji: "🔴" },
  { key: "important", label: "Important", emoji: "🟡" },
  { key: "compta", label: "Comptabilité", emoji: "💼" },
  { key: "veille", label: "Veille santé", emoji: "🏥" },
  { key: "loge", label: "Loge", emoji: "🤝" },
  { key: "events", label: "Événements", emoji: "🗓️" },
  { key: "newsletter", label: "Newsletters", emoji: "📧" },
];

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  if (days === 1) return "Hier";
  if (days < 7) return d.toLocaleDateString("fr-FR", { weekday: "short" });
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
}

function extractEmail(sender: string) {
  const match = sender.match(/<(.+)>/);
  return match ? match[1] : sender;
}

function extractName(sender: string) {
  const match = sender.match(/^(.+?)\s*</);
  if (match) return match[1].replace(/"/g, "").trim();
  return sender.split("@")[0];
}

function providerBadge(provider: string) {
  if (provider === "google") return { label: "Gmail", color: "bg-red-100 text-red-700" };
  if (provider === "microsoft") return { label: "Outlook", color: "bg-blue-100 text-blue-700" };
  return { label: "Zoho", color: "bg-yellow-100 text-yellow-700" };
}

export default function MailPage() {
  const [threads, setThreads] = useState<EmailThread[]>([]);
  const [accounts, setAccounts] = useState<EmailAccount[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadAccounts = useCallback(async () => {
    const res = await fetch("/api/mail/accounts");
    if (res.ok) setAccounts(await res.json());
  }, []);

  const loadThreads = useCallback(async (filter: string, withSync = false) => {
    setLoading(true);
    const url = `/api/mail/threads?filter=${filter}${withSync ? "&sync=true" : ""}`;
    const res = await fetch(url);
    if (res.ok) setThreads(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "connected") {
      showToast("✅ Compte connecté avec succès !");
      window.history.replaceState({}, "", "/mail");
      handleSync();
    } else if (params.get("error")) {
      showToast("❌ Échec de la connexion. Réessaie.", "error");
      window.history.replaceState({}, "", "/mail");
    }
    loadAccounts();
    loadThreads("all");
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    await loadThreads(activeFilter, true);
    await loadAccounts();
    setSyncing(false);
    showToast("✅ Boîte synchronisée !");
  };

  const handleFilterChange = (f: string) => {
    setActiveFilter(f);
    loadThreads(f);
  };

  const handleDeleteAccount = async (id: string, email: string) => {
    if (!confirm(`Déconnecter ${email} ?`)) return;
    await fetch(`/api/mail/accounts?id=${id}`, { method: "DELETE" });
    await loadAccounts();
    showToast("Compte déconnecté.");
  };

  const filtered = threads.filter((t) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.subject.toLowerCase().includes(q) ||
      t.sender.toLowerCase().includes(q) ||
      t.snippet.toLowerCase().includes(q)
    );
  });

  const counts: Record<string, number> = { all: threads.length };
  threads.forEach((t) => {
    counts[t.category] = (counts[t.category] || 0) + 1;
    if (t.isUnread) counts.unread = (counts.unread || 0) + 1;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${
            toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-screen-2xl mx-auto px-4 py-3 flex items-center gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-white text-lg">📬</span>
            </div>
            <div>
              <h1 className="font-bold text-gray-900 text-base leading-tight">Tarandro Mail</h1>
              <p className="text-xs text-gray-500">{accounts.length} compte{accounts.length > 1 ? "s" : ""} · {threads.length} emails</p>
            </div>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md">
            <input
              type="search"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-gray-100 rounded-xl text-sm border-0 outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={handleSync}
              disabled={syncing || accounts.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors"
            >
              <span className={syncing ? "animate-spin" : ""}>🔄</span>
              {syncing ? "Synchro..." : "Synchroniser"}
            </button>
            <a
              href="/admin"
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Admin
            </a>
          </div>
        </div>
      </header>

      <div className="max-w-screen-2xl mx-auto flex h-[calc(100vh-61px)]">
        {/* Sidebar */}
        <aside className="w-56 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 overflow-y-auto">
          {/* Filters */}
          <nav className="p-3 flex-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">Filtres</p>
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => handleFilterChange(f.key)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm mb-0.5 transition-colors ${
                  activeFilter === f.key
                    ? "bg-primary-50 text-primary-700 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{f.emoji}</span>
                  <span>{f.label}</span>
                </span>
                {counts[f.key] ? (
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                      activeFilter === f.key ? "bg-primary-100 text-primary-700" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {counts[f.key]}
                  </span>
                ) : null}
              </button>
            ))}
          </nav>

          {/* Accounts */}
          <div className="p-3 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">Comptes</p>
            {accounts.length === 0 && (
              <p className="text-xs text-gray-400 px-2 mb-2">Aucun compte connecté</p>
            )}
            {accounts.map((acc) => {
              const badge = providerBadge(acc.provider);
              return (
                <div key={acc.id} className="flex items-center justify-between px-2 py-1.5 rounded-lg group">
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-700 truncate">{acc.email}</p>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${badge.color}`}>{badge.label}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteAccount(acc.id, acc.email)}
                    className="text-gray-300 hover:text-red-500 text-xs opacity-0 group-hover:opacity-100 transition-all ml-1"
                    title="Déconnecter"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
            <a
              href="/api/mail/connect?provider=google"
              className="mt-2 flex items-center gap-2 w-full px-3 py-2 border border-dashed border-gray-300 rounded-lg text-xs text-gray-500 hover:border-primary-400 hover:text-primary-600 transition-colors"
            >
              <span>＋</span> Connecter Gmail
            </a>
          </div>
        </aside>

        {/* Email list */}
        <main className="flex-1 overflow-y-auto bg-white">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-4xl mb-3 animate-pulse">📬</div>
                <p className="text-gray-400 text-sm">Chargement des emails...</p>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-4xl mb-3">🎉</div>
                <p className="text-gray-500 font-medium">
                  {accounts.length === 0 ? "Connecte un compte pour commencer" : "Aucun email ici"}
                </p>
                {accounts.length === 0 && (
                  <a
                    href="/api/mail/connect?provider=google"
                    className="mt-4 inline-block px-5 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors"
                  >
                    Connecter Gmail
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filtered.map((thread) => {
                const cat = CATEGORY_CONFIG[thread.category as EmailCategory] || CATEGORY_CONFIG.important;
                const badge = providerBadge(thread.account.provider);
                return (
                  <a
                    key={thread.id}
                    href={`${GMAIL_THREAD_URL}${thread.threadId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-start gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors cursor-pointer ${
                      thread.isUnread ? "bg-blue-50/30" : ""
                    }`}
                  >
                    {/* Dot */}
                    <div className="flex-shrink-0 mt-1.5">
                      {thread.isUnread ? (
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                      ) : (
                        <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className={`font-semibold text-sm truncate ${
                              thread.isUnread ? "text-gray-900" : "text-gray-600"
                            }`}
                          >
                            {extractName(thread.sender)}
                          </span>
                          <span className={`text-xs px-1.5 py-0.5 rounded-full flex-shrink-0 ${badge.color}`}>
                            {badge.label}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400 flex-shrink-0">
                          {formatDate(thread.date)}
                        </span>
                      </div>

                      <p className={`text-sm truncate mb-1 ${thread.isUnread ? "text-gray-800 font-medium" : "text-gray-600"}`}>
                        {thread.subject}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{thread.snippet}</p>

                      <div className="flex items-center gap-2 mt-1.5">
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${cat.bg} ${cat.color}`}>
                          {cat.emoji} {cat.label}
                        </span>
                        <span className="text-xs text-gray-400">
                          {extractEmail(thread.sender)}
                        </span>
                      </div>
                    </div>

                    <div className="flex-shrink-0 text-gray-300 hover:text-primary-500 text-sm mt-1">
                      ↗
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
