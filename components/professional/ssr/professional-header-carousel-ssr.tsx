
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



import { fetchReviewsByProfessional } from "@/lib/api/reviews"; // Import your existing review API

// Rating calculation function (same logic as Flutter)
function calculateAverageRating(reviews: Array<{ rating: number }>): number {
  if (!reviews || reviews.length === 0) return 3.0;
  
  const sum = reviews.reduce((total, review) => total + review.rating, 0);
  const avg = sum / reviews.length;
  
  // If average is less than 3.0, return 3.0 as minimum
  return avg < 3.0 ? 3.0 : avg;
}

export async function ProfessionalHeaderCarouselSSR({ 
  professionalId 
}: { 
  professionalId: number 
}) {
  // Fetch profile, showcases, and reviews in parallel
  const [profile, showcases, reviewsResponse] = await Promise.all([
    fetchProfessionalProfile(professionalId),
    showcaseApi.getShowcases(professionalId),
    fetchReviewsByProfessional(professionalId, 1, 10000) // Use your existing API
  ]);

  if (!profile) {
    notFound();
  }

  const activeShowcases = showcases.filter(s => s.is_active === true && s.status !== 'PENDING');
  
  const showcaseImages = [
    profile.user.profile_image,
    ...activeShowcases.map(s => s.image_url)
  ].filter(Boolean) as string[];

  // If only 1 image, still show carousel but disable loop/autoplay
  // If no images, use placeholder
  if (showcaseImages.length === 0) {
    showcaseImages.push('/carousel/home-services-2.jpg');
  }

  // Calculate rating using the reviews from the response
  const reviews = reviewsResponse?.reviews || [];
  const avgRating = calculateAverageRating(reviews);
  const ratingString = `${avgRating.toFixed(1)}+`; // Format as "4.5+", "3.0+", etc.

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