"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { EmailVerification } from "@/components/molecules/AuthForm/EmailVerification";
import { Container } from "@/components/atoms/Container/Container";
import {
  verifyEmailAction,
  resendVerificationEmailAction,
} from "@/lib/auth/actions";
import { useAuth } from "@/lib/auth/AuthProvider";

export function EmailVerifier() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuth();
  const email = searchParams.get("email") || "";
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();

  const handleResend = () => {
    if (!email) {
      setError("Email adresa nije pronađena.");
      return;
    }

    setError(undefined);
    startTransition(async () => {
      const result = await resendVerificationEmailAction(email);

      if (!result.success) {
        setError(
          result.error || "Greška pri slanju email-a. Molimo pokušajte ponovo."
        );
      }
    });
  };

  const handleVerified = () => {
    // Redirect to home page after successful verification
    router.push("/");
  };

  // Check for verification token in URL (when user clicks email link)
  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      startTransition(async () => {
        const result = await verifyEmailAction(token);

        if (result.success) {
          // Update auth context with the user data if provided
          if (result.data?.user) {
            setUser(result.data.user);
          }
          setSuccess(true);
        } else {
          setError(
            result.error || "Verifikacija nije uspela. Link je možda istekao."
          );
        }
      });
    }
  }, [searchParams, setUser]);

  return (
    <Container className="py-8">
      <EmailVerification
        email={email}
        onResend={handleResend}
        onVerified={handleVerified}
        loading={isPending}
        success={success}
        error={error}
      />
    </Container>
  );
}
