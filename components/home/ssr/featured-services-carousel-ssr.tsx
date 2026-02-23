// import { FeaturedServicesCarousel } from "./featured-services-carousel";
// import { fetchProfessionalServices } from "@/lib/api/professional-services";

// export async function FeaturedServicesCarouselSection() {
//   // fetch more to ensure enough discounted services
//   const data = await fetchProfessionalServices(1, 30);

//   return (
//     <FeaturedServicesCarousel
//       professionalServices={data.professional_services || []}
//       total={data.total}
//     />
//   );
// }


// import { FeaturedServicesCarousel } from "../featured-services-carousel";
// import { fetchProfessionalServices } from "@/lib/api/professional-services";
// import type { ProfessionalService } from "@/lib/data/professional-services";

// export async function FeaturedServicesCarouselSection() {
//   // Fetch more to ensure enough discounted services
//   const data = await fetchProfessionalServices(1, 20);

//   const services: ProfessionalService[] =
//     data.professional_services || [];

//   // Keep only services with at least ONE discounted price
//   const discountedServices = services.filter((ps) =>
//     ps.prices?.some((p) => p.discount_percentage > 0)
//   );

//   return (
//     <FeaturedServicesCarousel
//       professionalServices={discountedServices.slice(0, 12)}
   
//     />
//   );
// }


import { FeaturedServicesCarousel } from "../featured-services-carousel";
import { fetchOfferServices } from "@/lib/api/home-section/offer-services";

export async function FeaturedServicesCarouselSection() {
  try {
    // Fetch exactly 12 offer services (will fetch multiple pages if needed)
    const offerServices = await fetchOfferServices({
      limit: 12,
      maxPerPage: 50,
      minDiscountPercentage: 0 // Include all active discounts
    });
    
    console.log(`🎠 Carousel will show ${offerServices.length} offer services`);

    if (offerServices.length === 0) {
      console.log('🚫 No offer services found, hiding section');
      return null; // Don't show section if no offers
    }

    return (
      <FeaturedServicesCarousel
        professionalServices={offerServices}
      />
    );
    
  } catch (error) {
    console.error("❌ Error in FeaturedServicesCarouselSection:", error);
    return null;
  }
}