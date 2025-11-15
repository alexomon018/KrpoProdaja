import { HomeContent } from "@/components/organisms/HomePage/HomeContent";
import { mockProducts } from "@/lib/mockData";

export default function HomePage() {
  // Server component - can do data fetching here
  const products = mockProducts;

  return <HomeContent initialProducts={products} />;
}
