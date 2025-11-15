"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useChangePassword } from "@/lib/api/hooks";
import { PasswordChangeForm } from "@/components/molecules/AuthForm/PasswordChangeForm";
import { Container } from "@/components/atoms/Container/Container";
import { Typography } from "@/components/atoms/Typography/Typography";
import type { ChangePasswordRequest } from "@/lib/api/types";

export function PasswordChanger() {
  const router = useRouter();
  const changePasswordMutation = useChangePassword();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (data: ChangePasswordRequest) => {
    changePasswordMutation.mutate(data, {
      onSuccess: () => {
        setShowSuccess(true);
        setTimeout(() => {
          router.push("/profile");
        }, 2000);
      },
    });
  };

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
        loading={changePasswordMutation.isPending}
        error={changePasswordMutation.error?.message}
        success={showSuccess}
      />
    </Container>
  );
}
