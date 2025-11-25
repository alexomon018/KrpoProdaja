import Link from 'next/link';
import { brandsServerService } from '@/lib/api/services/brands.server';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateStaticParams() {
  const brands = await brandsServerService.getBrands();

  return brands.map((brand) => ({
    slug: brandsServerService.brandToSlug(brand.name),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const brands = await brandsServerService.getBrands();
  const brand = brands.find((b) => brandsServerService.brandToSlug(b.name) === slug);

  if (!brand) {
    return {
      title: 'Brend nije pronađen',
    };
  }

  return {
    title: `${brand.name} | KrpoProdaja`,
    description: `Kupujte ${brand.name} proizvode na KrpoProdaja. Pronađite najbolje ponude autentičnih ${brand.name} artikala.`,
  };
}

export default async function BrandPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const brands = await brandsServerService.getBrands();
  const brand = brands.find((b) => brandsServerService.brandToSlug(b.name) === slug);

  if (!brand) {
    notFound();
  }

  // TODO: Fetch products for this brand from your products API
  // For now, this is a placeholder that shows the brand information

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Početna
        </Link>
        {' / '}
        <Link href="/brands/a-z/a" className="hover:text-foreground">
          Brendovi
        </Link>
        {' / '}
        <span className="text-foreground">{brand.name}</span>
      </nav>

      {/* Brand Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{brand.name}</h1>
        <p className="text-muted-foreground">
          Pregledajte sve {brand.name} proizvode dostupne na KrpoProdaja
        </p>
      </div>

      {/* Products Grid - Placeholder */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Proizvodi</h2>
        <p className="text-muted-foreground">
          Proizvodi brenda {brand.name} će biti prikazani ovde. Potrebno je
          integrisati ovo sa API-jem za proizvode i filtrirati po brendu.
        </p>
      </div>

      {/* Back to Brands */}
      <div className="mt-8">
        <Link
          href={`/brands/a-z/${brand.name.charAt(0).toLowerCase()}`}
          className="text-primary hover:underline"
        >
          ← Nazad na brendove koji počinju sa {brand.name.charAt(0).toUpperCase()}
        </Link>
      </div>
    </div>
  );
}
