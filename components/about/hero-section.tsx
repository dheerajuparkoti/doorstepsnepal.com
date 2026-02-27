"use client";

import Image from 'next/image';
import { useI18n } from '@/lib/i18n/context';
import { useState, useEffect, useRef } from 'react';

interface SectionProps {
  id?: string;
}

// Custom hook for counting animation
const useCountAnimation = (endValue: number, suffix: string = '', duration: number = 2000) => {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLDivElement>(null);
  const animationStarted = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animationStarted.current) {
            animationStarted.current = true;
            
            let startTimestamp: number | null = null;
            const startValue = 0;
            
            const step = (timestamp: number) => {
              if (!startTimestamp) startTimestamp = timestamp;
              const progress = Math.min((timestamp - startTimestamp) / duration, 1);
              
              // Easing function for smooth animation
              const easeOutQuart = 1 - Math.pow(1 - progress, 3);
              const currentValue = Math.floor(easeOutQuart * endValue);
              
              setCount(currentValue);
              
              if (progress < 1) {
                window.requestAnimationFrame(step);
              } else {
                setCount(endValue);
              }
            };
            
            window.requestAnimationFrame(step);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => {
      if (countRef.current) {
        observer.unobserve(countRef.current);
      }
    };
  }, [endValue, duration]);

  return { count, countRef };
};

// Animated Stat Card Component
const AnimatedStatCard = ({ 
  value, 
  label, 
  suffix = '' 
}: { 
  value: number; 
  label: string; 
  suffix?: string 
}) => {
  const { count, countRef } = useCountAnimation(value, suffix);

  return (
    <div ref={countRef} className="rounded-lg bg-white p-4 shadow-sm min-w-[120px]">
      <div className="text-2xl font-bold text-primary">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
};

export default function HeroSection({ id }: SectionProps) {
  const { t } = useI18n();

  // Stats configuration
  const stats = [
    { value: 7000, label: t.about.happyCustomers, suffix: '+' },
    { value: 1500, label: t.about.verifiedPros, suffix: '+' },
    { value: 500, label: t.about.services, suffix: '+' }
  ];

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
            
            {/* Animated Stats */}
            <div className="flex flex-wrap gap-4">
              {stats.map((stat, index) => (
                <AnimatedStatCard 
                  key={index}
                  value={stat.value}
                  label={stat.label}
                  suffix={stat.suffix}
                />
              ))}
            </div>
          </div>

          {/* Right Image */}
          <div className="relative h-80 md:h-96 lg:h-[500px]">
            <Image
              src="/about/team-hero.jpg"
              alt="Doorstep Services Team"
              priority 
              fill
              sizes="(max-width: 768px) 100vw, 50vw" 
              className="rounded-2xl object-cover shadow-2xl bg-muted" 
            />
          </div>
        </div>
      </div>
      
      {/* Background Pattern */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}