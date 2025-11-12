"use client";

import * as React from "react";
import { useFormContext } from "react-hook-form";
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
const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ name, required = false, ...props }, ref) => {
    const {
      register,
      formState: { errors },
    } = useFormContext();

    const error = errors[name]?.message as string | undefined;

    return (
      <Input
        {...props}
        {...register(name, { required })}
        ref={ref}
        error={error}
      />
    );
  }
);

FormInput.displayName = "FormInput";

export { FormInput };
