import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Public — liste des participants pour l'écran de login (pas de données sensibles)
export async function GET() {
  const users = await prisma.evjfUser.findMany({
    where: { isActive: true },
    select: { name: true, avatarUrl: true, role: true },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(users);
}
