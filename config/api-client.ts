// // config/api-client.ts
// import { ApiConstants } from 'config/api-constants';

// export async function apiRequest<T = any>(
//   endpoint: string, 
//   options?: RequestInit & {
//     cache?: RequestCache;
//     next?: { revalidate?: number | false };
//   }
// ): Promise<T> {
//   const url = `${ApiConstants.baseUrl}${endpoint}`;
  
//   const fetchOptions: RequestInit & { next?: any } = {
//     ...options,
//     headers: {
//       'Content-Type': 'application/json',
//       'accept': 'application/json',
//       ...options?.headers,
//     },
//   };

//   // Add Next.js specific caching options
//   if (options?.cache) {
//     fetchOptions.cache = options.cache;
//   }

//   if (options?.next) {
//     fetchOptions.next = options.next;
//   }

//   const response = await fetch(url, fetchOptions);

//   if (!response.ok) {
//     const errorText = await response.text().catch(() => response.statusText);
//     throw new Error(`API Error (${response.status}): ${errorText}`);
//   }

//   return response.json();
// }





// config/api-client.ts
import { ApiConstants } from 'config/api-constants';

// Token management utilities
export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  // Check multiple possible token locations for backward compatibility
  return (
    localStorage.getItem('token') || 
    sessionStorage.getItem('token') ||
    localStorage.getItem('access_token') ||
    localStorage.getItem('auth_token') ||
    ''
  );
};

export const setToken = (token: string, remember: boolean = true): void => {
  if (typeof window === 'undefined') return;
  
  // Clear old tokens first
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
  localStorage.removeItem('access_token');
  localStorage.removeItem('auth_token');
  
  // Store new token
  if (remember) {
    localStorage.setItem('token', token);
    localStorage.setItem('access_token', token); 
  } else {
    sessionStorage.setItem('token', token);
  }
};

export const removeToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
  localStorage.removeItem('access_token');
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

// Base request function
interface ApiRequestOptions extends RequestInit {
  skipAuth?: boolean;
  cache?: RequestCache;
  next?: { revalidate?: number | false };
   params?: Record<string, any> | URLSearchParams;
}

async function baseRequest<T = any>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const { skipAuth = false, params, ...fetchOptions } = options;
  
  // Build URL with query parameters
  let url = `${ApiConstants.baseUrl}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }
  
  // Prepare headers
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'accept': 'application/json',
    ...(fetchOptions.headers as Record<string, string>),
  };
  

  
  // Remove Content-Type if it's FormData (browser will set it automatically)
  if (fetchOptions.body instanceof FormData) {
    delete headers['Content-Type'];
  }
  
  // Add Authorization header for authenticated requests
  if (!skipAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      console.warn(' No JWT token found for authenticated request to:', endpoint);
    }
  }
  
  const finalOptions: RequestInit = {
    ...fetchOptions,
    headers,
    credentials: 'omit',
  };
  
  // Add logging for debugging
  if (process.env.NODE_ENV === 'development') {
    // console.log(' API Request:', {
    //   url,
    //   method: finalOptions.method || 'GET',
    //   hasToken: !skipAuth && !!getToken(),
    //   skipAuth,
    //   params,
    // });
  }

  try {
    const response = await fetch(url, finalOptions);

    if (process.env.NODE_ENV === 'development') {
      // console.log(' API Response:', {
      //   status: response.status,
      //   ok: response.ok,
      //   url: response.url,
      // });
    }

    // Handle 401 Unauthorized - token expired or invalid
    if (response.status === 401 && !skipAuth) {
      removeToken();
      
      // Only redirect if we're in the browser
      if (typeof window !== 'undefined') {
        // Don't redirect from login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login?session_expired=true';
        }
      }
      
      throw new Error('Authentication required. Please login again.');
    }

    if (!response.ok) {
      let errorMessage = `API Error (${response.status})`;
      let errorData: any = null;
      
      try {
        const text = await response.text();
        if (text) {
          try {
            errorData = JSON.parse(text);
            errorMessage = errorData.message || errorData.detail || errorData.error || errorMessage;
          } catch {
            errorMessage = text;
          }
        }
      } catch (e) {
        errorMessage = response.statusText || errorMessage;
      }
      
      const error = new Error(errorMessage);
      (error as any).status = response.status;
      (error as any).data = errorData;
      
      throw error;
    }

    // Handle empty responses (204 No Content)
    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      // console.error(' API Request Failed:', {
      //   url,
      //   error: error instanceof Error ? error.message : 'Unknown error',
      // });
    }
    throw error;
  }
}

// Generic HTTP Methods
export const api = {
  // GET request
  get: <T = any>(endpoint: string, options?: Omit<ApiRequestOptions, 'method'>): Promise<T> => {
    return baseRequest<T>(endpoint, { ...options, method: 'GET' });
  },

  // POST request
  post: <T = any>(endpoint: string, data?: any, options?: Omit<ApiRequestOptions, 'method' | 'body'>): Promise<T> => {
    return baseRequest<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  },

  // PUT request
  put: <T = any>(endpoint: string, data?: any, options?: Omit<ApiRequestOptions, 'method' | 'body'>): Promise<T> => {
    return baseRequest<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  },

  // PATCH request
  patch: <T = any>(endpoint: string, data?: any, options?: Omit<ApiRequestOptions, 'method' | 'body'>): Promise<T> => {
    return baseRequest<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  },

  // DELETE request
  delete: <T = any>(endpoint: string, options?: Omit<ApiRequestOptions, 'method'>): Promise<T> => {
    return baseRequest<T>(endpoint, { ...options, method: 'DELETE' });
  },

  // HEAD request
  head: <T = any>(endpoint: string, options?: Omit<ApiRequestOptions, 'method'>): Promise<T> => {
    return baseRequest<T>(endpoint, { ...options, method: 'HEAD' });
  },

  // OPTIONS request
  options: <T = any>(endpoint: string, options?: Omit<ApiRequestOptions, 'method'>): Promise<T> => {
    return baseRequest<T>(endpoint, { ...options, method: 'OPTIONS' });
  },
};

// For backward compatibility - keep the old function name
export const apiRequest = baseRequest;

// Export individual methods for convenience
export const apiGet = api.get;
export const apiPost = api.post;
export const apiPut = api.put;
export const apiPatch = api.patch;
export const apiDelete = api.delete;