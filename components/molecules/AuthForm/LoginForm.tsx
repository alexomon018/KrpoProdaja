"use client";

import * as React from "react";
import { useForm, FormProvider } from "react-hook-form";
import Link from "next/link";
import { Button } from "@/components/atoms/Button/Button";
import { FormInput } from "@/components/atoms/FormInput/FormInput";
import { Icon } from "@/components/atoms/Icon/Icon";
import { SocialLogin } from "./SocialLogin";

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginFormProps {
  /**
   * Callback when form is submitted
   */
  onSubmit: (data: LoginFormData) => void;
  /**
   * Callback for social login
   */
  onSocialLogin?: (provider: "google" | "facebook") => void;
  /**
   * Loading state
   */
  loading?: boolean;
  /**
   * Error message to display
   */
  error?: string;
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
  onSocialLogin,
  loading = false,
  error,
}: LoginFormProps) {
  const methods = useForm<LoginFormData>();
  const [showPassword, setShowPassword] = React.useState(false);

  const handleSubmit = methods.handleSubmit((data) => {
    onSubmit(data);
  });

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-text-primary">Prijavi se</h1>
        <p className="text-text-secondary">
          Dobrodošli nazad! Prijavite se na svoj nalog
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
              className="absolute right-3 top-[38px] text-text-tertiary hover:text-text-secondary"
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
              <span className="text-sm text-text-secondary">Zapamti me</span>
            </label>

            <Link
              href="/auth/reset-password"
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
            onGoogleLogin={() => onSocialLogin?.("google")}
            onFacebookLogin={() => onSocialLogin?.("facebook")}
            loading={loading}
          />

          <p className="text-center text-sm text-text-secondary">
            Nemaš nalog?{" "}
            <Link
              href="/auth/register"
              className="text-primary hover:text-primary-dark font-medium"
            >
              Registruj se
            </Link>
          </p>
        </form>
      </FormProvider>
    </div>
  );
}
