"use client";

import { useI18n } from "@/lib/i18n/context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { promotions } from "@/lib/data/services";
import { Percent, ArrowRight, Sparkles, Gift, Tag } from "lucide-react";

const promoIcons = [Sparkles, Gift, Tag];

export function PromotionsSection() {
  const { t, language } = useI18n();

  return (
    <section className="bg-muted/50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            {t.promotions.title}
          </h2>
          <p className="mt-2 text-muted-foreground">
            {language === "ne"
              ? "तपाईंको पहिलो बुकिङमा विशेष छुटहरू पाउनुहोस्"
              : "Get special discounts on your first booking"}
          </p>
        </div>

        {/* Promotions Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {promotions.map((promo, index) => {
            const Icon = promoIcons[index % promoIcons.length];
            return (
              <Card
                key={promo.id}
                className="group relative overflow-hidden transition-all hover:shadow-lg"
              >
                <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-primary/10 transition-transform group-hover:scale-150" />
                <CardContent className="relative p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <Badge className="gap-1 bg-primary text-primary-foreground">
                      <Percent className="h-3 w-3" />
                      {promo.discount}% {t.promotions.off}
                    </Badge>
                  </div>

                  <h3 className="mb-2 text-xl font-semibold text-foreground">
                    {language === "ne" ? promo.titleNe : promo.title}
                  </h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    {language === "ne" ? promo.descriptionNe : promo.description}
                  </p>

                  <Button className="w-full gap-2">
                    {t.promotions.bookNow}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
