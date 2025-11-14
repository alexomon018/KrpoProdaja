import { Suspense } from "react";
import { EmailVerifier } from "@/components/organisms/AuthPage/EmailVerifier";

/**
 * Email Verification Page
 *
 * Email verification prompt and resend functionality
 */
export default function VerifyEmailPage() {
  // Server component with Suspense boundary for useSearchParams
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
      <EmailVerifier />
    </Suspense>
  );
}
