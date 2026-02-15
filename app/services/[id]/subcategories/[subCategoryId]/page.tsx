// app/services/[id]/subcategories/[subCategoryId]/page.tsx
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { ServicesClient } from '../../../../services/service-section';
import { ServicesSkeleton } from '../../../skeleton/services-skeleton';
import { fetchServices } from '@/lib/api/services';
import { fetchProfessionalServices } from '@/lib/api/professional-services';
import { fetchCategoryById } from '@/lib/api/categories';
import { fetchSubCategoryById } from '@/lib/api/subcategories';
import type { Service } from '@/lib/data/service';
import type { ProfessionalService, ProfessionalServicePrice } from '@/lib/data/professional-services';
import type { GroupedService } from '@/lib/data/service';

interface PageProps {
  params: Promise<{
    id: string;
    subCategoryId: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  try {
    const { id, subCategoryId } = await params;
    
    const categoryId = parseInt(id);
    const subCategoryIdNum = parseInt(subCategoryId);
    
    if (isNaN(categoryId) || isNaN(subCategoryIdNum)) {
      return {
        title: 'Services | DoorStep',
      };
    }

    const subCategory = await fetchSubCategoryById(subCategoryIdNum);
    
    if (!subCategory) {
      return {
        title: 'Services | DoorStep',
      };
    }
    
    return {
      title: `${subCategory.name_en} Services | DoorStep`,
      description: `Browse all ${subCategory.name_en} services and professionals`,
    };
  } catch (error) {
    return {
      title: 'Services | DoorStep',
    };
  }
}

export default async function SubCategoryServicesPage({ params }: PageProps) {
  try {
    const { id, subCategoryId } = await params;
    
    const categoryId = parseInt(id);
    const subCategoryIdNum = parseInt(subCategoryId);
    
    if (isNaN(categoryId) || isNaN(subCategoryIdNum)) {
      notFound();
    }

    // Fetch all data in parallel
    const [servicesResponse, professionalServicesResponse, category, subCategory] = await Promise.all([
      fetchServices(1, 10000, { sub_category_id: subCategoryIdNum }),
      fetchProfessionalServices(1, 10000).catch(() => ({ professional_services: [] })),
      fetchCategoryById(categoryId),
      fetchSubCategoryById(subCategoryIdNum)
    ]);

    if (!category || !subCategory) {
      notFound();
    }

    // Create maps for professionals and prices
    const professionalsByService = new Map<number, any[]>(); // Will store professional objects
    const pricesByService = new Map<number, ProfessionalServicePrice[]>();

    // Process professional services using your ProfessionalService type
    if (professionalServicesResponse?.professional_services) {
      professionalServicesResponse.professional_services.forEach((ps: ProfessionalService) => {
        const serviceId = ps.service_id;
        
        if (!professionalsByService.has(serviceId)) {
          professionalsByService.set(serviceId, []);
          pricesByService.set(serviceId, []);
        }

        // Add professional (avoid duplicates)
        const existingProfessionals = professionalsByService.get(serviceId) || [];
        if (!existingProfessionals.some(p => p.id === ps.professional.id)) {
          professionalsByService.set(serviceId, [...existingProfessionals, ps.professional]);
        }

        // Add prices
        if (ps.prices && ps.prices.length > 0) {
          const existingPrices = pricesByService.get(serviceId) || [];
          pricesByService.set(serviceId, [...existingPrices, ...ps.prices]);
        }
      });
    }

    // Format services data to match GroupedService type
    const groupedServices: GroupedService[] = servicesResponse.services.map((service: Service) => ({
      service,
      professionals: professionalsByService.get(service.id) || [],
      prices: pricesByService.get(service.id) || [],
    }));

    return (
      <Suspense fallback={<ServicesSkeleton />}>
        <ServicesClient
          servicesData={groupedServices}
          categoriesData={[category]}
          initialCategoryId={categoryId}
          initialSubCategoryId={subCategoryIdNum}
          screenTitle={subCategory.name_en}
        />
      </Suspense>
    );
  } catch (error) {
    console.error('Error in SubCategoryServicesPage:', error);
    notFound();
  }
}