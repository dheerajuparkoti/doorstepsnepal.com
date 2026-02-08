// export default async function Page({
//   params,
// }: {
//   params: Promise<{ categoryId: string }>
// }) {
//   const { categoryId } = await params;
//   return (
//     <div className="p-8">
//       <h1 className="text-2xl font-bold">Test Dynamic Route</h1>
//       <p>Parameter: {categoryId}</p>
//     </div>
//   );
// }


import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { fetchCategoryById } from '@/lib/api/categories';
import { SubCategoriesSection } from '../ssr/subcategories-section-ssr';
import { SubCategoriesSkeleton } from '../skeleton/subcategories-skeleton';

// Correct interface for Next.js 15+
interface CategorySubCategoriesPageProps {
  params: Promise<{
    categoryId: string;
  }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata(props: CategorySubCategoriesPageProps) {
  try {
    const params = await props.params;
    const categoryId = parseInt(params.categoryId);
    
    if (isNaN(categoryId)) {
      return {
        title: 'Invalid Category | DoorStep',
      };
    }
    
    const category = await fetchCategoryById(categoryId);
    
    if (!category) {
      return {
        title: 'Category Not Found | DoorStep',
      };
    }
    
    return {
      title: `${category.name_en} Subcategories | DoorStep`,
      description: `Browse all ${category.name_en.toLowerCase()} subcategories and services`,
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Subcategories | DoorStep',
    };
  }
}

export default async function CategorySubCategoriesPage(
  props: CategorySubCategoriesPageProps
) {
  try {

    const params = await props.params;
    const categoryId = parseInt(params.categoryId);
    
    if (isNaN(categoryId)) {
      console.error('Invalid category ID:', params.categoryId);
      notFound();
    }
    
 
    const categoryPromise = fetchCategoryById(categoryId);
    
  return (
      <div className="min-h-screen">
        <Suspense fallback={<SubCategoriesSkeleton />}>
          {/* Async component that handles loading */}
          <CategoryContent 
            categoryId={categoryId}
            categoryPromise={categoryPromise}
          />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error('Error in CategorySubCategoriesPage:', error);
    notFound();
  }
}

// Separate component to handle async data loading
async function CategoryContent({
  categoryId,
  categoryPromise,
}: {
  categoryId: number;
  categoryPromise: Promise<any>;
}) {
  // Wait for category data
  const category = await categoryPromise;
  
  if (!category) {
    notFound();
  }
  
  return (
    <SubCategoriesSection 
      categoryId={categoryId}
      categoryName={category.name_en}
      isCategorySpecific={true}
    />
  );
}