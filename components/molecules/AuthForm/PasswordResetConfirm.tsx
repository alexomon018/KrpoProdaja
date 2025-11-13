"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import Link from "next/link";
import { Button } from "@/components/atoms/Button/Button";
import { FormInput } from "@/components/atoms/FormInput/FormInput";
import { Icon } from "@/components/atoms/Icon/Icon";

export interface PasswordResetConfirmData {
  password: string;
  confirmPassword: string;
}

export interface PasswordResetConfirmProps {
  /**
   * Reset token from URL
   */
  token: string;
  /**
   * Callback when form is submitted
   */
  onSubmit: (data: PasswordResetConfirmData & { token: string }) => void;
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
 * PasswordResetConfirm Component - Atomic Design: Molecule
 *
 * Password reset confirmation form (step 2)
 *
 * @example
 * ```tsx
 * <PasswordResetConfirm
 *   token="abc123"
 *   onSubmit={(data) => console.log(data)}
 * />
 * ```
 */
export function PasswordResetConfirm({
  token,
  onSubmit,
  loading = false,
  success = false,
  error,
}: PasswordResetConfirmProps) {
  const methods = useForm<PasswordResetConfirmData>();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = methods.handleSubmit((data) => {
    if (data.password !== data.confirmPassword) {
      methods.setError("confirmPassword", {
        type: "manual",
        message: "Lozinke se ne podudaraju",
      });
      return;
    }
    onSubmit({ ...data, token });
  });

  if (success) {
    return (
      <div className="w-full max-w-md mx-auto text-center space-y-6">
        <div className="flex justify-center">
          <div className="bg-semantic-success/10 rounded-full p-6">
            <Icon name="CheckCircle" size={64} className="text-semantic-success" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-primary">Lozinka promenjena!</h1>
          <p className="text-secondary">
            Tvoja lozinka je uspešno promenjena. Sada se možeš prijaviti sa novom lozinkom.
          </p>
        </div>

        <Link href="/login">
          <Button variant="primary" fullWidth>
            Prijavi se
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-4">
          <div className="bg-primary/10 rounded-full p-4">
            <Icon name="Lock" size={48} className="text-primary" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-primary">Nova lozinka</h1>
        <p className="text-secondary">
          Unesi svoju novu lozinku i potvrdi je
        </p>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-semantic-error/10 border border-semantic-error/20 text-semantic-error px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="relative">
            <FormInput
              name="password"
              type={showPassword ? "text" : "password"}
              label="Nova lozinka"
              placeholder="••••••••"
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] text-tertiary hover:text-secondary"
              disabled={loading}
            >
              <Icon name={showPassword ? "EyeOff" : "Eye"} size={20} />
            </button>
          </div>

          <div className="relative">
            <FormInput
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              label="Potvrdi novu lozinku"
              placeholder="••••••••"
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-[38px] text-tertiary hover:text-secondary"
              disabled={loading}
            >
              <Icon name={showConfirmPassword ? "EyeOff" : "Eye"} size={20} />
            </button>
          </div>

          <div className="bg-background border border-border rounded-lg p-3 text-xs text-secondary">
            <p className="font-medium mb-1">Lozinka mora sadržati:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Najmanje 8 karaktera</li>
              <li>Jedno veliko slovo</li>
              <li>Jedan broj</li>
            </ul>
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={loading}
            disabled={loading}
          >
            Promeni lozinku
          </Button>
        </form>
      </FormProvider>
    </div>
  );
}
