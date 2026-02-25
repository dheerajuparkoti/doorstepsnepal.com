
"use client";

import { useEffect, useState } from "react";
import { SearchSection } from "@/components/home/search-section";
import { fetchServices } from "@/lib/api/service";
import type { Service } from "@/lib/data/service";
import { SearchSkeleton } from "@/components/home/skeleton/search-skeleton";

export default function SearchWrapper() {
  const [data, setData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        console.log("Fetching services for search...");

        // SINGLE API CALL - Fetch all services
        const response = await fetchServices(
          1,        // page
          10000,    // size
          undefined,
          undefined,
          undefined
        );

        if (!response?.services) {
          console.log("No services found");
          setData([]);
          return;
        }

        const services: Service[] = response.services;
        console.log(`Fetched ${services.length} services`);

        // Transform services data 
        const servicesData = services.map((service) => ({
          id: service.id,
          name_en: service.name_en,
          name_np: service.name_np,
          image: service.image,
          description_en: service.description_en,
          description_np: service.description_np,
          category: service.category,
          sub_category: service.sub_category,
        }));

        setData(servicesData);

      } catch (error) {
        console.error("Error in SearchWrapper:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <SearchSkeleton />;
  }

  return <SearchSection servicesData={data || []} />;
}