// app/service/detail/[id]/service-detail-client.tsx
"use client";

import { useI18n } from "@/lib/i18n/context";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Tag, 
  Clock, 
  Layers,
  BookOpen,
  FolderTree,
  Info,
  Grid,
  Package
} from "lucide-react";

interface ServiceDetailClientProps {
  service: {
    id: number;
    name_en: string;
    name_np: string;
    description_en: string;
    description_np: string;
    image: string | null;
    category_id: number;
    sub_category_id: number;
  };
}

export function ServiceDetailClient({ service }: ServiceDetailClientProps) {
  const { language } = useI18n();

  const serviceName = language === "ne" ? service.name_np : service.name_en;
  const description = language === "ne" 
    ? (service.description_np || '') 
    : (service.description_en || '');

  // Function to render description with proper formatting (copied from ServiceDialog)
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section with Image */}
      <div className="relative h-[300px] md:h-[400px] w-full bg-gray-900">
        {service.image ? (
          <Image
            src={service.image}
            alt={serviceName}
            fill
            className="object-cover opacity-60"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10" />
        )}
        
        {/* Overlay Content */}
        <div className="absolute inset-0 bg-black/50" />
        
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <Link 
              href="/#" 
              className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
             {language === "ne" ? "गृहपृष्ठमा फर्कनुहोस्" : "Back to Home"}
            </Link>
            
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 max-w-3xl">
              {serviceName}
            </h1>
            
            {description && (
              <p className="text-white/90 text-lg max-w-2xl line-clamp-2">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Full Description Card with formatted description */}
            {description && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Info className="h-5 w-5 text-primary" />
                    {language === "ne" ? "विवरण" : "Description"}
                  </h2>
                  {renderDescription(description)}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Quick Info Card */}
            {/* <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  {language === "ne" ? "द्रुत जानकारी" : "Quick Info"}
                </h3>
                
                <div className="space-y-5"> */}
                  {/* Service ID */}
                  {/* <div className="flex items-start gap-3 pb-3 border-b">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Layers className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {language === "ne" ? "सेवा आईडी" : "Service ID"}
                      </p>
                      <p className="font-semibold text-lg">
                        #{service.id}
                      </p>
                    </div>
                  </div> */}

                  {/* Category Link */}
                  {/* {service.category_id && (
                    <div className="flex items-start gap-3 pb-3 border-b">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <FolderTree className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {language === "ne" ? "श्रेणी" : "Category"}
                        </p>
                        <Button variant="outline" size="sm" asChild className="w-full">
                          <Link href={`/categories/${service.category_id}`}>
                            {language === "ne" ? "श्रेणी हेर्नुहोस्" : "View Category"}
                          </Link>
                        </Button>
                      </div>
                    </div>
                  )} */}

                  {/* Subcategory Link */}
                  {/* {service.sub_category_id && (
                    <div className="flex items-start gap-3 pb-3 border-b">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <Grid className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {language === "ne" ? "उपश्रेणी" : "Subcategory"}
                        </p>

                      
                        <Button variant="outline" size="sm" asChild className="w-full">
                          <Link href={`/subcategories/sub-category-detail/${service.sub_category_id}`}>
                            {language === "ne" ? "उपश्रेणी हेर्नुहोस्" : "View Subcategory"}
                          </Link>
                        </Button>
                      </div>
                    </div>
                  )} */}

                  {/* Available Professionals Link */}
                  {/* <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {language === "ne" ? "व्यवसायीहरू" : "Professionals"}
                      </p>
                      <Button variant="outline" size="sm" asChild className="w-full">
                        <Link href={`/services/${service.id}/professionals`}>
                          {language === "ne" ? "व्यवसायी हेर्नुहोस्" : "View Professionals"}
                        </Link>
                      </Button>
                    </div>
                  </div> */}
                {/* </div>
              </CardContent>
            </Card> */}

            {/* Navigation Card */}
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  {language === "ne" ? "सम्बन्धित लिङ्कहरू" : "Related Links"}
                </h3>
                
                <div className="space-y-3">
                  <Button className="w-full" variant="default" asChild>
                    <Link href={`/services/${service.id}/professionals`}>
                      {language === "ne" ? "उपलब्ध प्रोफेशनलहरू हेर्नुहोस्" : "View Available Professionals"}
                    </Link>
                  </Button>
                  
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/services">
                      {language === "ne" ? "सबै सेवाहरू" : "All Services"}
                    </Link>
                  </Button>

                  {/* {service.category_id && (
                    <Button variant="outline" className="w-full" asChild>
                      <Link href={`/categories/${service.category_id}`}>
                        {language === "ne" ? "श्रेणी" : "Category"}
                      </Link>
                    </Button>
                  )} */}
                </div>
                
                <div className="mt-6 flex items-center justify-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Layers className="h-3 w-3" />
                    <span>{language === "ne" ? "सेवा" : "Service"}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="h-3 w-3" />
                    <span>{language === "ne" ? "विवरण" : "Details"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}