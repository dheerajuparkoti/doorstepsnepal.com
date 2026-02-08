import { fetchServices } from '@/lib/api/service';
import { fetchCategories } from '@/lib/api/categories';
import { fetchProfessionalServices } from '@/lib/api/professional-services';
import { groupProfessionalServices } from '@/lib/api/service';
import { ServicesClient } from '../service-section';

interface ServicesSectionProps {
  categoryId?: number;
  categoryName?: string;
  subCategoryId?: number;
  subCategoryName?: string;
}

export async function ServicesSection({
  categoryId,
  categoryName,
  subCategoryId,
  subCategoryName,
}: ServicesSectionProps = {}) {
  // Fetch services with optional filters
  const servicesData = await fetchServices(1, 10000, categoryId, subCategoryId);
  
  // Fetch categories for filter dropdown
  const categoriesData = await fetchCategories(1, 1000);
  
  // Fetch professional services to group by service
  const professionalServicesData = await fetchProfessionalServices();
  const groupedServices = groupProfessionalServices(
    professionalServicesData.professional_services
  );
  
  // Combine service data with grouped professional data
  const enhancedServices = servicesData.services.map(service => {
    const group = groupedServices.get(service.id);
    return {
      service,
      professionals: group?.professionals || [],
      prices: group?.prices || [],
    };
  });
  
  return (
    <ServicesClient 
      servicesData={enhancedServices}
      categoriesData={categoriesData.categories}
      initialCategoryId={categoryId}
      initialSubCategoryId={subCategoryId}
      screenTitle={
        subCategoryName || categoryName || 'Services'
      }
    />
  );
}