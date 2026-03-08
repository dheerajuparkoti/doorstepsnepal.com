"use client";

import Image from "next/image";
import Link from "next/link";
import { Dialog, DialogContent, DialogTitle, DialogOverlay } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tag } from "lucide-react";

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

  // Function to render description with proper formatting
  const renderDescription = (description: string) => {
    if (!description) return null;

    // Check if the description contains HTML tags
    const containsHTML = /<[a-z][\s\S]*>/i.test(description);

    if (containsHTML) {
      // If it contains HTML, render it with proper styling
      return (
        <div 
          className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1 [&_h1]:text-xl [&_h1]:font-bold [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:text-base [&_h3]:font-medium [&_b]:font-bold [&_strong]:font-bold [&_i]:italic [&_em]:italic"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      );
    } else {
      // If it's plain text, check for markdown-style formatting
      const formattedText = description
        // Bold: **text** or __text__
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/__(.*?)__/g, '<strong>$1</strong>')
        // Italic: *text* or _text_
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/_(.*?)_/g, '<em>$1</em>')
        // Bullet points: lines starting with * or -
        .split('\n')
        .map(line => {
          if (line.trim().match(/^[\*\-]\s/)) {
            return `<li>${line.trim().substring(2)}</li>`;
          } else if (line.trim().match(/^\d+\.\s/)) {
            // Numbered lists
            return `<li>${line.trim()}</li>`;
          } else if (line.trim() === '') {
            return '<br/>';
          } else {
            return `<p>${line}</p>`;
          }
        })
        .join('');

      // Wrap lists in appropriate tags
      const withLists = formattedText
        .replace(/(<li>.*<\/li>)+/g, (match) => {
          if (match.includes('<li>')) {
            // Check if it's a numbered list
            const isNumbered = /<li>\d+\.\s/.test(match);
            return isNumbered ? `<ol class="list-decimal pl-5 my-2">${match}</ol>` : `<ul class="list-disc pl-5 my-2">${match}</ul>`;
          }
          return match;
        });

      return (
        <div 
          className="text-gray-600 dark:text-gray-300 leading-relaxed [&_p]:mb-2 [&_br]:my-1"
          dangerouslySetInnerHTML={{ __html: withLists }}
        />
      );
    }
  };

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
          {/* <div className="relative h-[200px] md:h-auto md:w-[40%] bg-gray-100 dark:bg-gray-800">
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
          </div> */}

          {/* Content Section - takes 60% width, scrollable */}
          <div className="p-5 space-y-4 md:w-[100%] max-h-[300px] md:max-h-[400px] overflow-y-auto">
            {serviceDescription && (
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1.5">
                  {isNepali ? "विवरण" : "Description"}
                </h3>
                {renderDescription(serviceDescription)}
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