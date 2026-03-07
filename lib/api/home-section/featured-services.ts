

/**
 * Fetches professional services that have at least one price
 * Continues fetching pages until it reaches the desired limit or runs out of pages
 */
import { fetchProfessionalServices } from '../professional-services';
import type { ProfessionalService } from '@/lib/data/professional-services';

interface FetchFeaturedServicesOptions {
  limit?: number;
  minCount?: number;
  maxPerPage?: number;
}

/**
 * Fetches professional services that have at least one price
 * Continues fetching pages until it reaches the desired limit or runs out of pages
 * Returns random services
 */
export async function fetchFeaturedServices({
  limit = 8,
  minCount,
  maxPerPage = 30
}: FetchFeaturedServicesOptions = {}): Promise<{
  services: ProfessionalService[];
  total: number;
}> {
  const allPricedServices: ProfessionalService[] = [];
  const uniqueIds = new Set<number>();
  
  let currentPage = 1;
  let hasMore = true;
  let totalAvailable = 0;
  
  const targetCount = minCount || limit;

  try {
    while (hasMore) {
      const data = await fetchProfessionalServices({
        page: currentPage,
        per_page: maxPerPage,
      });
      
      const services = data.professional_services || [];
      
      if (services.length === 0) {
        hasMore = false;
        break;
      }

      if (data.total) {
        totalAvailable = data.total;
      }

      const pricedServices = services.filter((ps) => 
        ps.prices && ps.prices.length > 0
      );

      for (const service of pricedServices) {
        if (!uniqueIds.has(service.id)) {
          uniqueIds.add(service.id);
          allPricedServices.push(service);
        }
      }

      hasMore = data.total_pages > currentPage;
      currentPage++;
      
      if (currentPage > 20) {
        hasMore = false;
      }
    }

    const shuffled = [...allPricedServices].sort(() => Math.random() - 0.5);

    const randomServices = shuffled.slice(0, limit);

    return {
      services: randomServices,
      total: totalAvailable
    };
    
  } catch (error) {
    console.error("Error fetching featured services:", error);
    return {
      services: [],
      total: 0
    };
  }
}

/**
 * Simplified version with defaults
 */
export async function getFeaturedServices(limit: number = 8): Promise<{
  services: ProfessionalService[];
  total: number;
}> {
  return fetchFeaturedServices({ limit, maxPerPage: 30 });
}

