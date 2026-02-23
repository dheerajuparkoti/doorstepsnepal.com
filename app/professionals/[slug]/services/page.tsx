import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { fetchServicesByProfessionalId } from '@/lib/api/professional-services';
import { ProfessionalServicesClient } from './professional-services-client';
import { ProfessionalServicesSkeleton } from './professional-services-skeleton';
import { extractIdFromSlug } from '@/lib/utils/slug';

interface ProfessionalServicesPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProfessionalServicesPage({ 
  params 
}: ProfessionalServicesPageProps) {
  const { slug } = await params;
  
  const professionalId = extractIdFromSlug(slug);
  
  if (!professionalId) {
    notFound();
  }


  const professionalServices = await fetchServicesByProfessionalId(professionalId);

  if (!professionalServices || professionalServices.length === 0) {
    notFound();
  }

  const professionalName =
    professionalServices[0]?.professional?.user?.full_name || 'Professional';

  return (
    <Suspense fallback={<ProfessionalServicesSkeleton />}>
      <ProfessionalServicesClient
        professionalId={professionalId}
        professionalName={professionalName}
        services={professionalServices}
      />
    </Suspense>
  );
}