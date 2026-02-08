import { Suspense } from 'react';
import { ProfessionalsSection } from './ssr/professionals-section-ssr';
import { ProfessionalsSkeleton } from './skeleton/professionals-skeleton';

export const metadata = {
  title: 'Professionals | DoorStep',
  description: 'Browse all professional service providers',
};

interface ProfessionalsPageProps {
  searchParams?: Promise<{
    professionalId?: string;
    categoryId?: string;
    serviceId?: string;
  }>;
}

export default async function ProfessionalsPage({
  searchParams,
}: ProfessionalsPageProps) {
  const params = await searchParams;
  const professionalId = params?.professionalId 
    ? parseInt(params.professionalId) 
    : undefined;
  
  return (
    <div className="min-h-screen">
      <Suspense fallback={<ProfessionalsSkeleton />}>
        <ProfessionalsSection 
          professionalId={professionalId}
        />
      </Suspense>
    </div>
  );
}