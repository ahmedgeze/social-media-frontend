# @repo/auth-lib - Authentication Library

## Overview

Authentication state management, token storage ve protected route utilities sağlayan paylaşılan kütüphane.

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
│   ├── context/
│   │   └── AuthContext.tsx   # React context provider
│   ├── hooks/
│   │   └── useAuth.ts        # Auth hook
│   ├── storage/
│   │   └── tokenStorage.ts   # Token persistence
│   ├── components/
│   │   └── ProtectedRoute.tsx
│   └── index.ts
├── package.json
└── tsconfig.json
```

## AuthContext

```typescript
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
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
  const { user, isAuthenticated, login, logout } = useAuth();

  if (!isAuthenticated) {
    return <LoginPrompt />;
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
// Persists to localStorage
const storage = {
  getUser: (): User | null => {
    const data = localStorage.getItem("auth_user");
    return data ? JSON.parse(data) : null;
  },

  setUser: (user: User): void => {
    localStorage.setItem("auth_user", JSON.stringify(user));
  },

  removeUser: (): void => {
    localStorage.removeItem("auth_user");
  },
};
```

## ProtectedRoute

```typescript
import { ProtectedRoute } from "@repo/auth-lib";

// Redirects to /login if not authenticated
<ProtectedRoute>
  <ProfilePage />
</ProtectedRoute>

// Custom redirect
<ProtectedRoute redirectTo="/unauthorized">
  <AdminPanel />
</ProtectedRoute>
```

## Auth Flow

```
1. App loads
   └── AuthProvider checks localStorage for user
       └── If found → set user state, isAuthenticated = true
       └── If not → isAuthenticated = false

2. User logs in
   └── API call verifies credentials
   └── login(user) called
       └── Saves to localStorage
       └── Updates context state
       └── Components re-render

3. User logs out
   └── logout() called
       └── Removes from localStorage
       └── Clears context state
       └── Redirect to home
```

## Usage in Apps

### App Layout (Provider Setup)
```typescript
// apps/auth/src/app/layout.tsx
import { AuthProvider } from "@repo/auth-lib";

export default function Layout({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
```

### Login Page
```typescript
// apps/auth/src/app/login/page.tsx
import { useAuth } from "@repo/auth-lib";
import { apiClient } from "@repo/api-client";

function LoginPage() {
  const { login } = useAuth();

  const handleLogin = async (username: string) => {
    const response = await apiClient.users.getByUsername(username);
    login(response.data);
    router.push("/");
  };
}
```

### Protected Content
```typescript
// apps/social/src/components/CreatePost.tsx
import { useAuth } from "@repo/auth-lib";

function CreatePost() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <p>Please login to create posts</p>;
  }

  // Show create post form with user.id
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

- Token/user stored in localStorage (not httpOnly cookie)
- No JWT implementation - simple user object storage
- For production: implement proper JWT with refresh tokens
- Cross-tab sync via storage event listener (optional)

## Adding Features

### Remember Me
```typescript
const setUser = (user: User, remember: boolean) => {
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem("auth_user", JSON.stringify(user));
};
```

### Token Expiry
```typescript
interface StoredAuth {
  user: User;
  expiresAt: number;
}

const isExpired = (auth: StoredAuth) => Date.now() > auth.expiresAt;
```

## Code Conventions

- Context'ler `"use client"` directive kullanır
- Hook'lar `use` prefix ile başlar
- Storage metodları sync (localStorage sync API)
- Null checks her yerde yapılır
- TypeScript strict mode aktif
