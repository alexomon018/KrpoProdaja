import type { Metadata } from "next";
// import { Source_Sans_3, Lato } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@lib/ThemeContext";
import { QueryProvider } from "@lib/QueryProvider";
import { LayoutHeaderWrapper } from "@/components/organisms/LayoutHeaderWrapper";

// Temporarily disabled Google Fonts due to network issues
// const sourceSans = Source_Sans_3({
//   subsets: ["latin"],
//   variable: "--font-source-sans",
//   display: "swap",
// });

// const lato = Lato({
//   subsets: ["latin"],
//   weight: ["400", "700"],
//   variable: "--font-lato",
//   display: "swap",
// });

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
        <QueryProvider>
          <ThemeProvider>
            <LayoutHeaderWrapper />
            {children}
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
