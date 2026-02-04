// // lib/data/categories.ts

// export interface Category {
//   id: string;
//   name: string;
//   nameNe: string;
//   description: string;
//   descriptionNe: string;
//   image: string;


// }

// export const categories: Category[] = [
//   {
//     id: "home-services",
//     name: "Home Services",
//     nameNe: "गृह सेवाहरू",
//     description: "All essential services for your home",
//     descriptionNe: "तपाईंको घरका लागि आवश्यक सबै सेवाहरू",
//     image: "/images/categories/home-services.jpg",
 
   
//   },
//   {
//     id: "beauty-wellness",
//     name: "Beauty & Wellness",
//     nameNe: "सौन्दर्य र स्वास्थ्य",
//     description: "Personal care and wellness services",
//     descriptionNe: "व्यक्तिगत हेरचाह तथा स्वास्थ्य सेवाहरू",
//     image: "/images/categories/beauty.jpg",

   
//   },
//   {
//     id: "repair-maintenance",
//     name: "Repair & Maintenance",
//     nameNe: "मर्मत तथा मर्मतसम्भार",
//     description: "Repair and maintenance services for home appliances",
//     descriptionNe: "घरेलु उपकरणहरूको मर्मत तथा मर्मतसम्भार सेवाहरू",
//     image: "/images/categories/repair.jpg",

//   },
//   {
//     id: "cleaning-services",
//     name: "Cleaning Services",
//     nameNe: "सफाई सेवाहरू",
//     description: "Professional cleaning for home and office",
//     descriptionNe: "घर तथा कार्यालयको व्यावसायिक सफाई सेवा",
//     image: "/images/categories/cleaning.jpg",

  
//   },
// ];


export interface Category {
  id: number;
  name_en: string;
  name_np: string;
  description_en: string;
  description_np: string;
  image: string | null;
}

export interface CategoriesResponse {
  categories: Category[];
  total: number;
  page: number;
  size: number;
  pages: number;
}