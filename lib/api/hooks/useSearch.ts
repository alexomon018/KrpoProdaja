/**
 * Search & Discovery Hooks
 * Hooks for search, categories, and favorites
 */

'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/auth';
import { searchService } from '../services/search';
import type {
  SearchParams,
  SearchSuggestionsParams,
  PaginationParams,
} from '../types';

export function useSearchProducts(params: SearchParams) {
  return useQuery({
    queryKey: ['search', params],
    queryFn: () => searchService.searchProducts(params),
    enabled: !!params.q, // Only run if search query exists
  });
}

export function useSearchSuggestions(params: SearchSuggestionsParams) {
  return useQuery({
    queryKey: ['searchSuggestions', params],
    queryFn: () => searchService.getSearchSuggestions(params),
    enabled: params.q.length >= 2, // Only run if query is at least 2 characters
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => searchService.getCategories(),
    staleTime: 30 * 60 * 1000, // 30 minutes - categories don't change often
  });
}

export function useFavorites(params?: PaginationParams) {
  return useQuery({
    queryKey: ['favorites', params],
    queryFn: () => searchService.getFavorites(params),
    enabled: authService.isAuthenticated(),
  });
}

export function useAddToFavorites() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: number) => searchService.addToFavorites(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useRemoveFromFavorites() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: number) => searchService.removeFromFavorites(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
