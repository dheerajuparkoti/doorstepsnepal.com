
"use client";

import { useEffect, useState } from "react";
import { SearchSection } from "@/components/home/search-section";
import { fetchServices } from "@/lib/api/service";
import type { Service } from "@/lib/data/service";
import { SearchSkeleton } from "@/components/home/skeleton/search-skeleton";

export default function SearchWrapper() {
  const [data, setData] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInitial() {
      try {
        //console.log("Fetching services for search...");

        // SINGLE API CALL - Fetch all services
        const response = await fetchServices(
          1,        // page
          10000,    // size
          undefined,
          undefined,
          undefined
        );

        if (!response?.services) {
          //console.log("No services found");
          setData([]);
          return;
        }

        const services: Service[] = response.services;

        setData(services);

      } catch (error) {
        console.error("Error in SearchWrapper:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    }

    fetchInitial();
  }, []);

  if (loading) return <SearchSkeleton />;

  return <SearchSection servicesData={data} />;
}
