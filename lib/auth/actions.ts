/**
 * Authentication Server Actions
 * Handles login, register, and logout operations with cookie-based tokens
 */

'use server';

import { setAuthToken, removeAuthToken } from './cookies';
import type { RegisterRequest, LoginRequest, AuthResponse } from '../api/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

/**
 * Register a new user
 */
export async function registerAction(
  data: RegisterRequest
): Promise<{ success: boolean; data?: AuthResponse; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || 'Registration failed',
      };
    }

    const result: AuthResponse = await response.json();

    // Store token in httpOnly cookie
    if (result.token) {
      await setAuthToken(result.token);
    }

    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
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
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || 'Login failed',
      };
    }

    const result: AuthResponse = await response.json();

    // Store token in httpOnly cookie
    if (result.token) {
      await setAuthToken(result.token);
    }

    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Logout user
 */
export async function logoutAction(): Promise<{ success: boolean; error?: string }> {
  try {
    // Remove token from cookie
    await removeAuthToken();

    // Optionally call backend logout endpoint
    // Note: We can't easily get the token here since it's httpOnly
    // Backend logout is optional for stateless JWT tokens

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Logout failed',
    };
  }
}
