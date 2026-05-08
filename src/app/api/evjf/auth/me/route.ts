import { NextRequest, NextResponse } from "next/server";
import { getEvjfSessionFromRequest } from "@/lib/evjf-auth";

export async function GET(req: NextRequest) {
  const session = await getEvjfSessionFromRequest(req);
  if (!session) return NextResponse.json({ user: null }, { status: 401 });
  return NextResponse.json({ user: session });
}
