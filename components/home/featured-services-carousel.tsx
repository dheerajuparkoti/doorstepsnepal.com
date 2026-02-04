"use client";

import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/lib/i18n/context";
import { ArrowLeft, ArrowRight, Tag } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import type { ProfessionalService } from "@/lib/data/professional-services";

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
    <section className="py-16 md:py-24 relative">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold md:text-4xl mb-8">
          {language === "ne" ? "सेवा अन्वेषण गर्नुहोस्" : "Explore Services"}
        </h2>

        {/* Carousel Wrapper */}
        <div className="relative">
          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex gap-6">
              {professionalServices.map((ps) => {
                const service = ps.service;
                const discountedPrices = ps.prices.filter((p) => p.discount_percentage > 0);

                return (
                  <Link
                    key={ps.id}
                    href={`/services/${service.id}`}
                    className="flex-shrink-0 w-[380px] md:w-[480px] lg:w-[520px]"
                  >
                    <div className="relative h-[420px] rounded-lg overflow-hidden shadow-lg group">
                      {/* Image */}
                      {service.image ? (
                        <Image
                          src={service.image}
                          alt={language === "ne" ? service.name_np : service.name_en}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-muted text-sm">
                          No Image
                        </div>
                      )}

                      {/* Overlay */}
                      <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/70 to-transparent text-white p-4 flex flex-col gap-2">
                        <h3 className="font-semibold text-lg line-clamp-2">
                          {language === "ne" ? service.name_np : service.name_en}
                        </h3>

                        {discountedPrices.map((price) => {
                          const discountedPrice =
                            price.price - (price.price * price.discount_percentage) / 100;

                          return (
                            <div key={price.id} className="text-sm">
                              <div className="flex items-center gap-2">
                                {price.is_minimum_price && (
                                  <span className="text-xs text-gray-300">
                                    {language === "ne" ? "सुरु" : "Starting from"}
                                  </span>
                                )}
                                <span className="font-medium">
                                  Rs. {discountedPrice.toFixed(2)}
                                </span>
                                {price.discount_percentage > 0 && (
                                  <span className="line-through text-gray-400 text-xs">
                                    Rs. {price.price}
                                  </span>
                                )}
                                {price.discount_percentage > 0 && (
                                  <span className="flex items-center gap-1 text-green-400 text-xs">
                                    <Tag className="h-3 w-3" />
                                    {price.discount_percentage}%
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-gray-300">
                                {price.quality_type.name} / {price.price_unit.name}
                              </div>
                            </div>
                          );
                        })}
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
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full z-10"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          {canScrollNext && (
            <button
              onClick={scrollNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full z-10"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
