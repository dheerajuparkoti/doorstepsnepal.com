import type { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { ProfessionalScreenSSR } from '@/components/professional/ssr/professional-screen-ssr';
import { ProfessionalScreenSkeleton } from '@/components/professional/skeleton/professional-screen-skeleton';
import { extractIdFromSlug, isValidProfessionalSlug } from '@/lib/utils/slug';
import { fetchProfessionalProfile } from '@/lib/api/professional-profiles';
import { JsonLd, personJsonLd } from '@/components/seo/JsonLd';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  if (!isValidProfessionalSlug(slug)) {
    return { title: "Professional Not Found" };
  }

  const professionalId = extractIdFromSlug(slug);
  if (!professionalId) {
    return { title: "Professional Not Found" };
  }

  const profile = await fetchProfessionalProfile(professionalId);

  if (!profile) {
    return { title: "Professional Not Found" };
  }

  const fullName = profile.user?.full_name ?? "Service Professional";
  const skill = profile.skill ?? "home services";
  const description = `Book ${fullName} for professional ${skill} services in Nepal. Verified professional on Doorsteps Nepal.`;
  const image = profile.user?.profile_image;

  return {
    title: fullName,
    description,
    openGraph: {
      title: `${fullName} | Doorsteps Nepal`,
      description,
      type: "profile",
      images: image ? [{ url: image, alt: fullName }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${fullName} | Doorsteps Nepal`,
      description,
      images: image ? [image] : [],
    },
    alternates: {
      canonical: `/professionals/${slug}`,
    },
  };
}

export default async function ProfessionalProfilePage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  
  // Validate slug format
  if (!isValidProfessionalSlug(slug)) {
    //console.log('Invalid slug format:', slug);
    notFound();
  }
  
  // Extract ID from slug
  const professionalId = extractIdFromSlug(slug);
  //console.log("PROFESSOINAL ID",professionalId);
  if (!professionalId) {
    //console.log('Could not extract ID from slug:', slug);
    notFound();
  }

  const profile = await fetchProfessionalProfile(professionalId);
  const fullName = profile?.user?.full_name;

  return (
    <>
      {profile && (
        <JsonLd
          data={personJsonLd({
            name: fullName ?? "Service Professional",
            description: profile.skill ? `Professional ${profile.skill} services in Nepal` : undefined,
            image: profile.user?.profile_image ?? undefined,
            url: `https://www.doorstepsnepal.com/professionals/${slug}`,
            jobTitle: profile.skill ?? "Service Professional",
          })}
        />
      )}
      <Suspense fallback={<ProfessionalScreenSkeleton />}>
        <ProfessionalScreenSSR
          professionalId={professionalId}
          showAppBar={true}
          isOwnProfile={false}
        />
      </Suspense>
    </>
  );
}