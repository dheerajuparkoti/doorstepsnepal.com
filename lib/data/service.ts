export interface Service {
  id: number;
  name_en: string;
  name_np: string;
  description_en: string;
  description_np: string;
  image: string | null;
  category_id: number;
  sub_category_id: number;
  category?: {
    id: number;
    name_en: string;
    name_np: string;
    description_en: string;
    description_np: string;
    image: string | null;
  };
  sub_category?: {
    id: number;
    name_en: string;
    name_np: string;
    description_en: string | null;
    description_np: string | null;
    image: string | null;
    category_id: number;
  };
}

export interface ServicesResponse {
  services: Service[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface GroupedService {
  service: Service;
  professionals: Array<{
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
  }>;
  prices: Array<{
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
  }>;
}

export interface ServiceFilters {
  searchQuery: string;
  filterType: 'name' | 'category' | 'subcategory';
  categoryId?: number | null;
  subCategoryId?: number | null;
}