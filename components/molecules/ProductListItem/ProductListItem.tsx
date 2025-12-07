"use client";

import Link from "next/link";
import cn from "@/lib/utils";
import { ProductImage, Badge, Price, Typography, Button, Icon } from "@/components/atoms";
import type { ApiProduct } from "@/lib/api/types";

export interface ProductListItemProps extends React.HTMLAttributes<HTMLDivElement> {
  product: ApiProduct;
  /**
   * Whether this is the current user's own product (shows action buttons)
   */
  isOwnProduct?: boolean;
  /**
   * Callback when delete is clicked
   */
  onDelete?: (productId: string) => void;
  /**
   * Callback when status change is clicked
   */
  onStatusChange?: (productId: string, newStatus: "active" | "reserved" | "sold") => void;
}

/**
 * ProductListItem Component - Atomic Design: Molecule
 *
 * Horizontal list view for product display
 * Optimized for user product listings page
 *
 * @example
 * ```tsx
 * <ProductListItem product={productData} />
 * ```
 */
export function ProductListItem({
  className,
  product,
  isOwnProduct = false,
  onDelete,
  onStatusChange,
  ...props
}: ProductListItemProps) {
  const isSold = product.status === "sold";
  const isReserved = product.status === "reserved";
  const isActive = product.status === "active";

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      onDelete(product.id);
    }
  };

  const handleStatusChange = (e: React.MouseEvent, newStatus: "active" | "reserved" | "sold") => {
    e.preventDefault();
    e.stopPropagation();
    if (onStatusChange) {
      onStatusChange(product.id, newStatus);
    }
  };

  const content = (
    <div
      className={cn(
        "flex gap-3 sm:gap-4 bg-surface border border-border rounded-lg p-3 sm:p-4",
        !isOwnProduct && "transition-shadow hover:shadow-md",
        className
      )}
      {...props}
    >
      {/* Product Image */}
      <div className="shrink-0 w-20 h-20 sm:w-24 sm:h-24">
        <ProductImage
          src={product.images[0]}
          alt={product.title}
          aspectRatio="square"
          className="rounded-md"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <Typography variant="h4" className="line-clamp-2 text-sm sm:text-base">
              {product.title}
            </Typography>
            <Price amount={product.price} className="shrink-0 text-base sm:text-lg font-bold" />
          </div>

          <div className="flex flex-wrap gap-1 sm:gap-2 mt-1 sm:mt-2">
            {product.brand && (
              <Typography variant="bodySmall" className="text-secondary text-xs sm:text-sm">
                {product.brand}
              </Typography>
            )}
            {product.size && (
              <Typography variant="bodySmall" className="text-secondary text-xs sm:text-sm">
                • Veličina: {product.size}
              </Typography>
            )}
            {product.condition && (
              <Typography variant="bodySmall" className="text-secondary text-xs sm:text-sm">
                • {product.condition}
              </Typography>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 mt-2">
          <div className="flex items-center gap-2">
            {isSold && <Badge variant="sold">Prodato</Badge>}
            {isReserved && !isSold && <Badge variant="reserved">Rezervisano</Badge>}
            {!isSold && !isReserved && <Badge variant="success">Dostupno</Badge>}
          </div>

          {/* Action Buttons for Own Products */}
          {isOwnProduct && (
            <div className="flex items-center gap-1">
              {isActive && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    onClick={(e) => handleStatusChange(e, "reserved")}
                    title="Označi kao rezervisano"
                  >
                    <Icon name="Clock" size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                    onClick={(e) => handleStatusChange(e, "sold")}
                    title="Označi kao prodato"
                  >
                    <Icon name="Check" size={16} />
                  </Button>
                </>
              )}
              {isReserved && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                    onClick={(e) => handleStatusChange(e, "active")}
                    title="Vrati u aktivne"
                  >
                    <Icon name="RotateCcw" size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                    onClick={(e) => handleStatusChange(e, "sold")}
                    title="Označi kao prodato"
                  >
                    <Icon name="Check" size={16} />
                  </Button>
                </>
              )}
              {isSold && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                  onClick={(e) => handleStatusChange(e, "active")}
                  title="Vrati u aktivne"
                >
                  <Icon name="RotateCcw" size={16} />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleDelete}
                title="Obriši oglas"
              >
                <Icon name="Trash2" size={16} />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Only wrap in Link if not own product (to allow button interactions)
  if (isOwnProduct) {
    return content;
  }

  return <Link href={`/products/${product.id}`}>{content}</Link>;
}
