/**
 * Authentication Service
 * Handles user registration, login, and logout using Server Actions
 * @deprecated - Use Server Actions from lib/auth/actions directly for better security
 */

import { registerAction, loginAction, logoutAction } from '../../auth/actions';
import { getAuthToken, hasAuthToken } from '../../auth/cookies';
import type { RegisterRequest, LoginRequest, AuthResponse } from '../types';

export const authService = {
  /**
   * Register a new user
   * POST /api/auth/register
   * @deprecated - Use registerAction from lib/auth/actions directly
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const result = await registerAction(data);

    if (!result.success || !result.data) {
      throw new Error(result.error || 'Registration failed');
    }

    return result.data;
  },

  /**
   * Login user
   * POST /api/auth/login
   * @deprecated - Use loginAction from lib/auth/actions directly
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    const result = await loginAction(data);

    if (!result.success || !result.data) {
      throw new Error(result.error || 'Login failed');
    }

    return result.data;
  },

  /**
   * Logout user
   * POST /api/auth/logout
   * @deprecated - Use logoutAction from lib/auth/actions directly
   */
  async logout(): Promise<void> {
    const result = await logoutAction();

    if (!result.success) {
      throw new Error(result.error || 'Logout failed');
    }
  },

  /**
   * Check if user is authenticated (has valid token)
   */
  async isAuthenticated(): Promise<boolean> {
    return await hasAuthToken();
  },

  /**
   * Get current auth token
   */
  async getToken(): Promise<string | null> {
    return await getAuthToken();
  },
};
