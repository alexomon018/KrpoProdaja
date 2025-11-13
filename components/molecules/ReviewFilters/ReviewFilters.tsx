"use client";

import * as React from "react";
import cn from "@/lib/utils";
import { ChevronDown } from "@/components/atoms/Icon/Icon";

export interface ReviewFiltersProps extends React.HTMLAttributes<HTMLDivElement> {
  filters: Array<{
    id: string;
    label: string;
    count: number;
  }>;
  selectedFilter: string;
  onFilterChange: (filterId: string) => void;
  sortBy: "suggested" | "newest" | "oldest";
  onSortChange: (sortBy: "suggested" | "newest" | "oldest") => void;
}

/**
 * ReviewFilters Component - Atomic Design: Molecule
 *
 * Provides filtering and sorting controls for reviews
 * Includes tab-style filters and a sort dropdown
 *
 * @example
 * ```tsx
 * <ReviewFilters
 *   filters={filterOptions}
 *   selectedFilter="all"
 *   onFilterChange={handleFilterChange}
 *   sortBy="suggested"
 *   onSortChange={handleSortChange}
 * />
 * ```
 */
export const ReviewFilters = React.forwardRef<HTMLDivElement, ReviewFiltersProps>(
  (
    {
      className,
      filters,
      selectedFilter,
      onFilterChange,
      sortBy,
      onSortChange,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn("pb-6 border-b border-stroke", className)}
        {...props}
      >
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <FilterButton
              key={filter.id}
              label={`${filter.label} (${filter.count})`}
              active={selectedFilter === filter.id}
              onClick={() => onFilterChange(filter.id)}
            />
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="flex justify-end mt-4">
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as typeof sortBy)}
              className={cn(
                "appearance-none px-4 py-2 pr-10 rounded-full border border-stroke bg-background",
                "text-sm text-primary cursor-pointer",
                "hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              )}
            >
              <option value="suggested">Suggested</option>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-secondary"
            />
          </div>
        </div>
      </div>
    );
  }
);

ReviewFilters.displayName = "ReviewFilters";

/**
 * FilterButton - Internal component for filter tabs
 */
interface FilterButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({ label, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-full text-sm font-medium transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        active
          ? "bg-primary text-white"
          : "border border-stroke bg-background text-secondary hover:border-primary hover:text-primary"
      )}
    >
      {label}
    </button>
  );
};
