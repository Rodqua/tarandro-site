import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

function maintenanceMiddleware(request: NextRequest) {
  const isMaintenanceMode = process.env.MAINTENANCE_MODE === "true";
  const maintenanceBypassToken = process.env.MAINTENANCE_BYPASS_TOKEN || "dev-bypass-token";
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
  const excludedPaths = ["/maintenance", "/api/", "/_next/", "/favicon.ico", "/logo.svg", "/icon.svg"];
  const isExcluded = excludedPaths.some((p) => path.startsWith(p));

  if (isMaintenanceMode && bypassCookie !== maintenanceBypassToken && !isExcluded) {
    return NextResponse.rewrite(new URL("/maintenance", request.url));
  }

  return NextResponse.next();
}

const authMiddleware = withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: { authorized: ({ token }) => !!token },
    pages: { signIn: "/admin/login" },
  }
);

export default async function middleware(request: NextRequest) {
  const maintenanceResponse = maintenanceMiddleware(request);
  if (
    maintenanceResponse.status !== 200 ||
    maintenanceResponse.headers.get("x-middleware-rewrite")
  ) {
    return maintenanceResponse;
  }

  const path = request.nextUrl.pathname;

  // Protéger /admin ET /mail avec l'auth
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
