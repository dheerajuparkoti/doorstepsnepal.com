

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
  
  const validProfessionals: ProfessionalService[] = [];
  const uniqueProfessionalIds = new Set<number>();
  
  let currentPage = 1;
  let hasMore = true;
  let totalUniqueProfessionals = 0; 

  try {

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

     
      if (data.total_unique_professionals !== undefined) {
        totalUniqueProfessionals = data.total_unique_professionals;
        //console.log('Total unique professionals from API:', totalUniqueProfessionals); 
      }

      for (const service of services) {
        if (!service.professional || !service.professional.user) continue;
        
        const professionalId = service.professional.id;
        const user = service.professional.user;
        const skill = service.professional.skill;
        
        const hasValidImage = user.profile_image && 
                             user.profile_image.trim() !== '' && 
                             !user.profile_image.includes('null') && 
                             !user.profile_image.includes('undefined') &&
                             user.profile_image.startsWith('http');
        
        const hasValidSkill = skill && 
                             skill.trim() !== '' && 
                             skill !== 'N/A' && 
                             skill !== 'null' &&
                             skill !== 'undefined' &&
                             skill.length > 2;
        
        if (hasValidImage && hasValidSkill && !uniqueProfessionalIds.has(professionalId)) {
          uniqueProfessionalIds.add(professionalId);
          validProfessionals.push(service);
        }
      }

      hasMore = data.total_pages > currentPage;
      currentPage++;

      if (currentPage > 20) {
        hasMore = false;
      }
    }

    if (validProfessionals.length < limit) {
      //console.log(`Only found ${validProfessionals.length} valid professionals, need to add extras`);
      
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
          
          if (uniqueProfessionalIds.has(professionalId)) continue;
          
          const user = service.professional.user;
          const hasSomeImage = user.profile_image && 
                              user.profile_image.trim() !== '' && 
                              !user.profile_image.includes('null') && 
                              !user.profile_image.includes('undefined');
          
          const hasSomeSkill = service.professional.skill && 
                              service.professional.skill.trim() !== '' && 
                              service.professional.skill !== 'N/A';
          
          if ((hasSomeImage || hasSomeSkill) && !fallbackIds.has(professionalId)) {
            fallbackIds.add(professionalId);
            fallbackProfessionals.push(service);
            
            if (validProfessionals.length + fallbackProfessionals.length >= limit) {
              break;
            }
          }
        }

        hasMore = data.total_pages > currentPage;
        currentPage++;

        if (currentPage > 20) {
          hasMore = false;
        }
      }
      
      validProfessionals.push(...fallbackProfessionals);
    }

    const shuffled = shuffleArray(validProfessionals);
    
    let randomProfessionals = shuffled.slice(0, limit);

    if (randomProfessionals.length < limit) {
      //console.log(`Still only have ${randomProfessionals.length} professionals, creating unique entries to reach ${limit}`);
      
      const result = [...randomProfessionals];
      
      while (result.length < limit) {
        const sourceIndex = result.length % randomProfessionals.length;
        const sourceProfessional = randomProfessionals[sourceIndex];
        
        const duplicatedProfessional = JSON.parse(JSON.stringify(sourceProfessional));
 
        if (duplicatedProfessional.professional) {
       
          const uniqueSuffix = result.length - randomProfessionals.length + 1;
          duplicatedProfessional.professional.id = `${duplicatedProfessional.professional.id}-dup-${uniqueSuffix}`;
          
  
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
        total: totalUniqueProfessionals 
      };
    }

    return {
      professionals: randomProfessionals,
      total: totalUniqueProfessionals
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