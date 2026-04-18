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
  CheckCircle,
  Sparkles,
  ListChecks,
  Star,
  Shield
} from "lucide-react";

interface SubCategoryDetailClientProps {
  subcategory: {
    id: number;
    name_en: string;
    name_np: string;
    description_en: string | null; 
    description_np: string | null;  
    image: string | null;
    category_id?: number;
    category_name_en?: string;
    category_name_np?: string;
  };
}

export function SubCategoryDetailClient({ subcategory }: SubCategoryDetailClientProps) {
  const { language } = useI18n();

  const subcategoryName = language === "ne" ? subcategory.name_np : subcategory.name_en;
  const categoryName = language === "ne" ? subcategory.category_name_np : subcategory.category_name_en;
  const description = language === "ne" 
    ? (subcategory.description_np || '') 
    : (subcategory.description_en || '');

  // Function to format description (matching CategoryDetailClient style)
  const formatDescription = (text: string) => {
    if (!text) return null;

    // Split by sections (marked by ✅ or •)
    const sections = text.split(/(?=✅|•|✔ )/g);
    
    return sections.map((section, index) => {
      // Check if section is a bullet list
      if (section.includes('•')) {
        const items = section.split('•').filter(item => item.trim());
        return (
          <ul key={index} className="space-y-2 my-4">
            {items.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{item.trim()}</span>
              </li>
            ))}
          </ul>
        );
      }
      
      // Check if section has a heading (starts with ✅)
      if (section.includes('✅')) {
        const lines = section.split('\n').filter(line => line.trim());
        const heading = lines[0].replace('✅', '').trim();
        const content = lines.slice(1).join('\n');
        
        return (
          <div key={index} className="mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-primary">
              <Sparkles className="h-5 w-5" />
              {heading}
            </h3>
            {content.includes('•') ? (
              <ul className="space-y-2">
                {content.split('•').filter(item => item.trim()).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item.trim()}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                {content}
              </p>
            )}
          </div>
        );
      }
      
      // Regular paragraph
      return (
        <p key={index} className="text-muted-foreground leading-relaxed mb-4">
          {section}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section with Image */}
      <div className="relative h-[300px] md:h-[400px] w-full bg-gray-900">
        {subcategory.image ? (
          <Image
            src={subcategory.image}
            alt={subcategoryName}
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
              href="/subcategories" 
              className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {language === "ne" ? "उपश्रेणीहरूमा फर्कनुहोस्" : "Back to Subcategories"}
            </Link>
            
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 max-w-3xl">
              {subcategoryName}
            </h1>
            
            {description && (
              <p className="text-white/90 text-lg max-w-2xl line-clamp-2">
                {description.split('\n')[0]}
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
            {/* Full Description Card with Rich Formatting */}
            {description && (
              <Card>
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-center gap-2 mb-6 pb-4 border-b">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-semibold">
                      {language === "ne" ? "विवरण" : "Description"}
                    </h2>
                  </div>
                  
                  <div className="space-y-2">
                    {formatDescription(description)}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Quick Info Card */}
        

            {/* Navigation Card */}
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <ListChecks className="h-5 w-5" />
                  {language === "ne" ? "सम्बन्धित लिङ्कहरू" : "Related Links"}
                </h3>
                
                <div className="space-y-3">
                  <Button className="w-full" variant="default" asChild>
                    <Link href={`/services?subcategory=${subcategory.id}`}>
                      {language === "ne" ? "सेवाहरू हेर्नुहोस्" : "View Services"}
                    </Link>
                  </Button>
                  
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/subcategories">
                      {language === "ne" ? "सबै उपश्रेणीहरू" : "All Subcategories"}
                    </Link>
                  </Button>

                  {subcategory.category_id && (
                    <Button variant="outline" className="w-full" asChild>
                      <Link href={`/categories/${subcategory.category_id}`}>
                        {language === "ne" ? "मुख्य श्रेणी हेर्नुहोस्" : "View Parent Category"}
                      </Link>
                    </Button>
                  )}
                </div>
                
                <div className="mt-6 flex items-center justify-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Shield className="h-3 w-3" />
                    <span>Verified</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Star className="h-3 w-3" />
                    <span>Premium</span>
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