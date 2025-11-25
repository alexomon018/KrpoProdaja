"use client";

import { FormInput, Typography } from "@atoms";

export function ProductPricing() {
  return (
    <div className="bg-surface rounded-xl p-6 md:p-8 border border-border shadow-sm">
      <Typography variant="h2" className="mb-6">
        Cena
      </Typography>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          name="price"
          label="Prodajna cena *"
          type="number"
          placeholder="0"
          helperText="Cena u dinarima (RSD)"
          required
          endIcon={<span className="text-secondary">RSD</span>}
        />

        <FormInput
          name="originalPrice"
          label="Originalna cena"
          type="number"
          placeholder="0"
          helperText="Koliko je koštalo novo"
          endIcon={<span className="text-secondary">RSD</span>}
        />
      </div>
    </div>
  );
}
