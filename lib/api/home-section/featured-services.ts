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
 */
export async function fetchFeaturedServices({
  limit = 8,
  minCount,
  maxPerPage = 30
}: FetchFeaturedServicesOptions = {}): Promise<{
  services: ProfessionalService[];
  total: number;
}> {
  const featuredServices: ProfessionalService[] = [];
  const uniqueIds = new Set<number>();
  
  let currentPage = 1;
  let hasMore = true;
  let totalAvailable = 0;
  
  const targetCount = minCount || limit;
  


  try {
    // Keep fetching until we have enough services or no more pages
    while (featuredServices.length < targetCount && hasMore) {
    
      
      const data = await fetchProfessionalServices({
  page: currentPage,
  per_page: maxPerPage,
});
      
      const services = data.professional_services || [];
      
      if (services.length === 0) {

        hasMore = false;
        break;
      }

      // Update total available from response
      if (data.total) {
        totalAvailable = data.total;
      }

      // Filter services with at least one price
      const pricedServices = services.filter((ps) => 
        ps.prices && ps.prices.length > 0
      );

      // Add ONLY UNIQUE services to our collection
      for (const service of pricedServices) {
        if (!uniqueIds.has(service.id)) {
          uniqueIds.add(service.id);
          featuredServices.push(service);
          
          // Stop if we've reached target count
          if (featuredServices.length >= targetCount) {
            break;
          }
        } else {
   
        }
      }
      

      // Check if there are more pages
      hasMore = data.total_pages > currentPage;
      currentPage++;
      
      // Safety check to prevent infinite loops
      if (currentPage > 20) {
 
        hasMore = false;
      }
    }


    return {
      services: featuredServices.slice(0, limit),
      total: totalAvailable
    };
    
  } catch (error) {

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