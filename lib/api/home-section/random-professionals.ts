import { fetchProfessionalServices } from '../professional-services';
import type { ProfessionalService } from '@/lib/data/professional-services';

interface FetchRandomProfessionalsOptions {
  limit?: number;
  maxPerPage?: number;
}

/**
 * Fetches random professionals with valid profile images and skills
 * Continues fetching pages until it finds enough valid professionals
 */
export async function fetchRandomProfessionals({
  limit = 8,
  maxPerPage = 50
}: FetchRandomProfessionalsOptions = {}): Promise<{
  professionals: ProfessionalService[];
  total: number;
}> {
  // Store all valid professionals
  const validProfessionals: ProfessionalService[] = [];
  const uniqueProfessionalIds = new Set<number>();
  
  let currentPage = 1;
  let hasMore = true;
  let totalAvailable = 0;
  


  try {
    // First, collect ALL valid professionals from all pages
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

      // Update total available
      if (data.total) {
        totalAvailable = data.total;
      }

      // Filter and collect valid professionals
      for (const service of services) {
        // Skip if no professional data
        if (!service.professional || !service.professional.user) continue;
        
        const professionalId = service.professional.id;
        const user = service.professional.user;
        const skill = service.professional.skill;
        
        // STRICTER VALIDATION for profile image
        const hasValidImage = user.profile_image && 
                             user.profile_image.trim() !== '' && 
                             !user.profile_image.includes('null') && 
                             !user.profile_image.includes('undefined') &&
                             user.profile_image.startsWith('http'); // Ensure it's a valid URL
        
        // STRICTER VALIDATION for skill
        const hasValidSkill = skill && 
                             skill.trim() !== '' && 
                             skill !== 'N/A' && 
                             skill !== 'null' &&
                             skill !== 'undefined' &&
                             skill.length > 2;
        
        // Only add if both conditions are met and not already added
        if (hasValidImage && hasValidSkill && !uniqueProfessionalIds.has(professionalId)) {
          uniqueProfessionalIds.add(professionalId);
          validProfessionals.push(service);
       
        } 
      
      }

      // Check if there are more pages
      hasMore = data.total_pages > currentPage;
      currentPage++;


      // Safety check
      if (currentPage > 20) {
    
        hasMore = false;
      }
    }

    // Shuffle the array to get random professionals
    const shuffled = shuffleArray(validProfessionals);
    
    // Take first 'limit' professionals
    const randomProfessionals = shuffled.slice(0, limit);

    randomProfessionals.forEach((p, i) => {
  
    });

    return {
      professionals: randomProfessionals,
      total: totalAvailable
    };
    
  } catch (error) {

    return {
      professionals: [],
      total: 0
    };
  }
}

/**
 * Fisher-Yates shuffle algorithm for true randomness
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Simplified version with defaults
 */
export async function getRandomProfessionals(limit: number = 8): Promise<{
  professionals: ProfessionalService[];
  total: number;
}> {
  return fetchRandomProfessionals({ limit, maxPerPage: 50 });
}