"use client";

import * as React from "react";
import cn from "@/lib/utils";
import { Button, Input, Badge, Typography } from "@/components/atoms";
import { X, SlidersHorizontal } from "@/components/atoms/Icon/Icon";
import type { SizeType } from "@/lib/types";

export interface FilterOptions {
  categories?: string[];
  priceMin?: number;
  priceMax?: number;
  sizes?: SizeType[];
  brands?: string[];
  conditions?: string[];
  location?: string;
  colors?: string[];
}

export interface FilterPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Current active filters
   */
  filters: FilterOptions;
  /**
   * Callback when filters change
   */
  onFiltersChange: (filters: FilterOptions) => void;
  /**
   * Mobile: show as slide-out panel
   */
  mobile?: boolean;
  /**
   * Is the panel open (mobile only)
   */
  isOpen?: boolean;
  /**
   * Close callback (mobile only)
   */
  onClose?: () => void;
}

/**
 * FilterPanel Component - Atomic Design: Organism
 *
 * Comprehensive filtering system following Vinted's architecture:
 * - Category tree navigation
 * - Price range slider
 * - Multi-select options
 * - Location filter
 * - Color swatches
 *
 * @example
 * ```tsx
 * <FilterPanel
 *   filters={activeFilters}
 *   onFiltersChange={(newFilters) => setFilters(newFilters)}
 * />
 * ```
 */
const FilterPanel = React.forwardRef<HTMLDivElement, FilterPanelProps>(
  (
    {
      className,
      filters,
      onFiltersChange,
      mobile = false,
      isOpen = false,
      onClose,
      ...props
    },
    ref
  ) => {
    const availableSizes: SizeType[] = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
    const availableBrands = ["Zara", "H&M", "Mango", "Reserved", "Bershka", "Pull&Bear"];
    const availableConditions = [
      { value: "new", label: "Novo sa etiketom" },
      { value: "very-good", label: "Vrlo dobro" },
      { value: "good", label: "Dobro" },
      { value: "satisfactory", label: "Zadovoljavajuće" },
    ];
    const availableColors = [
      { name: "Crna", value: "#000000" },
      { name: "Bela", value: "#FFFFFF" },
      { name: "Siva", value: "#9CA3AF" },
      { name: "Crvena", value: "#EF4444" },
      { name: "Plava", value: "#3B82F6" },
      { name: "Zelena", value: "#10B981" },
      { name: "Žuta", value: "#F59E0B" },
      { name: "Roze", value: "#EC4899" },
    ];

    const toggleSize = (size: SizeType) => {
      const currentSizes = filters.sizes || [];
      const newSizes = currentSizes.includes(size)
        ? currentSizes.filter((s) => s !== size)
        : [...currentSizes, size];
      onFiltersChange({ ...filters, sizes: newSizes });
    };

    const toggleBrand = (brand: string) => {
      const currentBrands = filters.brands || [];
      const newBrands = currentBrands.includes(brand)
        ? currentBrands.filter((b) => b !== brand)
        : [...currentBrands, brand];
      onFiltersChange({ ...filters, brands: newBrands });
    };

    const toggleCondition = (condition: string) => {
      const currentConditions = filters.conditions || [];
      const newConditions = currentConditions.includes(condition)
        ? currentConditions.filter((c) => c !== condition)
        : [...currentConditions, condition];
      onFiltersChange({ ...filters, conditions: newConditions });
    };

    const toggleColor = (color: string) => {
      const currentColors = filters.colors || [];
      const newColors = currentColors.includes(color)
        ? currentColors.filter((c) => c !== color)
        : [...currentColors, color];
      onFiltersChange({ ...filters, colors: newColors });
    };

    const clearAllFilters = () => {
      onFiltersChange({});
      onClose?.();
    };

    const panelContent = (
      <div className="space-y-6">
        {/* Header (Mobile) */}
        {mobile && (
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={20} />
              <Typography variant="h2">Filteri</Typography>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-background rounded-lg transition-colors"
              aria-label="Zatvori filtere"
            >
              <X size={24} />
            </button>
          </div>
        )}

        {/* Price Range */}
        <div>
          <Typography variant="h3" className="mb-3">
            Cena
          </Typography>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Min (RSD)"
              value={filters.priceMin || ""}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  priceMin: Number(e.target.value) || undefined,
                })
              }
            />
            <Input
              type="number"
              placeholder="Max (RSD)"
              value={filters.priceMax || ""}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  priceMax: Number(e.target.value) || undefined,
                })
              }
            />
          </div>
        </div>

        {/* Size */}
        <div>
          <Typography variant="h3" className="mb-3">
            Veličina
          </Typography>
          <div className="flex flex-wrap gap-2">
            {availableSizes.map((size) => (
              <button
                key={size}
                onClick={() => toggleSize(size)}
                className={cn(
                  "px-4 py-2 rounded-lg border-2 transition-colors min-w-touch",
                  filters.sizes?.includes(size)
                    ? "border-primary bg-primary/10 text-primary font-semibold"
                    : "border-border hover:border-text-tertiary"
                )}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Brand */}
        <div>
          <Typography variant="h3" className="mb-3">
            Brend
          </Typography>
          <div className="space-y-2">
            {availableBrands.map((brand) => (
              <label
                key={brand}
                className="flex items-center gap-2 cursor-pointer hover:bg-background p-2 rounded-lg transition-colors min-h-touch"
              >
                <input
                  type="checkbox"
                  checked={filters.brands?.includes(brand) || false}
                  onChange={() => toggleBrand(brand)}
                  className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                />
                <Typography variant="bodySmall">{brand}</Typography>
              </label>
            ))}
          </div>
        </div>

        {/* Condition */}
        <div>
          <Typography variant="h3" className="mb-3">
            Stanje
          </Typography>
          <div className="space-y-2">
            {availableConditions.map((condition) => (
              <label
                key={condition.value}
                className="flex items-center gap-2 cursor-pointer hover:bg-background p-2 rounded-lg transition-colors min-h-touch"
              >
                <input
                  type="checkbox"
                  checked={filters.conditions?.includes(condition.value) || false}
                  onChange={() => toggleCondition(condition.value)}
                  className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                />
                <Typography variant="bodySmall">{condition.label}</Typography>
              </label>
            ))}
          </div>
        </div>

        {/* Color */}
        <div>
          <Typography variant="h3" className="mb-3">
            Boja
          </Typography>
          <div className="flex flex-wrap gap-3">
            {availableColors.map((color) => (
              <button
                key={color.value}
                onClick={() => toggleColor(color.value)}
                className={cn(
                  "w-10 h-10 rounded-full border-2 transition-all touch-target",
                  filters.colors?.includes(color.value)
                    ? "border-primary scale-110 ring-2 ring-primary ring-offset-2"
                    : "border-border hover:scale-105"
                )}
                style={{ backgroundColor: color.value }}
                title={color.name}
                aria-label={color.name}
              />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-border space-y-2">
          <Button variant="primary" fullWidth onClick={onClose}>
            Primeni filtere
          </Button>
          <Button variant="ghost" fullWidth onClick={clearAllFilters}>
            Obriši sve filtere
          </Button>
        </div>
      </div>
    );

    if (mobile) {
      return (
        <>
          {/* Backdrop */}
          {isOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40"
              onClick={onClose}
              aria-hidden="true"
            />
          )}

          {/* Slide-out Panel */}
          <div
            ref={ref}
            className={cn(
              "fixed top-0 right-0 bottom-0 w-full max-w-md bg-surface z-50",
              "transform transition-transform duration-300 ease-in-out",
              "overflow-y-auto p-6",
              isOpen ? "translate-x-0" : "translate-x-full",
              className
            )}
            {...props}
          >
            {panelContent}
          </div>
        </>
      );
    }

    return (
      <div
        ref={ref}
        className={cn("bg-surface rounded-lg p-6 border border-border", className)}
        {...props}
      >
        {panelContent}
      </div>
    );
  }
);

FilterPanel.displayName = "FilterPanel";

export { FilterPanel };
