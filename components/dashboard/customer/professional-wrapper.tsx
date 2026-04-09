"use client";

import { useEffect, useState } from "react";
import { ProfessionalsSection } from "@/components/home/professionals-section";
import { professionalApi } from "@/lib/api/professional";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import type { TopProfessional } from "@/lib/data/professional";

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
              <div className="h-40 w-full">
                <Skeleton className="h-full w-full" />
              </div>
              <CardContent className="p-4 space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ProfessionalsWrapper() {
  const [data, setData] = useState<{
    professionals: TopProfessional[];
    total: number;
  } | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await professionalApi.getTopProfessionals(8);

        setData({
          professionals: res.professionals,
          total: res.total_professionals,
        });
      } catch (error) {
        console.error("Error fetching top professionals:", error);
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
      professionals={data.professionals}
      total={data.total}
    />
  );
}