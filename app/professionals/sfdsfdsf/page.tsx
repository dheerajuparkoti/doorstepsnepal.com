import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { fetchProfessionalProfile } from '@/lib/api/professional-profiles';
import { ProfessionalDetailSection } from './ssr/professional-detail-ssr';
import { ProfessionalDetailSkeleton } from './skeleton/professional-detail-skeleton';

interface ProfessionalDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: ProfessionalDetailPageProps) {
  const { id } = await params;
  const professionalId = parseInt(id);
  
  const profile = await fetchProfessionalProfile(professionalId);
  
  if (!profile) {
    return {
      title: 'Professional Not Found | DoorStep',
    };
  }
  
  return {
    title: `${profile.user.full_name} | DoorStep Professional`,
    description: `View ${profile.user.full_name}'s profile, services, and expertise`,
  };
}

export default async function ProfessionalDetailPage({
  params,
}: ProfessionalDetailPageProps) {
  const { id } = await params;
  const professionalId = parseInt(id);
  
  if (isNaN(professionalId)) {
    notFound();
  }
  
  const profile = await fetchProfessionalProfile(professionalId);
  
  if (!profile) {
    notFound();
  }
  
  return (
    <div className="min-h-screen">
      <Suspense fallback={<ProfessionalDetailSkeleton />}>
        <ProfessionalDetailSection 
          professionalId={professionalId}
          professionalName={profile.user.full_name}
        />
      </Suspense>
    </div>
  );
}