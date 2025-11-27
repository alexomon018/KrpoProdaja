"use client";

import { GoogleOAuthProvider as GoogleProvider } from "@react-oauth/google";

interface GoogleOAuthProviderProps {
  children: React.ReactNode;
}

/**
 * Google OAuth Provider Wrapper
 * Wraps the application with Google OAuth context
 */
export function GoogleOAuthProvider({ children }: GoogleOAuthProviderProps) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!clientId) {
    console.warn(
      "Google OAuth Client ID not found. Please add NEXT_PUBLIC_GOOGLE_CLIENT_ID to your .env.local file."
    );
    return <>{children}</>;
  }

  return <GoogleProvider clientId={clientId}>{children}</GoogleProvider>;
}
