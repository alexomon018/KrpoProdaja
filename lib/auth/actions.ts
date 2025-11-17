/**
 * Authentication Server Actions
 * Handles login, register, and logout operations with cookie-based tokens
 * Supports three-token system: accessToken, idToken, refreshToken
 */

"use server";

import { setAuthTokens, removeAuthTokens, getAccessToken } from "./cookies";
import type {
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  RequestPasswordResetRequest,
  RequestPasswordResetResponse,
  ResetPasswordRequest,
  ResetPasswordResponse
} from "../api/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

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
      await setAuthTokens(
        result.accessToken,
        result.idToken,
        result.refreshToken
      );
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
      await setAuthTokens(
        result.accessToken,
        result.idToken,
        result.refreshToken
      );
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
            Authorization: `Bearer ${accessToken}`,
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

/**
 * Google OAuth login
 * Sends Google token to backend for verification and user creation/login
 */
export async function googleAuthAction(
  googleToken: string
): Promise<{ success: boolean; data?: AuthResponse; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/google`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: googleToken }),
    });

    console.log("respone", response);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || "Google authentication failed",
      };
    }

    const result: AuthResponse = await response.json();

    // Store all three tokens in httpOnly cookies
    if (result.accessToken && result.idToken && result.refreshToken) {
      await setAuthTokens(
        result.accessToken,
        result.idToken,
        result.refreshToken
      );
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
 * Facebook OAuth login
 * Sends Facebook access token to backend for verification and user creation/login
 */
export async function facebookAuthAction(
  facebookAccessToken: string
): Promise<{ success: boolean; data?: AuthResponse; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/facebook`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ accessToken: facebookAccessToken }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || "Facebook authentication failed",
      };
    }

    const result: AuthResponse = await response.json();

    // Store all three tokens in httpOnly cookies
    if (result.accessToken && result.idToken && result.refreshToken) {
      await setAuthTokens(
        result.accessToken,
        result.idToken,
        result.refreshToken
      );
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
 * Request password reset
 * Sends an email with a reset token if the email exists
 */
export async function requestPasswordResetAction(
  data: RequestPasswordResetRequest
): Promise<{ success: boolean; data?: RequestPasswordResetResponse; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/request-password-reset`, {
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
        error: errorData.error || "Failed to request password reset",
      };
    }

    const result: RequestPasswordResetResponse = await response.json();

    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Reset password with token
 * Sets a new password using the reset token from email
 */
export async function resetPasswordAction(
  data: ResetPasswordRequest
): Promise<{ success: boolean; data?: ResetPasswordResponse; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
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
        error: errorData.error || "Failed to reset password",
      };
    }

    const result: ResetPasswordResponse = await response.json();

    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
