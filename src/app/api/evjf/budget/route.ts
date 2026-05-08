import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getEvjfSessionFromRequest } from "@/lib/evjf-auth";

export async function GET(req: NextRequest) {
  const session = await getEvjfSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const items = await prisma.evjfBudgetItem.findMany({
    include: { paidBy: { select: { id: true, name: true } } },
    orderBy: { createdAt: "asc" },
  });

  const total = items.reduce((sum, i) => sum + i.amount, 0);
  const perPerson = items.reduce((sum, i) => sum + i.amount / i.splitCount, 0);

  return NextResponse.json({ items, total, perPerson });
}

export async function POST(req: NextRequest) {
  const session = await getEvjfSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  if (session.role !== "ORGANIZER") return NextResponse.json({ error: "Réservé à l'organisateur" }, { status: 403 });

  const { label, amount, category, paidById, splitCount, note } = await req.json();
  if (!label || !amount || !category) {
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
  }

  const item = await prisma.evjfBudgetItem.create({
    data: {
      label,
      amount: parseFloat(amount),
      category,
      paidById: paidById || null,
      splitCount: splitCount || 7,
      note: note || null,
    },
    include: { paidBy: { select: { id: true, name: true } } },
  });

  return NextResponse.json(item, { status: 201 });
}
