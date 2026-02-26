
import { fetchProfessionalServices } from '@/lib/api/professional-services';
import { ProfessionalsClientWrapper } from '../professionals-client-wrapper';

interface ProfessionalsSectionProps {
  professionalId?: number;
  page?: number;
  search?: string;
  categoryId?: number;
  serviceId?: number;
  minPrice?: number;
  maxPrice?: number;
}

// Service tag mapping 
const serviceTagMap: Record<number, string> = {
  1: "Best Deal",
  2: "Bumper Offer",
  3: "Dashain Offer",
  4: "Featured",
};

function getTagForService(serviceId?: number): string | undefined {
  return serviceId ? serviceTagMap[serviceId] : undefined;
}

export async function ProfessionalsSection({
  professionalId,
  page = 1,
  search,
  categoryId,
  serviceId,
  minPrice,
  maxPrice,
}: ProfessionalsSectionProps) {
  const perPage = 50;
  
  // Fetch data with all filters
  const professionalServicesData = await fetchProfessionalServices({
    page,
    per_page: perPage,
    professional_id: professionalId,
    service_id: serviceId,
    category_id: categoryId,
    search,
    min_price: minPrice,
    max_price: maxPrice,
  });
  
  // Group services by professional 
  const professionalsMap = new Map<number, any>();
  
  for (const ps of professionalServicesData.professional_services) {
    if (!ps.professional) continue;
    
    const profId = ps.professional_id;
    
    if (!professionalsMap.has(profId)) {
      // Get service areas from professional object
      const serviceAreas = ps.professional.service_areas || [];
      
      // Create display string 
      const serviceAreasDisplay = serviceAreas
        .map((area) => {
          const parts = area.name.split('-');
          return parts.length > 0 ? parts[0] : area.name;
        })
        .filter((value, index, self) => self.indexOf(value) === index) 
        .slice(0, 3) // Show first 3
        .join(', ') + (serviceAreas.length > 3 ? '...' : '');
      
      // Create full list for "View all" dialog
      const allServiceAreasList = serviceAreas
        .map((area) => area.name.replaceAll('-', ' - '))
        .filter((value, index, self) => self.indexOf(value) === index); 
      
      // Parse skills into list
      const skillsString = ps.professional.skill || 'N/A';
      const allSkillsList = skillsString === 'N/A' 
        ? ['N/A'] 
        : skillsString.split(RegExp('[/,]')).map((s: string) => s.trim());
      
      // Get unique skills
      const uniqueSkillsList = [...new Set(allSkillsList)];
      const allSkills = uniqueSkillsList.join(', ');
      
      professionalsMap.set(profId, {
        id: profId,
        user_id: ps.professional.user_id,
        professional_id: profId,
        full_name: ps.professional.user.full_name,
        profile_image_url: ps.professional.user.profile_image || '',
        all_skills: allSkills,
        all_skills_list: uniqueSkillsList,
        service_areas_full: serviceAreas,
        service_areas_display: serviceAreasDisplay,
        all_service_areas_list: allServiceAreasList,
        services: [],
        all_prices: [],
        service_names: [],
        service_ids: [],
        tag: getTagForService(ps.service?.id),
      });
    }
    
    const professional = professionalsMap.get(profId)!;
    
    // Add service (avoid duplicates)
    const serviceExists = professional.services.some((s: any) => s.id === ps.id);
    if (!serviceExists) {
      professional.services.push(ps);
    }
    
    // Add service ID (avoid duplicates)
    if (ps.service?.id && !professional.service_ids.includes(ps.service.id)) {
      professional.service_ids.push(ps.service.id);
    }
    
    // Add service name (avoid duplicates)
    if (ps.service?.name_en && !professional.service_names.includes(ps.service.name_en)) {
      professional.service_names.push(ps.service.name_en);
    }
    
    // Add prices (avoid duplicates)
    if (ps.prices) {
      for (const price of ps.prices) {
        const priceExists = professional.all_prices.some((p: any) => p.id === price.id);
        if (!priceExists) {
          professional.all_prices.push(price);
        }
      }
    }
  }
  
  // Convert map to array
  const professionalsData = Array.from(professionalsMap.values()).map(prof => ({
    ...prof,
    service_name: prof.service_names.join(', '),
    is_minimum_price: prof.all_prices.some((p: any) => p.is_minimum_price),
    has_discount: prof.all_prices.some((p: any) => p.discount_is_active && p.discount_percentage > 0),
  }));
  
  return (
    <ProfessionalsClientWrapper 
      professionalsData={professionalsData}
      totalPages={professionalServicesData.total_pages}
      currentPage={professionalServicesData.page}
      totalResults={professionalServicesData.total}
      isSingleProfessionalView={!!professionalId}
      professionalName={professionalId ? professionalsData[0]?.full_name : undefined}
      specificProfessionalId={professionalId}
    />
  );
}