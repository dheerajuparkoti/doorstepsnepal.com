// export interface ProfessionalServiceResponse {
//   professional_services: ProfessionalService[];
//   total: number;
//   page: number;
//   per_page: number;
//   total_pages: number;
// }

// export interface ProfessionalService {
//   id: number;
//   professional_id: number;
//   service_id: number;
//   professional: {
//     id: number;
//     user_id: number;
//     skill: string;
//     user: {
//       id: number;
//       full_name: string;
//       phone_number: string;
//       profile_image: string | null;
//       gender: string;
//       age_group: string;
//       is_admin_approved: boolean;
//     };
//   };
//   service: {
//     id: number;
//     name_en: string;
//     name_np: string;
//     description_en: string;
//     description_np: string;
//     image: string | null;
//     category_id: number;
//     sub_category_id: number;
//   };
//   prices: {
//     id: number;
//     price: number;
//     discount_percentage: number;
//     is_minimum_price: boolean;
//     price_unit: {
//       id: number;
//       name: string;
//     };
//     quality_type: {
//       id: number;
//       name: string;
//     };
//   }[];





// }


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
      deletion_requested?: boolean;
      is_deleted?: boolean;
      deletion_requested_at?: string;
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
  price_unit: {
    id: number;
    name: string;
  };
  quality_type: {
    id: number;
    name: string;
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
}

export interface UpdatePriceRequest {
  price_unit_id?: number;
  quality_type_id?: number;
  price?: number;
  discount_percentage?: number;
  discount_name?: string;
  discount_is_active?: boolean;
  is_minimum_price?: boolean;
}

export interface CreateProfessionalServiceRequest {
  professional_id: number;
  service_id: number;
}