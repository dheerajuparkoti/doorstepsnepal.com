import { Suspense } from 'react';
import { ProfileScreenClient } from '@/components/user-profile/user-profile-screen';
import { ProfileScreenSkeleton } from '@/components/user-profile/skeleton/user-profile-screen';

export const metadata = {
  title: 'My Profile',
  description: 'View and manage your profile',
};

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileScreenSkeleton showAppBar={true} />}>
      <ProfileScreenClient showAppBar={true} />
    </Suspense>
  );
}