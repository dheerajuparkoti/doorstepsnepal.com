// components/professional/ssr/professional-reviews-tab-ssr.tsx
import { Suspense } from 'react';
import { ProfessionalReviewsTab } from '../sections/professional-reviews-tab';
import { ProfessionalReviewsTabSkeleton } from '../skeleton/professional-reviews-tab-skeleton';
import { fetchReviewsByProfessional } from '@/lib/api/reviews';

interface ProfessionalReviewsTabSSRProps {
  professionalId: number;
}

export async function ProfessionalReviewsTabSSR({ 
  professionalId 
}: ProfessionalReviewsTabSSRProps) {
  
  try {
    const response = await fetchReviewsByProfessional(professionalId, 1, 10000);
    const reviews = response.reviews || [];

    return (
      <Suspense fallback={<ProfessionalReviewsTabSkeleton />}>
        <ProfessionalReviewsTab
          professionalId={professionalId}
          initialReviews={reviews}
        />
      </Suspense>
    );
  } catch (error) {
    return (
      <Suspense fallback={<ProfessionalReviewsTabSkeleton />}>
        <ProfessionalReviewsTab
          professionalId={professionalId}
          initialReviews={[]}
        />
      </Suspense>
    );
  }
}