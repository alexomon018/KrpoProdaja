"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useQueryStates, parseAsString, parseAsInteger } from "nuqs";
import cn from "@/lib/utils";
import { Container } from "@/components/atoms/Container/Container";
import { Button } from "@/components/atoms/Button/Button";
import { Icon, Loader } from "@/components/atoms/Icon/Icon";
import {
  Typography,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms";
import { ProductListItem, ProductListItemSkeleton } from "@/components/molecules";
import { useUserProducts, useUserProfile } from "@/lib/api/hooks/useUsers";
import type { ApiProduct, UserProductFilters } from "@/lib/api/types";

interface UserProductsContentProps {
  userId: string;
  /**
   * Whether to show the header with back button
   * @default true
   */
  showHeader?: boolean;
  /**
   * Whether to use inline styling (for embedded use in profile)
   * @default false
   */
  inline?: boolean;
}

export function UserProductsContent({
  userId,
  showHeader = true,
  inline = false,
}: UserProductsContentProps) {
  const router = useRouter();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // URL query params using nuqs
  const [queryParams, setQueryParams] = useQueryStates({
    status: parseAsString.withDefault("active"),
    categoryId: parseAsString,
    minPrice: parseAsInteger,
    maxPrice: parseAsInteger,
    condition: parseAsString,
    sortBy: parseAsString.withDefault("newest"),
  });

  // Build filters from query params
  const filters: Omit<UserProductFilters, 'page' | 'limit'> = {
    status: queryParams.status as UserProductFilters['status'],
    categoryId: queryParams.categoryId || undefined,
    minPrice: queryParams.minPrice || undefined,
    maxPrice: queryParams.maxPrice || undefined,
    condition: queryParams.condition as UserProductFilters['condition'],
    sortBy: queryParams.sortBy as UserProductFilters['sortBy'],
  };

  const { data: profileData, isLoading: profileLoading } = useUserProfile(userId);
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useUserProducts(userId, filters);

  // Infinite scroll using Intersection Observer
  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleBack = () => {
    router.back();
  };

  // Only show full-page loader on initial load (no data at all)
  const isInitialLoading = isLoading && !data;

  const user = profileData?.user;
  const allProducts: ApiProduct[] = data?.pages.flatMap((page) => page.data) || [];
  const totalCount = data?.pages[0]?.pagination?.total ?? 0;

  const ContentWrapper = inline ? "div" : Container;
  const wrapperProps = inline
    ? { className: "bg-surface/50 border border-border rounded-lg p-4 md:p-6 space-y-6" }
    : { className: "py-6 max-w-4xl" };

  return (
    <ContentWrapper {...wrapperProps}>
      {/* Header */}
      {showHeader && (
        <div className="mb-6">
          <Button variant="ghost" size="sm" onClick={handleBack} className="mb-4">
            <Icon name="ChevronLeft" size={20} />
            Nazad
          </Button>

          <Typography variant="h2" className="mb-2">
            Oglasi korisnika
          </Typography>
          {user && (
            <Typography variant="body" className="text-secondary">
              {user.name || `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email}
            </Typography>
          )}
          {totalCount > 0 && (
            <Typography variant="bodySmall" className="text-tertiary mt-1">
              Ukupno: {totalCount} oglasa
            </Typography>
          )}
        </div>
      )}

      {/* Inline Header */}
      {inline && (
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div>
            <Typography variant="h3" className="text-primary">
              Oglasi
            </Typography>
            {totalCount > 0 && (
              <Typography variant="bodySmall" className="text-secondary mt-1">
                Ukupno: {totalCount} oglasa
              </Typography>
            )}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className={inline ? "space-y-4" : "mb-6 space-y-4"}>
        {/* Status Tabs */}
        <div className={cn(
          "flex gap-2 overflow-x-auto pb-2",
          inline && "-mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide snap-x snap-mandatory"
        )}>
          <Button
            variant={queryParams.status === "active" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setQueryParams({ status: "active" })}
            className={cn(inline && "shrink-0 snap-start transition-all duration-200 min-w-[100px] md:min-w-0")}
          >
            Aktivni
          </Button>
          <Button
            variant={queryParams.status === "reserved" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setQueryParams({ status: "reserved" })}
            className={cn(inline && "shrink-0 snap-start transition-all duration-200 min-w-[100px] md:min-w-0")}
          >
            Rezervisani
          </Button>
          <Button
            variant={queryParams.status === "sold" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setQueryParams({ status: "sold" })}
            className={cn(inline && "shrink-0 snap-start transition-all duration-200 min-w-[100px] md:min-w-0")}
          >
            Prodati
          </Button>
          <Button
            variant={queryParams.status === "all" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setQueryParams({ status: "all" })}
            className={cn(inline && "shrink-0 snap-start transition-all duration-200 min-w-[100px] md:min-w-0")}
          >
            Svi
          </Button>
        </div>

        {/* Sort Dropdown */}
        <div className={cn(
          "flex items-center gap-2",
          inline && "flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 bg-background/50 rounded-lg p-3 border border-border/50"
        )}>
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
          <Select
            value={queryParams.sortBy}
            onValueChange={(value) => setQueryParams({ sortBy: value })}
          >
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

      {/* Products List */}
      {isInitialLoading || isLoading ? (
        // Show skeleton while loading (initial load or when switching tabs)
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <ProductListItemSkeleton key={i} />
          ))}
        </div>
      ) : allProducts.length === 0 ? (
        inline ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-16 h-16 mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon name="Package" size={32} className="text-primary/50" />
            </div>
            <Typography variant="h4" className="mb-2">
              Nema oglasa
            </Typography>
            <Typography variant="body" className="text-secondary max-w-xs">
              {queryParams.status === "active" && "Korisnik trenutno nema aktivnih oglasa"}
              {queryParams.status === "reserved" && "Korisnik trenutno nema rezervisanih oglasa"}
              {queryParams.status === "sold" && "Korisnik trenutno nema prodatih oglasa"}
              {queryParams.status === "all" && "Korisnik trenutno nema oglasa"}
            </Typography>
          </div>
        ) : (
          <div className="text-center py-12">
            <Typography variant="body" className="text-secondary">
              {queryParams.status === "active" && "Korisnik trenutno nema aktivnih oglasa"}
              {queryParams.status === "reserved" && "Korisnik trenutno nema rezervisanih oglasa"}
              {queryParams.status === "sold" && "Korisnik trenutno nema prodatih oglasa"}
              {queryParams.status === "all" && "Korisnik trenutno nema oglasa"}
            </Typography>
          </div>
        )
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {allProducts.map((product) => (
              <ProductListItem key={product.id} product={product} />
            ))}
          </div>

          {/* Infinite Scroll Trigger & Load More Button */}
          {hasNextPage && (
            <div ref={loadMoreRef} className={cn(inline ? "flex justify-center pt-4" : "mt-8 flex justify-center")}>
              {isFetchingNextPage ? (
                <div className="flex items-center gap-2 text-secondary">
                  <Loader className={cn(inline ? "h-5 w-5 animate-spin" : "h-6 w-6 animate-spin")} />
                  <Typography variant={inline ? "bodySmall" : "body"}>
                    Učitavanje...
                  </Typography>
                </div>
              ) : (
                <Button
                  variant={inline ? "ghost" : "secondary"}
                  size={inline ? "sm" : undefined}
                  onClick={() => fetchNextPage()}
                >
                  {inline ? "Učitaj još oglasa" : "Učitaj još"}
                </Button>
              )}
            </div>
          )}
        </>
      )}
    </ContentWrapper>
  );
}
