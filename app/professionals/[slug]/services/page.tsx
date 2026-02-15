
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { fetchProfessionalServices } from '@/lib/api/professional-services';
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
  
  // Extract professional ID from slug (e.g., "alex-uparkoti-16" → 16)
  const professionalId = extractIdFromSlug(slug);
  
  if (!professionalId) {
    notFound();
  }

  // Fetch all services for this professional
  const data = await fetchProfessionalServices(1, 1000);
  const professionalServices = data?.professional_services?.filter(
    (ps: any) => ps.professional_id === professionalId
  ) || [];

  if (professionalServices.length === 0) {
    notFound();
  }

  // Get professional name
  const professionalName = professionalServices[0]?.professional?.user?.full_name || 'Professional';

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