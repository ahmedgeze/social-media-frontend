import { fetchApi } from '../client';
import type { ApiResponse, Comment, CreateCommentRequest, PageResponse } from '@repo/types';

export async function getComments(
  postId: string
): Promise<ApiResponse<PageResponse<Comment>>> {
  return fetchApi(`/api/comments/post/${postId}`);
}

export async function createComment(
  postId: string,
  data: CreateCommentRequest
): Promise<ApiResponse<Comment>> {
  return fetchApi(`/api/comments/post/${postId}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function deleteComment(id: string): Promise<ApiResponse<void>> {
  return fetchApi(`/api/comments/${id}`, {
    method: 'DELETE',
  });
}
