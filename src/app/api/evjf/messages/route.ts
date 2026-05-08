import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getEvjfSessionFromRequest } from "@/lib/evjf-auth";

export async function GET(req: NextRequest) {
  const session = await getEvjfSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const messages = await prisma.evjfMessage.findMany({
    include: {
      author: { select: { id: true, name: true, role: true } },
      reactions: {
        include: { user: { select: { id: true, name: true } } },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(messages);
}

export async function POST(req: NextRequest) {
  const session = await getEvjfSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { content } = await req.json();
  if (!content?.trim()) return NextResponse.json({ error: "Message vide" }, { status: 400 });

  const message = await prisma.evjfMessage.create({
    data: { content: content.trim(), authorId: session.sub },
    include: {
      author: { select: { id: true, name: true, role: true } },
      reactions: { include: { user: { select: { id: true, name: true } } } },
    },
  });

  return NextResponse.json(message, { status: 201 });
}
