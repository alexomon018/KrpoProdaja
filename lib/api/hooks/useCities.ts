/**
 * Cities Hooks
 * Hooks for fetching cities
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import { citiesService } from '../services/cities';

export function useCities() {
  return useQuery({
    queryKey: ['cities'],
    queryFn: () => citiesService.getCities(),
    staleTime: 1000 * 60 * 60, // Cache for 1 hour since cities don't change
  });
}
