// export default function myProfile(){
//     return(
// <p>
//     Hellow youtube
// </p>
//     );
// }




// app/dashboard/my-profile/page.tsx
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { ProfessionalScreenSSR } from '@/components/professional/ssr/professional-screen-ssr';
import { ProfessionalScreenSkeleton } from '@/components/professional/skeleton/professional-screen-skeleton';
// import { getServerSession } from '@/lib/data/auth'; // You'll need this
import { fetchProfessionalProfile } from '@/lib/api/professional-profiles';

export const metadata = {
  title: 'My Profile',
  description: 'View your professional profile',
};

export default async function MyProfilePage() {
  // Get current user's professional ID from session
//   const session = await getServerSession();
  
//   if (!session?.user?.professionalId) {
//     notFound();
//   }

//   const professionalId = session.user.professionalId;

  return (
    <Suspense fallback={<ProfessionalScreenSkeleton />}>
      <ProfessionalScreenSSR
        professionalId={24}
        showAppBar={true}
        isOwnProfile={true}
      />
    </Suspense>
  );
}