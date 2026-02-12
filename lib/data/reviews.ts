// lib/data/reviews.ts
export enum ReviewViewMode {
  CHRONOLOGICAL = 'chronological',
  GROUPED_BY_SERVICE = 'grouped_by_service'
}

export interface ReviewCustomer {
  id: number;
  full_name: string;
}

export interface ReviewPriceUnit {
  id: number;
  name: string;
}

export interface ReviewQualityType {
  id: number;
  name: string;
}

export interface ReviewPrice {
  id: number;
  professional_service_id: number;
  price_unit_id: number;
  quality_type_id: number;
  price: number;
  discount_percentage: number;
  discount_name: string;
  discount_is_active: boolean;
  is_minimum_price: boolean;
  price_unit: ReviewPriceUnit;
  quality_type: ReviewQualityType;
}

export interface ReviewProfessionalUser {
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
}

export interface ReviewProfessional {
  id: number;
  user_id: number;
  skill: string;
  user: ReviewProfessionalUser;
}

export interface ReviewService {
  id: number;
  name_en: string;
  name_np: string;
  description_en: string;
  description_np: string;
  image: string | null;
  category_id: number;
  sub_category_id: number;
}

export interface ReviewProfessionalService {
  id: number;
  professional_id: number;
  service_id: number;
  professional: ReviewProfessional;
  service: ReviewService;
  prices: ReviewPrice[];
}

export interface ProfessionalServiceReview {
  id: number;
  rating: number;
  review: string;
  professional_service_id: number;
  customer_id: number;
  professional_service: ReviewProfessionalService;
  customer: ReviewCustomer;
  created_at?: string;
  updated_at?: string;
}

export interface ProfessionalServiceReviewResponse {
  reviews: ProfessionalServiceReview[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface FetchReviewsParams {
  professional_service_id?: number;
  professional_id?: number;
  service_id?: number;
  page?: number;
  per_page?: number;
}