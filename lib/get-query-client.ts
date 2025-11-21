import { QueryClient } from '@tanstack/react-query';
import { cache } from 'react';

/**
 * Get QueryClient for server-side usage
 * Uses React cache to ensure we get the same instance across the request
 */
export const getQueryClient = cache(() => new QueryClient());
