import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForTokens, getUserInfo } from "@/lib/gmail";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  if (error || !code) {
    return NextResponse.redirect(`${baseUrl}/mail?error=auth_failed`);
  }

  try {
    const tokens = await exchangeCodeForTokens(code);
    if (!tokens.access_token) {
      return NextResponse.redirect(`${baseUrl}/mail?error=no_token`);
    }

    const { email, name } = await getUserInfo(tokens.access_token);

    await (prisma as any).emailAccount.upsert({
      where: { provider_email: { provider: "google", email } },
      update: {
        displayName: name,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token ?? undefined,
        expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : undefined,
      },
      create: {
        provider: "google",
        email,
        displayName: name,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token ?? undefined,
        expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : undefined,
      },
    });

    return NextResponse.redirect(`${baseUrl}/mail?success=connected`);
  } catch (err) {
    console.error("OAuth callback error:", err);
    return NextResponse.redirect(`${baseUrl}/mail?error=callback_failed`);
  }
}
