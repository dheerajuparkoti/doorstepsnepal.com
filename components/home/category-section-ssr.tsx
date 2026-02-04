// components/home/categories-section.tsx
import { fetchCategories } from '@/lib/api/categories';
import { CategoriesClient } from './category-section';

export async function CategoriesSection() {
  //  SSR: Fetches data on SERVER
  const data = await fetchCategories(1, 8);
  
  //  Pass the data to client component
  return <CategoriesClient categoriesData={data} />;
}