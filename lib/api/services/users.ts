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
