/**
 * Search & Discovery Service
 * Handles search, categories, and favorites functionality
 */

import { apiClient } from '../client';
import type {
  ProductListResponse,
  SearchParams,
  SearchSuggestion,
  SearchSuggestionsParams,
  ApiCategory,
  FavoritesResponse,
  FavoriteProduct,
  PaginationParams,
} from '../types';

export const searchService = {
  /**
   * Search products
   * GET /api/search
   */
  async searchProducts(params: SearchParams): Promise<ProductListResponse> {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query.append(key, String(value));
      }
    });

    return apiClient.get<ProductListResponse>(`/search?${query.toString()}`);
  },

  /**
   * Get search suggestions (autocomplete)
   * GET /api/search/suggestions
   */
  async getSearchSuggestions(
    params: SearchSuggestionsParams
  ): Promise<SearchSuggestion[]> {
    const query = new URLSearchParams();
    query.append('q', params.q);
    if (params.limit) query.append('limit', String(params.limit));

    return apiClient.get<SearchSuggestion[]>(`/search/suggestions?${query.toString()}`);
  },

  /**
   * Get all categories
   * GET /api/categories
   */
  async getCategories(): Promise<ApiCategory[]> {
    return apiClient.get<ApiCategory[]>('/categories');
  },

  /**
   * Get user's favorite products
   * GET /api/favorites
   * Requires authentication
   */
  async getFavorites(params?: PaginationParams): Promise<FavoritesResponse> {
    const query = new URLSearchParams();

    if (params?.page) query.append('page', String(params.page));
    if (params?.limit) query.append('limit', String(params.limit));

    const queryString = query.toString();
    const endpoint = queryString ? `/favorites?${queryString}` : '/favorites';

    return apiClient.get<FavoritesResponse>(endpoint, { requiresAuth: true });
  },

  /**
   * Add product to favorites
   * POST /api/favorites/:productId
   * Requires authentication
   */
  async addToFavorites(productId: number): Promise<FavoriteProduct> {
    return apiClient.post<FavoriteProduct>(
      `/favorites/${productId}`,
      undefined,
      { requiresAuth: true }
    );
  },

  /**
   * Remove product from favorites
   * DELETE /api/favorites/:productId
   * Requires authentication
   */
  async removeFromFavorites(productId: number): Promise<void> {
    return apiClient.delete<void>(`/favorites/${productId}`, { requiresAuth: true });
  },
};
