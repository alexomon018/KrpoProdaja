/**
 * User Profiles Service
 * Handles user profile operations
 */

import { apiClient } from '../client';
import type {
  ApiUser,
  UpdateUserRequest,
  UserProfileResponse,
  ProductListResponse,
  PaginationParams,
} from '../types';

export const usersService = {
  /**
   * Get current user profile
   * GET /api/me
   * Requires authentication
   */
  async getCurrentUser(): Promise<ApiUser> {
    return apiClient.get<ApiUser>('/me', { requiresAuth: true });
  },

  /**
   * Update current user profile
   * PUT /api/me
   * Requires authentication
   */
  async updateCurrentUser(data: UpdateUserRequest): Promise<ApiUser> {
    return apiClient.put<ApiUser>('/me', data, { requiresAuth: true });
  },

  /**
   * Get public user profile by ID
   * GET /api/users/:userId
   */
  async getUserProfile(userId: number): Promise<UserProfileResponse> {
    return apiClient.get<UserProfileResponse>(`/users/${userId}`);
  },

  /**
   * Get user's product listings
   * GET /api/users/:userId/products
   */
  async getUserProducts(
    userId: number,
    params?: PaginationParams
  ): Promise<ProductListResponse> {
    const query = new URLSearchParams();

    if (params?.page) query.append('page', String(params.page));
    if (params?.limit) query.append('limit', String(params.limit));

    const queryString = query.toString();
    const endpoint = queryString
      ? `/users/${userId}/products?${queryString}`
      : `/users/${userId}/products`;

    return apiClient.get<ProductListResponse>(endpoint);
  },
};
