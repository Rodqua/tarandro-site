import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

/**
 * POST /api/mail/filters/reapply
 * Body: { ruleId } — applique une FilterRule à tous les emails
 *
 * Comportement strict :
 *  1. Tous les emails qui MATCHENT le pattern → catégorie de la règle
 *  2. Tous les emails déjà dans cette catégorie qui NE matchent PAS → 'important'
 */
export async function POST(request: NextRequest) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { ruleId } = await request.json()
  if (!ruleId) return NextResponse.json({ error: 'ruleId manquant' }, { status: 400 })

  const rule = await (prisma as any).filterRule.findUnique({ where: { id: ruleId } })
  if (!rule) return NextResponse.json({ error: 'Règle introuvable' }, { status: 404 })

  const { pattern, field, category } = rule

  // Compile regex (pattern peut contenir des alternances type (a|b|c))
  let regex: RegExp
  try {
    regex = new RegExp(pattern, 'i')
  } catch {
    // Fallback : traitement littéral
    regex = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
  }

  // Charger tous les emails en une fois
  const allThreads = await (prisma as any).emailThread.findMany({
    select: { id: true, sender: true, subject: true, category: true },
  })

  const toAdd: string[] = []     // → category
  const toReset: string[] = []   // déjà dans category mais ne matchent plus → 'important'

  for (const t of allThreads) {
    const fieldValue = field === 'sender' ? (t.sender || '') : (t.subject || '')
    const matches = regex.test(fieldValue)

    if (matches && t.category !== category) {
      toAdd.push(t.id)
    } else if (!matches && t.category === category) {
      toReset.push(t.id)
    }
  }

  // Appliquer en batch
  if (toAdd.length > 0) {
    await (prisma as any).emailThread.updateMany({
      where: { id: { in: toAdd } },
      data: { category },
    })
  }
  if (toReset.length > 0) {
    await (prisma as any).emailThread.updateMany({
      where: { id: { in: toReset } },
      data: { category: 'important' },
    })
  }

  return NextResponse.json({
    ok: true,
    added: toAdd.length,
    removed: toReset.length,
  })
}
