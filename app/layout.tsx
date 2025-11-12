import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@lib/ThemeContext";
import { LayoutHeader } from "@/components/organisms/LayoutHeader";

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
      <body>
        <ThemeProvider>
          <LayoutHeader />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
