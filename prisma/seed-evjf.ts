/**
 * Seed EVJF — Participants & Organisateur
 * Usage : npx tsx prisma/seed-evjf.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PARTICIPANTS: { name: string; role?: "ORGANIZER" | "PARTICIPANT"; avatarUrl?: string }[] = [
  { name: "Bibite",   role: "ORGANIZER", avatarUrl: "/evjf/avatars/bibite.jpg"   },
  { name: "Alexiane",                    avatarUrl: "/evjf/avatars/alexiane.jpg"  },
  { name: "Louis",                       avatarUrl: "/evjf/avatars/louis.jpg"     },
  { name: "Iyad",                        avatarUrl: "/evjf/avatars/iyad.jpg"      },
  { name: "Marion",                      avatarUrl: "/evjf/avatars/marion.jpg"    },
  { name: "Simon",                       avatarUrl: "/evjf/avatars/simon.jpg"     },
  { name: "Sylvain",                     avatarUrl: "/evjf/avatars/sylvain.jpg"   },
];

async function main() {
  console.log("🌸 Seeding EVJF users...\n");

  for (const p of PARTICIPANTS) {
    const existing = await prisma.evjfUser.findFirst({
      where: { name: { equals: p.name, mode: "insensitive" } },
    });

    if (existing) {
      // Met à jour l'avatar si déjà existant
      await prisma.evjfUser.update({
        where: { id: existing.id },
        data: { avatarUrl: p.avatarUrl ?? null },
      });
      console.log(`  ↩️  ${p.name} mis à jour (avatar)`);
      continue;
    }

    const user = await prisma.evjfUser.create({
      data: { name: p.name, role: p.role ?? "PARTICIPANT", avatarUrl: p.avatarUrl ?? null },
    });
    console.log(`  ✅ ${user.name} créé (${user.role})`);
  }

  console.log("\n✨ Done!");
  const all = await prisma.evjfUser.findMany({ orderBy: { createdAt: "asc" } });
  all.forEach((u) =>
    console.log(`  ${u.role === "ORGANIZER" ? "👑" : "🥂"} ${u.name} — ${u.avatarUrl ?? "pas d'avatar"}`)
  );
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
