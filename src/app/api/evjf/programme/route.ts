import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getEvjfSessionFromRequest } from "@/lib/evjf-auth";

export async function GET(req: NextRequest) {
  const session = await getEvjfSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const blocks = await prisma.evjfProgramBlock.findMany({
    orderBy: [{ day: "asc" }, { startTime: "asc" }, { order: "asc" }],
    include: { paidBy: { select: { id: true, name: true } } },
  });

  return NextResponse.json(blocks);
}

export async function POST(req: NextRequest) {
  const session = await getEvjfSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  if (session.role !== "ORGANIZER") return NextResponse.json({ error: "Réservé à l'organisateur" }, { status: 403 });

  const {
    title, description, startTime, endTime, category,
    location, locationUrl, imageUrl, notes, budget,
    paidById, isPaid, day, order,
    createBudgetItem,
  } = await req.json();

  if (!title || !startTime || !endTime || !category) {
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
  }

  const maxOrder = await prisma.evjfProgramBlock.findFirst({
    where: { day: day ?? 1 },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  const block = await prisma.evjfProgramBlock.create({
    data: {
      title, startTime, endTime,
      category,
      description: description ?? null,
      location: location ?? null,
      locationUrl: locationUrl ?? null,
      imageUrl: imageUrl ?? null,
      notes: notes ?? null,
      budget: budget ? parseFloat(budget) : null,
      paidById: paidById || null,
      isPaid: isPaid ?? false,
      day: day ?? 1,
      order: order ?? (maxOrder ? maxOrder.order + 1 : 0),
    },
    include: { paidBy: { select: { id: true, name: true } } },
  });

  // Créer automatiquement un EvjfBudgetItem si demandé
  if (createBudgetItem && budget && parseFloat(budget) > 0) {
    await prisma.evjfBudgetItem.create({
      data: {
        label: title,
        amount: parseFloat(budget),
        category,
        paidById: paidById || null,
        isPaid: isPaid ?? false,
        splitCount: 7,
        note: `Depuis le programme — ${startTime}`,
      },
    });
  }

  return NextResponse.json(block, { status: 201 });
}
