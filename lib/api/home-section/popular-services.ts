

/**
 * Fetches professional services that have at least one price
 * Continues fetching pages until it reaches the desired limit or runs out of pages
 */
import { fetchProfessionalServices } from '../professional-services';
import type { ProfessionalService } from '@/lib/data/professional-services';

interface FetchPopularServicesOptions {
  limit?: number;
  minCount?: number;
  maxPerPage?: number;
}

/**
 * Fetches professional services that have at least one price
 * Continues fetching pages until it reaches the desired limit or runs out of pages
 * Returns random services
 */



// export async function fetchPopularServices({
//   limit = 8,
//   minCount,
//   maxPerPage = 30
// }: FetchPopularServicesOptions = {}): Promise<{
//   services: ProfessionalService[];
//   total: number;
// }> {
//   const allPricedServices: ProfessionalService[] = [];
//   const uniqueIds = new Set<number>();
  
//   let currentPage = 1;
//   let hasMore = true;
//   let totalAvailable = 0;
  
//   const targetCount = minCount || limit;

//   try {
//     while (hasMore) {
//       const data = await fetchProfessionalServices({
//         page: currentPage,
//         per_page: maxPerPage,
//       });
      
//       const services = data.professional_services || [];
      
//       if (services.length === 0) {
//         hasMore = false;
//         break;
//       }

//       if (data.total) {
//         totalAvailable = data.total;
//       }

//       const pricedServices = services.filter((ps) => 
//         ps.prices && ps.prices.length > 0
//       );

//       for (const service of pricedServices) {
//         if (!uniqueIds.has(service.id)) {
//           uniqueIds.add(service.id);
//           allPricedServices.push(service);
//         }
//       }

//       hasMore = data.total_pages > currentPage;
//       currentPage++;
      
//       if (currentPage > 20) {
//         hasMore = false;
//       }
//     }

//     const shuffled = [...allPricedServices].sort(() => Math.random() - 0.5);

//     const randomServices = shuffled.slice(0, limit);

//     return {
//       services: randomServices,
//       total: totalAvailable
//     };
    
//   } catch (error) {

//     return {
//       services: [],
//       total: 0
//     };
//   }
// }


/**
 * Fetches professional services that have at least one price
 * Continues fetching pages until it reaches the desired limit or runs out of pages
 * Returns random services sorted by price (ascending)
 */
export async function fetchPopularServices({
  limit = 8,
  minCount,
  maxPerPage = 30
}: FetchPopularServicesOptions = {}): Promise<{
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

    // First, shuffle and select random services 
    const shuffled = [...allPricedServices].sort(() => Math.random() - 0.5);
    const randomServices = shuffled.slice(0, limit);

    // Then, sort only the selected items by price in ascending order
    const sortedRandomServices = [...randomServices].sort((a, b) => {
      // Get the lowest/first price from each service's prices array
      const priceA = a.prices && a.prices.length > 0 
        ? Math.min(...a.prices.map(p => p.price)) 
        : Infinity;
      
      const priceB = b.prices && b.prices.length > 0 
        ? Math.min(...b.prices.map(p => p.price)) 
        : Infinity;
      
      return priceA - priceB;
    });

    return {
      services: sortedRandomServices,
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
export async function getPopularServices(limit: number = 8): Promise<{
  services: ProfessionalService[];
  total: number;
}> {
  return fetchPopularServices({ limit, maxPerPage: 30 });
}

