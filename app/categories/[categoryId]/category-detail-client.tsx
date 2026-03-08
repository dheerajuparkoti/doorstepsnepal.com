
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
  BookOpen
} from "lucide-react";




interface CategoryDetailClientProps {
  category: {
    id: number;
    name_en: string;
    name_np: string;
    description_en: string;
    description_np: string;
    image: string | null;
  };
}

export function CategoryDetailClient({ category }: CategoryDetailClientProps) {
  const { language } = useI18n();
  
  // Localized content
  const categoryName = language === "ne" ? category.name_np : category.name_en;
  const description = language === "ne" ? category.description_np : category.description_en;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section with Image */}
      <div className="relative h-[300px] md:h-[400px] w-full bg-gray-900">
        {category.image ? (
          <Image
            src={category.image}
            alt={categoryName}
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
              {categoryName}
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
            {/* Full Description */}
            {description && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    {language === "ne" ? "विवरण" : "Description"}
                  </h2>
                  <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                    {description}
                  </p>
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
                  {/* Category ID */}
                  {/* <div className="flex items-start gap-3 pb-3 border-b">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Layers className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {language === "ne" ? "श्रेणी आईडी" : "Category ID"}
                      </p>
                      <p className="font-semibold text-lg">
                        #{category.id}
                      </p>
                    </div>
                  </div> */}

                  {/* Available Services Link */}
                  {/* <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {language === "ne" ? "सेवाहरू" : "Services"}
                      </p>
                      <Button variant="outline" size="sm" asChild className="w-full">
                        <Link href={`/subcategories/${category.id}`}>
                          {language === "ne" ? "सेवाहरू हेर्नुहोस्" : "View Services"}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
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
                    <Link href={`/subcategories/${category.id}`}>
                      {language === "ne" ? "उपश्रेणीहरू हेर्नुहोस्" : "View Subcategories"}
                    </Link>
                  </Button>
                  
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/subcategories">
                      {language === "ne" ? "सबै श्रेणीहरू" : "All Categories"}
                    </Link>
                  </Button>
                </div>
                
                <div className="mt-6 flex items-center justify-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Layers className="h-3 w-3" />
                    <span>{language === "ne" ? "श्रेणी" : "Category"}</span>
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