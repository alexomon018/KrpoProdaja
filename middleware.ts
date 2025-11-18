import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  validateToken,
  attemptTokenRefresh,
  setTokensInResponse,
  clearTokensInResponse,
  createLoginRedirect,
} from "./lib/auth/middleware-helpers";

// Define protected routes that require authentication
const protectedRoutes = [
  "/profile",
  "/messages",
  "/my-listings",
  "/favorites",
  "/settings",
];

// Define auth routes that should redirect to home if already authenticated
const authRoutes = ["/login", "/register"];

/**
 * Helper: Handle token refresh and return appropriate response
 */
async function handleTokenRefresh(
  request: NextRequest,
  pathname: string,
  isProtectedRoute: boolean
): Promise<NextResponse | null> {
  const refreshResult = await attemptTokenRefresh(request);

  if (
    refreshResult.success &&
    refreshResult.accessToken &&
    refreshResult.idToken
  ) {
    // Refresh successful - set new tokens and continue
    console.log("Token refreshed successfully");
    return setTokensInResponse(
      NextResponse.next(),
      refreshResult.accessToken,
      refreshResult.idToken
    );
  }

  // Refresh failed - clear cookies
  console.log("Token refresh failed");
  const response = isProtectedRoute
    ? clearTokensInResponse(createLoginRedirect(request, pathname))
    : clearTokensInResponse(NextResponse.next());

  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken");
  const refreshToken = request.cookies.get("refreshToken");

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Auto-refresh tokens on ALL routes (if refresh token exists but access token is missing/invalid)
  // This ensures users stay logged in when returning after access token expiration
  if (refreshToken?.value && !isAuthRoute) {
    // Case 1: No access token but have refresh token - attempt refresh
    if (!accessToken?.value) {
      console.log("No access token, attempting refresh...");
      return await handleTokenRefresh(request, pathname, isProtectedRoute);
    }

    // Case 2: Have access token - validate it for protected routes only
    if (isProtectedRoute) {
      const isValid = await validateToken(accessToken.value);

      if (!isValid) {
        console.log("Access token invalid on protected route, attempting refresh...");
        return await handleTokenRefresh(request, pathname, isProtectedRoute);
      }
    }
  }

  // For protected routes without refresh token, require login
  if (isProtectedRoute && !accessToken?.value) {
    console.log("Protected route without tokens, redirecting to login");
    return createLoginRedirect(request, pathname);
  }

  // For auth routes, check if user has a valid token
  if (isAuthRoute && accessToken?.value) {
    const isValid = await validateToken(accessToken.value);

    if (isValid) {
      // User is authenticated, redirect to home
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Token is invalid, clear all tokens and allow access to auth routes
    return clearTokensInResponse(NextResponse.next());
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
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
