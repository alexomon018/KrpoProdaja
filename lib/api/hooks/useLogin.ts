/**
 * useLogin Hook
 * Custom hook for managing login with email/password and OAuth providers
 */

'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { loginAction, googleAuthAction, facebookAuthAction } from '@/lib/auth';
import { useAuth } from '@/providers/AuthProvider';
import type { LoginFormData } from '@/components/molecules/AuthForm/LoginForm';

export function useLogin() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();

  const handleLogin = (data: LoginFormData) => {
    setError(undefined);

    startTransition(async () => {
      const result = await loginAction({
        email: data.email,
        password: data.password,
      });

      if (result.success && result.data) {
        // Update auth context with the user data from the response
        setUser(result.data.user);

        // Redirect to home page on success
        router.push('/');
      } else {
        setError(
          result.error ||
            'Email ili lozinka nisu ispravni. Molimo pokušajte ponovo.'
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
            'Google prijavljivanje nije uspelo. Molimo pokušajte ponovo.'
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
            'Facebook prijavljivanje nije uspelo. Molimo pokušajte ponovo.'
        );
      }
    });
  };

  const handleOAuthError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return {
    // Handlers
    handleLogin,
    handleGoogleSuccess,
    handleFacebookSuccess,
    handleOAuthError,

    // State
    isPending,
    error,
  };
}
