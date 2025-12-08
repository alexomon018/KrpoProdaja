/**
 * useRegister Hook
 * Custom hook for managing registration with email/password and OAuth providers
 */

'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  registerAction,
  googleAuthAction,
  facebookAuthAction,
} from '@/lib/auth';
import { useAuth } from '@/providers/AuthProvider';
import type { RegisterFormData } from '@/components/molecules/AuthForm/RegisterForm';

export function useRegister() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();

  const handleRegister = (data: RegisterFormData) => {
    setError(undefined);

    startTransition(async () => {
      // Map form data to API request format - only email and password
      const result = await registerAction({
        email: data.email,
        password: data.password,
      });

      if (result.success) {
        // Redirect to email verification page
        router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
      } else {
        setError(
          result.error || 'Greška pri registraciji. Molimo pokušajte ponovo.'
        );
      }
    });
  };

  const handleGoogleSuccess = (idToken: string) => {
    setError(undefined);

    startTransition(async () => {
      const result = await googleAuthAction(idToken);

      if (result.success && result.data) {
        // Update auth context with the user data from the response
        setUser(result.data.user);

        // Redirect to home page on success
        router.push('/');
      } else {
        setError(
          result.error ||
            'Google registracija nije uspela. Molimo pokušajte ponovo.'
        );
      }
    });
  };

  const handleFacebookSuccess = (accessToken: string) => {
    setError(undefined);

    startTransition(async () => {
      const result = await facebookAuthAction(accessToken);

      if (result.success && result.data) {
        // Update auth context with the user data from the response
        setUser(result.data.user);

        // Redirect to home page on success
        router.push('/');
      } else {
        setError(
          result.error ||
            'Facebook registracija nije uspela. Molimo pokušajte ponovo.'
        );
      }
    });
  };

  const handleOAuthError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return {
    // Handlers
    handleRegister,
    handleGoogleSuccess,
    handleFacebookSuccess,
    handleOAuthError,

    // State
    isPending,
    error,
  };
}
