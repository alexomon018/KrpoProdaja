"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { EmailVerification } from "@/components/molecules/AuthForm/EmailVerification";
import { Container } from "@/components/atoms/Container/Container";

// TODO: Replace with actual API call
const resendVerificationEmail = async (email: string): Promise<void> => {
  console.log("Resend verification to:", email);
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
};

/**
 * Email Verification Page
 *
 * Email verification prompt and resend functionality
 */
export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [success, setSuccess] = useState(false);

  const resendMutation = useMutation({
    mutationFn: resendVerificationEmail,
  });

  const handleResend = () => {
    resendMutation.mutate(email);
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

  const loading = resendMutation.isPending;
  const error = resendMutation.error ? "Greška pri slanju email-a. Molimo pokušajte ponovo." : undefined;

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
