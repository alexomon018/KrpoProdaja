/**
 * User Profiles Service
 * Handles user profile operations
 */

import { apiClient } from "../client";
import type {
  ApiUser,
  UpdateUserRequest,
  ChangePasswordRequest,
  UserProfileResponse,
  ProductListResponse,
  PaginationParams,
} from "../types";

export const usersService = {
  /**
   * Update current user profile
   * PUT /api/profile
   * Requires authentication
   */
  async updateCurrentUser(data: UpdateUserRequest): Promise<ApiUser> {
    return apiClient.put<ApiUser>("/users/profile", data, {
      requiresAuth: true,
    });
  },

  /**
   * Change password
   * PUT /api/password
   * Requires authentication
   */
  async changePassword(
    data: ChangePasswordRequest
  ): Promise<{ message: string }> {
    return apiClient.put<{ message: string }>("/users/password", data, {
      requiresAuth: true,
    });
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

    if (params?.page) query.append("page", String(params.page));
    if (params?.limit) query.append("limit", String(params.limit));

    const queryString = query.toString();
    const endpoint = queryString
      ? `/users/${userId}/products?${queryString}`
      : `/users/${userId}/products`;

    return apiClient.get<ProductListResponse>(endpoint);
  },
};
