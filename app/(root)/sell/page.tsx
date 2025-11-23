import { Suspense } from "react";
import { ProductSellForm } from "@/components/organisms/SellPage/ProductSellForm";

export default function SellPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ProductSellForm />
    </Suspense>
  );
}
