/**
 * useProductCreation Hook
 * Custom hook for managing product creation form with image upload, validation, and submission
 */

'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCreateProduct } from './useProducts';
import { useBrands, useCategories } from './index';
import { useRequireAuth } from '@/providers/AuthProvider';
import { uploadService } from '@/lib/api';
import { CONDITION_OPTIONS } from '@/constants';
import type { SizeType, ConditionType } from '@/lib/types';
import type { ProductCondition } from '@/lib/api';

export interface ProductFormData {
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  category?: string;
  brand?: string;
  size: SizeType;
  condition?: string; // Stores the Serbian name from the combobox
  color?: string; // Stores the Serbian name from the combobox
  age?: string; // Stores the era/age from the combobox
  material?: string;
  location: string;
}

// Map local condition types to API condition types
const mapConditionToApi = (condition: ConditionType): ProductCondition => {
  const mapping: Record<ConditionType, ProductCondition> = {
    new: 'new',
    'very-good': 'very-good',
    good: 'good',
    satisfactory: 'satisfactory',
  };
  return mapping[condition];
};

export function useProductCreation() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { requireAuth } = useRequireAuth();
  const [imageUrls, setImageUrls] = React.useState<string[]>([]);
  const [imageFiles, setImageFiles] = React.useState<File[]>([]);
  const [formError, setFormError] = React.useState<string | null>(null);

  // Fetch brands and categories - will use server-side prefetched data
  const { data: brandsResponse } = useBrands();
  const brands = brandsResponse?.brands || [];

  const { data: categoriesResponse } = useCategories();
  const categories = categoriesResponse?.categories || [];

  // Extract query parameters for pre-filling form
  const titleParam = searchParams.get('title');
  const priceParam = searchParams.get('price');
  const categoryParam = searchParams.get('category');
  const brandParam = searchParams.get('brand');
  const locationParam = searchParams.get('location');

  const methods = useForm<ProductFormData>({
    defaultValues: {
      title: titleParam || '',
      description: '',
      price: priceParam ? Number(priceParam) : 0,
      category: categoryParam || '',
      brand: brandParam || '',
      location: locationParam || 'Beograd',
    },
    mode: 'onBlur',
  });

  const createProductMutation = useCreateProduct();

  const handleProductSubmission = async (data: ProductFormData) => {
    setFormError(null);

    // Validate that at least one image is selected
    if (imageFiles.length === 0 && imageUrls.length === 0) {
      setFormError('Molimo dodajte bar jednu sliku proizvoda');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      // Upload images first if there are any files
      let uploadedImageUrls = [...imageUrls];

      if (imageFiles.length > 0) {
        console.log('Uploading images:', imageFiles.length);
        uploadedImageUrls = await uploadService.uploadImages(imageFiles);
        console.log('Upload result:', uploadedImageUrls);

        // Filter out any null/undefined URLs
        uploadedImageUrls = uploadedImageUrls.filter(
          (url) => url != null && url !== ''
        );

        if (uploadedImageUrls.length === 0) {
          throw new Error(
            'Upload nije uspeo - nisu primljene URL adrese slika'
          );
        }
      }

      // Find the category ID from the selected category name
      const selectedCategory = categories.find(
        (cat) => cat.name.toLowerCase() === data.category?.toLowerCase()
      );

      if (!selectedCategory) {
        setFormError('Molimo izaberite kategoriju proizvoda');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      // Find the condition value from the selected condition name
      const selectedCondition = CONDITION_OPTIONS.find(
        (cond) => cond.name.toLowerCase() === data.condition?.toLowerCase()
      );

      if (!selectedCondition) {
        setFormError('Molimo izaberite stanje proizvoda');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const productData = {
        title: data.title,
        description: data.description || undefined,
        price: Number(data.price),
        categoryId: selectedCategory.id,
        condition: mapConditionToApi(selectedCondition.id as ConditionType),
        size: data.size,
        brand: data.brand || undefined,
        color: data.color || undefined,
        location: data.location,
        images: uploadedImageUrls,
      };

      const response = await createProductMutation.mutateAsync(productData);

      if (response.product?.id) {
        router.push(`/products/${response.product.id}`);
      } else {
        console.error('Product ID is undefined in response:', response);
        setFormError(
          'Proizvod je kreiran, ali ID nije pronađen u odgovoru servera.'
        );
      }
    } catch (error) {
      console.error('Failed to create product:', error);
      setFormError(
        error instanceof Error
          ? error.message
          : 'Greška pri kreiranju proizvoda. Pokušajte ponovo.'
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    // Check if user is authenticated before proceeding
    // If not authenticated, requireAuth will show the auth modal and return false
    requireAuth(async () => {
      await handleProductSubmission(data);
    });
  };

  const handleReset = () => {
    methods.reset();
    setImageUrls([]);
    setImageFiles([]);
    setFormError(null);
  };

  return {
    // Form methods
    methods,
    onSubmit,
    handleReset,

    // Image handling
    imageUrls,
    imageFiles,
    setImageFiles,

    // Data
    brands,
    categories,

    // State
    formError,
    isSubmitting: createProductMutation.isPending,
  };
}
