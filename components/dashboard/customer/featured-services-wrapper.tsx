
"use client";

import { useEffect, useState } from "react";
import { FeaturedServicesSection } from "@/components/home/featured-services-section";
import { fetchProfessionalServices } from "@/lib/api/professional-services";
import { FeaturedServicesSkeleton } from "@/components/home/skeleton/feateured-services-skeleton";

export default function FeaturedServicesWrapper() {
  const [data, setData] = useState<{ services: any[]; total: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetchProfessionalServices(1, 30);
        const services = response.professional_services || [];
        const pricedServices = services.filter(
          (ps: any) => ps.prices && ps.prices.length > 0
        );
        
        setData({
          services: pricedServices.slice(0, 8),
          total: pricedServices.length,
        });
      } catch (error) {
        console.error("Error fetching featured services:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <FeaturedServicesSkeleton />;
  }

  if (!data || data.services.length === 0) {
    return null;
  }

  return (
    <FeaturedServicesSection
      professionalServices={data.services}
      total={data.total}
    />
  );
}