/**
 * Authentication Service
 * Handles user registration, login, and logout
 */

import { apiClient, tokenManager } from '../client';
import type { RegisterRequest, LoginRequest, AuthResponse } from '../types';

export const authService = {
  /**
   * Register a new user
   * POST /api/auth/register
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);

    // Store token after successful registration
    if (response.token) {
      tokenManager.set(response.token);
    }

    return response;
  },

  /**
   * Login user
   * POST /api/auth/login
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);

    // Store token after successful login
    if (response.token) {
      tokenManager.set(response.token);
    }

    return response;
  },

  /**
   * Logout user
   * POST /api/auth/logout
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout', undefined, { requiresAuth: true });
    } finally {
      // Always remove token, even if API call fails
      tokenManager.remove();
    }
  },

  /**
   * Check if user is authenticated (has valid token)
   */
  isAuthenticated(): boolean {
    return tokenManager.get() !== null;
  },

  /**
   * Get current auth token
   */
  getToken(): string | null {
    return tokenManager.get();
  },
};
