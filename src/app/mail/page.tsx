'use client'

import { useState, useEffect, useCallback } from 'react'
import { EmailThread, EmailAccount, EmailCategory, CATEGORY_CONFIG } from '@/types/mail'

const FILTERS = [
  { key: 'all', label: 'Tous', emoji: '📬' },
  { key: 'unread', label: 'Non lus', emoji: '🔵' },
  { key: 'important', label: 'Important', emoji: '🔴' },
  { key: 'compta', label: 'Comptabilité', emoji: '💼' },
  { key: 'veille', label: 'Veille santé', emoji: '🏥' },
  { key: 'loge', label: 'Loge', emoji: '🤝' },
  { key: 'events', label: 'Événements', emoji: '🗓️' },
  { key: 'newsletter', label: 'Newsletters', emoji: '📧' },
]

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  if (days === 1) return 'Hier'
  if (days < 7) return d.toLocaleDateString('fr-FR', { weekday: 'short' })
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
}

function extractName(sender: string) {
  const m = sender.match(/^(.+?)\s*</)
  if (m) return m[1].replace(/"/g, '').trim()
  return sender.split('@')[0]
}

function extractEmail(sender: string) {
  const m = sender.match(/<(.+)>/)
  return m ? m[1] : sender
}

function providerBadge(provider: string) {
  if (provider === 'google') return { label: 'Gmail', color: 'bg-red-100 text-red-700' }
  if (provider === 'outlook' || provider === 'microsoft') return { label: 'Outlook', color: 'bg-blue-100 text-blue-700' }
  return { label: 'Zoho', color: 'bg-orange-100 text-orange-700' }
}

function providerUrl(thread: EmailThread) {
  if (thread.account.provider === 'google') return `https://mail.google.com/mail/u/0/#inbox/${thread.threadId}`
  if (thread.account.provider === 'outlook' || thread.account.provider === 'microsoft') return `https://outlook.live.com/mail/0/`
  return `https://mail.zoho.eu/zm/`
}

export default function MailPage() {
  const [threads, setThreads] = useState<EmailThread[]>([])
  const [accounts, setAccounts] = useState<EmailAccount[]>([])
  const [activeFilter, setActiveFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selected, setSelected] = useState<EmailThread | null>(null)
  const [replyBody, setReplyBody] = useState('')
  const [replying, setReplying] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [bulkDeleting, setBulkDeleting] = useState(false)
  const [showReply, setShowReply] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  // Sélection multiple
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set())
  const [selectMode, setSelectMode] = useState(false)

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  const loadAccounts = useCallback(async () => {
    const res = await fetch('/api/mail/accounts')
    if (res.ok) setAccounts(await res.json())
  }, [])

  const loadThreads = useCallback(async (filter: string, withSync = false) => {
    setLoading(true)
    const url = `/api/mail/threads?filter=${filter}${withSync ? '&sync=true' : ''}`
    const res = await fetch(url)
    if (res.ok) setThreads(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => {
    loadAccounts()
    loadThreads('all')
  }, [loadAccounts, loadThreads])

  const handleSync = async () => {
    setSyncing(true)
    await loadThreads(activeFilter, true)
    await loadAccounts()
    setSyncing(false)
    showToast('✅ Boîte synchronisée !')
  }

  const handleFilterChange = (f: string) => {
    setActiveFilter(f)
    setSelected(null)
    setCheckedIds(new Set())
    loadThreads(f)
  }

  const handleSelect = async (thread: EmailThread) => {
    if (selectMode) {
      toggleCheck(thread.id)
      return
    }
    setSelected(thread)
    setShowReply(false)
    setReplyBody('')
    if (thread.isUnread) {
      await fetch(`/api/mail/threads/${thread.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markRead: true }),
      })
      setThreads(prev => prev.map(t => t.id === thread.id ? { ...t, isUnread: false } : t))
      setSelected(prev => prev ? { ...prev, isUnread: false } : prev)
    }
  }

  const handleDelete = async (thread: EmailThread, e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (!confirm(`Supprimer "${thread.subject}" ?`)) return
    setDeleting(thread.id)
    const res = await fetch(`/api/mail/threads/${thread.id}`, { method: 'DELETE' })
    if (res.ok) {
      setThreads(prev => prev.filter(t => t.id !== thread.id))
      if (selected?.id === thread.id) setSelected(null)
      showToast('🗑️ Email supprimé')
    } else {
      showToast('❌ Erreur lors de la suppression', 'error')
    }
    setDeleting(null)
  }

  const handleReply = async () => {
    if (!selected || !replyBody.trim()) return
    setReplying(true)
    const res = await fetch(`/api/mail/threads/${selected.id}/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: replyBody }),
    })
    if (res.ok) {
      showToast('✅ Réponse envoyée !')
      setReplyBody('')
      setShowReply(false)
    } else {
      const err = await res.json()
      showToast(`❌ Erreur : ${err.error}`, 'error')
    }
    setReplying(false)
  }

  // --- Sélection multiple ---
  const toggleCheck = (id: string) => {
    setCheckedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleSelectAll = () => {
    if (checkedIds.size === filtered.length) {
      setCheckedIds(new Set())
    } else {
      setCheckedIds(new Set(filtered.map(t => t.id)))
    }
  }

  const handleBulkDelete = async () => {
    if (checkedIds.size === 0) return
    if (!confirm(`Supprimer ${checkedIds.size} email(s) ?`)) return
    setBulkDeleting(true)
    const ids = Array.from(checkedIds)
    const res = await fetch('/api/mail/threads/bulk-delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    })
    if (res.ok) {
      setThreads(prev => prev.filter(t => !checkedIds.has(t.id)))
      if (selected && checkedIds.has(selected.id)) setSelected(null)
      setCheckedIds(new Set())
      setSelectMode(false)
      showToast(`🗑️ ${ids.length} email(s) supprimé(s)`)
    } else {
      showToast('❌ Erreur lors de la suppression', 'error')
    }
    setBulkDeleting(false)
  }

  const exitSelectMode = () => {
    setSelectMode(false)
    setCheckedIds(new Set())
  }

  const filtered = threads.filter(t => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return t.subject.toLowerCase().includes(q) || t.sender.toLowerCase().includes(q) || t.snippet.toLowerCase().includes(q)
  })

  const counts: Record<string, number> = { all: threads.length }
  threads.forEach(t => { counts[t.category] = (counts[t.category] || 0) + 1 })
  counts.unread = threads.filter(t => t.isUnread).length
  const allChecked = filtered.length > 0 && checkedIds.size === filtered.length

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
          {toast.msg}
        </div>
      )}

      {/* Barre d'actions bulk */}
      {selectMode && (
        <div className="bg-indigo-600 text-white px-4 py-2.5 flex items-center gap-3 flex-shrink-0 z-10">
          <input
            type="checkbox"
            checked={allChecked}
            onChange={toggleSelectAll}
            className="w-4 h-4 rounded accent-white cursor-pointer"
          />
          <span className="text-sm font-medium flex-1">
            {checkedIds.size === 0 ? 'Aucun sélectionné' : `${checkedIds.size} sélectionné(s)`}
          </span>
          {checkedIds.size > 0 && (
            <button
              onClick={handleBulkDelete}
              disabled={bulkDeleting}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              🗑️ {bulkDeleting ? 'Suppression...' : `Supprimer (${checkedIds.size})`}
            </button>
          )}
          <button onClick={exitSelectMode} className="px-3 py-1.5 bg-indigo-500 hover:bg-indigo-400 rounded-lg text-sm transition-colors">
            Annuler
          </button>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 flex-shrink-0">
        <h1 className="text-lg font-bold text-gray-900 hidden sm:block">📬 Tarandro Mail</h1>
        <div className="flex-1">
          <input
            type="search"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full max-w-sm px-3 py-1.5 bg-gray-100 rounded-lg text-sm border-0 outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
        <div className="flex items-center gap-2 ml-auto">
          {!selectMode && (
            <button
              onClick={() => { setSelectMode(true); setSelected(null) }}
              className="px-2.5 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Sélection multiple"
            >
              ☑️
            </button>
          )}
          <button
            onClick={handleSync}
            disabled={syncing || accounts.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            <span className={syncing ? 'animate-spin' : ''}>🔄</span>
            <span className="hidden sm:inline">{syncing ? 'Synchro...' : 'Sync'}</span>
          </button>
          <a href="/mail/filters" className="px-2.5 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Filtres IA">⚡</a>
          <a href="/mail/settings" className="px-2.5 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Paramètres">⚙️</a>
          <a href="/admin" className="px-2.5 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">← Admin</a>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-48 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 overflow-y-auto">
          <nav className="p-2 flex-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 px-2">Filtres</p>
            {FILTERS.map(f => (
              <button
                key={f.key}
                onClick={() => handleFilterChange(f.key)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-sm mb-0.5 transition-colors ${activeFilter === f.key ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <span className="flex items-center gap-1.5"><span>{f.emoji}</span><span>{f.label}</span></span>
                {counts[f.key] ? <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${activeFilter === f.key ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500'}`}>{counts[f.key]}</span> : null}
              </button>
            ))}
          </nav>
          <div className="p-2 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 px-2">Comptes</p>
            {accounts.length === 0 ? (
              <p className="text-xs text-gray-400 px-2">Aucun compte</p>
            ) : accounts.map((acc: EmailAccount) => {
              const badge = providerBadge(acc.provider)
              return (
                <div key={acc.id} className="px-2 py-1 rounded-lg">
                  <p className="text-xs font-medium text-gray-700 truncate">{acc.email}</p>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${badge.color}`}>{badge.label}</span>
                </div>
              )
            })}
            <a href="/mail/settings" className="mt-1 flex items-center gap-1 w-full px-2 py-1.5 border border-dashed border-gray-300 rounded-lg text-xs text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors">
              <span>＋</span> Ajouter un compte
            </a>
          </div>
        </aside>

        {/* Liste emails */}
        <main className={`flex-1 overflow-y-auto bg-white border-r border-gray-200 ${selected && !selectMode ? 'hidden sm:block sm:w-80 sm:flex-none' : 'w-full'}`}>
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center"><div className="text-4xl mb-3 animate-pulse">📬</div><p className="text-gray-400 text-sm">Chargement...</p></div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center"><div className="text-4xl mb-3">🎉</div><p className="text-gray-500 font-medium">{accounts.length === 0 ? 'Connecte un compte pour commencer' : 'Aucun email ici'}</p></div>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filtered.map(thread => {
                const cat = CATEGORY_CONFIG[thread.category as EmailCategory] || CATEGORY_CONFIG.important
                const badge = providerBadge(thread.account.provider)
                const isSelected = selected?.id === thread.id
                const isChecked = checkedIds.has(thread.id)
                return (
                  <div
                    key={thread.id}
                    onClick={() => handleSelect(thread)}
                    className={`flex items-start gap-2.5 px-4 py-3 cursor-pointer transition-colors group ${isChecked ? 'bg-indigo-50' : isSelected ? 'bg-indigo-50 border-l-2 border-indigo-500' : thread.isUnread ? 'hover:bg-gray-50 bg-blue-50/30' : 'hover:bg-gray-50'}`}
                  >
                    {/* Checkbox en mode sélection, sinon pastille */}
                    <div className="flex-shrink-0 mt-1.5">
                      {selectMode ? (
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={e => { e.stopPropagation(); toggleCheck(thread.id) }}
                          onClick={e => e.stopPropagation()}
                          className="w-4 h-4 rounded accent-indigo-600 cursor-pointer"
                        />
                      ) : (
                        thread.isUnread ? <div className="w-2 h-2 rounded-full bg-blue-500" /> : <div className="w-2 h-2 rounded-full bg-gray-200" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className={`font-semibold text-xs truncate ${thread.isUnread ? 'text-gray-900' : 'text-gray-600'}`}>{extractName(thread.sender)}</span>
                        <span className="text-xs text-gray-400 flex-shrink-0">{formatDate(thread.date)}</span>
                      </div>
                      <p className={`text-xs truncate mb-0.5 ${thread.isUnread ? 'text-gray-800 font-medium' : 'text-gray-600'}`}>{thread.subject}</p>
                      <p className="text-xs text-gray-400 truncate">{thread.snippet}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className={`text-xs px-1.5 py-0.5 rounded-full border font-medium ${cat.bg} ${cat.color}`}>{cat.emoji}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${badge.color}`}>{badge.label}</span>
                      </div>
                    </div>
                    {!selectMode && (
                      <button
                        onClick={e => handleDelete(thread, e)}
                        disabled={deleting === thread.id}
                        className="flex-shrink-0 p-1 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all rounded"
                        title="Supprimer"
                      >
                        {deleting === thread.id ? '⏳' : '🗑️'}
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </main>

        {/* Panneau de détail */}
        {selected && !selectMode ? (
          <div className="flex-1 flex flex-col overflow-hidden bg-white">
            <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h2 className="text-base font-bold text-gray-900 mb-1">{selected.subject}</h2>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-gray-600">{extractName(selected.sender)}</span>
                    <span className="text-xs text-gray-400">&lt;{extractEmail(selected.sender)}&gt;</span>
                    <span className="text-xs text-gray-400">{new Date(selected.date).toLocaleString('fr-FR')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <a href={providerUrl(selected)} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors">
                    ↗ Ouvrir
                  </a>
                  <button
                    onClick={() => handleDelete(selected)}
                    disabled={deleting === selected.id}
                    className="px-3 py-1.5 text-xs bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                  >
                    🗑️ Supprimer
                  </button>
                  <button onClick={() => setSelected(null)} className="sm:hidden p-1.5 text-gray-400 hover:text-gray-600 rounded-lg">✕</button>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed mb-4">
                {selected.snippet || '(pas de contenu prévisualisé)'}
              </div>
              <div className="flex items-center gap-2 mb-4">
                {(() => { const cat = CATEGORY_CONFIG[selected.category as EmailCategory] || CATEGORY_CONFIG.important; return <span className={`text-xs px-2 py-1 rounded-full border font-medium ${cat.bg} ${cat.color}`}>{cat.emoji} {cat.label}</span> })()}
                <span className={`text-xs px-2 py-1 rounded-full ${providerBadge(selected.account.provider).color}`}>{providerBadge(selected.account.provider).label}</span>
                {selected.isUnread && <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">Non lu</span>}
              </div>
              <p className="text-xs text-gray-400 text-center">
                Pour voir le contenu complet, <a href={providerUrl(selected)} target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline">ouvrir dans {providerBadge(selected.account.provider).label}</a>.
              </p>
            </div>
            <div className="border-t border-gray-200 flex-shrink-0">
              {!showReply ? (
                <div className="px-6 py-3 flex gap-2">
                  <button onClick={() => setShowReply(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                    ↩️ Répondre
                  </button>
                </div>
              ) : (
                <div className="px-6 py-4">
                  <div className="text-xs text-gray-500 mb-2 font-medium">Réponse à : {extractEmail(selected.sender)}</div>
                  <textarea
                    value={replyBody}
                    onChange={e => setReplyBody(e.target.value)}
                    placeholder="Votre réponse..."
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                  <div className="flex gap-2 mt-2">
                    <button onClick={handleReply} disabled={replying || !replyBody.trim()} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors">
                      {replying ? 'Envoi...' : '📤 Envoyer'}
                    </button>
                    <button onClick={() => { setShowReply(false); setReplyBody('') }} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm transition-colors">Annuler</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : !selectMode ? (
          <div className="flex-1 hidden sm:flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="text-5xl mb-3">✉️</div>
              <p className="text-gray-400 text-sm">Sélectionne un email pour le lire</p>
              <p className="text-gray-300 text-xs mt-1">ou utilise le bouton Sync pour charger tes mails</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
