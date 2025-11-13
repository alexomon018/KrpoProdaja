"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { EmailVerification } from "@/components/molecules/AuthForm/EmailVerification";
import { Container } from "@/components/atoms/Container/Container";

/**
 * Email Verification Page
 *
 * Email verification prompt and resend functionality
 */
export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string>();

  const handleResend = async () => {
    setLoading(true);
    setError(undefined);

    try {
      // TODO: Implement resend verification email
      console.log("Resend verification to:", email);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show success feedback (handled by countdown)
    } catch (err) {
      setError("Greška pri slanju email-a. Molimo pokušajte ponovo.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerified = () => {
    // Redirect to home or profile setup
    router.push("/");
  };

  // Check for verification token in URL (when user clicks email link)
  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      // TODO: Verify the token with backend
      console.log("Verifying token:", token);
      setSuccess(true);
    }
  }, [searchParams]);

  return (
    <Container className="py-8">
      <EmailVerification
        email={email}
        onResend={handleResend}
        onVerified={handleVerified}
        loading={loading}
        success={success}
        error={error}
      />
    </Container>
  );
}
