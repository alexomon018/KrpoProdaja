"use client";

import Link from "next/link";
import cn from "@/lib/utils";
import { ProductImage, Badge, Price, Typography } from "@/components/atoms";
import type { ApiProduct } from "@/lib/api/types";

export interface ProductListItemProps extends React.HTMLAttributes<HTMLDivElement> {
  product: ApiProduct;
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
export function ProductListItem({ className, product, ...props }: ProductListItemProps) {
  const isSold = product.status === "sold";
  const isReserved = product.status === "reserved";

  return (
    <Link href={`/products/${product.id}`}>
      <div
        className={cn(
          "flex gap-4 bg-surface border border-border rounded-lg p-4",
          "transition-shadow hover:shadow-md",
          className
        )}
        {...props}
      >
        {/* Product Image */}
        <div className="shrink-0 w-24 h-24 md:w-32 md:h-32">
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
              <Typography variant="h4" className="line-clamp-2">
                {product.title}
              </Typography>
              <Price amount={product.price} className="shrink-0 text-lg font-bold" />
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {product.brand && (
                <Typography variant="bodySmall" className="text-secondary">
                  {product.brand}
                </Typography>
              )}
              {product.size && (
                <Typography variant="bodySmall" className="text-secondary">
                  • Veličina: {product.size}
                </Typography>
              )}
              {product.condition && (
                <Typography variant="bodySmall" className="text-secondary">
                  • {product.condition}
                </Typography>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2">
            {isSold && <Badge variant="sold">Prodato</Badge>}
            {isReserved && !isSold && <Badge variant="reserved">Rezervisano</Badge>}
            {!isSold && !isReserved && <Badge variant="success">Dostupno</Badge>}
          </div>
        </div>
      </div>
    </Link>
  );
}
