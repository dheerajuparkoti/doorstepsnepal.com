
import { api } from '@/config/api-client';
import { ProfessionalProfile } from '@/lib/data/service-areas';

export async function fetchProfessionalProfile(professionalId: number): Promise<ProfessionalProfile | null> {
  try {
    return await api.get<ProfessionalProfile>(`/professionals/${professionalId}`, {
      cache: 'force-cache',
      next: { revalidate: 3600 }
    });
  } catch (error) {
    console.error(`Error fetching professional profile ${professionalId}:`, error);
    return null;
  }
}

export async function fetchProfessionalServiceAreas(professionalId: number): Promise<any[]> {
  try {
    const response = await api.get<any>(`/professionals/${professionalId}/service_areas`, {
      cache: 'force-cache',
      next: { revalidate: 3600 }
    });

    return Array.isArray(response) ? response : response.service_areas || [];
  } catch (error) {
    console.error(`Error fetching service areas for professional ${professionalId}:`, error);
    return [];
  }
}

export function transformToDisplayData(
  professionalService: any,
  serviceAreasDisplay: string,
  tag?: string,
  serviceAreasFull?: any[]   
): any {
  return {
    id: professionalService.id || 0,
    user_id: professionalService.professional?.user?.id || 0,
    professional_id: professionalService.professional?.id || 0,
    service_id: professionalService.service?.id || 0,
    service_name: professionalService.service?.name_en || '',
    service_description: professionalService.service?.description_en || '',
    image: professionalService.service?.image || '',
    full_name: professionalService.professional?.user?.full_name || '',
    profile_image_url: professionalService.professional?.user?.profile_image || '',
    service_areas_display: serviceAreasDisplay,
    service_areas_full: serviceAreasFull || [],   
    all_prices: professionalService.prices || [],
    is_minimum_price: professionalService.prices?.some((p: any) => p.is_minimum_price) || false,
    tag: tag,
    all_skills: professionalService.professional?.skill || 'N/A',
    initial_skill_preview: professionalService.professional?.skill || 'N/A',
    category_id: professionalService.service?.category_id || 0,
    sub_category_id: professionalService.service?.sub_category_id || 0,
    service: professionalService.service || null,
  };
}