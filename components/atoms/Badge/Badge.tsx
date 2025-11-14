import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Badge as ShadcnBadge } from "@/components/ui/badge";
import type { ConditionType } from "@/lib/types";

/**
 * Extended badge variants for KrpoProdaja marketplace
 * Built on shadcn/ui Badge with custom marketplace-specific variants
 */
const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-2xs px-2.5 py-0.5 text-xs font-semibold transition-colors shadow-light",
  {
    variants: {
      variant: {
        default: "bg-tertiary/20 text-primary",
        primary: "bg-primary/10 text-primary",
        success: "bg-semantic-success/10 text-semantic-success",
        warning: "bg-semantic-warning/10 text-semantic-warning",
        error: "bg-semantic-error/10 text-semantic-error",
        info: "bg-semantic-info/10 text-semantic-info",
        // Condition-specific
        new: "bg-condition-new/10 text-condition-new",
        veryGood: "bg-condition-veryGood/10 text-condition-veryGood",
        good: "bg-condition-good/10 text-condition-good",
        satisfactory: "bg-condition-satisfactory/10 text-condition-satisfactory",
        // Status badges
        sold: "bg-tertiary/80 text-white",
        reserved: "bg-semantic-warning/80 text-white",
      },
      size: {
        sm: "text-2xs px-2 py-0.5 rounded-2xs",
        md: "text-xs px-2.5 py-1 rounded-xs",
        lg: "text-sm px-3 py-1.5 rounded-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

/**
 * Badge Component - Atomic Design: Atom
 *
 * Used for displaying conditions, sizes, status indicators
 * Built on shadcn/ui Badge with custom marketplace variants
 * Color-coded for quick visual scanning
 *
 * @example
 * ```tsx
 * <Badge variant="new">Novo sa etiketom</Badge>
 * <Badge variant="sold">Prodato</Badge>
 * <Badge>M</Badge>
 * ```
 */
function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <ShadcnBadge className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}

/**
 * Condition Badge - Specialized badge for item condition
 * Automatically maps condition to appropriate variant
 */
interface ConditionBadgeProps extends Omit<BadgeProps, "variant"> {
  condition: ConditionType;
}

const conditionLabels: Record<ConditionType, string> = {
  new: "Novo sa etiketom",
  "very-good": "Vrlo dobro",
  good: "Dobro",
  satisfactory: "Zadovoljavajuće",
};

const conditionVariants: Record<ConditionType, "new" | "veryGood" | "good" | "satisfactory"> = {
  new: "new",
  "very-good": "veryGood",
  good: "good",
  satisfactory: "satisfactory",
};

function ConditionBadge({ condition, ...props }: ConditionBadgeProps) {
  return (
    <Badge variant={conditionVariants[condition]} {...props}>
      {conditionLabels[condition]}
    </Badge>
  );
}

/**
 * Size Badge - Specialized badge for clothing sizes
 */
interface SizeBadgeProps extends Omit<BadgeProps, "children" | "size"> {
  clothingSize: string;
}

function SizeBadge({ clothingSize, ...props }: SizeBadgeProps) {
  return (
    <Badge variant="default" {...props}>
      {clothingSize}
    </Badge>
  );
}

export { Badge, badgeVariants, ConditionBadge, SizeBadge };
