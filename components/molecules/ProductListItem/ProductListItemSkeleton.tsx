import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton loading state for ProductListItem
 * Mimics the exact layout of ProductListItem for smooth transitions
 */
export function ProductListItemSkeleton() {
  return (
    <div className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-surface border border-border rounded-lg">
      {/* Image skeleton */}
      <Skeleton className="w-20 h-20 sm:w-24 sm:h-24 rounded-md shrink-0" />

      {/* Content skeleton */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
        <div className="space-y-2">
          {/* Title skeleton */}
          <Skeleton className="h-5 w-3/4" />

          {/* Meta info skeleton */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>

        {/* Price skeleton */}
        <Skeleton className="h-6 w-24 mt-2" />
      </div>
    </div>
  );
}
