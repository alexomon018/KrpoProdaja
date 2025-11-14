"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  LoginForm,
  LoginFormData,
} from "@/components/molecules/AuthForm/LoginForm";
import { Container } from "@/components/atoms/Container/Container";
import { loginAction } from "@/lib/auth";

export function AuthLogin() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();

  const handleLogin = (data: LoginFormData) => {
    setError(undefined);

    startTransition(async () => {
      const result = await loginAction({
        email: data.email,
        password: data.password,
      });

      if (result.success) {
        // Redirect to home page on success
        router.push("/");
        router.refresh(); // Refresh to update auth state
      } else {
        setError(
          result.error ||
            "Email ili lozinka nisu ispravni. Molimo pokušajte ponovo."
        );
      }
    });
  };

  const handleSocialLogin = (provider: "google" | "facebook") => {
    // TODO: Implement social login
    console.log("Social login:", provider);
    setError("Prijavljivanje putem društvenih mreža nije dostupno.");
  };

  return (
    <Container className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-8">
      <LoginForm
        onSubmit={handleLogin}
        onSocialLogin={handleSocialLogin}
        loading={isPending}
        error={error}
      />
    </Container>
  );
}
