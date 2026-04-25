
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchProfessionalServiceById } from "@/lib/api/professional-services";
import { ServiceDetailClient } from "./service-detail-client";

interface PageProps {
  params: Promise<{
    serviceId: string;
  }>;
}


export async function generateMetadata({ params }: PageProps): Promise<Metadata> {

  const { serviceId } = await params;
  
  //console.log("Raw serviceId from params:", serviceId);
  

  if (serviceId === 'NaN') {
    console.error('serviceId is "NaN" string');
    return {
      title: "Invalid Service ID",
    };
  }
  
  const parsedId = parseInt(serviceId);
  //console.log("Generating metadata for service ID:", parsedId);
  
  if (isNaN(parsedId) || parsedId <= 0) {
    return {
      title: "Invalid Service ID",
    };
  }
  
  const service = await fetchProfessionalServiceById(parsedId);
  
  if (!service) {
    return {
      title: "Service Not Found",
    };
  }

  const serviceName = service.service.name_en;
  const description = service.service.description_en?.substring(0, 160);

  return {
    title: `${serviceName} | Professional Services`,
    description: description,
    openGraph: {
      title: serviceName,
      description: description,
      images: service.service.image ? [service.service.image] : [],
    },
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { serviceId } = await params;
  
  if (serviceId === 'NaN') {
    notFound();
  }
  
  const parsedId = parseInt(serviceId);
  
  if (isNaN(parsedId) || parsedId <= 0) {
    notFound();
  }
  
  const service = await fetchProfessionalServiceById(parsedId);
  
  if (!service) {
    notFound();
  }

  return <ServiceDetailClient service={service} />;
}