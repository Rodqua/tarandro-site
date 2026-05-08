import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";
import { verifyEvjfToken } from "@/lib/evjf-auth";

// ─── Maintenance ──────────────────────────────────────────────────────────────
function maintenanceMiddleware(request: NextRequest) {
  const isMaintenanceMode = process.env.MAINTENANCE_MODE === "true";
  const maintenanceBypassToken =
    process.env.MAINTENANCE_BYPASS_TOKEN || "dev-bypass-token";
  const bypassCookie = request.cookies.get("maintenance-bypass")?.value;
  const bypassParam = request.nextUrl.searchParams.get("bypass");

  if (bypassParam === maintenanceBypassToken) {
    const response = NextResponse.next();
    response.cookies.set("maintenance-bypass", maintenanceBypassToken, {
      maxAge: 60 * 60 * 24,
      httpOnly: true,
      sameSite: "strict",
    });
    return response;
  }

  const path = request.nextUrl.pathname;
  const excludedPaths = [
    "/maintenance",
    "/api/",
    "/_next/",
    "/favicon.ico",
    "/logo.svg",
    "/icon.svg",
    "/lise",
  ];
  const isExcluded = excludedPaths.some((p) => path.startsWith(p));

  if (
    isMaintenanceMode &&
    bypassCookie !== maintenanceBypassToken &&
    !isExcluded
  ) {
    return NextResponse.rewrite(new URL("/maintenance", request.url));
  }

  return NextResponse.next();
}

// ─── Admin auth (next-auth) ───────────────────────────────────────────────────
const authMiddleware = withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: { authorized: ({ token }) => !!token },
    pages: { signIn: "/admin/login" },
  }
);

// ─── EVJF auth ────────────────────────────────────────────────────────────────
async function evjfMiddleware(request: NextRequest): Promise<NextResponse> {
  const path = request.nextUrl.pathname;

  // La feature est-elle activée ?
  if (process.env.EVJF_ENABLED === "false") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // La page login est toujours accessible
  if (path === "/lise/login" || path.startsWith("/api/evjf/auth")) {
    return NextResponse.next();
  }

  const token = request.cookies.get("evjf-session")?.value;
  if (!token) {
    const loginUrl = new URL("/lise/login", request.url);
    loginUrl.searchParams.set("from", path);
    return NextResponse.redirect(loginUrl);
  }

  const session = await verifyEvjfToken(token);
  if (!session) {
    const loginUrl = new URL("/lise/login", request.url);
    loginUrl.searchParams.set("from", path);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete("evjf-session");
    return response;
  }

  // Injecter les infos user dans les headers pour les Server Components
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-evjf-user-id", session.sub);
  requestHeaders.set("x-evjf-user-name", session.name);
  requestHeaders.set("x-evjf-user-role", session.role);

  return NextResponse.next({ request: { headers: requestHeaders } });
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default async function middleware(request: NextRequest) {
  const maintenanceResponse = maintenanceMiddleware(request);
  if (
    maintenanceResponse.status !== 200 ||
    maintenanceResponse.headers.get("x-middleware-rewrite")
  ) {
    return maintenanceResponse;
  }

  const path = request.nextUrl.pathname;

  if (path.startsWith("/lise") || path.startsWith("/api/evjf")) {
    return evjfMiddleware(request);
  }

  if (
    (path.startsWith("/admin") && path !== "/admin/login") ||
    path.startsWith("/mail")
  ) {
    // @ts-ignore
    return authMiddleware(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
