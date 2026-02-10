
import { api } from '@/config/api-client';
import { ServicesResponse, Service } from '@/lib/data/service';

export async function fetchServices(
  page: number = 1,
  size: number = 10000,
  categoryId?: number,
  subCategoryId?: number,
  search?: string
): Promise<ServicesResponse> {
  try {
    const params: Record<string, any> = {
      page,
      size,
    };

    if (categoryId) {
      params.category_id = categoryId;
    }

    if (subCategoryId) {
      params.sub_category_id = subCategoryId;
    }

    if (search && search.trim()) {
      params.search = search.trim();
    }

    return await api.get<ServicesResponse>('/services', {
      params,
      cache: 'force-cache',
      next: { revalidate: 3600 }
    });
  } catch (error) {
    console.error('API Error fetching services:', error);
    return getFallbackServices();
  }
}

export async function fetchServiceById(id: number): Promise<Service | null> {
  try {
    if (id === 0) {
      return null;
    }
    return await api.get<Service>(`/services/${id}`, {
      cache: 'force-cache',
      next: { revalidate: 3600 }
    });
  } catch (error) {
    console.error(`Error fetching service ${id}:`, error);
    return null;
  }
}

// Helper function to group professional services by service
export function groupProfessionalServices(professionalServices: any[]): Map<number, any> {
  const groupedServices = new Map<number, any>();
  
  for (const ps of professionalServices) {
    if (!ps.service || !ps.professional) continue;
    
    const serviceId = ps.service.id;
    
    if (!groupedServices.has(serviceId)) {
      groupedServices.set(serviceId, {
        service: ps.service,
        professionals: [],
        prices: [],
      });
    }
    
    const serviceGroup = groupedServices.get(serviceId)!;
    serviceGroup.professionals.push(ps.professional);
    serviceGroup.prices.push(...ps.prices);
  }
  
  return groupedServices;
}

function getFallbackServices(): ServicesResponse {
  return {
    services: [
      {
        id: 1,
        name_en: "Deep Cleaning",
        name_np: "गहिरो सफाई",
        description_en: "Professional deep cleaning service",
        description_np: "व्यावसायिक गहिरो सफाई सेवा",
        image: null,
        category_id: 1,
        sub_category_id: 1,
        category: {
          id: 1,
          name_en: "Home Services",
          name_np: "गृह सेवाहरू",
          description_en: "All essential home services",
          description_np: "सबै आवश्यक घर सेवाहरू",
          image: null,
        },
        sub_category: {
          id: 1,
          name_en: "House Cleaning",
          name_np: "घर सफाई",
          description_en: "Professional house cleaning services",
          description_np: "व्यावसायिक घर सफाई सेवाहरू",
          image: null,
          category_id: 1,
        }
      },
      {
        id: 2,
        name_en: "Split AC Repair",
        name_np: "स्प्लिट एसी मर्मत",
        description_en: "Split AC repair and maintenance",
        description_np: "स्प्लिट एयर कन्डिसनर मर्मत र मर्मतसम्भार",
        image: null,
        category_id: 1,
        sub_category_id: 2,
        category: {
          id: 1,
          name_en: "Home Services",
          name_np: "गृह सेवाहरू",
          description_en: "All essential home services",
          description_np: "सबै आवश्यक घर सेवाहरू",
          image: null,
        },
        sub_category: {
          id: 2,
          name_en: "AC Repair",
          name_np: "एसी मर्मत",
          description_en: "Air conditioner repair and maintenance",
          description_np: "एयर कन्डिसनर मर्मत र मर्मतसम्भार",
          image: null,
          category_id: 1,
        }
      },
    ],
    total: 2,
    page: 1,
    size: 100,
    pages: 1,
  };
}