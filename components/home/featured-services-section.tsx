"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/lib/i18n/context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Tag, ShieldCheck } from "lucide-react";
import type { ProfessionalService } from "@/lib/data/professional-services";

interface FeaturedServicesProps {
  professionalServices: ProfessionalService[];
  total: number;
}

export function FeaturedServicesSection({
  professionalServices,
  total,
}: FeaturedServicesProps) {
  const { language } = useI18n();

  // Only show services that have at least one price
  const pricedServices = professionalServices.filter(
    (ps) => ps.prices && ps.prices.length > 0
  );

  if (pricedServices.length === 0) return null;

  // Helper function to get currency symbol based on language
  const getCurrencySymbol = () => {
    return language === "ne" ? "रु" : "Rs.";
  };

  // Helper function to calculate price range for a service
  const getPriceRange = (prices: typeof professionalServices[0]['prices']) => {
    const validPrices = prices.filter(p => p.price !== null);
    
    if (validPrices.length === 0) return null;
    
    const priceValues = validPrices.map(p => p.price);
    const minPrice = Math.min(...priceValues);
    const maxPrice = Math.max(...priceValues);
    
    // Check if any price has discount
    const hasDiscount = validPrices.some(p => p.discount_percentage > 0);
    
    // Find if any price is marked as minimum price
    const hasMinimumPrice = validPrices.some(p => p.is_minimum_price);
    
    // Find the price with discount for display (if any)
    const discountedPrice = validPrices.find(p => p.discount_percentage > 0);
    
    const warrantyPrice = validPrices.find(p => p.has_warranty);

    return {
      min: minPrice,
      max: maxPrice,
      hasDiscount,
      hasMinimumPrice,
      discountedPrice,
      isRange: minPrice !== maxPrice,
      hasWarranty: !!warrantyPrice,
      warrantyDuration: warrantyPrice?.warranty_duration ?? null,
      warrantyUnit: warrantyPrice?.warranty_unit ?? null,
    };
  };

  return (
    <section className="py-2 md:py-4">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-bold md:text-4xl">
              {language === "ne" ? "विशेष सेवाहरू" : "Featured Services"}
            </h2>
            <p className="mt-2 text-muted-foreground">
              {language === "ne"
                ? `कुल ${total} सेवाहरू`
                : `Total ${total} services`}
            </p>
          </div>

          <Button variant="outline" className="gap-2" asChild>
            <Link href="/services">
              {language === "ne" ? "सबै हेर्नुहोस्" : "View All"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {pricedServices.map((ps) => {
            const service = ps.service;
            const priceRange = getPriceRange(ps.prices);
            const currencySymbol = getCurrencySymbol();
            
            if (!priceRange) return null;

            const description = language === "ne" ? service.description_np : service.description_en;
            const needsTruncation = description && description.length > 100;

            // detail page URL
            const detailUrl = `/services/service-detail/${ps.id}`;

            return (
              <div key={ps.id} className="block">
                <Link href={`/services/${service.id}/professionals`} className="block">
                  <Card className="group h-full overflow-hidden transition-all hover:border-primary hover:shadow-lg p-0 gap-0 cursor-pointer">
                    {/* Service Image */}
                    <div className="relative h-40 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                      {service.image ? (
                        <Image
                          src={service.image}
                          alt={language === "ne" ? service.name_np : service.name_en}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-gray-400 dark:text-gray-500">
                          {language === "ne" ? "तस्वीर छैन" : "No Image"}
                        </div>
                      )}
                      
                      {/* Discount Badge */}
                      {priceRange.hasDiscount && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          {language === "ne" ? "अफर" : "Offer"}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <CardContent className="p-4">
                      {/* Service Name */}
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {language === "ne" ? service.name_np : service.name_en}
                      </h3>

                      {/* Description with Read More Link */}
                      {description && (
                        <div className="mb-3">
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {description}
                          </p>
                          {needsTruncation && (
                             <span 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          window.location.href = detailUrl;
        }}
        className="text-xs text-primary hover:underline inline-block mt-0.5 cursor-pointer"
      >
        {language === "ne" ? "थप पढ्नुहोस्..." : "Read more..."}
      </span>
                          )}
                        </div>
                      )}

                      {/* Price Range Display */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-lg text-gray-900 dark:text-white">
                              {priceRange.isRange ? (
                                <>
                                  {currencySymbol} {priceRange.min.toLocaleString()} - {priceRange.max.toLocaleString()}
                                </>
                              ) : (
                                <>{currencySymbol} {priceRange.min.toLocaleString()}</>
                              )}
                            </span>
                          </div>
                          
                          {/* Minimum Price Indicator */}
                          {priceRange.hasMinimumPrice && (
                            <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded-full">
                              {language === "ne" ? "सुरु" : "Starting"}
                            </span>
                          )}
                        </div>

                        {/* Discount Info */}
                        {priceRange.discountedPrice && (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-green-600 dark:text-green-400 font-medium">
                              {priceRange.discountedPrice.discount_percentage}% off
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {priceRange.discountedPrice.discount_name}
                            </span>
                          </div>
                        )}

                        {/* Warranty badge */}
                        {priceRange.hasWarranty && (
                          <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            {priceRange.warrantyDuration} {priceRange.warrantyUnit} {language === "ne" ? "वारेन्टी" : "warranty"}
                          </div>
                        )}

                        {/* Price Options Count */}
                        <div className="text-xs text-muted-foreground">
                          {ps.prices.length} {language === "ne" ? "मूल्य विकल्प" : "price options"} •{" "}
                          {ps.prices.map(p => p.quality_type.name).filter((v, i, a) => a.indexOf(v) === i).join(", ")}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        {total > pricedServices.length && (
          <div className="mt-12 text-center">
            <Button variant="ghost" className="gap-2" asChild>
              <Link href="/services">
                {language === "ne"
                  ? `थप ${total - pricedServices.length} सेवाहरू हेर्नुहोस्`
                  : `View ${total - pricedServices.length} more services`}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}