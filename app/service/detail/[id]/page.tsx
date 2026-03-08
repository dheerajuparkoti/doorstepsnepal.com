// app/service/detail/[id]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceDetailClient } from "./service-client";
import { fetchServiceById } from "@/lib/api/services";

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

  return {
    title: service.name_en,
    description: service.description_en?.substring(0, 160),
    openGraph: {
      title: service.name_en,
      description: service.description_en?.substring(0, 160),
      images: service.image ? [service.image] : [],
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

  return <ServiceDetailClient service={service} />;
}