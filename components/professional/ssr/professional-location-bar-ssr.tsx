// components/professional/ssr/professional-location-bar-ssr.tsx
import { Suspense } from 'react';
import { ProfessionalLocationBar } from '../sections/professional-location-bar';
import { ProfessionalLocationBarSkeleton } from '../skeleton/professional-location-bar-skeleton';
import { fetchProfessionalProfile } from '@/lib/api/professional-profiles';
import { notFound } from 'next/navigation';

interface ProfessionalLocationBarSSRProps {
  professionalId: number;
}

export async function ProfessionalLocationBarSSR({ 
  professionalId 
}: ProfessionalLocationBarSSRProps) {
  
  const profile = await fetchProfessionalProfile(professionalId);

  if (!profile) {
    notFound();
  }

  // Format location from addresses
  let location = 'Location not available';
  
  if (profile.addresses && profile.addresses.length > 0) {
    const addr = profile.addresses[0];
    location = `${addr.street_address}, ${addr.municipality}-${addr.ward_no}, ${addr.province}, ${addr.district}`;
  }

  return (
    <Suspense fallback={<ProfessionalLocationBarSkeleton />}>
      <ProfessionalLocationBar location={location} />
    </Suspense>
  );
}