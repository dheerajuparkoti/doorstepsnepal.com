import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { SearchSection } from "@/components/home/search-section";
import { ServicesSection } from "@/components/home/services-section";
import { PromotionsSection } from "@/components/home/promotions-section";
import { HowItWorksSection } from "@/components/home/how-it-works-section";
import { ProfessionalsSection } from "@/components/home/professionals-section";
import { WhyChooseSection } from "@/components/home/why-choose-section";
import { Suspense } from "react";
import Loading from "./loading";

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
          <ServicesSection />
          <PromotionsSection />
          <HowItWorksSection />
          <ProfessionalsSection />
          <WhyChooseSection />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
