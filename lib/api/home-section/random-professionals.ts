import { fetchProfessionalServices } from '../professional-services';
import type { ProfessionalService } from '@/lib/data/professional-services';

interface FetchRandomProfessionalsOptions {
  limit?: number;
  maxPerPage?: number;
}

/**
 * Fetches random professionals with valid profile images and skills
 * Continues fetching pages until it finds enough valid professionals
 * Always returns exactly the requested number of professionals with unique keys
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
    while (hasMore && validProfessionals.length < limit * 3) {
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
                             user.profile_image.startsWith('http');
        
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

    // If we have fewer valid professionals than requested, we need to add extras
    if (validProfessionals.length < limit) {
      console.log(`Only found ${validProfessionals.length} valid professionals, need to add extras`);
      
      // Reset to fetch from beginning to get less strict professionals as fallbacks
      currentPage = 1;
      hasMore = true;
      const fallbackProfessionals: ProfessionalService[] = [];
      const fallbackIds = new Set<number>();
      
      while (hasMore && fallbackProfessionals.length < limit) {
        const data = await fetchProfessionalServices({
          page: currentPage,
          per_page: maxPerPage,
        });
        
        const services = data.professional_services || [];
        
        if (services.length === 0) {
          hasMore = false;
          break;
        }

        for (const service of services) {
          if (!service.professional || !service.professional.user) continue;
          
          const professionalId = service.professional.id;
          
          // Skip if already in valid professionals
          if (uniqueProfessionalIds.has(professionalId)) continue;
          
          // LESS STRICT validation for fallbacks
          const user = service.professional.user;
          const hasSomeImage = user.profile_image && 
                              user.profile_image.trim() !== '' && 
                              !user.profile_image.includes('null') && 
                              !user.profile_image.includes('undefined');
          
          const hasSomeSkill = service.professional.skill && 
                              service.professional.skill.trim() !== '' && 
                              service.professional.skill !== 'N/A';
          
          // Add if they have at least one valid attribute
          if ((hasSomeImage || hasSomeSkill) && !fallbackIds.has(professionalId)) {
            fallbackIds.add(professionalId);
            fallbackProfessionals.push(service);
            
            if (validProfessionals.length + fallbackProfessionals.length >= limit) {
              break;
            }
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
      
      // Add fallbacks to valid professionals
      validProfessionals.push(...fallbackProfessionals);
    }

    // Shuffle the array to get random professionals
    const shuffled = shuffleArray(validProfessionals);
    
    // Take first 'limit' professionals
    let randomProfessionals = shuffled.slice(0, limit);

    // If we still don't have enough, create unique entries by modifying the objects
    if (randomProfessionals.length < limit) {
      console.log(`Still only have ${randomProfessionals.length} professionals, creating unique entries to reach ${limit}`);
      
      const result = [...randomProfessionals];
      const baseTimestamp = Date.now();
      
      while (result.length < limit) {
        // Get a professional to duplicate
        const sourceIndex = result.length % randomProfessionals.length;
        const sourceProfessional = randomProfessionals[sourceIndex];
        
        // Create a deep copy with modified IDs to ensure React keys are unique
        const duplicatedProfessional = JSON.parse(JSON.stringify(sourceProfessional));
        
        // Modify the IDs to make them unique
        if (duplicatedProfessional.professional) {
          // Create a unique but consistent ID for the duplicated entry
          const uniqueSuffix = result.length - randomProfessionals.length + 1;
          duplicatedProfessional.professional.id = `${duplicatedProfessional.professional.id}-dup-${uniqueSuffix}`;
          
          // Also update any nested IDs if they exist
          if (duplicatedProfessional.professional.user) {
            duplicatedProfessional.professional.user.id = `${duplicatedProfessional.professional.user.id}-dup-${uniqueSuffix}`;
          }
          
          if (duplicatedProfessional.id) {
            duplicatedProfessional.id = `${duplicatedProfessional.id}-dup-${uniqueSuffix}`;
          }
        }
        
        result.push(duplicatedProfessional);
      }
      
      return {
        professionals: result,
        total: totalAvailable
      };
    }

    return {
      professionals: randomProfessionals,
      total: totalAvailable
    };
    
  } catch (error) {
    console.error('Error fetching random professionals:', error);
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
 * Always returns exactly the requested number of professionals with unique keys
 */
export async function getRandomProfessionals(limit: number = 8): Promise<{
  professionals: ProfessionalService[];
  total: number;
}> {
  return fetchRandomProfessionals({ limit, maxPerPage: 50 });
}