/**
 * API Client for KrpoProdaja API
 * Handles all HTTP requests with authentication and error handling
 */

import { getAccessToken } from "../auth/cookies";
import { refreshTokenAction } from "../auth/actions";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
const API_TIMEOUT = parseInt(
  process.env.NEXT_PUBLIC_API_TIMEOUT || "10000",
  10
);

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export interface ApiRequestOptions extends RequestInit {
  timeout?: number;
  requiresAuth?: boolean;
  token?: string; // Optional token override for server-side calls
}

/**
 * Main API client
 */
class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor(baseURL: string, timeout: number) {
    this.baseURL = baseURL;
    this.timeout = timeout;
  }

  /**
   * Refresh the access token
   */
  private async refreshToken(): Promise<boolean> {
    // If already refreshing, wait for that request
    if (isRefreshing && refreshPromise) {
      return refreshPromise;
    }

    isRefreshing = true;
    refreshPromise = (async () => {
      try {
        const result = await refreshTokenAction();
        return result.success;
      } catch (error) {
        console.error("Token refresh failed:", error);
        return false;
      } finally {
        isRefreshing = false;
        refreshPromise = null;
      }
    })();

    return refreshPromise;
  }

  /**
   * Make an HTTP request with timeout and auth handling
   */
  private async request<T>(
    endpoint: string,
    options: ApiRequestOptions = {},
    isRetry = false
  ): Promise<T> {
    const {
      timeout = this.timeout,
      requiresAuth = false,
      token,
      ...fetchOptions
    } = options;

    // Build headers
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(fetchOptions.headers as Record<string, string>),
    };

    // Add auth token if required
    if (requiresAuth) {
      // Use provided token or get from cookie
      const authToken = token || (await getAccessToken());
      if (authToken) {
        headers["Authorization"] = `Bearer ${authToken}`;
      }
    }

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...fetchOptions,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle 401 Unauthorized - Try to refresh token
      if (response.status === 401 && requiresAuth && !isRetry) {
        console.log("Access token expired, attempting refresh...");

        const refreshSuccess = await this.refreshToken();

        if (refreshSuccess) {
          console.log("Token refreshed successfully, retrying request...");
          // Retry the original request with the new token
          return this.request<T>(endpoint, options, true);
        } else {
          console.error("Token refresh failed, redirecting to login...");
          // Refresh failed, redirect to login
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
          throw new ApiError(401, "Session expired. Please login again.");
        }
      }

      // Handle non-OK responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          response.status,
          errorData.message || response.statusText,
          errorData
        );
      }

      // Parse response
      const contentType = response.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        return await response.json();
      }

      return {} as T;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new ApiError(408, "Request timeout");
        }
        throw new ApiError(0, error.message);
      }

      throw new ApiError(0, "Unknown error occurred");
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    data?: any,
    options?: ApiRequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    data?: any,
    options?: ApiRequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(
    endpoint: string,
    data?: any,
    options?: ApiRequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL, API_TIMEOUT);
