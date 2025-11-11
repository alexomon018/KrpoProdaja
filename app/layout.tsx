import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Krpo Prodaja - Serbian Fashion Resale Marketplace",
  description: "Buy and sell pre-loved fashion items in Serbia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sr">
      <body>{children}</body>
    </html>
  );
}
