# Backend Changes Required for Token Validation

## Overview
The Next.js frontend now implements the **three-token authentication system** (accessToken, idToken, refreshToken) to match your backend's JWT implementation. The middleware validates tokens by calling the backend API.

## ✅ Backend Implementation Status

Your backend already supports the three-token system! The login/register endpoints return:

```json
{
  "message": "Login successful",
  "user": { /* user object */ },
  "accessToken": "string",   // 30 min
  "idToken": "string",        // 30 min
  "refreshToken": "string"    // 30 days
}
```

## Required Backend Endpoint

### Token Verification Endpoint

**File:** `src/routes/auth.ts` (or wherever your auth routes are defined)

Add this endpoint to your existing auth routes:

```typescript
/**
 * Token verification endpoint
 * Used by the Next.js middleware to validate access tokens
 */
router.get('/api/auth/verify', authenticateToken, (req, res) => {
  // If authenticateToken middleware passes, token is valid
  res.json({
    valid: true,
    user: req.user
  });
});
```

**Note:** The endpoint should be at `/api/auth/verify` to match the middleware configuration.

## Frontend Implementation

### Token Storage (httpOnly Cookies)

The frontend now stores all three tokens in secure httpOnly cookies:

- `accessToken` - 30 min (used for API authorization and middleware validation)
- `idToken` - 30 min (used for user identity)
- `refreshToken` - 30 days (used for token refresh)

**Cookie Attributes:**
- `httpOnly: true` - Prevents JavaScript access (XSS protection)
- `secure: true` (in production) - HTTPS only
- `sameSite: 'strict'` - CSRF protection

### How It Works

1. **Login/Register:**
   - User submits credentials
   - Backend returns accessToken, idToken, refreshToken
   - Frontend stores all three in httpOnly cookies

2. **Protected Route Access:**
   - User tries to access protected route (e.g., `/profile`)
   - Middleware extracts `accessToken` cookie
   - Middleware calls `GET /api/auth/verify` with token
   - Backend validates the JWT
   - If valid (200 OK), access is granted
   - If invalid (401/403), user is redirected to login and all cookies are cleared

3. **API Requests:**
   - API client automatically includes `accessToken` in Authorization header
   - Backend validates token using existing middleware

4. **Logout:**
   - Frontend calls backend `/api/auth/revoke` endpoint
   - All three cookies are deleted
   - User is redirected to login

## Benefits

✅ **Security:**
- Proper JWT signature validation (prevents fake tokens)
- httpOnly cookies protect against XSS attacks
- SameSite=Strict protects against CSRF
- Tokens automatically expire

✅ **Architecture:**
- Single source of truth for validation
- No JWT_SECRET duplication
- Backend controls all auth logic
- Automatic token cleanup on logout

✅ **User Experience:**
- Seamless authentication flow
- Invalid/expired tokens handled gracefully
- Automatic redirect to login when needed

## Testing Checklist

After implementing the backend `/api/auth/verify` endpoint:

- [ ] Start backend API server
- [ ] Start Next.js dev server
- [ ] Try accessing `/profile` without login → redirects to login
- [ ] Log in successfully → stores three cookies
- [ ] Access `/profile` → works correctly
- [ ] Check browser DevTools → see httpOnly cookies
- [ ] Manually delete `accessToken` cookie → redirects to login
- [ ] Log out → all cookies cleared

## Environment Variables

Set in your `.env.local`:

```bash
# Backend API URL for server-side validation (used in middleware)
BACKEND_API_URL=http://localhost:3001

# API Base URL for client-side requests
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

Adjust ports to match your backend API server.

## Migration Notes

The frontend has been updated from the old single-token system to the new three-token system:

**Old (Deprecated):**
```typescript
// Single token stored in auth_token cookie
{ token: string }
```

**New (Current):**
```typescript
// Three tokens stored in separate cookies
{
  accessToken: string,   // For API authorization
  idToken: string,        // For user identity
  refreshToken: string    // For token refresh
}
```

All legacy code paths have been updated to support the new system.
