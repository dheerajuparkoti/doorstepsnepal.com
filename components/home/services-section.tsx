// "use client";

// import React from "react"

// import Link from "next/link";
// import { useI18n } from "@/lib/i18n/context";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { serviceCategories } from "@/lib/data/services";
// import {
//   Zap,
//   Droplets,
//   Sparkles,
//   Scissors,
//   Wrench,
//   Users,
//   ArrowRight,
// } from "lucide-react";

// const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
//   Zap,
//   Droplets,
//   Sparkles,
//   Scissors,
//   Wrench,
//   Users,
// };

// export function ServicesSection() {
//   const { t, language } = useI18n();

//   return (
//     <section className="py-16 md:py-24">
//       <div className="container mx-auto px-4">
//         {/* Section Header */}
//         <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
//           <div>
//             <h2 className="text-3xl font-bold text-foreground md:text-4xl">
//               {t.services.popular}
//             </h2>
//             <p className="mt-2 text-muted-foreground">
//               {language === "ne"
//                 ? "तपाईंको घरेलु आवश्यकताहरूको लागि विश्वसनीय सेवाहरू"
//                 : "Reliable services for all your home needs"}
//             </p>
//           </div>
//           <Button variant="outline" className="gap-2 bg-transparent" asChild>
//             <Link href="/services">
//               {t.services.viewAll}
//               <ArrowRight className="h-4 w-4" />
//             </Link>
//           </Button>
//         </div>

//         {/* Services Grid */}
//         <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
//           {serviceCategories.map((category) => {
//             const IconComponent = iconMap[category.icon] || Wrench;
//             return (
//               <Link key={category.id} href={`/services/${category.id}`}>
//                 <Card className="group h-full cursor-pointer transition-all hover:border-primary hover:shadow-md">
//                   <CardContent className="flex flex-col items-center p-6 text-center">
//                     <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
//                       <IconComponent className="h-7 w-7" />
//                     </div>
//                     <h3 className="font-semibold text-foreground">
//                       {language === "ne" ? category.nameNe : category.name}
//                     </h3>
//                     <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
//                       {language === "ne" ? category.descriptionNe : category.description}
//                     </p>
//                   </CardContent>
//                 </Card>
//               </Link>
//             );
//           })}
//         </div>
//       </div>
//     </section>
//   );
// }


'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useI18n } from '@/lib/i18n/context';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

interface ServicesClientProps {
  servicesData: {
    services: Array<{
      id: number;
      name_en: string;
      name_np: string;
      description_en: string;
      description_np: string;
      image: string | null;
      category_id: number;
      sub_category_id: number;
    }>;
    total: number;
  };
}

export function ServicesClient({ servicesData }: ServicesClientProps) {
  const { language } = useI18n();
  const { services, total } = servicesData;

  if (!services || services.length === 0) {
    return (
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {language === 'ne' ? 'सेवाहरू' : 'Services'}
          </h2>
          <p className="text-muted-foreground">
            {language === 'ne'
              ? 'कुनै सेवा उपलब्ध छैन'
              : 'No services available'}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">
              {language === 'ne' ? 'लोकप्रिय सेवाहरू' : 'Popular Services'}
            </h2>
            <p className="mt-2 text-muted-foreground">
              {language === 'ne'
                ? `कुल ${total} सेवाहरू`
                : `Total ${total} services`}
            </p>
          </div>

          <Button variant="outline" className="gap-2" asChild>
            <Link href="/services">
              {language === 'ne' ? 'सबै हेर्नुहोस्' : 'View All'}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Services Grid */}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {services.map((service, index) => (
            <Link key={service.id} href={`/services/${service.id}`}>
              <Card className="group h-full overflow-hidden transition-all hover:border-primary hover:shadow-lg">
                {/* Image */}
                <div className="relative h-40 w-full overflow-hidden bg-muted">
                  {service.image ? (
                    <Image
                      src={service.image}
                      alt={language === 'ne' ? service.name_np : service.name_en}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      priority={index < 4}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="text-sm text-muted-foreground">
                        {language === 'ne' ? 'तस्बिर छैन' : 'No Image'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground line-clamp-1">
                    {language === 'ne' ? service.name_np : service.name_en}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                    {language === 'ne'
                      ? service.description_np
                      : service.description_en}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Show More */}
        {total > services.length && (
          <div className="mt-12 text-center">
            <Button variant="ghost" className="gap-2" asChild>
              <Link href="/services">
                {language === 'ne'
                  ? `थप ${total - services.length} सेवाहरू हेर्नुहोस्`
                  : `View ${total - services.length} more services`}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
