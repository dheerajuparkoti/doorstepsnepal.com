
"use client";

import { useEffect, useState } from "react";
import { ProfessionalsSection } from "@/components/home/professionals-section";
import { fetchProfessionalServices } from "@/lib/api/professional-services";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";


function ProfessionalsSkeleton() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Header Skeleton */}
        <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="space-y-3">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Grid Skeleton */}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="mx-auto mt-6 h-36 w-36">
                <Skeleton className="h-full w-full rounded-full" />
              </div>
              <CardContent className="p-4 text-center space-y-2">
                <Skeleton className="h-5 w-32 mx-auto" />
                <Skeleton className="h-4 w-24 mx-auto" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ProfessionalsWrapper() {
  const [data, setData] = useState<{ professionals: any[]; total: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetchProfessionalServices(1, 10000);
        const professionalServices = response.professional_services || [];

        // Deduplicate by professional ID
        const uniqueProfessionalsMap = new Map<number, any>();
        professionalServices.forEach((ps: any) => {
          const id = ps.professional.id;
          if (!uniqueProfessionalsMap.has(id)) {
            uniqueProfessionalsMap.set(id, ps);
          }
        });

        const uniqueProfessionalServices = Array.from(uniqueProfessionalsMap.values());
        const topProfessionals = uniqueProfessionalServices.slice(0, 8);
        const totalProfessionals = uniqueProfessionalServices.length;

        setData({
          professionals: topProfessionals,
          total: totalProfessionals,
        });
      } catch (error) {
        console.error("Error fetching professionals:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <ProfessionalsSkeleton />;
  }

  if (!data || data.professionals.length === 0) {
    return null; 
  }

  return (
    <ProfessionalsSection
      professionalServices={data.professionals}
      total={data.total}
    />
  );
}