import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import cn from "@/lib/utils";

/**
 * Button variants using CVA (Class Variance Authority)
 * Follows the design system with primary, secondary, and ghost variants
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 touch-target",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-white hover:bg-primary-dark active:bg-primary-dark",
        secondary:
          "border-2 border-primary text-primary bg-transparent hover:bg-primary/10 active:bg-primary/20",
        ghost:
          "text-primary hover:bg-primary/10 active:bg-primary/20",
        danger:
          "bg-semantic-error text-white hover:bg-semantic-error/90 active:bg-semantic-error/80",
        success:
          "bg-semantic-success text-white hover:bg-semantic-success/90 active:bg-semantic-success/80",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-11 px-4 text-base",
        lg: "h-12 px-6 text-lg",
        icon: "h-11 w-11",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

/**
 * Button Component - Atomic Design: Atom
 *
 * Primary interactive element following Serbian marketplace design patterns
 * Minimum touch target: 44x44px for mobile accessibility
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="md">Kupi odmah</Button>
 * <Button variant="secondary">Pošalji poruku</Button>
 * <Button variant="ghost" size="sm">Sačuvaj</Button>
 * ```
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, loading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
