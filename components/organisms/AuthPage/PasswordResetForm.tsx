"use client";

import { useState, useTransition } from "react";
import { useRouter, useParams } from "next/navigation";
import { PasswordResetConfirm, PasswordResetConfirmData } from "@/components/molecules/AuthForm/PasswordResetConfirm";
import { Container } from "@/components/atoms/Container/Container";
import { resetPasswordAction } from "@/lib/auth/actions";

export function PasswordResetForm() {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;

  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleSubmit = (data: PasswordResetConfirmData & { token: string }) => {
    setError(undefined);
    setSuccess(false);

    startTransition(async () => {
      const result = await resetPasswordAction({
        token: data.token,
        newPassword: data.password,
      });

      if (result.success) {
        setSuccess(true);
        // Redirect to login after success
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setError(result.error || "Greška pri promeni lozinke. Link možda nije važeći ili je istekao.");
      }
    });
  };

  const loading = isPending;

  return (
    <Container className="min-h-screen flex items-center justify-center py-8">
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
