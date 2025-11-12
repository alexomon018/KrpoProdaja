# Authentication Pages

This directory contains all authentication-related pages for the KrpoProdaja marketplace.

## Route Group Structure

This directory uses Next.js route groups `(auth)` to provide a custom layout without the header/navigation. The parentheses in the folder name mean:
- Routes are still accessible at `/*` (the parentheses don't appear in the URL)
- Uses its own `layout.tsx` that excludes the header for a focused authentication experience
- Provides a clean, distraction-free interface for login, registration, and password reset flows

## Pages Overview

### Login (`/login`)
- Email/password authentication
- Social login (Google, Facebook)
- Remember me functionality
- Link to password reset
- Link to registration

### Register (`/register`)
- User registration with email/password
- Name, email, phone (optional) fields
- Password confirmation
- Terms and conditions acceptance
- Social registration (Google, Facebook)
- Automatic redirect to email verification

### Email Verification (`/verify-email`)
- Email verification prompt
- Resend verification email (with 60s cooldown)
- Success state after verification
- Handles verification token from email link

### Password Reset (`/reset-password`)
- Request password reset email
- Success state with instructions
- Link back to login

### Password Reset Confirmation (`/reset-password/[token]`)
- Set new password with token
- Password confirmation
- Password requirements display
- Success state with redirect to login

## Components Used

All pages use components from `/components/molecules/AuthForm/`:
- `LoginForm`
- `RegisterForm`
- `SocialLogin`
- `EmailVerification`
- `PasswordResetRequest`
- `PasswordResetConfirm`

## Backend Integration TODO

Each page includes TODO comments for backend integration:

1. **Login Page**
   - Implement authentication API call
   - Handle JWT token storage
   - Implement social OAuth flow
   - Redirect to previous page or home

2. **Register Page**
   - Implement user registration API
   - Validate email uniqueness
   - Implement social OAuth flow
   - Send verification email

3. **Email Verification Page**
   - Implement email verification API
   - Implement resend email API
   - Handle token verification from URL

4. **Password Reset Pages**
   - Implement password reset request API
   - Implement password reset confirmation API
   - Validate reset token
   - Enforce password requirements

## User Flow

```
Registration Flow:
/register → /verify-email → / (home)
                    ↓ (with token)
                /verify-email?token=xxx

Login Flow:
/login → / (home or previous page)

Password Reset Flow:
/reset-password → Email → /reset-password/[token] → /login
```

## Styling

All components follow the existing design system:
- Tailwind CSS for styling
- Atomic design pattern
- Serbian language for labels and messages
- Mobile-first responsive design
- Accessible form controls

## Testing

To test the pages locally:
1. Run `npm run dev`
2. Navigate to `/login`, `/register`, etc.
3. Fill out forms and observe console logs
4. Check form validation and error states
