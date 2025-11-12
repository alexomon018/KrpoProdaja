"use client";

import * as React from "react";
import { useForm, FormProvider } from "react-hook-form";
import Link from "next/link";
import { Button } from "@/components/atoms/Button/Button";
import { FormInput } from "@/components/atoms/FormInput/FormInput";
import { Icon } from "@/components/atoms/Icon/Icon";
import { SocialLogin } from "./SocialLogin";

export interface RegisterFormData {
  name: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export interface RegisterFormProps {
  /**
   * Callback when form is submitted
   */
  onSubmit: (data: RegisterFormData) => void;
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
  onSocialLogin,
  loading = false,
  error,
}: RegisterFormProps) {
  const methods = useForm<RegisterFormData>();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const handleSubmit = methods.handleSubmit((data) => {
    if (data.password !== data.confirmPassword) {
      methods.setError("confirmPassword", {
        type: "manual",
        message: "Lozinke se ne podudaraju",
      });
      return;
    }
    onSubmit(data);
  });

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-neutral-900">Registruj se</h1>
        <p className="text-neutral-600">
          Kreiraj nalog i počni da kupuješ ili prodaješ
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
              className="absolute right-3 top-[38px] text-neutral-500 hover:text-neutral-700"
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
              className="absolute right-3 top-[38px] text-neutral-500 hover:text-neutral-700"
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
                className="h-4 w-4 mt-0.5 rounded border-neutral-300 text-primary focus:ring-primary"
                disabled={loading}
              />
              <span className="text-sm text-neutral-700">
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
            onGoogleLogin={() => onSocialLogin?.("google")}
            onFacebookLogin={() => onSocialLogin?.("facebook")}
            loading={loading}
          />

          <p className="text-center text-sm text-neutral-600">
            Već imaš nalog?{" "}
            <Link
              href="/auth/login"
              className="text-primary hover:text-primary-dark font-medium"
            >
              Prijavi se
            </Link>
          </p>
        </form>
      </FormProvider>
    </div>
  );
}
