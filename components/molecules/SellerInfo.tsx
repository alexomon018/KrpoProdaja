import * as React from "react";
import { cn } from "@/lib/utils";
import { Avatar, Button, Typography } from "@/components/atoms";
import { RatingDisplay } from "./ReviewCard";
import type { UserType } from "@/lib/types";
import { MessageCircle, Clock } from "@/components/atoms/Icon";

export interface SellerInfoProps extends React.HTMLAttributes<HTMLDivElement> {
  seller: UserType;
  onMessageClick?: () => void;
  onProfileClick?: () => void;
  /**
   * Compact version for product cards
   */
  compact?: boolean;
}

/**
 * SellerInfo Component - Atomic Design: Molecule
 *
 * Displays seller information with trust indicators
 * Used in product detail pages
 *
 * @example
 * ```tsx
 * <SellerInfo
 *   seller={sellerData}
 *   onMessageClick={() => openChat()}
 * />
 * ```
 */
const SellerInfo = React.forwardRef<HTMLDivElement, SellerInfoProps>(
  (
    {
      className,
      seller,
      onMessageClick,
      onProfileClick,
      compact = false,
      ...props
    },
    ref
  ) => {
    if (compact) {
      return (
        <button
          onClick={onProfileClick}
          className={cn(
            "flex items-center gap-2 hover:opacity-80 transition-opacity",
            className
          )}
        >
          <Avatar
            src={seller.avatar}
            alt={seller.username}
            fallback={seller.username}
            size="sm"
          />
          <Typography variant="caption">{seller.username}</Typography>
        </button>
      );
    }

    return (
      <div
        ref={ref}
        className={cn("bg-surface rounded-lg p-4 border border-border", className)}
        {...props}
      >
        {/* Seller Header */}
        <div className="flex items-start gap-3 mb-4">
          <button onClick={onProfileClick} className="shrink-0">
            <Avatar
              src={seller.avatar}
              alt={seller.username}
              fallback={seller.username}
              size="lg"
            />
          </button>

          <div className="flex-1 min-w-0">
            <button
              onClick={onProfileClick}
              className="hover:underline focus:outline-none focus:underline"
            >
              <Typography variant="h3" className="mb-1">
                {seller.username}
              </Typography>
            </button>

            {/* Rating */}
            {seller.rating && seller.reviewCount && (
              <RatingDisplay
                rating={seller.rating}
                reviewCount={seller.reviewCount}
                size="sm"
              />
            )}

            {/* Response Time */}
            {seller.responseTime && (
              <div className="flex items-center gap-1.5 mt-2">
                <Clock size={14} className="text-text-tertiary" />
                <Typography variant="caption">
                  Obično odgovara za {seller.responseTime}
                </Typography>
              </div>
            )}
          </div>
        </div>

        {/* Seller Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4 py-3 border-y border-border">
          <div className="text-center">
            <Typography variant="h3">
              {seller.itemsForSale || 0}
            </Typography>
            <Typography variant="caption">Na prodaju</Typography>
          </div>
          <div className="text-center">
            <Typography variant="h3">
              {seller.itemsSold || 0}
            </Typography>
            <Typography variant="caption">Prodato</Typography>
          </div>
          <div className="text-center">
            <Typography variant="h3">
              {new Date().getFullYear() -
                seller.memberSince.getFullYear()}
              god
            </Typography>
            <Typography variant="caption">Član</Typography>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="primary"
            fullWidth
            onClick={onMessageClick}
            className="gap-2"
          >
            <MessageCircle size={20} />
            Pošalji poruku
          </Button>
          <Button
            variant="secondary"
            onClick={onProfileClick}
          >
            Profil
          </Button>
        </div>
      </div>
    );
  }
);

SellerInfo.displayName = "SellerInfo";

export { SellerInfo };
