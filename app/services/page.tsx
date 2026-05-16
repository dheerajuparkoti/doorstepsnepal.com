


import { Suspense } from 'react';
import { ServicesSection } from './ssr/services-section-ssr';
import { ServicesSkeleton } from './skeleton/services-skeleton';
import Loading from '../loading';

export const revalidate = 60;

export const metadata = {
  title: 'Services | DoorStep',
  description: 'Browse all professional services',
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