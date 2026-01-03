# Social Media Frontend

A micro-frontend architecture for social media application built with Turborepo, Next.js 16, React 19, and TypeScript.

## Architecture

```
social-media-frontend/
├── apps/
│   ├── core/          # Shell app - layouts, 404/401/500 pages (Port 3000)
│   ├── auth/          # Authentication - login, register, profile (Port 3001)
│   └── social/        # Social features - feed, posts, comments, likes (Port 3002)
├── packages/
│   ├── ui/            # Shared UI components (Button, Card, Input, Avatar, Modal, Spinner)
│   ├── api-client/    # Type-safe API client
│   ├── types/         # Shared TypeScript types
│   ├── auth-lib/      # Auth context, storage, route guards
│   ├── eslint-config/ # Shared ESLint configuration
│   └── typescript-config/ # Shared TypeScript configuration
├── turbo.json
└── package.json
```

## Tech Stack

- **Build Tool**: Turborepo 2.x
- **Package Manager**: npm
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5.x
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **State Management**: React Context + hooks

## Getting Started

### Prerequisites

- Node.js 18+
- npm 10+

### Installation

```bash
# Clone the repository
git clone https://github.com/ahmedgeze/social-media-frontend.git
cd social-media-frontend

# Install dependencies
npm install
```

### Development

```bash
# Run all apps in development mode
npm run dev

# Run specific app
npm run dev --filter=core
npm run dev --filter=auth
npm run dev --filter=social
```

### Build

```bash
# Build all apps
npm run build

# Build specific app
npm run build --filter=core
```

### Ports

| App    | Port | URL                    | Description              |
|--------|------|------------------------|--------------------------|
| Core   | 3000 | http://localhost:3000  | Shell app, home, errors  |
| Auth   | 3001 | http://localhost:3001  | Login, register, profile |
| Social | 3002 | http://localhost:3002  | Feed, posts, users       |

## Kubernetes Deployment

### Local Development with Minikube

#### Prerequisites

- [Minikube](https://minikube.sigs.k8s.io/docs/start/) installed
- [kubectl](https://kubernetes.io/docs/tasks/tools/) installed
- [Docker](https://docs.docker.com/get-docker/) installed

#### Step 1: Start Minikube

```bash
minikube start
```

#### Step 2: Configure Docker to use Minikube's Docker daemon

```bash
eval $(minikube docker-env)
```

#### Step 3: Create namespace

```bash
kubectl create namespace social-media
```

#### Step 4: Build Docker images inside Minikube

```bash
# Build all frontend images
docker build -t social-media-core:latest -f apps/core/Dockerfile .
docker build -t social-media-auth:latest -f apps/auth/Dockerfile .
docker build -t social-media-social:latest -f apps/social/Dockerfile .
```

#### Step 5: Deploy to Kubernetes

```bash
# Deploy frontend services
kubectl apply -f k8s/frontend.yaml

# Deploy ingress
kubectl apply -f k8s/ingress.yaml
```

#### Step 6: Verify deployment

```bash
kubectl get pods -n social-media
kubectl get services -n social-media
```

#### Step 7: Access the application

```bash
# Port forward all services
kubectl port-forward svc/core 3000:3000 -n social-media &
kubectl port-forward svc/auth 3001:3001 -n social-media &
kubectl port-forward svc/social 3002:3002 -n social-media &
kubectl port-forward svc/backend 8080:8080 -n social-media &

# Access the app
open http://localhost:3000
```

### Full Stack Deployment

Deploy the complete social media stack (PostgreSQL, Backend, Frontend):

```bash
# 1. Start Minikube
minikube start

# 2. Configure Docker
eval $(minikube docker-env)

# 3. Create namespace
kubectl create namespace social-media

# 4. Deploy PostgreSQL
kubectl apply -f ../k8s/postgres.yaml

# 5. Build and deploy backend
cd ../backend/social-media-service
docker build -t social-media-backend:latest .
kubectl apply -f ../k8s/backend.yaml

# 6. Build and deploy frontend
cd ../../frontend/social-media-frontend
docker build -t social-media-core:latest -f apps/core/Dockerfile .
docker build -t social-media-auth:latest -f apps/auth/Dockerfile .
docker build -t social-media-social:latest -f apps/social/Dockerfile .
kubectl apply -f ../k8s/frontend.yaml

# 7. Deploy ingress
kubectl apply -f ../k8s/ingress.yaml

# 8. Wait for pods
kubectl wait --for=condition=ready pod -l app=core -n social-media --timeout=120s
kubectl wait --for=condition=ready pod -l app=auth -n social-media --timeout=120s
kubectl wait --for=condition=ready pod -l app=social -n social-media --timeout=120s

# 9. Access via port-forward
kubectl port-forward svc/core 3000:3000 -n social-media
```

## API Integration

The frontend connects to the backend API at `http://backend:8080` inside Kubernetes or `http://localhost:8080` for local development.

### Environment Variables

| Variable              | Description        | Default                |
|-----------------------|--------------------|------------------------|
| `NEXT_PUBLIC_API_URL` | Backend API URL    | http://localhost:8080  |

## Apps

### Core App (`apps/core`)

The shell application that provides:
- Root layout with navigation header
- Home/landing page
- 404 Not Found page
- 401 Unauthorized page
- 500 Error page
- Routing to other micro-frontends via Next.js rewrites

### Auth App (`apps/auth`)

Authentication module providing:
- Login page (`/login`)
- Registration page (`/register`)
- User profile page (`/profile`)

### Social App (`apps/social`)

Social features module providing:
- Feed page with posts (`/` or `/feed`)
- User management (`/users`)
- Post creation, likes, and comments

## Packages

### `@repo/ui`

Shared UI components:
- `Button` - Primary, secondary, danger, ghost variants
- `Card` - Container component with header/title
- `Input` - Form input with label and error states
- `Textarea` - Multi-line input
- `Avatar` - User avatar with initials fallback
- `Modal` - Dialog component
- `Spinner` - Loading indicator

### `@repo/api-client`

Type-safe API client with endpoints for:
- Users (CRUD)
- Posts (CRUD)
- Comments (CRUD)
- Likes (like/unlike)

### `@repo/types`

Shared TypeScript interfaces:
- `User`, `Post`, `Comment`, `Like`
- `ApiResponse<T>`, `PageResponse<T>`
- Request types

### `@repo/auth-lib`

Authentication utilities:
- `AuthProvider` - React context for auth state
- `useAuth` - Hook for accessing auth state
- `ProtectedRoute` - Route guard component
- Token storage utilities

## License

MIT
