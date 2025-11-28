"use client";

import { forwardRef } from "react";
import cn from "@/lib/utils";
import { ProductCard } from "@/components/molecules";
import { Typography } from "@/components/atoms";
import type { ProductType } from "@/lib/types";

export interface ProductGridProps extends React.HTMLAttributes<HTMLDivElement> {
  products: ProductType[];
  onFavoriteClick?: (productId: string) => void;
  /**
   * Show loading state
   */
  loading?: boolean;
  /**
   * Show when no products found
   */
  emptyMessage?: string;
  /**
   * Grid columns configuration
   */
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
}

/**
 * ProductGrid Component - Atomic Design: Organism
 *
 * Main product listing grid following Vinted's approach:
 * - 2 columns on mobile
 * - 3 columns on tablet
 * - 4 columns on desktop
 * - Responsive gap spacing
 * - Infinite scroll ready
 *
 * @example
 * ```tsx
 * <ProductGrid
 *   products={productList}
 *   onFavoriteClick={(id) => toggleFavorite(id)}
 * />
 * ```
 */
const ProductGrid = forwardRef<HTMLDivElement, ProductGridProps>(
  (
    {
      className,
      products,
      onFavoriteClick,
      loading = false,
      emptyMessage = "Nema dostupnih proizvoda",
      columns = { mobile: 2, tablet: 3, desktop: 4 },
      ...props
    },
    ref
  ) => {
    // Static class mapping for Tailwind purge compatibility
    const gridColsMap: Record<number, string> = {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
      5: "grid-cols-5",
      6: "grid-cols-6",
    };

    const gridColsTabletMap: Record<number, string> = {
      1: "md:grid-cols-1",
      2: "md:grid-cols-2",
      3: "md:grid-cols-3",
      4: "md:grid-cols-4",
      5: "md:grid-cols-5",
      6: "md:grid-cols-6",
    };

    const gridColsDesktopMap: Record<number, string> = {
      1: "lg:grid-cols-1",
      2: "lg:grid-cols-2",
      3: "lg:grid-cols-3",
      4: "lg:grid-cols-4",
      5: "lg:grid-cols-5",
      6: "lg:grid-cols-6",
    };

    const getGridClasses = () => {
      return cn(
        "grid gap-3 sm:gap-4",
        gridColsMap[columns.mobile || 2],
        gridColsTabletMap[columns.tablet || 3],
        gridColsDesktopMap[columns.desktop || 4]
      );
    };

    if (loading) {
      return (
        <div
          ref={ref}
          className={cn(getGridClasses(), className)}
          {...props}
        >
          {Array.from({ length: 8 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      );
    }

    if (products.length === 0) {
      return (
        <div
          ref={ref}
          className={cn("flex flex-col items-center justify-center py-16", className)}
          {...props}
        >
          <div className="text-center max-w-md">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-background flex items-center justify-center">
              <svg
                className="w-12 h-12 text-tertiary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <Typography variant="h2" className="mb-2">
              {emptyMessage}
            </Typography>
            <Typography variant="bodySmall" className="text-secondary">
              Pokušajte da promenite filter ili se vratite kasnije
            </Typography>
          </div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(getGridClasses(), className)}
        {...props}
      >
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onFavoriteClick={onFavoriteClick}
          />
        ))}
      </div>
    );
  }
);

ProductGrid.displayName = "ProductGrid";

/**
 * ProductCardSkeleton - Loading placeholder
 */
const ProductCardSkeleton = () => {
  return (
    <div className="bg-surface rounded-lg overflow-hidden animate-pulse">
      <div className="aspect-square bg-background" />
      <div className="p-3 space-y-3">
        <div className="h-6 bg-background rounded w-2/3" />
        <div className="h-4 bg-background rounded w-full" />
        <div className="flex gap-2">
          <div className="h-6 bg-background rounded w-12" />
          <div className="h-6 bg-background rounded w-16" />
        </div>
      </div>
    </div>
  );
};

export { ProductGrid, ProductCardSkeleton };
