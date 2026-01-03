# Auth App - Authentication Module

## Overview

Kullanıcı authentication işlemlerini yöneten micro-frontend. Login, register ve profile sayfalarını içerir.

## Responsibilities

- User login/logout
- User registration
- Profile management
- Auth state management
- Token storage

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4

## Structure

```
apps/auth/
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Auth layout
│   │   ├── login/
│   │   │   └── page.tsx     # Login page
│   │   ├── register/
│   │   │   └── page.tsx     # Register page
│   │   └── profile/
│   │       └── page.tsx     # Profile page (protected)
│   └── components/
│       ├── LoginForm.tsx
│       └── RegisterForm.tsx
├── public/
├── next.config.ts
├── Dockerfile
└── package.json
```

## Pages

### Login (`/login`)
- Email/username input
- Password input
- Submit → API call → Token storage → Redirect

### Register (`/register`)
- Username input
- Email input
- Password input
- Submit → Create user → Auto login → Redirect

### Profile (`/profile`)
- Protected route (requires auth)
- Display user info
- Edit profile form
- Logout button

## API Integration

```typescript
import { apiClient } from "@repo/api-client";

// Login
const user = await apiClient.users.getByUsername(username);

// Register
const user = await apiClient.users.create({ username, email });
```

## Auth Flow

```
1. User submits login form
2. API call to get user by username
3. Store user in localStorage (via auth-lib)
4. Update AuthContext state
5. Redirect to home/feed
```

## Dependencies

```json
{
  "@repo/ui": "workspace:*",
  "@repo/types": "workspace:*",
  "@repo/api-client": "workspace:*",
  "@repo/auth-lib": "workspace:*"
}
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | http://localhost:8080 |

## Key Components

### LoginForm
- Controlled form inputs
- Form validation
- Error display
- Loading state

### RegisterForm
- Username, email, password fields
- Validation
- Success/error feedback

## Development

```bash
# From monorepo root
npm run dev --filter=auth

# Standalone (port 3001)
cd apps/auth && npm run dev
```

## Docker Build

```bash
docker build -t social-media-auth:latest -f apps/auth/Dockerfile .
```

## Kubernetes

- **Service**: `auth`
- **Port**: 3001
- **ConfigMap**: `auth-config`
  - `NEXT_PUBLIC_API_URL`: http://backend:8080

## Code Conventions

- Form component'lar `"use client"` directive kullanır
- Validation hataları inline gösterilir
- Loading durumunda button disabled + spinner
- Başarılı işlemde redirect, hata durumunda toast/alert
