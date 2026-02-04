"use client";


import { useI18n } from '@/lib/i18n/context';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Eye, Heart } from 'lucide-react';
interface SectionProps {
  id?: string;
}
export default function MissionVisionSection({ id }: SectionProps) {
  const { t } = useI18n();

  const items = [
    {
      icon: Target,
      title: t.about.missionTitle,
      description: t.about.missionDescription,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Eye,
      title: t.about.visionTitle,
      description: t.about.visionDescription,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: Heart,
      title: t.about.valuesTitle,
      description: t.about.valuesDescription,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ];

  return (
    <section id={id} className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            {t.about.missionVisionTitle}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            {t.about.missionVisionSubtitle}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className={`mb-6 inline-flex rounded-full p-3 ${item.bgColor}`}>
                    <Icon className={`h-8 w-8 ${item.color}`} />
                  </div>
                  <h3 className="mb-4 text-2xl font-bold text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {item.description}
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