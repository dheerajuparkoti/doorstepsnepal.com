import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { SearchSection } from "@/components/home/search-section";

import { PromotionsSection } from "@/components/home/promotions-section";
import { HowItWorksSection } from "@/components/home/how-it-works-section";
import { ProfessionalsSection } from "@/components/home/professionals-section";
import { WhyChooseSection } from "@/components/home/why-choose-section";
import { Suspense } from "react";
import Loading from "./loading";
import { CategoriesSection } from '@/components/home/category-section-ssr';
import { CategoriesSkeleton } from "@/components/home/skeleton/categories-skeleton";
import { ServicesSkeleton } from "@/components/home/skeleton/services-skeleton";
import { ServicesSection } from '@/components/home/services-section-ssr';
import { ProfessionalsSkeleton } from "@/components/home/skeleton/professional-skeleton";
import { ProfessionalsSections } from "@/components/home/professional-section-ssr";




export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<Loading />}>
          <section className="container mx-auto px-4 pt-4 pb-8">
            <HeroCarousel />
          </section>
          <SearchSection />
  {/* Categories Section with Suspense boundary */}
      <Suspense fallback={<CategoriesSkeleton />}>
        <CategoriesSection />
      </Suspense>
          {/* <ServicesSection /> */}

            {/* Services Section with Suspense boundary */}
      <Suspense fallback={<ServicesSkeleton />}>
        <ServicesSection />
      </Suspense>

          {/* professionals Section with Suspense boundary */}
      <Suspense fallback={<ProfessionalsSkeleton />}>
        <ProfessionalsSections />
      </Suspense>
      
          {/* <PromotionsSection /> */}
          <HowItWorksSection />
     
          <WhyChooseSection />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
