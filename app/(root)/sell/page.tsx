import { Suspense } from "react";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { ProductSellForm } from "@/components/organisms/SellPage/ProductSellForm";
import { getQueryClient } from "@/lib/get-query-client";
import { brandsService } from "@/lib/api/services/brands";
import { categoriesService } from "@/lib/api/services/categories";
import { citiesService } from "@/lib/api/services/cities";

export default async function SellPage() {
  const queryClient = getQueryClient();

  try {
    const [brandsData, categoriesData] = await Promise.all([
      brandsService.getBrands(),
      categoriesService.getCategories(),
    ]);

    queryClient.setQueryData(["brands"], brandsData);
    queryClient.setQueryData(["categories"], categoriesData);
  } catch (error) {
    console.warn("Failed to prefetch data:", error);
  }

  try {
    const citiesData = await citiesService.getCities();
    queryClient.setQueryData(["cities"], citiesData);
  } catch (error) {
    console.warn("Failed to prefetch cities:", error);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <ProductSellForm />
      </Suspense>
    </HydrationBoundary>
  );
}
