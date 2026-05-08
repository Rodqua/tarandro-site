import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getEvjfSessionFromRequest } from "@/lib/evjf-auth";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getEvjfSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { emoji } = await req.json();
  if (!emoji) return NextResponse.json({ error: "Emoji manquant" }, { status: 400 });

  // Toggle : si la réaction existe déjà, on la supprime
  const existing = await prisma.evjfReaction.findUnique({
    where: { messageId_userId_emoji: { messageId: params.id, userId: session.sub, emoji } },
  });

  if (existing) {
    await prisma.evjfReaction.delete({ where: { id: existing.id } });
  } else {
    await prisma.evjfReaction.create({
      data: { messageId: params.id, userId: session.sub, emoji },
    });
  }

  return NextResponse.json({ ok: true });
}
