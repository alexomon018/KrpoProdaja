"use client";

import * as React from "react";
import { Header, BottomNavigation, ProductGrid, FilterPanel } from "@/components/organisms";
import { FilterChip, FilterChipGroup } from "@/components/molecules";
import type { FilterOptions } from "@/components/organisms";
import { mockProducts, mockUsers } from "@/lib/mockData";
import type { ProductType } from "@/lib/types";

export default function HomePage() {
  const [filters, setFilters] = React.useState<FilterOptions>({});
  const [isFilterPanelOpen, setIsFilterPanelOpen] = React.useState(false);
  const [products, setProducts] = React.useState<ProductType[]>(mockProducts);

  // Mock user (logged in)
  const currentUser = {
    username: mockUsers[0].username,
    avatar: mockUsers[0].avatar,
  };

  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
    // TODO: Implement search logic
  };

  const handleFavoriteClick = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, isFavorite: !p.isFavorite } : p
      )
    );
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
  const activeFilterCount = Object.keys(filters).filter(
    (key) => {
      const value = filters[key as keyof FilterOptions];
      return value !== undefined && (Array.isArray(value) ? value.length > 0 : true);
    }
  ).length;

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      {/* Header */}
      <Header
        showSearch
        onFilterClick={() => setIsFilterPanelOpen(true)}
        onSearch={handleSearch}
        user={currentUser}
        notificationCount={3}
      />

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
                        const newSizes = filters.sizes?.filter((s) => s !== size);
                        setFilters({ ...filters, sizes: newSizes });
                      }}
                    />
                  ))}
                  {filters.brands?.map((brand) => (
                    <FilterChip
                      key={brand}
                      label={`Brend: ${brand}`}
                      onRemove={() => {
                        const newBrands = filters.brands?.filter((b) => b !== brand);
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
        onClose={() => setIsFilterPanelOpen(false)}
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />
    </div>
  );
}
