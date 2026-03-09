"use client";

import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/lib/i18n/context";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import type { Promotion } from "@/lib/data/promotions";
import { getLocalizedPromotion } from "@/lib/data/promotions";

interface PromotionsCarouselProps {
  promotions: Promotion[];
}

export function PromotionsCarousel({ promotions }: PromotionsCarouselProps) {
  const { language } = useI18n();
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    [Autoplay({ delay: 5000, stopOnInteraction: true })]
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

  if (!promotions || promotions.length === 0) return null;

  return (
    <section className="py-8 md:py-12 relative bg-gradient-to-b from-primary/5 to-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold md:text-4xl">
            {language === "ne" ? "विज्ञापन/प्रचार" : "Ads/Promotions"}
          </h2>
          {promotions.length > 0 && (
            <span className="text-sm text-muted-foreground">
              {language === "ne" 
                ? `${promotions.length} प्रचारहरू` 
                : `${promotions.length} promotions`}
            </span>
          )}
        </div>

        {/* Carousel Wrapper */}
        <div className="relative">
          <div ref={emblaRef} className="overflow-hidden rounded-xl">
            <div className="flex gap-6">
              {promotions.map((promotion) => {
                const localized = getLocalizedPromotion(promotion, language);
                
                return (
                  <Link
                    key={promotion.id}
                    href={promotion.link || '#'}
                    target={promotion.link?.startsWith('http') ? '_blank' : undefined}
                    rel={promotion.link?.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="flex-shrink-0 w-[380px] md:w-[480px] lg:w-[520px] group"
                  >
                    <div className="relative h-[420px] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                      {/* Background Image */}
                      {promotion.image ? (
                        <Image
                          src={promotion.image}
                          alt={localized.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="(max-width: 768px) 380px, (max-width: 1024px) 480px, 520px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                          {language === "ne" ? "तस्वीर छैन" : "No Image"}
                        </div>
                      )}

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                      {/* Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        {/* Title */}
                        <h3 className="text-2xl font-bold mb-2 line-clamp-2">
                          {localized.title}
                        </h3>

                        {/* Name (if available) */}
                        {localized.name && (
                          <p className="text-sm text-gray-200 mb-2 line-clamp-1">
                            {localized.name}
                          </p>
                        )}

                        {/* Description (if available) */}
                        {localized.description && (
                          <p className="text-sm text-gray-300 mb-4 line-clamp-2">
                            {localized.description}
                          </p>
                        )}

                        {/* Link Button - only show if link_text exists and is not empty */}
                        {promotion.link && promotion.link_text && (
                          <div className="inline-flex items-center gap-2 text-sm font-medium text-white bg-primary/80 hover:bg-primary px-4 py-2 rounded-lg backdrop-blur-sm transition-all">
                            {promotion.link_text}
                            <ExternalLink className="h-4 w-4" />
                          </div>
                        )}
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