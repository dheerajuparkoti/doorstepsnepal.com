
import { fetchProfessionalServices } from '@/lib/api/professional-services';
import {
  fetchProfessionalProfile,
  fetchProfessionalServiceAreas,
} from '@/lib/api/professional-profiles';
import { SearchSection } from '../search-section';

export async function SearchSectionSSR() {
  try {
    
    const professionalServicesData = await fetchProfessionalServices();

    const allServices =
      professionalServicesData?.professional_services || [];

  
    const servicesByProfessional = new Map<number, any[]>();

    for (const ps of allServices) {
      if (!ps.professional) continue;

      const profId = ps.professional_id;

      if (!servicesByProfessional.has(profId)) {
        servicesByProfessional.set(profId, []);
      }

      servicesByProfessional.get(profId)!.push(ps);
    }

    const professionalIds = Array.from(servicesByProfessional.keys());


    const SAFE_LIMIT = 200;
    const limitedProfessionalIds = professionalIds.slice(0, SAFE_LIMIT);

  
    const professionalsData = await Promise.all(
      limitedProfessionalIds.map(async (profId) => {
        try {
          const services = servicesByProfessional.get(profId) || [];

          const [profile, serviceAreas] = await Promise.all([
            fetchProfessionalProfile(profId),
            fetchProfessionalServiceAreas(profId),
          ]);

          return {
            id: profId,
            full_name:
              services[0]?.professional?.user?.full_name ||
              profile?.user?.full_name ||
            
              "Unknown Professional",
            service_areas_full: serviceAreas || [],
            services, 
          };
        } catch (error) {
          console.error(
            `Error fetching data for professional ${profId}:`,
            error
          );
          return null;
        }
      })
    );

    const cleanProfessionalsData = professionalsData.filter(Boolean);

    return (
      <SearchSection professionalsData={cleanProfessionalsData} />
    );
  } catch (error) {
    console.error("Error in SearchSectionSSR:", error);
    return <SearchSection professionalsData={[]} />;
  }
}
