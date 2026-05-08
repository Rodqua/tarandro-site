import { NextRequest, NextResponse } from "next/server";
import { getEvjfSessionFromRequest } from "@/lib/evjf-auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getEvjfSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const blocks = await prisma.evjfProgramBlock.findMany({
    orderBy: [{ day: "asc" }, { order: "asc" }, { startTime: "asc" }],
  });
  return NextResponse.json(blocks);
}

export async function POST(req: NextRequest) {
  const session = await getEvjfSessionFromRequest(req);
  if (!session || session.role !== "ORGANIZER") {
    return NextResponse.json({ error: "Réservé à l'organisateur·ice" }, { status: 403 });
  }

  const body = await req.json();
  const { title, description, startTime, endTime, category, location, locationUrl, notes, budget, day } = body;

  if (!title?.trim() || !startTime || !endTime || !category) {
    return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
  }

  // Calcul de l'ordre (mettre à la fin du jour)
  const lastBlock = await prisma.evjfProgramBlock.findFirst({
    where: { day: day ?? 1 },
    orderBy: { order: "desc" },
  });

  const block = await prisma.evjfProgramBlock.create({
    data: {
      title: title.trim(),
      description: description?.trim() || null,
      startTime,
      endTime,
      category,
      location: location?.trim() || null,
      locationUrl: locationUrl?.trim() || null,
      notes: notes?.trim() || null,
      budget: budget ? Number(budget) : null,
      day: day ?? 1,
      order: (lastBlock?.order ?? -1) + 1,
    },
  });
  return NextResponse.json(block, { status: 201 });
}
