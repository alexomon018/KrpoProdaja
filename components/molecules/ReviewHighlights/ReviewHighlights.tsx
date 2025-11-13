import * as React from "react";
import cn from "@/lib/utils";
import { Typography } from "@/components/atoms";
import { Star } from "@/components/atoms/Icon/Icon";

export interface ReviewHighlightsProps extends React.HTMLAttributes<HTMLDivElement> {
  highlights: string[];
}

/**
 * ReviewHighlights Component - Atomic Design: Molecule
 *
 * Displays AI-summarized buyer highlights as tags
 * Used in review sections to show common themes
 *
 * @example
 * ```tsx
 * <ReviewHighlights highlights={["Fast delivery", "Beautiful", "Great design"]} />
 * ```
 */
export const ReviewHighlights = React.forwardRef<HTMLDivElement, ReviewHighlightsProps>(
  ({ className, highlights, ...props }, ref) => {
    if (highlights.length === 0) return null;

    return (
      <div ref={ref} className={cn("", className)} {...props}>
        <div className="flex items-center gap-2 mb-3">
          <Star size={16} className="text-primary" />
          <Typography variant="bodySmall" className="font-semibold">
            Buyer highlights, summarised by AI
          </Typography>
        </div>
        <div className="flex flex-wrap gap-2">
          {highlights.map((highlight, index) => (
            <div
              key={index}
              className="px-3 py-1.5 rounded-full border border-stroke bg-background text-sm text-secondary"
            >
              {highlight}
            </div>
          ))}
        </div>
      </div>
    );
  }
);

ReviewHighlights.displayName = "ReviewHighlights";
