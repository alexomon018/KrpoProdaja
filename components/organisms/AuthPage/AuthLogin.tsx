"use client";

import { useMutation } from "@tanstack/react-query";
import { LoginForm, LoginFormData } from "@/components/molecules/AuthForm/LoginForm";
import { Container } from "@/components/atoms/Container/Container";

// TODO: Replace with actual API call
const loginUser = async (data: LoginFormData): Promise<void> => {
  console.log("Login data:", data);
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // On success, redirect to home or previous page
  // router.push("/");
};

const socialLogin = async (provider: "google" | "facebook"): Promise<void> => {
  console.log("Social login:", provider);
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // On success, redirect to home or previous page
  // router.push("/");
};

export function AuthLogin() {
  const loginMutation = useMutation({
    mutationFn: loginUser,
    onError: () => {
      // Error handling is done through mutation.error
    },
  });

  const socialLoginMutation = useMutation({
    mutationFn: socialLogin,
    onError: () => {
      // Error handling is done through mutation.error
    },
  });

  const handleLogin = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  const handleSocialLogin = (provider: "google" | "facebook") => {
    socialLoginMutation.mutate(provider);
  };

  const loading = loginMutation.isPending || socialLoginMutation.isPending;
  const error =
    loginMutation.error ? "Email ili lozinka nisu ispravni. Molimo pokušajte ponovo." :
    socialLoginMutation.error ? `Greška pri prijavljivanju. Molimo pokušajte ponovo.` :
    undefined;

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
