import { fetchProfessionalServices } from '@/lib/api/professional-services';
import type { ProfessionalService } from '@/lib/data/professional-services';
import { SearchSection } from '../search-section';

export async function SearchSectionSSR() {
  try {
    console.log("Fetching professional services for search...");
    
    // Fetch all professional services 
    const data = await fetchProfessionalServices(1, 10000);
    
    if (!data?.professional_services) {
      console.log("No professional services found");
      return <SearchSection professionalsData={[]} />;
    }

    const professionalServices: ProfessionalService[] = data.professional_services;
    console.log(`Fetched ${professionalServices.length} professional services`);

    // Transform the data to the format expected by SearchSection
  
    const professionalsData = professionalServices.map((ps) => ({
      id: ps.professional_id,
      full_name: ps.professional?.user?.full_name || "Unknown Professional",
      services: [{
        service_id: ps.service_id,
        service: {
          id: ps.service.id,
          name_en: ps.service.name_en,
          name_np: ps.service.name_np,
        },
        professional: ps.professional,
      }],
      //  include service_name as a string for easier searching
      service_name: `${ps.service.name_en}, ${ps.service.name_np}`,
    }));

    console.log(`Processed ${professionalsData.length} professionals with services`);

    return <SearchSection professionalsData={professionalsData} />;
    
  } catch (error) {
    console.error("Error in SearchSectionSSR:", error);
    return <SearchSection professionalsData={[]} />;
  }
}