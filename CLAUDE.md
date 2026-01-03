# Social Media Frontend - Turborepo Monorepo

## Overview

Micro-frontend mimarisinde sosyal medya uygulaması. Turborepo ile yönetilen monorepo yapısında 3 uygulama ve 4 paylaşılan paket içerir.

## Tech Stack

- **Build Tool**: Turborepo 2.x
- **Package Manager**: npm
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5.x
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4

## Architecture

```
social-media-frontend/
├── apps/
│   ├── core/          # Shell app - ana layout, hata sayfaları (Port 3000)
│   ├── auth/          # Auth modülü - login, register, profile (Port 3001)
│   └── social/        # Sosyal modül - feed, posts, users (Port 3002)
├── packages/
│   ├── ui/            # Paylaşılan UI componentleri
│   ├── types/         # Paylaşılan TypeScript tipleri
│   ├── api-client/    # Type-safe API client
│   ├── auth-lib/      # Auth utilities ve context
│   ├── eslint-config/ # Paylaşılan ESLint config
│   └── typescript-config/ # Paylaşılan TS config
├── turbo.json         # Turborepo pipeline config
└── package.json       # Root workspace config
```

## Micro-Frontend Routing

Core app diğer uygulamalara middleware ile proxy yapar:

| Route | Target App | Port |
|-------|------------|------|
| `/` | core | 3000 |
| `/login`, `/register`, `/profile` | auth | 3001 |
| `/feed`, `/users` | social | 3002 |

### Kubernetes Service Discovery
```
AUTH_SERVICE_URL=http://auth:3001
SOCIAL_SERVICE_URL=http://social:3002
```

## Package Dependencies

```
apps/core     → @repo/ui, @repo/types, @repo/auth-lib
apps/auth     → @repo/ui, @repo/types, @repo/api-client, @repo/auth-lib
apps/social   → @repo/ui, @repo/types, @repo/api-client, @repo/auth-lib
```

## Key Files

| File | Purpose |
|------|---------|
| `turbo.json` | Pipeline tanımları (build, dev, lint) |
| `package.json` | Workspace tanımı ve root scripts |
| `apps/*/next.config.ts` | Next.js app configs |
| `apps/core/src/middleware.ts` | Micro-frontend routing proxy |

## Development

```bash
# Install dependencies
npm install

# Run all apps
npm run dev

# Run specific app
npm run dev --filter=core
npm run dev --filter=auth
npm run dev --filter=social

# Build all
npm run build

# Lint all
npm run lint
```

## Docker Build

Her app için ayrı Dockerfile:
```bash
docker build -t social-media-core:latest -f apps/core/Dockerfile .
docker build -t social-media-auth:latest -f apps/auth/Dockerfile .
docker build -t social-media-social:latest -f apps/social/Dockerfile .
```

## Environment Variables

| Variable | App | Description |
|----------|-----|-------------|
| `NEXT_PUBLIC_API_URL` | auth, social | Backend API URL |
| `AUTH_SERVICE_URL` | core | Auth service internal URL |
| `SOCIAL_SERVICE_URL` | core | Social service internal URL |

## Code Conventions

- Component dosyaları PascalCase: `Button.tsx`, `PostCard.tsx`
- Hook dosyaları camelCase: `useAuth.ts`, `usePosts.ts`
- Utility dosyaları camelCase: `apiClient.ts`, `storage.ts`
- Her package `src/index.ts` ile export eder
- Tailwind CSS class'ları inline kullanılır
- `"use client"` directive client component'lar için zorunlu

## Adding New Package

```bash
# 1. Create package directory
mkdir -p packages/new-package/src

# 2. Add package.json
{
  "name": "@repo/new-package",
  "main": "./src/index.ts",
  "types": "./src/index.ts"
}

# 3. Add tsconfig.json extending base
{
  "extends": "@repo/typescript-config/react-library.json"
}

# 4. Export from src/index.ts
export * from "./components";
```

## Adding New App

```bash
# 1. Create app with Next.js
cd apps && npx create-next-app@latest new-app --typescript --tailwind

# 2. Update next.config.ts
output: "standalone"
transpilePackages: ["@repo/ui", "@repo/types"]

# 3. Add Dockerfile following existing pattern

# 4. Update core middleware for routing
```
