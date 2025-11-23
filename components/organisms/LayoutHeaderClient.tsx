"use client";

import { Header } from "./Header/Header";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthProvider";

export function LayoutHeaderClient() {
  const pathname = usePathname();
  const { user } = useAuth();

  const handleSearch = (query: string) => {
    console.log("Global search:", query);
    // TODO: Implement global search navigation
  };

  // Only show filter button on home page
  const isHomePage = pathname === "/";

  // Map API user to Header user format
  const headerUser = user
    ? {
        email: user.email,
        avatar: user.avatar,
        firstName: user.firstName,
        lastName: user.lastName,
      }
    : undefined;

  return (
    <Header
      showSearch
      user={headerUser}
      notificationCount={0}
      onSearch={handleSearch}
      onFilterClick={isHomePage ? undefined : undefined}
    />
  );
}
