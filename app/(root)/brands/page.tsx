import Link from "next/link";
import { brandsServerService } from "@/lib/api/services/brands.server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brendovi A-Z | KrpoProdaja",
  description:
    "Pretražite sve modne brendove na KrpoProdaja. Pronađite svoje omiljene brendove abecednim redom.",
};

export default async function BrandsPage() {
  const brands = await brandsServerService.getBrands();
  const availableLetters = brandsServerService.getAvailableLetters(brands);
  const allLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Brendovi</h1>
      <p className="text-muted-foreground mb-8">
        Pretrazi brendove alfabeticki
      </p>

      {/* Alphabet Grid */}
      <div className="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-13 gap-4">
        {allLetters.map((letter) => {
          const isAvailable = availableLetters.includes(letter);

          if (isAvailable) {
            return (
              <Link
                key={letter}
                href={`/brands/a-z/${letter.toLowerCase()}`}
                className="aspect-square flex items-center justify-center text-2xl font-bold border-2 rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {letter}
              </Link>
            );
          }

          return (
            <div
              key={letter}
              className="aspect-square flex items-center justify-center text-2xl font-bold border-2 rounded-lg text-muted-foreground/30 cursor-not-allowed"
            >
              {letter}
            </div>
          );
        })}
      </div>

      {/* Popular Brands Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Popularni brendovi</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {brands.slice(0, 10).map((brand) => (
            <Link
              key={brand.id}
              href={`/brands/${brandsServerService.brandToSlug(brand.name)}`}
              className="p-4 border rounded-lg hover:shadow-md transition-shadow text-center font-medium"
            >
              {brand.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
