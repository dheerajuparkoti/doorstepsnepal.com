
import { api } from '@/config/api-client';
import { ProfessionalServiceResponse } from '@/lib/data/professional-services';

export async function fetchProfessionalServices(
  page: number = 1,
  per_page: number = 10000
): Promise<ProfessionalServiceResponse> {
  try {
    return await api.get<ProfessionalServiceResponse>('/professional_services', {
      params: { page, per_page },
      cache: 'force-cache',
      next: { revalidate: 3600 },
    });
  } catch (error) {
    console.error('Error fetching professional services:', error);
    return {
      professional_services: [],
      total: 0,
      page: 1,
      per_page,
      total_pages: 0,
    };
  }
}