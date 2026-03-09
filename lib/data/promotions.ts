export interface Promotion {
  id: number;
  title_en: string;
  title_np: string;
  name_en: string | null;
  name_np: string | null;
  description_en: string | null;
  description_np: string | null;
  image: string | null;
  link: string | null;
  link_text: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PromotionResponse {
  promotions: Promotion[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

// Helper function to get localized content
export function getLocalizedPromotion(promotion: Promotion, language: 'en' | 'ne') {
  return {
    title: language === 'ne' ? promotion.title_np : promotion.title_en,
    name: language === 'ne' ? promotion.name_np : promotion.name_en,
    description: language === 'ne' ? promotion.description_np : promotion.description_en,
  };
}