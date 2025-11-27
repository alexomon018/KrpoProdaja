import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Checkbox as ShadcnCheckbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof ShadcnCheckbox> {
  label?: string;
  error?: string;
  helperText?: string;
}

/**
 * Checkbox Component - Atomic Design: Atom
 *
 * Checkbox input with label, error states support
 * Built on shadcn/ui Checkbox with additional features for KrpoProdaja marketplace
 *
 * @example
 * ```tsx
 * <Checkbox
 *   label="Prihvatam uslove korišćenja"
 *   checked={accepted}
 *   onCheckedChange={setAccepted}
 * />
 * ```
 */
const Checkbox = forwardRef<
  React.ElementRef<typeof ShadcnCheckbox>,
  CheckboxProps
>(({ className, label, error, helperText, id, ...props }, ref) => {
  if (!label) {
    // Checkbox without label (just the checkbox itself)
    return (
      <ShadcnCheckbox
        ref={ref}
        id={id}
        className={cn(error && "border-semantic-error", className)}
        {...props}
      />
    );
  }

  // Checkbox with label
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <ShadcnCheckbox
          ref={ref}
          id={id}
          className={cn(error && "border-semantic-error", className)}
          {...props}
        />
        {label && (
          <Label
            htmlFor={id}
            className={cn(
              "text-sm font-medium cursor-pointer",
              error && "text-semantic-error"
            )}
          >
            {label}
          </Label>
        )}
      </div>

      {error && <p className="text-sm text-semantic-error ml-7">{error}</p>}

      {helperText && !error && (
        <p className="text-sm text-foreground-muted ml-7">{helperText}</p>
      )}
    </div>
  );
});

Checkbox.displayName = "Checkbox";

export { Checkbox };
