import { Suspense } from "react";
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { ProductSellForm } from "@/components/organisms/SellPage/ProductSellForm";
import { getQueryClient } from '@/lib/get-query-client';
import { brandsService } from '@/lib/api/services/brands';

export default async function SellPage() {
  const queryClient = getQueryClient();

  try {
    // Fetch brands on the server and prime the query
    const brandsData = await brandsService.getBrands();
    queryClient.setQueryData(['brands'], brandsData);
  } catch (error) {
    // Client-side fetching will handle this
    console.warn('Failed to prefetch brands:', error);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <ProductSellForm />
      </Suspense>
    </HydrationBoundary>
  );
}
