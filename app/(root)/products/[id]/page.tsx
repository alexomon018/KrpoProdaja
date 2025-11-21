import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { getQueryClient } from "@/lib/get-query-client";
import { productsService } from "@/lib/api/services/products";
import { ProductContent } from "@/components/organisms/ProductPage/ProductContent";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const queryClient = getQueryClient();

  const { id } = await params;

  try {
    const productData = await productsService.getProduct(id);

    queryClient.setQueryData(["products", id], productData);

    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProductContent productId={id} />
      </HydrationBoundary>
    );
  } catch (error) {
    // If product not found or error occurred, show 404
    notFound();
  }
}

// Force dynamic rendering to avoid prerendering errors with client components
export const dynamic = "force-dynamic";
