/**
 * Seed EVJF — Participantes & Organisateur
 * Usage : npx tsx prisma/seed-evjf.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PARTICIPANTS: { name: string; role?: "ORGANIZER" | "PARTICIPANT" }[] = [
  // 👑 Organisateur principal
  { name: "Bibite", role: "ORGANIZER" },

  // 🥂 Participantes
  { name: "Alexiane" },
  { name: "Louis" },
  { name: "Iyad" },
  { name: "Marion" },
  { name: "Simon" },
  { name: "Sylvain" },
];

async function main() {
  console.log("🌸 Seeding EVJF users...\n");

  for (const p of PARTICIPANTS) {
    const existing = await prisma.evjfUser.findFirst({
      where: { name: { equals: p.name, mode: "insensitive" } },
    });

    if (existing) {
      console.log(`  ↩️  ${p.name} existe déjà (${existing.role})`);
      continue;
    }

    const user = await prisma.evjfUser.create({
      data: { name: p.name, role: p.role ?? "PARTICIPANT" },
    });
    console.log(`  ✅ ${user.name} créé (${user.role})`);
  }

  console.log("\n✨ Done! Participantes en base :");
  const all = await prisma.evjfUser.findMany({ orderBy: { createdAt: "asc" } });
  all.forEach((u) =>
    console.log(`  ${u.role === "ORGANIZER" ? "👑" : "🥂"} ${u.name}`)
  );
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
