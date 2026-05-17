import type { MetadataRoute } from "next";
import { fetchCategories } from "@/lib/api/categories";
import { fetchSubCategories } from "@/lib/api/subcategories";
import { fetchServices } from "@/lib/api/services";

const BASE_URL = "https://www.doorstepsnepal.com";

const staticRoutes: MetadataRoute.Sitemap = [
  {
    url: BASE_URL,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 1.0,
  },
  {
    url: `${BASE_URL}/about`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    url: `${BASE_URL}/services`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.9,
  },
  {
    url: `${BASE_URL}/professionals`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.9,
  },
  {
    url: `${BASE_URL}/faqs`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  },
  {
    url: `${BASE_URL}/privacy-policy`,
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 0.3,
  },
  {
    url: `${BASE_URL}/terms-conditions`,
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 0.3,
  },
  {
    url: `${BASE_URL}/safety-policy`,
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 0.3,
  },
  {
    url: `${BASE_URL}/cancellation-refund-policy`,
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 0.3,
  },
  {
    url: `${BASE_URL}/careers-join-professional`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    url: `${BASE_URL}/downloads-app`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    url: `${BASE_URL}/tutorials-guides`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.5,
  },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const dynamicRoutes: MetadataRoute.Sitemap = [];

  try {
    const categoriesData = await fetchCategories(1, 1000);
    const categories = categoriesData.categories ?? [];

    for (const category of categories) {
      dynamicRoutes.push({
        url: `${BASE_URL}/categories/${category.id}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      });
      dynamicRoutes.push({
        url: `${BASE_URL}/subcategories/${category.id}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  } catch {
    // silently skip if API is unavailable at build time
  }

  try {
    const subCategoriesData = await fetchSubCategories(1, 1000);
    const subcategories = subCategoriesData.sub_categories ?? [];

    for (const sub of subcategories) {
      dynamicRoutes.push({
        url: `${BASE_URL}/subcategories/sub-category-detail/${sub.id}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  } catch {
    // silently skip if API is unavailable at build time
  }

  try {
    const servicesData = await fetchServices(1, 10000);
    const services = servicesData.services ?? [];

    for (const service of services) {
      dynamicRoutes.push({
        url: `${BASE_URL}/service/detail/${service.id}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  } catch {
    // silently skip if API is unavailable at build time
  }

  return [...staticRoutes, ...dynamicRoutes];
}
