// import { PopularServicesSection } from "../popular-services-section";
// import { fetchProfessionalServices } from "@/lib/api/professional-services";
// import type { ProfessionalService } from "@/lib/data/professional-services";

// export async function PopularServicesSectionSSR() {
//   const data = await fetchProfessionalServices(1, 30);
//   const services: ProfessionalService[] = data.professional_services || [];

//   // Filter out services with no prices
//   const pricedServices = services.filter((ps) => ps.prices && ps.prices.length > 0);

//   return (
//     <PopularServicesSection
//       professionalServices={pricedServices.slice(0, 8)}

//       total={pricedServices.length} // total only counts services that have at least one price
//     />
//   );
// }


import { PopularServicesSection } from "../popular-services-section";
import { fetchPopularServices } from "@/lib/api/home-section/popular-services";

export async function PopularServicesSectionSSR() {
  try {
    // Fetch popular services (will keep fetching until it has 8 or runs out)
    const { services, total } = await fetchPopularServices({
      limit: 8,
      maxPerPage: 30
    });
    


    if (services.length === 0) {

      return null;
    }

    return (
      <PopularServicesSection
        professionalServices={services}
        total={total}
      />
    );
    
  } catch (error) {
    console.error(" Error in PopularServicesSectionSSR:", error);
    return null;
  }
}
