import { fetchApi } from '../client';
import type {
  ApiResponse,
  Post,
  PageResponse,
  CreatePostRequest,
} from '@repo/types';

export async function getPosts(): Promise<ApiResponse<PageResponse<Post>>> {
  return fetchApi('/api/v1/posts');
}

export async function getPost(id: number): Promise<ApiResponse<Post>> {
  return fetchApi(`/api/v1/posts/${id}`);
}

export async function getUserPosts(
  userId: number
): Promise<ApiResponse<PageResponse<Post>>> {
  return fetchApi(`/api/v1/posts/user/${userId}`);
}

export async function createPost(
  data: CreatePostRequest
): Promise<ApiResponse<Post>> {
  return fetchApi('/api/v1/posts', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updatePost(
  id: number,
  data: Partial<CreatePostRequest>
): Promise<ApiResponse<Post>> {
  return fetchApi(`/api/v1/posts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deletePost(id: number): Promise<ApiResponse<void>> {
  return fetchApi(`/api/v1/posts/${id}`, {
    method: 'DELETE',
  });
}
