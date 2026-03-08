import { Metadata } from "next";
import { notFound } from "next/navigation";
import { SubCategoryDetailClient } from "./subcategory-detail-client";
import { fetchSubCategoryById } from "@/lib/api/subcategories"; 

interface PageProps {
  params: Promise<{
    subCategoryId: string;
  }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { subCategoryId } = await params;
  const parsedId = parseInt(subCategoryId);
  
  if (isNaN(parsedId) || parsedId <= 0) {
    return {
      title: "Invalid Subcategory ID",
    };
  }
  
  const subcategory = await fetchSubCategoryById(parsedId);
  
  if (!subcategory) {
    return {
      title: "Subcategory Not Found",
    };
  }

  return {
    title: subcategory.name_en,
    description: subcategory.description_en?.substring(0, 160),
    openGraph: {
      title: subcategory.name_en,
      description: subcategory.description_en?.substring(0, 160),
      images: subcategory.image ? [subcategory.image] : [],
    },
  };
}

export default async function SubCategoryDetailPage({ params }: PageProps) {
  const { subCategoryId } = await params;
  const parsedId = parseInt(subCategoryId);
  
  if (isNaN(parsedId) || parsedId <= 0) {
    notFound();
  }
  
  const subcategory = await fetchSubCategoryById(parsedId);
  
  if (!subcategory) {
    notFound();
  }

  return <SubCategoryDetailClient subcategory={subcategory} />;
}