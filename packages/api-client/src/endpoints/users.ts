import { fetchApi } from '../client';
import type {
  ApiResponse,
  User,
  PageResponse,
  CreateUserRequest,
} from '@repo/types';

export async function getUsers(): Promise<ApiResponse<PageResponse<User>>> {
  return fetchApi('/api/users');
}

export async function getUser(id: string): Promise<ApiResponse<User>> {
  return fetchApi(`/api/users/${id}`);
}

export async function getCurrentUser(): Promise<ApiResponse<User>> {
  return fetchApi('/api/users/me');
}

export async function updateUser(
  id: string,
  data: Partial<CreateUserRequest>
): Promise<ApiResponse<User>> {
  return fetchApi(`/api/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function createUser(
  data: CreateUserRequest
): Promise<ApiResponse<User>> {
  return fetchApi('/api/users/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
