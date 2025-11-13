"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { RegisterForm, RegisterFormData } from "@/components/molecules/AuthForm/RegisterForm";
import { Container } from "@/components/atoms/Container/Container";

// TODO: Replace with actual API call
const registerUser = async (data: RegisterFormData): Promise<void> => {
  console.log("Register data:", data);
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
};

const socialLogin = async (provider: "google" | "facebook"): Promise<void> => {
  console.log("Social login:", provider);
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
};

/**
 * Register Page
 *
 * User registration page with email/password and social login
 */
export default function RegisterPage() {
  const router = useRouter();

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (_, variables) => {
      // On success, redirect to email verification
      router.push(`/verify-email?email=${encodeURIComponent(variables.email)}`);
    },
  });

  const socialLoginMutation = useMutation({
    mutationFn: socialLogin,
    onSuccess: () => {
      // On success, redirect to home or profile setup
      // router.push("/");
    },
  });

  const handleRegister = (data: RegisterFormData) => {
    registerMutation.mutate(data);
  };

  const handleSocialLogin = (provider: "google" | "facebook") => {
    socialLoginMutation.mutate(provider);
  };

  const loading = registerMutation.isPending || socialLoginMutation.isPending;
  const error =
    registerMutation.error ? "Greška pri registraciji. Molimo pokušajte ponovo." :
    socialLoginMutation.error ? `Greška pri registraciji. Molimo pokušajte ponovo.` :
    undefined;

  return (
    <Container className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-8">
      <RegisterForm
        onSubmit={handleRegister}
        onSocialLogin={handleSocialLogin}
        loading={loading}
        error={error}
      />
    </Container>
  );
}
