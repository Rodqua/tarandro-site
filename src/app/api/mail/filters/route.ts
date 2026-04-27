import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  const rules = await (prisma as any).filterRule.findMany({ orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }] })
  return NextResponse.json(rules)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  const body = await request.json()
  const { name, description, field, pattern, category, priority } = body
  if (!name || !description || !pattern || !category) {
    return NextResponse.json({ error: 'Champs manquants' }, { status: 400 })
  }
  const rule = await (prisma as any).filterRule.create({
    data: { name, description, field: field || 'all', pattern, category, priority: priority || 0, isBuiltIn: false },
  })
  return NextResponse.json(rule)
}
