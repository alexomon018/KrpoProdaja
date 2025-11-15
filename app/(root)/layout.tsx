import type { Metadata } from "next";
import { LayoutHeaderClient } from "@/components/organisms/LayoutHeaderClient";

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
    <div className="min-h-screen bg-background">
      <LayoutHeaderClient />
      {children}
    </div>
  );
}
