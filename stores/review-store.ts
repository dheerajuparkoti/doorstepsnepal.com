// stores/reviews-store.ts
import { create } from 'zustand';
import { 
  ProfessionalServiceReview, 
  ProfessionalServiceReviewResponse,
  ReviewViewMode 
} from '@/lib/data/reviews';
import { fetchReviews } from '@/lib/api/reviews';

interface ReviewsStore {
  // Cache reviews by professional ID
  reviewsByProfessional: Record<number, {
    reviews: ProfessionalServiceReview[];
    groupedReviews: Record<string, ProfessionalServiceReview[]>;
    viewMode: ReviewViewMode;
    isLoading: boolean;
    error: string | null;
    total: number;
    page: number;
    totalPages: number;
    lastFetched: number;
  }>;

  // Actions
  fetchReviews: (
    professionalId: number, 
    params?: { page?: number; per_page?: number },
    force?: boolean
  ) => Promise<ProfessionalServiceReview[]>;
  
  toggleViewMode: (professionalId: number) => void;
  getReviews: (professionalId: number) => ProfessionalServiceReview[];
  getGroupedReviews: (professionalId: number) => Record<string, ProfessionalServiceReview[]>;
  getViewMode: (professionalId: number) => ReviewViewMode;
  clearCache: () => void;
  clearProfessional: (professionalId: number) => void;
}

const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes (reviews change more frequently)

export const useReviewsStore = create<ReviewsStore>((set, get) => ({
  reviewsByProfessional: {},

  fetchReviews: async (professionalId: number, params = { page: 1, per_page: 10000 }, force = false) => {
    const state = get();
    const existing = state.reviewsByProfessional[professionalId];
    const now = Date.now();

    // Return cached reviews if not expired and not forced
    if (!force && 
        existing && 
        existing.lastFetched && 
        now - existing.lastFetched < CACHE_DURATION) {
      return existing.reviews;
    }

    // Initialize or update loading state
    set({
      reviewsByProfessional: {
        ...state.reviewsByProfessional,
        [professionalId]: {
          reviews: existing?.reviews || [],
          groupedReviews: existing?.groupedReviews || {},
          viewMode: existing?.viewMode || ReviewViewMode.CHRONOLOGICAL,
          isLoading: true,
          error: null,
          total: existing?.total || 0,
          page: params.page || 1,
          totalPages: existing?.totalPages || 0,
          lastFetched: existing?.lastFetched || 0,
        },
      },
    });

    try {
      const response = await fetchReviews({
        professional_id: professionalId,
        page: params.page,
        per_page: params.per_page,
      });

      // Group reviews by service name
      const groupedReviews: Record<string, ProfessionalServiceReview[]> = {};
      response.reviews.forEach((review) => {
        const serviceName = review.professional_service?.service?.name_en || 'Unknown Service';
        if (!groupedReviews[serviceName]) {
          groupedReviews[serviceName] = [];
        }
        groupedReviews[serviceName].push(review);
      });

      set({
        reviewsByProfessional: {
          ...state.reviewsByProfessional,
          [professionalId]: {
            reviews: response.reviews,
            groupedReviews,
            viewMode: existing?.viewMode || ReviewViewMode.CHRONOLOGICAL,
            isLoading: false,
            error: null,
            total: response.total,
            page: response.page,
            totalPages: response.total_pages,
            lastFetched: Date.now(),
          },
        },
      });

      return response.reviews;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to fetch reviews';
      set({
        reviewsByProfessional: {
          ...state.reviewsByProfessional,
          [professionalId]: {
            ...state.reviewsByProfessional[professionalId],
            isLoading: false,
            error: errorMessage,
            lastFetched: Date.now(),
          },
        },
      });
      return [];
    }
  },

  toggleViewMode: (professionalId: number) => {
    const state = get();
    const existing = state.reviewsByProfessional[professionalId];
    
    if (existing) {
      set({
        reviewsByProfessional: {
          ...state.reviewsByProfessional,
          [professionalId]: {
            ...existing,
            viewMode: existing.viewMode === ReviewViewMode.CHRONOLOGICAL 
              ? ReviewViewMode.GROUPED_BY_SERVICE 
              : ReviewViewMode.CHRONOLOGICAL,
          },
        },
      });
    }
  },

  getReviews: (professionalId: number) => {
    return get().reviewsByProfessional[professionalId]?.reviews || [];
  },

  getGroupedReviews: (professionalId: number) => {
    return get().reviewsByProfessional[professionalId]?.groupedReviews || {};
  },

  getViewMode: (professionalId: number) => {
    return get().reviewsByProfessional[professionalId]?.viewMode || ReviewViewMode.CHRONOLOGICAL;
  },

  clearCache: () => {
    set({ reviewsByProfessional: {} });
  },

  clearProfessional: (professionalId: number) => {
    const state = get();
    const { [professionalId]: _, ...rest } = state.reviewsByProfessional;
    set({ reviewsByProfessional: rest });
  },
}));