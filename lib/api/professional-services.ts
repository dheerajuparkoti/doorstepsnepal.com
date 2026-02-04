import { apiFetch } from '@/config/api-client';
import { ProfessionalServiceResponse } from '@/lib/data/professional-services';

export async function fetchProfessionalServices(
  page: number = 1,
  per_page: number = 10000
): Promise<ProfessionalServiceResponse> {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: per_page.toString(),
    });

    return await apiFetch<ProfessionalServiceResponse>(
      `/professional_services?${params}`,
      {
        cache: 'force-cache',
        next: { revalidate: 3600 },
      }
    );
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
