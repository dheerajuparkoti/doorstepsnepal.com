"use client";

import { useI18n } from '@/lib/i18n/context';
import { id } from 'date-fns/locale/id';
import { Users, Home, Star, Clock } from 'lucide-react';
interface SectionProps {
  id?: string;
}
export default function StatsSection({ id }: SectionProps) {
  const { t } = useI18n();

  const stats = [
    {
      icon: Users,
      value: '50,000+',
      label: t.about.statsCustomers,
    },
    {
      icon: Home,
      value: '200,000+',
      label: t.about.statsServices,
    },
    {
      icon: Star,
      value: '4.8/5',
      label: t.about.statsRating,
    },
    {
      icon: Clock,
      value: '24/7',
      label: t.about.statsSupport,
    },
  ];

  return (
    <section id={id} className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className="mb-4 inline-flex rounded-full bg-primary/10 p-4">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <div className="mb-2 text-4xl font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}