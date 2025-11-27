"use client";

import Script from "next/script";

export function FacebookSDKProvider() {
  return (
    <Script
      src="https://connect.facebook.net/en_US/sdk.js"
      strategy="lazyOnload"
      onLoad={() => {
        if (typeof window !== "undefined" && window.FB) {
          window.FB.init({
            appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
            cookie: true,
            xfbml: true,
            version: "v18.0",
          });
        }
      }}
    />
  );
}
