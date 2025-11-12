"use client";

import { Header } from "./Header/Header";
import { mockUsers } from "@/lib/mockData";
import { usePathname } from "next/navigation";

/**
 * LayoutHeader Component
 *
 * Wrapper around Header for use in the root layout.
 * Handles routing and global header state.
 */
export function LayoutHeader() {
  const pathname = usePathname();

  // Mock user (logged in)
  const currentUser = {
    username: mockUsers[0].username,
    avatar: mockUsers[0].avatar,
  };

  const handleSearch = (query: string) => {
    console.log("Global search:", query);
    // TODO: Implement global search navigation
  };

  // Only show filter button on home page
  const isHomePage = pathname === "/";

  return (
    <Header
      showSearch
      user={currentUser}
      notificationCount={3}
      onSearch={handleSearch}
      onFilterClick={isHomePage ? undefined : undefined}
    />
  );
}
