"use client";

import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/lib/i18n/context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Tag } from "lucide-react";
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

  return (
    <section className="py-16 md:py-24">
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

            return (
              <Link
                key={ps.id}
                href={`/services/${service.id}/professionals`}
              >
  

    <Card className="group h-full overflow-hidden transition-all hover:border-primary hover:shadow-lg">
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
        No Image
      </div>
    )}
  </div>

  {/* Content */}
  <CardContent className="p-4 space-y-3">
    {/* Service Name */}
    <h3 className="font-semibold line-clamp-1 text-gray-900 dark:text-white">
      {language === "ne" ? service.name_np : service.name_en}
    </h3>

    {/* Prices */}
    <div className="space-y-2">
      {ps.prices
        .filter((p) => p.price !== null)
        .map((price) => {
          const discountedPrice =
            price.discount_percentage > 0
              ? Math.round(price.price * (1 - price.discount_percentage / 100))
              : null;

          return (
            <div
              key={price.id}
              className="rounded-md border border-gray-200 bg-gray-50 p-2 dark:bg-black dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                {/* Price */}
                <span className="font-medium text-gray-900 dark:text-white">
                  {discountedPrice !== null ? (
                    <>
                      <span className="line-through text-amber-400 dark:text-amber-500 mr-2">
                        Rs. {price.price}
                      </span>
                      <span className="text-white-600 dark:text-white-400 font-semibold">
                        Rs. {discountedPrice}
                      </span>
                    </>
                  ) : (
                    <span>Rs. {price.price}</span>
                  )}
                  {price.is_minimum_price && (
                    <span className="ml-1 text-xs text-blue-500 dark:text-blue-400">
                      (Starting)
                    </span>
                  )}
                </span>

                {/* Discount */}
                {price.discount_percentage > 0 && (
                  <span className="text-green-600 dark:text-green-400 text-xs flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    {price.discount_percentage}% off
                  </span>
                )}
              </div>

              {/* Unit and Quality */}
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {price.price_unit.name} • {price.quality_type.name}
              </div>
            </div>
          );
        })}
    </div>
  </CardContent>
</Card>



              </Link>
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
