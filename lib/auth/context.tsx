"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "./server";
import type { ApiUser } from "@/lib/api/types";

interface AuthContextType {
  user: ApiUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: ApiUser | null) => void;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
  showAuthModal: (
    mode?: "login" | "register",
    redirectAfterAuth?: string
  ) => void;
  closeAuthModal: () => void;
  authModalState: {
    isOpen: boolean;
    mode: "login" | "register";
    redirectAfterAuth?: string;
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
  initialUser?: ApiUser | null;
}

export function AuthProvider({
  children,
  initialUser = null,
}: AuthProviderProps) {
  const router = useRouter();
  const [user, setUser] = useState<ApiUser | null>(initialUser);
  const [isLoading, setIsLoading] = useState(false);
  const [authModalState, setAuthModalState] = useState({
    isOpen: false,
    mode: "login" as "login" | "register",
    redirectAfterAuth: undefined as string | undefined,
  });

  const refreshUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error("Failed to refresh user:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    const { logoutAction } = await import("./actions");
    await logoutAction();
    setUser(null);
    router.push("/");
    router.refresh();
  }, [router]);

  const showAuthModal = useCallback(
    (mode: "login" | "register" = "login", redirectAfterAuth?: string) => {
      setAuthModalState({
        isOpen: true,
        mode,
        redirectAfterAuth,
      });
    },
    []
  );

  const closeAuthModal = useCallback(() => {
    setAuthModalState((prev) => ({
      ...prev,
      isOpen: false,
    }));
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    setUser,
    refreshUser,
    logout,
    showAuthModal,
    closeAuthModal,
    authModalState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Hook to require authentication - shows modal if not authenticated
export function useRequireAuth() {
  const { isAuthenticated, showAuthModal } = useAuth();

  const requireAuth = useCallback(
    (action: () => void | Promise<void>, redirectAfterAuth?: string) => {
      if (!isAuthenticated) {
        showAuthModal("login", redirectAfterAuth);
        return false;
      }
      action();
      return true;
    },
    [isAuthenticated, showAuthModal]
  );

  return { isAuthenticated, requireAuth };
}
