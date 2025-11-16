"use client";

import * as React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { Button } from "@/components/atoms/Button/Button";

export interface SocialLoginProps {
  /**
   * Callback when Google login succeeds
   */
  onGoogleSuccess?: (accessToken: string) => void;
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
 *   onGoogleSuccess={(token) => console.log("Google token:", token)}
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
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsGoogleLoading(true);
        // The tokenResponse.access_token is what we need to send to the backend
        onGoogleSuccess?.(tokenResponse.access_token);
      } catch (error) {
        onError?.(
          error instanceof Error ? error.message : "Google login failed"
        );
      } finally {
        setIsGoogleLoading(false);
      }
    },
    onError: () => {
      onError?.("Google login was cancelled or failed");
    },
  });

  // Facebook OAuth login handler
  const handleFacebookLogin = React.useCallback(() => {
    const facebookAppId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;

    if (!facebookAppId) {
      onError?.(
        "Facebook App ID not configured. Please add NEXT_PUBLIC_FACEBOOK_APP_ID to your .env.local file."
      );
      return;
    }

    setIsFacebookLoading(true);

    // Load Facebook SDK if not already loaded
    if (!window.FB) {
      // Load Facebook SDK
      const script = document.createElement("script");
      script.src = "https://connect.facebook.net/en_US/sdk.js";
      script.async = true;
      script.defer = true;
      script.crossOrigin = "anonymous";
      script.onload = () => {
        window.FB.init({
          appId: facebookAppId,
          cookie: true,
          xfbml: true,
          version: "v18.0",
        });
        initiateFacebookLogin();
      };
      script.onerror = () => {
        setIsFacebookLoading(false);
        onError?.("Failed to load Facebook SDK");
      };
      document.body.appendChild(script);
    } else {
      initiateFacebookLogin();
    }
  }, [onError, onFacebookSuccess]);

  const initiateFacebookLogin = () => {
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
  };

  const isLoading = loading || isGoogleLoading || isFacebookLoading;

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-background px-4 text-tertiary">ili nastavi sa</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => googleLogin()}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 dark:text-white"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span>Google</span>
        </Button>

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
