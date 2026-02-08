import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { fetchServiceById } from '@/lib/api/services';
import { ServiceProfessionalsSection } from './ssr/service-professionals-ssr';
import { ServiceProfessionalsSkeleton } from './skeleton/service-professionals-skeleton';

interface ServiceProfessionalsPageProps {
  params: Promise<{
    serviceId: string;
  }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: ServiceProfessionalsPageProps) {
  const { serviceId } = await params;
  const id = parseInt(serviceId);
  
  const service = await fetchServiceById(id);
  
  if (!service) {
    return {
      title: 'Service Not Found | DoorStep',
    };
  }
  
  return {
    title: `${service.name_en} Professionals | DoorStep`,
    description: `Browse professionals offering ${service.name_en.toLowerCase()} services`,
  };
}

export default async function ServiceProfessionalsPage(
  { params }: ServiceProfessionalsPageProps
) {
  const { serviceId } = await params;
  const id = parseInt(serviceId);
  
  if (isNaN(id)) {
    notFound();
  }
  
  const service = await fetchServiceById(id);
  
  if (!service) {
    notFound();
  }
  
  return (
    <div className="min-h-screen">
      <Suspense fallback={<ServiceProfessionalsSkeleton />}>
        <ServiceProfessionalsSection 
          serviceId={id}
          serviceName={service.name_en}
        />
      </Suspense>
    </div>
  );
}