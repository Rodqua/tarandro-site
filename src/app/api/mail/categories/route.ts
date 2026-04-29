import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

const BUILT_IN = [
  { name: 'urgent',     label: 'Urgent',        emoji: '🔴', color: 'text-red-700',    bg: 'bg-red-50 border-red-200',     isBuiltIn: true },
  { name: 'important',  label: 'Important',      emoji: '🟡', color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200', isBuiltIn: true },
  { name: 'veille',     label: 'Veille santé',   emoji: '🏥', color: 'text-green-700',  bg: 'bg-green-50 border-green-200',  isBuiltIn: true },
  { name: 'loge',       label: 'Loge',           emoji: '🤝', color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200', isBuiltIn: true },
  { name: 'compta',     label: 'Comptabilité',   emoji: '💼', color: 'text-blue-700',   bg: 'bg-blue-50 border-blue-200',    isBuiltIn: true },
  { name: 'newsletter', label: 'Newsletter',     emoji: '📧', color: 'text-gray-600',   bg: 'bg-gray-50 border-gray-200',    isBuiltIn: true },
  { name: 'events',     label: 'Événements',     emoji: '🗓️', color: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-200', isBuiltIn: true },
]

export async function GET() {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  // Seed built-ins if not present
  for (const cat of BUILT_IN) {
    await (prisma as any).categoryConfig.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    })
  }

  const all = await (prisma as any).categoryConfig.findMany({ orderBy: [{ isBuiltIn: 'desc' }, { createdAt: 'asc' }] })
  return NextResponse.json(all)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { name, label, emoji, color, bg } = await request.json()
  if (!name || !label) return NextResponse.json({ error: 'Nom et libellé requis' }, { status: 400 })

  // Sanitize name: lowercase, no spaces
  const safeName = name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')
  if (!safeName) return NextResponse.json({ error: 'Nom invalide' }, { status: 400 })

  try {
    const cat = await (prisma as any).categoryConfig.create({
      data: { name: safeName, label, emoji: emoji || '📁', color: color || 'text-gray-700', bg: bg || 'bg-gray-50 border-gray-200', isBuiltIn: false },
    })
    return NextResponse.json(cat)
  } catch {
    return NextResponse.json({ error: 'Cette catégorie existe déjà' }, { status: 409 })
  }
}
