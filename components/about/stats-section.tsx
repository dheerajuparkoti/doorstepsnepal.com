"use client";

import { useI18n } from '@/lib/i18n/context';
import { Users, Home, Star, Clock } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface SectionProps {
  id?: string;
}

// Custom hook for counting animation (handles complex values like "50,000+" and "4.8/5")
const useCountAnimation = (endValue: string, duration: number = 2000) => {
  const [displayValue, setDisplayValue] = useState('0');
  const countRef = useRef<HTMLDivElement>(null);
  const animationStarted = useRef(false);

  useEffect(() => {
   
    const parseValue = (val: string): { number: number; prefix: string; suffix: string } => {
      // Handle "4.8/5" format
      if (val.includes('/')) {
        const [num] = val.split('/');
        return {
          number: parseFloat(num),
          prefix: '',
          suffix: '/' + val.split('/')[1]
        };
      }
      
      // Handle "50,000+" format
      const match = val.match(/^([\d,]+)(.*)$/);
      if (match) {
        const num = parseFloat(match[1].replace(/,/g, ''));
        return {
          number: num,
          prefix: '',
          suffix: match[2] || ''
        };
      }
      
      // Handle "24/7" format
      if (val === '24/7') {
        return { number: 24, prefix: '', suffix: '/7' };
      }
      
      return { number: parseFloat(val), prefix: '', suffix: '' };
    };

    const formatValue = (num: number, originalFormat: string): string => {
      const { suffix } = parseValue(originalFormat);
      
      // Handle"4.8/5" format 
      if (originalFormat.includes('/')) {
        return num.toFixed(1) + suffix;
      }
      
      // Handle numbers with commas (50,000+)
      if (originalFormat.includes(',')) {
        return num.toLocaleString() + suffix;
      }
      
      if (originalFormat === '24/7') {
        return originalFormat;
      }
      
      return num.toFixed(1) + suffix;
    };

    const { number: targetNumber, suffix } = parseValue(endValue);
    

    if (endValue === '24/7') {
      setDisplayValue(endValue);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animationStarted.current) {
            animationStarted.current = true;
            
            let startTimestamp: number | null = null;
            const startNumber = 0;
            
            const step = (timestamp: number) => {
              if (!startTimestamp) startTimestamp = timestamp;
              const progress = Math.min((timestamp - startTimestamp) / duration, 1);
              
              // Easing function for smooth animation
              const easeOutQuart = 1 - Math.pow(1 - progress, 3);
              const currentNumber = easeOutQuart * targetNumber;
              
              setDisplayValue(formatValue(currentNumber, endValue));
              
              if (progress < 1) {
                window.requestAnimationFrame(step);
              } else {
                setDisplayValue(formatValue(targetNumber, endValue));
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

  return { displayValue, countRef };
};

// Animated Stat Component
const AnimatedStat = ({ 
  icon: Icon, 
  value, 
  label 
}: { 
  icon: any; 
  value: string; 
  label: string;
}) => {
  const { displayValue, countRef } = useCountAnimation(value);

  return (
    <div className="text-center" ref={countRef}>
      <div className="mb-4 inline-flex rounded-full bg-primary/10 p-4">
        <Icon className="h-8 w-8 text-primary" />
      </div>
      <div className="mb-2 text-4xl font-bold text-foreground">
        {displayValue}
      </div>
      <div className="text-muted-foreground">
        {label}
      </div>
    </div>
  );
};

export default function StatsSection({ id }: SectionProps) {
  const { t } = useI18n();

  const stats = [
    {
      icon: Users,
      value: '1,500+',
      label: t.about.happyProfessionals,
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
          {stats.map((stat, index) => (
            <AnimatedStat
              key={index}
              icon={stat.icon}
              value={stat.value}
              label={stat.label}
            />
          ))}
        </div>
      </div>
    </section>
  );
}