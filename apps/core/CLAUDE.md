# Core App - Shell Application

## Overview

Micro-frontend mimarisinin shell uygulaması. Ana layout, navigasyon, hata sayfaları ve diğer micro-frontend'lere routing sağlar.

## Responsibilities

- Ana layout ve header/navigation
- Home/landing page
- Error pages (404, 401, 500)
- Diğer micro-frontend'lere proxy routing
- Global styling ve theme

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4

## Structure

```
apps/core/
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Root layout + Header
│   │   ├── page.tsx          # Home page
│   │   ├── not-found.tsx     # 404 page
│   │   ├── error.tsx         # Error boundary
│   │   └── unauthorized/
│   │       └── page.tsx      # 401 page
│   └── middleware.ts         # Micro-frontend proxy
├── public/                   # Static assets
├── next.config.ts
├── Dockerfile
└── package.json
```

## Routing Proxy

`middleware.ts` diğer servislere runtime proxy yapar:

```typescript
// Auth routes → http://auth:3001
/login, /register, /profile

// Social routes → http://social:3002
/feed, /users
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `AUTH_SERVICE_URL` | Auth service URL | http://localhost:3001 |
| `SOCIAL_SERVICE_URL` | Social service URL | http://localhost:3002 |

## Key Components

### Layout (`app/layout.tsx`)
- HTML skeleton
- Header with navigation links
- Auth state display
- Children wrapper

### Header
- Logo/brand
- Navigation: Home, Feed, Users
- Auth links: Login/Register or Profile/Logout

## Dependencies

```json
{
  "@repo/ui": "workspace:*",
  "@repo/types": "workspace:*",
  "@repo/auth-lib": "workspace:*"
}
```

## Development

```bash
# From monorepo root
npm run dev --filter=core

# Standalone (port 3000)
cd apps/core && npm run dev
```

## Docker Build

```bash
# From monorepo root
docker build -t social-media-core:latest -f apps/core/Dockerfile .
```

## Kubernetes

- **Service**: `core`
- **Port**: 3000
- **ConfigMap**: `core-config`
  - `AUTH_SERVICE_URL`
  - `SOCIAL_SERVICE_URL`

## Code Conventions

- Layout component'lar server component olarak kalır
- Navigation için `next/link` kullanılır
- Error boundary'ler `"use client"` directive gerektirir
- Tailwind class'ları component içinde inline
