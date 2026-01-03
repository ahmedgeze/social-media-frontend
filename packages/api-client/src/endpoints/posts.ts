import { fetchApi } from '../client';
import type {
  ApiResponse,
  Post,
  PageResponse,
  CreatePostRequest,
} from '@repo/types';

export async function getPosts(): Promise<ApiResponse<PageResponse<Post>>> {
  return fetchApi('/api/posts');
}

export async function getPost(id: string): Promise<ApiResponse<Post>> {
  return fetchApi(`/api/posts/${id}`);
}

export async function getUserPosts(
  userId: string
): Promise<ApiResponse<PageResponse<Post>>> {
  return fetchApi(`/api/posts/user/${userId}`);
}

export async function createPost(
  data: CreatePostRequest
): Promise<ApiResponse<Post>> {
  return fetchApi('/api/posts', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updatePost(
  id: string,
  data: Partial<CreatePostRequest>
): Promise<ApiResponse<Post>> {
  return fetchApi(`/api/posts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deletePost(id: string): Promise<ApiResponse<void>> {
  return fetchApi(`/api/posts/${id}`, {
    method: 'DELETE',
  });
}
