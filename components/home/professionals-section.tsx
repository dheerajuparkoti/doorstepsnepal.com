

"use client";

import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/lib/i18n/context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import type { ProfessionalService } from "@/lib/data/professional-services";

interface ProfessionalsClientProps {
  professionalServices: ProfessionalService[];
  total: number;
}

export function ProfessionalsSection({ professionalServices, total }: ProfessionalsClientProps) {
  const { language } = useI18n();

  if (!professionalServices || professionalServices.length === 0) {
    return (
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {language === "ne" ? "शीर्ष पेशेवरहरू" : "Top Professionals"}
          </h2>
          <p className="text-muted-foreground">
            {language === "ne" ? "कुनै पेशेवर उपलब्ध छैन" : "No professionals available"}
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
            <h2 className="text-3xl font-bold md:text-4xl">
              {language === "ne" ? "शीर्ष पेशेवरहरू" : "Top Professionals"}
            </h2>
            <p className="mt-2 text-muted-foreground">
              {language === "ne"
                ? `कुल ${total} पेशेवरहरू`
                : `Total ${total} professionals`}
            </p>
          </div>

          {/* <Button variant="outline" className="gap-2" asChild>
            <Link href="/professionals">
              {language === "ne" ? "सबै हेर्नुहोस्" : "View All"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button> */}
          <Button variant="outline" className="gap-2" asChild>
  <Link href="/professionals">
    {language === "ne" ? "सबै व्यावसायिक हेर्नुहोस्" : "View All Professionals"}
    <ArrowRight className="h-4 w-4" />
  </Link>
</Button>
        </div>

        {/* Professionals Grid */}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {professionalServices.map((ps) => {
            const user = ps.professional.user;

            return (
              // <Link key={ps.professional.id} href={`/professionals/${ps.professional.id}`}>
              <Link key={ps.professional.id} href={`/professionals?professionalId=${ps.professional.id}`}>
                <Card className="group h-full overflow-hidden transition-all hover:border-primary hover:shadow-lg">
                  {/* Circular Avatar */}
                  <div className="relative mx-auto mt-6 h-36 w-36 overflow-hidden rounded-full bg-muted">
                    {user.profile_image ? (
                      <Image
                        src={user.profile_image}
                        alt={user.full_name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                        N/A
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <CardContent className="p-4 text-center">
                    <h3 className="font-semibold text-foreground line-clamp-1">
                      {user.full_name}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                      {ps.professional.skill}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Footer: Show more if total > displayed */}
        {total > professionalServices.length && (
          <div className="mt-12 text-center">
            <Button variant="ghost" className="gap-2" asChild>
              <Link href="/professionals">
                {language === "ne"
                  ? `थप ${total - professionalServices.length} पेशेवरहरू हेर्नुहोस्`
                  : `View ${total - professionalServices.length} more professionals`}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
