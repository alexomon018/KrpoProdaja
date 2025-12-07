"use client";

import { FormProvider } from "react-hook-form";
import { BottomNavigation } from "@organisms";
import { Button, Typography, Container } from "@atoms";
import { useProductCreation } from "@/lib/api/hooks/useProductCreation";
import { ProductImages } from "./ProductImages";
import { ProductBasicInfo } from "./ProductBasicInfo";
import { ProductPricing } from "./ProductPricing";
import { ProductDetails } from "./ProductDetails";
import { ProductLocation } from "./ProductLocation";

export function ProductSellForm() {
  const {
    methods,
    onSubmit,
    handleReset,
    setImageFiles,
    brands,
    categories,
    formError,
    isSubmitting,
  } = useProductCreation();

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
              {/* Images Section */}
              <ProductImages
                onFilesChange={setImageFiles}
                disabled={isSubmitting}
              />

              {/* Basic Information Section */}
              <ProductBasicInfo />

              {/* Pricing Section */}
              <ProductPricing />

              {/* Details Section */}
              <ProductDetails brands={brands} categories={categories} />

              {/* Location Section */}
              <ProductLocation />

              {/* Submit */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  size="lg"
                  className="sm:flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Objavljivanje..."
                    : "Objavi proizvod"}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  onClick={handleReset}
                  disabled={isSubmitting}
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
