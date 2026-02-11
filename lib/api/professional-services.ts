
// import { api } from '@/config/api-client';
// import { ProfessionalServiceResponse } from '@/lib/data/professional-services';

// export async function fetchProfessionalServices(
//   page: number = 1,
//   per_page: number = 10000
// ): Promise<ProfessionalServiceResponse> {
//   try {
//     return await api.get<ProfessionalServiceResponse>('/professional_services', {
//       params: { page, per_page },
//       cache: 'force-cache',
//       next: { revalidate: 3600 },
//     });
//   } catch (error) {
//     console.error('Error fetching professional services:', error);
//     return {
//       professional_services: [],
//       total: 0,
//       page: 1,
//       per_page,
//       total_pages: 0,
//     };
//   }
// }


import { api } from '@/config/api-client';
import { 
  ProfessionalServiceResponse, 
  ProfessionalService,
  BrowseableService,
  CreatePriceRequest,
  UpdatePriceRequest,
  CreateProfessionalServiceRequest,
  PriceUnit,
  QualityType,
  ProfessionalServicePrice
} from '@/lib/data/professional-services';

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

export async function fetchServicesByProfessionalId(
  professionalId: number,
  userId?: number
): Promise<ProfessionalService[]> {
  try {
    const params: any = {};
    if (userId) params.user_id = userId;
    
    return await api.get<ProfessionalService[]>(`/professional_services/by-professional/${professionalId}`, {
      params,
      cache: 'no-store',
    });
  } catch (error) {
    console.error('Error fetching services by professional:', error);
    return [];
  }
}

export async function fetchProfessionalServiceById(
  professionalServiceId: number
): Promise<ProfessionalService | null> {
  try {
    return await api.get<ProfessionalService>(`/professional_services/${professionalServiceId}`, {
      cache: 'no-store',
    });
  } catch (error) {
    console.error('Error fetching professional service by ID:', error);
    return null;
  }
}

export async function fetchBrowseableServices(
  professionalId: number
): Promise<BrowseableService[]> {
  try {
    return await api.get<BrowseableService[]>('/professional_services/browseable', {
      params: { professional_id: professionalId },
      cache: 'no-store',
    });
  } catch (error) {
    console.error('Error fetching browseable services:', error);
    return [];
  }
}

export async function createProfessionalService(
  data: CreateProfessionalServiceRequest
): Promise<{ id: number } | null> {
  try {
    return await api.post<{ id: number }>('/professional_services', data);
  } catch (error) {
    console.error('Error creating professional service:', error);
    return null;
  }
}

export async function updateProfessionalService(
  professionalServiceId: number,
  data: Partial<CreateProfessionalServiceRequest>
): Promise<{ id: number } | null> {
  try {
    return await api.put<{ id: number }>(`/professional_services/${professionalServiceId}`, data);
  } catch (error) {
    console.error('Error updating professional service:', error);
    return null;
  }
}

export async function patchProfessionalService(
  professionalServiceId: number,
  data: Partial<CreateProfessionalServiceRequest>
): Promise<{ id: number } | null> {
  try {
    return await api.patch<{ id: number }>(`/professional_services/${professionalServiceId}`, data);
  } catch (error) {
    console.error('Error patching professional service:', error);
    return null;
  }
}

// Price-related APIs
export async function fetchPrices(
  professionalServiceId: number
): Promise<ProfessionalServicePrice[]> {
  try {
    return await api.get<ProfessionalServicePrice[]>('/professional-service-prices/', {
      params: { professional_service_id: professionalServiceId },
      cache: 'no-store',
    });
  } catch (error) {
    console.error('Error fetching prices:', error);
    return [];
  }
}

export async function createPrice(
  data: CreatePriceRequest
): Promise<ProfessionalServicePrice | null> {
  try {
    return await api.post<ProfessionalServicePrice>('/professional-service-prices/', data);
  } catch (error) {
    console.error('Error creating price:', error);
    return null;
  }
}

export async function updatePrice(
  priceId: number,
  data: UpdatePriceRequest
): Promise<ProfessionalServicePrice | null> {
  try {
    return await api.put<ProfessionalServicePrice>(`/professional-service-prices/${priceId}`, data, {
      params: { price_id: priceId }
    });
  } catch (error) {
    console.error('Error updating price:', error);
    return null;
  }
}

export async function deletePrice(
  priceId: number
): Promise<boolean> {
  try {
    await api.delete(`/professional-service-prices/${priceId}`, {
      params: { price_id: priceId }
    });
    return true;
  } catch (error) {
    console.error('Error deleting price:', error);
    return false;
  }
}

export async function fetchPriceUnits(): Promise<PriceUnit[]> {
  try {
    // You might need to create this endpoint or get it from another API
    return await api.get<PriceUnit[]>('/service-price-units/', { cache: 'force-cache' });
  } catch (error) {
    console.error('Error fetching price units:', error);
    return [];
  }
}

export async function fetchQualityTypes(): Promise<QualityType[]> {
  try {
    // You might need to create this endpoint or get it from another API

    console.log("SERVICE QUALITY TYPES",    await api.get<QualityType[]>('/service-quality-types/', { cache: 'force-cache' }));
    return await api.get<QualityType[]>('/service-quality-types/', { cache: 'force-cache' });
  } catch (error) {
    console.error('Error fetching quality types:', error);
    return [];
  }
}