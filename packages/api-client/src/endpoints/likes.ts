import { fetchApi } from '../client';
import type { ApiResponse, Like, LikeRequest } from '@repo/types';

export async function likePost(data: LikeRequest): Promise<ApiResponse<Like>> {
  return fetchApi('/api/v1/likes', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function unlikePost(
  userId: number,
  postId: number
): Promise<ApiResponse<void>> {
  return fetchApi(`/api/v1/likes?userId=${userId}&postId=${postId}`, {
    method: 'DELETE',
  });
}

export async function hasUserLiked(
  userId: number,
  postId: number
): Promise<ApiResponse<boolean>> {
  return fetchApi(`/api/v1/likes/check?userId=${userId}&postId=${postId}`);
}

export async function getPostLikes(postId: number): Promise<ApiResponse<Like[]>> {
  return fetchApi(`/api/v1/likes/post/${postId}`);
}
