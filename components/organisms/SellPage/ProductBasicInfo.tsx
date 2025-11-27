"use client";

import { useFormContext } from "react-hook-form";
import { FormInput, Textarea, Typography } from "@atoms";

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

        <Textarea
          {...register("description")}
          label="Opis"
          placeholder="Opišite proizvod, stanje, veličinu..."
          className="min-h-[120px]"
          rows={5}
        />
      </div>
    </div>
  );
}
