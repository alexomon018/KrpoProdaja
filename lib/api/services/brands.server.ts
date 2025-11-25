/**
 * Server-side Brands Service
 * Used for build-time static generation
 */

import type { ApiBrand, BrandListResponse } from "../types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export const brandsServerService = {
  /**
   * Convert brand name to URL-friendly slug
   */
  brandToSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  },

  /**
   * Fetch all brands at build time
   */
  async getBrands(): Promise<ApiBrand[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/brands`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch brands: ${response.statusText}`);
      }

      const data: BrandListResponse = await response.json();
      return data.brands;
    } catch (error) {
      console.error("Error fetching brands:", error);
      return [];
    }
  },

  /**
   * Group brands by first letter
   */
  groupBrandsByLetter(brands: ApiBrand[]): Record<string, ApiBrand[]> {
    const grouped: Record<string, ApiBrand[]> = {};

    brands.forEach((brand) => {
      const firstLetter = brand.name.charAt(0).toUpperCase();
      if (!grouped[firstLetter]) {
        grouped[firstLetter] = [];
      }
      grouped[firstLetter].push(brand);
    });

    // Sort brands within each letter
    Object.keys(grouped).forEach((letter) => {
      grouped[letter].sort((a, b) => a.name.localeCompare(b.name));
    });

    return grouped;
  },

  /**
   * Get all available letters
   */
  getAvailableLetters(brands: ApiBrand[]): string[] {
    const letters = new Set(
      brands.map((brand) => brand.name.charAt(0).toUpperCase())
    );
    return Array.from(letters).sort();
  },
};
