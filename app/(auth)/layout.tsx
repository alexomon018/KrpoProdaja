import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication - Krpo Prodaja",
  description: "Sign in or create an account to buy and sell fashion items",
};

/**
 * Auth Layout
 *
 * This layout is used for all authentication pages (login, register, etc.)
 * It excludes the header/navigation to provide a focused authentication experience
 */
export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}
