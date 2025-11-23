/**
 * Authentication helpers for Next.js middleware
 * These helpers handle token validation and refresh in the middleware layer
 */

import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

/**
 * Validates auth token by calling backend verification endpoint
 */
export async function validateToken(token: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      signal: AbortSignal.timeout(5000),
    });

    return response.ok;
  } catch (error) {
    console.error("Token validation failed:", error);
    return false;
  }
}

/**
 * Attempts to refresh the access token using the refresh token cookie
 */
export async function attemptTokenRefresh(
  request: NextRequest
): Promise<{ success: boolean; accessToken?: string; idToken?: string }> {
  try {
    const refreshToken = request.cookies.get("refreshToken");

    if (!refreshToken?.value) {
      return { success: false };
    }

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `refreshToken=${refreshToken.value}`,
      },
      credentials: "include",
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      console.error("Token refresh failed with status:", response.status);
      return { success: false };
    }

    const data = await response.json();
    return {
      success: true,
      accessToken: data.accessToken,
      idToken: data.idToken,
    };
  } catch (error) {
    console.error("Token refresh error:", error);
    return { success: false };
  }
}

/**
 * Cookie configuration for auth tokens
 */
export const AUTH_COOKIE_CONFIG = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 60 * 15, // 15 minutes
};

/**
 * Set auth tokens in response cookies
 */
export function setTokensInResponse(
  response: NextResponse,
  accessToken: string,
  idToken: string
): NextResponse {
  response.cookies.set("accessToken", accessToken, AUTH_COOKIE_CONFIG);
  response.cookies.set("idToken", idToken, AUTH_COOKIE_CONFIG);
  return response;
}

/**
 * Clear all auth tokens from response cookies
 */
export function clearTokensInResponse(response: NextResponse): NextResponse {
  response.cookies.delete("accessToken");
  response.cookies.delete("idToken");
  response.cookies.delete("refreshToken");
  return response;
}

/**
 * Create login redirect response with original path as redirect parameter
 */
export function createLoginRedirect(
  request: NextRequest,
  pathname: string
): NextResponse {
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("redirect", pathname);
  return NextResponse.redirect(loginUrl);
}
