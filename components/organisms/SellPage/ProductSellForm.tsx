"use client";

import * as React from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { BottomNavigation } from "@organisms";
import { FormInput, Button, Typography, Container } from "@atoms";
import { ImageUpload } from "@molecules";
import { BrandsCombobox } from "@/components/molecules/BrandsCombobox";
import { uploadService } from "@lib/api";
import { useCreateProduct } from "@lib/api/hooks/useProducts";
import { useBrands } from "@lib/api/hooks";
import { useRequireAuth } from "@/lib/auth/AuthProvider";
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
  const { requireAuth } = useRequireAuth();
  const [imageUrls, setImageUrls] = React.useState<string[]>([]);
  const [imageFiles, setImageFiles] = React.useState<File[]>([]);
  const [formError, setFormError] = React.useState<string | null>(null);

  // Fetch brands - will use server-side prefetched data
  const { data: brandsResponse } = useBrands();
  const brands = brandsResponse?.brands || [];

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
    mode: "onBlur",
  });

  const createProductMutation = useCreateProduct();

  // Map local condition types to API condition types
  const mapConditionToApi = (condition: ConditionType): ProductCondition => {
    const mapping: Record<ConditionType, ProductCondition> = {
      new: "new",
      "very-good": "very-good",
      good: "good",
      satisfactory: "satisfactory",
    };
    return mapping[condition];
  };

  const onSubmit = async (data: ProductFormData) => {
    // Check if user is authenticated before proceeding
    // If not authenticated, requireAuth will show the auth modal and return false
    requireAuth(async () => {
      await handleProductSubmission(data);
    });
  };

  const handleProductSubmission = async (data: ProductFormData) => {
    setFormError(null);

    // Validate that at least one image is selected
    if (imageFiles.length === 0 && imageUrls.length === 0) {
      setFormError("Molimo dodajte bar jednu sliku proizvoda");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      // Upload images first if there are any files
      let uploadedImageUrls = [...imageUrls];

      if (imageFiles.length > 0) {
        console.log("Uploading images:", imageFiles.length);
        uploadedImageUrls = await uploadService.uploadImages(imageFiles);
        console.log("Upload result:", uploadedImageUrls);

        // Filter out any null/undefined URLs
        uploadedImageUrls = uploadedImageUrls.filter(
          (url) => url != null && url !== ""
        );

        if (uploadedImageUrls.length === 0) {
          throw new Error(
            "Upload nije uspeo - nisu primljene URL adrese slika"
          );
        }
      }

      // Create product with uploaded image URLs
      // TODO: Replace with actual category selection
      // Using a placeholder UUID - you'll need to get a real category ID from your backend
      const PLACEHOLDER_CATEGORY_ID = "69d0c42a-2d5a-464b-870d-29f60707bec7";

      const productData = {
        title: data.title,
        description: data.description || undefined,
        price: Number(data.price),
        categoryId: PLACEHOLDER_CATEGORY_ID,
        condition: mapConditionToApi(data.condition),
        size: data.size,
        brand: data.brand || undefined,
        color: data.color || undefined,
        location: data.location,
        images: uploadedImageUrls,
      };

      const response = await createProductMutation.mutateAsync(productData);

      if (response.product?.id) {
        router.push(`/products/${response.product.id}`);
      } else {
        console.error("Product ID is undefined in response:", response);
        setFormError(
          "Proizvod je kreiran, ali ID nije pronađen u odgovoru servera."
        );
      }
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
                <ImageUpload
                  variant="labeled"
                  maxFiles={8}
                  maxSizeMB={5}
                  onFilesChange={setImageFiles}
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
                    helperText="Najmanje 10 karaktera"
                    validation={{
                      minLength: {
                        value: 10,
                        message: "Naziv mora imati najmanje 10 karaktera",
                      },
                    }}
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
                  {/* Brand Selection */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-primary">
                      Brend
                    </label>
                    <Controller
                      name="brand"
                      control={methods.control}
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
                  {createProductMutation.isPending
                    ? "Objavljivanje..."
                    : "Objavi proizvod"}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  onClick={() => {
                    methods.reset();
                    setImageUrls([]);
                    setImageFiles([]);
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
