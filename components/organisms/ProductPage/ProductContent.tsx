"use client";

import { useProduct } from "@/lib/api/hooks/useProducts";
import { ProductDetailsHeader } from "@/components/organisms/ProductDetailsHeader";
import {
  ProductDescription,
  type ItemDetail,
} from "@/components/molecules/ProductDescription/ProductDescription";
import { ProductMeta } from "@/components/molecules/ProductMeta/ProductMeta";
import {
  ShippingOptions,
  type ShippingOption,
} from "@/components/molecules/ShippingOptions/ShippingOptions";
import { ClickableSellerInfo } from "@/components/molecules/SellerInfo/ClickableSellerInfo";
import { SimilarItems } from "@/components/organisms/SimilarItems";
import { ProductReviews } from "@/components/organisms/ProductReviews/ProductReviews";
import { ConditionBadge } from "@/components/atoms/ConditionBadge";
import { formatPrice } from "@/lib/utils";
import { mockProducts, mockReviews, mockReviewSummaries } from "@/lib/mockData";
import type { SizeType, ConditionType } from "@/lib/types";

interface ProductContentProps {
  productId: string;
}

// Mock view count data
const mockViewCounts: Record<string, number> = {
  "1": 247,
  "2": 156,
  "3": 432,
  "4": 198,
  "5": 89,
  "6": 567,
  "7": 123,
  "8": 345,
};

// Mock shipping options
const mockShippingOptions: ShippingOption[] = [
  {
    id: "1",
    name: "Standard Shipping",
    price: 300,
    estimatedDays: "3-5 business days",
    icon: "truck",
  },
  {
    id: "2",
    name: "Express Shipping",
    price: 600,
    estimatedDays: "1-2 business days",
    icon: "package",
  },
  {
    id: "3",
    name: "Local Pickup",
    price: 0,
    estimatedDays: "Available immediately",
    icon: "mappin",
  },
];

export function ProductContent({ productId }: ProductContentProps) {
  // Use the product hook - will use server-side primed data
  const { data: apiProduct } = useProduct(productId);

  if (!apiProduct) {
    return <div>Loading...</div>;
  }

  // Use seller data if available, otherwise fall back to user
  const sellerData = apiProduct.seller || apiProduct.user;

  if (!sellerData) {
    return <div>Seller information not available</div>;
  }

  const product = {
    id: apiProduct.id.toString(),
    title: apiProduct.title,
    description: apiProduct.description,
    price: apiProduct.price,
    images: apiProduct.images || [],
    brand: apiProduct.brand,
    size: (apiProduct.size as SizeType) || "M",
    condition: (apiProduct.condition as ConditionType) || "good",
    category: apiProduct.category?.name || "Other",
    location: apiProduct.location || "",
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
      itemsForSale: "itemsOnSale" in sellerData ? sellerData.itemsOnSale : 0,
      itemsSold: "itemsSold" in sellerData ? sellerData.itemsSold : 0,
    },
    createdAt: new Date(apiProduct.createdAt),
  };

  // Build item details table
  const itemDetails: ItemDetail[] = [
    { label: "Brand", value: product.brand || "N/A" },
    { label: "Size", value: product.size },
    {
      label: "Condition",
      value:
        product.condition.replace("-", " ").charAt(0).toUpperCase() +
        product.condition.slice(1).replace("-", " "),
    },
    { label: "Color", value: product.color || "N/A" },
    ...(product.material
      ? [{ label: "Material", value: product.material }]
      : []),
    { label: "Location", value: product.location },
    { label: "Posted", value: product.createdAt.toLocaleDateString("sr-RS") },
  ];

  // Get similar products from the same category (using mock for now)
  const similarProducts = mockProducts.filter(
    (p) => p.category === product.category && p.id !== product.id
  );

  // Get reviews and review summary for this product (using mock for now)
  const productReviews = mockReviews[product.id] || [];
  const reviewSummary = mockReviewSummaries[product.id];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 max-w-7xl">
        {/* Main Grid - Image Left, Info & Seller Right */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(400px,500px)] gap-6 sm:gap-8 lg:gap-12">
          {/* Left Column - Image Gallery */}
          <div className="relative w-full">
            <ProductDetailsHeader
              title={product.title}
              price={product.price}
              images={product.images}
              condition={product.condition}
              size={product.size}
              category={product.category}
            />
          </div>

          {/* Right Column - Product Info, Actions, and Seller */}
          <div className="space-y-4 sm:space-y-6">
            <div className="lg:top-4 space-y-4 sm:space-y-6">
              {/* Category */}
              {product.category && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {product.category}
                </div>
              )}

              {/* Title */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {product.title}
                </h1>

                {/* Price */}
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-3xl sm:text-4xl font-bold text-primary-600 dark:text-primary-400">
                    {formatPrice(product.price)}
                  </span>
                </div>

                {/* Condition and Size Badges */}
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <ConditionBadge condition={product.condition} />
                  {product.size && (
                    <div className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300">
                      Size: {product.size}
                    </div>
                  )}
                </div>
              </div>

              {/* Seller Info Card */}
              <ClickableSellerInfo seller={product.seller} />

              {/* Product Meta */}
              <ProductMeta
                viewCount={mockViewCounts[product.id] || 0}
                productId={product.id}
              />
            </div>
          </div>
        </div>

        {/* Full Width Content Below */}
        <div className="mt-12 space-y-8">
          {/* Description and Details */}
          <ProductDescription
            description={product.description || "No description available."}
            details={itemDetails}
          />

          {/* Shipping Options */}
          <ShippingOptions
            options={mockShippingOptions}
            location={product.location}
          />

          {/* Reviews Section */}
          {reviewSummary && productReviews.length > 0 && (
            <ProductReviews reviews={productReviews} summary={reviewSummary} />
          )}

          {/* Similar Items */}
          {similarProducts.length > 0 && (
            <SimilarItems
              products={similarProducts}
              currentProductId={product.id}
            />
          )}
        </div>
      </div>
    </div>
  );
}
