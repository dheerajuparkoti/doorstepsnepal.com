import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { ProfessionalScreenSSR } from '@/components/professional/ssr/professional-screen-ssr';
import { ProfessionalScreenSkeleton } from '@/components/professional/skeleton/professional-screen-skeleton';
import { extractIdFromSlug, isValidProfessionalSlug } from '@/lib/utils/slug';

export default async function ProfessionalProfilePage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  
  // Validate slug format
  if (!isValidProfessionalSlug(slug)) {
    console.log('Invalid slug format:', slug);
    notFound();
  }
  
  // Extract ID from slug
  const professionalId = extractIdFromSlug(slug);
  console.log("PROFESSOINAL ID",professionalId);
  if (!professionalId) {
    console.log('Could not extract ID from slug:', slug);
    notFound();
  }

  return (
    <Suspense fallback={<ProfessionalScreenSkeleton />}>
      <ProfessionalScreenSSR
        professionalId={professionalId}
        showAppBar={true}
        isOwnProfile={false}  
      />
    </Suspense>
  );
}