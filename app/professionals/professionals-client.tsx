
// // app/professionals/professionals-client.tsx
// 'use client';

// import { useState, useEffect, useRef, useCallback } from 'react'; 
// import { useI18n } from '@/lib/i18n/context';
// import { useRouter, useSearchParams } from 'next/navigation'; 
// import { 
//   Search, 
//   X, 
//   ChevronRight,
//   User,
//   MapPin,
//   DollarSign,
//   Building,
//   Award,
//   Tag,
//   ChevronDown,
//   SlidersHorizontal,
//   Star,
//   MoreVertical,
//   Heart,
//   Loader2
// } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Badge } from '@/components/ui/badge';
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Separator } from '@/components/ui/separator';
// import { createProfessionalSlug } from '@/lib/utils/slug';
// import { FilterSheet, FilterSection } from '@/components/ui/filter-sheet';
// import { fetchProfessionalServices } from '@/lib/api/professional-services';

// interface ProfessionalsClientProps {
//   professionalsData: any[];
//   totalPages?: number;
//   currentPage?: number;
//   totalResults?: number;
//   isSingleProfessionalView?: boolean;
//   professionalName?: string;
//   specificProfessionalId?: number;
// }

// type FilterType = 'professionalName' | 'serviceName' | 'skills' | 'address' | 'serviceTag' | 'priceRange';

// // Updated price ranges to match Flutter (5 ranges)
// const priceRanges = [
//   { id: 'under_300', label: '< Rs. 300', value: 300 },
//   { id: '300_800', label: 'Rs. 300 - Rs. 800', value: 800 },
//   { id: '800_1500', label: 'Rs. 800 - Rs. 1500', value: 1500 },
//   { id: '1500_3000', label: 'Rs. 1500 - Rs. 3000', value: 3000 },
//   { id: 'above_3000', label: '> Rs. 3000', value: 3001 },
// ];

// // Service tags (like Flutter's _serviceTags)
// const serviceTags = [
//   { id: 'best_deal', label: 'Best Deal' },
//   { id: 'bumper_offer', label: 'Bumper Offer' },
//   { id: 'dashain_offer', label: 'Dashain Offer' },
//   { id: 'featured', label: 'Featured' },
// ];

// // Updated search filter options with new types
// const searchFilterOptions = [
//   { id: 'professionalName', labelEn: 'By Professional Name', labelNp: 'व्यावसायिक नाम द्वारा', icon: <User className="h-3 w-3" /> },
//   { id: 'serviceName', labelEn: 'By Service Name', labelNp: 'सेवा नाम द्वारा', icon: <Building className="h-3 w-3" /> },
//   { id: 'skills', labelEn: 'By Skills', labelNp: 'कौशल द्वारा', icon: <Award className="h-3 w-3" /> },
//   { id: 'address', labelEn: 'By Service Area', labelNp: 'सेवा क्षेत्र द्वारा', icon: <MapPin className="h-3 w-3" /> },
//   { id: 'serviceTag', labelEn: 'By Service Tag', labelNp: 'सेवा ट्याग द्वारा', icon: <Tag className="h-3 w-3" /> },
//   { id: 'priceRange', labelEn: 'By Price Range', labelNp: 'मूल्य सीमा द्वारा', icon: <DollarSign className="h-3 w-3" /> },
// ];

// const priceFilterOptions = [
//   { id: 'under_300', labelEn: 'Under Rs. 300', labelNp: 'रु. ३०० मुनि', value: 300 },
//   { id: '300_800', labelEn: 'Rs. 300 - Rs. 800', labelNp: 'रु. ३०० - रु. ८००', value: 800 },
//   { id: '800_1500', labelEn: 'Rs. 800 - Rs. 1500', labelNp: 'रु. ८०० - रु. १५००', value: 1500 },
//   { id: '1500_3000', labelEn: 'Rs. 1500 - Rs. 3000', labelNp: 'रु. १५०० - रु. ३०००', value: 3000 },
//   { id: 'above_3000', labelEn: 'Above Rs. 3000', labelNp: 'रु. ३००० माथि', value: 3001 },
// ];

// const sortOptions = [
//   { id: 'name_asc', labelEn: 'Name (A to Z)', labelNp: 'नाम (A देखि Z)', icon: <User className="h-3 w-3" /> },
//   { id: 'name_desc', labelEn: 'Name (Z to A)', labelNp: 'नाम (Z देखि A)', icon: <User className="h-3 w-3" /> },
//   { id: 'price_low', labelEn: 'Price: Low to High', labelNp: 'मूल्य: न्यून देखि उच्च', icon: <DollarSign className="h-3 w-3" /> },
//   { id: 'price_high', labelEn: 'Price: High to Low', labelNp: 'मूल्य: उच्च देखि न्यून', icon: <DollarSign className="h-3 w-3" /> },
//   { id: 'services', labelEn: 'Most Services', labelNp: 'धेरै सेवाहरू', icon: <Star className="h-3 w-3" /> },
// ];

// export function ProfessionalsClient({
//   professionalsData: initialProfessionalsData,
//   totalPages: initialTotalPages = 1,
//   currentPage: initialCurrentPage = 1,
//   totalResults: initialTotalResults = 0,
//   isSingleProfessionalView = false,
//   professionalName,
//   specificProfessionalId,
// }: ProfessionalsClientProps) {
//   const { language } = useI18n();
//   const router = useRouter();
//   const searchParams = useSearchParams();
  
//   // State for professionals data and pagination
//   const [allProfessionals, setAllProfessionals] = useState<any[]>(initialProfessionalsData);
//   const [displayProfessionals, setDisplayProfessionals] = useState<any[]>(initialProfessionalsData);
//   const [currentPage, setCurrentPage] = useState(initialCurrentPage);
//   const [totalPages, setTotalPages] = useState(initialTotalPages);
//   const [totalResults, setTotalResults] = useState(initialTotalResults);
//   const [isLoadingMore, setIsLoadingMore] = useState(false);
//   const [hasMorePages, setHasMorePages] = useState(currentPage < totalPages);
  
//   // Search state
//   const [searchQuery, setSearchQuery] = useState('');
//   const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
//   const [isSearching, setIsSearching] = useState(false);
//   const [isSearchLoading, setIsSearchLoading] = useState(false);
  
//   // Filter state
//   const [filterType, setFilterType] = useState<FilterType>('professionalName');
//   const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null);
//   const [selectedTag, setSelectedTag] = useState<string | null>(null);
//   const [selectedProfessional, setSelectedProfessional] = useState<any>(null);
//   const [showDetailsDialog, setShowDetailsDialog] = useState(false);
//   const [showPricesDialog, setShowPricesDialog] = useState(false);
//   const [detailType, setDetailType] = useState<'service_areas' | 'services' | 'skills' | null>(null);
  
//   // Refs for infinite scroll
//   const loaderRef = useRef<HTMLDivElement>(null);
  
//   // Filter sheet state
//   const [filterSheetFilters, setFilterSheetFilters] = useState({
//     searchType: 'professionalName',
//     priceRange: null as string | null,
//     sortBy: 'name_asc',
//     hasDiscount: false,
//     hasMinimumPrice: false,
//     location: null as string | null,
//     selectedTag: null as string | null,
//   });

//   // Debounce search query (500ms like Flutter)
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (searchQuery.length >= 3 || searchQuery.length === 0) {
//         setDebouncedSearchQuery(searchQuery);
//         if (searchQuery.length >= 3) {
//           handleSearch();
//         }
//       }
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [searchQuery]);

//   // Get localized text
//   const getLocalizedText = (en: string, np: string) => {
//     return language === 'ne' ? np : en;
//   };

//   // Get tag for service (like Flutter's _serviceTags)
//   const getTagForService = (serviceId?: number): string | undefined => {
//     const tagMap: Record<number, string> = {
//       1: "Best Deal",
//       2: "Bumper Offer",
//       3: "Dashain Offer",
//       4: "Featured",
//     };
//     return serviceId ? tagMap[serviceId] : undefined;
//   };

//   // Transform function (similar to SSR grouping)
//   const transformProfessionalServices = (services: any[]) => {
//     const professionalsMap = new Map<number, any>();
    
//     for (const ps of services) {
//       if (!ps.professional) continue;
      
//       const profId = ps.professional_id;
      
//       if (!professionalsMap.has(profId)) {
//         const serviceAreas = ps.professional.service_areas || [];
        
//         // Create display string
//         const serviceAreasDisplay = serviceAreas
//           .map((area: any) => {
//             const parts = area.name.split('-');
//             return parts.length > 0 ? parts[0] : area.name;
//           })
//           .filter((value: string, index: number, self: string[]) => self.indexOf(value) === index)
//           .slice(0, 3)
//           .join(', ') + (serviceAreas.length > 3 ? '...' : '');
        
//         // Create full list for dialog
//         const allServiceAreasList = serviceAreas
//           .map((area: any) => area.name.replaceAll('-', ' - '))
//           .filter((value: string, index: number, self: string[]) => self.indexOf(value) === index);
        
//         // Parse skills
//         const skillsString = ps.professional.skill || 'N/A';
//         const allSkillsList = skillsString === 'N/A' 
//           ? ['N/A'] 
//           : skillsString.split(RegExp('[/,]')).map((s: string) => s.trim());
        
//         const uniqueSkillsList = [...new Set(allSkillsList)];
        
//         professionalsMap.set(profId, {
//           id: profId,
//           user_id: ps.professional.user_id,
//           professional_id: profId,
//           full_name: ps.professional.user.full_name,
//           profile_image_url: ps.professional.user.profile_image || '',
//           all_skills: uniqueSkillsList.join(', '),
//           all_skills_list: uniqueSkillsList,
//           service_areas_full: serviceAreas,
//           service_areas_display: serviceAreasDisplay,
//           all_service_areas_list: allServiceAreasList,
//           services: [],
//           all_prices: [],
//           service_names: [],
//           service_ids: [],
//           tag: getTagForService(ps.service?.id),
//         });
//       }
      
//       const professional = professionalsMap.get(profId)!;
      
//       // Add service (avoid duplicates)
//       const serviceExists = professional.services.some((s: any) => s.id === ps.id);
//       if (!serviceExists) {
//         professional.services.push(ps);
//       }
      
//       // Add service ID
//       if (ps.service?.id && !professional.service_ids.includes(ps.service.id)) {
//         professional.service_ids.push(ps.service.id);
//       }
      
//       // Add service name
//       if (ps.service?.name_en && !professional.service_names.includes(ps.service.name_en)) {
//         professional.service_names.push(ps.service.name_en);
//       }
      
//       // Add prices
//       if (ps.prices) {
//         for (const price of ps.prices) {
//           const priceExists = professional.all_prices.some((p: any) => p.id === price.id);
//           if (!priceExists) {
//             professional.all_prices.push(price);
//           }
//         }
//       }
//     }
    
//     return Array.from(professionalsMap.values()).map((prof: any) => ({
//       ...prof,
//       service_name: prof.service_names.join(', '),
//       is_minimum_price: prof.all_prices.some((p: any) => p.is_minimum_price),
//       has_discount: prof.all_prices.some((p: any) => p.discount_is_active && p.discount_percentage > 0),
//     }));
//   };

//   // Handle search when debounced query changes
//   const handleSearch = async () => {
//     if (isSingleProfessionalView || specificProfessionalId) return;
    
//     setIsSearchLoading(true);
//     try {
//       const response = await fetchProfessionalServices({
//         page: 1,
//         per_page: 20,
//         search: debouncedSearchQuery || undefined,
//       });
      
//       const transformedData = transformProfessionalServices(response.professional_services);
      
//       setAllProfessionals(transformedData);
//       setDisplayProfessionals(transformedData);
//       setCurrentPage(response.page);
//       setTotalPages(response.total_pages);
//       setTotalResults(response.total);
//       setHasMorePages(response.page < response.total_pages);
//     } catch (error) {
//       console.error('Error searching professionals:', error);
//     } finally {
//       setIsSearchLoading(false);
//     }
//   };

//   // Load more professionals (infinite scroll)
//   const loadMoreProfessionals = useCallback(async () => {
//     if (isLoadingMore || !hasMorePages || isSingleProfessionalView || specificProfessionalId) return;
    
//     setIsLoadingMore(true);
//     try {
//       const nextPage = currentPage + 1;
//       const response = await fetchProfessionalServices({
//         page: nextPage,
//         per_page: 20,
//         search: debouncedSearchQuery || undefined,
//       });
      
//       const transformedData = transformProfessionalServices(response.professional_services);
      
//       setAllProfessionals(prev => [...prev, ...transformedData]);
//       setDisplayProfessionals(prev => [...prev, ...transformedData]);
//       setCurrentPage(response.page);
//       setHasMorePages(response.page < response.total_pages);
//     } catch (error) {
//       console.error('Error loading more professionals:', error);
//     } finally {
//       setIsLoadingMore(false);
//     }
//   }, [currentPage, hasMorePages, isLoadingMore, debouncedSearchQuery, isSingleProfessionalView, specificProfessionalId]);

//   // Set up intersection observer for infinite scroll
//   useEffect(() => {
//     if (isSingleProfessionalView || specificProfessionalId) return;
    
//     const observer = new IntersectionObserver(
//       (entries) => {
//         const first = entries[0];
//         if (first.isIntersecting && hasMorePages && !isLoadingMore) {
//           loadMoreProfessionals();
//         }
//       },
//       { threshold: 0.1, rootMargin: '100px' }
//     );

//     if (loaderRef.current) {
//       observer.observe(loaderRef.current);
//     }

//     return () => observer.disconnect();
//   }, [hasMorePages, isLoadingMore, loadMoreProfessionals, isSingleProfessionalView, specificProfessionalId]);

//   // Define filter sections for FilterSheet
//   const filterSections: FilterSection[] = [
//     {
//       id: 'searchType',
//       titleEn: 'Search By',
//       titleNp: 'खोजी आधार',
//       type: 'single',
//       options: searchFilterOptions,
//     },
//     {
//       id: 'priceRange',
//       titleEn: 'Price Range',
//       titleNp: 'मूल्य सीमा',
//       type: 'single',
//       options: priceFilterOptions.map(opt => ({
//         id: opt.id,
//         labelEn: opt.labelEn,
//         labelNp: opt.labelNp,
//         value: opt.value,
//       })),
//     },
//     {
//       id: 'serviceTag',
//       titleEn: 'Service Tag',
//       titleNp: 'सेवा ट्याग',
//       type: 'single',
//       options: serviceTags.map(tag => ({
//         id: tag.id,
//         labelEn: tag.label,
//         labelNp: tag.label,
//       })),
//     },
//     {
//       id: 'sortBy',
//       titleEn: 'Sort By',
//       titleNp: 'क्रमबद्ध गर्नुहोस्',
//       type: 'single',
//       options: sortOptions,
//     },
//     {
//       id: 'special',
//       titleEn: 'Special Filters',
//       titleNp: 'विशेष फिल्टरहरू',
//       type: 'multiple',
//       options: [
//         { id: 'hasDiscount', labelEn: 'Has Discounts', labelNp: 'छुट उपलब्ध', icon: <Tag className="h-3 w-3" /> },
//         { id: 'hasMinimumPrice', labelEn: 'Has Minimum Price', labelNp: 'न्यूनतम मूल्य', icon: <DollarSign className="h-3 w-3" /> },
//       ],
//     },
//   ];

//   // Handle filter sheet apply
//   const handleApplyFilters = (filters: Record<string, any>) => {
//     setFilterSheetFilters({
//       searchType: filters.searchType || 'professionalName',
//       priceRange: filters.priceRange || null,
//       sortBy: filters.sortBy || 'name_asc',
//       hasDiscount: filters.special?.includes('hasDiscount') || false,
//       hasMinimumPrice: filters.special?.includes('hasMinimumPrice') || false,
//       location: filters.location || null,
//       selectedTag: filters.serviceTag || null,
//     });
    
//     setFilterType((filters.searchType || 'professionalName') as FilterType);
//     setSelectedTag(filters.serviceTag || null);
    
//     if (filters.priceRange) {
//       const selected = priceFilterOptions.find(opt => opt.id === filters.priceRange);
//       setSelectedPriceRange(selected?.value || null);
//     } else {
//       setSelectedPriceRange(null);
//     }
//   };

//   // Handle filter sheet reset
//   const handleResetFilters = () => {
//     setFilterSheetFilters({
//       searchType: 'professionalName',
//       priceRange: null,
//       sortBy: 'name_asc',
//       hasDiscount: false,
//       hasMinimumPrice: false,
//       location: null,
//       selectedTag: null,
//     });
//     setFilterType('professionalName');
//     setSelectedPriceRange(null);
//     setSelectedTag(null);
//     setSearchQuery('');
//     setDebouncedSearchQuery('');
//   };

//   // Initialize display professionals based on props
//   useEffect(() => {
//     if (specificProfessionalId) {
//       const filtered = allProfessionals.filter(
//         professional => professional.id === specificProfessionalId
//       );
//       setDisplayProfessionals(filtered);
//     } else {
//       setDisplayProfessionals(allProfessionals);
//     }
//   }, [allProfessionals, specificProfessionalId]);

//   // Get display items for each type
//   const getDisplayItems = (professional: any, type: 'services' | 'skills' | 'service_areas') => {
//     switch (type) {
//       case 'services':
//         return professional.services?.map((s: any) => s.service?.name_en || s.name) || 
//                [professional.service_name].filter(Boolean);
//       case 'skills':
//         return professional.all_skills_list || [];
//       case 'service_areas':
//         return professional.all_service_areas_list || [];
//       default:
//         return [];
//     }
//   };

//   // Render truncated list with "View all" option
//   const renderTruncatedList = (items: any[], maxItems: number, type: 'service_areas' | 'services' | 'skills', professional: any) => {
//     if (!items || items.length === 0) {
//       return (
//         <p className="text-sm text-muted-foreground">
//           {getLocalizedText('None listed', 'सूचीबद्ध छैन')}
//         </p>
//       );
//     }

//     const displayItems = items.slice(0, maxItems);
//     const hasMore = items.length > maxItems;

//     return (
//       <div className="space-y-1">
//         {displayItems.map((item, index) => (
//           <div key={index} className="text-sm line-clamp-1">
//             {typeof item === 'string' ? item : item.name}
//           </div>
//         ))}
//         {hasMore && (
//           <Button
//             variant="link"
//             size="sm"
//             className="h-auto p-0 text-primary"
//             onClick={() => {
//               setSelectedProfessional(professional);
//               setDetailType(type);
//               setShowDetailsDialog(true);
//             }}
//           >
//             {getLocalizedText('View all', 'सबै हेर्नुहोस्')} ({items.length})
//           </Button>
//         )}
//       </div>
//     );
//   };

//   // Calculate price range
//   const calculatePriceRange = (prices: any[]) => {
//     if (!prices || prices.length === 0) {
//       return {
//         min: null,
//         max: null,
//         hasDiscount: false,
//         hasMinPrice: false,
//         formatted: getLocalizedText('Price not set', 'मूल्य सेट गरिएको छैन')
//       };
//     }

//     // Calculate actual prices considering discounts
//     const actualPrices = prices.map((price: any) => {
//       if (price.discount_is_active && price.discount_percentage > 0) {
//         return Math.floor(price.price * (1 - price.discount_percentage / 100));
//       }
//       return price.price;
//     });

//     const min = Math.min(...actualPrices);
//     const max = Math.max(...actualPrices);
//     const hasDiscount = prices.some((p: any) => p.discount_is_active && p.discount_percentage > 0);
//     const hasMinPrice = prices.some((p: any) => p.is_minimum_price);

//     let formatted = '';
//     if (min === max) {
//       formatted = `Rs. ${min}`;
//       if (hasDiscount) {
//         const originalPrice = prices.find(p => 
//           p.discount_is_active && 
//           p.discount_percentage > 0 && 
//           Math.floor(p.price * (1 - p.discount_percentage / 100)) === min
//         )?.price;
//         if (originalPrice) {
//           formatted += ` ${getLocalizedText('(Save', '(बचत गर्नुहोस्')} Rs. ${originalPrice - min})`;
//         }
//       }
//     } else {
//       formatted = `Rs. ${min} - Rs. ${max}`;
//     }

//     if (hasMinPrice) {
//       formatted = `${getLocalizedText('Starts from', 'सुरु हुन्छ')} ${formatted}`;
//     }

//     return {
//       min,
//       max,
//       hasDiscount,
//       hasMinPrice,
//       formatted,
//       actualPrices
//     };
//   };

//   // Group prices by service
//   const groupPricesByService = (prices: any[]) => {
//     const grouped: Record<string, any[]> = {};
    
//     prices?.forEach((price: any) => {
//       const serviceName = price.service?.name_en || price.service_name || getLocalizedText('General Service', 'सामान्य सेवा');
//       if (!grouped[serviceName]) {
//         grouped[serviceName] = [];
//       }
//       grouped[serviceName].push(price);
//     });
    
//     return grouped;
//   };

//   // Format individual price
//   const formatIndividualPrice = (price: any) => {
//     const hasDiscount = price.discount_is_active && price.discount_percentage > 0;
//     const actualPrice = hasDiscount 
//       ? Math.floor(price.price * (1 - price.discount_percentage / 100))
//       : price.price;
    
//     let formatted = `Rs. ${actualPrice}`;
    
//     if (hasDiscount) {
//       formatted += ` ${getLocalizedText('(was', '(पहिले')} Rs. ${price.price})`;
//     }
    
//     if (price.quality_type?.name) {
//       formatted += ` - ${price.quality_type.name}`;
//     }
    
//     if (price.price_unit?.name) {
//       formatted += ` / ${price.price_unit.name}`;
//     }
    
//     if (price.is_minimum_price) {
//       formatted += ` (${getLocalizedText('Minimum price', 'न्यूनतम मूल्य')})`;
//     }
    
//     return formatted;
//   };

//   // Get dialog title based on detail type
//   const getDialogTitle = () => {
//     if (!selectedProfessional || !detailType) return '';
    
//     const titles: Record<string, string> = {
//       service_areas: getLocalizedText('Service Areas', 'सेवा क्षेत्रहरू'),
//       services: getLocalizedText('Services', 'सेवाहरू'),
//       skills: getLocalizedText('Skills', 'कौशलहरू'),
//       prices: getLocalizedText('Service Prices', 'सेवा मूल्यहरू')
//     };
    
//     return `${selectedProfessional.full_name}'s ${titles[detailType]}`;
//   };

//   // Filter and sort professionals (client-side filtering)
//   const filteredProfessionals = displayProfessionals
//     .filter((professional) => {
//       const query = debouncedSearchQuery.toLowerCase();
      
//       // Location filter from URL params
//       const province = searchParams?.get('province');
//       const district = searchParams?.get('district');
//       const municipality = searchParams?.get('municipality');
      
//       if (province || district || municipality) {
//         const hasMatchingLocation = professional.service_areas_full?.some((area: any) => {
//           const areaName = area.name?.toLowerCase() || '';
//           const provinceMatch = province ? areaName.includes(province.toLowerCase()) : true;
//           const districtMatch = district ? areaName.includes(district.toLowerCase()) : true;
//           const municipalityMatch = municipality ? areaName.includes(municipality.toLowerCase()) : true;
//           return provinceMatch && districtMatch && municipalityMatch;
//         });
//         if (!hasMatchingLocation) return false;
//       }
      
//       // Filter sheet location filter
//       if (filterSheetFilters.location) {
//         const locationLower = filterSheetFilters.location.toLowerCase();
//         const hasMatchingLocation = professional.service_areas_full?.some((area: any) =>
//           area.name?.toLowerCase().includes(locationLower)
//         ) || professional.service_areas_display?.toLowerCase().includes(locationLower);
//         if (!hasMatchingLocation) return false;
//       }
      
//       // Tag filter
//       if (filterSheetFilters.selectedTag) {
//         if (professional.tag !== filterSheetFilters.selectedTag) return false;
//       }
      
//       // Price filter with discount calculation (like Flutter)
//       if (filterSheetFilters.priceRange) {
//         const range = priceFilterOptions.find(r => r.id === filterSheetFilters.priceRange);
//         if (!range) return true;
        
//         // Calculate effective prices with discounts
//         const effectivePrices = professional.all_prices?.map((price: any) => {
//           if (price.discount_is_active && price.discount_percentage > 0) {
//             return price.price * (1 - price.discount_percentage / 100);
//           }
//           return price.price;
//         }) || [];
        
//         if (effectivePrices.length === 0) return false;
        
//         const minPrice = Math.min(...effectivePrices);
//         const maxPrice = Math.max(...effectivePrices);
        
//         switch (range.value) {
//           case 300:
//             return maxPrice <= 300;
//           case 800:
//             return minPrice > 300 && maxPrice <= 800;
//           case 1500:
//             return minPrice > 800 && maxPrice <= 1500;
//           case 3000:
//             return minPrice > 1500 && maxPrice <= 3000;
//           case 3001:
//             return minPrice > 3000;
//           default:
//             return true;
//         }
//       }
      
//       // Special filters
//       if (filterSheetFilters.hasDiscount) {
//         const hasDiscount = professional.all_prices?.some((price: any) => 
//           price.discount_is_active && price.discount_percentage > 0
//         );
//         if (!hasDiscount) return false;
//       }
      
//       if (filterSheetFilters.hasMinimumPrice) {
//         const hasMinPrice = professional.all_prices?.some((price: any) => 
//           price.is_minimum_price
//         );
//         if (!hasMinPrice) return false;
//       }
      
//       // Search filter based on type (like Flutter)
//       if (query && query.length >= 3) {
//         switch (filterSheetFilters.searchType) {
//           case 'professionalName':
//             return professional.full_name?.toLowerCase().includes(query);
//           case 'serviceName':
//             return professional.service_names?.some((name: string) => 
//               name.toLowerCase().includes(query)
//             );
//           case 'skills':
//             return professional.all_skills?.toLowerCase().includes(query) ||
//                    professional.all_skills_list?.some((skill: string) => 
//                      skill.toLowerCase().includes(query)
//                    );
//           case 'address':
//             return professional.service_areas_display?.toLowerCase().includes(query) ||
//                    professional.all_service_areas_list?.some((area: string) => 
//                      area.toLowerCase().includes(query)
//                    );
//           case 'serviceTag':
//             return professional.tag?.toLowerCase().includes(query);
//           case 'priceRange':
//             return professional.all_prices?.some((price: any) => 
//               price.price.toString().includes(query) ||
//               price.price_unit?.name?.toLowerCase().includes(query) ||
//               price.quality_type?.name?.toLowerCase().includes(query)
//             );
//           default:
//             return true;
//         }
//       }
      
//       return true;
//     })
//     .sort((a, b) => {
//       switch (filterSheetFilters.sortBy) {
//         case 'name_asc':
//           return (a.full_name || '').localeCompare(b.full_name || '');
//         case 'name_desc':
//           return (b.full_name || '').localeCompare(a.full_name || '');
//         case 'price_low':
//           const aMin = a.all_prices?.length ? Math.min(...a.all_prices.map((p: any) => {
//             if (p.discount_is_active && p.discount_percentage > 0) {
//               return p.price * (1 - p.discount_percentage / 100);
//             }
//             return p.price;
//           })) : Infinity;
//           const bMin = b.all_prices?.length ? Math.min(...b.all_prices.map((p: any) => {
//             if (p.discount_is_active && p.discount_percentage > 0) {
//               return p.price * (1 - p.discount_percentage / 100);
//             }
//             return p.price;
//           })) : Infinity;
//           return aMin - bMin;
//         case 'price_high':
//           const aMax = a.all_prices?.length ? Math.max(...a.all_prices.map((p: any) => {
//             if (p.discount_is_active && p.discount_percentage > 0) {
//               return p.price * (1 - p.discount_percentage / 100);
//             }
//             return p.price;
//           })) : -Infinity;
//           const bMax = b.all_prices?.length ? Math.max(...b.all_prices.map((p: any) => {
//             if (p.discount_is_active && p.discount_percentage > 0) {
//               return p.price * (1 - p.discount_percentage / 100);
//             }
//             return p.price;
//           })) : -Infinity;
//           return bMax - aMax;
//         case 'services':
//           return (b.services?.length || 0) - (a.services?.length || 0);
//         default:
//           return 0;
//       }
//     });

//   const hasActiveFilters = searchQuery || filterSheetFilters.priceRange || 
//     filterSheetFilters.searchType !== 'professionalName' || filterSheetFilters.sortBy !== 'name_asc' ||
//     filterSheetFilters.hasDiscount || filterSheetFilters.hasMinimumPrice || 
//     filterSheetFilters.location || filterSheetFilters.selectedTag;

//   // Handle card options (like Flutter's _showCardOptions)
//   const handleCardOptions = (professional: any, action: 'services' | 'profile' | 'favorite') => {
//     switch (action) {
//       case 'services':
//         router.push(`/professionals/${professional.id}/services`);
//         break;
//       case 'profile':
//         const slug = createProfessionalSlug(professional.full_name, professional.id);
//         router.push(`/professionals/${slug}`);
//         break;
//       case 'favorite':
//         // Add to favorites logic
//         console.log('Add to favorites:', professional.id);
//         break;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Header */}
//       <header className="sticky top-0 z-50 w-full border-b border-border bg-primary text-primary-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//         <div className="container mx-auto flex h-16 items-center justify-between px-4">
//           <div className="flex items-center gap-4">
//             <Button
//               variant="ghost"
//               size="icon"
//               className="text-primary-background hover:bg-primary-background/20"
//               onClick={() => router.back()}
//             >
//               <ChevronRight className="h-5 w-5 rotate-180" />
//             </Button>
            
//             {isSearching && !specificProfessionalId ? (
//               <div className="flex-1 relative">
//                 <Input
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   placeholder={getLocalizedText(
//                     `Search by ${filterType}...`,
//                     `${filterSheetFilters.searchType} द्वारा खोज्नुहोस्...`
//                   )}
//                   className="border-0 bg-transparent text-primary-background placeholder:text-primary-background/70 focus-visible:ring-0 focus-visible:ring-offset-0 pr-8"
//                   autoFocus
//                 />
//                 {isSearchLoading && (
//                   <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-primary-background/70" />
//                 )}
//               </div>
//             ) : (
//               <div>
//                 <h1 className="text-lg font-semibold">
//                   {specificProfessionalId 
//                     ? (filteredProfessionals[0]?.full_name || professionalName)
//                     : (isSingleProfessionalView 
//                       ? professionalName 
//                       : getLocalizedText('Professionals', 'व्यावसायिकहरू'))
//                   }
//                 </h1>
//                 <p className="text-xs text-primary-background/70">
//                   {specificProfessionalId 
//                     ? getLocalizedText('Professional Profile', 'व्यावसायिक प्रोफाइल')
//                     : `${totalResults || filteredProfessionals.length} ${getLocalizedText('professionals', 'व्यावसायिक')}`
//                   }
//                 </p>
//               </div>
//             )}
//           </div>

//           {/* Show search/filter only if not viewing specific professional */}
//           {!specificProfessionalId && !isSingleProfessionalView && (
//             <div className="flex items-center gap-2">
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="text-primary-background hover:bg-primary-background/20"
//                 onClick={() => {
//                   setIsSearching(!isSearching);
//                   if (isSearching) {
//                     setSearchQuery('');
//                     setDebouncedSearchQuery('');
//                   }
//                 }}
//               >
//                 {isSearching ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
//               </Button>

//               <FilterSheet
//                 trigger={
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="text-primary-background hover:bg-primary-background/20 relative"
//                   >
//                     <SlidersHorizontal className="h-5 w-5" />
//                     {hasActiveFilters && (
//                       <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500" />
//                     )}
//                   </Button>
//                 }
//                 sections={filterSections}
//                 activeFilters={{
//                   searchType: filterSheetFilters.searchType,
//                   priceRange: filterSheetFilters.priceRange,
//                   serviceTag: filterSheetFilters.selectedTag,
//                   sortBy: filterSheetFilters.sortBy,
//                   special: [
//                     ...(filterSheetFilters.hasDiscount ? ['hasDiscount'] : []),
//                     ...(filterSheetFilters.hasMinimumPrice ? ['hasMinimumPrice'] : []),
//                   ],
//                 }}
//                 onApplyFilters={handleApplyFilters}
//                 onReset={handleResetFilters}
//                 title={getLocalizedText('Filter Professionals', 'व्यावसायिक फिल्टर गर्नुहोस्')}
//                 description={getLocalizedText(
//                   'Filter professionals by your preferences',
//                   'आफ्नो प्राथमिकता अनुसार व्यावसायिक फिल्टर गर्नुहोस्'
//                 )}
//                 side="right"
//               />
//             </div>
//           )}
//         </div>
//       </header>

//       <main className="container mx-auto px-4 py-6">
//         {/* Active Filters Display */}
//         {hasActiveFilters && !specificProfessionalId && !isSingleProfessionalView && (
//           <div className="mb-4 flex flex-wrap items-center gap-2">
//             <span className="text-sm text-muted-foreground">
//               {getLocalizedText('Active filters:', 'सक्रिय फिल्टरहरू:')}
//             </span>
            
//             {filterSheetFilters.searchType !== 'professionalName' && (
//               <Badge variant="secondary" className="gap-1">
//                 {getLocalizedText('Search by', 'खोजी आधार')}: {
//                   searchFilterOptions.find(o => o.id === filterSheetFilters.searchType)?.[
//                     language === 'ne' ? 'labelNp' : 'labelEn'
//                   ]
//                 }
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   className="ml-1 h-3 w-3 p-0 hover:bg-transparent"
//                   onClick={() => {
//                     setFilterSheetFilters(prev => ({ ...prev, searchType: 'professionalName' }));
//                     setFilterType('professionalName');
//                   }}
//                 >
//                   <X className="h-2 w-2" />
//                 </Button>
//               </Badge>
//             )}
            
//             {filterSheetFilters.priceRange && (
//               <Badge variant="secondary" className="gap-1">
//                 {getLocalizedText('Price', 'मूल्य')}: {
//                   priceFilterOptions.find(o => o.id === filterSheetFilters.priceRange)?.[
//                     language === 'ne' ? 'labelNp' : 'labelEn'
//                   ]
//                 }
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   className="ml-1 h-3 w-3 p-0 hover:bg-transparent"
//                   onClick={() => {
//                     setFilterSheetFilters(prev => ({ ...prev, priceRange: null }));
//                     setSelectedPriceRange(null);
//                   }}
//                 >
//                   <X className="h-2 w-2" />
//                 </Button>
//               </Badge>
//             )}
            
//             {filterSheetFilters.selectedTag && (
//               <Badge variant="secondary" className="gap-1">
//                 {getLocalizedText('Tag', 'ट्याग')}: {filterSheetFilters.selectedTag}
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   className="ml-1 h-3 w-3 p-0 hover:bg-transparent"
//                   onClick={() => {
//                     setFilterSheetFilters(prev => ({ ...prev, selectedTag: null }));
//                     setSelectedTag(null);
//                   }}
//                 >
//                   <X className="h-2 w-2" />
//                 </Button>
//               </Badge>
//             )}
            
//             {filterSheetFilters.sortBy !== 'name_asc' && (
//               <Badge variant="secondary" className="gap-1">
//                 {getLocalizedText('Sort', 'क्रम')}: {
//                   sortOptions.find(o => o.id === filterSheetFilters.sortBy)?.[
//                     language === 'ne' ? 'labelNp' : 'labelEn'
//                   ]
//                 }
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   className="ml-1 h-3 w-3 p-0 hover:bg-transparent"
//                   onClick={() => setFilterSheetFilters(prev => ({ ...prev, sortBy: 'name_asc' }))}
//                 >
//                   <X className="h-2 w-2" />
//                 </Button>
//               </Badge>
//             )}
            
//             {filterSheetFilters.hasDiscount && (
//               <Badge variant="secondary" className="gap-1">
//                 {getLocalizedText('Has Discounts', 'छुट उपलब्ध')}
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   className="ml-1 h-3 w-3 p-0 hover:bg-transparent"
//                   onClick={() => setFilterSheetFilters(prev => ({ ...prev, hasDiscount: false }))}
//                 >
//                   <X className="h-2 w-2" />
//                 </Button>
//               </Badge>
//             )}
            
//             {filterSheetFilters.hasMinimumPrice && (
//               <Badge variant="secondary" className="gap-1">
//                 {getLocalizedText('Has Minimum Price', 'न्यूनतम मूल्य')}
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   className="ml-1 h-3 w-3 p-0 hover:bg-transparent"
//                   onClick={() => setFilterSheetFilters(prev => ({ ...prev, hasMinimumPrice: false }))}
//                 >
//                   <X className="h-2 w-2" />
//                 </Button>
//               </Badge>
//             )}
            
//             {searchQuery && (
//               <Badge variant="secondary" className="gap-1">
//                 {getLocalizedText('Search', 'खोजी')}: {searchQuery}
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   className="ml-1 h-3 w-3 p-0 hover:bg-transparent"
//                   onClick={() => setSearchQuery('')}
//                 >
//                   <X className="h-2 w-2" />
//                 </Button>
//               </Badge>
//             )}

//             <Button
//               variant="ghost"
//               size="sm"
//               className="h-7 text-xs"
//               onClick={handleResetFilters}
//             >
//               {getLocalizedText('Clear all', 'सबै हटाउनुहोस्')}
//             </Button>
//           </div>
//         )}

//         {/* Professionals Grid */}
//         {filteredProfessionals.length === 0 ? (
//           <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed">
//             <User className="mb-4 h-12 w-12 text-muted-foreground" />
//             <p className="text-muted-foreground">
//               {getLocalizedText(
//                 'No professionals found',
//                 'कुनै व्यावसायिक फेला परेन'
//               )}
//             </p>
//             {!specificProfessionalId && (
//               <Button
//                 variant="outline"
//                 className="mt-4"
//                 onClick={handleResetFilters}
//               >
//                 {getLocalizedText('Clear Filters', 'फिल्टर हटाउनुहोस्')}
//               </Button>
//             )}
//           </div>
//         ) : (
//           <>
//             <div className={`grid gap-6 ${specificProfessionalId ? 'grid-cols-1 max-w-2xl mx-auto' : 'grid-cols-1 md:grid-cols-2'}`}>
//               {filteredProfessionals.map((professional) => {
//                 const priceRange = calculatePriceRange(professional.all_prices);
//                 const hasMultiplePrices = professional.all_prices && professional.all_prices.length > 1;
                
//                 return (
//                   <Card 
//                     key={professional.id}
//                     className={`overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col ${specificProfessionalId ? 'border-primary/20 border-2' : ''}`}
//                   >
//                     <CardContent className="p-5 flex-1 flex flex-col">
//                       {/* Header with Avatar, Name and Three-dot menu */}
//                       <div className="flex items-start gap-4 mb-4">
//                         <Avatar className="h-16 w-16 border-2 border-primary/20 flex-shrink-0">
//                           <AvatarImage 
//                             src={professional.profile_image_url || undefined} 
//                             alt={professional.full_name}
//                             className="object-cover" 
//                           />
//                           <AvatarFallback className="bg-primary/10">
//                             {professional.full_name?.charAt(0)?.toUpperCase() || 'P'}
//                           </AvatarFallback>
//                         </Avatar>
                        
//                         <div className="flex-1 min-w-0">
//                           <h3 className="text-lg font-semibold line-clamp-1 mb-1">
//                             {professional.full_name}
//                           </h3>
//                           <div className="flex flex-wrap gap-1">
//                             <Badge variant="secondary" className="text-xs">
//                               {professional.services?.length || 1} {getLocalizedText('services', 'सेवाहरू')}
//                             </Badge>
//                             {professional.tag && (
//                               <Badge variant="outline" className="text-xs">
//                                 <Tag className="h-2.5 w-2.5 mr-1" />
//                                 {professional.tag}
//                               </Badge>
//                             )}
//                             {priceRange.hasMinPrice && (
//                               <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
//                                 {getLocalizedText('Flexible', 'लचिलो')}
//                               </Badge>
//                             )}
//                             {specificProfessionalId && (
//                               <Badge className="text-xs bg-primary text-primary-foreground">
//                                 {getLocalizedText('Featured', 'विशेष')}
//                               </Badge>
//                             )}
//                           </div>
//                         </div>

//                         {/* Three-dot menu */}
//                         {!specificProfessionalId && (
//                           <DropdownMenu>
//                             <DropdownMenuTrigger asChild>
//                               <Button variant="ghost" size="icon" className="h-8 w-8">
//                                 <MoreVertical className="h-4 w-4" />
//                               </Button>
//                             </DropdownMenuTrigger>
//                             <DropdownMenuContent align="end">
//                               <DropdownMenuItem onClick={() => handleCardOptions(professional, 'services')}>
//                                 <Building className="mr-2 h-4 w-4" />
//                                 <span>{getLocalizedText('View All Services', 'सबै सेवाहरू हेर्नुहोस्')}</span>
//                               </DropdownMenuItem>
//                               <DropdownMenuItem onClick={() => handleCardOptions(professional, 'profile')}>
//                                 <User className="mr-2 h-4 w-4" />
//                                 <span>{getLocalizedText('View Profile', 'प्रोफाइल हेर्नुहोस्')}</span>
//                               </DropdownMenuItem>
//                               <DropdownMenuItem onClick={() => handleCardOptions(professional, 'favorite')}>
//                                 <Heart className="mr-2 h-4 w-4" />
//                                 <span>{getLocalizedText('Add to Favorites', 'मनपर्नेमा थप्नुहोस्')}</span>
//                               </DropdownMenuItem>
//                             </DropdownMenuContent>
//                           </DropdownMenu>
//                         )}
//                       </div>

//                       {/* Services */}
//                       <div className="mb-3">
//                         <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
//                           <Building className="h-4 w-4" />
//                           <span className="font-medium">{getLocalizedText('Services', 'सेवाहरू')}:</span>
//                         </div>
//                         {renderTruncatedList(getDisplayItems(professional, 'services'), 3, 'services', professional)}
//                       </div>

//                       {/* Skills */}
//                       <div className="mb-3">
//                         <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
//                           <Award className="h-4 w-4" />
//                           <span className="font-medium">{getLocalizedText('Skills', 'कौशलहरू')}:</span>
//                         </div>
//                         {renderTruncatedList(getDisplayItems(professional, 'skills'), 3, 'skills', professional)}
//                       </div>

//                       {/* Service Areas */}
//                       <div className="mb-4">
//                         <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
//                           <MapPin className="h-4 w-4" />
//                           <span className="font-medium">{getLocalizedText('Service Areas', 'सेवा क्षेत्रहरू')}:</span>
//                         </div>
//                         {renderTruncatedList(getDisplayItems(professional, 'service_areas'), 3, 'service_areas', professional)}
//                       </div>

//                       {/* Price Range */}
//                       {priceRange.min !== null && (
//                         <div className="mb-4 p-3 bg-primary/5 rounded-lg border border-primary/10">
//                           <div className="flex items-center justify-between mb-1">
//                             <div className="flex items-center gap-2">
//                               <DollarSign className="h-4 w-4 text-primary" />
//                               <span className="text-sm font-medium text-primary">
//                                 {getLocalizedText('Price Range', 'मूल्य सीमा')}
//                               </span>
//                             </div>
//                             {priceRange.hasDiscount && (
//                               <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
//                                 {getLocalizedText('Discount', 'छुट')}
//                               </Badge>
//                             )}
//                           </div>
                          
//                           <div className="flex items-center justify-between">
//                             <div>
//                               <p className="text-lg font-bold text-primary">
//                                 {priceRange.formatted}
//                               </p>
//                               {hasMultiplePrices && (
//                                 <p className="text-xs text-muted-foreground mt-1">
//                                   {getLocalizedText('Multiple price options available', 'धेरै मूल्य विकल्पहरू उपलब्ध')}
//                                 </p>
//                               )}
//                             </div>
                            
//                             {hasMultiplePrices && (
//                               <Button
//                                 variant="ghost"
//                                 size="sm"
//                                 className="text-primary hover:text-primary/80 hover:bg-primary/10"
//                                 onClick={() => {
//                                   setSelectedProfessional(professional);
//                                   setShowPricesDialog(true);
//                                 }}
//                               >
//                                 {getLocalizedText('View all', 'सबै हेर्नुहोस्')}
//                                 <ChevronDown className="ml-1 h-4 w-4" />
//                               </Button>
//                             )}
//                           </div>
//                         </div>
//                       )}

//                       {/* Action Buttons */}
//                       <div className="flex gap-2">
//                         <Button 
//                           variant="outline" 
//                           size="sm"
//                           className="flex-1"
//                           onClick={() => {
//                             const slug = createProfessionalSlug(
//                               professional.full_name, 
//                               professional.id
//                             );
//                             router.push(`/professionals/${slug}`);
//                           }}
//                         >
//                           {getLocalizedText('View Profile', 'प्रोफाइल हेर्नुहोस्')}
//                         </Button>
//                         <Button
//                           size="sm"
//                           className="flex-1"
//                           onClick={() => {
//                             const slug = createProfessionalSlug(professional.full_name, professional.id);
//                             router.push(`/professionals/${slug}/services`);
//                           }}
//                         >
//                           {getLocalizedText('View All Services', 'सबै सेवाहरू हेर्नुहोस्')}
//                         </Button>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 );
//               })}
//             </div>

//             {/* Infinite scroll loader */}
//             {!specificProfessionalId && !isSingleProfessionalView && hasMorePages && (
//               <div ref={loaderRef} className="py-8 flex justify-center">
//                 {isLoadingMore && (
//                   <div className="flex items-center gap-2">
//                     <Loader2 className="h-5 w-5 animate-spin text-primary" />
//                     <span className="text-sm text-muted-foreground">
//                       {getLocalizedText('Loading more...', 'थप लोड हुँदै...')}
//                     </span>
//                   </div>
//                 )}
//               </div>
//             )}
//           </>
//         )}
//       </main>

//       {/* Details Dialog */}
//       <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
//         <DialogContent className="max-w-md">
//           <DialogHeader>
//             <DialogTitle>
//               {getDialogTitle()}
//             </DialogTitle>
//             <DialogDescription>
//               {selectedProfessional?.full_name}
//             </DialogDescription>
//           </DialogHeader>
//           <ScrollArea className="max-h-96 pr-4">
//             {detailType && selectedProfessional && (
//               <div className="space-y-2 py-2">
//                 {getDisplayItems(selectedProfessional, detailType).map((item: string, index: number) => (
//                   <div key={index} className="py-2 border-b last:border-0">
//                     <div className="flex items-center gap-2">
//                       {detailType === 'service_areas' && <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
//                       {detailType === 'services' && <Building className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
//                       {detailType === 'skills' && <Award className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
//                       <span className="text-sm">{item}</span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </ScrollArea>
//         </DialogContent>
//       </Dialog>

//       {/* Prices Dialog */}
//       <Dialog open={showPricesDialog} onOpenChange={setShowPricesDialog}>
//         <DialogContent className="max-w-lg">
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2">
//               <DollarSign className="h-5 w-5 text-primary" />
//               {selectedProfessional?.full_name} - {getLocalizedText('Service Prices', 'सेवा मूल्यहरू')}
//             </DialogTitle>
//             <DialogDescription>
//               {getLocalizedText('Detailed pricing for all services', 'सबै सेवाहरूको विस्तृत मूल्य निर्धारण')}
//             </DialogDescription>
//           </DialogHeader>
//           <ScrollArea className="max-h-[60vh] pr-4">
//             {selectedProfessional?.all_prices && (
//               <div className="space-y-4 py-2">
//                 {Object.entries(groupPricesByService(selectedProfessional.all_prices)).map(([serviceName, prices], index) => (
//                   <div key={index} className="space-y-3">
//                     <div>
//                       <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
//                         <Building className="h-4 w-4 text-muted-foreground" />
//                         {serviceName}
//                       </h4>
//                       <div className="space-y-2 pl-6">
//                         {prices.map((price, priceIndex) => (
//                           <div key={priceIndex} className="py-2 border-b last:border-0">
//                             <div className="flex items-start justify-between">
//                               <div>
//                                 <p className="font-medium">
//                                   {formatIndividualPrice(price)}
//                                 </p>
//                                 {price.description && (
//                                   <p className="text-xs text-muted-foreground mt-1">
//                                     {price.description}
//                                   </p>
//                                 )}
//                               </div>
//                               {price.discount_is_active && price.discount_percentage > 0 && (
//                                 <Badge className="bg-red-500 text-white text-xs">
//                                   {price.discount_percentage}% OFF
//                                 </Badge>
//                               )}
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                     {index < Object.keys(groupPricesByService(selectedProfessional.all_prices)).length - 1 && (
//                       <Separator />
//                     )}
//                   </div>
//                 ))}
//               </div>
//             )}
            
//             {/* Summary */}
//             {selectedProfessional?.all_prices && (
//               <div className="mt-6 p-4 bg-primary/5 rounded-lg">
//                 <h4 className="font-semibold text-sm mb-2">{getLocalizedText('Price Summary', 'मूल्य सारांश')}</h4>
//                 <div className="space-y-2">
//                   <div className="flex justify-between text-sm">
//                     <span className="text-muted-foreground">{getLocalizedText('Total services', 'कुल सेवाहरू')}</span>
//                     <span className="font-medium">
//                       {Object.keys(groupPricesByService(selectedProfessional.all_prices)).length}
//                     </span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-muted-foreground">{getLocalizedText('Total price options', 'कुल मूल्य विकल्पहरू')}</span>
//                     <span className="font-medium">{selectedProfessional.all_prices.length}</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-muted-foreground">{getLocalizedText('Discounted options', 'छुट भएका विकल्पहरू')}</span>
//                     <span className="font-medium text-green-600">
//                       {selectedProfessional.all_prices.filter((p: any) => p.discount_is_active && p.discount_percentage > 0).length}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </ScrollArea>
//           <div className="mt-4">
//             <Button
//               className="w-full"
//               onClick={() => {
//                 setShowPricesDialog(false);
//                 if (selectedProfessional?.services?.length === 1) {
//                   router.push(`/services/${selectedProfessional.services[0].service_id}/professionals`);
//                 } else {
//                   router.push(`/professionals/${selectedProfessional?.id}/services`);
//                 }
//               }}
//             >
//               {getLocalizedText('Book Service Now', 'सेवा बुक गर्नुहोस्')}
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }


// app/professionals/professionals-client.tsx
'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'; 
import { useI18n } from '@/lib/i18n/context';
import { useRouter, useSearchParams } from 'next/navigation'; 
import { 
  Search, 
  X, 
  ChevronRight,
  User,
  MapPin,
  DollarSign,
  Building,
  Award,
  Tag,
  ChevronDown,
  SlidersHorizontal,
  Star,
  MoreVertical,
  Heart,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { createProfessionalSlug } from '@/lib/utils/slug';
import { FilterSheet, FilterSection } from '@/components/ui/filter-sheet';
import { fetchProfessionalServices } from '@/lib/api/professional-services';

interface ProfessionalsClientProps {
  professionalsData: any[];
  totalPages?: number;
  currentPage?: number;
  totalResults?: number;
  isSingleProfessionalView?: boolean;
  professionalName?: string;
  specificProfessionalId?: number;
}

type FilterType = 'professionalName' | 'serviceName' | 'skills' | 'address' | 'serviceTag' | 'priceRange';

// Updated price ranges to match Flutter (5 ranges)
const priceRanges = [
  { id: 'under_300', label: '< Rs. 300', value: 300 },
  { id: '300_800', label: 'Rs. 300 - Rs. 800', value: 800 },
  { id: '800_1500', label: 'Rs. 800 - Rs. 1500', value: 1500 },
  { id: '1500_3000', label: 'Rs. 1500 - Rs. 3000', value: 3000 },
  { id: 'above_3000', label: '> Rs. 3000', value: 3001 },
];

// Service tags (like Flutter's _serviceTags)
const serviceTags = [
  { id: 'best_deal', label: 'Best Deal' },
  { id: 'bumper_offer', label: 'Bumper Offer' },
  { id: 'dashain_offer', label: 'Dashain Offer' },
  { id: 'featured', label: 'Featured' },
];

// Updated search filter options with new types
const searchFilterOptions = [
  { id: 'professionalName', labelEn: 'By Professional Name', labelNp: 'व्यावसायिक नाम द्वारा', icon: <User className="h-3 w-3" /> },
  { id: 'serviceName', labelEn: 'By Service Name', labelNp: 'सेवा नाम द्वारा', icon: <Building className="h-3 w-3" /> },
  { id: 'skills', labelEn: 'By Skills', labelNp: 'कौशल द्वारा', icon: <Award className="h-3 w-3" /> },
  { id: 'address', labelEn: 'By Service Area', labelNp: 'सेवा क्षेत्र द्वारा', icon: <MapPin className="h-3 w-3" /> },
  { id: 'serviceTag', labelEn: 'By Service Tag', labelNp: 'सेवा ट्याग द्वारा', icon: <Tag className="h-3 w-3" /> },
  { id: 'priceRange', labelEn: 'By Price Range', labelNp: 'मूल्य सीमा द्वारा', icon: <DollarSign className="h-3 w-3" /> },
];

const priceFilterOptions = [
  { id: 'under_300', labelEn: 'Under Rs. 300', labelNp: 'रु. ३०० मुनि', value: 300 },
  { id: '300_800', labelEn: 'Rs. 300 - Rs. 800', labelNp: 'रु. ३०० - रु. ८००', value: 800 },
  { id: '800_1500', labelEn: 'Rs. 800 - Rs. 1500', labelNp: 'रु. ८०० - रु. १५००', value: 1500 },
  { id: '1500_3000', labelEn: 'Rs. 1500 - Rs. 3000', labelNp: 'रु. १५०० - रु. ३०००', value: 3000 },
  { id: 'above_3000', labelEn: 'Above Rs. 3000', labelNp: 'रु. ३००० माथि', value: 3001 },
];

const sortOptions = [
  { id: 'name_asc', labelEn: 'Name (A to Z)', labelNp: 'नाम (A देखि Z)', icon: <User className="h-3 w-3" /> },
  { id: 'name_desc', labelEn: 'Name (Z to A)', labelNp: 'नाम (Z देखि A)', icon: <User className="h-3 w-3" /> },
  { id: 'price_low', labelEn: 'Price: Low to High', labelNp: 'मूल्य: न्यून देखि उच्च', icon: <DollarSign className="h-3 w-3" /> },
  { id: 'price_high', labelEn: 'Price: High to Low', labelNp: 'मूल्य: उच्च देखि न्यून', icon: <DollarSign className="h-3 w-3" /> },
  { id: 'services', labelEn: 'Most Services', labelNp: 'धेरै सेवाहरू', icon: <Star className="h-3 w-3" /> },
];

export function ProfessionalsClient({
  professionalsData: initialProfessionalsData,
  totalPages: initialTotalPages = 1,
  currentPage: initialCurrentPage = 1,
  totalResults: initialTotalResults = 0,
  isSingleProfessionalView = false,
  professionalName,
  specificProfessionalId,
}: ProfessionalsClientProps) {
  const { language } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State for professionals data and pagination
// With:
const [allProfessionals, setAllProfessionals] = useState<any[]>(() => {
  // Deduplicate initial data
  const unique = initialProfessionalsData.reduce((acc, current) => {
    const exists = acc.find((item: { id: any; }) => item.id === current.id);
    if (!exists) {
      acc.push(current);
    }
    return acc;
  }, []);
  return unique;
});

const [displayProfessionals, setDisplayProfessionals] = useState<any[]>(() => {
  const unique = initialProfessionalsData.reduce((acc, current) => {
    const exists = acc.find((item: { id: any; }) => item.id === current.id);
    if (!exists) {
      acc.push(current);
    }
    return acc;
  }, []);
  return unique;
});
  const [currentPage, setCurrentPage] = useState(initialCurrentPage);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [totalResults, setTotalResults] = useState(initialTotalResults);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMorePages, setHasMorePages] = useState(currentPage < totalPages);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);
  
  // Filter state
  const [filterType, setFilterType] = useState<FilterType>('professionalName');
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<any>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showPricesDialog, setShowPricesDialog] = useState(false);
  const [detailType, setDetailType] = useState<'service_areas' | 'services' | 'skills' | null>(null);
  
  // Refs for infinite scroll
  const loaderRef = useRef<HTMLDivElement>(null);
  
  // Filter sheet state
  const [filterSheetFilters, setFilterSheetFilters] = useState({
    searchType: 'professionalName',
    priceRange: null as string | null,
    sortBy: 'name_asc',
    hasDiscount: false,
    hasMinimumPrice: false,
    location: null as string | null,
    selectedTag: null as string | null,
  });

  // Get localized text
  const getLocalizedText = (en: string, np: string) => {
    return language === 'ne' ? np : en;
  };

  // Get tag for service (like Flutter's _serviceTags)
  const getTagForService = (serviceId?: number): string | undefined => {
    const tagMap: Record<number, string> = {
      1: "Best Deal",
      2: "Bumper Offer",
      3: "Dashain Offer",
      4: "Featured",
    };
    return serviceId ? tagMap[serviceId] : undefined;
  };

  // Transform function (similar to SSR grouping)
  const transformProfessionalServices = (services: any[]) => {
    const professionalsMap = new Map<number, any>();
    
    for (const ps of services) {
      if (!ps.professional) continue;
      
      const profId = ps.professional_id;
      
      if (!professionalsMap.has(profId)) {
        const serviceAreas = ps.professional.service_areas || [];
        
        // Create display string
        const serviceAreasDisplay = serviceAreas
          .map((area: any) => {
            const parts = area.name.split('-');
            return parts.length > 0 ? parts[0] : area.name;
          })
          .filter((value: string, index: number, self: string[]) => self.indexOf(value) === index)
          .slice(0, 3)
          .join(', ') + (serviceAreas.length > 3 ? '...' : '');
        
        // Create full list for dialog
        const allServiceAreasList = serviceAreas
          .map((area: any) => area.name.replaceAll('-', ' - '))
          .filter((value: string, index: number, self: string[]) => self.indexOf(value) === index);
        
        // Parse skills
        const skillsString = ps.professional.skill || 'N/A';
        const allSkillsList = skillsString === 'N/A' 
          ? ['N/A'] 
          : skillsString.split(RegExp('[/,]')).map((s: string) => s.trim());
        
        const uniqueSkillsList = [...new Set(allSkillsList)];
        
        professionalsMap.set(profId, {
          id: profId,
          user_id: ps.professional.user_id,
          professional_id: profId,
          full_name: ps.professional.user.full_name,
          profile_image_url: ps.professional.user.profile_image || '',
          all_skills: uniqueSkillsList.join(', '),
          all_skills_list: uniqueSkillsList,
          service_areas_full: serviceAreas,
          service_areas_display: serviceAreasDisplay,
          all_service_areas_list: allServiceAreasList,
          services: [],
          all_prices: [],
          service_names: [],
          service_ids: [],
          tag: getTagForService(ps.service?.id),
        });
      }
      
      const professional = professionalsMap.get(profId)!;
      
      // Add service (avoid duplicates)
      const serviceExists = professional.services.some((s: any) => s.id === ps.id);
      if (!serviceExists) {
        professional.services.push(ps);
      }
      
      // Add service ID
      if (ps.service?.id && !professional.service_ids.includes(ps.service.id)) {
        professional.service_ids.push(ps.service.id);
      }
      
      // Add service name
      if (ps.service?.name_en && !professional.service_names.includes(ps.service.name_en)) {
        professional.service_names.push(ps.service.name_en);
      }
      
      // Add prices
      if (ps.prices) {
        for (const price of ps.prices) {
          const priceExists = professional.all_prices.some((p: any) => p.id === price.id);
          if (!priceExists) {
            professional.all_prices.push(price);
          }
        }
      }
    }
    
    return Array.from(professionalsMap.values()).map((prof: any) => ({
      ...prof,
      service_name: prof.service_names.join(', '),
      is_minimum_price: prof.all_prices.some((p: any) => p.is_minimum_price),
      has_discount: prof.all_prices.some((p: any) => p.discount_is_active && p.discount_percentage > 0),
    }));
  };

  // Handle search when debounced query changes
  const handleSearch = async () => {
    if (isSingleProfessionalView || specificProfessionalId) return;
    
    setIsSearchLoading(true);
    try {
      const response = await fetchProfessionalServices({
        page: 1,
        per_page: 20,
        search: debouncedSearchQuery || undefined,
      });
      
      const transformedData = transformProfessionalServices(response.professional_services);
      
      setAllProfessionals(transformedData);
      setDisplayProfessionals(transformedData);
      setCurrentPage(response.page);
      setTotalPages(response.total_pages);
      setTotalResults(response.total);
      setHasMorePages(response.page < response.total_pages);
    } catch (error) {
      console.error('Error searching professionals:', error);
    } finally {
      setIsSearchLoading(false);
    }
  };

  // Debounce search query (500ms like Flutter)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length >= 3 || searchQuery.length === 0) {
        setDebouncedSearchQuery(searchQuery);
        if (searchQuery.length >= 3) {
          setIsSearchMode(true);
          handleSearch();
        } else if (searchQuery.length === 0) {
          setIsSearchMode(false);
          // Reset to initial data when search is cleared
          setDisplayProfessionals(allProfessionals);
        }
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load more professionals (infinite scroll)
 const loadMoreProfessionals = useCallback(async () => {
  if (isLoadingMore || !hasMorePages || isSingleProfessionalView || specificProfessionalId) return;
  
  setIsLoadingMore(true);
  try {
    const nextPage = currentPage + 1;
    const response = await fetchProfessionalServices({
      page: nextPage,
      per_page: 20,
      search: isSearchMode ? debouncedSearchQuery : undefined,
    });
    
    const transformedData = transformProfessionalServices(response.professional_services);
    
    // DEDUPLICATE: Only add professionals that don't already exist
    setAllProfessionals(prev => {
      const existingIds = new Set(prev.map(p => p.id));
      const newUniqueProfessionals = transformedData.filter(p => !existingIds.has(p.id));
      return [...prev, ...newUniqueProfessionals];
    });
    
    setDisplayProfessionals(prev => {
      const existingIds = new Set(prev.map(p => p.id));
      const newUniqueProfessionals = transformedData.filter(p => !existingIds.has(p.id));
      return [...prev, ...newUniqueProfessionals];
    });
    
    setCurrentPage(response.page);
    setHasMorePages(response.page < response.total_pages);
  } catch (error) {
    console.error('Error loading more professionals:', error);
  } finally {
    setIsLoadingMore(false);
  }
}, [currentPage, hasMorePages, isLoadingMore, debouncedSearchQuery, isSearchMode, isSingleProfessionalView, specificProfessionalId]);

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    if (isSingleProfessionalView || specificProfessionalId) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMorePages && !isLoadingMore) {
          loadMoreProfessionals();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [hasMorePages, isLoadingMore, loadMoreProfessionals, isSingleProfessionalView, specificProfessionalId]);

  // Define filter sections for FilterSheet
  const filterSections: FilterSection[] = [
    {
      id: 'searchType',
      titleEn: 'Search By',
      titleNp: 'खोजी आधार',
      type: 'single',
      options: searchFilterOptions,
    },
    {
      id: 'priceRange',
      titleEn: 'Price Range',
      titleNp: 'मूल्य सीमा',
      type: 'single',
      options: priceFilterOptions.map(opt => ({
        id: opt.id,
        labelEn: opt.labelEn,
        labelNp: opt.labelNp,
        value: opt.value,
      })),
    },
    {
      id: 'serviceTag',
      titleEn: 'Service Tag',
      titleNp: 'सेवा ट्याग',
      type: 'single',
      options: serviceTags.map(tag => ({
        id: tag.id,
        labelEn: tag.label,
        labelNp: tag.label,
      })),
    },
    {
      id: 'sortBy',
      titleEn: 'Sort By',
      titleNp: 'क्रमबद्ध गर्नुहोस्',
      type: 'single',
      options: sortOptions,
    },
    {
      id: 'special',
      titleEn: 'Special Filters',
      titleNp: 'विशेष फिल्टरहरू',
      type: 'multiple',
      options: [
        { id: 'hasDiscount', labelEn: 'Has Discounts', labelNp: 'छुट उपलब्ध', icon: <Tag className="h-3 w-3" /> },
        { id: 'hasMinimumPrice', labelEn: 'Has Minimum Price', labelNp: 'न्यूनतम मूल्य', icon: <DollarSign className="h-3 w-3" /> },
      ],
    },
  ];

  // Handle filter sheet apply
  const handleApplyFilters = (filters: Record<string, any>) => {
    setFilterSheetFilters({
      searchType: filters.searchType || 'professionalName',
      priceRange: filters.priceRange || null,
      sortBy: filters.sortBy || 'name_asc',
      hasDiscount: filters.special?.includes('hasDiscount') || false,
      hasMinimumPrice: filters.special?.includes('hasMinimumPrice') || false,
      location: filters.location || null,
      selectedTag: filters.serviceTag || null,
    });
    
    setFilterType((filters.searchType || 'professionalName') as FilterType);
    setSelectedTag(filters.serviceTag || null);
    
    if (filters.priceRange) {
      const selected = priceFilterOptions.find(opt => opt.id === filters.priceRange);
      setSelectedPriceRange(selected?.value || null);
    } else {
      setSelectedPriceRange(null);
    }
  };

  // Handle filter sheet reset
  const handleResetFilters = () => {
    setFilterSheetFilters({
      searchType: 'professionalName',
      priceRange: null,
      sortBy: 'name_asc',
      hasDiscount: false,
      hasMinimumPrice: false,
      location: null,
      selectedTag: null,
    });
    setFilterType('professionalName');
    setSelectedPriceRange(null);
    setSelectedTag(null);
    setSearchQuery('');
    setDebouncedSearchQuery('');
    setIsSearchMode(false);
  };

  // Initialize display professionals based on props
  useEffect(() => {
    if (specificProfessionalId) {
      const filtered = allProfessionals.filter(
        professional => professional.id === specificProfessionalId
      );
      setDisplayProfessionals(filtered);
    } else {
      setDisplayProfessionals(allProfessionals);
    }
  }, [allProfessionals, specificProfessionalId]);

  // Get display items for each type
  const getDisplayItems = (professional: any, type: 'services' | 'skills' | 'service_areas') => {
    switch (type) {
      case 'services':
        return professional.services?.map((s: any) => s.service?.name_en || s.name) || 
               [professional.service_name].filter(Boolean);
      case 'skills':
        return professional.all_skills_list || [];
      case 'service_areas':
        return professional.all_service_areas_list || [];
      default:
        return [];
    }
  };

  // Render truncated list with "View all" option
  const renderTruncatedList = (items: any[], maxItems: number, type: 'service_areas' | 'services' | 'skills', professional: any) => {
    if (!items || items.length === 0) {
      return (
        <p className="text-sm text-muted-foreground">
          {getLocalizedText('None listed', 'सूचीबद्ध छैन')}
        </p>
      );
    }

    const displayItems = items.slice(0, maxItems);
    const hasMore = items.length > maxItems;

    return (
      <div className="space-y-1">
        {displayItems.map((item, index) => (
          <div key={index} className="text-sm line-clamp-1">
            {typeof item === 'string' ? item : item.name}
          </div>
        ))}
        {hasMore && (
          <Button
            variant="link"
            size="sm"
            className="h-auto p-0 text-primary"
            onClick={() => {
              setSelectedProfessional(professional);
              setDetailType(type);
              setShowDetailsDialog(true);
            }}
          >
            {getLocalizedText('View all', 'सबै हेर्नुहोस्')} ({items.length})
          </Button>
        )}
      </div>
    );
  };

  // Calculate price range
  const calculatePriceRange = (prices: any[]) => {
    if (!prices || prices.length === 0) {
      return {
        min: null,
        max: null,
        hasDiscount: false,
        hasMinPrice: false,
        formatted: getLocalizedText('Price not set', 'मूल्य सेट गरिएको छैन')
      };
    }

    // Calculate actual prices considering discounts
    const actualPrices = prices.map((price: any) => {
      if (price.discount_is_active && price.discount_percentage > 0) {
        return Math.floor(price.price * (1 - price.discount_percentage / 100));
      }
      return price.price;
    });

    const min = Math.min(...actualPrices);
    const max = Math.max(...actualPrices);
    const hasDiscount = prices.some((p: any) => p.discount_is_active && p.discount_percentage > 0);
    const hasMinPrice = prices.some((p: any) => p.is_minimum_price);

    let formatted = '';
    if (min === max) {
      formatted = `Rs. ${min}`;
      if (hasDiscount) {
        const originalPrice = prices.find(p => 
          p.discount_is_active && 
          p.discount_percentage > 0 && 
          Math.floor(p.price * (1 - p.discount_percentage / 100)) === min
        )?.price;
        if (originalPrice) {
          formatted += ` ${getLocalizedText('(Save', '(बचत गर्नुहोस्')} Rs. ${originalPrice - min})`;
        }
      }
    } else {
      formatted = `Rs. ${min} - Rs. ${max}`;
    }

    if (hasMinPrice) {
      formatted = `${getLocalizedText('Starts from', 'सुरु हुन्छ')} ${formatted}`;
    }

    return {
      min,
      max,
      hasDiscount,
      hasMinPrice,
      formatted,
      actualPrices
    };
  };

  // Group prices by service
  const groupPricesByService = (prices: any[]) => {
    const grouped: Record<string, any[]> = {};
    
    prices?.forEach((price: any) => {
      const serviceName = price.service?.name_en || price.service_name || getLocalizedText('General Service', 'सामान्य सेवा');
      if (!grouped[serviceName]) {
        grouped[serviceName] = [];
      }
      grouped[serviceName].push(price);
    });
    
    return grouped;
  };

  // Format individual price
  const formatIndividualPrice = (price: any) => {
    const hasDiscount = price.discount_is_active && price.discount_percentage > 0;
    const actualPrice = hasDiscount 
      ? Math.floor(price.price * (1 - price.discount_percentage / 100))
      : price.price;
    
    let formatted = `Rs. ${actualPrice}`;
    
    if (hasDiscount) {
      formatted += ` ${getLocalizedText('(was', '(पहिले')} Rs. ${price.price})`;
    }
    
    if (price.quality_type?.name) {
      formatted += ` - ${price.quality_type.name}`;
    }
    
    if (price.price_unit?.name) {
      formatted += ` / ${price.price_unit.name}`;
    }
    
    if (price.is_minimum_price) {
      formatted += ` (${getLocalizedText('Minimum price', 'न्यूनतम मूल्य')})`;
    }
    
    return formatted;
  };

  // Get dialog title based on detail type
  const getDialogTitle = () => {
    if (!selectedProfessional || !detailType) return '';
    
    const titles: Record<string, string> = {
      service_areas: getLocalizedText('Service Areas', 'सेवा क्षेत्रहरू'),
      services: getLocalizedText('Services', 'सेवाहरू'),
      skills: getLocalizedText('Skills', 'कौशलहरू'),
      prices: getLocalizedText('Service Prices', 'सेवा मूल्यहरू')
    };
    
    return `${selectedProfessional.full_name}'s ${titles[detailType]}`;
  };

  // Filter and sort professionals (client-side filtering for non-search filters only)
  const filteredProfessionals = useMemo(() => {
    return displayProfessionals
      .filter((professional) => {
        // Location filter from URL params
        const province = searchParams?.get('province');
        const district = searchParams?.get('district');
        const municipality = searchParams?.get('municipality');
        
        if (province || district || municipality) {
          const hasMatchingLocation = professional.service_areas_full?.some((area: any) => {
            const areaName = area.name?.toLowerCase() || '';
            const provinceMatch = province ? areaName.includes(province.toLowerCase()) : true;
            const districtMatch = district ? areaName.includes(district.toLowerCase()) : true;
            const municipalityMatch = municipality ? areaName.includes(municipality.toLowerCase()) : true;
            return provinceMatch && districtMatch && municipalityMatch;
          });
          if (!hasMatchingLocation) return false;
        }
        
        // Filter sheet location filter
        if (filterSheetFilters.location) {
          const locationLower = filterSheetFilters.location.toLowerCase();
          const hasMatchingLocation = professional.service_areas_full?.some((area: any) =>
            area.name?.toLowerCase().includes(locationLower)
          ) || professional.service_areas_display?.toLowerCase().includes(locationLower);
          if (!hasMatchingLocation) return false;
        }
        
        // Tag filter
        if (filterSheetFilters.selectedTag) {
          if (professional.tag !== filterSheetFilters.selectedTag) return false;
        }
        
        // Price filter with discount calculation
        if (filterSheetFilters.priceRange) {
          const range = priceFilterOptions.find(r => r.id === filterSheetFilters.priceRange);
          if (!range) return true;
          
          // Calculate effective prices with discounts
          const effectivePrices = professional.all_prices?.map((price: any) => {
            if (price.discount_is_active && price.discount_percentage > 0) {
              return price.price * (1 - price.discount_percentage / 100);
            }
            return price.price;
          }) || [];
          
          if (effectivePrices.length === 0) return false;
          
          const minPrice = Math.min(...effectivePrices);
          const maxPrice = Math.max(...effectivePrices);
          
          switch (range.value) {
            case 300:
              return maxPrice <= 300;
            case 800:
              return minPrice > 300 && maxPrice <= 800;
            case 1500:
              return minPrice > 800 && maxPrice <= 1500;
            case 3000:
              return minPrice > 1500 && maxPrice <= 3000;
            case 3001:
              return minPrice > 3000;
            default:
              return true;
          }
        }
        
        // Special filters
        if (filterSheetFilters.hasDiscount) {
          const hasDiscount = professional.all_prices?.some((price: any) => 
            price.discount_is_active && price.discount_percentage > 0
          );
          if (!hasDiscount) return false;
        }
        
        if (filterSheetFilters.hasMinimumPrice) {
          const hasMinPrice = professional.all_prices?.some((price: any) => 
            price.is_minimum_price
          );
          if (!hasMinPrice) return false;
        }
        
        // IMPORTANT: No client-side search filter here
        // Search is handled entirely by the API
        
        return true;
      })
      .sort((a, b) => {
        switch (filterSheetFilters.sortBy) {
          case 'name_asc':
            return (a.full_name || '').localeCompare(b.full_name || '');
          case 'name_desc':
            return (b.full_name || '').localeCompare(a.full_name || '');
          case 'price_low':
            const aMin = a.all_prices?.length ? Math.min(...a.all_prices.map((p: any) => {
              if (p.discount_is_active && p.discount_percentage > 0) {
                return p.price * (1 - p.discount_percentage / 100);
              }
              return p.price;
            })) : Infinity;
            const bMin = b.all_prices?.length ? Math.min(...b.all_prices.map((p: any) => {
              if (p.discount_is_active && p.discount_percentage > 0) {
                return p.price * (1 - p.discount_percentage / 100);
              }
              return p.price;
            })) : Infinity;
            return aMin - bMin;
          case 'price_high':
            const aMax = a.all_prices?.length ? Math.max(...a.all_prices.map((p: any) => {
              if (p.discount_is_active && p.discount_percentage > 0) {
                return p.price * (1 - p.discount_percentage / 100);
              }
              return p.price;
            })) : -Infinity;
            const bMax = b.all_prices?.length ? Math.max(...b.all_prices.map((p: any) => {
              if (p.discount_is_active && p.discount_percentage > 0) {
                return p.price * (1 - p.discount_percentage / 100);
              }
              return p.price;
            })) : -Infinity;
            return bMax - aMax;
          case 'services':
            return (b.services?.length || 0) - (a.services?.length || 0);
          default:
            return 0;
        }
      });
  }, [displayProfessionals, searchParams, filterSheetFilters]);

  const hasActiveFilters = searchQuery || filterSheetFilters.priceRange || 
    filterSheetFilters.sortBy !== 'name_asc' ||
    filterSheetFilters.hasDiscount || filterSheetFilters.hasMinimumPrice || 
    filterSheetFilters.location || filterSheetFilters.selectedTag;

  // Handle card options (like Flutter's _showCardOptions)
  const handleCardOptions = (professional: any, action: 'services' | 'profile' | 'favorite') => {
    switch (action) {
      case 'services':
        router.push(`/professionals/${professional.id}/services`);
        break;
      case 'profile':
        const slug = createProfessionalSlug(professional.full_name, professional.id);
        router.push(`/professionals/${slug}`);
        break;
      case 'favorite':
        // Add to favorites logic
        console.log('Add to favorites:', professional.id);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-primary text-primary-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-background hover:bg-primary-background/20"
              onClick={() => router.back()}
            >
              <ChevronRight className="h-5 w-5 rotate-180" />
            </Button>
            
            {isSearching && !specificProfessionalId ? (
              <div className="flex-1 relative">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={getLocalizedText(
                    `Search by ${filterType}...`,
                    `${filterSheetFilters.searchType} द्वारा खोज्नुहोस्...`
                  )}
                  className="border-0 bg-transparent text-primary-background placeholder:text-primary-background/70 focus-visible:ring-0 focus-visible:ring-offset-0 pr-8"
                  autoFocus
                />
                {isSearchLoading && (
                  <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-primary-background/70" />
                )}
              </div>
            ) : (
              <div>
                <h1 className="text-lg font-semibold">
                  {specificProfessionalId 
                    ? (filteredProfessionals[0]?.full_name || professionalName)
                    : (isSingleProfessionalView 
                      ? professionalName 
                      : getLocalizedText('Professionals', 'व्यावसायिकहरू'))
                  }
                </h1>
                <p className="text-xs text-primary-background/70">
                  {specificProfessionalId 
                    ? getLocalizedText('Professional Profile', 'व्यावसायिक प्रोफाइल')
                    : `${totalResults || filteredProfessionals.length} ${getLocalizedText('professionals', 'व्यावसायिक')}`
                  }
                </p>
              </div>
            )}
          </div>

          {/* Show search/filter only if not viewing specific professional */}
          {!specificProfessionalId && !isSingleProfessionalView && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-primary-background hover:bg-primary-background/20"
                onClick={() => {
                  setIsSearching(!isSearching);
                  if (isSearching) {
                    setSearchQuery('');
                    setDebouncedSearchQuery('');
                    setIsSearchMode(false);
                  }
                }}
              >
                {isSearching ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
              </Button>

              <FilterSheet
                trigger={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-primary-background hover:bg-primary-background/20 relative"
                  >
                    <SlidersHorizontal className="h-5 w-5" />
                    {hasActiveFilters && (
                      <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500" />
                    )}
                  </Button>
                }
                sections={filterSections}
                activeFilters={{
                  searchType: filterSheetFilters.searchType,
                  priceRange: filterSheetFilters.priceRange,
                  serviceTag: filterSheetFilters.selectedTag,
                  sortBy: filterSheetFilters.sortBy,
                  special: [
                    ...(filterSheetFilters.hasDiscount ? ['hasDiscount'] : []),
                    ...(filterSheetFilters.hasMinimumPrice ? ['hasMinimumPrice'] : []),
                  ],
                }}
                onApplyFilters={handleApplyFilters}
                onReset={handleResetFilters}
                title={getLocalizedText('Filter Professionals', 'व्यावसायिक फिल्टर गर्नुहोस्')}
                description={getLocalizedText(
                  'Filter professionals by your preferences',
                  'आफ्नो प्राथमिकता अनुसार व्यावसायिक फिल्टर गर्नुहोस्'
                )}
                side="right"
              />
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Active Filters Display */}
        {hasActiveFilters && !specificProfessionalId && !isSingleProfessionalView && (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {getLocalizedText('Active filters:', 'सक्रिय फिल्टरहरू:')}
            </span>
            
            {filterSheetFilters.searchType !== 'professionalName' && (
              <Badge variant="secondary" className="gap-1">
                {getLocalizedText('Search by', 'खोजी आधार')}: {
                  searchFilterOptions.find(o => o.id === filterSheetFilters.searchType)?.[
                    language === 'ne' ? 'labelNp' : 'labelEn'
                  ]
                }
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-1 h-3 w-3 p-0 hover:bg-transparent"
                  onClick={() => {
                    setFilterSheetFilters(prev => ({ ...prev, searchType: 'professionalName' }));
                    setFilterType('professionalName');
                  }}
                >
                  <X className="h-2 w-2" />
                </Button>
              </Badge>
            )}
            
            {filterSheetFilters.priceRange && (
              <Badge variant="secondary" className="gap-1">
                {getLocalizedText('Price', 'मूल्य')}: {
                  priceFilterOptions.find(o => o.id === filterSheetFilters.priceRange)?.[
                    language === 'ne' ? 'labelNp' : 'labelEn'
                  ]
                }
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-1 h-3 w-3 p-0 hover:bg-transparent"
                  onClick={() => {
                    setFilterSheetFilters(prev => ({ ...prev, priceRange: null }));
                    setSelectedPriceRange(null);
                  }}
                >
                  <X className="h-2 w-2" />
                </Button>
              </Badge>
            )}
            
            {filterSheetFilters.selectedTag && (
              <Badge variant="secondary" className="gap-1">
                {getLocalizedText('Tag', 'ट्याग')}: {filterSheetFilters.selectedTag}
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-1 h-3 w-3 p-0 hover:bg-transparent"
                  onClick={() => {
                    setFilterSheetFilters(prev => ({ ...prev, selectedTag: null }));
                    setSelectedTag(null);
                  }}
                >
                  <X className="h-2 w-2" />
                </Button>
              </Badge>
            )}
            
            {filterSheetFilters.sortBy !== 'name_asc' && (
              <Badge variant="secondary" className="gap-1">
                {getLocalizedText('Sort', 'क्रम')}: {
                  sortOptions.find(o => o.id === filterSheetFilters.sortBy)?.[
                    language === 'ne' ? 'labelNp' : 'labelEn'
                  ]
                }
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-1 h-3 w-3 p-0 hover:bg-transparent"
                  onClick={() => setFilterSheetFilters(prev => ({ ...prev, sortBy: 'name_asc' }))}
                >
                  <X className="h-2 w-2" />
                </Button>
              </Badge>
            )}
            
            {filterSheetFilters.hasDiscount && (
              <Badge variant="secondary" className="gap-1">
                {getLocalizedText('Has Discounts', 'छुट उपलब्ध')}
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-1 h-3 w-3 p-0 hover:bg-transparent"
                  onClick={() => setFilterSheetFilters(prev => ({ ...prev, hasDiscount: false }))}
                >
                  <X className="h-2 w-2" />
                </Button>
              </Badge>
            )}
            
            {filterSheetFilters.hasMinimumPrice && (
              <Badge variant="secondary" className="gap-1">
                {getLocalizedText('Has Minimum Price', 'न्यूनतम मूल्य')}
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-1 h-3 w-3 p-0 hover:bg-transparent"
                  onClick={() => setFilterSheetFilters(prev => ({ ...prev, hasMinimumPrice: false }))}
                >
                  <X className="h-2 w-2" />
                </Button>
              </Badge>
            )}
            
            {searchQuery && (
              <Badge variant="secondary" className="gap-1">
                {getLocalizedText('Search', 'खोजी')}: {searchQuery}
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-1 h-3 w-3 p-0 hover:bg-transparent"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="h-2 w-2" />
                </Button>
              </Badge>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={handleResetFilters}
            >
              {getLocalizedText('Clear all', 'सबै हटाउनुहोस्')}
            </Button>
          </div>
        )}

        {/* Professionals Grid */}
        {filteredProfessionals.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed">
            <User className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">
              {getLocalizedText(
                'No professionals found',
                'कुनै व्यावसायिक फेला परेन'
              )}
            </p>
            {!specificProfessionalId && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={handleResetFilters}
              >
                {getLocalizedText('Clear Filters', 'फिल्टर हटाउनुहोस्')}
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className={`grid gap-6 ${specificProfessionalId ? 'grid-cols-1 max-w-2xl mx-auto' : 'grid-cols-1 md:grid-cols-2'}`}>
              {filteredProfessionals.map((professional,index) => {
                const priceRange = calculatePriceRange(professional.all_prices);
                const hasMultiplePrices = professional.all_prices && professional.all_prices.length > 1;
                
                return (
                  
                  // <Card 
                  //   key={professional.id}
                  //   className={`overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col ${specificProfessionalId ? 'border-primary/20 border-2' : ''}`}
                  // >

                   <Card 
 key={`${professional.id}-${professional.service_ids?.join('-')}-${currentPage}`}
    className={`overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col ${specificProfessionalId ? 'border-primary/20 border-2' : ''}`}
  >
                    <CardContent className="p-5 flex-1 flex flex-col">
                      {/* Header with Avatar, Name and Three-dot menu */}
                      <div className="flex items-start gap-4 mb-4">
                        <Avatar className="h-16 w-16 border-2 border-primary/20 flex-shrink-0">
                          <AvatarImage 
                            src={professional.profile_image_url || undefined} 
                            alt={professional.full_name}
                            className="object-cover" 
                          />
                          <AvatarFallback className="bg-primary/10">
                            {professional.full_name?.charAt(0)?.toUpperCase() || 'P'}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold line-clamp-1 mb-1">
                            {professional.full_name}
                          </h3>
                          <div className="flex flex-wrap gap-1">
                            <Badge variant="secondary" className="text-xs">
                              {professional.services?.length || 1} {getLocalizedText('services', 'सेवाहरू')}
                            </Badge>
                            {professional.tag && (
                              <Badge variant="outline" className="text-xs">
                                <Tag className="h-2.5 w-2.5 mr-1" />
                                {professional.tag}
                              </Badge>
                            )}
                            {priceRange.hasMinPrice && (
                              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                {getLocalizedText('Flexible', 'लचिलो')}
                              </Badge>
                            )}
                            {specificProfessionalId && (
                              <Badge className="text-xs bg-primary text-primary-foreground">
                                {getLocalizedText('Featured', 'विशेष')}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Three-dot menu */}
                        {!specificProfessionalId && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleCardOptions(professional, 'services')}>
                                <Building className="mr-2 h-4 w-4" />
                                <span>{getLocalizedText('View All Services', 'सबै सेवाहरू हेर्नुहोस्')}</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleCardOptions(professional, 'profile')}>
                                <User className="mr-2 h-4 w-4" />
                                <span>{getLocalizedText('View Profile', 'प्रोफाइल हेर्नुहोस्')}</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleCardOptions(professional, 'favorite')}>
                                <Heart className="mr-2 h-4 w-4" />
                                <span>{getLocalizedText('Add to Favorites', 'मनपर्नेमा थप्नुहोस्')}</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>

                      {/* Services */}
                      <div className="mb-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <Building className="h-4 w-4" />
                          <span className="font-medium">{getLocalizedText('Services', 'सेवाहरू')}:</span>
                        </div>
                        {renderTruncatedList(getDisplayItems(professional, 'services'), 3, 'services', professional)}
                      </div>

                      {/* Skills */}
                      <div className="mb-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <Award className="h-4 w-4" />
                          <span className="font-medium">{getLocalizedText('Skills', 'कौशलहरू')}:</span>
                        </div>
                        {renderTruncatedList(getDisplayItems(professional, 'skills'), 3, 'skills', professional)}
                      </div>

                      {/* Service Areas */}
                      <div className="mb-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <MapPin className="h-4 w-4" />
                          <span className="font-medium">{getLocalizedText('Service Areas', 'सेवा क्षेत्रहरू')}:</span>
                        </div>
                        {renderTruncatedList(getDisplayItems(professional, 'service_areas'), 3, 'service_areas', professional)}
                      </div>

                      {/* Price Range */}
                      {priceRange.min !== null && (
                        <div className="mb-4 p-3 bg-primary/5 rounded-lg border border-primary/10">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-primary" />
                              <span className="text-sm font-medium text-primary">
                                {getLocalizedText('Price Range', 'मूल्य सीमा')}
                              </span>
                            </div>
                            {priceRange.hasDiscount && (
                              <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                                {getLocalizedText('Discount', 'छुट')}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-lg font-bold text-primary">
                                {priceRange.formatted}
                              </p>
                              {hasMultiplePrices && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {getLocalizedText('Multiple price options available', 'धेरै मूल्य विकल्पहरू उपलब्ध')}
                                </p>
                              )}
                            </div>
                            
                            {hasMultiplePrices && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-primary hover:text-primary/80 hover:bg-primary/10"
                                onClick={() => {
                                  setSelectedProfessional(professional);
                                  setShowPricesDialog(true);
                                }}
                              >
                                {getLocalizedText('View all', 'सबै हेर्नुहोस्')}
                                <ChevronDown className="ml-1 h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                            const slug = createProfessionalSlug(
                              professional.full_name, 
                              professional.id
                            );
                            router.push(`/professionals/${slug}`);
                          }}
                        >
                          {getLocalizedText('View Profile', 'प्रोफाइल हेर्नुहोस्')}
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                             const slug = createProfessionalSlug(professional.full_name, professional.id);
                            router.push(`/professionals/${slug}/services`);
                            
                          }}
                        >
                          {getLocalizedText('View All Services', 'सबै सेवाहरू हेर्नुहोस्')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Infinite scroll loader */}
            {!specificProfessionalId && !isSingleProfessionalView && hasMorePages && (
              <div ref={loaderRef} className="py-8 flex justify-center">
                {isLoadingMore && (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground">
                      {getLocalizedText('Loading more...', 'थप लोड हुँदै...')}
                    </span>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {getDialogTitle()}
            </DialogTitle>
            <DialogDescription>
              {selectedProfessional?.full_name}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-96 pr-4">
            {detailType && selectedProfessional && (
              <div className="space-y-2 py-2">
                {getDisplayItems(selectedProfessional, detailType).map((item: string, index: number) => (
                  <div key={index} className="py-2 border-b last:border-0">
                    <div className="flex items-center gap-2">
                      {detailType === 'service_areas' && <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
                      {detailType === 'services' && <Building className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
                      {detailType === 'skills' && <Award className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
                      <span className="text-sm">{item}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Prices Dialog */}
      <Dialog open={showPricesDialog} onOpenChange={setShowPricesDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              {selectedProfessional?.full_name} - {getLocalizedText('Service Prices', 'सेवा मूल्यहरू')}
            </DialogTitle>
            <DialogDescription>
              {getLocalizedText('Detailed pricing for all services', 'सबै सेवाहरूको विस्तृत मूल्य निर्धारण')}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            {selectedProfessional?.all_prices && (
              <div className="space-y-4 py-2">
                {Object.entries(groupPricesByService(selectedProfessional.all_prices)).map(([serviceName, prices], index) => (
                  <div key={index} className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        {serviceName}
                      </h4>
                      <div className="space-y-2 pl-6">
                        {prices.map((price, priceIndex) => (
                          <div key={priceIndex} className="py-2 border-b last:border-0">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-medium">
                                  {formatIndividualPrice(price)}
                                </p>
                                {price.description && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {price.description}
                                  </p>
                                )}
                              </div>
                              {price.discount_is_active && price.discount_percentage > 0 && (
                                <Badge className="bg-red-500 text-white text-xs">
                                  {price.discount_percentage}% OFF
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    {index < Object.keys(groupPricesByService(selectedProfessional.all_prices)).length - 1 && (
                      <Separator />
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {/* Summary */}
            {selectedProfessional?.all_prices && (
              <div className="mt-6 p-4 bg-primary/5 rounded-lg">
                <h4 className="font-semibold text-sm mb-2">{getLocalizedText('Price Summary', 'मूल्य सारांश')}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{getLocalizedText('Total services', 'कुल सेवाहरू')}</span>
                    <span className="font-medium">
                      {Object.keys(groupPricesByService(selectedProfessional.all_prices)).length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{getLocalizedText('Total price options', 'कुल मूल्य विकल्पहरू')}</span>
                    <span className="font-medium">{selectedProfessional.all_prices.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{getLocalizedText('Discounted options', 'छुट भएका विकल्पहरू')}</span>
                    <span className="font-medium text-green-600">
                      {selectedProfessional.all_prices.filter((p: any) => p.discount_is_active && p.discount_percentage > 0).length}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>
          <div className="mt-4">
            <Button
              className="w-full"
              onClick={() => {
                setShowPricesDialog(false);
                if (selectedProfessional?.services?.length === 1) {
                  router.push(`/services/${selectedProfessional.services[0].service_id}/professionals`);
                } else {
                  router.push(`/professionals/${selectedProfessional?.id}/services`);
                }
              }}
            >
              {getLocalizedText('Book Service Now', 'सेवा बुक गर्नुहोस्')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}