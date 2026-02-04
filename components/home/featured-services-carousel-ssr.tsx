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


import { FeaturedServicesCarousel } from "./featured-services-carousel";
import { fetchProfessionalServices } from "@/lib/api/professional-services";
import type { ProfessionalService } from "@/lib/data/professional-services";

export async function FeaturedServicesCarouselSection() {
  // Fetch more to ensure enough discounted services
  const data = await fetchProfessionalServices(1, 30);

  const services: ProfessionalService[] =
    data.professional_services || [];

  // Keep only services with at least ONE discounted price
  const discountedServices = services.filter((ps) =>
    ps.prices?.some((p) => p.discount_percentage > 0)
  );

  return (
    <FeaturedServicesCarousel
      professionalServices={discountedServices.slice(0, 12)}
   
    />
  );
}

// import dynamic from "next/dynamic";
// import { fetchProfessionalServices } from "@/lib/api/professional-services";

// const FeaturedServicesCarousel = dynamic(
//   () => import("./featured-services-carousel").then((mod) => mod.FeaturedServicesCarousel),
//   { ssr: false }
// );

// export async function FeaturedServicesCarouselWrapper() {
//   const data = await fetchProfessionalServices(1, 20); // fetch more for carousel
//   const services = data.professional_services || [];

//   return <FeaturedServicesCarousel professionalServices={services} />;
// }
