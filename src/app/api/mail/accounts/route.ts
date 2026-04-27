import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const accounts = await (prisma as any).emailAccount.findMany({
    select: {
      id: true,
      provider: true,
      email: true,
      displayName: true,
      createdAt: true,
      _count: { select: { threads: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(accounts);
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID manquant" }, { status: 400 });

  await (prisma as any).emailAccount.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
