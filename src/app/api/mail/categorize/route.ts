import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

// POST /api/mail/categorize
// { threadId, sender, subject, category }
// → crée/met à jour une FilterRule, recatégorise tous les emails matchants
export async function POST(request: NextRequest) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { threadId, sender, subject, category } = await request.json()
  if (!threadId || !category) return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 })

  // 1. Corriger cet email tout de suite
  await (prisma as any).emailThread.update({
    where: { id: threadId },
    data: { category },
  })

  // 2. Extraire le meilleur pattern depuis le sender
  const domainMatch = sender?.match(/@([\w.-]+)>?$/)
  const domain = domainMatch ? domainMatch[1].toLowerCase() : null

  let ruleField = 'sender'
  let rulePattern = domain ? `@${domain}` : sender?.toLowerCase() || ''
  let ruleName = domain ? `Domaine ${domain}` : `Expéditeur ${sender}`

  // Si pas de domaine clair, utiliser un mot-clé du sujet
  if (!domain && subject) {
    const words = subject.toLowerCase().split(/\s+/).filter((w: string) => w.length > 4)
    if (words.length > 0) {
      ruleField = 'subject'
      rulePattern = words[0]
      ruleName = `Sujet "${words[0]}"`
    }
  }

  if (rulePattern) {
    // 3. Upsert la FilterRule (cherche par pattern + category d'abord)
    const existing = await (prisma as any).filterRule.findFirst({
      where: { pattern: rulePattern, isBuiltIn: false },
    })
    if (existing) {
      await (prisma as any).filterRule.update({
        where: { id: existing.id },
        data: { category, name: ruleName, field: ruleField, updatedAt: new Date() },
      })
    } else {
      await (prisma as any).filterRule.create({
        data: {
          name: ruleName,
          description: `Appris depuis correction manuelle — catégorie : ${category}`,
          field: ruleField,
          pattern: rulePattern,
          category,
          priority: 10, // Priorité haute pour les règles apprises
          isBuiltIn: false,
        },
      })
    }

    // 4. Recatégoriser tous les emails qui matchent ce pattern
    const allThreads = await (prisma as any).emailThread.findMany({
      where: { category: { not: category } },
      select: { id: true, sender: true, subject: true },
    })

    const toUpdate: string[] = []
    for (const t of allThreads) {
      let matches = false
      if (ruleField === 'sender') {
        matches = (t.sender || '').toLowerCase().includes(rulePattern.toLowerCase())
      } else {
        matches = (t.subject || '').toLowerCase().includes(rulePattern.toLowerCase())
      }
      if (matches) toUpdate.push(t.id)
    }

    if (toUpdate.length > 0) {
      await (prisma as any).emailThread.updateMany({
        where: { id: { in: toUpdate } },
        data: { category },
      })
    }

    return NextResponse.json({
      ok: true,
      rule: { pattern: rulePattern, field: ruleField, category },
      recategorized: toUpdate.length,
    })
  }

  return NextResponse.json({ ok: true, recategorized: 0 })
}
