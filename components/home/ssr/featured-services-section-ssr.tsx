// import { FeaturedServicesSection } from "../featured-services-section";
// import { fetchProfessionalServices } from "@/lib/api/professional-services";
// import type { ProfessionalService } from "@/lib/data/professional-services";

// export async function FeaturedServicesSectionSSR() {
//   const data = await fetchProfessionalServices(1, 30);
//   const services: ProfessionalService[] = data.professional_services || [];

//   // Filter out services with no prices
//   const pricedServices = services.filter((ps) => ps.prices && ps.prices.length > 0);

//   return (
//     <FeaturedServicesSection
//       professionalServices={pricedServices.slice(0, 8)}

//       total={pricedServices.length} // total only counts services that have at least one price
//     />
//   );
// }


import { FeaturedServicesSection } from "../featured-services-section";
import { fetchFeaturedServices } from "@/lib/api/home-section/featured-services";

export async function FeaturedServicesSectionSSR() {
  try {
    // Fetch featured services (will keep fetching until it has 8 or runs out)
    const { services, total } = await fetchFeaturedServices({
      limit: 8,
      maxPerPage: 30
    });
    
    console.log(`🎠 Featured section will show ${services.length} services out of ${total} total`);

    if (services.length === 0) {
      console.log('🚫 No priced services found, hiding section');
      return null;
    }

    return (
      <FeaturedServicesSection
        professionalServices={services}
        total={total}
      />
    );
    
  } catch (error) {
    console.error("❌ Error in FeaturedServicesSectionSSR:", error);
    return null;
  }
}
