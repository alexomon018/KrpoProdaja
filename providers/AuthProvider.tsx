"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/server";
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

  // Use state only for client-side mutations (login, logout, refresh)
  // Prefer initialUser from server when available
  const [clientUser, setClientUser] = useState<ApiUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [authModalState, setAuthModalState] = useState({
    isOpen: false,
    mode: "login" as "login" | "register",
    redirectAfterAuth: undefined as string | undefined,
  });

  // Use initialUser (from server) if available, otherwise fall back to clientUser (from client-side mutations)
  const user = initialUser || clientUser;

  const refreshUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const currentUser = await getCurrentUser();
      setClientUser(currentUser);
    } catch (error) {
      console.error("Failed to refresh user:", error);
      setClientUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    const { logoutAction } = await import("@/lib/auth/actions");
    await logoutAction();
    setClientUser(null);
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
    setUser: setClientUser,
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
