"use client";

import { forwardRef } from "react";
import cn from "@lib/utils";
import { SearchBar } from "@molecules";
import { Button, Avatar, Typography } from "@atoms";
import {
  SlidersHorizontal,
  Bell,
  Menu,
  Moon,
  Sun,
} from "@/components/atoms/Icon/Icon";
import Link from "next/link";
import { useTheme } from "@lib/ThemeContext";

export interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Show search bar
   */
  showSearch?: boolean;
  /**
   * Callback when filter button clicked
   */
  onFilterClick?: () => void;
  /**
   * Search callback
   */
  onSearch?: (query: string) => void;
  /**
   * Current user (if logged in)
   */
  user?: {
    email: string;
    avatar?: string;
    firstName?: string;
    lastName?: string;
    name?: string;
    fullName?: string;
  };
  /**
   * Notification count
   */
  notificationCount?: number;
}

/**
 * Header Component - Atomic Design: Organism
 *
 * Main application header with:
 * - Logo/branding
 * - Search bar
 * - Filter toggle
 * - User menu
 * - Notifications
 *
 * @example
 * ```tsx
 * <Header
 *   showSearch
 *   onFilterClick={() => setFiltersOpen(true)}
 *   onSearch={(q) => handleSearch(q)}
 * />
 * ```
 */
const Header = forwardRef<HTMLElement, HeaderProps>(
  (
    {
      className,
      showSearch = true,
      onFilterClick,
      onSearch,
      user,
      notificationCount = 0,
      ...props
    },
    ref
  ) => {
    const { theme, toggleTheme } = useTheme();

    return (
      <header
        ref={ref}
        className={cn(
          "sticky top-0 z-30 bg-surface border-b border-border",
          className
        )}
        {...props}
      >
        <div className="container mx-auto px-4">
          {/* Top Row: Logo & User Actions */}
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Typography variant="h3" className="text-white font-bold">
                  KP
                </Typography>
              </div>
              <Typography variant="h3" className="hidden sm:block text-primary">
                Krpo Prodaja
              </Typography>
            </Link>

            {/* Desktop: Full Search */}
            {showSearch && (
              <div className="hidden md:block flex-1 max-w-2xl">
                <SearchBar
                  onSearch={onSearch}
                  placeholder="Pretraži po nazivu, brendu ili prodavcu"
                />
              </div>
            )}

            {/* User Actions */}
            <div className="flex items-center gap-2">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleTheme}
                className={cn(
                  "p-2 hover:bg-background rounded-lg transition-colors",
                  "hidden md:flex items-center justify-center touch-target"
                )}
                aria-label={
                  theme === "light"
                    ? "Prebaci na tamni režim"
                    : "Prebaci na svetli režim"
                }
              >
                {theme === "light" ? (
                  <Moon size={24} className="text-secondary" />
                ) : (
                  <Sun size={24} className="text-secondary" />
                )}
              </button>

              {/* Notifications */}
              <button
                className={cn(
                  "relative p-2 hover:bg-background rounded-lg transition-colors",
                  "hidden md:flex items-center justify-center touch-target"
                )}
                aria-label="Obaveštenja"
              >
                <Bell size={24} className="text-secondary" />
                {notificationCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
                )}
              </button>

              {/* Desktop: Sell Button */}
              <Link href={"/sell"} className="hidden md:block">
                <Button variant="primary" size="sm">
                  Prodaj
                </Button>
              </Link>

              {/* User Avatar or Login/Register */}
              {user ? (
                <Link href="/profile">
                  <Avatar
                    src={user.avatar}
                    alt={user.name || user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email}
                    fallback={user.email?.[0]?.toUpperCase() || "?"}
                    size="md"
                  />
                </Link>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link href="/login">
                    <Button variant="ghost" size="sm">
                      Prijavi se
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="primary" size="sm">
                      Registruj se
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile: Menu */}
              <button
                className={cn(
                  "p-2 hover:bg-background rounded-lg transition-colors",
                  "md:hidden touch-target"
                )}
                aria-label="Meni"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>

          {/* Mobile: Search Bar */}
          {showSearch && (
            <div className="md:hidden pb-3">
              <div className="flex gap-2">
                <div className="flex-1">
                  <SearchBar onSearch={onSearch} placeholder="Pretraži..." />
                </div>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={toggleTheme}
                  aria-label={
                    theme === "light" ? "Tamni režim" : "Svetli režim"
                  }
                >
                  {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={onFilterClick}
                  aria-label="Filteri"
                >
                  <SlidersHorizontal size={20} />
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>
    );
  }
);

Header.displayName = "Header";

export { Header };
