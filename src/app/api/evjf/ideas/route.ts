import { NextRequest, NextResponse } from "next/server";
import { getEvjfSessionFromRequest } from "@/lib/evjf-auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getEvjfSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const category = searchParams.get("category");

  const ideas = await prisma.evjfIdea.findMany({
    where: {
      ...(status ? { status: status as never } : {}),
      ...(category ? { category: category as never } : {}),
    },
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { id: true, name: true, avatarUrl: true } },
      votes: { select: { id: true, userId: true, type: true } },
      comments: {
        orderBy: { createdAt: "asc" },
        include: { user: { select: { id: true, name: true } } },
      },
    },
  });

  // Calculer le score pour chaque idée
  const ideasWithScore = ideas.map((idea) => {
    const positives = idea.votes.filter((v) => v.type === "POSITIVE").length;
    const vetos = idea.votes.filter((v) => v.type === "VETO").length;
    const score = positives * 2 - vetos * 3 + idea.comments.length * 0.5;
    const userVote = idea.votes.find((v) => v.userId === session.sub)?.type ?? null;
    return { ...idea, score, userVote };
  });

  return NextResponse.json(ideasWithScore);
}

export async function POST(req: NextRequest) {
  const session = await getEvjfSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json();
  const { title, description, category, estimatedBudget, referenceUrl } = body;

  if (!title?.trim() || !category) {
    return NextResponse.json({ error: "Titre et catégorie requis" }, { status: 400 });
  }

  const idea = await prisma.evjfIdea.create({
    data: {
      title: title.trim(),
      description: description?.trim() || null,
      category,
      estimatedBudget: estimatedBudget ? Number(estimatedBudget) : null,
      referenceUrl: referenceUrl?.trim() || null,
      authorId: session.sub,
    },
    include: {
      author: { select: { id: true, name: true, avatarUrl: true } },
      votes: true,
      comments: true,
    },
  });

  return NextResponse.json(idea, { status: 201 });
}
