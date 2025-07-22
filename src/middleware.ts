import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Add paths that don't require authentication
const publicPaths = ['/', '/login'];

// Role-based route access
const roleRoutes = {
  owner: ['/dashboard/owner'],
  manager: ['/dashboard/manager'],
  leader: ['/dashboard/leader'],
  member: ['/dashboard/member'],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check authentication
  const session = await getToken({ req: request });
  
  if (!session) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  // Check role-based access
  const userRole = session.role as keyof typeof roleRoutes;
  
  if (pathname.startsWith('/dashboard')) {
    const hasAccess = roleRoutes[userRole]?.some(route => 
      pathname.startsWith(route)
    );

    if (!hasAccess) {
      // Redirect to default dashboard if no access
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public assets)
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
