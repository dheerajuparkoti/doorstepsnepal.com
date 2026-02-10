import { api } from '@/config/api-client';
import { SubCategoriesResponse, SubCategory } from '@/lib/data/subcategories';

export async function fetchSubCategories(
  page: number = 1,
  size: number = 1000,
  categoryId?: number,
  search?: string
): Promise<SubCategoriesResponse> {
  try {
    const params: Record<string, any> = {
      page,
      size,
    };

    if (categoryId) {
      params.category_id = categoryId;
    }

    if (search && search.trim()) {
      params.search = search.trim();
    }

    return await api.get<SubCategoriesResponse>('/sub_categories', {
      params,
      cache: 'force-cache',
      next: { revalidate: 3600 }
    });
  } catch (error) {
    console.error('API Error fetching subcategories:', error);
    return getFallbackSubCategories();
  }
}

export async function fetchSubCategoryById(id: number): Promise<SubCategory | null> {
  try {
    return await api.get<SubCategory>(`/sub_categories/${id}`, {
      cache: 'force-cache',
      next: { revalidate: 3600 }
    });
  } catch (error) {
    console.error(`Error fetching subcategory ${id}:`, error);
    return null;
  }
}

// IMPORTANT: Update your data model to match API response!
function getFallbackSubCategories(): SubCategoriesResponse {
  return {
    sub_categories: [  // Note: snake_case to match API!
      {
        id: 1,
        category_id: 1,
        name_en: "House Cleaning",
        name_np: "घर सफाई",
        description_en: "Professional house cleaning services",
        description_np: "व्यावसायिक घर सफाई सेवाहरू",
        image: null,
        category: {
          id: 1,
          name_en: "Home Services",
          name_np: "गृह सेवाहरू",
          description_en: "All essential home services",
          description_np: "सबै आवश्यक घर सेवाहरू",
          image: null,
        }
      },
      {
        id: 2,
        category_id: 1,
        name_en: "AC Repair",
        name_np: "एसी मर्मत",
        description_en: "Air conditioner repair and maintenance",
        description_np: "एयर कन्डिसनर मर्मत र मर्मतसम्भार",
        image: null,
        category: {
          id: 1,
          name_en: "Home Services",
          name_np: "गृह सेवाहरू",
          description_en: "All essential home services",
          description_np: "सबै आवश्यक घर सेवाहरू",
          image: null,
        }
      },
      {
        id: 3,
        category_id: 2,
        name_en: "Hair Cutting",
        name_np: "कपाल काट्ने",
        description_en: "Professional hair cutting and styling",
        description_np: "व्यावसायिक कपाल काट्ने र स्टाइलिङ",
        image: null,
        category: {
          id: 2,
          name_en: "Beauty & Wellness",
          name_np: "सौन्दर्य र स्वास्थ्य",
          description_en: "Beauty and wellness services",
          description_np: "सौन्दर्य र स्वास्थ्य सेवाहरू",
          image: null,
        }
      },
      {
        id: 4,
        category_id: 3,
        name_en: "TV Repair",
        name_np: "टिभी मर्मत",
        description_en: "Television repair services",
        description_np: "टेलिभिजन मर्मत सेवाहरू",
        image: null,
        category: {
          id: 3,
          name_en: "Repair & Maintenance",
          name_np: "मर्मत तथा मर्मतसम्भार",
          description_en: "Repair services for appliances",
          description_np: "उपकरणहरूको मर्मत सेवाहरू",
          image: null,
        }
      },
    ],
    total: 4,
    page: 1,
    size: 20,
    pages: 1,
  };
}