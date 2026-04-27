'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FaGoogle, FaMicrosoft, FaEnvelope, FaTrash, FaArrowLeft, FaCheck } from 'react-icons/fa'

interface EmailAccount {
  id: string
  provider: string
  email: string
  displayName?: string
  createdAt: string
}

const PROVIDER_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  google: {
    label: 'Gmail',
    color: 'text-red-600',
    bg: 'bg-red-50 border-red-200',
    icon: <FaGoogle className="text-red-500" />,
  },
  outlook: {
    label: 'Outlook / Hotmail',
    color: 'text-blue-600',
    bg: 'bg-blue-50 border-blue-200',
    icon: <FaMicrosoft className="text-blue-500" />,
  },
  zoho: {
    label: 'Zoho Mail',
    color: 'text-orange-600',
    bg: 'bg-orange-50 border-orange-200',
    icon: <FaEnvelope className="text-orange-500" />,
  },
}

export default function MailSettingsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [accounts, setAccounts] = useState<EmailAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [flash, setFlash] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    const success = searchParams.get('success')
    const error = searchParams.get('error')
    if (success === 'gmail_connected') setFlash({ type: 'success', message: 'Gmail connecté avec succès ✅' })
    else if (success === 'outlook_connected') setFlash({ type: 'success', message: 'Outlook connecté avec succès ✅' })
    else if (success === 'zoho_connected') setFlash({ type: 'success', message: 'Zoho Mail connecté avec succès ✅' })
    else if (error) setFlash({ type: 'error', message: `Erreur de connexion : ${error}` })
  }, [searchParams])

  useEffect(() => {
    fetch('/api/mail/accounts')
      .then((r) => r.json())
      .then(setAccounts)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  async function disconnect(id: string) {
    setDeleting(id)
    await fetch(`/api/mail/accounts?id=${id}`, { method: 'DELETE' })
    setAccounts((prev) => prev.filter((a) => a.id !== id))
    setDeleting(null)
  }

  const connectedProviders = new Set(accounts.map((a) => a.provider))

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.push('/mail')}
            className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <FaArrowLeft className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Paramètres — Boîte mail</h1>
            <p className="text-gray-500 text-sm">Gérez vos comptes de messagerie connectés</p>
          </div>
        </div>

        {/* Flash */}
        {flash && (
          <div
            className={`mb-6 p-4 rounded-xl border text-sm font-medium ${
              flash.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            {flash.message}
          </div>
        )}

        {/* Comptes connectés */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h2 className="font-semibold text-gray-800">Comptes connectés</h2>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-400">Chargement...</div>
          ) : accounts.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              Aucun compte connecté. Ajoutez-en un ci-dessous.
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {accounts.map((account) => {
                const config = PROVIDER_CONFIG[account.provider] || {
                  label: account.provider,
                  color: 'text-gray-600',
                  bg: 'bg-gray-50 border-gray-200',
                  icon: <FaEnvelope />,
                }
                return (
                  <li key={account.id} className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{config.icon}</span>
                      <div>
                        <p className="font-medium text-gray-900">{account.email}</p>
                        <p className={`text-xs ${config.color}`}>{config.label}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => disconnect(account.id)}
                      disabled={deleting === account.id}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <FaTrash className="text-xs" />
                      {deleting === account.id ? 'Suppression...' : 'Déconnecter'}
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* Ajouter un compte */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h2 className="font-semibold text-gray-800">Ajouter un compte</h2>
          </div>
          <div className="p-6 grid gap-3">

            {/* Gmail */}
            <div className={`flex items-center justify-between p-4 rounded-xl border ${PROVIDER_CONFIG.google.bg}`}>
              <div className="flex items-center gap-3">
                <FaGoogle className="text-red-500 text-xl" />
                <div>
                  <p className="font-medium text-gray-900">Gmail</p>
                  <p className="text-xs text-gray-500">google.com</p>
                </div>
              </div>
              {connectedProviders.has('google') ? (
                <span className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-3 py-1.5 rounded-full">
                  <FaCheck className="text-xs" /> Connecté
                </span>
              ) : (
                <a
                  href="/api/mail/connect"
                  className="px-4 py-2 text-sm font-medium bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Connecter
                </a>
              )}
            </div>

            {/* Outlook */}
            <div className={`flex items-center justify-between p-4 rounded-xl border ${PROVIDER_CONFIG.outlook.bg}`}>
              <div className="flex items-center gap-3">
                <FaMicrosoft className="text-blue-500 text-xl" />
                <div>
                  <p className="font-medium text-gray-900">Outlook / Hotmail</p>
                  <p className="text-xs text-gray-500">microsoft.com</p>
                </div>
              </div>
              {connectedProviders.has('outlook') ? (
                <span className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-3 py-1.5 rounded-full">
                  <FaCheck className="text-xs" /> Connecté
                </span>
              ) : (
                <a
                  href="/api/mail/connect/outlook"
                  className="px-4 py-2 text-sm font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Connecter
                </a>
              )}
            </div>

            {/* Zoho */}
            <div className={`flex items-center justify-between p-4 rounded-xl border ${PROVIDER_CONFIG.zoho.bg}`}>
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-orange-500 text-xl" />
                <div>
                  <p className="font-medium text-gray-900">Zoho Mail</p>
                  <p className="text-xs text-gray-500">zoho.eu / zoho.com</p>
                </div>
              </div>
              {connectedProviders.has('zoho') ? (
                <span className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-3 py-1.5 rounded-full">
                  <FaCheck className="text-xs" /> Connecté
                </span>
              ) : (
                <a
                  href="/api/mail/connect/zoho"
                  className="px-4 py-2 text-sm font-medium bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Connecter
                </a>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
