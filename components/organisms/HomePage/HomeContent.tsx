"use client";

import { useState } from "react";
import {
  BottomNavigation,
  ProductGrid,
  FilterPanel,
} from "@/components/organisms";
import { FilterChip, FilterChipGroup } from "@/components/molecules";
import { useProducts } from "@/lib/api/hooks/useProducts";
import { useFilter } from "@/providers/FilterProvider";
import type { FilterOptions } from "@/components/organisms";
import type { ProductType, SizeType, ConditionType } from "@/lib/types";
import type { ApiProduct } from "@/lib/api";

// Map API product to ProductType
function mapApiProductToProductType(apiProduct: ApiProduct): ProductType {
  // API may return either user or seller object - check both
  const sellerData = apiProduct.seller || apiProduct.user;
  const sellerId =
    sellerData?.id || apiProduct.userId?.toString() || "unknown";
  const sellerEmail =
    sellerData?.email || `user${apiProduct.userId || "unknown"}@placeholder.com`;

  return {
    id: apiProduct.id.toString(),
    title: apiProduct.title,
    price: apiProduct.price,
    images: apiProduct.images || [],
    brand: apiProduct.brand,
    size: (apiProduct.size as SizeType) || "M",
    condition: (apiProduct.condition as ConditionType) || "good",
    category: apiProduct.category?.name || "Other",
    location: apiProduct.location || "",
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

export function HomeContent() {
  const [filters, setFilters] = useState<FilterOptions>({});
  const { isFilterPanelOpen, closeFilterPanel } = useFilter();

  // Fetch products using React Query - will use prefetched data from server
  const { data: productsResponse } = useProducts();

  // Map API products to ProductType
  const products: ProductType[] =
    productsResponse?.data?.map(mapApiProductToProductType) || [];

  const handleFavoriteClick = (productId: string) => {
    // TODO: Implement favorite toggle with API mutation
    console.log("Toggle favorite for product:", productId);
  };

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

  // Calculate active filter count
  const activeFilterCount = Object.keys(filters).filter((key) => {
    const value = filters[key as keyof FilterOptions];
    return (
      value !== undefined && (Array.isArray(value) ? value.length > 0 : true)
    );
  }).length;

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Desktop: Sidebar Filters */}
          <aside className="hidden lg:block w-80 shrink-0">
            <div className="sticky top-24">
              <FilterPanel
                filters={filters}
                onFiltersChange={handleFiltersChange}
              />
            </div>
          </aside>

          {/* Product Feed */}
          <div className="flex-1 min-w-0">
            {/* Active Filters */}
            {activeFilterCount > 0 && (
              <div className="mb-4">
                <FilterChipGroup onClearAll={clearAllFilters}>
                  {filters.sizes?.map((size) => (
                    <FilterChip
                      key={size}
                      label={`Veličina: ${size}`}
                      onRemove={() => {
                        const newSizes = filters.sizes?.filter(
                          (s) => s !== size
                        );
                        setFilters({ ...filters, sizes: newSizes });
                      }}
                    />
                  ))}
                  {filters.brands?.map((brand) => (
                    <FilterChip
                      key={brand}
                      label={`Brend: ${brand}`}
                      onRemove={() => {
                        const newBrands = filters.brands?.filter(
                          (b) => b !== brand
                        );
                        setFilters({ ...filters, brands: newBrands });
                      }}
                    />
                  ))}
                  {filters.priceMin && (
                    <FilterChip
                      label={`Min: ${filters.priceMin} RSD`}
                      onRemove={() => removeFilter("priceMin")}
                    />
                  )}
                  {filters.priceMax && (
                    <FilterChip
                      label={`Max: ${filters.priceMax} RSD`}
                      onRemove={() => removeFilter("priceMax")}
                    />
                  )}
                </FilterChipGroup>
              </div>
            )}

            {/* Product Grid */}
            <ProductGrid
              products={products}
              onFavoriteClick={handleFavoriteClick}
            />
          </div>
        </div>
      </main>

      {/* Mobile: Bottom Navigation */}
      <BottomNavigation messageCount={2} />

      {/* Mobile: Filter Panel (Slide-out) */}
      <FilterPanel
        mobile
        isOpen={isFilterPanelOpen}
        onClose={closeFilterPanel}
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />
    </div>
  );
}
