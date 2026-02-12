// // components/professional/ssr/professional-screen-ssr.tsx
// import { ProfessionalScreen } from '../professional-screen';
// import { fetchProfessionalProfile } from '@/lib/api/professional-profiles';
// import { notFound } from 'next/navigation';

// interface ProfessionalScreenSSRProps {
//   professionalId: number;
//   showAppBar?: boolean;
//   isOwnProfile?: boolean;
// }

// export async function ProfessionalScreenSSR({ 
//   professionalId, 
//   showAppBar = false,
//   isOwnProfile = false 
// }: ProfessionalScreenSSRProps) {
  
//   // Fetch initial profile for SEO and metadata
//   const profile = await fetchProfessionalProfile(professionalId);

//   if (!profile) {
//     notFound();
//   }

//   return (
//     <ProfessionalScreen
//       professionalId={professionalId}
//       showAppBar={showAppBar}
//       isOwnProfile={isOwnProfile}
//       initialProfile={profile}
//     />
//   );
// }


// components/professional/ssr/professional-screen-ssr.tsx
import { Suspense } from 'react';
import { ProfessionalScreen } from '../professional-screen';
import { ProfessionalHeaderCarouselSSR } from './professional-header-carousel-ssr';
import { ProfessionalLocationBarSSR } from './professional-location-bar-ssr';
import { ProfessionalAboutTabSSR } from './professional-about-tab-ssr';
import { ProfessionalServicesTabSSR } from './professional-services-tab-ssr';
import { ProfessionalAvailabilityTabSSR } from './professional-availability-tab-ssr';
import { ProfessionalReviewsTabSSR } from './professional-reviews-tab-ssr';
import { fetchProfessionalProfile } from '@/lib/api/professional-profiles';
import { notFound } from 'next/navigation';

// Skeletons
import { ProfessionalHeaderCarouselSkeleton } from '../skeleton/professional-header-carousel-skeleton';
import { ProfessionalLocationBarSkeleton } from '../skeleton/professional-location-bar-skeleton';
import { ProfessionalAboutTabSkeleton } from '../skeleton/professional-about-tab-skeleton';
import { ProfessionalServicesTabSkeleton } from '../skeleton/professional-services-tab-skeleton';
import { ProfessionalAvailabilityTabSkeleton } from '../skeleton/professional-service-availability-skeleton';
import { ProfessionalReviewsTabSkeleton } from '../skeleton/professional-reviews-tab-skeleton';

interface ProfessionalScreenSSRProps {
  professionalId: number;
  showAppBar?: boolean;
  isOwnProfile?: boolean;
}

export async function ProfessionalScreenSSR({ 
  professionalId, 
  showAppBar = false,
  isOwnProfile = false 
}: ProfessionalScreenSSRProps) {
  
  const profile = await fetchProfessionalProfile(professionalId);

  if (!profile) {
    notFound();
  }

  return (
    <ProfessionalScreen
      professionalId={professionalId}
      showAppBar={showAppBar}
      isOwnProfile={isOwnProfile}
      initialProfile={profile}
      headerCarousel={
        <Suspense fallback={<ProfessionalHeaderCarouselSkeleton />}>
          <ProfessionalHeaderCarouselSSR professionalId={professionalId} />
        </Suspense>
      }
      locationBar={
        <Suspense fallback={<ProfessionalLocationBarSkeleton />}>
          <ProfessionalLocationBarSSR professionalId={professionalId} />
        </Suspense>
      }
      aboutTab={
        <Suspense fallback={<ProfessionalAboutTabSkeleton />}>
          <ProfessionalAboutTabSSR professionalId={professionalId} />
        </Suspense>
      }
      servicesTab={
        <Suspense fallback={<ProfessionalServicesTabSkeleton />}>
          <ProfessionalServicesTabSSR professionalId={professionalId} />
        </Suspense>
      }
      availabilityTab={
        <Suspense fallback={<ProfessionalAvailabilityTabSkeleton />}>
          <ProfessionalAvailabilityTabSSR professionalId={professionalId} />
        </Suspense>
      }
      reviewsTab={
        <Suspense fallback={<ProfessionalReviewsTabSkeleton />}>
          <ProfessionalReviewsTabSSR professionalId={professionalId} />
        </Suspense>
      }
    />
  );
}