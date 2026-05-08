import { NextRequest, NextResponse } from "next/server";
import { getEvjfSessionFromRequest } from "@/lib/evjf-auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getEvjfSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const idea = await prisma.evjfIdea.findUnique({ where: { id } });
  if (!idea) return NextResponse.json({ error: "Idée introuvable" }, { status: 404 });

  const isAuthor = idea.authorId === session.sub;
  const isOrganizer = session.role === "ORGANIZER";
  if (!isAuthor && !isOrganizer) {
    return NextResponse.json({ error: "Pas autorisé" }, { status: 403 });
  }

  const updated = await prisma.evjfIdea.update({
    where: { id },
    data: {
      ...(body.title && { title: body.title.trim() }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.category && { category: body.category }),
      ...(body.estimatedBudget !== undefined && { estimatedBudget: Number(body.estimatedBudget) }),
      ...(body.referenceUrl !== undefined && { referenceUrl: body.referenceUrl }),
      ...(body.imageUrl !== undefined && { imageUrl: body.imageUrl }),
      ...(body.attachments !== undefined && { attachments: body.attachments ?? [] }),
      ...(isOrganizer && body.status && { status: body.status }),
    },
    include: { author: { select: { id: true, name: true } }, votes: true, comments: { include: { user: { select: { id: true, name: true } } } } },
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getEvjfSessionFromRequest(req);
  if (!session || session.role !== "ORGANIZER") {
    return NextResponse.json({ error: "Réservé à l'organisateur" }, { status: 403 });
  }
  const { id } = await params;
  await prisma.evjfIdea.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
