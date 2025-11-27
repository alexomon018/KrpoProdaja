"use client";

import { useAuth } from "@/providers/AuthProvider";
import { AuthModal } from "./AuthModal";

/**
 * AuthModalManager - Global auth modal that integrates with AuthContext
 *
 * This component should be placed once in the root layout.
 * It automatically manages the modal state based on the auth context.
 */
export function AuthModalManager() {
  const { authModalState, closeAuthModal } = useAuth();

  return (
    <AuthModal
      open={authModalState.isOpen}
      onOpenChange={(open) => {
        if (!open) {
          closeAuthModal();
        }
      }}
      defaultMode={authModalState.mode}
      redirectAfterAuth={authModalState.redirectAfterAuth}
    />
  );
}
