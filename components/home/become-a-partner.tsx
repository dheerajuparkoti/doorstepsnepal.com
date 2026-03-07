"use client";

import { useI18n } from "@/lib/i18n/context";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Info } from "lucide-react";
import Link from "next/link";

export function BecomeAPartnerSection() {
  const { language } = useI18n();

  return (
    <section className="py-2 md:py-4">
      <div className="container mx-auto px-4">
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">
              {language === "ne" ? "आज नै भागीदार बन्नुहोस्" : "Become a Partner Today"}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              {language === "ne" 
                ? "हाम्रो प्रगतिशील प्रणाली सँग जोडिनुहोस् र आफ्नो कमाई बढाउनुहोस्। कम सेवाहरूमा उच्च कमाई, धेरै सेवाहरूमा कम शुल्क।"
                : "Join our progressive system and maximize your earnings. Higher earnings on fewer services, lower fees on more services."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/login" 
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
              >
                {language === "ne" ? "प्रोफेशनल बन्नुहोस्" : "Become a Professional"}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link 
                href="/privacy-policy/professional"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-input bg-background font-medium rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                {language === "ne" ? "अधिक जान्नुहोस्" : "Learn More"}
                <Info className="h-4 w-4" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}