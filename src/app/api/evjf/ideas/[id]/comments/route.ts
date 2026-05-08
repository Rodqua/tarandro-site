import { NextRequest, NextResponse } from "next/server";
import { getEvjfSessionFromRequest } from "@/lib/evjf-auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getEvjfSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await params;
  const { content } = await req.json();

  if (!content?.trim()) {
    return NextResponse.json({ error: "Commentaire vide" }, { status: 400 });
  }

  const comment = await prisma.evjfComment.create({
    data: { ideaId: id, userId: session.sub, content: content.trim() },
    include: { user: { select: { id: true, name: true } } },
  });

  return NextResponse.json(comment, { status: 201 });
}
