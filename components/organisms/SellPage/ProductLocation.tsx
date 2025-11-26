"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Typography } from "@atoms";
import { GenericCombobox } from "@/components/molecules/GenericCombobox/GenericCombobox";
import { useCities } from "@/lib/api/hooks";

export function ProductLocation() {
  const { control } = useFormContext();
  const { data: citiesResponse } = useCities();

  // Transform cities to ComboboxItem format (add unique id property)
  const cities = (citiesResponse?.cities || []).map((city, index) => ({
    id: `${city.name}-${index}`, // Use name + index for unique key
    name: city.name,
  }));

  return (
    <div className="bg-surface rounded-xl p-6 md:p-8 border border-border shadow-sm">
      <Typography variant="h2" className="mb-6">
        Lokacija
      </Typography>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-primary">Grad *</label>
        <Controller
          name="location"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <GenericCombobox
              items={cities}
              value={field.value || ""}
              onValueChange={field.onChange}
              placeholder="Izaberite grad..."
              searchPlaceholder="Pretraži grad..."
              emptyMessage="Grad nije pronađen."
            />
          )}
        />
      </div>
    </div>
  );
}
