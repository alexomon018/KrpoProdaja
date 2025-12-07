/**
 * Products Hooks
 * Hooks for managing products (CRUD operations)
 */

'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productsService } from '../services/products';
import { invalidateProductQueries } from '../utils/cache';
import type {
  CreateProductRequest,
  UpdateProductRequest,
  UpdateProductStatusRequest,
  ProductFilters,
} from '../types';

export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productsService.getProducts(filters),
  });
}

export function useProduct(id: string) {
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
      // Invalidate all product-related queries including user products
      invalidateProductQueries(queryClient);
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductRequest }) =>
      productsService.updateProduct(id, data),
    onSuccess: (_, variables) => {
      // Invalidate all product-related queries including user products
      invalidateProductQueries(queryClient);
      // Also invalidate the specific product
      queryClient.invalidateQueries({ queryKey: ['products', variables.id] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productsService.deleteProduct(id),
    onSuccess: () => {
      // Invalidate all product-related queries including user products
      invalidateProductQueries(queryClient);
    },
  });
}

export function useUpdateProductStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductStatusRequest }) =>
      productsService.updateProductStatus(id, data),
    onSuccess: (_, variables) => {
      // Invalidate all product-related queries including user products
      invalidateProductQueries(queryClient);
      // Also invalidate the specific product
      queryClient.invalidateQueries({ queryKey: ['products', variables.id] });
    },
  });
}

export function useSimilarProducts(id: string, limit = 10) {
  return useQuery({
    queryKey: ['products', id, 'similar', limit],
    queryFn: () => productsService.getSimilarProducts(id, limit),
    enabled: !!id,
  });
}
