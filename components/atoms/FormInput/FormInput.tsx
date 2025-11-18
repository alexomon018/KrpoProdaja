"use client";

import { forwardRef } from "react";
import { useFormContext, Controller, RegisterOptions } from "react-hook-form";
import { Input, InputProps } from "../Input/Input";

export interface FormInputProps extends Omit<InputProps, "error"> {
  /**
   * Name of the field in the form (for react-hook-form)
   */
  name: string;
  /**
   * Whether the field is required
   */
  required?: boolean;
  /**
   * Custom validation rules for react-hook-form
   * Use this to add email validation, password strength, etc.
   */
  validation?: Omit<RegisterOptions, "required">;
}

/**
 * FormInput Component - Atomic Design: Atom
 *
 * Input component integrated with react-hook-form
 * Automatically connects to form context and shows validation errors
 *
 * @example
 * ```tsx
 * import { useForm, FormProvider } from "react-hook-form";
 * import { FormInput } from "@/components/atoms";
 *
 * const methods = useForm();
 *
 * <FormProvider {...methods}>
 *   <FormInput
 *     name="price"
 *     label="Cena"
 *     type="number"
 *     required
 *   />
 * </FormProvider>
 * ```
 */
const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ name, required = false, validation, ...props }, ref) => {
    const {
      control,
      formState: { errors },
    } = useFormContext();

    const error = errors[name]?.message as string | undefined;

    // Merge required validation with custom validation rules
    const rules = {
      required: required ? "Ovo polje je obavezno" : false,
      ...validation,
    };

    return (
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => (
          <Input
            {...props}
            {...field}
            value={field.value ?? ""}
            ref={ref}
            error={error}
          />
        )}
      />
    );
  }
);

FormInput.displayName = "FormInput";

export { FormInput };
