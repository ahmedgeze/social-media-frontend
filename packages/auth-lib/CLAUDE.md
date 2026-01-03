# @repo/auth-lib - Authentication Library

## Overview

Keycloak OAuth2/OIDC entegrasyonlu authentication state management, token storage ve protected route utilities sağlayan paylaşılan kütüphane.

## Package Info

```json
{
  "name": "@repo/auth-lib",
  "main": "./src/index.ts",
  "types": "./src/index.ts"
}
```

## Structure

```
packages/auth-lib/
├── src/
│   ├── context.tsx      # React AuthProvider + useAuth hook
│   ├── storage.ts       # Token persistence (access, refresh, id tokens)
│   ├── guards.tsx       # ProtectedRoute, PublicOnlyRoute
│   ├── keycloak.ts      # Keycloak PKCE auth flow
│   └── index.ts         # Public exports
├── package.json
└── tsconfig.json
```

## Keycloak Integration

```typescript
// Environment variables
NEXT_PUBLIC_KEYCLOAK_URL=http://localhost:8180
NEXT_PUBLIC_KEYCLOAK_REALM=social-media
NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=social-media-frontend

// Keycloak config
import { keycloakConfig, keycloakEndpoints } from "@repo/auth-lib";
```

## AuthContext

```typescript
interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (returnUrl?: string) => void;           // Redirect to Keycloak
  loginWithTokens: (tokens: TokenBundle, user: User) => void;
  logout: () => void;                            // Clear + Keycloak logout
  setUser: (user: User) => void;
  refreshAuth: () => Promise<boolean>;           // Refresh tokens
}

// Provider wraps app
<AuthProvider>
  <App />
</AuthProvider>
```

## useAuth Hook

```typescript
import { useAuth } from "@repo/auth-lib";

function MyComponent() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();

  if (isLoading) return <Spinner />;

  if (!isAuthenticated) {
    return <button onClick={() => login()}>Login with Keycloak</button>;
  }

  return (
    <div>
      <p>Welcome, {user.username}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## Token Storage

```typescript
import {
  getToken,           // Access token
  getRefreshToken,    // Refresh token
  getIdToken,         // ID token
  setTokens,          // Set all tokens at once
  isTokenExpired,     // Check if access token expired
  clearAuth,          // Clear all auth data
} from "@repo/auth-lib";

// Token bundle type
interface TokenBundle {
  accessToken: string;
  refreshToken: string;
  idToken: string;
  expiresIn: number;
}
```

## Keycloak Functions

```typescript
import {
  redirectToLogin,       // PKCE login redirect
  redirectToLogout,      // Keycloak logout
  redirectToRegister,    // Keycloak registration
  exchangeCodeForTokens, // Exchange auth code for tokens
  refreshTokens,         // Refresh access token
  parseJwt,              // Parse JWT payload
} from "@repo/auth-lib";
```

## ProtectedRoute

```typescript
import { ProtectedRoute } from "@repo/auth-lib";

// Redirects to Keycloak login if not authenticated
<ProtectedRoute>
  <ProfilePage />
</ProtectedRoute>

// With custom fallback
<ProtectedRoute fallback={<Loading />}>
  <Dashboard />
</ProtectedRoute>

// Disable Keycloak redirect (use /login page instead)
<ProtectedRoute useKeycloakLogin={false}>
  <AdminPanel />
</ProtectedRoute>
```

## Auth Flow (PKCE)

```
1. User clicks "Login with Keycloak"
   └── Generate PKCE verifier + challenge
   └── Store verifier in sessionStorage
   └── Redirect to Keycloak /auth endpoint

2. User authenticates in Keycloak
   └── Keycloak redirects to /auth/callback?code=xxx

3. Callback page handles response
   └── Exchange code for tokens (with PKCE verifier)
   └── Parse user info from ID token
   └── Store tokens in localStorage
   └── Update AuthContext state
   └── Redirect to original URL

4. App loads with existing tokens
   └── AuthProvider checks localStorage
   └── If tokens expired → refresh using refresh_token
   └── Auto-refresh runs every 60 seconds
```

## Auth Callback Page

Create `/auth/callback/page.tsx` in your app:

```typescript
"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { exchangeCodeForTokens, parseJwt, useAuth } from "@repo/auth-lib";

export default function AuthCallback() {
  const searchParams = useSearchParams();
  const { loginWithTokens } = useAuth();

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (code) {
      exchangeCodeForTokens(code).then(tokens => {
        const user = parseJwt(tokens.id_token);
        loginWithTokens({
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          idToken: tokens.id_token,
          expiresIn: tokens.expires_in,
        }, user);
        window.location.href = state || "/";
      });
    }
  }, []);

  return <div>Completing sign in...</div>;
}
```

## Dependencies

```json
{
  "react": "^19.0.0",
  "@repo/types": "workspace:*",
  "@repo/typescript-config": "workspace:*"
}
```

## Security Notes

- PKCE flow kullanılır (code_challenge + code_verifier)
- Access token localStorage'da tutulur
- Refresh token ile otomatik yenileme yapılır
- Token expiry 60 saniye önceden kontrol edilir
- Keycloak logout tüm session'ları temizler

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_KEYCLOAK_URL` | Keycloak base URL | http://localhost:8180 |
| `NEXT_PUBLIC_KEYCLOAK_REALM` | Keycloak realm name | social-media |
| `NEXT_PUBLIC_KEYCLOAK_CLIENT_ID` | Frontend client ID | social-media-frontend |

## Code Conventions

- Context'ler `"use client"` directive kullanır
- Hook'lar `use` prefix ile başlar
- Token refresh async/await pattern
- Null checks her yerde yapılır
- TypeScript strict mode aktif
