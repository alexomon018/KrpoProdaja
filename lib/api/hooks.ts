/**
 * React Query Hooks for KrpoProdaja API
 * Use these hooks in your React components
 */

'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from './services/auth';
import { productsService } from './services/products';
import { usersService } from './services/users';
import { searchService } from './services/search';
import type {
  RegisterRequest,
  LoginRequest,
  CreateProductRequest,
  UpdateProductRequest,
  UpdateProductStatusRequest,
  ProductFilters,
  UpdateUserRequest,
  SearchParams,
  SearchSuggestionsParams,
  PaginationParams,
} from './types';

// ==================== Auth Hooks ====================

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.clear(); // Clear all cached data on logout
    },
  });
}

// ==================== Products Hooks ====================

export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productsService.getProducts(filters),
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => productsService.getProduct(id),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductRequest) => productsService.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateProductRequest }) =>
      productsService.updateProduct(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['products', variables.id] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => productsService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useUpdateProductStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateProductStatusRequest }) =>
      productsService.updateProductStatus(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['products', variables.id] });
    },
  });
}

export function useSimilarProducts(id: number, limit = 10) {
  return useQuery({
    queryKey: ['products', id, 'similar', limit],
    queryFn: () => productsService.getSimilarProducts(id, limit),
    enabled: !!id,
  });
}

// ==================== User Hooks ====================

export function useCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: () => usersService.getCurrentUser(),
    enabled: authService.isAuthenticated(),
  });
}

export function useUpdateCurrentUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserRequest) => usersService.updateCurrentUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });
}

export function useUserProfile(userId: number) {
  return useQuery({
    queryKey: ['users', userId, 'profile'],
    queryFn: () => usersService.getUserProfile(userId),
    enabled: !!userId,
  });
}

export function useUserProducts(userId: number, params?: PaginationParams) {
  return useQuery({
    queryKey: ['users', userId, 'products', params],
    queryFn: () => usersService.getUserProducts(userId, params),
    enabled: !!userId,
  });
}

// ==================== Search & Discovery Hooks ====================

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
