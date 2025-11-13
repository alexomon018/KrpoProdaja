"use client";

import { useState } from "react";
import { LoginForm, LoginFormData } from "@/components/molecules/AuthForm/LoginForm";
import { Container } from "@/components/atoms/Container/Container";

/**
 * Login Page
 *
 * Email/password and social login authentication page
 */
export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const handleLogin = async (data: LoginFormData) => {
    setLoading(true);
    setError(undefined);

    try {
      // TODO: Implement backend authentication
      console.log("Login data:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // On success, redirect to home or previous page
      // router.push("/");
    } catch (err) {
      setError("Email ili lozinka nisu ispravni. Molimo pokušajte ponovo.");
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

      // On success, redirect to home or previous page
      // router.push("/");
    } catch (err) {
      setError(`Greška pri prijavljivanju preko ${provider}. Molimo pokušajte ponovo.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-8">
      <LoginForm
        onSubmit={handleLogin}
        onSocialLogin={handleSocialLogin}
        loading={loading}
        error={error}
      />
    </Container>
  );
}
