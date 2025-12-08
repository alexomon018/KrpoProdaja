/**
 * useHomeProducts Hook
 * Custom hook for managing home page products with filtering and favorite functionality
 */

'use client';

import { useState, useMemo } from 'react';
import { useProducts } from './useProducts';
import type { ApiProduct } from '../types';
import type { ProductType, SizeType, ConditionType } from '@/lib/types';
import type { FilterOptions } from '@/components/organisms';

// Map API product to ProductType
function mapApiProductToProductType(apiProduct: ApiProduct): ProductType {
  // API may return either user or seller object - check both
  const sellerData = apiProduct.seller || apiProduct.user;
  const sellerId =
    sellerData?.id || apiProduct.userId?.toString() || 'unknown';
  const sellerEmail =
    sellerData?.email || `user${apiProduct.userId || 'unknown'}@placeholder.com`;

  return {
    id: apiProduct.id.toString(),
    title: apiProduct.title,
    price: apiProduct.price,
    images: apiProduct.images || [],
    brand: apiProduct.brand,
    size: (apiProduct.size as SizeType) || 'M',
    condition: (apiProduct.condition as ConditionType) || 'good',
    category: apiProduct.category?.name || 'Other',
    location: apiProduct.location || '',
    seller: {
      id: sellerId,
      email: sellerEmail,
      avatar: sellerData?.avatar,
      memberSince: new Date(sellerData?.createdAt || apiProduct.createdAt),
    },
    createdAt: new Date(apiProduct.createdAt),
    isFavorite: apiProduct.isFavorite || false,
  };
}

export function useHomeProducts() {
  const [filters, setFilters] = useState<FilterOptions>({});

  // Fetch products using React Query - will use prefetched data from server
  const { data: productsResponse, isLoading } = useProducts();

  // Map API products to ProductType
  const products: ProductType[] = useMemo(
    () => productsResponse?.data?.map(mapApiProductToProductType) || [],
    [productsResponse]
  );

  // Filter handlers
  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    // TODO: Implement filter logic
  };

  const removeFilter = (filterKey: keyof FilterOptions) => {
    const newFilters = { ...filters };
    delete newFilters[filterKey];
    setFilters(newFilters);
  };

  const clearAllFilters = () => {
    setFilters({});
  };

  const removeSizeFilter = (size: string) => {
    const newSizes = filters.sizes?.filter((s) => s !== size);
    setFilters({ ...filters, sizes: newSizes });
  };

  const removeBrandFilter = (brand: string) => {
    const newBrands = filters.brands?.filter((b) => b !== brand);
    setFilters({ ...filters, brands: newBrands });
  };

  // Favorite handler
  const handleFavoriteClick = (productId: string) => {
    // TODO: Implement favorite toggle with API mutation
    console.log('Toggle favorite for product:', productId);
  };

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    return Object.keys(filters).filter((key) => {
      const value = filters[key as keyof FilterOptions];
      return (
        value !== undefined && (Array.isArray(value) ? value.length > 0 : true)
      );
    }).length;
  }, [filters]);

  return {
    // Data
    products,
    isLoading,

    // Filters
    filters,
    activeFilterCount,
    handleFiltersChange,
    removeFilter,
    clearAllFilters,
    removeSizeFilter,
    removeBrandFilter,

    // Actions
    handleFavoriteClick,
  };
}
