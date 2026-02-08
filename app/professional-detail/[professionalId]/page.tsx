import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { fetchProfessionalProfile } from '@/lib/api/professional-profiles';
import { ProfessionalDetailSection } from './ssr/professional-detail-ssr';
import { ProfessionalDetailSkeleton } from './skeleton/professional-detail-skeleton';

interface ProfessionalDetailPageProps {
  params: Promise<{
    professionalId: string;
  }>;
}

export async function generateMetadata({ params }: ProfessionalDetailPageProps) {
  const { professionalId } = await params;
  const id = parseInt(professionalId);
  
  const profile = await fetchProfessionalProfile(id);
  
  if (!profile) {
    return {
      title: 'Professional Not Found | DoorStep',
    };
  }
  
  return {
    title: `${profile.user.full_name} | DoorStep`,
    description: `View ${profile.user.full_name}'s professional profile and services`,
  };
}

export default async function ProfessionalDetailPage(
  { params }: ProfessionalDetailPageProps
) {
  const { professionalId } = await params;
  const id = parseInt(professionalId);
  
  if (isNaN(id)) {
    notFound();
  }
  
  const profile = await fetchProfessionalProfile(id);
  
  if (!profile) {
    notFound();
  }
  
  return (
    <div className="min-h-screen">
      <Suspense fallback={<ProfessionalDetailSkeleton />}>
        <ProfessionalDetailSection 
          professionalId={id}
          professionalName={profile.user.full_name}
        />
      </Suspense>
    </div>
  );
}