import { forwardRef, useId } from "react";
import { cn } from "@/lib/utils";
import { Textarea as ShadcnTextarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

/**
 * Textarea Component - Atomic Design: Atom
 *
 * Multi-line text input field with label, error states support
 * Built on shadcn/ui Textarea with additional features for KrpoProdaja marketplace
 *
 * @example
 * ```tsx
 * <Textarea
 *   label="Opis"
 *   placeholder="Opišite proizvod..."
 *   rows={5}
 *   error="Opis je obavezan"
 * />
 * ```
 */
const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      id,
      ...props
    },
    ref
  ) => {
    const textareaId = id || `textarea-${useId()}`;

    return (
      <div className="w-full">
        {label && (
          <Label
            htmlFor={textareaId}
            className="block text-sm font-medium text-foreground mb-1.5"
          >
            {label}
          </Label>
        )}

        <ShadcnTextarea
          id={textareaId}
          className={cn(
            "rounded-sm shadow-light",
            "focus:ring-semantic-info focus:border-transparent focus:shadow-medium",
            "disabled:bg-background",
            error && "border-semantic-error focus:ring-semantic-error",
            className
          )}
          ref={ref}
          {...props}
        />

        {error && <p className="mt-1.5 text-sm text-semantic-error">{error}</p>}

        {helperText && !error && (
          <p className="mt-1.5 text-sm text-foreground-muted">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
