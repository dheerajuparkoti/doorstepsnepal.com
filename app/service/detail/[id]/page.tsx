// app/service/detail/[id]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceDetailClient } from "./service-client";
import { fetchServiceById } from "@/lib/api/services";
import { JsonLd, serviceJsonLd } from "@/components/seo/JsonLd";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const parsedId = parseInt(id);
  
  if (isNaN(parsedId) || parsedId <= 0) {
    return {
      title: "Invalid Service ID",
    };
  }
  
  const service = await fetchServiceById(parsedId);
  
  if (!service) {
    return {
      title: "Service Not Found",
    };
  }

  const description = service.description_en?.substring(0, 160) ?? `Book ${service.name_en} in Nepal.`;

  return {
    title: service.name_en,
    description,
    openGraph: {
      title: `${service.name_en} | Doorsteps Nepal`,
      description,
      type: "website",
      images: service.image ? [{ url: service.image, alt: service.name_en }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${service.name_en} | Doorsteps Nepal`,
      description,
    },
    alternates: {
      canonical: `/service/detail/${id}`,
    },
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { id } = await params;
  const parsedId = parseInt(id);
  
  if (isNaN(parsedId) || parsedId <= 0) {
    notFound();
  }
  
  const service = await fetchServiceById(parsedId);
  
  if (!service) {
    notFound();
  }

  return (
    <>
      <JsonLd
        data={serviceJsonLd({
          name: service.name_en,
          description: service.description_en ?? undefined,
          image: service.image ?? undefined,
          url: `https://www.doorstepsnepal.com/service/detail/${parsedId}`,
        })}
      />
      <ServiceDetailClient service={service} />
    </>
  );
}