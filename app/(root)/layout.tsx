import type { Metadata } from "next";
import { LayoutHeaderClient } from "@/components/organisms/LayoutHeaderClient";
import { FilterProvider } from "@/providers/FilterProvider";

export const metadata: Metadata = {
  title: "Root - Krpo Prodaja",
  description: "Root",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <FilterProvider>
      <div className="min-h-screen bg-background">
        <LayoutHeaderClient />
        {children}
      </div>
    </FilterProvider>
  );
}
