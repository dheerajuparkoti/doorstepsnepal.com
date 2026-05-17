"use client";

import Image from "next/image";
import { useI18n } from "@/lib/i18n/context";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import type { Promotion } from "@/lib/data/promotions";
import { getLocalizedPromotion } from "@/lib/data/promotions";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);

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

  const selectedLocalized = selectedPromotion
    ? getLocalizedPromotion(selectedPromotion, language)
    : null;
  const hasLink = !!selectedPromotion?.link && !!selectedPromotion?.link_text;

  return (
    <>
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
                    <button
                      key={promotion.id}
                      onClick={() => setSelectedPromotion(promotion)}
                      className="flex-shrink-0 w-[380px] md:w-[480px] lg:w-[520px] group text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
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
                          <h3 className="text-2xl font-bold mb-2 line-clamp-2">
                            {localized.title}
                          </h3>
                          {localized.name && (
                            <p className="text-sm text-gray-200 mb-2 line-clamp-1">
                              {localized.name}
                            </p>
                          )}
                          {localized.description && (
                            <p className="text-sm text-gray-300 mb-4 line-clamp-2">
                              {localized.description}
                            </p>
                          )}
                          {promotion.link && promotion.link_text && (
                            <div className="inline-flex items-center gap-2 text-sm font-medium text-white bg-primary/80 px-4 py-2 rounded-lg backdrop-blur-sm">
                              {promotion.link_text}
                              <ExternalLink className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
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

      {/* Promotion Detail Modal — mirrors Flutter's _showPreviewModal */}
      <Dialog
        open={!!selectedPromotion}
        onOpenChange={(open) => !open && setSelectedPromotion(null)}
      >
        <DialogContent className="p-0 overflow-hidden max-w-lg w-[calc(100%-2rem)] rounded-2xl border-0 gap-0">
          {selectedPromotion && selectedLocalized && (
            <>
              {/* 16:9 image — same aspect ratio as Flutter AspectRatio(16/9) */}
              <div className="relative w-full aspect-video bg-muted">
                {selectedPromotion.image ? (
                  <Image
                    src={selectedPromotion.image}
                    alt={selectedLocalized.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 512px"
                    priority
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                    {language === "ne" ? "तस्वीर छैन" : "No Image"}
                  </div>
                )}
              </div>

              {/* Title + description + optional link button */}
              <div className="p-5 space-y-2">
                <h3 className="text-lg font-bold leading-snug">
                  {selectedLocalized.title}
                </h3>
                {selectedLocalized.name && (
                  <p className="text-sm text-muted-foreground">
                    {selectedLocalized.name}
                  </p>
                )}
                {selectedLocalized.description && (
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    {selectedLocalized.description}
                  </p>
                )}
                {hasLink && (
                  <div className="pt-2">
                    <a
                      href={selectedPromotion.link!}
                      target={
                        selectedPromotion.link!.startsWith("http")
                          ? "_blank"
                          : undefined
                      }
                      rel="noopener noreferrer"
                      onClick={() => setSelectedPromotion(null)}
                      className="block"
                    >
                      <Button className="w-full gap-2">
                        {selectedPromotion.link_text}
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </a>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
