// "use client";

// import Link from "next/link";
// import { useI18n } from "@/lib/i18n/context";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { professionals } from "@/lib/data/services";
// import { Star, CheckCircle, MapPin, ArrowRight, Briefcase } from "lucide-react";

// export function ProfessionalsSection() {
//   const { t, language } = useI18n();

//   return (
//     <section className="bg-muted/50 py-16 md:py-24">
//       <div className="container mx-auto px-4">
//         {/* Section Header */}
//         <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
//           <div>
//             <h2 className="text-3xl font-bold text-foreground md:text-4xl">
//               {t.professionals.title}
//             </h2>
//             <p className="mt-2 text-muted-foreground">
//               {language === "ne"
//                 ? "हाम्रा प्रमाणित र अनुभवी पेशेवरहरूसँग भेट्नुहोस्"
//                 : "Meet our verified and experienced professionals"}
//             </p>
//           </div>
//           <Button variant="outline" className="gap-2 bg-transparent" asChild>
//             <Link href="/professionals">
//               {t.professionals.viewAll}
//               <ArrowRight className="h-4 w-4" />
//             </Link>
//           </Button>
//         </div>

//         {/* Professionals Grid */}
//         <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//           {professionals.slice(0, 6).map((professional) => (
//             <Card
//               key={professional.id}
//               className="group overflow-hidden transition-all hover:shadow-lg"
//             >
//               <CardContent className="p-6">
//                 <div className="flex items-start gap-4">
//                   {/* Avatar */}
//                   <Avatar className="h-16 w-16 border-2 border-primary/20">
//                     <AvatarImage
//                       src={professional.avatar || "/placeholder.svg"}
//                       alt={professional.name}
//                     />
//                     <AvatarFallback className="bg-primary/10 text-primary text-lg">
//                       {professional.name
//                         .split(" ")
//                         .map((n) => n[0])
//                         .join("")}
//                     </AvatarFallback>
//                   </Avatar>

//                   {/* Info */}
//                   <div className="flex-1">
//                     <div className="flex items-center gap-2">
//                       <h3 className="font-semibold text-foreground">
//                         {language === "ne"
//                           ? professional.nameNe
//                           : professional.name}
//                       </h3>
//                       {professional.verified && (
//                         <CheckCircle className="h-4 w-4 fill-primary text-primary-foreground" />
//                       )}
//                     </div>

//                     <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
//                       <MapPin className="h-3 w-3" />
//                       {language === "ne"
//                         ? professional.locationNe
//                         : professional.location}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Skills */}
//                 <div className="mt-4 flex flex-wrap gap-2">
//                   {professional.skills.map((skill) => (
//                     <Badge key={skill} variant="secondary" className="text-xs">
//                       {skill}
//                     </Badge>
//                   ))}
//                 </div>

//                 {/* Stats */}
//                 <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
//                   <div className="flex items-center gap-1">
//                     <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//                     <span className="font-medium">{professional.rating}</span>
//                     <span className="text-sm text-muted-foreground">
//                       {t.professionals.rating}
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-1 text-sm text-muted-foreground">
//                     <Briefcase className="h-4 w-4" />
//                     {professional.totalJobs} {t.professionals.jobs}
//                   </div>
//                 </div>

//                 {/* CTA */}
//                 <Button className="mt-4 w-full bg-transparent" variant="outline">
//                   {t.professionals.hireNow}
//                 </Button>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

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

          <Button variant="outline" className="gap-2" asChild>
            <Link href="/professionals">
              {language === "ne" ? "सबै हेर्नुहोस्" : "View All"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Professionals Grid */}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {professionalServices.map((ps) => {
            const user = ps.professional.user;

            return (
              <Link key={ps.professional.id} href={`/professionals/${ps.professional.id}`}>
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
