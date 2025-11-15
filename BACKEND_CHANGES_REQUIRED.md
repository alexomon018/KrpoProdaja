# Backend Changes Required for Token Validation

## Overview
The Next.js middleware now validates authentication tokens by calling the backend API. This requires a new endpoint in the `krpoprodaja-api` repository.

## Required Backend Changes

### 1. Add Token Verification Endpoint

**File:** `src/routes/auth.ts` (or wherever your auth routes are defined)

Add this endpoint to your existing auth routes:

```typescript
/**
 * Token verification endpoint
 * Used by the Next.js middleware to validate JWT tokens
 */
router.get('/verify', authenticateToken, (req, res) => {
  // If authenticateToken middleware passes, token is valid
  res.json({
    valid: true,
    user: req.user
  });
});
```

### 2. Update CORS Configuration (if needed)

Ensure your backend allows requests from your Next.js application:

```typescript
// Example CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

## How It Works

1. User tries to access a protected route (e.g., `/profile`)
2. Next.js middleware extracts the `auth_token` cookie
3. Middleware calls `GET /auth/verify` with the token in the `Authorization` header
4. Backend's `authenticateToken` middleware validates the JWT
5. If valid (200 OK), access is granted
6. If invalid (401/403), user is redirected to login and cookie is cleared

## Benefits

- ✅ Single source of truth for token validation
- ✅ No need to duplicate JWT_SECRET across services
- ✅ Backend controls all authentication logic
- ✅ Automatic token expiry handling
- ✅ Invalid tokens are automatically cleared

## Testing

After implementing the backend endpoint:

1. Start your backend API server
2. Start the Next.js dev server
3. Try accessing `/profile` without logging in → should redirect to login
4. Log in successfully
5. Try accessing `/profile` → should work
6. Manually set an invalid `auth_token` cookie → should redirect to login and clear cookie

## Environment Variables

Make sure to set in your `.env.local`:

```bash
BACKEND_API_URL=http://localhost:3001
```

Adjust the port to match your backend API server.
