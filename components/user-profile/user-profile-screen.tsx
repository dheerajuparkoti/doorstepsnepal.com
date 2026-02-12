'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n/context';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

// Sections
import { ProfileHeader } from './sections/header';
import { ProfileLocationBar } from './sections/location';
import { ProfileContactInfo } from './sections/contact';
import { ProfileActions } from './sections/actions';

// Skeletons
import { ProfileScreenSkeleton } from './skeleton/user-profile-screen';

// Stores
import { useUser, useUserLoading, useRefreshUser, useUserStore } from '@/stores/user-store';

interface ProfileScreenClientProps {
  showAppBar?: boolean;
}

export function ProfileScreenClient({ showAppBar = false }: ProfileScreenClientProps) {
  const { language } = useI18n();
  const router = useRouter();
  
  const user = useUser();
  const isLoading = useUserLoading();
  const refreshUser = useRefreshUser();
  const {isInitialized } = useUserStore();
  
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (!isInitialized) {
        setIsRefreshing(true);
        await refreshUser();
        setIsRefreshing(false);
      }
    };
    
    fetchUser();
  }, [isInitialized, refreshUser]);

  if (isLoading || !user) {
    return <ProfileScreenSkeleton showAppBar={showAppBar} />;
  }

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
      <div className="flex-1 overflow-y-auto">
        {/* Pull to refresh indicator */}
        {isRefreshing && (
          <div className="flex justify-center py-2">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}

        <ProfileHeader user={user} />
        <ProfileLocationBar user={user} />
        <ProfileContactInfo user={user} />
        <ProfileActions user={user} />
      </div>
    </div>
  );
}