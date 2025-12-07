/**
 * useUserProductsManagement Hook
 * Custom hook for managing user products list with filters, pagination, and mutations
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { useQueryStates, parseAsString, parseAsInteger } from 'nuqs';
import { useUserProducts, useUserProfile } from './useUsers';
import { useDeleteProduct, useUpdateProductStatus } from './useProducts';
import { useAuth } from '@/providers/AuthProvider';
import type { UserProductFilters, ApiProduct } from '../types';

interface UseUserProductsManagementProps {
  userId: string;
}

export function useUserProductsManagement({ userId }: UseUserProductsManagementProps) {
  const { user: currentUser } = useAuth();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  // Check if viewing own products
  const isOwnProducts = currentUser?.id === userId;

  // Mutations
  const deleteProduct = useDeleteProduct();
  const updateProductStatus = useUpdateProductStatus();

  // URL query params using nuqs
  const [queryParams, setQueryParams] = useQueryStates({
    status: parseAsString.withDefault('active'),
    categoryId: parseAsString,
    minPrice: parseAsInteger,
    maxPrice: parseAsInteger,
    condition: parseAsString,
    sortBy: parseAsString.withDefault('newest'),
  });

  // Build filters from query params
  const filters: Omit<UserProductFilters, 'page' | 'limit'> = {
    status: queryParams.status as UserProductFilters['status'],
    categoryId: queryParams.categoryId || undefined,
    minPrice: queryParams.minPrice || undefined,
    maxPrice: queryParams.maxPrice || undefined,
    condition: queryParams.condition as UserProductFilters['condition'],
    sortBy: queryParams.sortBy as UserProductFilters['sortBy'],
  };

  const { data: profileData, isLoading: profileLoading } = useUserProfile(userId);
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useUserProducts(userId, filters);

  // Infinite scroll using Intersection Observer
  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Delete handlers
  const handleDeleteClick = (productId: string) => {
    setProductToDelete(productId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    try {
      await deleteProduct.mutateAsync(productToDelete);
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch (error) {
      console.error('Failed to delete product:', error);
      // Keep dialog open on error so user can retry
    }
  };

  // Status change handler
  const handleStatusChange = async (
    productId: string,
    newStatus: 'active' | 'reserved' | 'sold'
  ) => {
    try {
      await updateProductStatus.mutateAsync({
        id: productId,
        data: { status: newStatus },
      });
    } catch (error) {
      console.error('Failed to update product status:', error);
    }
  };

  // Computed values
  const isInitialLoading = isLoading && !data;
  const user = profileData?.user;
  const allProducts: ApiProduct[] = data?.pages.flatMap((page) => page.data) || [];
  const totalCount = data?.pages[0]?.pagination?.total ?? 0;

  return {
    // Data
    user,
    allProducts,
    totalCount,
    isOwnProducts,

    // Loading states
    isLoading,
    isInitialLoading,
    isFetchingNextPage,
    profileLoading,

    // Pagination
    hasNextPage,
    fetchNextPage,
    loadMoreRef,

    // Filters
    queryParams,
    setQueryParams,

    // Mutations
    deleteProduct,
    updateProductStatus,
    handleDeleteClick,
    handleDeleteConfirm,
    handleStatusChange,

    // Dialog state
    deleteDialogOpen,
    setDeleteDialogOpen,
    productToDelete,
  };
}
