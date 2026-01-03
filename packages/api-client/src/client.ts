const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface RequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

export async function fetchApi<T>(
  url: string,
  options?: RequestConfig
): Promise<T> {
  let fullUrl = `${API_BASE_URL}${url}`;

  // Handle query params
  if (options?.params) {
    const queryParams = new URLSearchParams();
    Object.entries(options.params).forEach(([key, value]) => {
      queryParams.append(key, String(value));
    });
    fullUrl += `?${queryParams.toString()}`;
  }

  const response = await fetch(fullUrl, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

export function getApiBaseUrl(): string {
  return API_BASE_URL;
}
