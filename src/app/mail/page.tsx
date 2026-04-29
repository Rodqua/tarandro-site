'use client'

import { useState, useEffect, useCallback } from 'react'
import { EmailThread, EmailAccount, EmailCategory, CATEGORY_CONFIG } from '@/types/mail'
import { FaGoogle, FaMicrosoft, FaEnvelope } from 'react-icons/fa'

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

function providerConfig(provider: string) {
  if (provider === 'google') return { color: 'bg-red-50 text-red-700 border border-red-200', Icon: FaGoogle, iconColor: 'text-red-500' }
  if (provider === 'outlook' || provider === 'microsoft') return { color: 'bg-blue-50 text-blue-700 border border-blue-200', Icon: FaMicrosoft, iconColor: 'text-blue-500' }
  return { color: 'bg-orange-50 text-orange-700 border border-orange-200', Icon: FaEnvelope, iconColor: 'text-orange-500' }
}

function accountBadge(email: string, provider: string) {
  const cfg = providerConfig(provider)
  const username = email.split('@')[0]
  return { label: username, color: cfg.color, Icon: cfg.Icon, iconColor: cfg.iconColor }
}

function ProviderBadge({ email, provider, className = '' }: { email: string; provider: string; className?: string }) {
  const { label, color, Icon, iconColor } = accountBadge(email, provider)
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full font-medium ${color} ${className}`}>
      <Icon className={`text-[10px] ${iconColor} flex-shrink-0`} />
      {label}
    </span>
  )
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
  const [accountFilter, setAccountFilter] = useState<string | null>(null)
  const [emailBody, setEmailBody] = useState<{ html?: string; text?: string; attachments?: any[]; error?: string } | null>(null)
  const [bodyLoading, setBodyLoading] = useState(false)
  const [attachmentCounts, setAttachmentCounts] = useState<Record<string, number>>({})
  const [showCatPicker, setShowCatPicker] = useState(false)
  const [recatLoading, setRecatLoading] = useState(false)
  const [replyFiles, setReplyFiles] = useState<File[]>([])
  const [syncErrors, setSyncErrors] = useState<string[]>([])
  const [dbCounts, setDbCounts] = useState<Record<string, number>>({})
  const [mailTotal, setMailTotal] = useState(0)
  const [mailSkip, setMailSkip] = useState(0)
  const TAKE = 50

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  const loadAccounts = useCallback(async () => {
    const res = await fetch('/api/mail/accounts')
    if (res.ok) setAccounts(await res.json())
  }, [])

  const fetchCounts = useCallback(async (accFilter: string | null = null) => {
    const url = `/api/mail/counts${accFilter ? `?account=${encodeURIComponent(accFilter)}` : ''}`
    const res = await fetch(url)
    if (res.ok) setDbCounts(await res.json())
  }, [])

  const fetchEmailBody = async (thread: any) => {
    setEmailBody(null)
    setBodyLoading(true)
    try {
      const res = await fetch(`/api/mail/threads/${thread.id}/body`)
      if (res.ok) {
        const body = await res.json()
        setEmailBody(body)
        if (body.attachments?.length > 0) {
          setAttachmentCounts(prev => ({ ...prev, [thread.id]: body.attachments.length }))
        }
      }
      else setEmailBody({ error: 'Impossible de charger le contenu' })
    } catch {
      setEmailBody({ error: 'Erreur réseau' })
    }
    setBodyLoading(false)
  }

  const loadThreads = useCallback(async (filter: string, withSync = false, accFilter: string | null = null, skip = 0) => {
    setLoading(true)
    const url = `/api/mail/threads?filter=${filter}&skip=${skip}&take=10000${withSync ? '&sync=true' : ''}${accFilter ? `&account=${encodeURIComponent(accFilter)}` : ''}`
    const res = await fetch(url)
    if (res.ok) {
      const data = await res.json()
      // Support old array format and new { threads, total } format
      const list = Array.isArray(data) ? data : (data.threads || [])
      const tot = Array.isArray(data) ? data.length : (data.total || 0)
      if (skip === 0) {
        setThreads(list)
      } else {
        setThreads(prev => [...prev, ...list])
      }
      setMailTotal(tot)
      setMailSkip(skip + list.length)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    loadAccounts()
    loadThreads('all')
    fetchCounts()
  }, [loadAccounts, loadThreads, fetchCounts])

  const handleSync = async () => {
    setSyncing(true)
    setMailSkip(0)
    await loadThreads(activeFilter, true, accountFilter, 0)
    await loadAccounts()
    await fetchCounts(accountFilter)
    setSyncing(false)
    showToast('✅ Boîte synchronisée !')
  }

  const handleFilterChange = (f: string) => {
    setActiveFilter(f)
    setSelected(null)
    setCheckedIds(new Set())
    setMailSkip(0)
    loadThreads(f, false, accountFilter, 0)
  }

  const handleAccountFilterChange = (email: string | null) => {
    setAccountFilter(email)
    setMailSkip(0)
    loadThreads(activeFilter, false, email, 0)
    fetchCounts(email)
  }

  const loadMore = () => {
    loadThreads(activeFilter, false, accountFilter, mailSkip)
  }

  const handleSelect = async (thread: EmailThread) => {
    if (selectMode) {
      toggleCheck(thread.id)
      return
    }
    setSelected(thread)
    setShowReply(false)
    setReplyBody('')
    setEmailBody(null)
    setReplyFiles([])
    fetchEmailBody(thread)
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
      const err = await res.json().catch(() => ({ error: 'Erreur inconnue' }))
      showToast(`❌ ${err.error || 'Erreur lors de la suppression'}`, 'error')
    }
    setDeleting(null)
  }

  const handleReply = async () => {
    if (!selected || !replyBody.trim()) return
    setReplying(true)
    // Encode attachments as base64
    const attachmentsData = await Promise.all(replyFiles.map(async (file) => {
      return await new Promise<{name:string;mimeType:string;data:string}>((resolve) => {
        const reader = new FileReader()
        reader.onload = () => {
          const dataUrl = reader.result as string
          const base64 = dataUrl.split(',')[1] || ''
          resolve({ name: file.name, mimeType: file.type || 'application/octet-stream', data: base64 })
        }
        reader.readAsDataURL(file)
      })
    }))
    const res = await fetch(`/api/mail/threads/${selected.id}/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: replyBody, attachments: attachmentsData }),
    })
    if (res.ok) {
      showToast('✅ Réponse envoyée !')
      setReplyBody('')
      setReplyFiles([])
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

  const recategorize = async (newCat: string) => {
    if (!selected || newCat === selected.category) { setShowCatPicker(false); return }
    setRecatLoading(true)
    setShowCatPicker(false)
    try {
      const res = await fetch('/api/mail/categorize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threadId: selected.id, sender: selected.sender, subject: selected.subject, category: newCat }),
      })
      if (res.ok) {
        const data = await res.json()
        setThreads(prev => prev.map(t =>
          t.id === selected.id ? { ...t, category: newCat } :
          data.recategorized > 1 && t.id !== selected.id ? t : t
        ))
        setSelected((prev: any) => prev ? { ...prev, category: newCat } : prev)
        showToast(`✅ Catégorie corrigée${data.recategorized > 1 ? ` + ${data.recategorized} email(s) recatégorisé(s)` : ''} — règle sauvegardée`)
        // Refresh list to show updated categories
        await loadThreads(activeFilter, false, accountFilter, 0)
      } else {
        showToast('❌ Erreur lors de la recatégorisation', 'error')
      }
    } catch { showToast('❌ Erreur réseau', 'error') }
    setRecatLoading(false)
  }

  const downloadAttachment = async (url: string, filename: string) => {
    try {
      if ('showSaveFilePicker' in window) {
        const ext = filename.split('.').pop() || ''
        const mimeMap: Record<string, string> = { pdf: 'application/pdf', docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', zip: 'application/zip' }
        const handle = await (window as any).showSaveFilePicker({
          suggestedName: filename,
          types: [{ description: 'Fichier', accept: { [mimeMap[ext] || 'application/octet-stream']: ['.' + ext] } }],
        })
        const res = await fetch(url)
        const blob = await res.blob()
        const writable = await handle.createWritable()
        await writable.write(blob)
        await writable.close()
      } else {
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        a.click()
      }
    } catch (e: any) {
      if (e?.name !== 'AbortError') {
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        a.click()
      }
    }
  }

  const handleBulkDelete = async () => {
    if (checkedIds.size === 0) return
    if (!confirm(`Supprimer ${checkedIds.size} email(s) ?`)) return
    setBulkDeleting(true)
    const ids = Array.from(checkedIds)
    const res = await fetch('/api/mail/batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'remove', ids }),
    })
    if (res.ok) {
      const data = await res.json()
      const successIds = new Set<string>(data.deletedIds ?? ids)
      setThreads(prev => prev.filter(t => !successIds.has(t.id)))
      if (selected && successIds.has(selected.id)) setSelected(null)
      setCheckedIds(new Set())
      setSelectMode(false)
      if (data.failed > 0) {
        showToast(`⚠️ ${data.deleted} supprimé(s), ${data.failed} échec(s) — réessayez`, 'error')
      } else {
        showToast(`🗑️ ${data.deleted} email(s) supprimé(s)`)
      }
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

  // Les badges viennent de la DB (vrais totaux), pas seulement des threads chargés
  const counts = dbCounts
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
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 px-2">Adresses</p>
            {accounts.length === 0 ? (
              <p className="text-xs text-gray-400 px-2">Aucun compte</p>
            ) : (<>
              <button
                onClick={() => handleAccountFilterChange(null)}
                className={`w-full flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs mb-0.5 transition-colors ${accountFilter === null ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <span>📬</span> Toutes les adresses
              </button>
              {accounts.map((acc: EmailAccount) => {
                const badge = accountBadge(acc.email, acc.provider)
                const isActive = accountFilter === acc.email
                return (
                  <button
                    key={acc.id}
                    onClick={() => handleAccountFilterChange(acc.email)}
                    className={`w-full flex items-start gap-1.5 px-2 py-1.5 rounded-lg text-left mb-0.5 transition-colors ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{acc.email}</p>
                      <ProviderBadge email={acc.email} provider={acc.provider} />
                    </div>
                  </button>
                )
              })}
            </>)}
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
                const badge = accountBadge(thread.account.email, thread.account.provider)
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
                        <ProviderBadge email={thread.account.email} provider={thread.account.provider} />
                        {(() => { const cnt = attachmentCounts[thread.id] ?? thread.attachmentCount ?? 0; return cnt > 0 ? (
                          <span className="flex items-center gap-0.5 text-xs text-gray-400 ml-1" title={`${cnt} pièce(s) jointe(s)`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                            {cnt}
                          </span>
                        ) : null })()}
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
          {!loading && mailTotal > 0 && (
            <p className="px-4 py-3 text-xs text-gray-300 text-center border-t border-gray-100">
              {mailTotal} email(s)
            </p>
          )}
        </main>

        {/* Panneau de détail */}
        {showCatPicker && <div className="fixed inset-0 z-40" onClick={() => setShowCatPicker(false)} />}
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
            <div className="flex-1 overflow-y-auto flex flex-col">
              {/* Tags */}
              <div className="flex items-center gap-2 px-6 pt-3 pb-2 flex-wrap">
                {(() => {
                  const cat = CATEGORY_CONFIG[selected.category as EmailCategory] || CATEGORY_CONFIG.important
                  return (
                    <div className="relative">
                      <button
                        onClick={() => setShowCatPicker(p => !p)}
                        disabled={recatLoading}
                        title="Corriger la catégorie"
                        className={`text-xs px-2 py-1 rounded-full border font-medium ${cat.bg} ${cat.color} hover:opacity-80 transition-opacity flex items-center gap-1`}
                      >
                        {cat.emoji} {cat.label} {recatLoading ? '⏳' : '✏️'}
                      </button>
                      {showCatPicker && (
                        <div className="absolute top-7 left-0 z-50 bg-white border border-gray-200 rounded-xl shadow-xl p-2 flex flex-col gap-1 min-w-[180px]">
                          <p className="text-xs text-gray-400 px-2 pb-1 border-b border-gray-100">Corriger la catégorie</p>
                          {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
                            <button
                              key={key}
                              onClick={() => recategorize(key)}
                              className={`text-xs px-3 py-1.5 rounded-lg text-left hover:bg-gray-50 flex items-center gap-2 ${key === selected.category ? 'font-semibold bg-gray-50' : ''}`}
                            >
                              <span>{(cfg as any).emoji}</span>
                              <span>{(cfg as any).label}</span>
                              {key === selected.category && <span className="ml-auto text-indigo-500">✓</span>}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })()}
                <ProviderBadge email={selected.account.email} provider={selected.account.provider} className="px-2 py-1" />
                {selected.isUnread && <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">Non lu</span>}
                <a href={providerUrl(selected)} target="_blank" rel="noopener noreferrer" className="ml-auto text-xs text-gray-400 hover:text-indigo-600 transition-colors">↗ Ouvrir dans l'app</a>
              </div>
              {/* Corps du mail */}
              <div className="flex-1 px-6 pb-4">
                {bodyLoading ? (
                  <div className="flex items-center justify-center py-16 text-gray-400 text-sm">
                    <span className="animate-pulse">⏳ Chargement...</span>
                  </div>
                ) : emailBody?.error ? (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 mb-3">
                    ⚠️ {emailBody.error}
                    <p className="mt-2 text-gray-600 text-xs whitespace-pre-wrap">{selected.snippet}</p>
                  </div>
                ) : emailBody?.html ? (
                  <iframe
                    srcDoc={(() => {
                      const clean = emailBody.html.replace(/src="cid:[^"]*"/gi, 'src=""').replace(/src='cid:[^']*'/gi, "src=''")
                      return `<base target="_blank"><style>body{font-family:sans-serif;font-size:14px;line-height:1.6;margin:0;padding:0;word-break:break-word}a{color:#4f46e5}img{max-width:100%}.cid-blocked{display:none}</style>${clean}`
                    })()}
                    sandbox="allow-same-origin allow-popups"
                    className="w-full rounded-xl border border-gray-100 bg-white"
                    style={{ minHeight: '300px', height: '500px' }}
                    onLoad={(e) => {
                      try {
                        const doc = (e.currentTarget as HTMLIFrameElement).contentDocument
                        if (doc?.body) {
                          const h = doc.body.scrollHeight + 48
                          ;(e.currentTarget as HTMLIFrameElement).style.height = Math.min(h, 800) + 'px'
                        }
                      } catch {}
                    }}
                  />
                ) : emailBody?.text ? (
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans leading-relaxed bg-gray-50 rounded-xl p-4 border border-gray-100">{emailBody.text}</pre>
                ) : !bodyLoading && (
                  <p className="text-sm text-gray-400 italic p-4 text-center">Contenu non disponible</p>
                )}
                {/* Pièces jointes */}
                {emailBody?.attachments && emailBody.attachments.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      📎 {emailBody.attachments.length} pièce(s) jointe(s)
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {emailBody.attachments.map((att: any, i: number) => (
                        <button
                          key={att.id || i}
                          onClick={() => downloadAttachment(`/api/mail/threads/${selected.id}/attachment?id=${encodeURIComponent(att.id)}&filename=${encodeURIComponent(att.name)}`, att.name)}
                          className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs hover:bg-indigo-50 hover:border-indigo-300 transition-colors group"
                        >
                          <span className="text-base">📄</span>
                          <div>
                            <p className="font-medium text-gray-800 group-hover:text-indigo-700 truncate max-w-[160px]">{att.name}</p>
                            {att.size > 0 && (
                              <p className="text-gray-400">{att.size > 1048576 ? `${(att.size/1048576).toFixed(1)} Mo` : `${Math.round(att.size/1024)} Ko`}</p>
                            )}
                          </div>
                          <span className="text-indigo-400 group-hover:text-indigo-600">↓</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="border-t border-gray-200 flex-shrink-0">
              {!showReply ? (
                <div className="px-6 py-3 flex gap-2">
                  <button
                    onClick={() => {
                      setShowReply(true)
                      // Pré-remplir avec la signature du compte (match par email)
                      const acc = accounts.find((a: any) => a.email === selected?.account?.email)
                      const sig = (acc as any)?.signature
                      setReplyBody(sig ? `\n\n-- \n${sig}` : '')
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                  >
                    ↩️ Répondre
                  </button>
                </div>
              ) : (
                <div className="px-6 py-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs text-gray-500 font-medium">
                      ↩️ Réponse à <span className="text-gray-700">{extractEmail(selected.sender)}</span>
                      <span className="ml-2 text-gray-400">depuis {selected.account.email}</span>
                    </div>
                    <span className="text-xs text-gray-300">{replyBody.length} car.</span>
                  </div>
                  <textarea
                    value={replyBody}
                    onChange={e => setReplyBody(e.target.value)}
                    placeholder="Votre réponse..."
                    rows={7}
                    autoFocus
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm resize-y focus:outline-none focus:ring-2 focus:ring-indigo-400 font-mono leading-relaxed"
                  />
                  {/* Pièces jointes */}
                  {replyFiles.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {replyFiles.map((f, i) => (
                        <span key={i} className="flex items-center gap-1 px-2 py-1 bg-indigo-50 border border-indigo-200 rounded-lg text-xs text-indigo-700">
                          📎 {f.name}
                          <button onClick={() => setReplyFiles(prev => prev.filter((_, j) => j !== i))} className="ml-1 text-indigo-400 hover:text-red-500">✕</button>
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2 mt-2 items-center">
                    <button
                      onClick={handleReply}
                      disabled={replying || !replyBody.trim()}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                    >
                      {replying ? '⏳ Envoi...' : '📤 Envoyer'}
                    </button>
                    <label className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm transition-colors cursor-pointer" title="Joindre un fichier">
                      📎
                      <input
                        type="file"
                        multiple
                        className="hidden"
                        onChange={e => setReplyFiles(prev => [...prev, ...Array.from(e.target.files || [])])}
                      />
                    </label>
                    <button
                      onClick={() => { setShowReply(false); setReplyBody(''); setReplyFiles([]) }}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm transition-colors"
                    >
                      Annuler
                    </button>
                    <a
                      href="/mail/settings"
                      className="ml-auto text-xs text-gray-400 hover:text-indigo-600 self-center transition-colors"
                      title="Modifier la signature"
                    >
                      ✏️ Signature
                    </a>
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
