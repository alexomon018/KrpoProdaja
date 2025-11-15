import type { Metadata } from "next";
import { Source_Sans_3, Lato } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@lib/ThemeContext";
import { QueryProvider } from "@lib/QueryProvider";
import { AuthProvider } from "@/lib/auth/context";
import { AuthModalManager } from "@/components/organisms/AuthModal/AuthModalManager";
import { getCurrentUser } from "@/lib/auth/server";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lato",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Krpo Prodaja - Serbian Fashion Resale Marketplace",
  description: "Buy and sell pre-loved fashion items in Serbia",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html lang="sr">
      <body>
        <QueryProvider>
          <ThemeProvider>
            <AuthProvider initialUser={user}>
              {children}
              <AuthModalManager />
            </AuthProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
