
import { Suspense } from 'react';
import { ProfessionalHeaderCarousel } from '../sections/professional-header-carousel';
import { ProfessionalHeaderCarouselSkeleton } from '../skeleton/professional-header-carousel-skeleton';
import { fetchProfessionalProfile } from '@/lib/api/professional-profiles';
import { showcaseApi } from '@/lib/api/showcase';
import { notFound } from 'next/navigation';

// interface ProfessionalHeaderCarouselSSRProps {
//   professionalId: number;
// }




// export async function ProfessionalHeaderCarouselSSR({ 
//   professionalId 
// }: { 
//   professionalId: number 
// }) {
//   const [profile, showcases] = await Promise.all([
//     fetchProfessionalProfile(professionalId),
//     showcaseApi.getShowcases(professionalId)
//   ]);

//   if (!profile) {
//     notFound();
//   }

//   const activeShowcases = showcases.filter(s => s.is_active === true && s.status !== 'PENDING');
  
//   const showcaseImages = [
//     profile.user.profile_image,
//     ...activeShowcases.map(s => s.image_url)
//   ].filter(Boolean) as string[];

//   // If only 1 image, still show carousel but disable loop/autoplay
//   // If no images, use placeholder
//   if (showcaseImages.length === 0) {
//     showcaseImages.push('/carousel/home-services-2.jpg');
//   }

//   return (
//     <ProfessionalHeaderCarousel
//       showcaseImages={showcaseImages}
//       activeShowcases={activeShowcases}
//       professionSkill={profile.skill || 'Professional'}
//       fullName={profile.user.full_name}
//       experience={`${profile.experience}+ years`}
//       ratingString="3.0+"
//       completedOrders={profile.completed_orders?.toString() || '0'}
//     />
//   );
// }



import { fetchServicesByProfessionalId } from "@/lib/api/professional-services";

// Weighted average across all professional_services rows.
// Each row has its own cached average_rating + review_count.
function calculateWeightedRating(services: Array<{ average_rating: number; review_count: number }>): number | null {
  const totalReviews = services.reduce((s, ps) => s + (ps.review_count || 0), 0);
  if (totalReviews === 0) return null;
  const weighted = services.reduce((s, ps) => s + (ps.average_rating || 0) * (ps.review_count || 0), 0);
  return weighted / totalReviews;
}

export async function ProfessionalHeaderCarouselSSR({
  professionalId
}: {
  professionalId: number
}) {
  const [profile, showcases, services] = await Promise.all([
    fetchProfessionalProfile(professionalId),
    showcaseApi.getShowcases(professionalId),
    fetchServicesByProfessionalId(professionalId),
  ]);

  if (!profile) {
    notFound();
  }

  const activeShowcases = showcases.filter(s => s.is_active === true && s.status !== 'PENDING');

  const showcaseImages = [
    profile.user.profile_image,
    ...activeShowcases.map(s => s.image_url)
  ].filter(Boolean) as string[];

  if (showcaseImages.length === 0) {
    showcaseImages.push('/carousel/home-services-2.jpg');
  }

  // Weighted average from cached per-service columns (no extra review fetch needed)
  const avgRating = calculateWeightedRating(services);
  const ratingString = avgRating !== null ? `${avgRating.toFixed(1)}+` : 'New';

  return (
    <ProfessionalHeaderCarousel
      showcaseImages={showcaseImages}
      activeShowcases={activeShowcases}
      professionSkill={profile.skill || 'Professional'}
      fullName={profile.user.full_name}
      experience={`${profile.experience}+ years`}
      ratingString={ratingString}
      completedOrders={profile.completed_orders?.toString() || '0'}
    />
  );
}