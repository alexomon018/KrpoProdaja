"use client";

import { LoginForm } from "@/components/molecules/AuthForm/LoginForm";
import { Container } from "@/components/atoms/Container/Container";
import { useLogin } from "@/lib/api/hooks/useLogin";

export function AuthLogin() {
  const {
    handleLogin,
    handleGoogleSuccess,
    handleFacebookSuccess,
    handleOAuthError,
    isPending,
    error,
  } = useLogin();

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
