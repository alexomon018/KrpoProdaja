"use client";

import { useMutation } from "@tanstack/react-query";
import { PasswordResetRequest, PasswordResetRequestData } from "@/components/molecules/AuthForm/PasswordResetRequest";
import { Container } from "@/components/atoms/Container/Container";

// TODO: Replace with actual API call
const requestPasswordReset = async (data: PasswordResetRequestData): Promise<void> => {
  console.log("Password reset request for:", data.email);
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
};

/**
 * Password Reset Request Page
 *
 * Request password reset via email
 */
export default function ResetPasswordPage() {
  const resetMutation = useMutation({
    mutationFn: requestPasswordReset,
  });

  const handleSubmit = (data: PasswordResetRequestData) => {
    resetMutation.mutate(data);
  };

  const loading = resetMutation.isPending;
  const success = resetMutation.isSuccess;
  const error = resetMutation.error ? "Greška pri slanju email-a. Molimo pokušajte ponovo." : undefined;

  return (
    <Container className="py-8">
      <PasswordResetRequest
        onSubmit={handleSubmit}
        loading={loading}
        success={success}
        error={error}
      />
    </Container>
  );
}
