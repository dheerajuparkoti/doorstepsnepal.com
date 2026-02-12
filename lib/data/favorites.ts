export interface FavoriteProfessional {
  id: number;
  full_name: string;
  profile_image: string;
}

export interface FavoriteProfessionalService {
  id: number;
  price: number;
  service_id: number;
  service_name_en: string;
  service_name_np: string;
  full_name: string;
  image: string;
  created_at: string;
}

export interface Favorite {
  id: number;
  user_id: number;
  professional_id?: number;
  professional_service_id?: number;
  professional?: FavoriteProfessional;
  professional_service?: FavoriteProfessionalService;
}

export type FavoritesResponse = Favorite[];