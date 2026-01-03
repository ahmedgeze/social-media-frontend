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
  id: number;
  username: string;
  email: string;
  fullName: string | null;
  bio: string | null;
  profilePictureUrl: string | null;
  createdAt: string;
}

export interface Post {
  id: number;
  content: string;
  imageUrl: string | null;
  userId: number;
  username: string;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: number;
  content: string;
  userId: number;
  username: string;
  postId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Like {
  id: number;
  userId: number;
  username: string;
  postId: number;
  createdAt: string;
}

// Request types
export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  fullName?: string;
  bio?: string;
}

export interface CreatePostRequest {
  content: string;
  imageUrl?: string;
  userId: number;
}

export interface CreateCommentRequest {
  content: string;
  userId: number;
  postId: number;
}

export interface LikeRequest {
  userId: number;
  postId: number;
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
