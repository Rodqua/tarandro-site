import { NextRequest, NextResponse } from "next/server";
import { getEvjfSessionFromRequest } from "@/lib/evjf-auth";
import { prisma } from "@/lib/prisma";

// body: { orderedIds: string[] }
export async function POST(req: NextRequest) {
  const session = await getEvjfSessionFromRequest(req);
  if (!session || session.role !== "ORGANIZER") {
    return NextResponse.json({ error: "Réservé à l'organisateur·ice" }, { status: 403 });
  }
  const { orderedIds } = await req.json();
  if (!Array.isArray(orderedIds)) {
    return NextResponse.json({ error: "orderedIds requis" }, { status: 400 });
  }

  await prisma.$transaction(
    orderedIds.map((id: string, index: number) =>
      prisma.evjfProgramBlock.update({ where: { id }, data: { order: index } })
    )
  );
  return NextResponse.json({ ok: true });
}
