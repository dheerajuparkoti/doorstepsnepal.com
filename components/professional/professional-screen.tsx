
'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n/context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Info, Wrench, Clock, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

// Sections 
import { ProfessionalBottomButtons } from './sections/professional-bottom-button';

// Stores
import { useProfessionalViewStore } from '@/stores/professional-view-store';
import type { ProfessionalProfile } from '@/lib/data/professional';

interface ProfessionalScreenProps {
  professionalId: number;
  showAppBar?: boolean;
  isOwnProfile?: boolean;
  initialProfile?: ProfessionalProfile;
  
  headerCarousel: React.ReactNode;
  locationBar: React.ReactNode;
  aboutTab: React.ReactNode;
  servicesTab: React.ReactNode;
  availabilityTab: React.ReactNode;
  reviewsTab: React.ReactNode;
}

export function ProfessionalScreen({
  professionalId,
  showAppBar = false,
  isOwnProfile = false,
  initialProfile,
  headerCarousel,
  locationBar,
  aboutTab,
  servicesTab,
  availabilityTab,
  reviewsTab,
}: ProfessionalScreenProps) {
  const { language } = useI18n();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('about');
  const [isScrolled, setIsScrolled] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const { getProfessional } = useProfessionalViewStore();
  const professional = getProfessional(professionalId) || initialProfile;

  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const scrollTop = contentRef.current.scrollTop;
        setIsScrolled(scrollTop > 300);
      }
    };

    const currentRef = contentRef.current;
    currentRef?.addEventListener('scroll', handleScroll);
    return () => currentRef?.removeEventListener('scroll', handleScroll);
  }, []);

  if (!professional) {
    return null;
  }

  const phoneNumber = professional.phone_number || professional.user?.phone_number || '9851407706';

  const tabs = [
    {
      value: 'about',
      label: language === 'ne' ? 'जानकारी' : 'About',
      icon: Info,
      content: aboutTab
    },
    {
      value: 'services',
      label: language === 'ne' ? 'सेवाहरू' : 'Services',
      icon: Wrench,
      content: servicesTab
    },
    {
      value: 'availability',
      label: language === 'ne' ? 'उपलब्धता' : 'Availability',
      icon: Clock,
      content: availabilityTab
    },
    {
      value: 'reviews',
      label: language === 'ne' ? 'समीक्षा' : 'Reviews',
      icon: Star,
      content: reviewsTab
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* App Bar */}
      {showAppBar && (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-14 items-center px-4">
            <Button
              variant="ghost"
              size="icon"
              className="mr-2"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold flex-1 text-center">
              {language === 'ne' ? 'प्रोफाइल' : 'Profile'}
            </h1>
            <div className="w-10" />
          </div>
        </header>
      )}

      {/* Main Content */}
      <div 
        ref={contentRef}
        className="flex-1 overflow-y-auto"
      >
        {/* Header Carousel - Now passed as prop */}
        {headerCarousel}

        {/* Location Bar - Now passed as prop */}
        {locationBar}

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className={cn(
            "sticky top-0 z-40 bg-background transition-shadow",
            isScrolled && "shadow-md"
          )}>
            <TabsList className="w-full h-auto p-0 bg-transparent border-b rounded-none">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
                >
                  <div className="flex items-center gap-2 py-2">
                    <tab.icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="mt-0">
              {tab.content}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Bottom Buttons */}
      <ProfessionalBottomButtons
        professionalId={professionalId}
        fullName={professional.user.full_name}
        phoneNumber={phoneNumber}
        isOwnProfile={isOwnProfile}
      />
    </div>
  );
}