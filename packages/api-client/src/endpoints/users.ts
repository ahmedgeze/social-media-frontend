import { fetchApi } from '../client';
import type {
  ApiResponse,
  User,
  PageResponse,
  CreateUserRequest,
} from '@repo/types';

export async function getUsers(): Promise<ApiResponse<PageResponse<User>>> {
  return fetchApi('/api/v1/users');
}

export async function getUser(id: number): Promise<ApiResponse<User>> {
  return fetchApi(`/api/v1/users/${id}`);
}

export async function createUser(
  data: CreateUserRequest
): Promise<ApiResponse<User>> {
  return fetchApi('/api/v1/users', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateUser(
  id: number,
  data: Partial<CreateUserRequest>
): Promise<ApiResponse<User>> {
  return fetchApi(`/api/v1/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteUser(id: number): Promise<ApiResponse<void>> {
  return fetchApi(`/api/v1/users/${id}`, {
    method: 'DELETE',
  });
}
