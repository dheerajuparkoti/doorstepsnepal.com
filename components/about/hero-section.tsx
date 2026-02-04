"use client";

import Image from 'next/image';
import { useI18n } from '@/lib/i18n/context';
interface SectionProps {
  id?: string;
}
export default function HeroSection({ id }: SectionProps) {
  const { t } = useI18n();

  return (
    <section id={id} className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10 py-20 md:py-32">
      <div className="container relative z-10 mx-auto px-4">
        <div className="grid items-center gap-12 md:grid-cols-2">
          {/* Left Content */}
          <div>
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
              {t.about.heroTitle}
            </h1>
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              {t.about.heroDescription}
            </p>
            
            <div className="flex flex-wrap gap-4">
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <div className="text-2xl font-bold text-primary">5,000+</div>
                <div className="text-sm text-muted-foreground">{t.about.happyCustomers}</div>
              </div>
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <div className="text-2xl font-bold text-primary">200+</div>
                <div className="text-sm text-muted-foreground">{t.about.verifiedPros}</div>
              </div>
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <div className="text-2xl font-bold text-primary">50+</div>
                <div className="text-sm text-muted-foreground">{t.about.services}</div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative h-80 md:h-96 lg:h-[500px]">
         <Image
  src="/about/team-hero.jpg"
  alt="Doorstep Services Team"
  priority // Keep this
  fill
  sizes="(max-width: 768px) 100vw, 50vw" // Add this to help the browser choose size
  className="rounded-2xl object-cover shadow-2xl bg-muted" // Add bg-muted for a placeholder color
/>
          </div>
        </div>
      </div>
      
      {/* Background Pattern */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}