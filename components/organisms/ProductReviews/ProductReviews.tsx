"use client";

import * as React from "react";
import cn from "@/lib/utils";
import { Typography, Button } from "@/components/atoms";
import { ReviewCard } from "@/components/molecules/ReviewCard/ReviewCard";
import { ReviewSummary } from "@/components/molecules/ReviewSummary/ReviewSummary";
import { ReviewFilters } from "@/components/molecules/ReviewFilters/ReviewFilters";
import type { ReviewType, ReviewSummaryType } from "@/lib/types";

export interface ProductReviewsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  reviews: ReviewType[];
  summary: ReviewSummaryType;
}

/**
 * ProductReviews Component - Atomic Design: Organism
 *
 * Comprehensive reviews section for product detail pages
 * Inspired by Etsy's review layout with:
 * - Overall rating summary with metrics
 * - Rating breakdown by category
 * - Buyer highlights (AI-generated tags)
 * - Filter tabs by review type
 * - Individual review cards with seller responses
 *
 * @example
 * ```tsx
 * <ProductReviews reviews={reviewsData} summary={summaryData} />
 * ```
 */
export const ProductReviews = React.forwardRef<
  HTMLDivElement,
  ProductReviewsProps
>(({ className, reviews, summary, ...props }, ref) => {
  const [selectedFilter, setSelectedFilter] = React.useState<string>("all");
  const [sortBy, setSortBy] = React.useState<"suggested" | "newest" | "oldest">(
    "suggested"
  );
  const [showAllReviews, setShowAllReviews] = React.useState(false);

  // Count reviews by type
  const reviewCounts = React.useMemo(() => {
    const counts: Record<string, number> = {
      all: reviews.length,
      appearance: 0,
      "delivery-packaging": 0,
      "seller-service": 0,
      condition: 0,
    };
    reviews.forEach((review) => {
      if (review.reviewType) {
        counts[review.reviewType] = (counts[review.reviewType] || 0) + 1;
      }
    });
    return counts;
  }, [reviews]);

  // Build filter options
  const filterOptions = React.useMemo(() => {
    const options = [{ id: "all", label: "All", count: reviewCounts.all }];

    if (reviewCounts.appearance > 0) {
      options.push({
        id: "appearance",
        label: "Appearance",
        count: reviewCounts.appearance,
      });
    }
    if (reviewCounts["delivery-packaging"] > 0) {
      options.push({
        id: "delivery-packaging",
        label: "Delivery & Packaging",
        count: reviewCounts["delivery-packaging"],
      });
    }
    if (reviewCounts["seller-service"] > 0) {
      options.push({
        id: "seller-service",
        label: "Seller service",
        count: reviewCounts["seller-service"],
      });
    }
    if (reviewCounts.condition > 0) {
      options.push({
        id: "condition",
        label: "Condition",
        count: reviewCounts.condition,
      });
    }

    return options;
  }, [reviewCounts]);

  // Filter reviews based on selected tab
  const filteredReviews = React.useMemo(() => {
    if (selectedFilter === "all") return reviews;
    return reviews.filter((review) => review.reviewType === selectedFilter);
  }, [reviews, selectedFilter]);

  // Sort reviews
  const sortedReviews = React.useMemo(() => {
    const sorted = [...filteredReviews];
    if (sortBy === "newest") {
      sorted.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } else if (sortBy === "oldest") {
      sorted.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    }
    // "suggested" keeps original order
    return sorted;
  }, [filteredReviews, sortBy]);

  // Show only first 3 reviews initially
  const displayedReviews = showAllReviews
    ? sortedReviews
    : sortedReviews.slice(0, 3);

  return (
    <div
      ref={ref}
      className={cn("bg-surface rounded-lg p-6 md:p-8", className)}
      {...props}
    >
      {/* Header */}
      <Typography variant="h2" className="mb-6">
        Reviews for this item ({summary.totalReviews})
      </Typography>

      {/* Rating Summary Section */}
      <div className="mb-8">
        <ReviewSummary summary={summary} />
      </div>

      {/* Filter and Sort Controls */}
      <div className="mb-6">
        <ReviewFilters
          filters={filterOptions}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {displayedReviews.length === 0 ? (
          <div className="text-center py-8">
            <Typography variant="bodySmall" className="text-secondary">
              No reviews yet for this filter.
            </Typography>
          </div>
        ) : (
          displayedReviews.map((review) => (
            <div key={review.id} className="space-y-3">
              <ReviewCard review={review} />

              {/* Seller Response */}
              {review.sellerResponse && (
                <div className="ml-12 pl-4 border-l-2 border-stroke">
                  <div className="bg-background rounded-lg p-4">
                    <Typography
                      variant="caption"
                      className="font-semibold mb-2 block"
                    >
                      Response from Seller
                    </Typography>
                    <Typography variant="bodySmall">
                      {review.sellerResponse.comment}
                    </Typography>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Show More Button */}
      {sortedReviews.length > 3 && !showAllReviews && (
        <div className="mt-6 text-center">
          <Button
            onClick={() => setShowAllReviews(true)}
            variant="secondary"
            size="lg"
            className="rounded-full dark:text-white"
          >
            Show all {sortedReviews.length} reviews
          </Button>
        </div>
      )}
    </div>
  );
});

ProductReviews.displayName = "ProductReviews";
