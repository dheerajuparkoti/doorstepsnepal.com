'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useI18n } from '@/lib/i18n/context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useOtherUserStore } from '@/stores/other-user-store';
import { ProfileHeader } from './sections/header';
import { ProfileLocationBar } from './sections/location';
import { ProfileContactInfo } from './sections/contact';

interface CustomerProfileViewerProps {
  showAppBar?: boolean;
}

export function CustomerProfileViewer({ showAppBar = false }: CustomerProfileViewerProps) {
  const { language } = useI18n();
  const router = useRouter();
  const params = useParams();
  const customerId = params.customerId ? parseInt(params.customerId as string) : null;
  
  const { user, isLoading, error, fetchUserById, clearUser } = useOtherUserStore();

  useEffect(() => {
    if (customerId) {
      fetchUserById(customerId);
    }
    
    return () => {
      clearUser();
    };
  }, [customerId, fetchUserById, clearUser]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Card className="p-6 max-w-md text-center">
          <h2 className="text-xl font-bold mb-2">
            {language === 'ne' ? 'प्रोफाइल फेला परेन' : 'Profile Not Found'}
          </h2>
          <p className="text-muted-foreground mb-4">
            {error || (language === 'ne' 
              ? 'यो ग्राहकको प्रोफाइल उपलब्ध छैन'
              : 'This customer profile is not available')}
          </p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {language === 'ne' ? 'फर्कनुहोस्' : 'Go Back'}
          </Button>
        </Card>
      </div>
    );
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
              {language === 'ne' ? 'ग्राहक प्रोफाइल' : 'Customer Profile'}
            </h1>
            <div className="w-10" />
          </div>
        </header>
      )}

      {/* Main Content - Reuse your existing sections but make them read-only */}
      <div className="flex-1 overflow-y-auto">
        <ProfileHeader user={user} isReadOnly={true} />
        <ProfileLocationBar user={user} isReadOnly={true} />
        <ProfileContactInfo user={user} isReadOnly={true} />
      </div>
    </div>
  );
}