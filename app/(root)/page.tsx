import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { HomeContent } from "@/components/organisms/HomePage/HomeContent";
import { getQueryClient } from '@/lib/get-query-client';
import { productsService } from '@/lib/api/services/products';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const queryClient = getQueryClient();

  try {
    // Fetch products on the server and prime the query
    const productsData = await productsService.getProducts();

    // Set the query data with the exact query key that useProducts uses
    queryClient.setQueryData(['products', undefined], productsData);
  } catch (error) {
    // During build/export, API might not be available
    // Client-side fetching will handle this
    console.warn('Failed to prefetch products:', error);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomeContent />
    </HydrationBoundary>
  );
}
