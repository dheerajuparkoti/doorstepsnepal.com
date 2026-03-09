import { PromotionsCarousel } from "../promotions-carousel";
import { fetchPromotions } from "@/lib/api/promotions";

export async function PromotionsCarouselSection() {
  try {
    // Fetch active promotions for public view
    const response = await fetchPromotions({
      page: 1,
      size: 100,
      active_only: true
    });

    if (response.promotions.length === 0) {
      return null;
    }

    return (
      <PromotionsCarousel
        promotions={response.promotions}
      />
    );
    
  } catch (error) {

    return null;
  }
}