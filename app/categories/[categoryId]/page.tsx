// app/categories/[categoryId]/page.tsx
export const revalidate = 60;

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryDetailClient } from "./category-detail-client";
import { fetchCategoryById } from "@/lib/api/categories"; 

interface PageProps {
  params: Promise<{
    categoryId: string;
  }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { categoryId } = await params;
  const parsedId = parseInt(categoryId);
  
  if (isNaN(parsedId) || parsedId <= 0) {
    return {
      title: "Invalid Category ID",
    };
  }
  
  const category = await fetchCategoryById(parsedId);
  
  if (!category) {
    return {
      title: "Category Not Found",
    };
  }

  const description = category.description_en?.substring(0, 160) ?? `Browse ${category.name_en} services in Nepal.`;

  return {
    title: category.name_en,
    description,
    openGraph: {
      title: category.name_en,
      description,
      type: "website",
      images: category.image ? [{ url: category.image, alt: category.name_en }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${category.name_en} | Doorsteps Nepal`,
      description,
    },
    alternates: {
      canonical: `/categories/${categoryId}`,
    },
  };
}

export default async function CategoryDetailPage({ params }: PageProps) {
  const { categoryId } = await params;
  const parsedId = parseInt(categoryId);
  
  if (isNaN(parsedId) || parsedId <= 0) {
    notFound();
  }
  
  const category = await fetchCategoryById(parsedId);
  
  if (!category) {
    notFound();
  }

  return <CategoryDetailClient category={category} />;
}

