# Social App - Social Features Module

## Overview

Sosyal medya özelliklerini sağlayan micro-frontend. Feed, post oluşturma, yorum ve beğeni işlemlerini içerir.

## Responsibilities

- Post feed (timeline)
- Post creation
- Comments on posts
- Like/unlike posts
- User listing

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4

## Structure

```
apps/social/
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Social layout
│   │   ├── page.tsx         # Feed page (main)
│   │   └── users/
│   │       └── page.tsx     # Users list page
│   └── components/
│       ├── PostCard.tsx     # Post display component
│       ├── CreatePost.tsx   # New post form
│       ├── CommentSection.tsx
│       └── UserSelector.tsx
├── public/
├── next.config.ts
├── Dockerfile
└── package.json
```

## Pages

### Feed (`/` or `/feed`)
- Post listesi (paginated)
- CreatePost form (authenticated users)
- Her post için:
  - Author info
  - Content
  - Like count + like button
  - Comments section

### Users (`/users`)
- Tüm kullanıcı listesi
- User card'ları
- User selection for post creation

## API Integration

```typescript
import { apiClient } from "@repo/api-client";

// Posts
const posts = await apiClient.posts.getAll(page, size);
const post = await apiClient.posts.create({ content, userId });

// Comments
const comments = await apiClient.comments.getByPost(postId);
await apiClient.comments.create(postId, { content, userId });

// Likes
await apiClient.likes.like(postId, userId);
await apiClient.likes.unlike(postId, userId);
```

## Key Components

### PostCard
```typescript
interface PostCardProps {
  post: Post;
  currentUserId?: number;
  onLike: (postId: number) => void;
  onComment: (postId: number, content: string) => void;
}
```
- Author avatar + name
- Post content
- Like button (toggle)
- Like count
- Comment section (collapsible)

### CreatePost
- Textarea for content
- User selector (dropdown)
- Submit button
- Character count

### CommentSection
- Comment listesi
- Add comment form
- Delete comment (own comments)

### UserSelector
- Dropdown to select post author
- Fetches users from API
- Used in CreatePost

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

## State Management

- React useState for local component state
- useAuth hook for current user
- Props drilling for callbacks
- API calls trigger re-fetch

## Development

```bash
# From monorepo root
npm run dev --filter=social

# Standalone (port 3002)
cd apps/social && npm run dev
```

## Docker Build

```bash
docker build -t social-media-social:latest -f apps/social/Dockerfile .
```

## Kubernetes

- **Service**: `social`
- **Port**: 3002
- **ConfigMap**: `social-config`
  - `NEXT_PUBLIC_API_URL`: http://backend:8080

## Code Conventions

- Interactive component'lar `"use client"` directive kullanır
- Optimistic UI updates for likes
- Pagination için infinite scroll veya "Load More"
- Empty state component'ları göster
- Loading skeleton'ları kullan
