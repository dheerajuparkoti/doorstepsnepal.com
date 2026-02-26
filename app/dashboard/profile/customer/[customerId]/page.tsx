import { Suspense } from 'react';
import { CustomerProfileViewer } from '@/components/user-profile/customer-profile-viewer';
import { ProfileScreenSkeleton } from '@/components/user-profile/skeleton/user-profile-screen';

interface PageProps {
  params: {
    customerId: string;
  };
}

export async function generateMetadata({ params }: PageProps) {
  return {
    title: 'Customer Profile',
    description: 'View customer profile details',
  };
}

export default function CustomerProfilePage({ params }: PageProps) {
  return (
    <Suspense fallback={<ProfileScreenSkeleton showAppBar={true} />}>
      <CustomerProfileViewer showAppBar={true} />
    </Suspense>
  );
}