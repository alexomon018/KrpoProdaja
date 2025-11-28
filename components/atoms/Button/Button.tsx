import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Button as ShadcnButton } from "@/components/ui/button";

/**
 * Extended button variants for KrpoProdaja marketplace
 * Extends shadcn/ui Button with custom variants and features
 */
const buttonVariants = cva(
  "touch-target shadow-low hover:shadow-medium",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-white dark:text-white hover:bg-primary-dark active:bg-primary-dark",
        secondary:
          "border-2 border-primary text-primary bg-surface hover:bg-primary/10 active:bg-primary/20",
        ghost:
          "text-foreground-muted hover:bg-background active:bg-border/20 shadow-none hover:shadow-none",
        danger:
          "bg-semantic-error text-white dark:text-white hover:bg-semantic-error/90 active:bg-semantic-error/80",
        success:
          "bg-semantic-success text-white dark:text-white hover:bg-semantic-success/90 active:bg-semantic-success/80",
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
 * Built on shadcn/ui Button with custom variants and loading states
 * Minimum touch target: 44x44px for mobile accessibility
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="md">Kupi odmah</Button>
 * <Button variant="secondary">Pošalji poruku</Button>
 * <Button variant="ghost" size="sm">Sačuvaj</Button>
 * <Button variant="primary" loading>Učitavanje...</Button>
 * ```
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, loading, children, disabled, asChild, ...props }, ref) => {
    return (
      <ShadcnButton
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={disabled || loading}
        asChild={asChild}
        variant={null as any}
        {...props}
      >
        <>
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
        </>
      </ShadcnButton>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
