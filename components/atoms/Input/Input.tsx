import { forwardRef, useId } from "react";
import { cn } from "@/lib/utils";
import { Input as ShadcnInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

/**
 * Input Component - Atomic Design: Atom
 *
 * Form input field with label, error states, and icon support
 * Built on shadcn/ui Input with additional features for KrpoProdaja marketplace
 *
 * @example
 * ```tsx
 * <Input
 *   label="Cena"
 *   type="number"
 *   placeholder="0 RSD"
 *   error="Cena je obavezna"
 * />
 * ```
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      label,
      error,
      helperText,
      startIcon,
      endIcon,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${useId()}`;

    return (
      <div className="w-full">
        {label && (
          <Label
            htmlFor={inputId}
            className="block text-sm font-medium text-foreground mb-1.5"
          >
            {label}
          </Label>
        )}

        <div className="relative">
          {startIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted">
              {startIcon}
            </div>
          )}

          <ShadcnInput
            type={type}
            id={inputId}
            className={cn(
              "h-11 rounded-sm shadow-light",
              "focus:ring-semantic-info focus:border-transparent focus:shadow-medium",
              "disabled:bg-background",
              error && "border-semantic-error focus:ring-semantic-error",
              startIcon && "pl-10",
              endIcon && "pr-10",
              className
            )}
            ref={ref}
            {...props}
          />

          {endIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted">
              {endIcon}
            </div>
          )}
        </div>

        {error && <p className="mt-1.5 text-sm text-semantic-error">{error}</p>}

        {helperText && !error && (
          <p className="mt-1.5 text-sm text-foreground-muted">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
