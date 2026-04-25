

import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { ProfessionalScreenSSR } from '@/components/professional/ssr/professional-screen-ssr';
import { ProfessionalScreenSkeleton } from '@/components/professional/skeleton/professional-screen-skeleton';

export default async function ViewProfessionalPage({ 
  params 
}: { 
  params: Promise<{ professionalId: string }> 
}) {

  const { professionalId } = await params;
  

  
  const professionalIdNum = parseInt(professionalId);
  
  if (isNaN(professionalIdNum)) {
    // //console.log(' Invalid ID:', professionalId);
    notFound();
  }

  
  return (
    <Suspense fallback={<ProfessionalScreenSkeleton />}>
      <ProfessionalScreenSSR
        professionalId={professionalIdNum}
        showAppBar={true}
        isOwnProfile={false}
      />
    </Suspense>
  );
}