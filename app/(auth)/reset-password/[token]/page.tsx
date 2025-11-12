"use client";

import * as React from "react";
import { useRouter, useParams } from "next/navigation";
import { PasswordResetConfirm, PasswordResetConfirmData } from "@/components/molecules/AuthForm/PasswordResetConfirm";
import { Container } from "@/components/atoms/Container/Container";

/**
 * Password Reset Confirm Page
 *
 * Set new password with reset token
 */
export default function ResetPasswordConfirmPage() {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;

  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState<string>();

  const handleSubmit = async (data: PasswordResetConfirmData & { token: string }) => {
    setLoading(true);
    setError(undefined);

    try {
      // TODO: Implement password reset confirmation
      console.log("Password reset data:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess(true);

      // Redirect to login after success
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      setError("Greška pri promeni lozinke. Link možda nije važeći ili je istekao.");
    } finally {
      setLoading(false);
    }
  };

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
