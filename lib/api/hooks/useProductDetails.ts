/**
 * useProductDetails Hook
 * Custom hook for managing product detail page with data transformation and related content
 */

'use client';

import { useMemo } from 'react';
import { useProduct } from './useProducts';
import { mockProducts, mockReviews, mockReviewSummaries } from '@/lib/mockData';
import type { SizeType, ConditionType, ProductType } from '@/lib/types';
import type { ItemDetail } from '@/components/molecules/ProductDescription/ProductDescription';
import type { ShippingOption } from '@/components/molecules/ShippingOptions/ShippingOptions';

interface UseProductDetailsProps {
  productId: string;
}

// Mock view count data
const mockViewCounts: Record<string, number> = {
  '1': 247,
  '2': 156,
  '3': 432,
  '4': 198,
  '5': 89,
  '6': 567,
  '7': 123,
  '8': 345,
};

// Mock shipping options
const mockShippingOptions: ShippingOption[] = [
  {
    id: '1',
    name: 'Standardna dostava',
    price: 300,
    estimatedDays: '3-5 radnih dana',
    icon: 'truck',
  },
  {
    id: '2',
    name: 'Brza dostava',
    price: 600,
    estimatedDays: '1-2 radna dana',
    icon: 'package',
  },
  {
    id: '3',
    name: 'Lično preuzimanje',
    price: 0,
    estimatedDays: 'Odmah dostupno',
    icon: 'mappin',
  },
];

export function useProductDetails({ productId }: UseProductDetailsProps) {
  // Use the product hook - will use server-side primed data
  const { data: apiProduct, isLoading } = useProduct(productId);

  // Transform API product to ProductType with seller info
  const product = useMemo(() => {
    if (!apiProduct) return null;

    // Use seller data if available, otherwise fall back to user
    const sellerData = apiProduct.seller || apiProduct.user;

    if (!sellerData) return null;

    return {
      id: apiProduct.id.toString(),
      title: apiProduct.title,
      description: apiProduct.description,
      price: apiProduct.price,
      images: apiProduct.images || [],
      brand: apiProduct.brand,
      size: (apiProduct.size as SizeType) || 'M',
      condition: (apiProduct.condition as ConditionType) || 'good',
      category: apiProduct.category?.name || 'Other',
      location: apiProduct.location || '',
      color: apiProduct.color,
      material: apiProduct.material,
      seller: {
        id: sellerData.id,
        email: sellerData.email,
        avatar: sellerData.avatar,
        bio: sellerData.bio,
        location: sellerData.location,
        verified: sellerData.verified,
        verifiedSeller: sellerData.verifiedSeller,
        responseTime: sellerData.responseTime,
        memberSince: new Date(sellerData.createdAt),
        itemsForSale: 'itemsOnSale' in sellerData ? sellerData.itemsOnSale : 0,
        itemsSold: 'itemsSold' in sellerData ? sellerData.itemsSold : 0,
      },
      createdAt: new Date(apiProduct.createdAt),
    };
  }, [apiProduct]);

  // Build item details table
  const itemDetails: ItemDetail[] = useMemo(() => {
    if (!product) return [];

    return [
      { label: 'Brend', value: product.brand || 'N/A' },
      { label: 'Veličina', value: product.size },
      {
        label: 'Stanje',
        value:
          product.condition.replace('-', ' ').charAt(0).toUpperCase() +
          product.condition.slice(1).replace('-', ' '),
      },
      { label: 'Boja', value: product.color || 'N/A' },
      ...(product.material
        ? [{ label: 'Materijal', value: product.material }]
        : []),
      { label: 'Lokacija', value: product.location },
      { label: 'Objavljeno', value: product.createdAt.toLocaleDateString('sr-RS') },
    ];
  }, [product]);

  // Get similar products from the same category (using mock for now)
  const similarProducts: ProductType[] = useMemo(() => {
    if (!product) return [];
    return mockProducts.filter(
      (p) => p.category === product.category && p.id !== product.id
    );
  }, [product]);

  // Get reviews and review summary for this product (using mock for now)
  const productReviews = useMemo(() => {
    if (!product) return [];
    return mockReviews[product.id] || [];
  }, [product]);

  const reviewSummary = useMemo(() => {
    if (!product) return undefined;
    return mockReviewSummaries[product.id];
  }, [product]);

  // View count for the product
  const viewCount = useMemo(() => {
    if (!product) return 0;
    return mockViewCounts[product.id] || 0;
  }, [product]);

  return {
    // Data
    product,
    itemDetails,
    similarProducts,
    productReviews,
    reviewSummary,
    viewCount,
    shippingOptions: mockShippingOptions,

    // State
    isLoading,
    hasSellerData: !!product,
  };
}
