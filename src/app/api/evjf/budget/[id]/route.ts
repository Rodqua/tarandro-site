import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getEvjfSessionFromRequest } from "@/lib/evjf-auth";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getEvjfSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  if (session.role !== "ORGANIZER") return NextResponse.json({ error: "Réservé à l'organisateur" }, { status: 403 });

  const data = await req.json();
  const item = await prisma.evjfBudgetItem.update({
    where: { id: params.id },
    data: {
      ...(data.label !== undefined && { label: data.label }),
      ...(data.amount !== undefined && { amount: parseFloat(data.amount) }),
      ...(data.category !== undefined && { category: data.category }),
      ...(data.paidById !== undefined && { paidById: data.paidById || null }),
      ...(data.splitCount !== undefined && { splitCount: data.splitCount }),
      ...(data.isPaid !== undefined && { isPaid: data.isPaid }),
      ...(data.note !== undefined && { note: data.note }),
    },
    include: { paidBy: { select: { id: true, name: true } } },
  });

  return NextResponse.json(item);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getEvjfSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  if (session.role !== "ORGANIZER") return NextResponse.json({ error: "Réservé à l'organisateur" }, { status: 403 });

  await prisma.evjfBudgetItem.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
