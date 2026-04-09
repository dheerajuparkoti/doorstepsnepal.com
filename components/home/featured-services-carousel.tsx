



"use client";

import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/lib/i18n/context";
import { ArrowLeft, ArrowRight, Tag, Percent, ShieldCheck } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import type { ProfessionalService } from "@/lib/data/professional-services";
import { getBestDiscount } from "@/lib/api/home-section/offer-services";
import { createProfessionalSlug, createServiceSlug } from "@/lib/utils/slug";


interface FeaturedServicesCarouselProps {
  professionalServices: ProfessionalService[];
}

export function FeaturedServicesCarousel({
  professionalServices,
}: FeaturedServicesCarouselProps) {
  const { language } = useI18n();
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    [Autoplay({ delay: 4000, stopOnInteraction: false })]
  );

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  if (!professionalServices || professionalServices.length === 0) return null;

  return (
    <section className="py-2 md:py-4 relative bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold md:text-4xl">
            {language === "ne" ? "विशेष प्रस्तावहरू" : "Special Offers"}
          </h2>
          {professionalServices.length > 0 && (
            <span className="text-sm text-muted-foreground">
              {language === "ne" 
                ? `${professionalServices.length} प्रस्तावहरू उपलब्ध` 
                : `${professionalServices.length} offers available`}
            </span>
          )}
        </div>

        {/* Carousel Wrapper */}
        <div className="relative">
          <div ref={emblaRef} className="overflow-hidden rounded-xl">
            <div className="flex gap-6">
              {professionalServices.map((ps) => {
                const service = ps.service;
                const professional = ps.professional;
                const bestDiscount = getBestDiscount(ps);
                
                // Get all active discounted prices
                const discountedPrices = ps.prices.filter(
                  (p) => p.discount_is_active && p.discount_percentage > 0
                );

                // Create slugs for the new route structure
                const professionalSlug = createProfessionalSlug(
                  professional.user.full_name, 
                  professional.id
                );
                
                const serviceName = service?.name_en || 'service';
                const serviceSlug = createServiceSlug(
                  serviceName, 
                  ps.id
                );

                return (
                  <Link
                    key={ps.id}
                    href={`/professionals/${professionalSlug}/services/${serviceSlug}`}
                    className="flex-shrink-0 w-[380px] md:w-[480px] lg:w-[520px] group"
                  >
                    <div className="relative h-[420px] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                      {/* Discount Badge */}
                      {bestDiscount.percentage > 0 && (
                        <div className="absolute top-4 left-4 z-20 flex items-center gap-1 bg-red-500 text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                          <Percent className="h-4 w-4" />
                          <span>{bestDiscount.percentage}% OFF</span>
                          {bestDiscount.name && (
                            <span className="text-xs ml-1 opacity-90">({bestDiscount.name})</span>
                          )}
                        </div>
                      )}

                      {/* Professional Badge */}
                      <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-black/70 text-white px-3 py-1.5 rounded-full text-sm backdrop-blur-sm">
                        <div className="relative h-6 w-6 rounded-full overflow-hidden bg-gray-300">
                          {professional.user.profile_image ? (
                            <Image
                              src={professional.user.profile_image}
                              alt={professional.user.full_name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-primary/20 text-xs">
                              {professional.user.full_name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <span className="max-w-[120px] truncate">
                          {professional.user.full_name}
                        </span>
                      </div>

                      {/* Image */}
                      {service.image ? (
                        <Image
                          src={service.image}
                          alt={language === "ne" ? service.name_np : service.name_en}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                          {language === "ne" ? "तस्वीर छैन" : "No Image"}
                        </div>
                      )}

                      {/* Overlay */}
                      <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/90 via-black/50 to-transparent text-white p-6">
                        <h3 className="font-bold text-xl mb-2 line-clamp-2">
                          {language === "ne" ? service.name_np : service.name_en}
                        </h3>

                        <div className="space-y-2">
                          {discountedPrices.map((price) => {
                            const discountedPrice =
                              price.price - (price.price * price.discount_percentage) / 100;

                            return (
                              <div key={price.id} className="text-sm">
                                <div className="flex items-center gap-2 flex-wrap">
                                  {price.is_minimum_price && (
                                    <span className="text-xs text-gray-300">
                                      {language === "ne" ? "सुरु" : "Starting from"}
                                    </span>
                                  )}
                                  <span className="font-semibold text-lg text-green-400">
                                    Rs. {discountedPrice.toFixed(2)}
                                  </span>
                                  {price.discount_percentage > 0 && (
                                    <>
                                      <span className="line-through text-gray-400 text-sm">
                                        Rs. {price.price}
                                      </span>
                                      <span className="flex items-center gap-1 bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full text-xs">
                                        <Tag className="h-3 w-3" />
                                        {price.discount_percentage}% off
                                      </span>
                                    </>
                                  )}
                                </div>
                                        <div className="text-xs text-gray-300 mt-1">
                                  {price.quality_type.name} • {price.price_unit.name}
                                </div>
                                {price.has_warranty && (
                                  <div className="flex items-center gap-1 text-xs text-emerald-400 mt-1">
                                    <ShieldCheck className="h-3 w-3" />
                                    {price.warranty_duration} {price.warranty_unit} {language === "ne" ? "वारेन्टी" : "warranty"}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* View Details Button */}
                        <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="inline-flex items-center gap-2 text-sm font-medium text-white bg-primary/80 hover:bg-primary px-4 py-2 rounded-lg backdrop-blur-sm">
                            {language === "ne" ? "विवरण हेर्नुहोस्" : "View Details"}
                            <ArrowRight className="h-4 w-4" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Navigation Buttons */}
          {canScrollPrev && (
            <button
              onClick={scrollPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full z-10 transition-all hover:scale-110"
              aria-label="Previous slide"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          {canScrollNext && (
            <button
              onClick={scrollNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full z-10 transition-all hover:scale-110"
              aria-label="Next slide"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}