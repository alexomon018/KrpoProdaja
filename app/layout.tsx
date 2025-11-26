import type { Metadata } from "next";
import { Source_Sans_3, Lato } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@lib/ThemeContext";
import { QueryProvider } from "@lib/QueryProvider";
import { AuthProvider } from "@/lib/auth/AuthProvider";
import { AuthModalManager } from "@/components/organisms/AuthModal/AuthModalManager";
import { getCurrentUser } from "@/lib/auth/server";
import { GoogleOAuthProvider } from "@/components/providers/GoogleOAuthProvider";
import { FacebookSDKProvider } from "@/components/providers/FacebookSDKProvider";

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
  icons: {
    icon: [
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" }
    ],
    shortcut: "/favicon.ico",
    apple: { url: "/apple-touch-icon.png", sizes: "180x180" }
  },
  appleWebApp: {
    title: "KrpoProdaja"
  },
  manifest: "/site.webmanifest"
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html lang="sr">
      <body className={`${sourceSans.variable} ${lato.variable}`}>
        <FacebookSDKProvider />
        <QueryProvider>
          <ThemeProvider>
            <GoogleOAuthProvider>
              <AuthProvider initialUser={user}>
                {children}
                <AuthModalManager />
              </AuthProvider>
            </GoogleOAuthProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
