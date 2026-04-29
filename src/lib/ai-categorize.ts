// Catégorisation IA des emails via Claude Haiku
// Appelé pendant la synchro pour les emails qui tombent en fallback "important"

const HAIKU_MODEL = 'claude-haiku-4-5-20251001'

export interface EmailToClassify {
  id: string // threadId local pour retrouver le résultat
  sender: string
  subject: string
  snippet: string
}

export interface ClassifyResult {
  id: string
  category: string
}

/**
 * Envoie jusqu'à 30 emails à Claude Haiku pour catégorisation.
 * Retourne un tableau { id, category } pour chaque email.
 * Timeout interne 12s — si dépassé, retourne tableau vide.
 */
export async function aiCategorizeEmails(
  emails: EmailToClassify[],
  availableCategories: string[]
): Promise<ClassifyResult[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey || emails.length === 0) return []

  const cats = availableCategories.join(', ')
  const emailList = emails.map((e, i) =>
    `[${i}] De: ${e.sender}\nSujet: ${e.subject}\nAperçu: ${e.snippet.slice(0, 100)}`
  ).join('\n\n')

  const prompt = `Tu es un assistant de tri d'emails. Catégorise chaque email dans UNE des catégories suivantes : ${cats}.
Réponds UNIQUEMENT avec un JSON valide : tableau d'objets [{"index":0,"category":"..."},...] pour tous les emails listés.
Ne dis rien d'autre, juste le JSON.

Emails à catégoriser :
${emailList}`

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 12_000)

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: HAIKU_MODEL,
        max_tokens: 512,
        messages: [{ role: 'user', content: prompt }],
      }),
      signal: controller.signal,
    })
    clearTimeout(timeout)

    if (!res.ok) return []
    const data = await res.json()
    const text = data.content?.[0]?.text || ''

    // Extract JSON from response
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) return []
    const parsed: Array<{ index: number; category: string }> = JSON.parse(jsonMatch[0])

    return parsed
      .filter(r => typeof r.index === 'number' && availableCategories.includes(r.category))
      .map(r => ({ id: emails[r.index]?.id, category: r.category }))
      .filter(r => r.id)

  } catch {
    return []
  }
}
