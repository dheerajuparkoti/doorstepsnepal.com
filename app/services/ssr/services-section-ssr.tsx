// import { fetchServices } from '@/lib/api/service';
// import { fetchCategories } from '@/lib/api/categories';
// import { fetchProfessionalServices } from '@/lib/api/professional-services';
// import { groupProfessionalServices } from '@/lib/api/service';
// import { ServicesClient } from '../service-section';

// interface ServicesSectionProps {
//   categoryId?: number;
//   categoryName?: string;
//   subCategoryId?: number;
//   subCategoryName?: string;
// }

// export async function ServicesSection({
//   categoryId,
//   categoryName,
//   subCategoryId,
//   subCategoryName,
// }: ServicesSectionProps = {}) {
//   // Fetch services with optional filters
//   const servicesData = await fetchServices(1, 10000, categoryId, subCategoryId);
  
//   // Fetch categories for filter dropdown
//   const categoriesData = await fetchCategories(1, 1000);
  
//   // Fetch professional services to group by service
//   const professionalServicesData = await fetchProfessionalServices();
//   const groupedServices = groupProfessionalServices(
//     professionalServicesData.professional_services
//   );
  
//   // Combine service data with grouped professional data
//   const enhancedServices = servicesData.services.map(service => {
//     const group = groupedServices.get(service.id);
//     return {
//       service,
//       professionals: group?.professionals || [],
//       prices: group?.prices || [],
//     };
//   });
  
//   return (
//     <ServicesClient 
//       servicesData={enhancedServices}
//       categoriesData={categoriesData.categories}
//       initialCategoryId={categoryId}
//       initialSubCategoryId={subCategoryId}
//       screenTitle={
//         subCategoryName || categoryName || 'Services'
//       }
//     />
//   );
// }



// app/services/ssr/services-section-ssr.tsx
import { searchProfessionalServices } from '@/lib/api/professional-services';
import { fetchCategories } from '@/lib/api/categories';
import { fetchSubCategories } from '@/lib/api/subcategories';
import { groupProfessionalServices } from '@/lib/data/professional-services';
import { ServicesClient } from '../service-section';
import { SubCategory } from '@/lib/data/subcategories';

interface ServicesSectionProps {
  categoryId?: number;
  categoryName?: string;
  subCategoryId?: number;
  subCategoryName?: string;
  page?: number;
  search?: string;
}

export async function ServicesSection({
  categoryId,
  categoryName,
  subCategoryId,
  subCategoryName,
  page = 1,
  search,
}: ServicesSectionProps = {}) {
  // Fetch professional services with filters
  const professionalServicesData = await searchProfessionalServices({
    page,
    per_page: 50,
    category_id: categoryId,
    sub_category_id: subCategoryId,
    search,
  });
  
  // Group by service
  const groupedServices = groupProfessionalServices(professionalServicesData.professional_services);
  
  // Convert to array for client
  const servicesArray = Array.from(groupedServices.values()).map(group => ({
    service: group.service,
    professionals: group.professionals,
    prices: group.prices,
    professionalCount: group.professionalCount,
  }));
  
  // Fetch categories for filter dropdown
  const categoriesData = await fetchCategories(1, 1000);
  
  // Fetch subcategories if needed
  let subCategories: SubCategory[] = [];

if (categoryId) {
  const response = await fetchSubCategories(1, 100, categoryId);
  subCategories = response.sub_categories;
}

  
  return (
    <ServicesClient 
      servicesData={servicesArray}
      categoriesData={categoriesData.categories}
      subCategoriesData={subCategories}
      totalPages={professionalServicesData.total_pages}
      currentPage={professionalServicesData.page}
      totalResults={professionalServicesData.total}
      initialCategoryId={categoryId}
      initialSubCategoryId={subCategoryId}
      screenTitle={
        subCategoryName || categoryName || 'Services'
      }
    />
  );
}