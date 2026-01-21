"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Star, Clock, CheckCircle } from "lucide-react";
import type { Service, Professional } from "@/lib/data/services";

interface ServiceCardProps {
  service: Service;
  professional?: Professional;
  showProfessional?: boolean;
}

export function ServiceCard({ service, professional, showProfessional = true }: ServiceCardProps) {
  const { language } = useI18n();

  return (
    <Card className="group overflow-hidden transition-all hover:border-primary hover:shadow-lg">
      {/* Service Image */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
          <span className="text-4xl font-bold text-primary/30">
            {(language === "ne" ? service.nameNe : service.name)[0]}
          </span>
        </div>
        {service.rating >= 4.5 && (
          <Badge className="absolute right-2 top-2 gap-1 bg-yellow-500 text-white">
            <Star className="h-3 w-3 fill-current" />
            Top Rated
          </Badge>
        )}
      </div>

      <CardContent className="p-4">
        {/* Service Info */}
        <h3 className="font-semibold text-foreground line-clamp-1">
          {language === "ne" ? service.nameNe : service.name}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
          {language === "ne" ? service.descriptionNe : service.description}
        </p>

        {/* Price & Rating */}
        <div className="mt-3 flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-primary">
              Rs. {service.price.toLocaleString()}
            </span>
            <span className="text-sm text-muted-foreground">
              {" "}/ {service.priceUnit}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{service.rating}</span>
            <span className="text-sm text-muted-foreground">
              ({service.reviewCount})
            </span>
          </div>
        </div>

        {/* Duration */}
        <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{service.duration}</span>
        </div>

        {/* Professional Info (if available) */}
        {showProfessional && professional && (
          <div className="mt-4 flex items-center gap-3 border-t border-border pt-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src={professional.avatar || "/placeholder.svg"} />
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {professional.name.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <p className="text-sm font-medium truncate">
                  {language === "ne" ? professional.nameNe : professional.name}
                </p>
                {professional.verified && (
                  <CheckCircle className="h-3 w-3 shrink-0 fill-primary text-primary-foreground" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {professional.totalJobs} {language === "ne" ? "कामहरू" : "jobs"}
              </p>
            </div>
          </div>
        )}

        {/* Book Now Button */}
        <Button className="mt-4 w-full" asChild>
          <Link href={`/services/book/${service.id}`}>
            {language === "ne" ? "बुक गर्नुहोस्" : "Book Now"}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
