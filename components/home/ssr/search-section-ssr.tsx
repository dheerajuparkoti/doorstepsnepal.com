

import { fetchServices } from '@/lib/api/service';
import type { Service } from '@/lib/data/service';
import { SearchSection } from '../search-section';

export async function SearchSectionSSR() {
  try {
    
    // Fetch all services
    const data = await fetchServices(
      1, // page
      10000, // size - get all services
      undefined, // categoryId
      undefined, // subCategoryId
      undefined // search
    );
    
    if (!data?.services || data.services.length === 0) {
      console.log("No services found");
      return <SearchSection servicesData={[]} />;
    }

    const services: Service[] = data.services;
  

    // Transform services data 
    const servicesData = services.map((service) => ({
      id: service.id,
      name_en: service.name_en,
      name_np: service.name_np,
      image: service.image,
      description_en: service.description_en,
      description_np: service.description_np,
      category: service.category,
      sub_category: service.sub_category
    }));

    return <SearchSection servicesData={servicesData} />;
    
  } catch (error) {
  
    return <SearchSection servicesData={[]} />;
  }
}