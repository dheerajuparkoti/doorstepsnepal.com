export interface ProfessionalServiceResponse {
  professional_services: ProfessionalService[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface ProfessionalService {
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
    };
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
  prices: {
    id: number;
    price: number;
    discount_percentage: number;
    is_minimum_price: boolean;
    price_unit: {
      id: number;
      name: string;
    };
    quality_type: {
      id: number;
      name: string;
    };
  }[];
}
