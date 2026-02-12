// lib/api/reviews.ts
import { api } from '@/config/api-client';
import { 
  ProfessionalServiceReviewResponse, 
  FetchReviewsParams 
} from '@/lib/data/reviews';

export async function fetchReviews(
  params: FetchReviewsParams
): Promise<ProfessionalServiceReviewResponse> {
  try {
    const response = await api.get<ProfessionalServiceReviewResponse>(
      '/professional_services/reviews',
      {
        params: {
          ...params,
          page: params.page || 1,
          per_page: params.per_page || 10000,
        },
        cache: 'no-store', // Don't cache API response, let store handle caching
      }
    );
    
    return response;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return {
      reviews: [],
      total: 0,
      page: params.page || 1,
      per_page: params.per_page || 10000,
      total_pages: 0,
    };
  }
}

export async function fetchReviewsByProfessional(
  professionalId: number,
  page: number = 1,
  per_page: number = 10000
): Promise<ProfessionalServiceReviewResponse> {
  return fetchReviews({
    professional_id: professionalId,
    page,
    per_page,
  });
}

export async function fetchReviewsByProfessionalService(
  professionalServiceId: number,
  page: number = 1,
  per_page: number = 10000
): Promise<ProfessionalServiceReviewResponse> {
  return fetchReviews({
    professional_service_id: professionalServiceId,
    page,
    per_page,
  });
}

export async function fetchReviewsByService(
  serviceId: number,
  page: number = 1,
  per_page: number = 10000
): Promise<ProfessionalServiceReviewResponse> {
  return fetchReviews({
    service_id: serviceId,
    page,
    per_page,
  });
}