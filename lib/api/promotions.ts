import { api } from '@/config/api-client';
import { Promotion, PromotionResponse } from '@/lib/data/promotions';

interface FetchPromotionsParams {
  page?: number;
  size?: number;
  search?: string;
  active_only?: boolean;
}

export async function fetchPromotions(
  params: FetchPromotionsParams = {}
): Promise<PromotionResponse> {
  try {
    const {
      page = 1,
      size = 100,
      search,
      active_only = true,
    } = params;

    return await api.get<PromotionResponse>('/promotions', {
      params: {
        page,
        size,
        active_only,
        ...(search && { search }),
      },
      cache: 'force-cache',
      next: { revalidate: 1800 }, // Revalidate every 30 minutes
    });
  } catch (error) {
    console.error('Error fetching promotions:', error);
    return {
      promotions: [],
      total: 0,
      page: 1,
      size: 100,
      pages: 0,
    };
  }
}

// Optional: Fetch single promotion by ID if needed
export async function fetchPromotionById(id: number): Promise<Promotion | null> {
  try {
    
    const response = await fetchPromotions({ page: 1, size: 1 });
    const promotion = response.promotions.find(p => p.id === id);
    return promotion || null;
  } catch (error) {
    console.error('Error fetching promotion by ID:', error);
    return null;
  }
}