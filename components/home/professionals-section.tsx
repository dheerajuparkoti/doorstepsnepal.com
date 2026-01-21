"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { professionals } from "@/lib/data/services";
import { Star, CheckCircle, MapPin, ArrowRight, Briefcase } from "lucide-react";

export function ProfessionalsSection() {
  const { t, language } = useI18n();

  return (
    <section className="bg-muted/50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">
              {t.professionals.title}
            </h2>
            <p className="mt-2 text-muted-foreground">
              {language === "ne"
                ? "हाम्रा प्रमाणित र अनुभवी पेशेवरहरूसँग भेट्नुहोस्"
                : "Meet our verified and experienced professionals"}
            </p>
          </div>
          <Button variant="outline" className="gap-2 bg-transparent" asChild>
            <Link href="/professionals">
              {t.professionals.viewAll}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Professionals Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {professionals.slice(0, 6).map((professional) => (
            <Card
              key={professional.id}
              className="group overflow-hidden transition-all hover:shadow-lg"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <Avatar className="h-16 w-16 border-2 border-primary/20">
                    <AvatarImage
                      src={professional.avatar || "/placeholder.svg"}
                      alt={professional.name}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary text-lg">
                      {professional.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">
                        {language === "ne"
                          ? professional.nameNe
                          : professional.name}
                      </h3>
                      {professional.verified && (
                        <CheckCircle className="h-4 w-4 fill-primary text-primary-foreground" />
                      )}
                    </div>

                    <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {language === "ne"
                        ? professional.locationNe
                        : professional.location}
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {professional.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>

                {/* Stats */}
                <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{professional.rating}</span>
                    <span className="text-sm text-muted-foreground">
                      {t.professionals.rating}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Briefcase className="h-4 w-4" />
                    {professional.totalJobs} {t.professionals.jobs}
                  </div>
                </div>

                {/* CTA */}
                <Button className="mt-4 w-full bg-transparent" variant="outline">
                  {t.professionals.hireNow}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
