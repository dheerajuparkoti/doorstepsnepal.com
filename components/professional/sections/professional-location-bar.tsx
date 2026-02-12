// components/professional/sections/professional-location-bar.tsx
'use client';

import { MapPin } from 'lucide-react';
import { useI18n } from '@/lib/i18n/context';

interface ProfessionalLocationBarProps {
  location: string;
}

export function ProfessionalLocationBar({ location }: ProfessionalLocationBarProps) {
  const { language } = useI18n();

  return (
    <div className="w-full bg-muted/30 px-4 py-2">
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-muted-foreground" />
        <p className="text-sm text-muted-foreground truncate">
          {location}
        </p>
      </div>
    </div>
  );
}