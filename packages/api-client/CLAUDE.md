# @repo/api-client - Type-Safe API Client

## Overview

Backend API ile iletişim için type-safe HTTP client. Tüm endpoint'ler için tip güvenli metodlar sağlar.

## Package Info

```json
{
  "name": "@repo/api-client",
  "main": "./src/index.ts",
  "types": "./src/index.ts"
}
```

## Structure

```
packages/api-client/
├── src/
│   ├── client.ts         # Base HTTP client
│   ├── endpoints/
│   │   ├── users.ts      # User API methods
│   │   ├── posts.ts      # Post API methods
│   │   ├── comments.ts   # Comment API methods
│   │   └── likes.ts      # Like API methods
│   └── index.ts          # Main export
├── package.json
└── tsconfig.json
```

## Base Client

```typescript
// src/client.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}
```

## API Endpoints

### Users API
```typescript
const users = {
  getAll: () =>
    request<ApiResponse<User[]>>("/api/users"),

  getById: (id: number) =>
    request<ApiResponse<User>>(`/api/users/${id}`),

  getByUsername: (username: string) =>
    request<ApiResponse<User>>(`/api/users/username/${username}`),

  create: (data: CreateUserRequest) =>
    request<ApiResponse<User>>("/api/users", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: number, data: UpdateUserRequest) =>
    request<ApiResponse<User>>(`/api/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    request<void>(`/api/users/${id}`, { method: "DELETE" }),
};
```

### Posts API
```typescript
const posts = {
  getAll: (page = 0, size = 10) =>
    request<ApiResponse<PageResponse<Post>>>(`/api/posts?page=${page}&size=${size}`),

  getById: (id: number) =>
    request<ApiResponse<Post>>(`/api/posts/${id}`),

  create: (data: CreatePostRequest) =>
    request<ApiResponse<Post>>("/api/posts", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: number, data: { content: string }) =>
    request<ApiResponse<Post>>(`/api/posts/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    request<void>(`/api/posts/${id}`, { method: "DELETE" }),
};
```

### Comments API
```typescript
const comments = {
  getByPost: (postId: number) =>
    request<ApiResponse<Comment[]>>(`/api/posts/${postId}/comments`),

  create: (postId: number, data: CreateCommentRequest) =>
    request<ApiResponse<Comment>>(`/api/posts/${postId}/comments`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    request<void>(`/api/comments/${id}`, { method: "DELETE" }),
};
```

### Likes API
```typescript
const likes = {
  like: (postId: number, userId: number) =>
    request<ApiResponse<Like>>(`/api/posts/${postId}/likes?userId=${userId}`, {
      method: "POST",
    }),

  unlike: (postId: number, userId: number) =>
    request<void>(`/api/posts/${postId}/likes?userId=${userId}`, {
      method: "DELETE",
    }),
};
```

## Usage

```typescript
import { apiClient } from "@repo/api-client";

// Get all users
const usersResponse = await apiClient.users.getAll();
const users = usersResponse.data;

// Create post
const postResponse = await apiClient.posts.create({
  content: "Hello World!",
  userId: 1,
});

// Like a post
await apiClient.likes.like(postId, userId);

// Paginated posts
const postsResponse = await apiClient.posts.getAll(0, 20);
const { content, totalPages } = postsResponse.data;
```

## Error Handling

```typescript
try {
  const user = await apiClient.users.getById(999);
} catch (error) {
  if (error instanceof Error) {
    console.error(error.message); // "API Error: 404"
  }
}
```

## Dependencies

```json
{
  "@repo/types": "workspace:*",
  "@repo/typescript-config": "workspace:*"
}
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | http://localhost:8080 |

## Adding New Endpoint

1. Create file in `src/endpoints/`
2. Define methods using `request<T>` helper
3. Add to main apiClient export in `src/index.ts`

```typescript
// src/endpoints/notifications.ts
import { request } from "../client";
import type { Notification, ApiResponse } from "@repo/types";

export const notifications = {
  getAll: () =>
    request<ApiResponse<Notification[]>>("/api/notifications"),

  markRead: (id: number) =>
    request<void>(`/api/notifications/${id}/read`, { method: "POST" }),
};

// src/index.ts
import { notifications } from "./endpoints/notifications";

export const apiClient = {
  users,
  posts,
  comments,
  likes,
  notifications, // Add here
};
```

## Code Conventions

- Tüm API metodları async/Promise döner
- Request body `JSON.stringify` ile serialize edilir
- Response `ApiResponse<T>` wrapper içinde
- Error handling try/catch ile yapılır
- Environment variable için `NEXT_PUBLIC_` prefix (client-side access)
