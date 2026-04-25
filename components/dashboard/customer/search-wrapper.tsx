
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
        const response = await fetchServices(1, 20);
        setData(response?.services ?? []);
      } catch {
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
