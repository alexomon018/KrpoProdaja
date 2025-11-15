import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes that require authentication
const protectedRoutes = [
  '/profile',
  '/messages',
  '/my-listings',
  '/favorites',
  '/settings',
];

// Define auth routes that should redirect to home if already authenticated
const authRoutes = ['/login', '/register'];

// Get backend API URL from environment
const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:3001';

/**
 * Validates auth token by calling backend verification endpoint
 */
async function validateToken(token: string): Promise<boolean> {
  try {
    const response = await fetch(`${BACKEND_API_URL}/api/auth/verify`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(5000),
    });

    return response.ok;
  } catch (error) {
    // On network errors or timeouts, fail closed (deny access)
    console.error('Token validation failed:', error);
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('accessToken');

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );

  // Check if the current path is an auth route
  const isAuthRoute = authRoutes.some(route =>
    pathname.startsWith(route)
  );

  // For protected routes, validate the token
  if (isProtectedRoute) {
    if (!accessToken?.value) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Validate token with backend
    const isValid = await validateToken(accessToken.value);

    if (!isValid) {
      // Token is invalid or expired - redirect to login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);

      // Create response with redirect and clear all invalid cookies
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete('accessToken');
      response.cookies.delete('idToken');
      response.cookies.delete('refreshToken');

      return response;
    }
  }

  // For auth routes, check if user has a valid token
  if (isAuthRoute && accessToken?.value) {
    // Validate token with backend
    const isValid = await validateToken(accessToken.value);

    if (isValid) {
      // User is authenticated, redirect to home
      return NextResponse.redirect(new URL('/', request.url));
    } else {
      // Token is invalid, clear all tokens and allow access to auth routes
      const response = NextResponse.next();
      response.cookies.delete('accessToken');
      response.cookies.delete('idToken');
      response.cookies.delete('refreshToken');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
