/**
 * Brands Hooks
 * Hooks for fetching brands
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import { brandsService } from '../services/brands';

export function useBrands() {
  return useQuery({
    queryKey: ['brands'],
    queryFn: () => brandsService.getBrands(),
    staleTime: 1000 * 60 * 60, // Cache for 1 hour since brands don't change often
  });
}
