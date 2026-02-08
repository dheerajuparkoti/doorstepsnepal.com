export interface SubCategory {
  id: number;
  category_id: number;
  name_en: string;
  name_np: string;
  description_en: string | null;
  description_np: string | null;
  image: string | null;
  category?: {
    id: number;
    name_en: string;
    name_np: string;
    description_en: string;
    description_np: string;
    image: string | null;
  };
}

export interface SubCategoriesResponse {
  sub_categories: SubCategory[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface SubCategoryFilters {
  searchQuery: string;
  filterType: 'name' | 'tag' | 'category';
  categoryId?: number | null;
}