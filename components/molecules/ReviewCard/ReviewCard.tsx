import * as React from "react";
import cn, { formatRelativeTime } from "@/lib/utils";
import { Avatar, Typography } from "@/components/atoms";
import { Star } from "@/components/atoms/Icon/Icon";
import type { ReviewType } from "@/lib/types";

export interface ReviewCardProps extends React.HTMLAttributes<HTMLDivElement> {
  review: ReviewType;
}

/**
 * ReviewCard Component - Atomic Design: Molecule
 *
 * Displays user review with rating and comment
 * Used in product detail pages and user profiles
 *
 * @example
 * ```tsx
 * <ReviewCard review={reviewData} />
 * ```
 */
const ReviewCard = React.forwardRef<HTMLDivElement, ReviewCardProps>(
  ({ className, review, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex gap-3 p-4 bg-surface rounded-lg", className)}
        {...props}
      >
        {/* Reviewer Avatar */}
        <Avatar
          src={review.reviewer.avatar}
          alt={review.reviewer.username}
          size="md"
        />

        {/* Review Content */}
        <div className="flex-1 min-w-0">
          {/* Reviewer Name and Date */}
          <div className="flex items-center justify-between gap-2 mb-1">
            <Typography variant="bodySmall" className="font-semibold">
              {review.reviewer.username}
            </Typography>
            <Typography variant="caption">
              {formatRelativeTime(review.createdAt)}
            </Typography>
          </div>

          {/* Star Rating */}
          <div className="flex items-center gap-0.5 mb-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                size={16}
                className={cn(
                  index < review.rating
                    ? "fill-semantic-warning text-semantic-warning"
                    : "text-tertiary"
                )}
              />
            ))}
            <span className="ml-1 text-sm text-secondary">
              {review.rating.toFixed(1)}
            </span>
          </div>

          {/* Review Comment */}
          {review.comment && (
            <Typography variant="bodySmall">
              {review.comment}
            </Typography>
          )}
        </div>
      </div>
    );
  }
);

ReviewCard.displayName = "ReviewCard";

/**
 * RatingDisplay - Shows average rating with star visualization
 */
interface RatingDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  rating: number;
  reviewCount?: number;
  showCount?: boolean;
  size?: "sm" | "md" | "lg";
}

const RatingDisplay = React.forwardRef<HTMLDivElement, RatingDisplayProps>(
  (
    { className, rating, reviewCount, showCount = true, size = "md", ...props },
    ref
  ) => {
    const starSize = size === "sm" ? 14 : size === "md" ? 16 : 20;
    const textSize = size === "sm" ? "text-xs" : size === "md" ? "text-sm" : "text-base";

    return (
      <div
        ref={ref}
        className={cn("flex items-center gap-1", className)}
        {...props}
      >
        <Star
          size={starSize}
          className="fill-semantic-warning text-semantic-warning"
        />
        <span className={cn("font-semibold text-primary", textSize)}>
          {rating.toFixed(1)}
        </span>
        {showCount && reviewCount !== undefined && (
          <span className={cn("text-tertiary", textSize)}>
            ({reviewCount})
          </span>
        )}
      </div>
    );
  }
);

RatingDisplay.displayName = "RatingDisplay";

export { ReviewCard, RatingDisplay };
