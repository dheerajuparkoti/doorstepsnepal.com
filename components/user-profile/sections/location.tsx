'use client';

import { MapPin } from 'lucide-react';
import { useI18n } from '@/lib/i18n/context';
import type { User } from '@/lib/data/user';

interface ProfileLocationBarProps {
  user: User;
}

export function ProfileLocationBar({ user }: ProfileLocationBarProps) {
  const { language } = useI18n();

  const location = user.full_address || (language === 'ne' ? 'ठेगाना उपलब्ध छैन' : 'Location not available');

  return (
    <div className="w-full bg-muted/30 px-4 py-3 border-y">
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        <p className="text-sm text-muted-foreground truncate">
          {location}
        </p>
      </div>
    </div>
  );
}