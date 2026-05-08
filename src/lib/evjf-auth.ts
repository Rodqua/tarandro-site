import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const COOKIE_NAME = "evjf-session";
const EXPIRY = 60 * 60 * 24 * 30; // 30 jours

function getSecret(): Uint8Array {
  const secret = process.env.EVJF_JWT_SECRET;
  if (!secret) throw new Error("EVJF_JWT_SECRET manquant dans .env");
  return new TextEncoder().encode(secret);
}

export interface EvjfJwtPayload {
  sub: string;   // userId
  name: string;
  role: "ORGANIZER" | "PARTICIPANT";
}

export async function signEvjfToken(payload: EvjfJwtPayload): Promise<string> {
  return new SignJWT({ name: payload.name, role: payload.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${EXPIRY}s`)
    .sign(getSecret());
}

export async function verifyEvjfToken(
  token: string
): Promise<EvjfJwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return {
      sub: payload.sub as string,
      name: payload.name as string,
      role: payload.role as "ORGANIZER" | "PARTICIPANT",
    };
  } catch {
    return null;
  }
}

export async function getEvjfSession(): Promise<EvjfJwtPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyEvjfToken(token);
}

export async function getEvjfSessionFromRequest(
  req: NextRequest
): Promise<EvjfJwtPayload | null> {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyEvjfToken(token);
}

export function makeSessionCookie(token: string): {
  name: string;
  value: string;
  options: Record<string, unknown>;
} {
  return {
    name: COOKIE_NAME,
    value: token,
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: EXPIRY,
      path: "/",
    },
  };
}

export function clearSessionCookie() {
  return {
    name: COOKIE_NAME,
    value: "",
    options: { httpOnly: true, maxAge: 0, path: "/" },
  };
}
