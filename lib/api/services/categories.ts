/**
 * Categories Service
 * Handles all category-related operations
 */

import { apiClient } from '../client';
import type { CategoryListResponse } from '../types';

export const categoriesService = {
  /**
   * Get all categories
   * GET /api/categories
   */
  async getCategories(): Promise<CategoryListResponse> {
    return apiClient.get<CategoryListResponse>('/categories');
  },
};
