
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ServicesSection } from './ssr/services-section-ssr';
import { ServicesSkeleton } from './skeleton/services-skeleton';
import Loading from '../loading';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'All Services',
  description: 'Browse all professional home services available in Nepal — plumbing, electrical, cleaning, beauty, repairs, and more.',
  openGraph: {
    title: 'All Services | Doorsteps Nepal',
    description: 'Browse all professional home services available in Nepal — plumbing, electrical, cleaning, beauty, repairs, and more.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'All Services | Doorsteps Nepal',
    description: 'Browse all professional home services available in Nepal.',
  },
  alternates: {
    canonical: '/services',
  },
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      <Suspense fallback={<ServicesSkeleton />}>
        <ServicesSection />
      </Suspense>
    </div>
  );
}
export { Loading };