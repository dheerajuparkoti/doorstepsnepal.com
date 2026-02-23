// // lib/types/filters.ts
// export type ProfessionalFilterType = 
//   | 'professionalName'
//   | 'serviceName' 
//   | 'skills'
//   | 'address'
//   | 'serviceTag'
//   | 'priceRange';

// export interface AddressFilter {
//   province?: string;
//   district?: string;
//   municipality?: string;
//   wardNo?: number;
//   streetName?: string;
// }

// export interface FilterState {
//   searchType: ProfessionalFilterType;
//   searchQuery: string;
//   selectedTag?: string;
//   selectedPriceRange?: number | null;
//   addressFilter?: AddressFilter;
//   sortBy: string;
//   hasDiscount: boolean;
//   hasMinimumPrice: boolean;
// }

// export const priceRanges = [
//   { id: 'under_300', label: '< Rs. 300', value: 300 },
//   { id: '300_800', label: 'Rs. 300 - Rs. 800', value: 800 },
//   { id: '800_1500', label: 'Rs. 800 - Rs. 1500', value: 1500 },
//   { id: '1500_3000', label: 'Rs. 1500 - Rs. 3000', value: 3000 },
//   { id: 'above_3000', label: '> Rs. 3000', value: 3001 },
// ];

// export const serviceTags = [
//   { id: 'best_deal', label: 'Best Deal' },
//   { id: 'bumper_offer', label: 'Bumper Offer' },
//   { id: 'dashain_offer', label: 'Dashain Offer' },
//   { id: 'featured', label: 'Featured' },
// ];

// export const searchFilterOptions = [
//   { id: 'professionalName', labelEn: 'By Professional Name', labelNp: 'व्यावसायिक नाम द्वारा', icon: <User className="h-3 w-3" /> },
//   { id: 'serviceName', labelEn: 'By Service Name', labelNp: 'सेवा नाम द्वारा', icon: <Building className="h-3 w-3" /> },
//   { id: 'skills', labelEn: 'By Skills', labelNp: 'कौशल द्वारा', icon: <Award className="h-3 w-3" /> },
//   { id: 'address', labelEn: 'By Service Area', labelNp: 'सेवा क्षेत्र द्वारा', icon: <MapPin className="h-3 w-3" /> },
//   { id: 'serviceTag', labelEn: 'By Service Tag', labelNp: 'सेवा ट्याग द्वारा', icon: <Tag className="h-3 w-3" /> },
//   { id: 'priceRange', labelEn: 'By Price Range', labelNp: 'मूल्य सीमा द्वारा', icon: <DollarSign className="h-3 w-3" /> },
// ];