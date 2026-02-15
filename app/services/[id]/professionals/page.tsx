import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { fetchServiceById } from '@/lib/api/services';
import { ServiceProfessionalsSection } from './ssr/service-professionals-ssr';
import { ServiceProfessionalsSkeleton } from './skeleton/service-professionals-skeleton';

interface ServiceProfessionalsPageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}



export async function generateMetadata({ params }: ServiceProfessionalsPageProps) {
  try {
    const { id } = await params;
    const serviceId = parseInt(id);
    const sId = (serviceId);
    
    if (isNaN(sId)) {
      return {
        title: 'Invalid Service | DoorStep',
      };
    }

    if (sId === 0) {
      return {
        title: 'Search Services | DoorStep',
        description: 'Search and browse service professionals',
      };
    }
    
 
    const service = await fetchServiceById(sId);
    
    if (!service) {
      return {
        title: 'Service Not Found | DoorStep',
      };
    }
    
    return {
      title: `${service.name_en} Professionals | DoorStep`,
      description: `Browse professionals offering ${service.name_en.toLowerCase()} services`,
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Service Professionals | DoorStep',
    };
  }
}

export default async function ServiceProfessionalsPage({
  params,
  searchParams,
}: ServiceProfessionalsPageProps) {
  try {

    
    const { id } = await params;
    const serviceId = parseInt(id);
    
    const queryParams = await searchParams;
    
    if (isNaN(serviceId)) {
      console.error('Invalid service ID:', serviceId);
      notFound();
    }
    
    let service = null;
    let serviceName = 'Services';
    
    // Only fetch service if id is not 0
    if (serviceId !== 0) {
      service = await fetchServiceById(serviceId);
      
      if (!service) {
        notFound();
      }
      
      serviceName = service.name_en;
    } else {
    
      const searchQuery = queryParams?.service as string || 
                         queryParams?.search as string;
      
      if (searchQuery) {
        serviceName = `Search: ${searchQuery}`;
      } else {
        serviceName = 'All Services';
      }
    }
    
    return (
      <div className="min-h-screen">
        <Suspense fallback={<ServiceProfessionalsSkeleton />}>
          <ServiceProfessionalsSection 
            serviceId={serviceId}
            serviceName={serviceName}
            searchParams={queryParams}
          />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error('Error in ServiceProfessionalsPage:', error);
    notFound();
  }
}