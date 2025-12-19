import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

// Middleware pour le mode maintenance
function maintenanceMiddleware(request: NextRequest) {
  const isMaintenanceMode = process.env.MAINTENANCE_MODE === 'true';
  const maintenanceBypassToken = process.env.MAINTENANCE_BYPASS_TOKEN || 'dev-bypass-token';
  
  // Vérifier si l'utilisateur a le bypass token
  const bypassCookie = request.cookies.get('maintenance-bypass')?.value;
  const bypassParam = request.nextUrl.searchParams.get('bypass');
  
  // Si le bypass token est valide, créer un cookie et continuer
  if (bypassParam === maintenanceBypassToken) {
    const response = NextResponse.next();
    response.cookies.set('maintenance-bypass', maintenanceBypassToken, {
      maxAge: 60 * 60 * 24, // 24 heures
      httpOnly: true,
      sameSite: 'strict',
    });
    return response;
  }
  
  // Ne pas bloquer ces routes
  const path = request.nextUrl.pathname;
  const excludedPaths = [
    '/maintenance',
    '/api/',
    '/_next/',
    '/favicon.ico',
    '/logo.svg',
    '/icon.svg'
  ];
  
  const isExcluded = excludedPaths.some(excludedPath => path.startsWith(excludedPath));
  
  // Si mode maintenance ET pas de bypass ET pas une route exclue
  if (isMaintenanceMode && bypassCookie !== maintenanceBypassToken && !isExcluded) {
    return NextResponse.rewrite(new URL('/maintenance', request.url));
  }
  
  return NextResponse.next();
}

// Middleware d'authentification pour /admin
const authMiddleware = withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/admin/login",
    },
  }
);

export default async function middleware(request: NextRequest) {
  // D'abord vérifier le mode maintenance
  const maintenanceResponse = maintenanceMiddleware(request);
  if (maintenanceResponse.status !== 200 || maintenanceResponse.headers.get('x-middleware-rewrite')) {
    return maintenanceResponse;
  }
  
  // Ensuite appliquer l'auth pour les routes admin
  const path = request.nextUrl.pathname;
  if (path.startsWith('/admin') && path !== '/admin/login') {
    // @ts-ignore - withAuth type issue
    return authMiddleware(request);
  }
  
  return NextResponse.next();
}

// Protéger toutes les routes /admin sauf /admin/login
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
