"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "@/components/atoms/Icon";

export interface FilterChipProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  onRemove?: () => void;
  active?: boolean;
}

/**
 * FilterChip Component - Atomic Design: Molecule
 *
 * Dismissible chip for active filters
 * Shows below search bar when filters are applied
 *
 * @example
 * ```tsx
 * <FilterChip
 *   label="Veličina: M"
 *   onRemove={() => removeFilter('size')}
 * />
 * ```
 */
const FilterChip = React.forwardRef<HTMLDivElement, FilterChipProps>(
  ({ className, label, onRemove, active = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm",
          "transition-colors",
          active
            ? "bg-primary/10 text-primary border border-primary/20"
            : "bg-background text-text-secondary border border-border",
          className
        )}
        {...props}
      >
        <span className="font-medium">{label}</span>
        {onRemove && (
          <button
            onClick={onRemove}
            className={cn(
              "p-0.5 rounded-full hover:bg-primary/20 transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
            )}
            aria-label={`Ukloni filter: ${label}`}
          >
            <X size={14} />
          </button>
        )}
      </div>
    );
  }
);

FilterChip.displayName = "FilterChip";

/**
 * FilterChipGroup - Container for multiple filter chips
 */
interface FilterChipGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  onClearAll?: () => void;
}

const FilterChipGroup = React.forwardRef<HTMLDivElement, FilterChipGroupProps>(
  ({ className, children, onClearAll, ...props }, ref) => {
    const hasChildren = React.Children.count(children) > 0;

    if (!hasChildren) return null;

    return (
      <div
        ref={ref}
        className={cn("flex items-center gap-2 flex-wrap", className)}
        {...props}
      >
        {children}
        {onClearAll && (
          <button
            onClick={onClearAll}
            className="text-sm text-primary hover:underline font-medium"
          >
            Obriši sve
          </button>
        )}
      </div>
    );
  }
);

FilterChipGroup.displayName = "FilterChipGroup";

export { FilterChip, FilterChipGroup };
