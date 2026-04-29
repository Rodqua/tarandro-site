'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface FilterRule {
  id: string
  name: string
  description: string
  field: string
  pattern: string
  category: string
  priority: number
  isActive: boolean
  isBuiltIn: boolean
}

interface EmailCluster {
  name: string
  pattern: string
  emails: number[]
  senderDomains: string[]
  keywords: string[]
  suggestedAction: { label?: string; archive?: boolean; markRead?: boolean }
  reason: string
  emailSamples: { provider: string; account: string; from: string; subject: string }[]
}

interface AnalyzeResult {
  clusters: EmailCluster[]
  providerCounts: Record<string, number>
  totalEmails: number
  errors: string[]
}

const CATEGORY_COLORS: Record<string, string> = {
  important: 'bg-yellow-100 text-yellow-800',
  compta: 'bg-blue-100 text-blue-800',
  veille: 'bg-green-100 text-green-800',
  events: 'bg-purple-100 text-purple-800',
  loge: 'bg-pink-100 text-pink-800',
  newsletter: 'bg-gray-100 text-gray-700',
}

const FIELD_LABELS: Record<string, string> = {
  all: 'Tout le message',
  sender: 'Expéditeur',
  subject: 'Objet',
}

const PROVIDER_ICONS: Record<string, string> = {
  gmail: '📧',
  outlook: '📨',
  zoho: '📩',
}

export default function FiltersPage() {
  const router = useRouter()
  const [rules, setRules] = useState<FilterRule[]>([])
  const [loading, setLoading] = useState(true)
  const [aiInput, setAiInput] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiPreview, setAiPreview] = useState<Partial<FilterRule> | null>(null)
  const [saving, setSaving] = useState(false)
  const [flash, setFlash] = useState<string | null>(null)

  // Global AI analysis state
  const [analyzeLimit, setAnalyzeLimit] = useState(50)
  const [analyzeLoading, setAnalyzeLoading] = useState(false)
  const [analyzeResult, setAnalyzeResult] = useState<AnalyzeResult | null>(null)
  const [applyingIdx, setApplyingIdx] = useState<number | null>(null)
  const [appliedIdx, setAppliedIdx] = useState<Set<number>>(new Set())

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<FilterRule>>({})
  const [editSaving, setEditSaving] = useState(false)
  const [mergeIds, setMergeIds] = useState<Set<string>>(new Set())
  const [merging, setMerging] = useState(false)
  const [reapplying, setReapplying] = useState(false)

  const showFlash = (msg: string) => { setFlash(msg); setTimeout(() => setFlash(null), 3500) }

  async function loadRules() {
    setLoading(true)
    const res = await fetch('/api/mail/filters')
    if (res.ok) setRules(await res.json())
    setLoading(false)
  }

  useEffect(() => { loadRules() }, [])

  async function toggleRule(id: string, isActive: boolean) {
    await fetch(`/api/mail/filters/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive }) })
    setRules(prev => prev.map(r => r.id === id ? { ...r, isActive } : r))
  }

  async function deleteRule(id: string) {
    if (!confirm('Supprimer ce filtre ?')) return
    const res = await fetch(`/api/mail/filters/${id}`, { method: 'DELETE' })
    if (res.ok) setRules(prev => prev.filter(r => r.id !== id))
    else showFlash('❌ Impossible de supprimer un filtre intégré.')
  }

  async function askAi() {
    if (!aiInput.trim()) return
    setAiLoading(true)
    setAiPreview(null)
    try {
      const res = await fetch('/api/mail/filters/ai-suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: aiInput }),
      })
      const data = await res.json()
      if (res.ok) setAiPreview(data)
      else showFlash(`❌ ${data.error || 'Erreur IA'}`)
    } catch {
      showFlash('❌ Erreur de connexion IA')
    }
    setAiLoading(false)
  }

  async function saveAiRule() {
    if (!aiPreview) return
    setSaving(true)
    const res = await fetch('/api/mail/filters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...aiPreview, priority: 50 }),
    })
    if (res.ok) {
      showFlash('✅ Filtre ajouté !')
      setAiPreview(null)
      setAiInput('')
      await loadRules()
    } else showFlash('❌ Erreur lors de la sauvegarde')
    setSaving(false)
  }

  async function runAnalysis() {
    setAnalyzeLoading(true)
    setAnalyzeResult(null)
    setAppliedIdx(new Set())
    try {
      const res = await fetch('/api/mail/filters/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ limit: analyzeLimit }),
      })
      const data = await res.json()
      if (res.ok) {
        setAnalyzeResult(data)
        if (data.errors?.length) showFlash(`⚠️ ${data.errors.length} compte(s) avec erreur`)
      } else showFlash(`❌ ${data.error || 'Erreur analyse'}`)
    } catch (e: any) {
      showFlash(`❌ Erreur: ${e?.message || 'connexion impossible'}`)
    }
    setAnalyzeLoading(false)
  }

  async function applyCluster(idx: number) {
    setApplyingIdx(idx)
    try {
      const res = await fetch('/api/mail/filters/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ limit: analyzeLimit, apply: true, clusterIndex: idx }),
      })
      const data = await res.json()
      if (res.ok) {
        const created = (data.applyResults || []).filter((r: any) => r.status === 'created').length
        showFlash(`✅ ${created} filtre(s) Gmail créé(s) pour "${analyzeResult?.clusters[idx]?.name}"`)
        setAppliedIdx(prev => { const s = new Set(Array.from(prev)); s.add(idx); return s })
      } else {
        showFlash(`❌ ${data.error || 'Erreur application'}`)
      }
    } catch {
      showFlash('❌ Erreur de connexion')
    }
    setApplyingIdx(null)
  }

  function startEdit(rule: FilterRule) {
    setEditingId(rule.id)
    setEditForm({ name: rule.name, description: rule.description, field: rule.field, pattern: rule.pattern, category: rule.category, priority: rule.priority })
  }

  async function saveEdit(id: string) {
    setEditSaving(true)
    const res = await fetch(`/api/mail/filters/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    })
    if (res.ok) {
      const updated = await res.json()
      setRules(prev => prev.map(r => r.id === id ? { ...r, ...updated } : r))
      setEditingId(null)
      showFlash('✅ Filtre mis à jour')
    } else showFlash('❌ Erreur lors de la mise à jour')
    setEditSaving(false)
  }

  function toggleMerge(id: string) {
    setMergeIds(prev => {
      const next = new Set(Array.from(prev))
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  async function mergeSelected() {
    if (mergeIds.size < 2) return
    const selected = rules.filter(r => mergeIds.has(r.id))
    const mergedPattern = selected.map(r => r.pattern).join('|')
    const mergedName = selected.map(r => r.name).join(' + ')
    const category = selected[0].category
    setMerging(true)
    // Create merged rule
    const res = await fetch('/api/mail/filters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: mergedName,
        description: `Fusion de : ${selected.map(r => r.name).join(', ')}`,
        field: selected[0].field,
        pattern: mergedPattern,
        category,
        priority: Math.max(...selected.map(r => r.priority)),
      }),
    })
    if (res.ok) {
      // Delete merged rules
      await Promise.all(selected.map(r => fetch(`/api/mail/filters/${r.id}`, { method: 'DELETE' })))
      showFlash(`✅ ${selected.length} filtres fusionnés`)
      setMergeIds(new Set())
      await loadRules()
    } else showFlash('❌ Erreur lors de la fusion')
    setMerging(false)
  }

  async function reapplyRule(rule: FilterRule) {
    setReapplying(true)
    const res = await fetch('/api/mail/categorize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ threadId: '__reapply__', sender: rule.field === 'sender' ? rule.pattern : '', subject: rule.field === 'subject' ? rule.pattern : '', category: rule.category }),
    })
    if (res.ok) {
      const data = await res.json()
      showFlash(`✅ ${data.recategorized} email(s) recatégorisé(s) avec ce filtre`)
    } else showFlash(`❌ Erreur lors de l'application`)
    setReapplying(false)
  }

  const CATEGORIES = ['important', 'compta', 'veille', 'events', 'loge', 'newsletter']

  const builtIn = rules.filter(r => r.isBuiltIn)
  const custom = rules.filter(r => !r.isBuiltIn)

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => router.push('/mail')} className="p-2 rounded-lg hover:bg-gray-200 transition-colors">
            ←
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Filtres & Catégorisation</h1>
            <p className="text-gray-500 text-sm">Gérez comment vos emails sont triés automatiquement</p>
          </div>
        </div>

        {flash && (
          <div className="mb-4 p-3 rounded-xl bg-white border text-sm font-medium text-gray-800 shadow-sm">{flash}</div>
        )}

        {/* ── Section Analyse IA globale ─────────────────────────────────── */}
        <div className="bg-gradient-to-br from-violet-50 to-blue-50 border border-violet-200 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🔍</span>
            <h2 className="font-semibold text-gray-900">Analyse IA globale</h2>
            <span className="ml-auto text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-medium">Gmail · Outlook · Zoho</span>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Claude analyse tes emails de tous tes comptes confondus, détecte les patterns et propose des filtres Gmail à créer en un clic.
          </p>

          <div className="flex items-center gap-3 mb-4">
            <label className="text-sm text-gray-600 whitespace-nowrap">Emails par compte :</label>
            <input
              type="number"
              min={10} max={100} step={10}
              value={analyzeLimit}
              onChange={e => setAnalyzeLimit(Number(e.target.value))}
              className="w-24 px-3 py-1.5 rounded-lg border border-violet-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
            <button
              onClick={runAnalysis}
              disabled={analyzeLoading}
              className="px-5 py-2 bg-violet-600 text-white rounded-xl text-sm font-medium hover:bg-violet-700 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              {analyzeLoading ? (
                <>
                  <span className="inline-block animate-spin">⟳</span>
                  Analyse en cours… (30–60s)
                </>
              ) : '🚀 Analyser mes emails'}
            </button>
          </div>

          {/* Résultats */}
          {analyzeResult && (
            <div className="mt-2">
              {/* Résumé providers */}
              <div className="flex gap-3 mb-4 flex-wrap">
                <span className="text-xs text-gray-500">{analyzeResult.totalEmails} emails analysés ·</span>
                {Object.entries(analyzeResult.providerCounts).map(([p, n]) => (
                  <span key={p} className="text-xs bg-white border border-gray-200 rounded-full px-2 py-0.5 text-gray-600">
                    {PROVIDER_ICONS[p] || '📧'} {p} : {n}
                  </span>
                ))}
                {analyzeResult.clusters.length > 0 && (
                  <span className="text-xs bg-violet-100 text-violet-700 rounded-full px-2 py-0.5 font-medium">
                    {analyzeResult.clusters.length} cluster{analyzeResult.clusters.length > 1 ? 's' : ''} détecté{analyzeResult.clusters.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {analyzeResult.clusters.length === 0 ? (
                <div className="text-center text-gray-400 text-sm py-4">Aucun cluster détecté. Essaie d&apos;augmenter le nombre d&apos;emails.</div>
              ) : (
                <div className="space-y-3">
                  {analyzeResult.clusters.map((cluster, idx) => (
                    <div key={idx} className={`bg-white rounded-xl border p-4 transition-all ${appliedIdx.has(idx) ? 'border-green-300 bg-green-50' : 'border-violet-100'}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="font-semibold text-gray-900 text-sm">{cluster.name}</span>
                            {cluster.suggestedAction?.label && (
                              <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">{cluster.suggestedAction.label}</span>
                            )}
                            {cluster.suggestedAction?.archive && (
                              <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">Skip inbox</span>
                            )}
                            {cluster.suggestedAction?.markRead && (
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Marquer lu</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mb-2">{cluster.reason}</p>
                          <div className="flex gap-2 flex-wrap mb-2">
                            {(cluster.senderDomains || []).slice(0, 4).map(d => (
                              <code key={d} className="text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">@{d}</code>
                            ))}
                            {(cluster.keywords || []).slice(0, 3).map(k => (
                              <code key={k} className="text-xs bg-blue-50 px-1.5 py-0.5 rounded text-blue-600">{k}</code>
                            ))}
                          </div>
                          {/* Sample emails */}
                          <div className="text-xs text-gray-400 space-y-0.5">
                            {cluster.emailSamples?.slice(0, 2).map((e, i) => (
                              <div key={i} className="truncate">
                                <span className="mr-1">{PROVIDER_ICONS[e.provider]}</span>
                                <span className="font-medium text-gray-500">{e.from.split('<')[0].trim().slice(0, 25)}</span>
                                {' · '}
                                <span>{e.subject.slice(0, 40)}</span>
                              </div>
                            ))}
                            {(cluster.emailSamples?.length || 0) > 2 && (
                              <div className="text-gray-400">+{(cluster.emailSamples?.length || 0) - 2} autres…</div>
                            )}
                          </div>
                        </div>

                        <div className="flex-shrink-0">
                          {appliedIdx.has(idx) ? (
                            <span className="text-xs text-green-600 font-medium flex items-center gap-1">✅ Appliqué</span>
                          ) : (
                            <button
                              onClick={() => applyCluster(idx)}
                              disabled={applyingIdx !== null}
                              className="px-3 py-1.5 bg-violet-600 text-white rounded-lg text-xs font-medium hover:bg-violet-700 disabled:opacity-50 transition-colors whitespace-nowrap"
                            >
                              {applyingIdx === idx ? '⟳ Application…' : '⚡ Appliquer'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {analyzeResult.errors?.length > 0 && (
                <details className="mt-3 text-xs text-gray-400 cursor-pointer">
                  <summary>{analyzeResult.errors.length} erreur(s) de collecte</summary>
                  <ul className="mt-1 space-y-0.5 pl-2">
                    {analyzeResult.errors.map((e, i) => <li key={i}>• {e}</li>)}
                  </ul>
                </details>
              )}
            </div>
          )}
        </div>

        {/* ── Section IA description libre ──────────────────────────────── */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">🤖</span>
            <h2 className="font-semibold text-gray-900">Créer un filtre avec l&apos;IA</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Décris en langage naturel ce que tu veux filtrer. L&apos;IA génère la règle automatiquement.
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={aiInput}
              onChange={e => setAiInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && askAi()}
              placeholder="Ex : emails de mon banquier ou avec 'virement' dans l'objet"
              className="flex-1 px-4 py-2.5 rounded-xl border border-indigo-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
              onClick={askAi}
              disabled={aiLoading || !aiInput.trim()}
              className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {aiLoading ? '⏳' : '✨ Générer'}
            </button>
          </div>

          {aiPreview && (
            <div className="mt-4 bg-white rounded-xl border border-indigo-200 p-4">
              <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-2">Aperçu du filtre généré</p>
              <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                <div><span className="text-gray-500">Nom :</span> <strong>{aiPreview.name}</strong></div>
                <div><span className="text-gray-500">Catégorie :</span> <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${CATEGORY_COLORS[aiPreview.category || ''] || 'bg-gray-100'}`}>{aiPreview.category}</span></div>
                <div><span className="text-gray-500">Champ :</span> {FIELD_LABELS[aiPreview.field || 'all']}</div>
                <div className="truncate"><span className="text-gray-500">Pattern :</span> <code className="text-xs bg-gray-100 px-1 rounded">{aiPreview.pattern}</code></div>
              </div>
              <p className="text-sm text-gray-600 italic mb-3">&ldquo;{aiPreview.description}&rdquo;</p>
              <div className="flex gap-2">
                <button onClick={saveAiRule} disabled={saving} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50">
                  {saving ? 'Sauvegarde...' : '✅ Enregistrer ce filtre'}
                </button>
                <button onClick={() => setAiPreview(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm">
                  Annuler
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Filtres personnalisés */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-gray-800">Filtres personnalisés</h2>
              <span className="text-xs text-gray-400">{custom.length} filtre{custom.length !== 1 ? 's' : ''}</span>
            </div>
            {mergeIds.size >= 2 && (
              <button
                onClick={mergeSelected}
                disabled={merging}
                className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center gap-1"
              >
                {merging ? '⏳' : '🔗'} Fusionner {mergeIds.size} filtres
              </button>
            )}
            {mergeIds.size > 0 && mergeIds.size < 2 && (
              <span className="text-xs text-gray-400">Sélectionne 1 filtre de plus pour fusionner</span>
            )}
          </div>
          {loading ? (
            <div className="p-8 text-center text-gray-400">Chargement...</div>
          ) : custom.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <p className="text-2xl mb-2">✨</p>
              <p>Aucun filtre personnalisé. Utilise l&apos;analyse globale ou l&apos;IA ci-dessus !</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {custom.map(rule => (
                <li key={rule.id} className="px-6 py-4">
                  {editingId === rule.id ? (
                    /* ── Formulaire d'édition inline ── */
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">Nom</label>
                          <input value={editForm.name || ''} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))}
                            className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">Catégorie</label>
                          <select value={editForm.category || ''} onChange={e => setEditForm(p => ({ ...p, category: e.target.value }))}
                            className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white">
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">Champ</label>
                          <select value={editForm.field || 'all'} onChange={e => setEditForm(p => ({ ...p, field: e.target.value }))}
                            className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white">
                            {Object.entries(FIELD_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">Priorité</label>
                          <input type="number" value={editForm.priority ?? 0} onChange={e => setEditForm(p => ({ ...p, priority: Number(e.target.value) }))}
                            className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Pattern <span className="text-gray-400">(sépare plusieurs valeurs par |)</span></label>
                        <input value={editForm.pattern || ''} onChange={e => setEditForm(p => ({ ...p, pattern: e.target.value }))}
                          className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 font-mono" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Description</label>
                        <input value={editForm.description || ''} onChange={e => setEditForm(p => ({ ...p, description: e.target.value }))}
                          className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => saveEdit(rule.id)} disabled={editSaving}
                          className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 disabled:opacity-50">
                          {editSaving ? 'Sauvegarde…' : '✅ Sauvegarder'}
                        </button>
                        <button onClick={() => reapplyRule({ ...rule, ...editForm } as FilterRule)} disabled={reapplying}
                          className="px-4 py-1.5 bg-amber-500 text-white rounded-lg text-xs font-medium hover:bg-amber-600 disabled:opacity-50" title="Recatégorise les emails existants avec ce filtre">
                          {reapplying ? '⏳' : '🔄'} Réappliquer aux emails
                        </button>
                        <button onClick={() => setEditingId(null)} className="px-4 py-1.5 text-gray-500 hover:bg-gray-100 rounded-lg text-xs">Annuler</button>
                      </div>
                    </div>
                  ) : (
                    /* ── Vue normale ── */
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <input type="checkbox" checked={mergeIds.has(rule.id)} onChange={() => toggleMerge(rule.id)}
                          className="mt-1 w-4 h-4 rounded accent-indigo-600 cursor-pointer flex-shrink-0" title="Sélectionner pour fusion" />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="font-medium text-gray-900 text-sm">{rule.name}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[rule.category] || 'bg-gray-100'}`}>{rule.category}</span>
                            {!rule.isActive && <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Inactif</span>}
                            <span className="text-xs text-gray-300">prio {rule.priority}</span>
                          </div>
                          <p className="text-sm text-gray-600 italic mb-1">&ldquo;{rule.description}&rdquo;</p>
                          <p className="text-xs text-gray-400">
                            {FIELD_LABELS[rule.field]} · <code className="bg-gray-100 px-1 rounded">{rule.pattern.length > 60 ? rule.pattern.slice(0, 60) + '…' : rule.pattern}</code>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button onClick={() => toggleRule(rule.id, !rule.isActive)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${rule.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                          {rule.isActive ? 'Actif' : 'Inactif'}
                        </button>
                        <button onClick={() => startEdit(rule)} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Modifier">
                          ✏️
                        </button>
                        <button onClick={() => deleteRule(rule.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Supprimer">
                          🗑️
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Filtres intégrés */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Filtres intégrés</h2>
            <span className="text-xs text-gray-400">Modifiables · Non supprimables</span>
          </div>
          <ul className="divide-y divide-gray-100">
            {builtIn.map(rule => (
              <li key={rule.id} className="px-6 py-4">
                {editingId === rule.id ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Nom</label>
                        <input value={editForm.name || ''} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))}
                          className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Catégorie</label>
                        <select value={editForm.category || ''} onChange={e => setEditForm(p => ({ ...p, category: e.target.value }))}
                          className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white">
                          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Description</label>
                      <input value={editForm.description || ''} onChange={e => setEditForm(p => ({ ...p, description: e.target.value }))}
                        className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => saveEdit(rule.id)} disabled={editSaving}
                        className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 disabled:opacity-50">
                        {editSaving ? 'Sauvegarde…' : '✅ Sauvegarder'}
                      </button>
                      <button onClick={() => setEditingId(null)} className="px-4 py-1.5 text-gray-500 hover:bg-gray-100 rounded-lg text-xs">Annuler</button>
                    </div>
                  </div>
                ) : (
                <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900 text-sm">{rule.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[rule.category] || 'bg-gray-100'}`}>{rule.category}</span>
                    <span className="text-xs text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">Intégré</span>
                  </div>
                  <p className="text-sm text-gray-600 italic">&ldquo;{rule.description}&rdquo;</p>
                  <p className="text-xs text-gray-400 mt-1">Champ : {FIELD_LABELS[rule.field]}</p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button onClick={() => toggleRule(rule.id, !rule.isActive)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${rule.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    {rule.isActive ? 'Actif' : 'Inactif'}
                  </button>
                  <button onClick={() => startEdit(rule)} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Modifier">
                    ✏️
                  </button>
                </div>
              </div>
                )}
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  )
}
