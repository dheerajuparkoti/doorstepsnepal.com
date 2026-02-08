// lib/api/services.ts
import { apiFetch } from '@/config/api-client';
import { Service, ServicesResponse } from '@/lib/data/services';

export async function fetchServices(
  page: number = 1,
  size: number = 10000,
  options?: {
    category_id?: number;
    sub_category_id?: number;
    search?: string;
  }
): Promise<ServicesResponse> {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    if (options?.category_id) {
      params.append('category_id', options.category_id.toString());
    }

    if (options?.sub_category_id) {
      params.append('sub_category_id', options.sub_category_id.toString());
    }

    if (options?.search) {
      params.append('search', options.search);
    }

    // SSR with ISR caching
    return await apiFetch<ServicesResponse>(`/services?${params}`, {
      cache: 'force-cache',
      next: { revalidate: 3600 }, // Revalidate every hour
    });
  } catch (error) {
    console.error('API Error fetching services:', error);
    return getFallbackServices();
  }
}

export async function fetchServiceById(
  id: number
): Promise<Service | null> {
  try {
    return await apiFetch<Service>(`/services/${id}`, {
      cache: 'force-cache',
      next: { revalidate: 3600 },
    });
  } catch (error) {
    console.error(`Error fetching service ${id}:`, error);
    return null;
  }
}

function getFallbackServices(): ServicesResponse {
  return {
    services: [
      {
        id: 1,
        name_en: 'Fix Leakage',
        name_np: 'लीकेज मर्मत',
        description_en: 'Repair all types of pipe leakages',
        description_np: 'सबै प्रकारका पाइप लीक मर्मत गर्नुहोस्',
        image: null,
        category_id: 1,
        sub_category_id: 1,
      },
      {
        id: 2,
        name_en: 'House Cleaning',
        name_np: 'घर सफाई',
        description_en: 'Full house cleaning services',
        description_np: 'पूर्ण घर सफाई सेवा',
        image: null,
        category_id: 1,
        sub_category_id: 2,
      },
    ],
    total: 2,
    page: 1,
    size: 10,
    pages: 1,
  };
}
