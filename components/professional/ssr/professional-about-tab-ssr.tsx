// components/professional/ssr/professional-about-tab-ssr.tsx
import { Suspense } from 'react';
import { ProfessionalAboutTab } from '../sections/professional-about-tab';
import { ProfessionalAboutTabSkeleton } from '../skeleton/professional-about-tab-skeleton';
import { fetchProfessionalProfile } from '@/lib/api/professional-profiles';
import { fetchProfessionalServiceAreas } from '@/lib/api/professional-profiles';
import { notFound } from 'next/navigation';

interface ProfessionalAboutTabSSRProps {
  professionalId: number;
}

export async function ProfessionalAboutTabSSR({ 
  professionalId 
}: ProfessionalAboutTabSSRProps) {
  
  const [profile, serviceAreas] = await Promise.all([
    fetchProfessionalProfile(professionalId),
    fetchProfessionalServiceAreas(professionalId)
  ]);

  if (!profile) {
    notFound();
  }

  const fullName = profile.user.full_name;
  const profession = profile.skill || 'Professional';
  const experience = `${profile.experience}+ years`;

  return (
    <Suspense fallback={<ProfessionalAboutTabSkeleton />}>
      <ProfessionalAboutTab
        fullName={fullName}
        profession={profession}
        experience={experience}
        serviceAreas={serviceAreas}
      />
    </Suspense>
  );
}