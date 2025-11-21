"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  LoginForm,
  LoginFormData,
} from "@/components/molecules/AuthForm/LoginForm";
import {
  RegisterForm,
  RegisterFormData,
} from "@/components/molecules/AuthForm/RegisterForm";
import {
  loginAction,
  registerAction,
  googleAuthAction,
  facebookAuthAction,
} from "@/lib/auth";
import { useAuth } from "@/lib/auth/AuthProvider";

interface AuthModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultMode?: "login" | "register";
  redirectAfterAuth?: string;
}

export function AuthModal({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  defaultMode = "login",
  redirectAfterAuth,
}: AuthModalProps) {
  const router = useRouter();
  const { setUser, closeAuthModal } = useAuth();
  const [mode, setMode] = useState<"login" | "register">(defaultMode);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();

  const handleLogin = (data: LoginFormData) => {
    setError(undefined);

    startTransition(async () => {
      const result = await loginAction({
        email: data.email,
        password: data.password,
      });

      if (result.success && result.data) {
        // Update auth context with the user data from the response
        setUser(result.data.user);

        // Close the modal
        if (controlledOnOpenChange) {
          controlledOnOpenChange(false);
        } else {
          closeAuthModal();
        }

        // Redirect if specified, or refresh the current page to update server components
        if (redirectAfterAuth) {
          router.push(redirectAfterAuth);
        } else {
          router.refresh();
        }
      } else {
        setError(
          result.error ||
            "Email ili lozinka nisu ispravni. Molimo pokušajte ponovo."
        );
      }
    });
  };

  const handleRegister = (data: RegisterFormData) => {
    setError(undefined);

    startTransition(async () => {
      // Map form data to API request format
      const result = await registerAction({
        email: data.email,
        password: data.password,
      });

      if (result.success && result.data) {
        // Update auth context with the user data from the response
        setUser(result.data.user);

        // Close the modal
        if (controlledOnOpenChange) {
          controlledOnOpenChange(false);
        } else {
          closeAuthModal();
        }

        // Redirect if specified, or refresh the current page to update server components
        if (redirectAfterAuth) {
          router.push(redirectAfterAuth);
        } else {
          router.refresh();
        }
      } else {
        setError(
          result.error || "Greška pri registraciji. Molimo pokušajte ponovo."
        );
      }
    });
  };

  const handleGoogleSuccess = (idToken: string) => {
    setError(undefined);

    startTransition(async () => {
      const result = await googleAuthAction(idToken);

      if (result.success && result.data) {
        // Update auth context with the user data from the response
        setUser(result.data.user);

        // Close the modal
        if (controlledOnOpenChange) {
          controlledOnOpenChange(false);
        } else {
          closeAuthModal();
        }

        // Redirect if specified, or refresh the current page to update server components
        if (redirectAfterAuth) {
          router.push(redirectAfterAuth);
        } else {
          router.refresh();
        }
      } else {
        setError(
          result.error ||
            "Google prijavljivanje nije uspelo. Molimo pokušajte ponovo."
        );
      }
    });
  };

  const handleFacebookSuccess = (accessToken: string) => {
    setError(undefined);

    startTransition(async () => {
      const result = await facebookAuthAction(accessToken);

      if (result.success && result.data) {
        // Update auth context with the user data from the response
        setUser(result.data.user);

        // Close the modal
        if (controlledOnOpenChange) {
          controlledOnOpenChange(false);
        } else {
          closeAuthModal();
        }

        // Redirect if specified, or refresh the current page to update server components
        if (redirectAfterAuth) {
          router.push(redirectAfterAuth);
        } else {
          router.refresh();
        }
      } else {
        setError(
          result.error ||
            "Facebook prijavljivanje nije uspelo. Molimo pokušajte ponovo."
        );
      }
    });
  };

  const handleOAuthError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setError(undefined);
  };

  const handleOpenChange = (open: boolean) => {
    if (controlledOnOpenChange) {
      controlledOnOpenChange(open);
    } else {
      if (!open) {
        closeAuthModal();
      }
    }

    // Reset state when closing
    if (!open) {
      setError(undefined);
      setMode(defaultMode);
    }
  };

  return (
    <Dialog open={controlledOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "login" ? "Prijavite se" : "Registrujte se"}
          </DialogTitle>
          <DialogDescription>
            {mode === "login"
              ? "Unesite svoje podatke za pristup nalogu."
              : "Kreirajte nalog da biste nastavili."}
          </DialogDescription>
        </DialogHeader>

        {mode === "login" ? (
          <LoginForm
            onSubmit={handleLogin}
            onGoogleSuccess={handleGoogleSuccess}
            onFacebookSuccess={handleFacebookSuccess}
            onOAuthError={handleOAuthError}
            loading={isPending}
            error={error}
            onToggleMode={toggleMode}
            isModal={true}
          />
        ) : (
          <RegisterForm
            onSubmit={handleRegister}
            onGoogleSuccess={handleGoogleSuccess}
            onFacebookSuccess={handleFacebookSuccess}
            onOAuthError={handleOAuthError}
            loading={isPending}
            error={error}
            onToggleMode={toggleMode}
            isModal={true}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
