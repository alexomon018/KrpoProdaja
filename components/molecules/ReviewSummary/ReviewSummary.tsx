import { forwardRef } from "react";
import cn from "@/lib/utils";
import { Typography, RatingMetric } from "@/components/atoms";
import { Star } from "@/components/atoms/Icon/Icon";
import { ReviewHighlights } from "@/components/molecules/ReviewHighlights/ReviewHighlights";
import type { ReviewSummaryType } from "@/lib/types";

export interface ReviewSummaryProps extends React.HTMLAttributes<HTMLDivElement> {
  summary: ReviewSummaryType;
}

/**
 * ReviewSummary Component - Atomic Design: Molecule
 *
 * Displays comprehensive review summary with:
 * - Overall average rating
 * - Rating breakdown by category (item quality, delivery, service)
 * - Recommendation percentage badge
 * - AI-summarized buyer highlights
 *
 * @example
 * ```tsx
 * <ReviewSummary summary={summaryData} />
 * ```
 */
export const ReviewSummary = forwardRef<HTMLDivElement, ReviewSummaryProps>(
  ({ className, summary, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("pb-8 border-b border-stroke", className)}
        {...props}
      >
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Overall Rating */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Star size={32} className="fill-semantic-warning text-semantic-warning" />
              <span className="text-5xl font-bold text-primary">
                {summary.averageRating.toFixed(1)}
              </span>
            </div>
            <Typography variant="bodySmall" className="text-secondary">
              /5
              <br />
              item average
            </Typography>
          </div>

          {/* Rating Breakdown */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <RatingMetric
              label="Item quality"
              rating={summary.ratingBreakdown.itemQuality}
            />
            <RatingMetric
              label="Delivery"
              rating={summary.ratingBreakdown.delivery}
            />
            <RatingMetric
              label="Customer service"
              rating={summary.ratingBreakdown.customerService}
            />
          </div>

          {/* Recommendation Badge */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full border-4 border-semantic-warning flex items-center justify-center">
              <span className="text-xl font-bold text-primary">
                {summary.recommendationPercentage}%
              </span>
            </div>
            <Typography variant="caption" className="text-center">
              Buyers
              <br />
              recommend
            </Typography>
          </div>
        </div>

        {/* Buyer Highlights */}
        {summary.highlights.length > 0 && (
          <div className="mt-6">
            <ReviewHighlights highlights={summary.highlights} />
          </div>
        )}
      </div>
    );
  }
);

ReviewSummary.displayName = "ReviewSummary";
