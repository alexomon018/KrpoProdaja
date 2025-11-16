# OAuth Integration Setup Guide

This guide will help you set up Google and Facebook OAuth authentication for your Next.js application.

## Overview

The OAuth integration has been fully implemented with the following features:
- ✅ Google OAuth using `@react-oauth/google`
- ✅ Facebook OAuth using Facebook SDK
- ✅ Server Actions for secure token handling
- ✅ Automatic account linking (same email across providers)
- ✅ HttpOnly cookie-based token storage
- ✅ Works with both login/register pages and auth modal

## Prerequisites

1. A Google Cloud Console account
2. A Facebook Developer account
3. Your backend API running at the URL specified in `.env.local`

## Setup Instructions

### 1. Environment Configuration

Copy the `.env.example` file to `.env.local` and add your OAuth credentials:

```bash
cp .env.example .env.local
```

Update `.env.local` with the following:

```env
# API Base URL
NEXT_PUBLIC_API_URL=http://localhost:8080/api

# Google OAuth Client ID
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Facebook App ID
NEXT_PUBLIC_FACEBOOK_APP_ID=your-facebook-app-id
```

### 2. Google OAuth Setup

#### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**

#### Step 2: Configure OAuth Consent Screen

1. Click **OAuth consent screen** in the left sidebar
2. Select **External** user type (unless you're using Google Workspace)
3. Fill in the required fields:
   - **App name**: KrpoProdaja
   - **User support email**: Your email
   - **Developer contact information**: Your email
4. Add scopes:
   - `userinfo.email`
   - `userinfo.profile`
5. Add test users if needed (for development)
6. Save and continue

#### Step 3: Create OAuth Client ID

1. Go to **Credentials** > **Create Credentials** > **OAuth client ID**
2. Select **Web application** as the application type
3. Add authorized JavaScript origins:
   ```
   http://localhost:3000
   https://your-production-domain.com
   ```
4. Add authorized redirect URIs (not needed for this implementation, but recommended):
   ```
   http://localhost:3000
   https://your-production-domain.com
   ```
5. Click **Create**
6. Copy the **Client ID** and add it to your `.env.local` as `NEXT_PUBLIC_GOOGLE_CLIENT_ID`

### 3. Facebook OAuth Setup

#### Step 1: Create a Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/apps/)
2. Click **Create App**
3. Select **Consumer** as the app type
4. Fill in the app details:
   - **App name**: KrpoProdaja
   - **Contact email**: Your email
5. Click **Create App**

#### Step 2: Add Facebook Login Product

1. In your app dashboard, click **Add Product**
2. Find **Facebook Login** and click **Set Up**
3. Select **Web** as the platform
4. Enter your site URL: `http://localhost:3000` (for development)

#### Step 3: Configure Facebook Login Settings

1. Go to **Facebook Login** > **Settings** in the left sidebar
2. Add the following to **Valid OAuth Redirect URIs**:
   ```
   http://localhost:3000
   https://your-production-domain.com
   ```
3. Set **Use Strict Mode for Redirect URIs** to **Yes**
4. Save changes

#### Step 4: Get Your App ID

1. Go to **Settings** > **Basic**
2. Copy the **App ID** and add it to your `.env.local` as `NEXT_PUBLIC_FACEBOOK_APP_ID`

#### Step 5: Make Your App Live (For Production)

1. Go to **Settings** > **Basic**
2. Toggle **App Mode** from **Development** to **Live**
3. Complete the App Review if required

### 4. Backend Configuration

Ensure your backend OAuth endpoints are configured correctly:

- **Google OAuth Endpoint**: `POST /api/oauth/google`
  - Request body: `{ "token": "google-access-token" }`
  - Returns: User data + auth tokens (accessToken, idToken, refreshToken)

- **Facebook OAuth Endpoint**: `POST /api/oauth/facebook`
  - Request body: `{ "accessToken": "facebook-access-token" }`
  - Returns: User data + auth tokens (accessToken, idToken, refreshToken)

Your backend should:
1. Verify the token with Google/Facebook
2. Extract user profile information (email, name, picture)
3. Create a new user or link to existing user by email
4. Generate and return authentication tokens

## Testing the Integration

### 1. Start the Development Server

```bash
npm run dev
```

### 2. Test Google OAuth

1. Navigate to `/login` or `/register`
2. Click the **Google** button
3. Select a Google account
4. Verify you're redirected and logged in

### 3. Test Facebook OAuth

1. Navigate to `/login` or `/register`
2. Click the **Facebook** button
3. Authorize the app
4. Verify you're redirected and logged in

## Architecture

### OAuth Flow

1. **User clicks OAuth button** → Frontend initiates OAuth flow
2. **OAuth provider authentication** → User authenticates with Google/Facebook
3. **Access token received** → Frontend receives access token
4. **Token sent to backend** → Server Action sends token to backend API
5. **Backend verification** → Backend verifies token with OAuth provider
6. **User creation/linking** → Backend creates or links user account
7. **Auth tokens returned** → Backend returns accessToken, idToken, refreshToken
8. **Tokens stored in cookies** → Server Action stores tokens in httpOnly cookies
9. **User redirected** → User is redirected to home page or specified route

### File Structure

```
components/
├── molecules/
│   └── AuthForm/
│       ├── SocialLogin.tsx          # OAuth buttons and handlers
│       ├── LoginForm.tsx            # Login form with OAuth
│       └── RegisterForm.tsx         # Register form with OAuth
├── organisms/
│   ├── AuthPage/
│   │   ├── AuthLogin.tsx            # Login page logic
│   │   └── AuthRegister.tsx         # Register page logic
│   └── AuthModal/
│       └── AuthModal.tsx            # Auth modal with OAuth
└── providers/
    └── GoogleOAuthProvider.tsx      # Google OAuth context provider

lib/
└── auth/
    ├── actions.ts                   # Server Actions (login, register, OAuth)
    └── cookies.ts                   # Token management

app/
└── layout.tsx                       # Root layout with GoogleOAuthProvider
```

### Server Actions

The following server actions are available:

- `loginAction(data)` - Email/password login
- `registerAction(data)` - Email/password registration
- `googleAuthAction(googleToken)` - Google OAuth authentication
- `facebookAuthAction(facebookAccessToken)` - Facebook OAuth authentication
- `logoutAction()` - Logout and revoke tokens

## Security Considerations

1. **HttpOnly Cookies**: All authentication tokens are stored in httpOnly cookies to prevent XSS attacks
2. **Server Actions**: OAuth token exchange happens server-side to protect sensitive credentials
3. **Token Verification**: Backend must verify tokens with OAuth providers before creating sessions
4. **HTTPS in Production**: Always use HTTPS in production for OAuth redirects
5. **Environment Variables**: Never commit OAuth credentials to version control

## Troubleshooting

### "Google OAuth Client ID not found" Error

- Ensure `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is set in `.env.local`
- Restart the development server after adding environment variables

### "Facebook App ID not configured" Error

- Ensure `NEXT_PUBLIC_FACEBOOK_APP_ID` is set in `.env.local`
- Restart the development server after adding environment variables

### OAuth Popup Blocked

- Ensure you're not blocking popups in your browser
- Facebook OAuth may open a popup for authentication

### "Invalid OAuth Redirect URI" Error

- Ensure your redirect URIs are correctly configured in Google Cloud Console or Facebook Developer Console
- Make sure the domain matches exactly (including http/https and port)

### Backend OAuth Endpoint Errors

- Check that your backend API is running
- Verify the API URL in `.env.local` is correct
- Check backend logs for OAuth verification errors
- Ensure backend has correct OAuth secrets configured

## Production Deployment

Before deploying to production:

1. ✅ Add production domain to Google OAuth authorized origins
2. ✅ Add production domain to Facebook OAuth redirect URIs
3. ✅ Update `.env.local` (or production environment variables) with production API URL
4. ✅ Ensure HTTPS is enabled
5. ✅ Set Facebook app to "Live" mode
6. ✅ Test OAuth flows in production environment

## Support

For issues related to:
- **Google OAuth**: Check [Google Identity Documentation](https://developers.google.com/identity/oauth2/web/guides/overview)
- **Facebook OAuth**: Check [Facebook Login Documentation](https://developers.facebook.com/docs/facebook-login/web)
- **Backend API**: Refer to your backend API documentation

## Additional Resources

- [React OAuth Google Documentation](https://www.npmjs.com/package/@react-oauth/google)
- [Facebook SDK for JavaScript](https://developers.facebook.com/docs/javascript/quickstart)
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
