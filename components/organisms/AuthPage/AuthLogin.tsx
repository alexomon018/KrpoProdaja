"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  LoginForm,
  LoginFormData,
} from "@/components/molecules/AuthForm/LoginForm";
import { Container } from "@/components/atoms/Container/Container";
import { loginAction, googleAuthAction, facebookAuthAction } from "@/lib/auth";
import { useAuth } from "@/lib/auth/context";

export function AuthLogin() {
  const router = useRouter();
  const { setUser } = useAuth();
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

        // Redirect to home page on success
        router.push("/");
      } else {
        setError(
          result.error ||
            "Email ili lozinka nisu ispravni. Molimo pokušajte ponovo."
        );
      }
    });
  };

  const handleGoogleSuccess = (accessToken: string) => {
    setError(undefined);

    startTransition(async () => {
      const result = await googleAuthAction(accessToken);

      if (result.success && result.data) {
        // Update auth context with the user data from the response
        setUser(result.data.user);

        // Redirect to home page on success
        router.push("/");
      } else {
        setError(
          result.error || "Google prijavljivanje nije uspelo. Molimo pokušajte ponovo."
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

        // Redirect to home page on success
        router.push("/");
      } else {
        setError(
          result.error || "Facebook prijavljivanje nije uspelo. Molimo pokušajte ponovo."
        );
      }
    });
  };

  const handleOAuthError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return (
    <Container className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-8">
      <LoginForm
        onSubmit={handleLogin}
        onGoogleSuccess={handleGoogleSuccess}
        onFacebookSuccess={handleFacebookSuccess}
        onOAuthError={handleOAuthError}
        loading={isPending}
        error={error}
      />
    </Container>
  );
}
