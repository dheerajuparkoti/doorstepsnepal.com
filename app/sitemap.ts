import type { MetadataRoute } from "next";
import { fetchCategories } from "@/lib/api/categories";
import { fetchServices } from "@/lib/api/services";
import { fetchProfessionalServices } from "@/lib/api/professional-services";
import { createProfessionalSlug } from "@/lib/utils/slug";

const BASE_URL = "https://www.doorstepsnepal.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // --- Static pages ---
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/services`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/professionals`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/careers-join-professional`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/faqs`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/tutorials-guides`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/privacy-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/terms-conditions`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/safety-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/cancellation-refund-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  // --- Dynamic pages from API (fail-safe: each fetch is independent) ---
  const [categoriesResult, servicesResult, profServicesResult] =
    await Promise.allSettled([
      fetchCategories(1, 1000),
      fetchServices(1, 10000),
      fetchProfessionalServices({ page: 1, per_page: 500 }),
    ]);

  // Category pages: /categories/[id]
  const categoryPages: MetadataRoute.Sitemap =
    categoriesResult.status === "fulfilled"
      ? (categoriesResult.value.categories ?? []).map((cat) => ({
          url: `${BASE_URL}/categories/${cat.id}`,
          lastModified: now,
          changeFrequency: "weekly" as const,
          priority: 0.8,
        }))
      : [];

  // Service pages: /services/[id]/professionals
  const servicePages: MetadataRoute.Sitemap =
    servicesResult.status === "fulfilled"
      ? (servicesResult.value.services ?? []).map((svc) => ({
          url: `${BASE_URL}/services/${svc.id}/professionals`,
          lastModified: now,
          changeFrequency: "daily" as const,
          priority: 0.8,
        }))
      : [];

  // Professional pages: /professionals/[slug]  — deduplicated by professional_id
  const seenIds = new Set<number>();
  const professionalPages: MetadataRoute.Sitemap = [];

  if (profServicesResult.status === "fulfilled") {
    for (const ps of profServicesResult.value.professional_services ?? []) {
      const profId = ps.professional_id;
      if (seenIds.has(profId)) continue;
      seenIds.add(profId);

      const fullName = ps.professional?.user?.full_name ?? "";
      if (!fullName) continue;

      professionalPages.push({
        url: `${BASE_URL}/professionals/${createProfessionalSlug(fullName, profId)}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      });
    }
  }

  return [
    ...staticPages,
    ...categoryPages,
    ...servicePages,
    ...professionalPages,
  ];
}
