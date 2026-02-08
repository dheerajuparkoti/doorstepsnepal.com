import { Suspense } from 'react';
import { SubCategoriesSection } from './ssr/subcategories-section-ssr';
import { SubCategoriesSkeleton } from './skeleton/subcategories-skeleton';

export const metadata = {
  title: 'Subcategories | DoorStep',
  description: 'Browse all service subcategories',
};

export default function SubCategoriesPage() {
  return (
    <div className="min-h-screen">
      <Suspense fallback={<SubCategoriesSkeleton />}>
        {/* Pass isCategorySpecific as false for main page */}
        <SubCategoriesSection 
          categoryId={undefined}  
          categoryName=""
          isCategorySpecific={false}
        />
      </Suspense>
    </div>
  );
}