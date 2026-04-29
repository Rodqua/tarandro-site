import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function DELETE(_: NextRequest, { params }: { params: { name: string } }) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const cat = await (prisma as any).categoryConfig.findUnique({ where: { name: params.name } })
  if (!cat) return NextResponse.json({ error: 'Introuvable' }, { status: 404 })
  if (cat.isBuiltIn) return NextResponse.json({ error: 'Les catégories intégrées ne peuvent pas être supprimées' }, { status: 403 })

  await (prisma as any).categoryConfig.delete({ where: { name: params.name } })
  return NextResponse.json({ success: true })
}

export async function PATCH(request: NextRequest, { params }: { params: { name: string } }) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const data = await request.json()
  const cat = await (prisma as any).categoryConfig.update({ where: { name: params.name }, data })
  return NextResponse.json(cat)
}
