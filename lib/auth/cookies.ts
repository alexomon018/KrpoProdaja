/**
 * Cookie-based Token Management with Server Actions
 * Provides secure, httpOnly cookie storage for authentication tokens
 * Manages accessToken and idToken in frontend cookies
 * refreshToken is managed by backend via httpOnly cookie
 */

'use server';

import { cookies } from 'next/headers';

// Cookie names
const ACCESS_TOKEN_COOKIE = 'accessToken';
const ID_TOKEN_COOKIE = 'idToken';
const REFRESH_TOKEN_COOKIE = 'refreshToken';

// Cookie expiration times
const ACCESS_TOKEN_MAX_AGE = 30 * 60; // 30 minutes
const ID_TOKEN_MAX_AGE = 30 * 60; // 30 minutes
const REFRESH_TOKEN_MAX_AGE = 30 * 24 * 60 * 60; // 30 days

/**
 * Set authentication tokens in httpOnly cookies
 * refreshToken is managed by backend and set via Set-Cookie header
 */
export async function setAuthTokens(
  accessToken: string,
  idToken: string
): Promise<void> {
  const cookieStore = await cookies();

  // Set access token (30 min)
  cookieStore.set({
    name: ACCESS_TOKEN_COOKIE,
    value: accessToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: ACCESS_TOKEN_MAX_AGE,
    path: '/',
  });

  // Set ID token (30 min)
  cookieStore.set({
    name: ID_TOKEN_COOKIE,
    value: idToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: ID_TOKEN_MAX_AGE,
    path: '/',
  });

  // refreshToken is set by backend via Set-Cookie header, not here
}

/**
 * Get access token from cookie (use for API authorization)
 */
export async function getAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN_COOKIE);
  return token?.value || null;
}

/**
 * Get ID token from cookie (use for user identity)
 */
export async function getIdToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ID_TOKEN_COOKIE);
  return token?.value || null;
}

/**
 * Get refresh token from cookie (use for refreshing tokens)
 */
export async function getRefreshToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(REFRESH_TOKEN_COOKIE);
  return token?.value || null;
}

/**
 * Remove all authentication token cookies
 * Note: refreshToken deletion is for cleanup only; backend manages the actual httpOnly cookie
 */
export async function removeAuthTokens(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN_COOKIE);
  cookieStore.delete(ID_TOKEN_COOKIE);
  // Delete refreshToken cookie for cleanup (if any legacy data exists)
  // Backend manages the actual httpOnly refreshToken cookie
  cookieStore.delete(REFRESH_TOKEN_COOKIE);
}

/**
 * Check if user has valid authentication tokens
 */
export async function hasAuthToken(): Promise<boolean> {
  const accessToken = await getAccessToken();
  return accessToken !== null;
}

// Legacy support - deprecated, use getAccessToken instead
export async function getAuthToken(): Promise<string | null> {
  return await getAccessToken();
}

// Legacy support - deprecated, use setAuthTokens instead
export async function setAuthToken(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set({
    name: ACCESS_TOKEN_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: ACCESS_TOKEN_MAX_AGE,
    path: '/',
  });
}

// Legacy support - deprecated, use removeAuthTokens instead
export async function removeAuthToken(): Promise<void> {
  await removeAuthTokens();
}
