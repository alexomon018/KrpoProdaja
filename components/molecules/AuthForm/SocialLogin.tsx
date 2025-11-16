"use client";

import * as React from "react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { Button } from "@/components/atoms/Button/Button";

export interface SocialLoginProps {
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
  onError?: (error: string) => void;
  /**
   * Loading state
   */
  loading?: boolean;
}

/**
 * SocialLogin Component - Atomic Design: Molecule
 *
 * Social login buttons for Google and Facebook authentication
 *
 * @example
 * ```tsx
 * <SocialLogin
 *   onGoogleSuccess={(idToken) => console.log("Google ID token:", idToken)}
 *   onFacebookSuccess={(token) => console.log("Facebook token:", token)}
 *   onError={(error) => console.error(error)}
 * />
 * ```
 */
export function SocialLogin({
  onGoogleSuccess,
  onFacebookSuccess,
  onError,
  loading = false,
}: SocialLoginProps) {
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);
  const [isFacebookLoading, setIsFacebookLoading] = React.useState(false);

  // Google OAuth login handler
  const handleGoogleSuccess = React.useCallback(
    async (credentialResponse: CredentialResponse) => {
      try {
        setIsGoogleLoading(true);

        // credentialResponse.credential contains the ID token (JWT format)
        if (!credentialResponse.credential) {
          onError?.("Google login failed: No credential received");
          return;
        }

        onGoogleSuccess?.(credentialResponse.credential);
      } catch (error) {
        onError?.(
          error instanceof Error ? error.message : "Google login failed"
        );
      } finally {
        setIsGoogleLoading(false);
      }
    },
    [onGoogleSuccess, onError]
  );

  const handleGoogleError = React.useCallback(() => {
    onError?.("Google login was cancelled or failed");
  }, [onError]);

  // Facebook OAuth login handler
  const handleFacebookLogin = React.useCallback(() => {
    if (!window.FB) {
      onError?.("Facebook SDK not loaded yet. Please try again.");
      return;
    }

    setIsFacebookLoading(true);

    window.FB.login(
      (response: any) => {
        if (response.authResponse) {
          // User successfully logged in
          const accessToken = response.authResponse.accessToken;
          onFacebookSuccess?.(accessToken);
        } else {
          // User cancelled login or did not fully authorize
          onError?.("Facebook login was cancelled");
        }
        setIsFacebookLoading(false);
      },
      { scope: "public_profile,email" }
    );
  }, [onError, onFacebookSuccess]);

  const isLoading = loading || isGoogleLoading || isFacebookLoading;

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-background px-4 text-tertiary">
            ili nastavi sa
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="w-full">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap={false}
            theme="outline"
            size="large"
            text="signin_with"
            width="100%"
            locale="sr"
            nonce="Google"
          />
        </div>

        <Button
          type="button"
          variant="secondary"
          onClick={handleFacebookLogin}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 dark:text-white"
        >
          <svg className="h-5 w-5" fill="#1877F2" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          <span>Facebook</span>
        </Button>
      </div>
    </div>
  );
}

// Extend Window interface for Facebook SDK
declare global {
  interface Window {
    FB: any;
  }
}
