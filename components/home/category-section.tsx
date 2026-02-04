// components/home/categories-client.tsx
'use client';

import { useI18n } from '@/lib/i18n/context';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

interface CategoriesClientProps {
  categoriesData: {
    categories: Array<{
      id: number;
      name_en: string;
      name_np: string;
      description_en: string;
      description_np: string;
      image: string | null;
    }>;
    total: number;
  };
}

export function CategoriesClient({ categoriesData }: CategoriesClientProps) {
  const { language } = useI18n(); 
  
  const { categories, total } = categoriesData;

  if (!categories || categories.length === 0) {
    return (
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {language === "ne" ? "सेवा श्रेणीहरू" : "Service Categories"}
          </h2>
          <p className="text-muted-foreground">
            {language === "ne" 
              ? "कुनै सेवा श्रेणी उपलब्ध छैन" 
              : "No service categories available"}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Header - Updates INSTANTLY when language changes */}
        <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">
              {language === "ne" ? "सेवा श्रेणीहरू" : "Service Categories"}
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

        {/* Categories Grid - Updates INSTANTLY */}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <Link key={category.id} href={`/services/${category.id}`}>
              <Card className="group h-full overflow-hidden transition-all hover:border-primary hover:shadow-lg">
                {/* Image */}
                <div className="relative h-40 w-full overflow-hidden bg-muted">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={language === "ne" ? category.name_np : category.name_en}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      priority={categories.indexOf(category) < 4}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="text-muted-foreground text-sm">
                        {language === "ne" ? "तस्बिर छैन" : "No Image"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content - Updates INSTANTLY */}
                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground line-clamp-1">
                    {language === "ne" ? category.name_np : category.name_en}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                    {language === "ne" ? category.description_np : category.description_en}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Show More - Updates INSTANTLY */}
        {total > 8 && (
          <div className="mt-12 text-center">
            <Button variant="ghost" className="gap-2" asChild>
              <Link href="/services">
                {language === "ne"
                  ? `थप ${total - 8} श्रेणीहरू हेर्नुहोस्`
                  : `View ${total - 8} more categories`}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}