import { fetchApi } from '../client';
import type { ApiResponse } from '@repo/types';

export async function likePost(postId: string): Promise<ApiResponse<void>> {
  return fetchApi(`/api/likes/post/${postId}`, {
    method: 'POST',
  });
}

export async function unlikePost(postId: string): Promise<ApiResponse<void>> {
  return fetchApi(`/api/likes/post/${postId}`, {
    method: 'DELETE',
  });
}

export async function hasUserLikedPost(postId: string): Promise<ApiResponse<boolean>> {
  return fetchApi(`/api/likes/post/${postId}/status`);
}
