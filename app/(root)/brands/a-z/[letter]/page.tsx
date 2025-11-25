import Link from 'next/link';
import { brandsServerService } from '@/lib/api/services/brands.server';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ letter: string }>;
};

export async function generateStaticParams() {
  const brands = await brandsServerService.getBrands();
  const letters = brandsServerService.getAvailableLetters(brands);

  return letters.map((letter) => ({
    letter: letter.toLowerCase(),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { letter } = await params;
  const upperLetter = letter.toUpperCase();

  return {
    title: `Brendovi koji počinju sa ${upperLetter} | KrpoProdaja`,
    description: `Pregledajte sve modne brendove koji počinju slovom ${upperLetter}. Pronađite svoje omiljene brendove i otkrijte nove.`,
  };
}

export default async function BrandsLetterPage({ params }: Props) {
  const { letter } = await params;
  const upperLetter = letter.toUpperCase();

  const brands = await brandsServerService.getBrands();
  const groupedBrands = brandsServerService.groupBrandsByLetter(brands);
  const availableLetters = brandsServerService.getAvailableLetters(brands);
  const brandsForLetter = groupedBrands[upperLetter] || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        Brendovi koji počinju sa {upperLetter}
      </h1>

      {/* Letter Navigation */}
      <div className="mb-8 flex flex-wrap gap-2">
        {availableLetters.map((l) => (
          <Link
            key={l}
            href={`/brands/a-z/${l.toLowerCase()}`}
            className={`px-3 py-2 rounded-md transition-colors ${
              l === upperLetter
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            {l}
          </Link>
        ))}
      </div>

      {/* Brands List */}
      {brandsForLetter.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {brandsForLetter.map((brand) => (
            <Link
              key={brand.id}
              href={`/brands/${brandsServerService.brandToSlug(brand.name)}`}
              className="p-4 border rounded-lg hover:shadow-md transition-shadow"
            >
              <h2 className="font-medium text-center">{brand.name}</h2>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">
          Nema brendova koji počinju sa {upperLetter}.
        </p>
      )}
    </div>
  );
}
