"use client";

import Image from "next/image";
import Link from "next/link";
import { Dialog, DialogContent, DialogTitle, DialogClose, DialogOverlay } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tag, X } from "lucide-react";

interface ServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: {
    id: number | string;
    name_en?: string | null;
    name_np?: string | null;
    description_en?: string | null;
    description_np?: string | null;
    image?: string | null;
  } | null;
  priceRange?: {
    min: number;
    max: number;
    hasDiscount?: boolean;
    currencySymbol?: string;
  } | null;
  prices?: Array<{
    price: number;
    quality_type: {
      name: string;
      name_np?: string | null;
      name_en?: string | null;
    };
  }>;
  language?: string;
  currencySymbol?: string;
  bookLink?: string;
  showBookButton?: boolean;
}

export function ServiceDialog({
  open,
  onOpenChange,
  service,
  priceRange,
  prices = [],
  language = "en",
  currencySymbol = "Rs.",
  bookLink,
  showBookButton = true,
}: ServiceDialogProps) {
  if (!service) return null;

  const isNepali = language === "ne";
  
  const serviceName = isNepali 
    ? service.name_np || service.name_en || "Service" 
    : service.name_en || service.name_np || "Service";
  
  const serviceDescription = isNepali 
    ? service.description_np || service.description_en || "" 
    : service.description_en || service.description_np || "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Custom overlay with lower opacity and blur effect */}
      <DialogOverlay className="bg-black/20 backdrop-blur-sm fixed inset-0 z-50" />
      
      {/* Landscape dialog - wide and short */}
      <DialogContent className="max-w-5xl w-[95vw] h-auto max-h-[80vh] p-0 overflow-hidden bg-white dark:bg-gray-900">
        {/* Visible Dialog Title */}
        <DialogTitle className="text-xl font-semibold p-4 border-b dark:border-gray-800">
          {serviceName}
        </DialogTitle>


        {/* Content with landscape proportions */}
        <div className="flex flex-col md:flex-row h-full animate-in slide-in-from-bottom-5 duration-500">
          {/* Image Section */}
          <div className="relative h-[200px] md:h-auto md:w-[40%] bg-gray-100 dark:bg-gray-800">
            <Image
              src={service.image || "/placeholder-image.jpg"}
              alt={serviceName}
              fill
              className="object-cover"
              priority
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent md:bg-gradient-to-r" />

            {priceRange?.hasDiscount && (
              <div className="absolute top-4 right-4">
                <div className="bg-red-500 text-white px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1.5 shadow-lg">
                  <Tag className="h-3.5 w-3.5" />
                  {isNepali ? "अफर" : "OFFER"}
                </div>
              </div>
            )}
          </div>

          {/* Content Section - takes 60% width, scrollable */}
          <div className="p-5 space-y-4 md:w-[60%] max-h-[300px] md:max-h-[400px] overflow-y-auto">
            {serviceDescription && (
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1.5">
                  {isNepali ? "विवरण" : "Description"}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {serviceDescription}
                </p>
              </div>
            )}

            {prices.length > 0 && (
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                  {isNepali ? "मूल्य सूची" : "Price List"}
                </h3>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg divide-y divide-gray-200 dark:divide-gray-700">
                  {prices.map((price, index) => (
                    <div key={index} className="flex items-center justify-between p-3">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {isNepali 
                          ? price.quality_type.name_np || price.quality_type.name 
                          : price.quality_type.name_en || price.quality_type.name}
                      </span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {currencySymbol} {price.price.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Conditionally render the book button */}
            {showBookButton && (
              <div className="pt-2">
                <Button className="w-full" size="default" asChild>
                  <Link href={bookLink || `/services/${service.id}/professionals`}>
                    {isNepali ? "व्यवसायी छान्नुहोस्" : "Choose Professional"}
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}