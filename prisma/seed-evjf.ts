/**
 * Seed EVJF — Ajouter/mettre à jour les participantes
 *
 * Usage :
 *   npx tsx prisma/seed-evjf.ts
 *
 * Modifie le tableau PARTICIPANTS ci-dessous avant de lancer.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ─── À MODIFIER : liste des participantes ─────────────────────────────────────
const PARTICIPANTS: { name: string; role?: "ORGANIZER" | "PARTICIPANT" }[] = [
  // 👑 Organisatrice principale — met ton prénom ici
  { name: "Quentin", role: "ORGANIZER" },

  // 🥂 Participantes — ajoute autant de prénoms que nécessaire
  { name: "Marie" },
  { name: "Sophie" },
  { name: "Camille" },
  { name: "Léa" },
  { name: "Julie" },
  // ...
];
// ─────────────────────────────────────────────────────────────────────────────

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
      data: {
        name: p.name,
        role: p.role ?? "PARTICIPANT",
      },
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
