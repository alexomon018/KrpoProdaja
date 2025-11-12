"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { RegisterForm, RegisterFormData } from "@/components/molecules/AuthForm/RegisterForm";
import { Container } from "@/components/atoms/Container/Container";

/**
 * Register Page
 *
 * User registration page with email/password and social login
 */
export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string>();

  const handleRegister = async (data: RegisterFormData) => {
    setLoading(true);
    setError(undefined);

    try {
      // TODO: Implement backend registration
      console.log("Register data:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // On success, redirect to email verification
      router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
    } catch (err) {
      setError("Greška pri registraciji. Molimo pokušajte ponovo.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "facebook") => {
    setLoading(true);
    setError(undefined);

    try {
      // TODO: Implement social authentication
      console.log("Social login:", provider);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // On success, redirect to home or profile setup
      // router.push("/");
    } catch (err) {
      setError(`Greška pri registraciji preko ${provider}. Molimo pokušajte ponovo.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-8">
      <RegisterForm
        onSubmit={handleRegister}
        onSocialLogin={handleSocialLogin}
        loading={loading}
        error={error}
      />
    </Container>
  );
}
