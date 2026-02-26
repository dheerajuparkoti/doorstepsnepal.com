// export default function myProfile(){
//     return(
// <p>
//     Hellow youtube
// </p>
//     );
// }




// import { Suspense } from 'react';
// import { notFound } from 'next/navigation';
// import { ProfessionalScreenSSR } from '@/components/professional/ssr/professional-screen-ssr';
// import { ProfessionalScreenSkeleton } from '@/components/professional/skeleton/professional-screen-skeleton';
// import { fetchProfessionalProfile } from '@/lib/api/professional-profiles';
// export const dynamic = "force-dynamic";

// export const metadata = {
//   title: 'My Profile',
//   description: 'View your professional profile',
// };

// export default async function MyProfilePage() {
//   return (
//     <Suspense fallback={<ProfessionalScreenSkeleton />}>
//       <ProfessionalScreenSSR
//         professionalId={24}
//         showAppBar={true}
//         isOwnProfile={true}
//       />
//     </Suspense>
//   );
// }


// import { Suspense } from 'react';
// import { notFound } from 'next/navigation';
// import { ProfessionalScreenSSR } from '@/components/professional/ssr/professional-screen-ssr';
// import { ProfessionalScreenSkeleton } from '@/components/professional/skeleton/professional-screen-skeleton';

// export const dynamic = "force-dynamic";

// export const metadata = {
//   title: 'My Profile',
//   description: 'View your professional profile',
// };

// export default async function MyProfilePage({
//   searchParams,
// }: {
//   searchParams: { id?: string }
// }) {
//   const professionalId = searchParams.id ? parseInt(searchParams.id) : 0; // Fallback to 24 if no id
  
//   return (
//     <Suspense fallback={<ProfessionalScreenSkeleton />}>
//       <ProfessionalScreenSSR
//         professionalId={professionalId}
//         showAppBar={true}
//         isOwnProfile={true}
//       />
//     </Suspense>
//   );
// }