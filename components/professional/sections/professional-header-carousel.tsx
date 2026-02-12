// components/professional/sections/professional-header-carousel.tsx
'use client';

import Image from "next/image";
import { useI18n } from "@/lib/i18n/context";
import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ShowcaseItem } from "@/lib/data/showcase";
import { cn } from "@/lib/utils";

interface ProfessionalHeaderCarouselProps {
  showcaseImages: string[];
  activeShowcases: ShowcaseItem[];
  professionSkill: string;
  fullName: string;
  experience: string;
  ratingString: string;
  completedOrders: string;
}

export function ProfessionalHeaderCarousel({
  showcaseImages,
  activeShowcases,
  professionSkill,
  fullName,
  experience,
  ratingString,
  completedOrders,
}: ProfessionalHeaderCarouselProps) {
  const { language } = useI18n();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  // Determine if we should show 2 images per view
  const showTwoPerView = showcaseImages.length > 1;

  // Initialize Embla Carousel
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: showcaseImages.length > 1,
      align: "center",
      containScroll: "trimSnaps",
      slidesToScroll: 1,
      dragFree: false,
      breakpoints: {
        '(min-width: 768px)': {
          slidesToScroll: showTwoPerView ? 1 : 1,
        }
      }
    },
    showcaseImages.length > 1 ? [Autoplay({ delay: 3000, stopOnInteraction: false })] : []
  );

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const handleImageError = (index: number) => {
    console.log(`❌ Image failed to load at index ${index}`);
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };

  const getImageSrc = (imageUrl: string, index: number) => {
    if (imageErrors[index]) {
      return '/carousel/home-services-1.jpg';
    }
    return imageUrl;
  };

  if (showcaseImages.length === 0) return null;

  return (
    <div className="relative w-full h-[400px] bg-black">
      {/* Carousel Viewport */}
      <div ref={emblaRef} className="overflow-hidden h-full">
        <div className="flex h-full">
          {showcaseImages.map((imageUrl, index) => {
            const description = index > 0 && index - 1 < activeShowcases.length
              ? activeShowcases[index - 1].description
              : null;

            return (
              <div
                key={index}
                className={cn(
                  "relative flex-shrink-0 flex-grow-0 h-full",
                  // Mobile: 1 image per view (100% width)
                  "w-full",
                  // Tablet/Desktop: 2 images per view (50% width), but only if we have more than 1 image
                  showTwoPerView && "md:w-1/2"
                )}
              >
                <div className="relative h-full w-full">
                  {/* Image */}
                  <Image
                    src={getImageSrc(imageUrl, index)}
                    alt={`Showcase ${index + 1}`}
                    fill
                    className="object-cover"
                    priority={index === 0}
                    onError={() => handleImageError(index)}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                  {/* Name + Profession + Stats (only on first slide) */}
                  {index === 0 && (
                    <>
                      <div className="absolute bottom-24 right-6 text-right">
                        <p className="text-sm text-white/80 drop-shadow-lg">
                          {professionSkill.split('/')[0].trim()}..
                        </p>
                        <h2 className="text-2xl font-bold text-white drop-shadow-lg md:text-3xl">
                          {fullName.split(' ')[0]}
                        </h2>
                      </div>

                      {/* Stats Cards - hidden on mobile when showing 2 images? 
                          Let's keep them visible but smaller */}
                      <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                        <div className="flex-1 rounded-lg bg-black/30 backdrop-blur-sm p-2 md:p-3 text-center">
                          <p className="text-xs md:text-sm font-semibold text-white">{experience}</p>
                          <p className="text-[10px] md:text-xs text-white/70">
                            {language === 'ne' ? 'अनुभव' : 'Exp'}
                          </p>
                        </div>
                        <div className="flex-1 rounded-lg bg-black/30 backdrop-blur-sm p-2 md:p-3 text-center">
                          <p className="text-xs md:text-sm font-semibold text-white">{ratingString}</p>
                          <p className="text-[10px] md:text-xs text-white/70">
                            {language === 'ne' ? 'रेटिङ' : 'Rating'}
                          </p>
                        </div>
                        <div className="flex-1 rounded-lg bg-black/30 backdrop-blur-sm p-2 md:p-3 text-center">
                          <p className="text-xs md:text-sm font-semibold text-white">{completedOrders}</p>
                          <p className="text-[10px] md:text-xs text-white/70">
                            {language === 'ne' ? 'काम' : 'Jobs'}
                          </p>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Showcase description */}
                  {description && (
                    <div className="absolute bottom-4 left-4 right-4 rounded-lg bg-black/50 p-2 backdrop-blur-sm">
                      <p className="text-center text-xs text-white line-clamp-2">
                        {description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Buttons - only show if we can scroll */}
      {showcaseImages.length > 1 && (
        <>
          <button
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className={cn(
              "absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 md:p-2 rounded-full z-10 transition-all",
              !canScrollPrev && "opacity-50 cursor-not-allowed hidden md:block"
            )}
            aria-label="Previous slide"
          >
            <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
          </button>
          <button
            onClick={scrollNext}
            disabled={!canScrollNext}
            className={cn(
              "absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 md:p-2 rounded-full z-10 transition-all",
              !canScrollNext && "opacity-50 cursor-not-allowed hidden md:block"
            )}
            aria-label="Next slide"
          >
            <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
          </button>
        </>
      )}

      {/* Dots Navigation - always show on mobile, show on desktop only if needed */}
      {showcaseImages.length > 1 && (
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {Array.from({ length: Math.ceil(showcaseImages.length / (showTwoPerView ? 2 : 1)) }).map((_, idx) => (
            <button
              key={idx}
              className={cn(
                "transition-all rounded-full",
                idx === selectedIndex
                  ? "w-6 h-2 bg-white"
                  : "w-2 h-2 bg-white/50 hover:bg-white/80"
              )}
              onClick={() => emblaApi?.scrollTo(idx)}
              aria-label={`Go to slide group ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}