# @repo/types - Shared TypeScript Types

## Overview

Tüm uygulamalar ve paketler tarafından kullanılan paylaşılan TypeScript tip tanımlamaları.

## Package Info

```json
{
  "name": "@repo/types",
  "main": "./src/index.ts",
  "types": "./src/index.ts"
}
```

## Structure

```
packages/types/
├── src/
│   ├── entities.ts      # Domain entity types
│   ├── api.ts           # API request/response types
│   ├── common.ts        # Common utility types
│   └── index.ts         # Re-exports all types
├── package.json
└── tsconfig.json
```

## Entity Types

### User
```typescript
interface User {
  id: number;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}
```

### Post
```typescript
interface Post {
  id: number;
  content: string;
  user: User;
  comments: Comment[];
  likes: Like[];
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}
```

### Comment
```typescript
interface Comment {
  id: number;
  content: string;
  user: User;
  postId: number;
  createdAt: string;
}
```

### Like
```typescript
interface Like {
  id: number;
  user: User;
  postId: number;
  createdAt: string;
}
```

## API Types

### Request Types
```typescript
interface CreateUserRequest {
  username: string;
  email: string;
}

interface UpdateUserRequest {
  username?: string;
  email?: string;
}

interface CreatePostRequest {
  content: string;
  userId: number;
}

interface CreateCommentRequest {
  content: string;
  userId: number;
}
```

### Response Types
```typescript
interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

interface ErrorResponse {
  message: string;
  status: number;
  timestamp: string;
}
```

## Usage

```typescript
import type { User, Post, ApiResponse, PageResponse } from "@repo/types";

// Function return types
async function getUsers(): Promise<ApiResponse<User[]>> { ... }

// Component props
interface PostCardProps {
  post: Post;
  onLike: (postId: number) => void;
}

// API response handling
const response: PageResponse<Post> = await apiClient.posts.getAll();
console.log(response.content); // Post[]
```

## Type Guards

```typescript
// Optional: Add type guards for runtime checking
function isUser(obj: unknown): obj is User {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj &&
    "username" in obj &&
    "email" in obj
  );
}
```

## Dependencies

```json
{
  "@repo/typescript-config": "workspace:*"
}
```

## Adding New Types

1. Determine category (entities, api, common)
2. Add to appropriate file
3. Export from `src/index.ts`
4. Use `interface` for objects, `type` for unions/intersections

```typescript
// src/entities.ts
export interface Notification {
  id: number;
  type: "like" | "comment" | "follow";
  message: string;
  read: boolean;
  createdAt: string;
}

// src/index.ts
export type { Notification } from "./entities";
```

## Code Conventions

- `interface` tercih edilir (extends için)
- `type` unions/intersections için
- Optional fields `?` ile işaretlenir
- Date fields string olarak (`ISO 8601`)
- ID fields `number` tipinde
- All exports use `export type` for type-only exports
