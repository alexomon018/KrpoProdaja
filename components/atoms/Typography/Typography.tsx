import { forwardRef } from "react";
import cn from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

/**
 * Text variants following the design system typography scale
 */
const textVariants = cva("", {
  variants: {
    variant: {
      h1: "text-3xl font-bold text-foreground",
      h2: "text-2xl font-bold text-foreground",
      h3: "text-xl font-semibold text-foreground",
      h4: "text-lg font-semibold text-foreground",
      body: "text-base text-foreground",
      bodyMedium: "text-md text-foreground",
      bodySmall: "text-sm text-foreground-muted",
      caption: "text-xs text-foreground-subtle",
      captionSmall: "text-2xs text-foreground-subtle",
      price: "text-xl font-bold text-foreground",
      priceLarge: "text-2xl font-bold text-foreground",
    },
  },
  defaultVariants: {
    variant: "body",
  },
});

export interface TypographyProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof textVariants> {
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
}

/**
 * Typography Component - Atomic Design: Atom
 *
 * Consistent text styling across the application
 * Serbian language optimized with proper Cyrillic/Latin support
 *
 * @example
 * ```tsx
 * <Typography variant="h1">Naslov</Typography>
 * <Typography variant="price">1.500 RSD</Typography>
 * <Typography variant="bodySmall">Opis proizvoda</Typography>
 * ```
 */
const Typography = forwardRef<HTMLElement, TypographyProps>(
  ({ className, variant, as, ...props }, ref) => {
    const Component = as || "p";

    return (
      <Component
        ref={ref as any}
        className={cn(textVariants({ variant }), className)}
        {...props}
      />
    );
  }
);

Typography.displayName = "Typography";

/**
 * Price Component - Specialized typography for displaying prices
 */
interface PriceProps extends Omit<TypographyProps, "variant" | "children"> {
  amount: number;
  large?: boolean;
  originalPrice?: number;
  currency?: string;
}

const Price = forwardRef<HTMLElement, PriceProps>(
  ({ amount, large, originalPrice, currency = "RSD", className, ...props }, ref) => {
    const formatPrice = (price: number) => {
      return new Intl.NumberFormat("sr-RS", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(price);
    };

    return (
      <div className={cn("flex items-baseline gap-2", className)}>
        <Typography
          ref={ref}
          variant={large ? "priceLarge" : "price"}
          as="span"
          {...props}
        >
          {formatPrice(amount)} {currency}
        </Typography>
        {originalPrice && originalPrice > amount && (
          <Typography
            variant="bodySmall"
            as="span"
            className="line-through text-foreground-subtle"
          >
            {formatPrice(originalPrice)} {currency}
          </Typography>
        )}
      </div>
    );
  }
);

Price.displayName = "Price";

export { Typography, textVariants, Price };
