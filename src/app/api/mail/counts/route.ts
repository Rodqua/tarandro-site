import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const accountFilter = searchParams.get('account') || null

  let accountId: string | null = null
  if (accountFilter) {
    const acc = await (prisma as any).emailAccount.findFirst({
      where: { email: accountFilter },
      select: { id: true },
    })
    accountId = acc?.id ?? null
  }

  const baseWhere: any = accountId ? { accountId } : {}

  // Count total + unread
  const [total, unread] = await Promise.all([
    (prisma as any).emailThread.count({ where: baseWhere }),
    (prisma as any).emailThread.count({ where: { ...baseWhere, isUnread: true } }),
  ])

  // Count by category dynamically (group by)
  const byCat = await (prisma as any).emailThread.groupBy({
    by: ['category'],
    where: baseWhere,
    _count: { category: true },
  })

  const counts: Record<string, number> = { all: total, unread }
  for (const row of byCat) {
    if (row.category) counts[row.category] = row._count.category
  }

  return NextResponse.json(counts)
}
