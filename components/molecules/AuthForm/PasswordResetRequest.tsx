"use client";

import * as React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { Button } from "@/components/atoms/Button/Button";
import { FormInput } from "@/components/atoms/FormInput/FormInput";
import { Icon } from "@/components/atoms/Icon/Icon";
import { passwordResetRequestSchema, type PasswordResetRequestData } from "@/lib/validation/schemas";

// Re-export PasswordResetRequestData for backward compatibility
export type { PasswordResetRequestData };

export interface PasswordResetRequestProps {
  /**
   * Callback when form is submitted
   */
  onSubmit: (data: PasswordResetRequestData) => void;
  /**
   * Loading state
   */
  loading?: boolean;
  /**
   * Success state
   */
  success?: boolean;
  /**
   * Error message to display
   */
  error?: string;
}

/**
 * PasswordResetRequest Component - Atomic Design: Molecule
 *
 * Password reset request form (step 1)
 *
 * @example
 * ```tsx
 * <PasswordResetRequest
 *   onSubmit={(data) => console.log(data)}
 * />
 * ```
 */
export function PasswordResetRequest({
  onSubmit,
  loading = false,
  success = false,
  error,
}: PasswordResetRequestProps) {
  const methods = useForm<PasswordResetRequestData>({
    resolver: yupResolver(passwordResetRequestSchema),
    mode: "onBlur",
  });

  const handleSubmit = methods.handleSubmit((data) => {
    onSubmit(data);
  });

  if (success) {
    return (
      <div className="w-full max-w-md mx-auto text-center space-y-6">
        <div className="flex justify-center">
          <div className="bg-semantic-success/10 rounded-full p-6">
            <Icon name="Mail" size={64} className="text-semantic-success" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-primary">Proveri email</h1>
          <p className="text-secondary">
            Poslali smo ti link za resetovanje lozinke. Proveri svoju email sandučicu.
          </p>
        </div>

        <div className="bg-background border border-border rounded-lg p-4 text-sm text-secondary text-left">
          <p className="font-medium mb-2">Sledeći koraci:</p>
          <ol className="space-y-1 list-decimal list-inside">
            <li>Otvori email koji smo ti poslali</li>
            <li>Klikni na link za resetovanje</li>
            <li>Unesi novu lozinku</li>
          </ol>
        </div>

        <Link href="/login">
          <Button variant="secondary" fullWidth>
            Nazad na prijavu
          </Button>
        </Link>

        <p className="text-xs text-tertiary">
          Nisi dobio email? Proveri spam folder ili pokušaj ponovo
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-4">
          <div className="bg-primary/10 rounded-full p-4">
            <Icon name="Key" size={48} className="text-primary" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-primary">Zaboravio si lozinku?</h1>
        <p className="text-secondary">
          Nema problema! Unesi svoj email i poslaćemo ti link za resetovanje.
        </p>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-semantic-error/10 border border-semantic-error/20 text-semantic-error px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <FormInput
            name="email"
            type="email"
            label="Email adresa"
            placeholder="tvoj.email@primer.com"
            required
            disabled={loading}
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={loading}
            disabled={loading}
          >
            Pošalji link
          </Button>

          <Link href="/login">
            <Button variant="ghost" fullWidth>
              Nazad na prijavu
            </Button>
          </Link>
        </form>
      </FormProvider>
    </div>
  );
}
