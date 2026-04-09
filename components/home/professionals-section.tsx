"use client";

import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/lib/i18n/context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import type { ProfessionalService } from "@/lib/data/professional-services";
import type { TopProfessional } from "@/lib/data/professional";
// interface ProfessionalsClientProps {
//   professionalServices: ProfessionalService[];
//   total: number;
// }
interface ProfessionalsClientProps {
  professionals: TopProfessional[];
  total: number;
}

export function ProfessionalsSection({ professionals, total }: ProfessionalsClientProps) {
  const { language } = useI18n();

  if (!professionals || professionals.length === 0) {
    return (
        <section className="py-2 md:py-4">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {language === "ne" ? "शीर्ष प्रोफेशनलहरू" : "Top Professionals"}
          </h2>
          <p className="text-muted-foreground">
            {language === "ne" ? "कुनै प्रोफेशनल उपलब्ध छैन" : "No professionals available"}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-2 md:py-4">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-bold md:text-4xl">
              {language === "ne" ? "शीर्ष प्रोफेशनलहरू" : "Top Professionals"}
            </h2>
            <p className="mt-2 text-muted-foreground">
              {language === "ne"
                ? `कुल ${total} प्रोफेशनलहरू`
                : `Total ${total} professionals`}
          
            </p>
          </div>

          <Button variant="outline" className="gap-2" asChild>
            <Link href="/professionals">
              {language === "ne" ? "सबै व्यावसायिक हेर्नुहोस्" : "View All Professionals"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

<div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
  {professionals.map((pro, index) => {
    const skill = pro.skill || (language === "ne" ? "व्यावसायिक" : "Professional");

    return (
      <div key={pro.id} className="block">
        <Link href={`/professionals?professionalId=${pro.id}`} className="block">
       <Card className="group relative h-full overflow-hidden transition-all hover:border-primary hover:shadow-lg p-0 gap-0 cursor-pointer">

  {/* Background Image */}
  <div className="relative h-40 w-full overflow-hidden bg-muted">
    {pro.profile_image ? (
      <Image
        src={pro.profile_image}
        alt={pro.full_name}
        fill
        className="object-cover transition duration-300 group-hover:scale-105 group-hover:opacity-40"
      />
    ) : (
      <div className="flex h-full items-center justify-center">
        <span className="text-muted-foreground text-sm">
          {language === "ne" ? "तस्बिर छैन" : "No Image"}
        </span>
      </div>
    )}
  </div>

  {/* 👇 POPUP IMAGE (CENTER) */}
  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
    <div className="
      h-24 w-24 md:h-28 md:w-28 
      rounded-full overflow-hidden 
      bg-white/20 backdrop-blur-md
      scale-50 opacity-0
      transition-all duration-300
      group-hover:scale-100 group-hover:opacity-100
    ">
      {pro.profile_image && (
        <Image
          src={pro.profile_image}
          alt={pro.full_name}
          fill
          className="object-cover"
        />
      )}
    </div>
  </div>

  {/* Content */}
  <CardContent className="p-4 relative z-10 text-center">
    <h3 className="font-semibold text-foreground line-clamp-1">
      {pro.full_name}
    </h3>

    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
      {skill}
    </p>

    <span className="text-xs text-primary mt-2 inline-block group-hover:underline">
      {language === "ne" ? "प्रोफाइल हेर्नुहोस्" : "View profile"}
    </span>
  </CardContent>

  {/* Optional subtle overlay */}
  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />
</Card>
        </Link>
      </div>
    );
  })}

</div>

              
       

        {/* Footer: Show more if total > displayed */}
        {total > professionals.length && (
          <div className="mt-12 text-center">
            <Button variant="ghost" className="gap-2" asChild>
              <Link href="/professionals">
                {language === "ne"
                  ? `थप ${total - professionals.length} प्रोफेशनलहरू हेर्नुहोस्`
                  : `View ${total - professionals.length} more professionals`}
               
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
