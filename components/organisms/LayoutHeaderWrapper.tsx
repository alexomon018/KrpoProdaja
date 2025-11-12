"use client";

import { usePathname } from "next/navigation";
import { LayoutHeader } from "./LayoutHeader";

/**
 * Wrapper component that conditionally renders the header based on the current route
 * Hides the header on authentication pages (login, register, etc.)
 */
export function LayoutHeaderWrapper() {
  const pathname = usePathname();

  // Hide header on auth pages
  const isAuthPage =
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/register") ||
    pathname?.startsWith("/reset-password") ||
    pathname?.startsWith("/verify-email");

  if (isAuthPage) {
    return null;
  }

  return <LayoutHeader />;
}
