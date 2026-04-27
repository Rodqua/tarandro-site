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

export default function FiltersPage() {
  const router = useRouter()
  const [rules, setRules] = useState<FilterRule[]>([])
  const [loading, setLoading] = useState(true)
  const [aiInput, setAiInput] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiPreview, setAiPreview] = useState<Partial<FilterRule> | null>(null)
  const [saving, setSaving] = useState(false)
  const [flash, setFlash] = useState<string | null>(null)

  const showFlash = (msg: string) => { setFlash(msg); setTimeout(() => setFlash(null), 3000) }

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

        {/* Section IA */}
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
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Filtres personnalisés</h2>
            <span className="text-xs text-gray-400">{custom.length} filtre{custom.length !== 1 ? 's' : ''}</span>
          </div>
          {loading ? (
            <div className="p-8 text-center text-gray-400">Chargement...</div>
          ) : custom.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <p className="text-2xl mb-2">✨</p>
              <p>Aucun filtre personnalisé. Utilise l&apos;IA ci-dessus pour en créer un !</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {custom.map(rule => (
                <li key={rule.id} className="px-6 py-4 flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900 text-sm">{rule.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[rule.category] || 'bg-gray-100'}`}>{rule.category}</span>
                      {!rule.isActive && <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Inactif</span>}
                    </div>
                    <p className="text-sm text-gray-600 italic">&ldquo;{rule.description}&rdquo;</p>
                    <p className="text-xs text-gray-400 mt-1">Champ : {FIELD_LABELS[rule.field]} · Pattern : <code className="bg-gray-100 px-1 rounded">{rule.pattern}</code></p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => toggleRule(rule.id, !rule.isActive)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${rule.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                      {rule.isActive ? 'Actif' : 'Inactif'}
                    </button>
                    <button onClick={() => deleteRule(rule.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Supprimer">
                      🗑️
                    </button>
                  </div>
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
              <li key={rule.id} className="px-6 py-4 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900 text-sm">{rule.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[rule.category] || 'bg-gray-100'}`}>{rule.category}</span>
                    <span className="text-xs text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">Intégré</span>
                  </div>
                  <p className="text-sm text-gray-600 italic">&ldquo;{rule.description}&rdquo;</p>
                  <p className="text-xs text-gray-400 mt-1">Champ : {FIELD_LABELS[rule.field]}</p>
                </div>
                <button
                  onClick={() => toggleRule(rule.id, !rule.isActive)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${rule.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {rule.isActive ? 'Actif' : 'Inactif'}
                </button>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  )
}
