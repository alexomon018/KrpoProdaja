/**
 * Cookie-based Token Management with Server Actions
 * Provides secure, httpOnly cookie storage for authentication tokens
 */

'use server';

import { cookies } from 'next/headers';

const TOKEN_COOKIE_NAME = 'auth_token';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/**
 * Set authentication token in httpOnly cookie
 */
export async function setAuthToken(token: string): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set({
    name: TOKEN_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  });
}

/**
 * Get authentication token from cookie
 */
export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_COOKIE_NAME);
  return token?.value || null;
}

/**
 * Remove authentication token cookie
 */
export async function removeAuthToken(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_COOKIE_NAME);
}

/**
 * Check if user has an authentication token
 */
export async function hasAuthToken(): Promise<boolean> {
  const token = await getAuthToken();
  return token !== null;
}
