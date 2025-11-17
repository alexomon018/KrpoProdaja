"use client";

import { useState, useTransition } from "react";
import { PasswordResetRequest, PasswordResetRequestData } from "@/components/molecules/AuthForm/PasswordResetRequest";
import { Container } from "@/components/atoms/Container/Container";
import { requestPasswordResetAction } from "@/lib/auth/actions";

export function PasswordReset() {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleSubmit = (data: PasswordResetRequestData) => {
    setError(undefined);
    setSuccess(false);

    startTransition(async () => {
      const result = await requestPasswordResetAction({ email: data.email });

      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error || "Greška pri slanju email-a. Molimo pokušajte ponovo.");
      }
    });
  };

  const loading = isPending;

  return (
    <Container className="min-h-screen flex items-center justify-center py-8">
      <PasswordResetRequest
        onSubmit={handleSubmit}
        loading={loading}
        success={success}
        error={error}
      />
    </Container>
  );
}
