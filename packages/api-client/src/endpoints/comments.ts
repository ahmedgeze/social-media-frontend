import { fetchApi } from '../client';
import type { ApiResponse, Comment, CreateCommentRequest } from '@repo/types';

export async function getComments(
  postId: number
): Promise<ApiResponse<Comment[]>> {
  return fetchApi(`/api/v1/comments/post/${postId}`);
}

export async function createComment(
  data: CreateCommentRequest
): Promise<ApiResponse<Comment>> {
  return fetchApi('/api/v1/comments', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function deleteComment(id: number): Promise<ApiResponse<void>> {
  return fetchApi(`/api/v1/comments/${id}`, {
    method: 'DELETE',
  });
}
