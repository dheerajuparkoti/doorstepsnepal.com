// lib/api/reviews.ts
import { api } from '@/config/api-client';
import { 
  ProfessionalServiceReviewResponse, 
  FetchReviewsParams,
  CreateReviewPayload,
  CreateReviewResponse
} from '@/lib/data/reviews';

// GET methods (existing)
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

// POST method - Create a new review
export async function createReview(
  professionalServiceId: number,
  data: Omit<CreateReviewPayload, 'professional_service_id'>,
  customerId: number
): Promise<CreateReviewResponse> {
  try {
    const response = await api.post<CreateReviewResponse>(
      `/professional_services/${professionalServiceId}/reviews`,
      {
        rating: data.rating,
        review: data.review,
        professional_service_id: professionalServiceId
      },
      {
        params: {
          customer_id: customerId
        }
      }
    );
    
    return response;
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
}

// Alternative method if you want to pass all params together
export async function submitReview(
  professionalServiceId: number,
  rating: number,
  review: string,
  customerId: number
): Promise<CreateReviewResponse> {
  return createReview(
    professionalServiceId,
    { rating, review },
    customerId
  );
}