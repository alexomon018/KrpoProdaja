"use server";

import { cookies } from "next/headers";
import { setAuthTokens, removeAuthTokens, getAccessToken } from "./cookies";
import { translateError, defaultErrorMessages } from "../utils/errorTranslations";
import type {
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  RequestPasswordResetRequest,
  RequestPasswordResetResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from "../api/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

/**
 * Helper function to proxy cookies from API response to browser
 */
async function proxyCookiesFromResponse(response: Response) {
  const setCookieHeaders: string[] = [];

  response.headers.forEach((value, key) => {
    if (key.toLowerCase() === "set-cookie") {
      setCookieHeaders.push(value);
    }
  });

  if (setCookieHeaders.length === 0) {
    return;
  }

  const cookieStore = await cookies();

  for (const setCookieHeader of setCookieHeaders) {
    const cookieParts = setCookieHeader.split(";").map((part) => part.trim());
    const [nameValue] = cookieParts;
    const [name, value] = nameValue.split("=");

    console.log("Setting cookie:", name);

    const options: any = {
      httpOnly: cookieParts.some((part) => part.toLowerCase() === "httponly"),
      secure: cookieParts.some((part) => part.toLowerCase() === "secure"),
      sameSite: "lax" as const,
    };

    const maxAgePart = cookieParts.find((part) =>
      part.toLowerCase().startsWith("max-age=")
    );
    if (maxAgePart) {
      const maxAge = parseInt(maxAgePart.split("=")[1]);
      options.maxAge = maxAge;
    }

    console.log("Cookie options:", options);

    // Set the cookie in the browser via Next.js
    cookieStore.set(name, value, options);
  }
}

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
      credentials: "include",
    });

    // Proxy cookies from API to browser BEFORE consuming response body
    await proxyCookiesFromResponse(response);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || errorData.error || "Registration failed";
      return {
        success: false,
        error: translateError(errorMessage, defaultErrorMessages.register),
      };
    }

    const result: AuthResponse = await response.json();

    // Store accessToken and idToken in httpOnly cookies
    if (result.accessToken && result.idToken) {
      await setAuthTokens(result.accessToken, result.idToken);
    }

    return { success: true, data: result };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return {
      success: false,
      error: translateError(errorMessage, defaultErrorMessages.register),
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
      credentials: "include",
    });

    // Proxy cookies from API to browser BEFORE consuming response body
    await proxyCookiesFromResponse(response);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error || errorData.message || "Login failed";
      return {
        success: false,
        error: translateError(errorMessage, defaultErrorMessages.login),
      };
    }

    const result: AuthResponse = await response.json();

    // Store accessToken and idToken in httpOnly cookies
    if (result.accessToken && result.idToken) {
      await setAuthTokens(result.accessToken, result.idToken);
    }

    return { success: true, data: result };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return {
      success: false,
      error: translateError(errorMessage, defaultErrorMessages.login),
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
    const accessToken = await getAccessToken();

    if (accessToken) {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/revoke`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
        });

        // Proxy cookie clearing from API to browser
        await proxyCookiesFromResponse(response);
      } catch (error) {
        console.error("Backend token revocation failed:", error);
      }
    }

    // Remove all tokens from cookies
    await removeAuthTokens();

    // Also clear refreshToken cookie
    const cookieStore = await cookies();
    cookieStore.delete("refreshToken");

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Logout failed";
    return {
      success: false,
      error: translateError(errorMessage, "Odjava nije uspela"),
    };
  }
}

/**
 * Google OAuth login
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
      credentials: "include",
    });

    // Proxy cookies from API to browser
    await proxyCookiesFromResponse(response);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || errorData.error || "Google authentication failed";
      return {
        success: false,
        error: translateError(errorMessage, "Google prijavljivanje nije uspelo. Molimo pokušajte ponovo."),
      };
    }

    const result: AuthResponse = await response.json();

    if (result.accessToken && result.idToken) {
      await setAuthTokens(result.accessToken, result.idToken);
    }

    return { success: true, data: result };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return {
      success: false,
      error: translateError(errorMessage, "Google prijavljivanje nije uspelo. Molimo pokušajte ponovo."),
    };
  }
}

/**
 * Facebook OAuth login
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
      credentials: "include",
    });

    // Proxy cookies from API to browser
    await proxyCookiesFromResponse(response);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || errorData.error || "Facebook authentication failed";
      return {
        success: false,
        error: translateError(errorMessage, "Facebook prijavljivanje nije uspelo. Molimo pokušajte ponovo."),
      };
    }

    const result: AuthResponse = await response.json();

    if (result.accessToken && result.idToken) {
      await setAuthTokens(result.accessToken, result.idToken);
    }

    return { success: true, data: result };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return {
      success: false,
      error: translateError(errorMessage, "Facebook prijavljivanje nije uspelo. Molimo pokušajte ponovo."),
    };
  }
}

/**
 * Request password reset
 */
export async function requestPasswordResetAction(
  data: RequestPasswordResetRequest
): Promise<{
  success: boolean;
  data?: RequestPasswordResetResponse;
  error?: string;
}> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/auth/request-password-reset`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error || errorData.message || "Failed to request password reset";
      return {
        success: false,
        error: translateError(errorMessage, defaultErrorMessages.passwordReset),
      };
    }

    const result: RequestPasswordResetResponse = await response.json();
    return { success: true, data: result };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return {
      success: false,
      error: translateError(errorMessage, defaultErrorMessages.passwordReset),
    };
  }
}

/**
 * Reset password with token
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
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error || errorData.message || "Failed to reset password";
      return {
        success: false,
        error: translateError(errorMessage, defaultErrorMessages.passwordReset),
      };
    }

    const result: ResetPasswordResponse = await response.json();
    return { success: true, data: result };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return {
      success: false,
      error: translateError(errorMessage, defaultErrorMessages.passwordReset),
    };
  }
}

/**
 * Refresh access token using the httpOnly refresh token cookie
 */
export async function refreshTokenAction(): Promise<{
  success: boolean;
  data?: AuthResponse;
  error?: string;
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Important: sends the refreshToken cookie
    });

    // Proxy cookies from API to browser BEFORE consuming response body
    await proxyCookiesFromResponse(response);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.error || "Failed to refresh token",
      };
    }

    const result: AuthResponse = await response.json();

    // Store new accessToken and idToken in httpOnly cookies
    if (result.accessToken && result.idToken) {
      await setAuthTokens(result.accessToken, result.idToken);
    }

    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
