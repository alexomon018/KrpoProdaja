"use client";

import * as React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { BottomNavigation } from "@organisms";
import { FormInput, Button, Typography, Container } from "@atoms";
import { ImageUpload } from "@molecules";
import { useCreateProduct } from "@lib/api/hooks/useProducts";
import type { SizeType, ConditionType } from "@lib/types";
import type { ProductCondition } from "@lib/api";

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

export function ProductSellForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [imageUrls, setImageUrls] = React.useState<string[]>([]);
  const [formError, setFormError] = React.useState<string | null>(null);

  // Extract query parameters for pre-filling form
  const titleParam = searchParams.get("title");
  const priceParam = searchParams.get("price");
  const brandParam = searchParams.get("brand");
  const locationParam = searchParams.get("location");

  const methods = useForm<ProductFormData>({
    defaultValues: {
      title: titleParam || "",
      description: "",
      price: priceParam ? Number(priceParam) : 0,
      brand: brandParam || "",
      location: locationParam || "Beograd",
    },
  });

  const createProductMutation = useCreateProduct();

  // Map local condition types to API condition types
  const mapConditionToApi = (condition: ConditionType): ProductCondition => {
    const mapping: Record<ConditionType, ProductCondition> = {
      "new": "new",
      "very-good": "like-new",
      "good": "good",
      "satisfactory": "fair",
    };
    return mapping[condition];
  };

  const onSubmit = async (data: ProductFormData) => {
    setFormError(null);

    // Validate that at least one image is uploaded
    if (imageUrls.length === 0) {
      setFormError("Molimo dodajte bar jednu sliku proizvoda");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      // Create product with uploaded image URLs
      const product = await createProductMutation.mutateAsync({
        title: data.title,
        description: data.description || undefined,
        price: Number(data.price),
        categoryId: 1, // TODO: Add category selection to form
        condition: mapConditionToApi(data.condition),
        size: data.size,
        brand: data.brand || undefined,
        color: data.color || undefined,
        location: data.location,
        images: imageUrls,
      });

      // Navigate to product detail page or success page
      router.push(`/products/${product.id}`);
    } catch (error) {
      console.error("Failed to create product:", error);
      setFormError(
        error instanceof Error
          ? error.message
          : "Greška pri kreiranju proizvoda. Pokušajte ponovo."
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
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
      <main className="py-6 md:py-12">
        <Container size="regular" className="max-w-5xl">
          <div className="mb-8">
            <Typography variant="h1" className="mb-2 text-center md:text-left">
              Prodaj svoj proizvod
            </Typography>
            <Typography
              variant="body"
              className="text-secondary text-center md:text-left"
            >
              Popunite informacije o proizvodu koji želite da prodate
            </Typography>
          </div>

          {/* Error Message */}
          {formError && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              <Typography variant="body">{formError}</Typography>
            </div>
          )}

          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(onSubmit)}
              className="space-y-6 md:space-y-8"
            >
              {/* Step 0: Images */}
              <div className="bg-surface rounded-xl p-6 md:p-8 border border-border shadow-sm">
                <Typography variant="h2" className="mb-2">
                  Fotografije *
                </Typography>
                <Typography variant="bodySmall" className="text-secondary mb-6">
                  Dodajte do 5 slika. Prva slika će biti glavna slika proizvoda.
                </Typography>

                <ImageUpload
                  maxFiles={5}
                  maxSizeMB={5}
                  onImagesChange={setImageUrls}
                  disabled={createProductMutation.isPending}
                />
              </div>

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
                    <label className="block text-sm font-medium text-primary">
                      Opis
                    </label>
                    <textarea
                      {...methods.register("description")}
                      placeholder="Opišite proizvod, stanje, veličinu..."
                      className="flex min-h-[120px] w-full rounded-lg border border-border bg-surface px-3 py-2 text-base text-primary placeholder:text-tertiary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
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
                    <label className="block text-sm font-medium text-primary">
                      Veličina *
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {availableSizes.map((size) => (
                        <label key={size} className="cursor-pointer">
                          <input
                            type="radio"
                            {...methods.register("size", { required: true })}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {availableConditions.map((condition) => (
                        <label key={condition.value} className="cursor-pointer">
                          <input
                            type="radio"
                            {...methods.register("condition", {
                              required: true,
                            })}
                            value={condition.value}
                            className="peer sr-only"
                          />
                          <div className="p-3 rounded-lg border-2 border-border peer-checked:border-primary peer-checked:bg-primary/10 transition-colors hover:border-tertiary">
                            <Typography
                              variant="bodySmall"
                              className="font-medium"
                            >
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
                  disabled={createProductMutation.isPending}
                >
                  {createProductMutation.isPending ? "Objavljivanje..." : "Objavi proizvod"}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  onClick={() => {
                    methods.reset();
                    setImageUrls([]);
                    setFormError(null);
                  }}
                  disabled={createProductMutation.isPending}
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
