"use client";

import cn from "@/lib/utils";
import { Button, Icon, Loader, Typography } from "@/components/atoms";
import { ProductListItem, ProductListItemSkeleton } from "@/components/molecules";
import type { ApiProduct } from "@/lib/api/types";

export interface UserProductsListProps {
  /**
   * Array of products to display
   */
  products: ApiProduct[];
  /**
   * Whether the list is loading
   */
  isLoading: boolean;
  /**
   * Whether this is the current user's own products
   */
  isOwnProducts: boolean;
  /**
   * Current status filter (for empty state message)
   */
  status: string;
  /**
   * Callback when delete is clicked
   */
  onDelete?: (productId: string) => void;
  /**
   * Callback when status change is clicked
   */
  onStatusChange?: (productId: string, newStatus: "active" | "reserved" | "sold") => void;
  /**
   * Whether to use inline styling
   */
  inline?: boolean;
  /**
   * Whether there are more pages to load
   */
  hasNextPage?: boolean;
  /**
   * Whether next page is being fetched
   */
  isFetchingNextPage?: boolean;
  /**
   * Callback to fetch next page
   */
  onFetchNextPage?: () => void;
  /**
   * Ref for infinite scroll trigger
   */
  loadMoreRef?: React.RefObject<HTMLDivElement | null>;
}

/**
 * UserProductsList Component - Atomic Design: Molecule
 *
 * Displays list of user products with loading states and pagination
 */
export function UserProductsList({
  products,
  isLoading,
  isOwnProducts,
  status,
  onDelete,
  onStatusChange,
  inline = false,
  hasNextPage,
  isFetchingNextPage,
  onFetchNextPage,
  loadMoreRef,
}: UserProductsListProps) {
  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <ProductListItemSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Empty state
  if (products.length === 0) {
    const emptyMessages = {
      active: "Korisnik trenutno nema aktivnih oglasa",
      reserved: "Korisnik trenutno nema rezervisanih oglasa",
      sold: "Korisnik trenutno nema prodatih oglasa",
      all: "Korisnik trenutno nema oglasa",
    };

    const message = emptyMessages[status as keyof typeof emptyMessages] || emptyMessages.all;

    if (inline) {
      return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <div className="w-16 h-16 mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon name="Package" size={32} className="text-primary/50" />
          </div>
          <Typography variant="h4" className="mb-2">
            Nema oglasa
          </Typography>
          <Typography variant="body" className="text-secondary max-w-xs">
            {message}
          </Typography>
        </div>
      );
    }

    return (
      <div className="text-center py-12">
        <Typography variant="body" className="text-secondary">
          {message}
        </Typography>
      </div>
    );
  }

  // Products list
  return (
    <>
      <div className="flex flex-col gap-4">
        {products.map((product) => (
          <ProductListItem
            key={product.id}
            product={product}
            isOwnProduct={isOwnProducts}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
          />
        ))}
      </div>

      {/* Infinite Scroll Trigger & Load More Button */}
      {hasNextPage && (
        <div
          ref={loadMoreRef}
          className={cn(inline ? "flex justify-center pt-4" : "mt-8 flex justify-center")}
        >
          {isFetchingNextPage ? (
            <div className="flex items-center gap-2 text-secondary">
              <Loader className={cn(inline ? "h-5 w-5 animate-spin" : "h-6 w-6 animate-spin")} />
              <Typography variant={inline ? "bodySmall" : "body"}>Učitavanje...</Typography>
            </div>
          ) : (
            <Button
              variant={inline ? "ghost" : "secondary"}
              size={inline ? "sm" : undefined}
              onClick={onFetchNextPage}
            >
              {inline ? "Učitaj još oglasa" : "Učitaj još"}
            </Button>
          )}
        </div>
      )}
    </>
  );
}
