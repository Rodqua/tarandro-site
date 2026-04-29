import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// POST /api/mail/category/read-all  { category: string }
export async function POST(request: NextRequest) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { category } = await request.json()
  if (!category) return NextResponse.json({ error: 'category manquant' }, { status: 400 })

  const where = category === 'all' ? { isUnread: true } : { category, isUnread: true }
  const result = await (prisma as any).emailThread.updateMany({ where, data: { isUnread: false } })

  return NextResponse.json({ updated: result.count })
}
