import { forwardRef, useId } from "react";
import cn from "@/lib/utils";

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
 * Follows Serbian marketplace design system
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
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-foreground mb-1.5"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {startIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted">
              {startIcon}
            </div>
          )}

          <input
            type={type}
            id={inputId}
            className={cn(
              "flex h-11 w-full rounded-sm border border-border bg-surface px-3 py-2 text-base shadow-light",
              "text-foreground placeholder:text-foreground-subtle",
              "focus:outline-none focus:ring-1 focus:ring-semantic-info focus:border-transparent focus:shadow-medium",
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-background",
              "transition-all",
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
