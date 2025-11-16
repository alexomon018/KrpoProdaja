"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { RegisterForm, RegisterFormData } from "@/components/molecules/AuthForm/RegisterForm";
import { Container } from "@/components/atoms/Container/Container";
import { registerAction, googleAuthAction, facebookAuthAction } from "@/lib/auth";
import { useAuth } from "@/lib/auth/context";

export function AuthRegister() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();

  const handleRegister = (data: RegisterFormData) => {
    setError(undefined);

    startTransition(async () => {
      // Map form data to API request format
      const result = await registerAction({
        email: data.email,
        password: data.password,
        username: data.email.split('@')[0], // Generate username from email
        fullName: data.name,
      });

      if (result.success && result.data) {
        // Update auth context with the user data from the response
        setUser(result.data.user);

        // Redirect to home page on success
        router.push("/");
      } else {
        setError(result.error || "Greška pri registraciji. Molimo pokušajte ponovo.");
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
          result.error || "Google registracija nije uspela. Molimo pokušajte ponovo."
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
          result.error || "Facebook registracija nije uspela. Molimo pokušajte ponovo."
        );
      }
    });
  };

  const handleOAuthError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return (
    <Container className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-8">
      <RegisterForm
        onSubmit={handleRegister}
        onGoogleSuccess={handleGoogleSuccess}
        onFacebookSuccess={handleFacebookSuccess}
        onOAuthError={handleOAuthError}
        loading={isPending}
        error={error}
      />
    </Container>
  );
}
