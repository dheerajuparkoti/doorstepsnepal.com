import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { fetchProfessionalServiceById } from '@/lib/api/professional-services';
import { SingleProfessionalServiceClient } from './single-service-client';
import { ProfessionalServicesSkeleton } from '../professional-services-skeleton';
import { extractIdFromSlug, extractIdFromServiceSlug } from '@/lib/utils/slug';

interface SingleServicePageProps {
  params: Promise<{
    slug: string;          
    serviceSlug: string;    
  }>;
}

export default async function SingleServicePage({ 
  params 
}: SingleServicePageProps) {
  const { slug, serviceSlug } = await params;
  
  // Extract IDs from slugs
  const professionalId = extractIdFromSlug(slug);
  const serviceId = extractIdFromServiceSlug(serviceSlug);

  if (!professionalId || !serviceId) {
    console.log('Invalid IDs - showing 404');
    notFound();
  }

  // Fetch only the specific service
  const service = await fetchProfessionalServiceById(serviceId);

  if (!service) {
    notFound();
  }

  // Verify this service belongs to the professional
  if (service.professional_id !== professionalId) {
    console.log('Service does not belong to professional - showing 404');
    notFound();
  }

  const professionalName = service.professional?.user?.full_name || 'Professional';

  return (
    <Suspense fallback={<ProfessionalServicesSkeleton />}>
      <SingleProfessionalServiceClient
        professionalId={professionalId}
        professionalName={professionalName}
        service={service}
      />
    </Suspense>
  );
}