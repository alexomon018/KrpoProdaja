# React Hook Form Integration Guide

This guide shows how to use `react-hook-form` with the Krpo Prodaja component library.

## 🎯 Overview

The project now includes:
- **react-hook-form** v7.54.2 for form management
- **FormInput** component - Input integrated with react-hook-form
- **cn utility** as default export for class merging

---

## 📦 Installation

Already installed! Dependencies:
```json
{
  "react-hook-form": "^7.54.2",
  "clsx": "^2.1.1",
  "tailwind-merge": "^2.5.4"
}
```

---

## 🔧 Using cn Utility

The `cn` utility is now exported as a **default export**:

```tsx
import cn from "@/lib/utils";

// Use it to merge Tailwind classes
<div className={cn(
  "base-class",
  isActive && "active-class",
  className
)} />
```

**Old way (no longer works):**
```tsx
import { cn } from "@/lib/utils"; // ❌ This won't work
```

**New way:**
```tsx
import cn from "@/lib/utils"; // ✅ Correct
```

---

## 📝 Basic Form Example

### 1. Simple Form with FormInput

```tsx
"use client";

import { useForm, FormProvider } from "react-hook-form";
import { FormInput, Button } from "@/components/atoms";

interface FormData {
  title: string;
  price: number;
  description: string;
}

export default function MyForm() {
  const methods = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          name="title"
          label="Naziv proizvoda"
          placeholder="Unesite naziv"
          required
        />

        <FormInput
          name="price"
          label="Cena"
          type="number"
          placeholder="0"
          required
        />

        <FormInput
          name="description"
          label="Opis"
          placeholder="Opišite proizvod"
        />

        <Button type="submit" variant="primary">
          Pošalji
        </Button>
      </form>
    </FormProvider>
  );
}
```

---

## 🎨 FormInput Component

The `FormInput` component automatically connects to the form context and displays validation errors.

### Props

```tsx
interface FormInputProps {
  name: string;           // Field name (required)
  required?: boolean;     // Is field required
  label?: string;         // Field label
  placeholder?: string;   // Placeholder text
  type?: string;          // Input type (text, number, email, etc.)
  helperText?: string;    // Helper text below input
  startIcon?: ReactNode;  // Icon on the left
  endIcon?: ReactNode;    // Icon on the right
}
```

### Example with Icons

```tsx
import { Search } from "@/components/atoms/Icon";

<FormInput
  name="search"
  label="Pretraga"
  startIcon={<Search size={20} />}
  endIcon={<span className="text-secondary">RSD</span>}
/>
```

---

## ✅ Form Validation

### Built-in Validation

```tsx
const methods = useForm<FormData>({
  mode: "onChange", // Validate on change
  defaultValues: {
    title: "",
    price: 0,
  }
});

// In your form:
<FormInput
  name="email"
  label="Email"
  type="email"
  required
/>
```

### Custom Validation Rules

Use `register` from useFormContext for complex validation:

```tsx
import { useFormContext } from "react-hook-form";

const { register, formState: { errors } } = useFormContext();

<Input
  {...register("price", {
    required: "Cena je obavezna",
    min: {
      value: 200,
      message: "Minimalna cena je 200 RSD"
    },
    max: {
      value: 50000,
      message: "Maksimalna cena je 50,000 RSD"
    }
  })}
  label="Cena"
  type="number"
  error={errors.price?.message as string}
/>
```

---

## 🎯 Advanced Examples

### Multi-Step Form

```tsx
"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { FormInput, Button } from "@/components/atoms";

export default function MultiStepForm() {
  const [step, setStep] = useState(1);
  const methods = useForm();

  const onSubmit = (data: any) => {
    console.log("Final data:", data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        {step === 1 && (
          <div className="space-y-4">
            <h2>Step 1: Basic Info</h2>
            <FormInput name="title" label="Naziv" required />
            <FormInput name="description" label="Opis" />
            <Button onClick={() => setStep(2)}>Sledeće</Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2>Step 2: Pricing</h2>
            <FormInput name="price" label="Cena" type="number" required />
            <FormInput name="originalPrice" label="Originalna cena" type="number" />
            <Button onClick={() => setStep(1)}>Nazad</Button>
            <Button type="submit">Završi</Button>
          </div>
        )}
      </form>
    </FormProvider>
  );
}
```

### Radio Button Groups

```tsx
import { useFormContext } from "react-hook-form";
import type { SizeType } from "@/lib/types";

const { register } = useFormContext();
const sizes: SizeType[] = ["XS", "S", "M", "L", "XL"];

<div className="space-y-2">
  <label>Veličina *</label>
  <div className="flex gap-2">
    {sizes.map((size) => (
      <label key={size} className="cursor-pointer">
        <input
          type="radio"
          {...register("size", { required: true })}
          value={size}
          className="peer sr-only"
        />
        <div className="px-4 py-2 rounded-lg border-2 border-border peer-checked:border-primary peer-checked:bg-primary/10 transition-colors">
          {size}
        </div>
      </label>
    ))}
  </div>
</div>
```

### Checkbox Groups

```tsx
import { useFormContext } from "react-hook-form";

const { register } = useFormContext();
const brands = ["Zara", "H&M", "Mango", "Nike"];

<div className="space-y-2">
  {brands.map((brand) => (
    <label key={brand} className="flex items-center gap-2">
      <input
        type="checkbox"
        {...register("brands")}
        value={brand}
        className="w-5 h-5 rounded border-border text-primary"
      />
      <span>{brand}</span>
    </label>
  ))}
</div>
```

### Textarea

```tsx
import { useFormContext } from "react-hook-form";

const { register } = useFormContext();

<textarea
  {...register("description")}
  placeholder="Opišite proizvod..."
  className="flex min-h-[120px] w-full rounded-lg border border-border bg-surface px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary"
  rows={5}
/>
```

---

## 🎬 Complete Example: Product Listing Form

See `/app/sell/page.tsx` for a complete, production-ready example featuring:

- ✅ Multi-section form layout
- ✅ Text inputs with validation
- ✅ Number inputs for pricing
- ✅ Radio buttons for size and condition
- ✅ Textarea for description
- ✅ Form reset functionality
- ✅ Responsive design
- ✅ Serbian language

**Preview the form:**
```bash
npm run dev
# Visit http://localhost:3000/sell
```

---

## 🛠️ Common Patterns

### Get Form Values

```tsx
const { watch } = useFormContext();

// Watch specific field
const price = watch("price");

// Watch all fields
const values = watch();
```

### Set Form Values Programmatically

```tsx
const { setValue } = useFormContext();

setValue("price", 2500);
setValue("title", "Zara haljina");
```

### Reset Form

```tsx
const { reset } = useFormContext();

// Reset to default values
reset();

// Reset to new values
reset({
  title: "New title",
  price: 1000,
});
```

### Check Form State

```tsx
const { formState } = useFormContext();

console.log(formState.isValid);      // Is form valid?
console.log(formState.isDirty);      // Has form been modified?
console.log(formState.isSubmitting); // Is form submitting?
console.log(formState.errors);       // Validation errors
```

---

## 🎨 Styling Form Elements

All form components support the `cn` utility for conditional styling:

```tsx
import cn from "@/lib/utils";

<FormInput
  name="price"
  label="Cena"
  className={cn(
    "border-2",
    isPremium && "border-primary",
    isDiscount && "bg-semantic-warning/10"
  )}
/>
```

---

## 📚 Resources

- [React Hook Form Docs](https://react-hook-form.com/)
- [Validation Examples](https://react-hook-form.com/get-started#Applyvalidation)
- [API Reference](https://react-hook-form.com/api)

---

## 💡 Tips

1. **Always wrap forms with FormProvider** - This gives child components access to form context
2. **Use FormInput for simple cases** - It handles errors automatically
3. **Use register() for complex validation** - When you need custom rules
4. **Validate on submit by default** - Set `mode: "onChange"` for real-time validation
5. **Use TypeScript interfaces** - Type your form data for better DX

---

**Updated:** January 2025
**Version:** MVP 1.1
