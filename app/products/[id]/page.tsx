import React from 'react';
import { notFound } from 'next/navigation';
import { mockProducts } from '@/lib/mockData';
import { ProductDetailsHeader } from '@/components/organisms/ProductDetailsHeader';
import { ProductDescription, type ItemDetail } from '@/components/molecules/ProductDescription';
import { ProductActions } from '@/components/molecules/ProductActions';
import { ProductMeta } from '@/components/molecules/ProductMeta';
import { ShippingOptions, type ShippingOption } from '@/components/molecules/ShippingOptions';
import { ClickableSellerInfo } from '@/components/molecules/SellerInfo/ClickableSellerInfo';
import { SimilarItems } from '@/components/organisms/SimilarItems';

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
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
    name: 'Standard Shipping',
    price: 300,
    estimatedDays: '3-5 business days',
    icon: 'truck',
  },
  {
    id: '2',
    name: 'Express Shipping',
    price: 600,
    estimatedDays: '1-2 business days',
    icon: 'package',
  },
  {
    id: '3',
    name: 'Local Pickup',
    price: 0,
    estimatedDays: 'Available immediately',
    icon: 'mappin',
  },
];

export default async function ProductPage({ params }: ProductPageProps) {
  // Await params in Next.js 15
  const { id } = await params;

  // Find the product by ID
  const product = mockProducts.find((p) => p.id === id);

  // If product not found, show 404
  if (!product) {
    notFound();
  }

  // Build item details table
  const itemDetails: ItemDetail[] = [
    { label: 'Brand', value: product.brand || 'N/A' },
    { label: 'Size', value: product.size },
    { label: 'Condition', value: product.condition.replace('-', ' ').charAt(0).toUpperCase() + product.condition.slice(1).replace('-', ' ') },
    { label: 'Color', value: product.color || 'N/A' },
    ...(product.material ? [{ label: 'Material', value: product.material }] : []),
    { label: 'Location', value: product.location },
    { label: 'Posted', value: product.createdAt.toLocaleDateString('sr-RS') },
  ];

  // Get similar products from the same category
  const similarProducts = mockProducts.filter(
    (p) => p.category === product.category && p.id !== product.id
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Product Header with Images and Main Info */}
        <ProductDetailsHeader
          title={product.title}
          price={product.price}
          images={product.images}
          condition={product.condition}
          size={product.size}
          category={product.category}
          className="mb-8"
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Product Meta (Share, Report, View Count) */}
            <ProductMeta
              viewCount={mockViewCounts[product.id] || 0}
              productId={product.id}
            />

            {/* Description and Details */}
            <ProductDescription
              description={product.description || 'No description available.'}
              details={itemDetails}
            />

            {/* Shipping Options */}
            <ShippingOptions
              options={mockShippingOptions}
              location={product.location}
            />

            {/* Similar Items */}
            {similarProducts.length > 0 && (
              <SimilarItems
                products={similarProducts}
                currentProductId={product.id}
              />
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Action Buttons */}
            <div className="sticky top-4 space-y-6">
              <ProductActions
                sellerId={product.seller.id}
                productId={product.id}
              />

              {/* Seller Info Card */}
              <ClickableSellerInfo seller={product.seller} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Force dynamic rendering to avoid prerendering errors with client components
export const dynamic = 'force-dynamic';
