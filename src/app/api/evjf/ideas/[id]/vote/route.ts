import { NextRequest, NextResponse } from "next/server";
import { getEvjfSessionFromRequest } from "@/lib/evjf-auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getEvjfSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await params;
  const { type } = await req.json(); // "POSITIVE" | "VETO" | null (pour retirer)

  if (type === null) {
    // Retirer le vote
    await prisma.evjfVote.deleteMany({ where: { ideaId: id, userId: session.sub } });
    return NextResponse.json({ ok: true, action: "removed" });
  }

  if (type !== "POSITIVE" && type !== "VETO") {
    return NextResponse.json({ error: "Type de vote invalide" }, { status: 400 });
  }

  // Upsert vote
  const vote = await prisma.evjfVote.upsert({
    where: { ideaId_userId: { ideaId: id, userId: session.sub } },
    create: { ideaId: id, userId: session.sub, type },
    update: { type },
  });

  return NextResponse.json(vote);
}
