"use client";

import { RegisterForm } from "@/components/molecules/AuthForm/RegisterForm";
import { Container } from "@/components/atoms/Container/Container";
import { useRegister } from "@/lib/api/hooks/useRegister";

export function AuthRegister() {
  const {
    handleRegister,
    handleGoogleSuccess,
    handleFacebookSuccess,
    handleOAuthError,
    isPending,
    error,
  } = useRegister();

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
