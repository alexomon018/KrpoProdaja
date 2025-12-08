"use client";

import {
  BottomNavigation,
  ProductGrid,
  FilterPanel,
} from "@/components/organisms";
import { FilterChip, FilterChipGroup } from "@/components/molecules";
import { useHomeProducts } from "@/lib/api/hooks/useHomeProducts";
import { useFilter } from "@/providers/FilterProvider";

export function HomeContent() {
  const { isFilterPanelOpen, closeFilterPanel } = useFilter();

  const {
    products,
    filters,
    activeFilterCount,
    handleFiltersChange,
    removeFilter,
    clearAllFilters,
    removeSizeFilter,
    removeBrandFilter,
    handleFavoriteClick,
  } = useHomeProducts();

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
                      onRemove={() => removeSizeFilter(size)}
                    />
                  ))}
                  {filters.brands?.map((brand) => (
                    <FilterChip
                      key={brand}
                      label={`Brend: ${brand}`}
                      onRemove={() => removeBrandFilter(brand)}
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
