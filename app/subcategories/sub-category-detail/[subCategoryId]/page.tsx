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

  const description = subcategory.description_en?.substring(0, 160) ?? `Book ${subcategory.name_en} services in Nepal.`;

  return {
    title: subcategory.name_en,
    description,
    openGraph: {
      title: subcategory.name_en,
      description,
      type: "website",
      images: subcategory.image ? [{ url: subcategory.image, alt: subcategory.name_en }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${subcategory.name_en} | Doorsteps Nepal`,
      description,
    },
    alternates: {
      canonical: `/subcategories/sub-category-detail/${subCategoryId}`,
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