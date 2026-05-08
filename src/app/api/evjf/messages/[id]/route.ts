import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getEvjfSessionFromRequest } from "@/lib/evjf-auth";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getEvjfSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  if (session.role !== "ORGANIZER") return NextResponse.json({ error: "Réservé à l'organisateur" }, { status: 403 });

  const { isPinned } = await req.json();
  const message = await prisma.evjfMessage.update({
    where: { id: params.id },
    data: { isPinned },
    include: { author: { select: { id: true, name: true, role: true, avatarUrl: true } }, reactions: { include: { user: { select: { id: true, name: true } } } } },
  });

  return NextResponse.json(message);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getEvjfSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const message = await prisma.evjfMessage.findUnique({ where: { id: params.id } });
  if (!message) return NextResponse.json({ error: "Introuvable" }, { status: 404 });

  // Seul l'auteur ou l'organisateur peut supprimer
  if (message.authorId !== session.sub && session.role !== "ORGANIZER") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  await prisma.evjfMessage.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
