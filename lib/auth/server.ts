/**
 * Server-side auth utilities
 * For use in Server Components and Server Actions
 */

"use server";

import { getAuthToken } from "./cookies";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

/**
 * Get current authenticated user from token
 */
export async function getCurrentUser() {
  try {
    const token = await getAuthToken();

    if (!token) {
      return null;
    }

    // Fetch user profile from API
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    // The API can return either:
    // 1. Direct user object: { id, email, firstName, ... }
    // 2. Nested structure: { user: {...}, stats: {...} }
    // Handle both cases
    if (data.user) {
      return data.user;
    }

    return data;
  } catch (error) {
    return null;
  }
}
