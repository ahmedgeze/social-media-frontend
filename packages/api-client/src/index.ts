// Re-export client utilities
export { fetchApi, getApiBaseUrl } from './client';
export type { RequestConfig } from './client';

// Re-export all endpoints
export * from './endpoints/users';
export * from './endpoints/posts';
export * from './endpoints/comments';
export * from './endpoints/likes';
