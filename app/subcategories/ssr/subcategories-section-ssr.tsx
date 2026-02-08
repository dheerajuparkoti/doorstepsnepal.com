
import { fetchSubCategories } from '@/lib/api/subcategories';
import { SubCategoriesClient } from '../subcategories-section';

interface SubCategoriesSectionProps {
  categoryId?: number;
  categoryName: string;
  isCategorySpecific?: boolean;
}

export async function SubCategoriesSection({
  categoryId,
  categoryName,
  isCategorySpecific = false,
}: SubCategoriesSectionProps) {
  try {
    // Fetch subcategories (filtered by categoryId if provided)
    const data = await fetchSubCategories(1, 50, categoryId);
    
    return (
      <SubCategoriesClient 
        subCategoriesData={data}
        initialCategoryId={categoryId}
        screenTitle={categoryName || 'Subcategories'}
        isCategorySpecific={isCategorySpecific}
      />
    );
  } catch (error) {
    console.error('Error in SubCategoriesSection:', error);
    // Return empty or error state
    return (
      <SubCategoriesClient 
        subCategoriesData={{ sub_categories: [], total: 0, page: 1, size: 20, pages: 1 }}
        initialCategoryId={categoryId}
        screenTitle={categoryName || 'Subcategories'}
        isCategorySpecific={isCategorySpecific}
      />
    );
  }
}