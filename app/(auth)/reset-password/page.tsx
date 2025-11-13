"use client";

import { useState } from "react";
import { PasswordResetRequest, PasswordResetRequestData } from "@/components/molecules/AuthForm/PasswordResetRequest";
import { Container } from "@/components/atoms/Container/Container";

/**
 * Password Reset Request Page
 *
 * Request password reset via email
 */
export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string>();

  const handleSubmit = async (data: PasswordResetRequestData) => {
    setLoading(true);
    setError(undefined);

    try {
      // TODO: Implement password reset request
      console.log("Password reset request for:", data.email);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess(true);
    } catch (err) {
      setError("Greška pri slanju email-a. Molimo pokušajte ponovo.");
    } finally {
      setLoading(false);
    }
  };

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
