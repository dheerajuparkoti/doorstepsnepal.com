import { fetchProfessionalServices } from '../professional-services';
import type { ProfessionalService, ProfessionalServicePrice } from '@/lib/data/professional-services';

interface FetchOfferServicesOptions {
  limit?: number;
  minCount?: number;
  maxPerPage?: number;
  minDiscountPercentage?: number;
}

/**
 * Fetches professional services that have active discounts
 * Continues fetching pages until it reaches the desired limit or runs out of pages
 */
export async function fetchOfferServices({
  limit = 12,
  minCount,
  maxPerPage = 50,
  minDiscountPercentage = 0
}: FetchOfferServicesOptions = {}): Promise<ProfessionalService[]> {
  const offerServices: ProfessionalService[] = [];
  // Use a Set to track unique IDs
  const uniqueIds = new Set<number>();
  
  let currentPage = 1;
  let hasMore = true;
  let totalPages = 1;
  
  // Use minCount if provided, otherwise use limit
  const targetCount = minCount || limit;
  


  try {
    // Keep fetching until we have enough offers or no more pages
    while (offerServices.length < targetCount && hasMore) {
     const data = await fetchProfessionalServices({
  page: currentPage,
  per_page: maxPerPage,
});
      const services = data.professional_services || [];
      if (services.length === 0) {
        hasMore = false;
        break;
      }

      // Filter services with active discounts
      const discountedServices = services.filter((ps: { prices: any[]; }) =>
        ps.prices?.some((p) => 
          p.discount_is_active === true && 
          p.discount_percentage > minDiscountPercentage
        )
      );

      // Add ONLY UNIQUE services 
      for (const service of discountedServices) {
        if (!uniqueIds.has(service.id)) {
          uniqueIds.add(service.id);
          offerServices.push(service);
          
          // Stop if we've reached target count
          if (offerServices.length >= targetCount) {
            break;
          }
        } 
      }
      

      // Check if there are more pages
      totalPages = data.total_pages || 1;
      hasMore = totalPages > currentPage;
      currentPage++;
      
      // Safety check to prevent infinite loops (max 20 pages)
      if (currentPage > 20) {
     
        hasMore = false;
      }
    }

    // Sort by highest discount percentage
    offerServices.sort((a, b) => {
      const maxDiscountA = Math.max(...a.prices
        .filter(p => p.discount_is_active)
        .map(p => p.discount_percentage));
      const maxDiscountB = Math.max(...b.prices
        .filter(p => p.discount_is_active)
        .map(p => p.discount_percentage));
      return maxDiscountB - maxDiscountA;
    });

    // If we have more than limit, trim to exactly limit
    if (offerServices.length > limit) {
      const trimmed = offerServices.slice(0, limit);
      return trimmed;
    }

    return offerServices;
    
  } catch (error) {

    return [];
  }
}

/**
 * Simplified version - just get me the offers with defaults
 */
export async function getOfferServices(limit: number = 12): Promise<ProfessionalService[]> {
  return fetchOfferServices({ limit, maxPerPage: 50 });
}

/**
 * Check if a professional service has any active discount
 */
export function hasActiveDiscount(service: ProfessionalService): boolean {
  return service.prices?.some(p => 
    p.discount_is_active === true && p.discount_percentage > 0
  ) || false;
}

/**
 * Get the best active discount for a service
 */
export function getBestDiscount(service: ProfessionalService): {
  percentage: number;
  name: string;
  price: ProfessionalServicePrice | null;
} {
  if (!service.prices) return { percentage: 0, name: '', price: null };
  
  const activeDiscounts = service.prices.filter(p => 
    p.discount_is_active === true && p.discount_percentage > 0
  );
  
  if (activeDiscounts.length === 0) {
    return { percentage: 0, name: '', price: null };
  }
  
  const bestPrice = activeDiscounts.reduce((best, current) => 
    current.discount_percentage > best.discount_percentage ? current : best
  );
  
  return {
    percentage: bestPrice.discount_percentage,
    name: bestPrice.discount_name,
    price: bestPrice
  };
}