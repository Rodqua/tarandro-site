"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaGoogle, FaMicrosoft, FaTrash, FaPlus, FaArrowLeft, FaCheckCircle, FaClock } from "react-icons/fa";
import { SiZoho } from "react-icons/si";

interface EmailAccount {
  id: string;
  provider: string;
  email: string;
  displayName?: string;
  createdAt: string;
  _count?: { threads: number };
}

const PROVIDER_CONFIG = {
  google: {
    label: "Gmail",
    icon: FaGoogle,
    color: "text-red-500",
    bg: "bg-red-50 border-red-200",
    btnBg: "bg-red-500 hover:bg-red-600",
    connectHref: "/api/mail/connect?provider=google",
    description: "Connecter un compte Gmail / Google Workspace",
  },
  microsoft: {
    label: "Outlook / Hotmail",
    icon: FaMicrosoft,
    color: "text-blue-500",
    bg: "bg-blue-50 border-blue-200",
    btnBg: "bg-blue-500 hover:bg-blue-600",
    connectHref: "/api/mail/connect?provider=microsoft",
    description: "Connecter un compte Outlook, Hotmail ou Microsoft 365",
    comingSoon: true,
  },
  zoho: {
    label: "Zoho Mail",
    icon: SiZoho,
    color: "text-yellow-600",
    bg: "bg-yellow-50 border-yellow-200",
    btnBg: "bg-yellow-500 hover:bg-yellow-600",
    connectHref: "/api/mail/connect?provider=zoho",
    description: "Connecter un compte Zoho Mail",
    comingSoon: true,
  },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function MailSettingsPage() {
  const [accounts, setAccounts] = useState<EmailAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadAccounts = async () => {
    const res = await fetch("/api/mail/accounts");
    if (res.ok) setAccounts(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "connected") {
      showToast("✅ Compte connecté avec succès !");
      window.history.replaceState({}, "", "/mail/settings");
    }
    loadAccounts();
  }, []);

  const handleDelete = async (id: string, email: string) => {
    if (!confirm(`Déconnecter ${email} ?\n\nTous les emails synchronisés seront supprimés.`)) return;
    setDeleting(id);
    const res = await fetch(`/api/mail/accounts?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      showToast(`${email} déconnecté.`);
      await loadAccounts();
    } else {
      showToast("Erreur lors de la déconnexion.", "error");
    }
    setDeleting(null);
  };

  const connectedProviders = accounts.map((a) => a.provider);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium ${
          toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
        }`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <Link href="/mail" className="text-gray-400 hover:text-gray-700 transition-colors">
            <FaArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Paramètres — Boîte mail</h1>
            <p className="text-sm text-gray-500">Gérez vos adresses mail connectées</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">

        {/* Comptes connectés */}
        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FaCheckCircle className="text-green-500" />
            Comptes connectés ({accounts.length})
          </h2>

          {loading ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400">
              Chargement...
            </div>
          ) : accounts.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-gray-300 p-8 text-center">
              <p className="text-gray-400 text-sm">Aucun compte connecté pour l'instant.</p>
              <p className="text-gray-400 text-xs mt-1">Connecte un compte ci-dessous pour commencer.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {accounts.map((account) => {
                const config = PROVIDER_CONFIG[account.provider as keyof typeof PROVIDER_CONFIG];
                const Icon = config?.icon || FaGoogle;
                return (
                  <div key={account.id} className={`flex items-center justify-between p-4 rounded-xl border ${config?.bg || "bg-gray-50 border-gray-200"}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm`}>
                        <Icon className={config?.color || "text-gray-500"} size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">
                          {account.displayName || account.email}
                        </p>
                        <p className="text-xs text-gray-500">{account.email}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {config?.label} · Connecté le {formatDate(account.createdAt)}
                          {account._count ? ` · ${account._count.threads} emails` : ""}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(account.id, account.email)}
                      disabled={deleting === account.id}
                      className="flex items-center gap-2 px-3 py-2 bg-white text-red-500 border border-red-200 rounded-lg text-xs font-medium hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      <FaTrash size={12} />
                      {deleting === account.id ? "..." : "Déconnecter"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Ajouter un compte */}
        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FaPlus className="text-primary-500" />
            Ajouter un compte
          </h2>

          <div className="space-y-3">
            {Object.entries(PROVIDER_CONFIG).map(([key, config]) => {
              const Icon = config.icon;
              const isConnected = connectedProviders.includes(key);
              const isComingSoon = (config as any).comingSoon;

              return (
                <div key={key} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
                      <Icon className={config.color} size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{config.label}</p>
                      <p className="text-xs text-gray-500">{config.description}</p>
                    </div>
                  </div>

                  {isComingSoon ? (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-400 rounded-lg text-xs font-medium">
                      <FaClock size={11} /> Bientôt
                    </span>
                  ) : isConnected ? (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-600 border border-green-200 rounded-lg text-xs font-medium">
                      <FaCheckCircle size={11} /> Connecté
                    </span>
                  ) : (
                    <a
                      href={config.connectHref}
                      className={`flex items-center gap-2 px-4 py-2 ${config.btnBg} text-white rounded-lg text-xs font-medium transition-colors`}
                    >
                      <FaPlus size={11} /> Connecter
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Infos */}
        <section className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">ℹ️ À propos de la synchronisation</h3>
          <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
            <li>Les emails sont synchronisés à la demande en cliquant sur "Synchroniser"</li>
            <li>Seuls les emails non lus des 14 derniers jours sont récupérés</li>
            <li>Tes tokens OAuth sont stockés de façon sécurisée en base de données</li>
            <li>Déconnecter un compte supprime tous ses emails synchronisés</li>
          </ul>
        </section>

      </div>
    </div>
  );
}
