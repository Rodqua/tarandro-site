import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getGmailAuthUrl } from "@/lib/gmail";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const { searchParams } = new URL(request.url);
  const provider = searchParams.get("provider") || "google";

  if (provider === "google") {
    return NextResponse.redirect(getGmailAuthUrl());
  }

  // Microsoft et Zoho à venir
  return NextResponse.json({ error: "Provider non supporté" }, { status: 400 });
}
