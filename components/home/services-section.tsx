"use client";

import React from "react"

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { serviceCategories } from "@/lib/data/services";
import {
  Zap,
  Droplets,
  Sparkles,
  Scissors,
  Wrench,
  Users,
  ArrowRight,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Zap,
  Droplets,
  Sparkles,
  Scissors,
  Wrench,
  Users,
};

export function ServicesSection() {
  const { t, language } = useI18n();

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">
              {t.services.popular}
            </h2>
            <p className="mt-2 text-muted-foreground">
              {language === "ne"
                ? "तपाईंको घरेलु आवश्यकताहरूको लागि विश्वसनीय सेवाहरू"
                : "Reliable services for all your home needs"}
            </p>
          </div>
          <Button variant="outline" className="gap-2 bg-transparent" asChild>
            <Link href="/services">
              {t.services.viewAll}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Services Grid */}
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {serviceCategories.map((category) => {
            const IconComponent = iconMap[category.icon] || Wrench;
            return (
              <Link key={category.id} href={`/services/${category.id}`}>
                <Card className="group h-full cursor-pointer transition-all hover:border-primary hover:shadow-md">
                  <CardContent className="flex flex-col items-center p-6 text-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <IconComponent className="h-7 w-7" />
                    </div>
                    <h3 className="font-semibold text-foreground">
                      {language === "ne" ? category.nameNe : category.name}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                      {language === "ne" ? category.descriptionNe : category.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
