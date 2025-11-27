"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { SellerInfo } from "./SellerInfo";
import { useRequireAuth } from "@/providers/AuthProvider";
import type { UserType } from "@/lib/types";

export interface ClickableSellerInfoProps {
  seller: UserType;
  /**
   * Compact version for product cards
   */
  compact?: boolean;
}

/**
 * ClickableSellerInfo Component - Wrapper for SellerInfo with navigation
 *
 * Adds click handling to navigate to seller profile and messaging
 * Requires authentication for messaging functionality
 *
 * @example
 * ```tsx
 * <ClickableSellerInfo seller={sellerData} />
 * ```
 */
export function ClickableSellerInfo({
  seller,
  compact = false,
}: ClickableSellerInfoProps) {
  const router = useRouter();
  const { requireAuth } = useRequireAuth();

  const handleProfileClick = () => {
    // Navigate to seller's profile
    router.push(`/profile/${seller.id}`);
  };

  const handleMessageClick = () => {
    // Require authentication before allowing messaging
    requireAuth(() => {
      // TODO: Implement messaging functionality
      console.log("Open message to seller:", seller.id);
      // For now, you could navigate to a messages page or open a modal
      // router.push(`/messages/${seller.id}`);
    });
  };

  return (
    <SellerInfo
      seller={seller}
      onProfileClick={handleProfileClick}
      onMessageClick={handleMessageClick}
      compact={compact}
    />
  );
}
