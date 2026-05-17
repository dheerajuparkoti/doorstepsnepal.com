import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ProfessionalsSection } from './ssr/professionals-section-ssr';
import { ProfessionalsSkeleton } from './skeleton/professionals-skeleton';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Find Professionals',
  description: 'Browse verified home service professionals in Nepal. Find plumbers, electricians, cleaners, beauty experts, and more near you.',
  openGraph: {
    title: 'Find Professionals | Doorsteps Nepal',
    description: 'Browse verified home service professionals in Nepal.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Find Professionals | Doorsteps Nepal',
    description: 'Browse verified home service professionals in Nepal.',
  },
  alternates: {
    canonical: '/professionals',
  },
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