/**
 * Cache Invalidation Utilities
 * Centralized cache invalidation helpers for React Query
 */

import { QueryClient, QueryKey } from '@tanstack/react-query';

/**
 * Query key prefixes used across the app
 */
export const QueryKeys = {
  products: 'products',
  users: 'users',
  currentUser: 'currentUser',
  brands: 'brands',
  categories: 'categories',
  search: 'search',
} as const;

/**
 * Invalidate all queries that start with a given prefix
 */
export const invalidateQueriesByPrefix = (
  queryClient: QueryClient,
  prefix: string | string[]
) => {
  return queryClient.invalidateQueries({
    queryKey: Array.isArray(prefix) ? prefix : [prefix],
  });
};

/**
 * Invalidate all product-related queries
 * This includes:
 * - All products lists
 * - Individual product details
 * - User products lists
 */
export const invalidateProductQueries = (queryClient: QueryClient) => {
  // Invalidate all product queries
  queryClient.invalidateQueries({ queryKey: [QueryKeys.products] });

  // Invalidate all user product queries (for all users)
  queryClient.invalidateQueries({
    predicate: (query) => {
      const key = query.queryKey;
      return (
        Array.isArray(key) &&
        key[0] === QueryKeys.users &&
        key[2] === QueryKeys.products
      );
    },
  });
};

/**
 * Invalidate user products for a specific user
 */
export const invalidateUserProducts = (
  queryClient: QueryClient,
  userId: string
) => {
  return queryClient.invalidateQueries({
    queryKey: [QueryKeys.users, userId, QueryKeys.products],
  });
};

/**
 * Invalidate user profile
 */
export const invalidateUserProfile = (
  queryClient: QueryClient,
  userId: string
) => {
  return queryClient.invalidateQueries({
    queryKey: [QueryKeys.users, userId, 'profile'],
  });
};

/**
 * Invalidate current user data
 */
export const invalidateCurrentUser = (queryClient: QueryClient) => {
  return queryClient.invalidateQueries({
    queryKey: [QueryKeys.currentUser],
  });
};

/**
 * Get all query keys from cache that match a predicate
 */
export const getMatchingQueryKeys = (
  queryClient: QueryClient,
  predicate: (queryKey: QueryKey) => boolean
): QueryKey[] => {
  return queryClient
    .getQueryCache()
    .getAll()
    .filter((cache) => predicate(cache.queryKey))
    .map((cache) => cache.queryKey);
};

/**
 * Factory function to create a cache invalidator
 */
export const createCacheInvalidator = (
  queryClient: QueryClient,
  invalidateFn: (queryClient: QueryClient) => void
) => {
  return () => invalidateFn(queryClient);
};
