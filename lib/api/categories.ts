// lib/api/categories.ts
import { apiFetch } from '@/config/api-client';
import { CategoriesResponse, Category } from '@/lib/data/categories';

export async function fetchCategories(
  page: number = 1,
  size: number = 8
): Promise<CategoriesResponse> {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    // SSR with ISR caching
    return await apiFetch<CategoriesResponse>(`/categories?${params}`, {
      cache: 'force-cache',
      next: { revalidate: 3600 } // ISR: Revalidate every hour
    });
  } catch (error) {
    console.error('API Error fetching categories:', error);
    return getFallbackCategories();
  }
}

export async function fetchCategoryById(id: number): Promise<Category | null> {
  try {
    return await apiFetch<Category>(`/api/v1/categories/${id}`, {
      cache: 'force-cache',
      next: { revalidate: 3600 }
    });
  } catch (error) {
    console.error(`Error fetching category ${id}:`, error);
    return null;
  }
}

function getFallbackCategories(): CategoriesResponse {
  return {
    categories: [
      {
        id: 1,
        name_en: "Home Services",
        name_np: "गृह सेवाहरू",
        description_en: "All essential home services",
        description_np: "सबै आवश्यक घर सेवाहरू",
        image: null,
      },
      {
        id: 2,
        name_en: "Beauty & Wellness",
        name_np: "सौन्दर्य र स्वास्थ्य",
        description_en: "Beauty and wellness services",
        description_np: "सौन्दर्य र स्वास्थ्य सेवाहरू",
        image: null,
      },
      {
        id: 3,
        name_en: "Repair & Maintenance",
        name_np: "मर्मत तथा मर्मतसम्भार",
        description_en: "Repair services for appliances",
        description_np: "उपकरणहरूको मर्मत सेवाहरू",
        image: null,
      },
      {
        id: 4,
        name_en: "Cleaning Services",
        name_np: "सफाई सेवाहरू",
        description_en: "Professional cleaning services",
        description_np: "व्यावसायिक सफाई सेवाहरू",
        image: null,
      },
      {
        id: 5,
        name_en: "Electrical Services",
        name_np: "बिजुली सेवाहरू",
        description_en: "Electrical repairs and installations",
        description_np: "बिजुली मर्मत र स्थापना",
        image: null,
      },
      {
        id: 6,
        name_en: "Plumbing Services",
        name_np: "प्लम्बिङ सेवाहरू",
        description_en: "Plumbing and water services",
        description_np: "प्लम्बिङ र पानी सेवाहरू",
        image: null,
      },
      {
        id: 7,
        name_en: "Moving Services",
        name_np: "सार्ने सेवाहरू",
        description_en: "Home shifting and transport",
        description_np: "घर सार्ने र यातायात",
        image: null,
      },
      {
        id: 8,
        name_en: "Tutoring Services",
        name_np: "ट्युशन सेवाहरू",
        description_en: "Private tutoring and coaching",
        description_np: "निजी ट्युशन र कोचिङ",
        image: null,
      },
    ],
    total: 8,
    page: 1,
    size: 8,
    pages: 1,
  };
}