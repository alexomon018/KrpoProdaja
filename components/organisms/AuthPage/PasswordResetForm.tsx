"use client";

import { useRouter, useParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { PasswordResetConfirm, PasswordResetConfirmData } from "@/components/molecules/AuthForm/PasswordResetConfirm";
import { Container } from "@/components/atoms/Container/Container";

// TODO: Replace with actual API call
const confirmPasswordReset = async (data: PasswordResetConfirmData & { token: string }): Promise<void> => {
  console.log("Password reset data:", data);
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
};

export function PasswordResetForm() {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;

  const resetConfirmMutation = useMutation({
    mutationFn: confirmPasswordReset,
    onSuccess: () => {
      // Redirect to login after success
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    },
  });

  const handleSubmit = (data: PasswordResetConfirmData & { token: string }) => {
    resetConfirmMutation.mutate(data);
  };

  const loading = resetConfirmMutation.isPending;
  const success = resetConfirmMutation.isSuccess;
  const error = resetConfirmMutation.error ? "Greška pri promeni lozinke. Link možda nije važeći ili je istekao." : undefined;

  return (
    <Container className="py-8">
      <PasswordResetConfirm
        token={token}
        onSubmit={handleSubmit}
        loading={loading}
        success={success}
        error={error}
      />
    </Container>
  );
}
