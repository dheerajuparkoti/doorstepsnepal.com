// components/professional/ssr/professional-header-carousel-ssr.tsx
import { Suspense } from 'react';
import { ProfessionalHeaderCarousel } from '../sections/professional-header-carousel';
import { ProfessionalHeaderCarouselSkeleton } from '../skeleton/professional-header-carousel-skeleton';
import { fetchProfessionalProfile } from '@/lib/api/professional-profiles';
import { showcaseApi } from '@/lib/api/showcase';
import { notFound } from 'next/navigation';

interface ProfessionalHeaderCarouselSSRProps {
  professionalId: number;
}

// export async function ProfessionalHeaderCarouselSSR({ 
//   professionalId 
// }: ProfessionalHeaderCarouselSSRProps) {
  
//   // Fetch data in parallel
//   const [profile, showcases] = await Promise.all([
//     fetchProfessionalProfile(professionalId),
//     showcaseApi.getShowcases(professionalId)
//   ]);

//   if (!profile) {
//     notFound();
//   }

//   const activeShowcases = showcases.filter(s => s.is_active === true);
  
//   // Create showcase images array: profile image + active showcases
//   const showcaseImages = [
//     profile.user.profile_image,
//     ...activeShowcases.map(s => s.image_url)
//   ].filter(Boolean) as string[]; // Remove null/undefined

//   // If no images, use placeholder
//   if (showcaseImages.length === 0) {
//     showcaseImages.push('/assets/images/professionals/placeholder.jpg');
//   }

//   const fullName = profile.user.full_name;
//   const professionSkill = profile.skill || 'Professional';
//   const experience = `${profile.experience}+ years`;
  
//   // Calculate average rating (will be fetched separately in reviews tab)
//   // Pass 3.0 as default for now
//   const avgRating = 3.0;
//   const ratingString = `${avgRating.toFixed(1)}+`;
  
//   const completedOrders = profile.completed_orders?.toString() || '0';

//   return (
//     <Suspense fallback={<ProfessionalHeaderCarouselSkeleton />}>
//       <ProfessionalHeaderCarousel
//         showcaseImages={showcaseImages}
//         activeShowcases={activeShowcases}
//         professionSkill={professionSkill}
//         fullName={fullName}
//         experience={experience}
//         ratingString={ratingString}
//         completedOrders={completedOrders}
//       />
//     </Suspense>
//   );
// }


export async function ProfessionalHeaderCarouselSSR({ 
  professionalId 
}: { 
  professionalId: number 
}) {
  const [profile, showcases] = await Promise.all([
    fetchProfessionalProfile(professionalId),
    showcaseApi.getShowcases(professionalId)
  ]);

  if (!profile) {
    notFound();
  }

  const activeShowcases = showcases.filter(s => s.is_active === true);
  
  const showcaseImages = [
    profile.user.profile_image,
    ...activeShowcases.map(s => s.image_url)
  ].filter(Boolean) as string[];

  // If only 1 image, still show carousel but disable loop/autoplay
  // If no images, use placeholder
  if (showcaseImages.length === 0) {
    showcaseImages.push('/carousel/home-services-2.jpg');
  }

  return (
    <ProfessionalHeaderCarousel
      showcaseImages={showcaseImages}
      activeShowcases={activeShowcases}
      professionSkill={profile.skill || 'Professional'}
      fullName={profile.user.full_name}
      experience={`${profile.experience}+ years`}
      ratingString="3.0+"
      completedOrders={profile.completed_orders?.toString() || '0'}
    />
  );
}