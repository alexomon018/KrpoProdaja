"use client";

import * as React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Header, BottomNavigation } from "@organisms";
import { FormInput, Button, Typography, Container } from "@atoms";
import type { SizeType, ConditionType } from "@lib/types";

interface ProductFormData {
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  brand?: string;
  size: SizeType;
  condition: ConditionType;
  color?: string;
  material?: string;
  location: string;
}

export default function SellPage() {
  const methods = useForm<ProductFormData>({
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      location: "Beograd",
    },
  });

  const onSubmit = (data: ProductFormData) => {
    console.log("Form submitted:", data);
    // TODO: Handle form submission
  };

  const availableSizes: SizeType[] = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
  const availableConditions: { value: ConditionType; label: string }[] = [
    { value: "new", label: "Novo sa etiketom" },
    { value: "very-good", label: "Vrlo dobro" },
    { value: "good", label: "Dobro" },
    { value: "satisfactory", label: "Zadovoljavajuće" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <Header showSearch={false} />

      <main className="py-6 md:py-12">
        <Container size="regular" className="max-w-5xl">
          <div className="mb-8">
            <Typography variant="h1" className="mb-2 text-center md:text-left">
              Prodaj svoj proizvod
            </Typography>
            <Typography variant="body" className="text-text-secondary text-center md:text-left">
              Popunite informacije o proizvodu koji želite da prodate
            </Typography>
          </div>

          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6 md:space-y-8">
            {/* Step 1: Basic Information */}
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
                />

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-text-primary">
                    Opis
                  </label>
                  <textarea
                    {...methods.register("description")}
                    placeholder="Opišite proizvod, stanje, veličinu..."
                    className="flex min-h-[120px] w-full rounded-lg border border-border bg-surface px-3 py-2 text-base text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    rows={5}
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Price */}
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
                  endIcon={<span className="text-text-secondary">RSD</span>}
                />

                <FormInput
                  name="originalPrice"
                  label="Originalna cena"
                  type="number"
                  placeholder="0"
                  helperText="Koliko je koštalo novo"
                  endIcon={<span className="text-text-secondary">RSD</span>}
                />
              </div>
            </div>

            {/* Step 3: Details */}
            <div className="bg-surface rounded-xl p-6 md:p-8 border border-border shadow-sm">
              <Typography variant="h2" className="mb-6">
                Detalji
              </Typography>

              <div className="space-y-6">
                <FormInput
                  name="brand"
                  label="Brend"
                  placeholder="npr. Zara, H&M, Nike"
                />

                {/* Size Selection */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-text-primary">
                    Veličina *
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map((size) => (
                      <label
                        key={size}
                        className="cursor-pointer"
                      >
                        <input
                          type="radio"
                          {...methods.register("size", { required: true })}
                          value={size}
                          className="peer sr-only"
                        />
                        <div className="px-4 py-2 rounded-lg border-2 border-border peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:text-primary font-semibold transition-colors hover:border-text-tertiary min-w-touch">
                          {size}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Condition Selection */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-text-primary">
                    Stanje *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {availableConditions.map((condition) => (
                      <label
                        key={condition.value}
                        className="cursor-pointer"
                      >
                        <input
                          type="radio"
                          {...methods.register("condition", { required: true })}
                          value={condition.value}
                          className="peer sr-only"
                        />
                        <div className="p-3 rounded-lg border-2 border-border peer-checked:border-primary peer-checked:bg-primary/10 transition-colors hover:border-text-tertiary">
                          <Typography variant="bodySmall" className="font-medium">
                            {condition.label}
                          </Typography>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <FormInput
                  name="color"
                  label="Boja"
                  placeholder="npr. Crna, Bela, Plava"
                />

                <FormInput
                  name="material"
                  label="Materijal"
                  placeholder="npr. Pamuk 95%, Elastin 5%"
                />
              </div>
            </div>

            {/* Step 4: Location */}
            <div className="bg-surface rounded-xl p-6 md:p-8 border border-border shadow-sm">
              <Typography variant="h2" className="mb-6">
                Lokacija
              </Typography>

              <FormInput
                name="location"
                label="Grad *"
                placeholder="Beograd"
                required
              />
            </div>

            {/* Submit */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="submit"
                variant="primary"
                fullWidth
                size="lg"
                className="sm:flex-1"
              >
                Objavi proizvod
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={() => methods.reset()}
                className="sm:w-auto"
              >
                Poništi
              </Button>
            </div>
          </form>
        </FormProvider>
        </Container>
      </main>

      <BottomNavigation />
    </div>
  );
}
