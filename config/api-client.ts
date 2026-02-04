// config/api-client.ts
import { ApiConstants } from 'config/api-constants';

export async function apiFetch<T = any>(
  endpoint: string, 
  options?: RequestInit & {
    cache?: RequestCache;
    next?: { revalidate?: number | false };
  }
): Promise<T> {
  const url = `${ApiConstants.baseUrl}${endpoint}`;
  
  const fetchOptions: RequestInit & { next?: any } = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'accept': 'application/json',
      ...options?.headers,
    },
  };

  // Add Next.js specific caching options
  if (options?.cache) {
    fetchOptions.cache = options.cache;
  }

  if (options?.next) {
    fetchOptions.next = options.next;
  }

  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText);
    throw new Error(`API Error (${response.status}): ${errorText}`);
  }

  return response.json();
}