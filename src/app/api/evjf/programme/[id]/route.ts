import { NextRequest, NextResponse } from "next/server";
import { getEvjfSessionFromRequest } from "@/lib/evjf-auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getEvjfSessionFromRequest(req);
  if (!session || session.role !== "ORGANIZER") {
    return NextResponse.json({ error: "Réservé à l'organisateur" }, { status: 403 });
  }
  const { id } = await params;
  const body = await req.json();

  const block = await prisma.evjfProgramBlock.update({
    where: { id },
    data: {
      ...(body.title !== undefined && { title: body.title.trim() }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.startTime !== undefined && { startTime: body.startTime }),
      ...(body.endTime !== undefined && { endTime: body.endTime }),
      ...(body.category !== undefined && { category: body.category }),
      ...(body.location !== undefined && { location: body.location }),
      ...(body.locationUrl !== undefined && { locationUrl: body.locationUrl }),
      ...(body.notes !== undefined && { notes: body.notes }),
      ...(body.budget !== undefined && { budget: body.budget ? Number(body.budget) : null }),
      ...(body.order !== undefined && { order: body.order }),
      ...(body.day !== undefined && { day: Number(body.day) }),
      ...(body.attachments !== undefined && { attachments: body.attachments ?? [] }),
    },
  });
  return NextResponse.json(block);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getEvjfSessionFromRequest(req);
  if (!session || session.role !== "ORGANIZER") {
    return NextResponse.json({ error: "Réservé à l'organisateur" }, { status: 403 });
  }
  const { id } = await params;
  await prisma.evjfProgramBlock.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
