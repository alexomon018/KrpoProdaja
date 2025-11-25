"use client";

import { useFormContext } from "react-hook-form";
import { FormInput, Typography } from "@atoms";

export function ProductBasicInfo() {
  const { register } = useFormContext();

  return (
    <div className="bg-surface rounded-xl p-6 md:p-8 border border-border shadow-sm">
      <Typography variant="h2" className="mb-6">
        Osnovne informacije
      </Typography>

      <div className="space-y-6">
        <FormInput
          name="title"
          label="Naziv proizvoda *"
          placeholder="npr. Zara crna haljina"
          required
          helperText="Najmanje 10 karaktera"
          validation={{
            minLength: {
              value: 10,
              message: "Naziv mora imati najmanje 10 karaktera",
            },
          }}
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-primary">Opis</label>
          <textarea
            {...register("description")}
            placeholder="Opišite proizvod, stanje, veličinu..."
            className="flex min-h-[120px] w-full rounded-lg border border-border bg-surface px-3 py-2 text-base text-charchoal-100 placeholder:text-tertiary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring transition-colors"
            rows={5}
          />
        </div>
      </div>
    </div>
  );
}
