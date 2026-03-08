// app/categories/[categoryId]/page.tsx
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

  return {
    title: category.name_en,
    description: category.description_en?.substring(0, 160),
    openGraph: {
      title: category.name_en,
      description: category.description_en?.substring(0, 160),
      images: category.image ? [category.image] : [],
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

