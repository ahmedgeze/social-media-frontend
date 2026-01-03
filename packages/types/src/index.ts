// API Response types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// Domain types
export interface User {
  id: string;
  username: string;
  email: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Post {
  id: string;
  content: string;
  imageUrl?: string;
  userId: string;
  username: string;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  content: string;
  userId: string;
  username: string;
  postId: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Like {
  id: string;
  userId: string;
  username: string;
  postId: string;
  createdAt: string;
}

// Request types
export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface CreatePostRequest {
  content: string;
  imageUrl?: string;
}

export interface CreateCommentRequest {
  content: string;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
