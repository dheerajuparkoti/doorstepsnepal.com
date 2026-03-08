
import { FeaturedServicesCarousel } from "../featured-services-carousel";
import { fetchOfferServices } from "@/lib/api/home-section/offer-services";

export async function FeaturedServicesCarouselSection() {
  try {
    // Fetch exactly 12 offer services (will fetch multiple pages if needed)
    const offerServices = await fetchOfferServices({
      limit: 12,
      maxPerPage: 50,
      minDiscountPercentage: 0 
    });
    


    if (offerServices.length === 0) {

      return null; 
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