"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { Button } from "@/components/atoms/Button/Button";
import { FormInput } from "@/components/atoms/FormInput/FormInput";
import { Icon } from "@/components/atoms/Icon/Icon";
import { SocialLogin } from "./SocialLogin";
import { registerFormSchema, type RegisterFormData } from "@/lib/validation/schemas";

// Re-export RegisterFormData for backward compatibility
export type { RegisterFormData };

export interface RegisterFormProps {
  /**
   * Callback when form is submitted
   */
  onSubmit: (data: RegisterFormData) => void;
  /**
   * Callback when Google login succeeds
   * @param idToken - Google ID token (JWT format)
   */
  onGoogleSuccess?: (idToken: string) => void;
  /**
   * Callback when Facebook login succeeds
   */
  onFacebookSuccess?: (accessToken: string) => void;
  /**
   * Callback when OAuth login fails
   */
  onOAuthError?: (error: string) => void;
  /**
   * Loading state
   */
  loading?: boolean;
  /**
   * Error message to display
   */
  error?: string;
  /**
   * Callback to toggle between login and register mode (for modal usage)
   */
  onToggleMode?: () => void;
  /**
   * Whether this form is being used in a modal (hides back link and header)
   */
  isModal?: boolean;
}

/**
 * RegisterForm Component - Atomic Design: Molecule
 *
 * User registration form with email/password and social login options
 *
 * @example
 * ```tsx
 * <RegisterForm
 *   onSubmit={(data) => console.log(data)}
 *   onSocialLogin={(provider) => console.log(provider)}
 * />
 * ```
 */
export function RegisterForm({
  onSubmit,
  onGoogleSuccess,
  onFacebookSuccess,
  onOAuthError,
  loading = false,
  error,
  onToggleMode,
  isModal = false,
}: RegisterFormProps) {
  const methods = useForm<RegisterFormData>({
    resolver: yupResolver(registerFormSchema),
    mode: "onBlur",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = methods.handleSubmit((data) => {
    onSubmit(data);
  });

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {!isModal && (
        <>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-secondary hover:text-primary transition-colors text-sm -mt-2"
          >
            <Icon name="ArrowLeft" size={16} />
            <span>Nazad na početnu</span>
          </Link>

          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-primary">Registruj se</h1>
            <p className="text-secondary">
              Kreiraj nalog i počni da kupuješ ili prodaješ
            </p>
          </div>
        </>
      )}

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-semantic-error/10 border border-semantic-error/20 text-semantic-error px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <FormInput
            name="name"
            type="text"
            label="Ime i prezime"
            placeholder="Marko Marković"
            required
            disabled={loading}
          />

          <FormInput
            name="email"
            type="email"
            label="Email adresa"
            placeholder="tvoj.email@primer.com"
            required
            disabled={loading}
          />

          <FormInput
            name="phone"
            type="tel"
            label="Broj telefona (opciono)"
            placeholder="+381 60 123 4567"
            disabled={loading}
          />

          <div className="relative">
            <FormInput
              name="password"
              type={showPassword ? "text" : "password"}
              label="Lozinka"
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
              label="Potvrdi lozinku"
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

          <div className="space-y-2">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...methods.register("agreeToTerms", { required: true })}
                className="h-4 w-4 mt-0.5 rounded border-border text-primary focus:ring-primary"
                disabled={loading}
              />
              <span className="text-sm text-secondary">
                Slažem se sa{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  uslovima korišćenja
                </Link>{" "}
                i{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  politikom privatnosti
                </Link>
              </span>
            </label>
            {methods.formState.errors.agreeToTerms && (
              <p className="text-sm text-semantic-error">
                Morate prihvatiti uslove korišćenja
              </p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={loading}
            disabled={loading}
          >
            Registruj se
          </Button>

          <SocialLogin
            onGoogleSuccess={onGoogleSuccess}
            onFacebookSuccess={onFacebookSuccess}
            onError={onOAuthError}
            loading={loading}
          />

          <p className="text-center text-sm text-secondary">
            Već imaš nalog?{" "}
            {isModal && onToggleMode ? (
              <button
                type="button"
                onClick={onToggleMode}
                className="text-primary hover:text-primary-dark font-medium"
              >
                Prijavi se
              </button>
            ) : (
              <Link
                href="/login"
                className="text-primary hover:text-primary-dark font-medium"
              >
                Prijavi se
              </Link>
            )}
          </p>
        </form>
      </FormProvider>
    </div>
  );
}
