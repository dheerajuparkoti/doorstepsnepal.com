// components/professional/ssr/professional-availability-tab-ssr.tsx
import { Suspense } from 'react';
import { ProfessionalAvailabilityTab } from '../sections/professional-availability-tab';
import { ProfessionalAvailabilityTabSkeleton } from '../skeleton/professional-service-availability-skeleton';
import { serviceAvailabilityApi } from '@/lib/api/service-availability';

interface ProfessionalAvailabilityTabSSRProps {
  professionalId: number;
}

export async function ProfessionalAvailabilityTabSSR({ 
  professionalId 
}: ProfessionalAvailabilityTabSSRProps) {
  
  try {
    const response = await serviceAvailabilityApi.getServiceAvailabilities(professionalId, {
      limit: 100
    });
    
    const availabilities = response.items || [];

    return (
      <Suspense fallback={<ProfessionalAvailabilityTabSkeleton />}>
        <ProfessionalAvailabilityTab
          professionalId={professionalId}
          availabilities={availabilities}
        />
      </Suspense>
    );
  } catch (error) {
    // Return empty array on error
    return (
      <Suspense fallback={<ProfessionalAvailabilityTabSkeleton />}>
        <ProfessionalAvailabilityTab
          professionalId={professionalId}
          availabilities={[]}
        />
      </Suspense>
    );
  }
}