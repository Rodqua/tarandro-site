import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signEvjfToken, makeSessionCookie } from "@/lib/evjf-auth";

export async function POST(req: NextRequest) {
  try {
    const { name, password } = await req.json();

    if (!name || !password) {
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    }

    // Vérification du mot de passe commun
    if (password !== process.env.EVJF_PASSWORD) {
      return NextResponse.json(
        { error: "Mot de passe incorrect 🙅‍♀️" },
        { status: 401 }
      );
    }

    // Recherche de l'utilisatrice (insensible à la casse)
    const user = await prisma.evjfUser.findFirst({
      where: {
        name: { equals: name.trim(), mode: "insensitive" },
        isActive: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Prénom non reconnu. Contacte Bibi !" },
        { status: 404 }
      );
    }

    const token = await signEvjfToken({
      sub: user.id,
      name: user.name,
      role: user.role,
    });

    const cookie = makeSessionCookie(token);
    const response = NextResponse.json({ ok: true, name: user.name, role: user.role });
    response.cookies.set(cookie.name, cookie.value, cookie.options as Parameters<typeof response.cookies.set>[2]);
    return response;
  } catch (err) {
    console.error("[EVJF login]", err);
    const msg = err instanceof Error ? err.message : "Erreur serveur";
    if (msg.includes("EVJF_JWT_SECRET")) {
      return NextResponse.json({ error: "Configuration manquante (JWT secret)" }, { status: 500 });
    }
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
