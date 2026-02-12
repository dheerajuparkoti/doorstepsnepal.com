// components/professional/ssr/professional-services-tab-ssr.tsx
import { Suspense } from 'react';
import { ProfessionalServicesTab } from '../sections/professional-services-tab';
import { ProfessionalServicesTabSkeleton } from '../skeleton/professional-services-tab-skeleton';
import { fetchServicesByProfessionalId } from '@/lib/api/professional-services';
import { fetchServices } from '@/lib/api/services'; 
import { fetchCategories } from '@/lib/api/categories'; 

interface ProfessionalServicesTabSSRProps {
  professionalId: number;
}

export async function ProfessionalServicesTabSSR({ 
  professionalId 
}: ProfessionalServicesTabSSRProps) {
  

  const services = await fetchServicesByProfessionalId(professionalId);
  

  const baseServices = await fetchServices();
  const categories = await fetchCategories();

  return (
    <Suspense fallback={<ProfessionalServicesTabSkeleton />}>
      <ProfessionalServicesTab
        professionalId={professionalId}
        services={services}
        // services={baseServices}
        // categories={categories}
      />
    </Suspense>
  );
}