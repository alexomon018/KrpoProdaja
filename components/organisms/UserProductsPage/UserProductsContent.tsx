"use client";

import { useRouter } from "next/navigation";
import { Container } from "@/components/atoms/Container/Container";
import { Button } from "@/components/atoms/Button/Button";
import { Icon } from "@/components/atoms/Icon/Icon";
import {
  Typography,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/atoms";
import { UserProductsFilters, UserProductsList } from "@/components/molecules";
import { useUserProductsManagement } from "@/lib/api/hooks/useUserProductsManagement";

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

  // Use custom hook for all logic
  const {
    user,
    allProducts,
    totalCount,
    isOwnProducts,
    isLoading,
    isInitialLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    loadMoreRef,
    queryParams,
    setQueryParams,
    deleteProduct,
    handleDeleteClick,
    handleDeleteConfirm,
    handleStatusChange,
    deleteDialogOpen,
    setDeleteDialogOpen,
  } = useUserProductsManagement({ userId });

  const handleBack = () => {
    router.back();
  };

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
      <UserProductsFilters
        status={queryParams.status}
        sortBy={queryParams.sortBy}
        onStatusChange={(status) => setQueryParams({ status })}
        onSortChange={(sortBy) => setQueryParams({ sortBy })}
        inline={inline}
      />

      {/* Products List */}
      <UserProductsList
        products={allProducts}
        isLoading={isInitialLoading || isLoading}
        isOwnProducts={isOwnProducts}
        status={queryParams.status}
        onDelete={handleDeleteClick}
        onStatusChange={handleStatusChange}
        inline={inline}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onFetchNextPage={fetchNextPage}
        loadMoreRef={loadMoreRef}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Brisanje oglasa</AlertDialogTitle>
            <AlertDialogDescription>
              Da li ste sigurni da želite da obrišete ovaj oglas? Ova akcija se ne može poništiti.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="secondary" disabled={deleteProduct.isPending}>
                Otkaži
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant="primary"
                onClick={handleDeleteConfirm}
                disabled={deleteProduct.isPending}
                className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
              >
                {deleteProduct.isPending ? "Brisanje..." : "Obriši"}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ContentWrapper>
  );
}
