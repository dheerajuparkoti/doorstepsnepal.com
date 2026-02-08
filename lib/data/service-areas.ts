export interface ServiceArea {
  id: number;
  name: string;
}

export interface ProfessionalProfile {
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
  service_areas: ServiceArea[];
}

export interface ProfessionalDisplayData {
  id: number;
  user_id: number;
  professional_id: number;
  service_id: number;
  service_name: string;
  service_description: string;
  full_name: string;
  profile_image_url: string;
  service_areas_display: string;
  all_prices: ProfessionalServicePrice[];
  is_minimum_price: boolean;
  tag?: string;
  image: string;
  all_skills: string;
  initial_skill_preview: string;
  category_id: number;
  sub_category_id: number;
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
}

export interface ProfessionalServicePrice {
  id: number;
  price: number;
  discount_percentage: number;
  is_minimum_price: boolean;
  discount_is_active: boolean;
  discount_name?: string;
  price_unit: {
    id: number;
    name: string;
  };
  quality_type: {
    id: number;
    name: string;
  };
  price_unit_id: number;
  quality_type_id: number;
}

export enum ProfessionalFilterType {
  SERVICE_NAME = 'service_name',
  ADDRESS = 'address',
  SKILLS = 'skills',
  SERVICE_TAG = 'service_tag',
}