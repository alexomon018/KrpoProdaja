"use client";

import { usePasswordChange } from "@/lib/api/hooks/usePasswordChange";
import { PasswordChangeForm } from "@/components/molecules/AuthForm/PasswordChangeForm";
import { Container } from "@/components/atoms/Container/Container";
import { Typography } from "@/components/atoms/Typography/Typography";

export function PasswordChanger() {
  const { handleSubmit, isLoading, error, showSuccess } = usePasswordChange();

  return (
    <Container className="py-8">
      <div className="mb-8">
        <Typography variant="h1" className="text-center">
          Promeni lozinku
        </Typography>
        <Typography variant="body" className="text-center text-secondary mt-2">
          Ažuriraj svoju lozinku
        </Typography>
      </div>

      <PasswordChangeForm
        onSubmit={handleSubmit}
        loading={isLoading}
        error={error}
        success={showSuccess}
      />
    </Container>
  );
}
