// // app/dashboard/my-profile/[professionalId]/page.tsx
// import { Suspense } from 'react';
// import { notFound } from 'next/navigation';
// import { ProfessionalScreenSSR } from '@/components/professional/ssr/professional-screen-ssr';
// import { ProfessionalScreenSkeleton } from '@/components/professional/skeleton/professional-screen-skeleton';
// import { fetchProfessionalProfile } from '@/lib/api/professional-profiles';

// interface ViewProfessionalPageProps {
//   params: {
//     professionalId: string;
//   };
// }

// export async function generateMetadata({ params }: ViewProfessionalPageProps) {
//   const professionalId = parseInt(params.professionalId);
//   const profile = await fetchProfessionalProfile(professionalId);
  
//   if (!profile) {
//     return {
//       title: 'Professional Not Found',
//     };
//   }

//   return {
//     title: `${profile.user.full_name} - Professional Profile`,
//     description: `View ${profile.user.full_name}'s profile, services, and reviews`,
//   };
// }

// export default async function ViewProfessionalPage({ params }: ViewProfessionalPageProps) {
//   const professionalId = parseInt(params.professionalId);
  
//   if (isNaN(professionalId)) {
//     notFound();
//   }

//   return (
//     <Suspense fallback={<ProfessionalScreenSkeleton />}>
//       <ProfessionalScreenSSR
//         professionalId={professionalId}
//         showAppBar={true}
//         isOwnProfile={false}
//       />
//     </Suspense>
//   );
// }

// app/dashboard/my-profile/[professionalId]/page.tsx
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { ProfessionalScreenSSR } from '@/components/professional/ssr/professional-screen-ssr';
import { ProfessionalScreenSkeleton } from '@/components/professional/skeleton/professional-screen-skeleton';

//  Add 'async' and await params
export default async function ViewProfessionalPage({ 
  params 
}: { 
  params: Promise<{ professionalId: string }> 
}) {

  const { professionalId } = await params;
  
  console.log(' ROUTE HIT! Professional ID:', professionalId);
  
  const professionalIdNum = parseInt(professionalId);
  
  if (isNaN(professionalIdNum)) {
    console.log(' Invalid ID:', professionalId);
    notFound();
  }

  console.log('Valid ID, rendering profile for:', professionalIdNum);
  
  return (
    <Suspense fallback={<ProfessionalScreenSkeleton />}>
      <ProfessionalScreenSSR
        professionalId={professionalIdNum}
        showAppBar={true}
        isOwnProfile={false}
      />
    </Suspense>
  );
}