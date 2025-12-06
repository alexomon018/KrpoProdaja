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
  UserProductFilters,
  SendPhoneVerificationRequest,
  SendPhoneVerificationResponse,
  VerifyPhoneRequest,
  VerifyPhoneResponse,
  ResendPhoneVerificationResponse,
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
   * Requires authentication
   */
  async getUserProfile(userId: string): Promise<UserProfileResponse> {
    return apiClient.get<UserProfileResponse>(`/users/${userId}`, {
      requiresAuth: true,
    });
  },

  /**
   * Get user's product listings
   * GET /api/users/:userId/products
   * Supports filtering by status, category, price range, condition, and sorting
   */
  async getUserProducts(
    userId: string,
    filters?: UserProductFilters
  ): Promise<ProductListResponse> {
    const query = new URLSearchParams();

    if (filters?.page) query.append("page", String(filters.page));
    if (filters?.limit) query.append("limit", String(filters.limit));
    if (filters?.status) query.append("status", filters.status);
    if (filters?.categoryId) query.append("categoryId", filters.categoryId);
    if (filters?.minPrice !== undefined) query.append("minPrice", String(filters.minPrice));
    if (filters?.maxPrice !== undefined) query.append("maxPrice", String(filters.maxPrice));
    if (filters?.condition) query.append("condition", filters.condition);
    if (filters?.sortBy) query.append("sortBy", filters.sortBy);

    const queryString = query.toString();
    const endpoint = queryString
      ? `/users/${userId}/products?${queryString}`
      : `/users/${userId}/products`;

    return apiClient.get<ProductListResponse>(endpoint);
  },

  /**
   * Send phone verification SMS
   * POST /api/users/phone/send-verification
   * Requires authentication
   * Rate limited to 5 requests per hour
   */
  async sendPhoneVerification(
    data: SendPhoneVerificationRequest
  ): Promise<SendPhoneVerificationResponse> {
    return apiClient.post<SendPhoneVerificationResponse>(
      "/users/phone/send-verification",
      data,
      { requiresAuth: true }
    );
  },

  /**
   * Verify phone with 6-digit code
   * POST /api/users/phone/verify
   * Requires authentication
   */
  async verifyPhone(data: VerifyPhoneRequest): Promise<VerifyPhoneResponse> {
    return apiClient.post<VerifyPhoneResponse>("/users/phone/verify", data, {
      requiresAuth: true,
    });
  },

  /**
   * Resend phone verification SMS
   * POST /api/users/phone/resend-verification
   * Requires authentication
   * Rate limited to 5 requests per hour
   */
  async resendPhoneVerification(): Promise<ResendPhoneVerificationResponse> {
    return apiClient.post<ResendPhoneVerificationResponse>(
      "/users/phone/resend-verification",
      {},
      { requiresAuth: true }
    );
  },
};
