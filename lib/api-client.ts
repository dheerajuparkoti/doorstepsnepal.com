import { ApiConstants } from '@/config/api-constants';

export async function apiFetch(endpoint: string, options?: RequestInit) {
  const url = `${ApiConstants.baseUrl}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
}