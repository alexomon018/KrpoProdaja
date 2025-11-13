import * as React from "react";
import cn from "@/lib/utils";
import { Typography } from "@/components/atoms";

export interface RatingMetricProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  rating: number;
  size?: "sm" | "md" | "lg";
}

/**
 * RatingMetric Component - Atomic Design: Atom
 *
 * Displays a single rating metric with label
 * Used in review summaries to show breakdown of different rating categories
 *
 * @example
 * ```tsx
 * <RatingMetric label="Item quality" rating={5.0} />
 * <RatingMetric label="Delivery" rating={4.8} size="sm" />
 * ```
 */
export const RatingMetric = React.forwardRef<HTMLDivElement, RatingMetricProps>(
  ({ className, label, rating, size = "md", ...props }, ref) => {
    const badgeSize = size === "sm" ? "w-6 h-6" : size === "md" ? "w-8 h-8" : "w-10 h-10";
    const textSize = size === "sm" ? "text-xs" : size === "md" ? "text-sm" : "text-base";

    return (
      <div ref={ref} className={cn("flex flex-col gap-1", className)} {...props}>
        <div className="flex items-center gap-2">
          <div
            className={cn(
              badgeSize,
              "rounded-full bg-semantic-warning/10 flex items-center justify-center"
            )}
          >
            <span className={cn(textSize, "font-bold text-primary")}>
              {rating.toFixed(1)}
            </span>
          </div>
          <Typography variant="caption" className="text-secondary">
            {label}
          </Typography>
        </div>
      </div>
    );
  }
);

RatingMetric.displayName = "RatingMetric";
