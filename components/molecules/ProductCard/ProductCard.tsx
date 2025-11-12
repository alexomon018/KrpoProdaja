"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import cn from "@/lib/utils";
import { ProductImage, Avatar, Badge, Price, Typography } from "@/components/atoms";
import { Heart } from "@/components/atoms/Icon/Icon";
import type { ProductType } from "@/lib/types";
import Link from "next/link";

export interface ProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
  product: ProductType;
  onFavoriteClick?: (productId: string) => void;
}

/**
 * ProductCard Component - Atomic Design: Molecule
 *
 * Core component for product grid display
 * Follows Vinted's clean, information-dense approach:
 * - Large square product image
 * - Price prominently displayed
 * - Small seller avatar overlay
 * - Minimal text (size, condition)
 * - Heart icon for favorites
 *
 * @example
 * ```tsx
 * <ProductCard
 *   product={productData}
 *   onFavoriteClick={(id) => handleFavorite(id)}
 * />
 * ```
 */
const ProductCard = React.forwardRef<HTMLDivElement, ProductCardProps>(
  ({ className, product, onFavoriteClick, ...props }, ref) => {
    const router = useRouter();
    const [isFavorited, setIsFavorited] = React.useState(product.isFavorite || false);

    const handleFavoriteClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsFavorited(!isFavorited);
      onFavoriteClick?.(product.id);
    };

    const handleSellerClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      router.push(`/profile/${product.seller.id}`);
    };

    return (
      <div
        ref={ref}
        className={cn(
          "group relative flex flex-col bg-surface rounded-lg overflow-hidden",
          "transition-shadow hover:shadow-md",
          className
        )}
        {...props}
      >
        <Link href={`/products/${product.id}`} className="flex flex-col h-full">
          {/* Image Container with Overlays */}
          <div className="relative">
            <ProductImage
              src={product.images[0]}
              alt={product.title}
              aspectRatio="square"
            />

            {/* Status Badges (Sold/Reserved) */}
            {product.isSold && (
              <div className="absolute top-2 left-2">
                <Badge variant="sold">Prodato</Badge>
              </div>
            )}
            {product.isReserved && !product.isSold && (
              <div className="absolute top-2 left-2">
                <Badge variant="reserved">Rezervisano</Badge>
              </div>
            )}

            {/* Favorite Button */}
            <button
              onClick={handleFavoriteClick}
              className={cn(
                "absolute top-2 right-2 p-2 rounded-full bg-white/90 backdrop-blur-sm",
                "touch-target transition-colors hover:bg-white",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              )}
              aria-label={isFavorited ? "Ukloni iz omiljenih" : "Dodaj u omiljene"}
            >
              <Heart
                size={20}
                className={cn(
                  "transition-colors",
                  isFavorited ? "fill-primary text-primary" : "text-text-secondary"
                )}
              />
            </button>

            {/* Seller Avatar Overlay */}
            <button
              onClick={handleSellerClick}
              className="absolute bottom-2 left-2 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full"
              aria-label={`Vidi profil prodavca ${product.seller.username}`}
            >
              <Avatar
                src={product.seller.avatar}
                alt={product.seller.username}
                fallback={product.seller.username}
                size="sm"
              />
            </button>
          </div>

          {/* Product Information */}
          <div className="flex flex-col gap-2 p-3 flex-1">
            {/* Price */}
            <Price amount={product.price} />

            {/* Title */}
            <Typography
              variant="bodySmall"
              className="line-clamp-2 min-h-[2.5rem]"
            >
              {product.title}
            </Typography>

            {/* Metadata: Size, Brand, Condition */}
            <div className="flex items-center gap-1.5 flex-wrap mt-auto">
              <Badge>{product.size}</Badge>
              {product.brand && (
                <Badge variant="default">{product.brand}</Badge>
              )}
              <Badge variant="default" className="text-text-tertiary">
                {product.condition === "new"
                  ? "Novo"
                  : product.condition === "very-good"
                  ? "Vrlo dobro"
                  : product.condition === "good"
                  ? "Dobro"
                  : "Zadovoljavajuće"}
              </Badge>
            </div>

            {/* Location */}
            <Typography variant="caption" className="flex items-center gap-1">
              <span className="text-text-tertiary">{product.location}</span>
            </Typography>
          </div>
        </Link>
      </div>
    );
  }
);

ProductCard.displayName = "ProductCard";

export { ProductCard };
