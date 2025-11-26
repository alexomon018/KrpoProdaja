/**
 * Cities Service
 * Handles all city-related operations
 */

import { apiClient } from "../client";
import type { CityListResponse } from "../types";

export const citiesService = {
  /**
   * Get Serbian cities with population >= 5000
   * GET /api/cities/serbia?minPopulation=5000
   */
  async getCities(): Promise<CityListResponse> {
    return apiClient.get<CityListResponse>("/cities/serbia?minPopulation=15000");
  },
};
