/**
 * Brands Service
 * Handles all brand-related operations
 */

import { apiClient } from '../client';
import type { BrandListResponse } from '../types';

export const brandsService = {
  /**
   * Get all brands
   * GET /api/brands
   */
  async getBrands(): Promise<BrandListResponse> {
    return apiClient.get<BrandListResponse>('/brands');
  },
};
