"use client";

import { Controller, useFormContext } from "react-hook-form";
import { FormInput, Typography } from "@atoms";
import { BrandsCombobox } from "@/components/molecules/BrandsCombobox";
import { GenericCombobox } from "@/components/molecules/GenericCombobox";
import type { ApiBrand, ApiCategory } from "@/lib/api/types";
import type { SizeType } from "@/lib/types";
import {
  AVAILABLE_SIZES,
  CONDITION_OPTIONS,
  COLOR_OPTIONS,
  AGE_OPTIONS,
} from "@constants";

interface ProductDetailsProps {
  brands: ApiBrand[];
  categories: ApiCategory[];
}

export function ProductDetails({ brands, categories }: ProductDetailsProps) {
  const { control, register } = useFormContext();

  return (
    <div className="bg-surface rounded-xl p-6 md:p-8 border border-border shadow-sm">
      <Typography variant="h2" className="mb-6">
        Detalji
      </Typography>

      <div className="space-y-6">
        {/* Category Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-primary">
            Kategorija *
          </label>
          <Controller
            name="category"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <GenericCombobox
                items={categories}
                value={field.value || ""}
                onValueChange={field.onChange}
                placeholder="Izaberite kategoriju..."
                searchPlaceholder="Pretraži kategoriju..."
                emptyMessage="Kategorija nije pronađena."
              />
            )}
          />
        </div>

        {/* Brand Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-primary">
            Brend
          </label>
          <Controller
            name="brand"
            control={control}
            render={({ field }) => (
              <BrandsCombobox
                brands={brands}
                value={field.value || ""}
                onValueChange={field.onChange}
                placeholder="Izaberite brend..."
                emptyMessage="Brend nije pronađen."
              />
            )}
          />
        </div>

        {/* Size Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-primary">
            Veličina *
          </label>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_SIZES.map((size) => (
              <label key={size} className="cursor-pointer">
                <input
                  type="radio"
                  {...register("size", { required: true })}
                  value={size}
                  className="peer sr-only"
                />
                <div className="px-4 py-2 rounded-lg border-2 border-border peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:text-primary font-semibold transition-colors hover:border-tertiary min-w-touch">
                  {size}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Condition Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-primary">
            Stanje *
          </label>
          <Controller
            name="condition"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <GenericCombobox
                items={CONDITION_OPTIONS as any}
                value={field.value || ""}
                onValueChange={field.onChange}
                placeholder="Izaberite stanje..."
                searchPlaceholder="Pretraži stanje..."
                emptyMessage="Stanje nije pronađeno."
              />
            )}
          />
        </div>

        {/* Color Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-primary">
            Boja
          </label>
          <Controller
            name="color"
            control={control}
            render={({ field }) => (
              <GenericCombobox
                items={COLOR_OPTIONS as any}
                value={field.value || ""}
                onValueChange={field.onChange}
                placeholder="Izaberite boju..."
                searchPlaceholder="Pretraži boju..."
                emptyMessage="Boja nije pronađena."
              />
            )}
          />
        </div>

        {/* Age/Era Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-primary">
            Era / Uzrast
          </label>
          <Controller
            name="age"
            control={control}
            render={({ field }) => (
              <GenericCombobox
                items={AGE_OPTIONS as any}
                value={field.value || ""}
                onValueChange={field.onChange}
                placeholder="Izaberite eru..."
                searchPlaceholder="Pretraži eru..."
                emptyMessage="Era nije pronađena."
              />
            )}
          />
        </div>

        <FormInput
          name="material"
          label="Materijal"
          placeholder="npr. Pamuk 95%, Elastin 5%"
        />
      </div>
    </div>
  );
}
