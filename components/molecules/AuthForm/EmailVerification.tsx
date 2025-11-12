"use client";

import * as React from "react";
import { Button } from "@/components/atoms/Button/Button";
import { Icon } from "@/components/atoms/Icon/Icon";

export interface EmailVerificationProps {
  /**
   * Email address to verify
   */
  email: string;
  /**
   * Callback when resend is clicked
   */
  onResend?: () => void;
  /**
   * Callback when verification is complete
   */
  onVerified?: () => void;
  /**
   * Loading state
   */
  loading?: boolean;
  /**
   * Success message
   */
  success?: boolean;
  /**
   * Error message
   */
  error?: string;
}

/**
 * EmailVerification Component - Atomic Design: Molecule
 *
 * Email verification prompt with resend functionality
 *
 * @example
 * ```tsx
 * <EmailVerification
 *   email="user@example.com"
 *   onResend={() => console.log("Resend email")}
 *   onVerified={() => console.log("Email verified")}
 * />
 * ```
 */
export function EmailVerification({
  email,
  onResend,
  onVerified,
  loading = false,
  success = false,
  error,
}: EmailVerificationProps) {
  const [countdown, setCountdown] = React.useState(0);

  React.useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResend = () => {
    setCountdown(60);
    onResend?.();
  };

  if (success) {
    return (
      <div className="w-full max-w-md mx-auto text-center space-y-6">
        <div className="flex justify-center">
          <div className="bg-semantic-success/10 rounded-full p-6">
            <Icon name="CheckCircle" size={64} className="text-semantic-success" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-neutral-900">Email potvrđen!</h1>
          <p className="text-neutral-600">
            Tvoj email je uspešno verifikovan. Sada možeš koristiti sve funkcije.
          </p>
        </div>

        <Button variant="primary" fullWidth onClick={onVerified}>
          Nastavi
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto text-center space-y-6">
      <div className="flex justify-center">
        <div className="bg-primary/10 rounded-full p-6">
          <Icon name="Mail" size={64} className="text-primary" />
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-neutral-900">Potvrdi email</h1>
        <p className="text-neutral-600">
          Poslali smo verifikacioni link na
        </p>
        <p className="font-semibold text-neutral-900">{email}</p>
      </div>

      {error && (
        <div className="bg-semantic-error/10 border border-semantic-error/20 text-semantic-error px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 text-sm text-neutral-700 text-left space-y-2">
          <p className="font-medium">Proveri svoj email</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Otvori email koji smo ti poslali</li>
            <li>Klikni na verifikacioni link</li>
            <li>Vratićeš se ovde automatski</li>
          </ul>
        </div>

        <p className="text-sm text-neutral-600">
          Nisi dobio email?
        </p>

        <Button
          variant="secondary"
          fullWidth
          onClick={handleResend}
          disabled={loading || countdown > 0}
          loading={loading}
        >
          {countdown > 0
            ? `Pošalji ponovo (${countdown}s)`
            : "Pošalji ponovo"}
        </Button>

        <p className="text-xs text-neutral-500">
          Proveri i spam folder ako ne vidiš email
        </p>
      </div>
    </div>
  );
}
