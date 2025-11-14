"use client";

import { forwardRef } from "react";
import { useFormContext, Controller } from "react-hook-form";
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
const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ name, required = false, ...props }, ref) => {
    const {
      control,
      formState: { errors },
    } = useFormContext();

    const error = errors[name]?.message as string | undefined;

    return (
      <Controller
        name={name}
        control={control}
        rules={{
          required: required ? "Ovo polje je obavezno" : false,
        }}
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
