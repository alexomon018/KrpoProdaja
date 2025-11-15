"use client";

import * as React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/atoms/Button/Button";
import { FormInput } from "@/components/atoms/FormInput/FormInput";

export interface PasswordChangeFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PasswordChangeFormProps {
  /**
   * Callback when form is submitted
   */
  onSubmit: (data: Omit<PasswordChangeFormData, 'confirmPassword'>) => void;
  /**
   * Loading state
   */
  loading?: boolean;
  /**
   * Error message to display
   */
  error?: string;
  /**
   * Success message
   */
  success?: boolean;
}

/**
 * PasswordChangeForm Component - Atomic Design: Molecule
 *
 * Password change form with validation
 *
 * @example
 * ```tsx
 * <PasswordChangeForm
 *   onSubmit={(data) => console.log(data)}
 *   loading={false}
 * />
 * ```
 */
export function PasswordChangeForm({
  onSubmit,
  loading = false,
  error,
  success = false,
}: PasswordChangeFormProps) {
  const methods = useForm<PasswordChangeFormData>({
    mode: "onBlur",
  });

  const handleSubmit = methods.handleSubmit((data) => {
    // Validate passwords match
    if (data.newPassword !== data.confirmPassword) {
      methods.setError("confirmPassword", {
        type: "manual",
        message: "Lozinke se ne poklapaju",
      });
      return;
    }

    // Validate password length
    if (data.newPassword.length < 8) {
      methods.setError("newPassword", {
        type: "manual",
        message: "Nova lozinka mora imati najmanje 8 karaktera",
      });
      return;
    }

    // Submit without confirmPassword field
    onSubmit({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
  });

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {success && (
        <div className="bg-semantic-success/10 border border-semantic-success/20 text-semantic-success px-4 py-3 rounded-lg text-sm">
          Lozinka uspešno promenjena!
        </div>
      )}

      {error && (
        <div className="bg-semantic-error/10 border border-semantic-error/20 text-semantic-error px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-surface border border-border rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-bold text-primary">Promeni lozinku</h2>

            <FormInput
              name="currentPassword"
              type="password"
              label="Trenutna lozinka"
              placeholder="Unesi trenutnu lozinku"
              required
              disabled={loading}
            />

            <FormInput
              name="newPassword"
              type="password"
              label="Nova lozinka"
              placeholder="Unesi novu lozinku (min. 8 karaktera)"
              required
              disabled={loading}
              helperText="Lozinka mora imati najmanje 8 karaktera"
            />

            <FormInput
              name="confirmPassword"
              type="password"
              label="Potvrdi novu lozinku"
              placeholder="Ponovo unesi novu lozinku"
              required
              disabled={loading}
            />
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
              disabled={loading}
            >
              Promeni lozinku
            </Button>
            <Button
              type="button"
              variant="secondary"
              fullWidth
              disabled={loading}
              onClick={() => methods.reset()}
            >
              Poništi
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
