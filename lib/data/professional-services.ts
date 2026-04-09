import { Service } from "./service";
export interface ProfessionalServiceResponse {
  professional_services: ProfessionalService[];
  total: number;
  page: number;
  total_unique_professionals: number;  
  total_unique_services?: number;  
  per_page: number;
  total_pages: number;
}

export interface ProfessionalService {
  name_en: string;
  id: number;
  professional_id: number;
  service_id: number;
  professional: {
    id: number;
    user_id: number;
    skill: string;
    user: {
      id: number;
      full_name: string;
      phone_number: string;
      profile_image: string | null;
      gender: string;
      age_group: string;
      is_admin_approved: boolean;
      deletion_requested?: boolean;
      is_deleted?: boolean;
      deletion_requested_at?: string;
    };
     service_areas: ServiceArea[];

     
  };
  service: {
    id: number;
    name_en: string;
    name_np: string;
    description_en: string;
    description_np: string;
    image: string | null;
    category_id: number;
    sub_category_id: number;
  };
  prices: ProfessionalServicePrice[];
}

export interface ProfessionalServicePrice {
  id: number;
  professional_service_id: number;
  price_unit_id: number;
  quality_type_id: number;
  price: number;
  discount_percentage: number;
  discount_name: string;
  discount_is_active: boolean;
  is_minimum_price: boolean;
  has_warranty: boolean;
  warranty_duration: number | null;
  warranty_unit: string | null;
  price_unit: {
    id: number;
    name: string;
  };
  quality_type: {
    id: number;
    name: string;
    name_np?: string | null;
    name_en?: string | null;
  };
}

export interface PriceUnit {
  id: number;
  name: string;
}

export interface QualityType {
  id: number;
  name: string;
}

export interface BrowseableService {
  id: number;
  name_en: string;
  name_np: string;
  description_en: string;
  description_np: string;
  image: string | null;
  category_id: number;
  sub_category_id: number;
}

export interface CreatePriceRequest {
  professional_service_id: number;
  price_unit_id: number;
  quality_type_id: number;
  price: number;
  discount_percentage: number;
  discount_name: string;
  discount_is_active: boolean;
  is_minimum_price: boolean;
  has_warranty?: boolean;
  warranty_duration?: number | null;
  warranty_unit?: string | null;
}

export interface UpdatePriceRequest {
  price_unit_id?: number;
  quality_type_id?: number;
  price?: number;
  discount_percentage?: number;
  discount_name?: string;
  discount_is_active?: boolean;
  is_minimum_price?: boolean;
  has_warranty?: boolean;
  warranty_duration?: number | null;
  warranty_unit?: string | null;
}

export interface CreateProfessionalServiceRequest {
  professional_id: number;
  service_id: number;
}

export interface ServiceArea {
  id: number;
  name: string;  // Format: "Bhaktapur-Suryabinayak_Mun.-29"
}




export interface GroupedService {
  service: Service;
  professionals: ProfessionalBasic[];
  prices: ProfessionalServicePrice[];
  professionalCount: number;
  uniqueProfessionalIds: Set<number>;
}

export interface ProfessionalBasic {
  id: number;
  user_id: number;
  full_name: string;
  profile_image: string | null;
  skill: string;
}

// Helper function to group professional services by service
export function groupProfessionalServices(professionalServices: ProfessionalService[]): Map<number, GroupedService> {
  const groupedMap = new Map<number, GroupedService>();
  
  for (const ps of professionalServices) {
    if (!ps.service || !ps.professional) continue;
    
    const serviceId = ps.service.id;
    
    if (!groupedMap.has(serviceId)) {
      groupedMap.set(serviceId, {
        service: ps.service,
        professionals: [],
        prices: [],
        professionalCount: 0,
        uniqueProfessionalIds: new Set<number>()
      });
    }
    
    const group = groupedMap.get(serviceId)!;
    
    // Add professional if unique
    const professionalId = ps.professional.id;
    if (!group.uniqueProfessionalIds.has(professionalId)) {
      group.uniqueProfessionalIds.add(professionalId);
      group.professionals.push({
        id: professionalId,
        user_id: ps.professional.user_id,
        full_name: ps.professional.user.full_name,
        profile_image: ps.professional.user.profile_image,
        skill: ps.professional.skill
      });
    }
    
    // Add prices
    if (ps.prices) {
      group.prices.push(...ps.prices);
    }
  }
  
  // Update professional count
  groupedMap.forEach((group) => {
    group.professionalCount = group.uniqueProfessionalIds.size;
  });
  
  return groupedMap;
}