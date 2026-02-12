// components/professional/sections/professional-bottom-buttons.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n/context';
import { Phone, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGuestStore } from '@/stores/guest-store'; 
import { addFavorite } from '@/lib/api/favorites';
import { toast } from 'sonner';

interface ProfessionalBottomButtonsProps {
  professionalId: number;
  fullName: string;
  phoneNumber: string;
  isOwnProfile: boolean;
}

export function ProfessionalBottomButtons({
  professionalId,
  fullName,
  phoneNumber,
  isOwnProfile,
}: ProfessionalBottomButtonsProps) {
  const { language } = useI18n();
  const router = useRouter();
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);

  const firstName = fullName.split(' ')[0].slice(0, 20);

  const handleCall = () => {
    const { isGuest } = useGuestStore.getState();
    
    if (isGuest) {
      // Show guest dialog
      return;
    }

    window.location.href = `tel:+977${phoneNumber}`;
  };

  const handleFavorite = async () => {
    const { isGuest } = useGuestStore.getState();
    
    if (isGuest) {
      // Show guest dialog
      return;
    }

    if (isOwnProfile) {
      toast.info(
        language === 'ne' 
          ? 'आफ्नै प्रोफाइललाई मनपर्नेमा राख्न सकिँदैन' 
          : 'Cannot favorite your own profile'
      );
      return;
    }

    setIsFavoriteLoading(true);
    try {
      await addFavorite({
        professional_id: professionalId,
      });
      
      toast.success(
        language === 'ne' 
          ? 'प्रोफाइल मनपर्नेमा थपियो' 
          : 'Profile added to favorites'
      );
    } catch (error) {
      toast.error(
        language === 'ne' 
          ? 'मनपर्नेमा थप्न सकिएन' 
          : 'Failed to add to favorites'
      );
    } finally {
      setIsFavoriteLoading(false);
    }
  };

  return (
    <div className="flex gap-2 p-4 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Button
        className="flex-1 gap-2"
        onClick={handleCall}
      >
        <Phone className="h-4 w-4" />
        <span className="truncate">
          {language === 'ne' 
            ? `${firstName} सँग सम्पर्क गर्नुहोस्`
            : `Schedule with ${firstName}`}
        </span>
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        className="h-10 w-10"
        onClick={handleFavorite}
        disabled={isFavoriteLoading}
      >
        <Heart className={`h-4 w-4 ${isFavoriteLoading ? 'animate-pulse' : ''}`} />
      </Button>
    </div>
  );
}