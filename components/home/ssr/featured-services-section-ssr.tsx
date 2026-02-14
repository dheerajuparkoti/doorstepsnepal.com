import { FeaturedServicesSection } from "../featured-services-section";
import { fetchProfessionalServices } from "@/lib/api/professional-services";
import type { ProfessionalService } from "@/lib/data/professional-services";

export async function FeaturedServicesSectionSSR() {
  const data = await fetchProfessionalServices(1, 30);
  const services: ProfessionalService[] = data.professional_services || [];

  // Filter out services with no prices
  const pricedServices = services.filter((ps) => ps.prices && ps.prices.length > 0);

  return (
    <FeaturedServicesSection
      professionalServices={pricedServices.slice(0, 8)}

      total={pricedServices.length} // total only counts services that have at least one price
    />
  );
}
