"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { Button } from "@/components/atoms/Button/Button";
import { FormInput } from "@/components/atoms/FormInput/FormInput";
import { Icon } from "@/components/atoms/Icon/Icon";
import { SocialLogin } from "./SocialLogin";
import { loginFormSchema, type LoginFormData } from "@/lib/validation/schemas";

// Re-export LoginFormData for backward compatibility
export type { LoginFormData };

export interface LoginFormProps {
  /**
   * Callback when form is submitted
   */
  onSubmit: (data: LoginFormData) => void;
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
 * LoginForm Component - Atomic Design: Molecule
 *
 * Email/password login form with social login options
 *
 * @example
 * ```tsx
 * <LoginForm
 *   onSubmit={(data) => console.log(data)}
 *   onSocialLogin={(provider) => console.log(provider)}
 * />
 * ```
 */
export function LoginForm({
  onSubmit,
  onGoogleSuccess,
  onFacebookSuccess,
  onOAuthError,
  loading = false,
  error,
  onToggleMode,
  isModal = false,
}: LoginFormProps) {
  const methods = useForm<LoginFormData>({
    resolver: yupResolver(loginFormSchema),
    mode: "onBlur",
  });
  const [showPassword, setShowPassword] = useState(false);

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
            <h1 className="text-3xl font-bold text-primary">Prijavi se</h1>
            <p className="text-secondary">
              Dobrodošli nazad! Prijavite se na svoj nalog
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
            name="email"
            type="email"
            label="Email adresa"
            placeholder="tvoj.email@primer.com"
            required
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

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...methods.register("rememberMe")}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                disabled={loading}
              />
              <span className="text-sm text-secondary">Zapamti me</span>
            </label>

            <Link
              href="/reset-password"
              className="text-sm text-primary hover:text-primary-dark font-medium"
            >
              Zaboravio si lozinku?
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={loading}
            disabled={loading}
          >
            Prijavi se
          </Button>

          <SocialLogin
            onGoogleSuccess={onGoogleSuccess}
            onFacebookSuccess={onFacebookSuccess}
            onError={onOAuthError}
            loading={loading}
          />

          <p className="text-center text-sm text-secondary">
            Nemaš nalog?{" "}
            {isModal && onToggleMode ? (
              <button
                type="button"
                onClick={onToggleMode}
                className="text-primary hover:text-primary-dark font-medium"
              >
                Registruj se
              </button>
            ) : (
              <Link
                href="/register"
                className="text-primary hover:text-primary-dark font-medium"
              >
                Registruj se
              </Link>
            )}
          </p>
        </form>
      </FormProvider>
    </div>
  );
}
