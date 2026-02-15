"use client";

import { useEffect, useState } from "react";
import { SearchSection } from "@/components/home/search-section";
import { fetchProfessionalServices } from "@/lib/api/professional-services";
import type { ProfessionalService } from "@/lib/data/professional-services";
import { SearchSkeleton } from "@/components/home/skeleton/search-skeleton";

export default function SearchWrapper() {
  const [data, setData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        console.log("Fetching professional services for search...");
        
        // SINGLE API CALL - Fetch all professional services at once
        const response = await fetchProfessionalServices(1, 10000);
        
        if (!response?.professional_services) {
          console.log("No professional services found");
          setData([]);
          return;
        }

        const professionalServices: ProfessionalService[] = response.professional_services;
        console.log(`Fetched ${professionalServices.length} professional services`);

        // NO ADDITIONAL API CALLS - Just transform the existing data
        const professionalsData = professionalServices.map((ps) => ({
          id: ps.professional_id,
          full_name: ps.professional?.user?.full_name || "Unknown Professional",
          profile_image: ps.professional?.user?.profile_image,
          // Services array already contains all needed info
          services: [{
            service_id: ps.service_id,
            service: {
              id: ps.service.id,
              name_en: ps.service.name_en,
              name_np: ps.service.name_np,
            },
            professional: ps.professional, // This already has all professional data
          }],
          // Service name string for searching
          service_name: `${ps.service.name_en}, ${ps.service.name_np}`,
        }));

        console.log(`Processed ${professionalsData.length} professionals with services`);
        setData(professionalsData);
        
      } catch (error) {
        console.error("Error in SearchWrapper:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []); // Empty dependency array = runs once on mount

  if (loading) {
    return <SearchSkeleton />;
  }

  return <SearchSection professionalsData={data || []} />;
}