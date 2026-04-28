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

  const [total, unread, important, compta, veille, loge, events, newsletter] =
    await Promise.all([
      (prisma as any).emailThread.count({ where: baseWhere }),
      (prisma as any).emailThread.count({ where: { ...baseWhere, isUnread: true } }),
      (prisma as any).emailThread.count({ where: { ...baseWhere, category: 'important' } }),
      (prisma as any).emailThread.count({ where: { ...baseWhere, category: 'compta' } }),
      (prisma as any).emailThread.count({ where: { ...baseWhere, category: 'veille' } }),
      (prisma as any).emailThread.count({ where: { ...baseWhere, category: 'loge' } }),
      (prisma as any).emailThread.count({ where: { ...baseWhere, category: 'events' } }),
      (prisma as any).emailThread.count({ where: { ...baseWhere, category: 'newsletter' } }),
    ])

  return NextResponse.json({
    all: total,
    unread,
    important,
    compta,
    veille,
    loge,
    events,
    newsletter,
  })
}
