"use client";

import { useProductDetails } from "@/lib/api/hooks/useProductDetails";
import { ProductDetailsHeader } from "@/components/organisms/ProductDetailsHeader";
import { ProductDescription } from "@/components/molecules/ProductDescription/ProductDescription";
import { ProductMeta } from "@/components/molecules/ProductMeta/ProductMeta";
import { ShippingOptions } from "@/components/molecules/ShippingOptions/ShippingOptions";
import { ClickableSellerInfo } from "@/components/molecules/SellerInfo/ClickableSellerInfo";
import { SimilarItems } from "@/components/organisms/SimilarItems";
import { ProductReviews } from "@/components/organisms/ProductReviews/ProductReviews";
import { ConditionBadge } from "@/components/atoms/ConditionBadge";
import { formatPrice } from "@/lib/utils";

interface ProductContentProps {
  productId: string;
}

export function ProductContent({ productId }: ProductContentProps) {
  const {
    product,
    itemDetails,
    similarProducts,
    productReviews,
    reviewSummary,
    viewCount,
    shippingOptions,
    isLoading,
    hasSellerData,
  } = useProductDetails({ productId });

  if (isLoading || !product) {
    return <div>Učitavanje...</div>;
  }

  if (!hasSellerData) {
    return <div>Informacije o prodavcu nisu dostupne</div>;
  }

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
                      Veličina: {product.size}
                    </div>
                  )}
                </div>
              </div>

              {/* Seller Info Card */}
              <ClickableSellerInfo seller={product.seller} />

              {/* Product Meta */}
              <ProductMeta
                viewCount={viewCount}
                productId={product.id}
              />
            </div>
          </div>
        </div>

        {/* Full Width Content Below */}
        <div className="mt-12 space-y-8">
          {/* Description and Details */}
          <ProductDescription
            description={product.description || "Nema dostupnog opisa."}
            details={itemDetails}
          />

          {/* Shipping Options */}
          <ShippingOptions
            options={shippingOptions}
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
