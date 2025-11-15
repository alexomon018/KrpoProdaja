/**
 * Authentication Server Actions
 * Handles login, register, and logout operations with cookie-based tokens
 * Supports three-token system: accessToken, idToken, refreshToken
 */

"use server";

import { setAuthTokens, removeAuthTokens, getAccessToken } from "./cookies";
import type { RegisterRequest, LoginRequest, AuthResponse } from "../api/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

/**
 * Register a new user
 */
export async function registerAction(
  data: RegisterRequest
): Promise<{ success: boolean; data?: AuthResponse; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || "Registration failed",
      };
    }

    const result: AuthResponse = await response.json();

    // Store all three tokens in httpOnly cookies
    if (result.accessToken && result.idToken && result.refreshToken) {
      await setAuthTokens(result.accessToken, result.idToken, result.refreshToken);
    }

    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Login user
 */
export async function loginAction(
  data: LoginRequest
): Promise<{ success: boolean; data?: AuthResponse; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || "Login failed",
      };
    }

    const result: AuthResponse = await response.json();

    // Store all three tokens in httpOnly cookies
    if (result.accessToken && result.idToken && result.refreshToken) {
      await setAuthTokens(result.accessToken, result.idToken, result.refreshToken);
    }

    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Logout user
 */
export async function logoutAction(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    // Get access token for backend revocation
    const accessToken = await getAccessToken();

    // Call backend revocation endpoint if token exists
    if (accessToken) {
      try {
        await fetch(`${API_BASE_URL}/auth/revoke`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
          },
        });
      } catch (error) {
        // Continue even if backend revocation fails
        console.error("Backend token revocation failed:", error);
      }
    }

    // Remove all tokens from cookies
    await removeAuthTokens();

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Logout failed",
    };
  }
}
