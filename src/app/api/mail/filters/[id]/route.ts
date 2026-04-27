import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  const body = await request.json()
  const rule = await (prisma as any).filterRule.update({ where: { id: params.id }, data: body })
  return NextResponse.json(rule)
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  const rule = await (prisma as any).filterRule.findUnique({ where: { id: params.id } })
  if (rule?.isBuiltIn) return NextResponse.json({ error: 'Impossible de supprimer une règle intégrée' }, { status: 403 })
  await (prisma as any).filterRule.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
