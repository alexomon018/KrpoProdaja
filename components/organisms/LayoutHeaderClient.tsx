"use client";

import { Header } from "./Header/Header";
import { usePathname } from "next/navigation";
import type { ApiUser } from "@/lib/api/types";

interface LayoutHeaderClientProps {
  user: ApiUser | null;
}

/**
 * LayoutHeaderClient Component
 *
 * Client component wrapper around Header for use in the root layout.
 * Handles routing and global header state.
 */
export function LayoutHeaderClient({ user }: LayoutHeaderClientProps) {
  const pathname = usePathname();

  const handleSearch = (query: string) => {
    console.log("Global search:", query);
    // TODO: Implement global search navigation
  };

  // Only show filter button on home page
  const isHomePage = pathname === "/";

  // Map API user to Header user format

  const headerUser = user
    ? {
        username: user.username,
        avatar: user.avatar,
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
