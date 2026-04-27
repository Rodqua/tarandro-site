import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

export const dynamic = 'force-dynamic'

const CATEGORIES = ['important', 'compta', 'veille', 'events', 'loge', 'newsletter']

export async function POST(request: NextRequest) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { description } = await request.json()
  if (!description) return NextResponse.json({ error: 'Description manquante' }, { status: 400 })

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'ANTHROPIC_API_KEY non configurée' }, { status: 500 })

  const prompt = `Tu es un assistant qui crée des règles de filtrage d'emails.
L'utilisateur décrit en langage naturel ce qu'il veut filtrer.
Tu dois générer une règle de filtrage avec ces champs :
- name: nom court (max 30 caractères)
- description: explication en langage naturel de ce que fait la règle
- field: le champ à analyser, parmi : "sender" (expéditeur), "subject" (objet), "all" (tout)
- pattern: une expression régulière (regex) JavaScript valide correspondant à la description
- category: la catégorie à assigner, parmi : ${CATEGORIES.join(', ')}

Description de l'utilisateur : "${description}"

Réponds UNIQUEMENT avec un objet JSON valide, sans markdown, sans explication :
{"name":"...","description":"...","field":"...","pattern":"...","category":"..."}`

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 500,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!res.ok) throw new Error(`Anthropic API error: ${await res.text()}`)
    const data = await res.json()
    const text = data.content?.[0]?.text || ''
    
    // Extraire le JSON de la réponse
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('Réponse IA invalide')
    const rule = JSON.parse(jsonMatch[0])
    
    // Valider la catégorie
    if (!CATEGORIES.includes(rule.category)) rule.category = 'important'
    
    return NextResponse.json(rule)
  } catch (err) {
    console.error('AI suggest error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
