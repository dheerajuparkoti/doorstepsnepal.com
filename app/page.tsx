

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { HowItWorksSection } from "@/components/home/how-it-works-section";
import { WhyChooseSection } from "@/components/home/why-choose-section";
import { Suspense} from "react";
import Loading from "./loading";
import { CategoriesSection } from '@/components/home/ssr/category-section-ssr';
import { CategoriesSkeleton } from "@/components/home/skeleton/categories-skeleton";
import { ServicesSkeleton } from "@/components/home/skeleton/services-skeleton";
import { ServicesSection } from '@/components/home/ssr/services-section-ssr';
import { ProfessionalsSkeleton } from "@/components/home/skeleton/professional-skeleton";
import { ProfessionalsSections } from "@/components/home/ssr/professional-section-ssr";
import { FeaturedServicesSkeleton } from "@/components/home/skeleton/feateured-services-skeleton";
import { FeaturedServicesSections } from "@/components/home/ssr/featured-services-section-ssr";
import { FeaturedServicesCarouselSkeleton } from "@/components/home/skeleton/featured-services-carousel-skeleton";
import { FeaturedServicesCarouselSection } from "@/components/home/ssr/featured-services-carousel-ssr";

// Import the new SSR component
import { SearchSectionSSR } from "@/components/home/ssr/search-section-ssr";
import { SearchSkeleton } from "@/components/home/skeleton/search-skeleton";
import { PartnerBenefitProgramSkeleton } from "@/components/home/skeleton/partner-benefit-program-skeleton";
import { PartnerBenefitProgramSSR } from "@/components/home/ssr/partner-benefit-program-ssr";
import { generateToken } from "./notifications/fcm-web";
import FCMInitializer from "./notifications/fcm-initializer";

  
export default function HomePage() {
  
  return (
    <div className="flex min-h-screen flex-col">
          <FCMInitializer />
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<Loading />}>
          <section className="container mx-auto px-4 pt-4 pb-8">
            <HeroCarousel />
          </section>
          
          {/* Search Section with Suspense boundary */}
          <Suspense fallback={<SearchSkeleton />}>
            <SearchSectionSSR />
          </Suspense>

          {/* featured services Section with Suspense boundary */}
          <Suspense fallback={<FeaturedServicesCarouselSkeleton/>}>
            <FeaturedServicesCarouselSection />
          </Suspense>

          {/* featured services Section with Suspense boundary */}
          <Suspense fallback={<FeaturedServicesSkeleton />}>
            <FeaturedServicesSections />
          </Suspense>

          {/* Categories Section with Suspense boundary */}
          <Suspense fallback={<CategoriesSkeleton />}>
            <CategoriesSection />
          </Suspense>

          {/* Services Section with Suspense boundary */}
          <Suspense fallback={<ServicesSkeleton />}>
            <ServicesSection />
          </Suspense>

          {/* professionals Section with Suspense boundary */}
          <Suspense fallback={<ProfessionalsSkeleton />}>
            <ProfessionalsSections />
          </Suspense>
          
          <HowItWorksSection />



          {/* Partner Benefit Program Section*/}
          <Suspense fallback={<PartnerBenefitProgramSkeleton />}>
            <PartnerBenefitProgramSSR />
          </Suspense>
          <WhyChooseSection />

        </Suspense>
      </main>
      <Footer />
    </div>
  );
}