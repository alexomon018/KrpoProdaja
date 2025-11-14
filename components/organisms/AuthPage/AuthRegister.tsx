"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { RegisterForm, RegisterFormData } from "@/components/molecules/AuthForm/RegisterForm";
import { Container } from "@/components/atoms/Container/Container";
import { registerAction } from "@/lib/auth";

export function AuthRegister() {
  const router = useRouter();
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

      if (result.success) {
        // Redirect to home page on success
        router.push("/");
        router.refresh(); // Refresh to update auth state
      } else {
        setError(result.error || "Greška pri registraciji. Molimo pokušajte ponovo.");
      }
    });
  };

  const handleSocialLogin = (provider: "google" | "facebook") => {
    // TODO: Implement social login
    console.log("Social login:", provider);
    setError("Registracija putem društvenih mreža nije dostupna.");
  };

  return (
    <Container className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-8">
      <RegisterForm
        onSubmit={handleRegister}
        onSocialLogin={handleSocialLogin}
        loading={isPending}
        error={error}
      />
    </Container>
  );
}
