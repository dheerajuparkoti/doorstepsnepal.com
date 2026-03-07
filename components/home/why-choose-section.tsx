
"use client";
import { useI18n } from "@/lib/i18n/context";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ShieldCheck, 
  Wallet, 
  Clock, 
  ThumbsUp, 
  MousePointer2,
  Grid3x3,
  Settings,
  Accessibility,
  HeadphonesIcon,
  Award,
  HeartHandshake,
  AlertCircle 
} from "lucide-react";

interface SectionProps {
  id?: string;
}

export function WhyChooseSection({ id }: SectionProps) {
  const { t } = useI18n();

  const features = [
    {
      icon: ShieldCheck,
      title: t.whyChoose.verified,
      description: t.whyChoose.verifiedDesc,
    },
    {
      icon: Wallet,
      title: t.whyChoose.affordable,
      description: t.whyChoose.affordableDesc,
    },
    {
      icon: Clock,
      title: t.whyChoose.onTime,
      description: t.whyChoose.onTimeDesc,
    },
    {
      icon: ThumbsUp,
      title: t.whyChoose.satisfaction,
      description: t.whyChoose.satisfactionDesc,
    },
    {
      icon: MousePointer2,
      title: t.whyChoose.easyBooking,
      description: t.whyChoose.easyBookingDesc,
    },
    {
      icon: Grid3x3,
      title: t.whyChoose.variety,
      description: t.whyChoose.varietyDesc,
    },
    {
      icon: Settings,
      title: t.whyChoose.customized,
      description: t.whyChoose.customizedDesc,
    },
    {
      icon: Accessibility,
      title: t.whyChoose.accessibility,
      description: t.whyChoose.accessibilityDesc,
    },
    {
      icon: HeadphonesIcon,
      title: t.whyChoose.support,
      description: t.whyChoose.supportDesc,
    },
    {
      icon: Award,
      title: t.whyChoose.quality,
      description: t.whyChoose.qualityDesc,
    },
    {
      icon: HeartHandshake,
      title: t.whyChoose.trusted,
      description: t.whyChoose.trustedDesc,
    },
    {
      icon: AlertCircle,
      title: t.whyChoose.emergency,
      description: t.whyChoose.emergencyDesc,
    },
  ];

  return (
    <section id={id} className="py-2 md:py-4">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            {t.whyChoose.title}
          </h2>
          <p className="mt-4 text-muted-foreground">
            जान्नुहोस् किन हजारौं ग्राहकहरू डोरस्टेप नेपाललाई विश्वास गर्छन्
          </p>
        </div>

        {/* Features Grid */}
        <div className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="group transition-all hover:border-primary hover:shadow-md"
              >
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}