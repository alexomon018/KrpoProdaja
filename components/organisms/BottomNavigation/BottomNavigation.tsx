"use client";

import * as React from "react";
import cn from "@/lib/utils";
import { Home, Search, Plus, MessageCircle, User } from "@/components/atoms/Icon/Icon";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface NavigationItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export interface BottomNavigationProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Badge count for messages
   */
  messageCount?: number;
}

/**
 * BottomNavigation Component - Atomic Design: Organism
 *
 * Mobile-first bottom tab navigation following Vinted's pattern:
 * - 5 main actions: Home, Search, Sell, Messages, Profile
 * - Active state indication
 * - Touch-optimized (48px height)
 * - Fixed to bottom on mobile
 *
 * @example
 * ```tsx
 * <BottomNavigation messageCount={3} />
 * ```
 */
const BottomNavigation = React.forwardRef<HTMLElement, BottomNavigationProps>(
  ({ className, messageCount = 0, ...props }, ref) => {
    const pathname = usePathname();

    const navigationItems: NavigationItem[] = [
      {
        label: "Početna",
        href: "/",
        icon: <Home size={24} />,
      },
      {
        label: "Pretraga",
        href: "/search",
        icon: <Search size={24} />,
      },
      {
        label: "Prodaj",
        href: "/sell",
        icon: <Plus size={24} />,
      },
      {
        label: "Poruke",
        href: "/messages",
        icon: <MessageCircle size={24} />,
      },
      {
        label: "Profil",
        href: "/profile",
        icon: <User size={24} />,
      },
    ];

    return (
      <nav
        ref={ref}
        className={cn(
          "fixed bottom-0 left-0 right-0 z-40",
          "bg-surface border-t border-border",
          "md:hidden", // Hide on desktop
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-around h-16 px-2 safe-area-inset-bottom">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            const showBadge = item.href === "/messages" && messageCount > 0;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1",
                  "min-w-touch min-h-touch rounded-lg",
                  "transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-text-tertiary hover:text-text-secondary"
                )}
              >
                <div className="relative">
                  {item.icon}
                  {showBadge && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                      {messageCount > 9 ? "9+" : messageCount}
                    </span>
                  )}
                </div>
                <span
                  className={cn(
                    "text-[10px] font-medium",
                    isActive && "font-semibold"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    );
  }
);

BottomNavigation.displayName = "BottomNavigation";

export { BottomNavigation };
