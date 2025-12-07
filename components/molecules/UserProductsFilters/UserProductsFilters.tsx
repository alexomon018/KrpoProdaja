"use client";

import cn from "@/lib/utils";
import { Button, Icon, Typography, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/atoms";

export interface UserProductsFiltersProps {
  /**
   * Current status filter value
   */
  status: string;
  /**
   * Current sort value
   */
  sortBy: string;
  /**
   * Callback when status changes
   */
  onStatusChange: (status: string) => void;
  /**
   * Callback when sort changes
   */
  onSortChange: (sortBy: string) => void;
  /**
   * Whether to use inline styling (for embedded use)
   * @default false
   */
  inline?: boolean;
}

/**
 * UserProductsFilters Component - Atomic Design: Molecule
 *
 * Filters and sorting controls for user products list
 */
export function UserProductsFilters({
  status,
  sortBy,
  onStatusChange,
  onSortChange,
  inline = false,
}: UserProductsFiltersProps) {
  return (
    <div className={inline ? "space-y-4" : "mb-6 space-y-4"}>
      {/* Status Tabs */}
      <div
        className={cn(
          "flex gap-2 overflow-x-auto pb-2",
          inline && "-mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide snap-x snap-mandatory"
        )}
      >
        <Button
          variant={status === "active" ? "primary" : "secondary"}
          size="sm"
          onClick={() => onStatusChange("active")}
          className={cn(inline && "shrink-0 snap-start transition-all duration-200 min-w-[100px] md:min-w-0")}
        >
          Aktivni
        </Button>
        <Button
          variant={status === "reserved" ? "primary" : "secondary"}
          size="sm"
          onClick={() => onStatusChange("reserved")}
          className={cn(inline && "shrink-0 snap-start transition-all duration-200 min-w-[100px] md:min-w-0")}
        >
          Rezervisani
        </Button>
        <Button
          variant={status === "sold" ? "primary" : "secondary"}
          size="sm"
          onClick={() => onStatusChange("sold")}
          className={cn(inline && "shrink-0 snap-start transition-all duration-200 min-w-[100px] md:min-w-0")}
        >
          Prodati
        </Button>
        <Button
          variant={status === "all" ? "primary" : "secondary"}
          size="sm"
          onClick={() => onStatusChange("all")}
          className={cn(inline && "shrink-0 snap-start transition-all duration-200 min-w-[100px] md:min-w-0")}
        >
          Svi
        </Button>
      </div>

      {/* Sort Dropdown */}
      <div
        className={cn(
          "flex items-center gap-2",
          inline && "flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 bg-background/50 rounded-lg p-3 border border-border/50"
        )}
      >
        {inline && (
          <div className="flex items-center gap-2">
            <Icon name="ArrowUpDown" size={16} className="text-tertiary" />
            <Typography variant="bodySmall" className="text-secondary font-medium">
              Sortiranje
            </Typography>
          </div>
        )}
        {!inline && (
          <Typography variant="bodySmall" className="text-secondary shrink-0">
            Sortiranje:
          </Typography>
        )}
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className={cn(inline ? "w-full sm:w-[180px] h-10 bg-surface" : "w-[180px]")}>
            <SelectValue placeholder="Izaberite..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Najnoviji</SelectItem>
            <SelectItem value="oldest">Najstariji</SelectItem>
            <SelectItem value="price-asc">Cena: Rastuća</SelectItem>
            <SelectItem value="price-desc">Cena: Opadajuća</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
