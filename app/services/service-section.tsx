// 'use client';

// import { useState, useEffect } from 'react';
// import { useI18n } from '@/lib/i18n/context';
// import { useRouter } from 'next/navigation';
// import { fetchSubCategories } from '@/lib/api/subcategories';
// import { GroupedService, Service } from '@/lib/data/service';
// import { Category } from '@/lib/data/categories';
// import { SubCategory } from '@/lib/data/subcategories';
// import { 
//   Search, 
//   X, 
//   Filter, 
//   ChevronRight,
//   Home,
//   User,
//   DollarSign,
//   Users
// } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Badge } from '@/components/ui/badge';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import { Skeleton } from '@/components/ui/skeleton';
// import Image from 'next/image';
// import Link from 'next/link';
// import {
//   Avatar,
//   AvatarFallback,
//   AvatarImage,
// } from '@/components/ui/avatar';
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog';

// interface ServicesClientProps {
//   servicesData: GroupedService[];
//   categoriesData: Category[];
//   initialCategoryId?: number;
//   initialSubCategoryId?: number;
//   screenTitle?: string;
// }

// type FilterType = 'name' | 'category' | 'subcategory';

// export function ServicesClient({
//   servicesData,
//   categoriesData,
//   initialCategoryId,
//   initialSubCategoryId,
//   screenTitle = 'Services',
// }: ServicesClientProps) {
//   const { language } = useI18n();
//   const router = useRouter();
  
//   const [searchQuery, setSearchQuery] = useState('');
//   const [isSearching, setIsSearching] = useState(false);
//   const [filterType, setFilterType] = useState<FilterType>('name');
//   const [selectedCategory, setSelectedCategory] = useState<Category | null>(
//     categoriesData.find(c => c.id === initialCategoryId) || null
//   );
//   const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null);
//   const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
//   const [isLoadingSubCategories, setIsLoadingSubCategories] = useState(false);
//   const [showProfessionalsDialog, setShowProfessionalsDialog] = useState(false);
//   const [selectedServiceProfessionals, setSelectedServiceProfessionals] = useState<any[]>([]);
//   const [selectedServiceName, setSelectedServiceName] = useState('');

//   // Fetch subcategories when category is selected
//   useEffect(() => {
//     if (selectedCategory) {
//       setIsLoadingSubCategories(true);
//       fetchSubCategories(1, 50, selectedCategory.id)
//         .then(data => {
//           setSubCategories(data.sub_categories);
//           // Auto-select subcategory if initialSubCategoryId provided
//           if (initialSubCategoryId) {
//             const sub = data.sub_categories.find(s => s.id === initialSubCategoryId);
//             if (sub) setSelectedSubCategory(sub);
//           }
//         })
//         .finally(() => setIsLoadingSubCategories(false));
//     } else {
//       setSubCategories([]);
//       setSelectedSubCategory(null);
//     }
//   }, [selectedCategory, initialSubCategoryId]);

//   // Apply filtering
//   const filteredServices = servicesData.filter(({ service }) => {
//     const query = searchQuery.toLowerCase();
    
//     // Search by name
//     if (query && filterType === 'name') {
//       const serviceName = language === 'ne' 
//         ? service.name_np.toLowerCase()
//         : service.name_en.toLowerCase();
//       return serviceName.includes(query);
//     }
    
//     // Filter by category
//     if (selectedCategory && filterType === 'category') {
//       return service.category_id === selectedCategory.id;
//     }
    
//     // Filter by subcategory
//     if (selectedSubCategory && filterType === 'subcategory') {
//       return service.sub_category_id === selectedSubCategory.id;
//     }
    
//     // If no filters applied, show all
//     if (!selectedCategory && !selectedSubCategory && !query) {
//       return true;
//     }
    
//     return false;
//   }).sort((a, b) => {
//     const nameA = language === 'ne' ? a.service.name_np : a.service.name_en;
//     const nameB = language === 'ne' ? b.service.name_np : b.service.name_en;
//     return nameA.localeCompare(nameB);
//   });

//   // Get localized name
//   const getLocalizedName = (service: Service) => {
//     return language === 'ne' ? service.name_np : service.name_en;
//   };

//   // Get localized category name
//   const getLocalizedCategoryName = (service: Service) => {
//     return language === 'ne' 
//       ? service.category?.name_np || ''
//       : service.category?.name_en || '';
//   };

//   // Get price range
//   const getPriceRange = (prices: any[]) => {
//     if (!prices || prices.length === 0) return '';
    
//     const priceValues = prices.map(p => p.price);
//     const min = Math.min(...priceValues);
//     const max = Math.max(...priceValues);
    
//     if (min === max) {
//       return `${min} NPR`;
//     }
//     return `${min} - ${max} NPR`;
//   };

//   // Show all professionals dialog
//   const showAllProfessionals = (service: GroupedService) => {
//     setSelectedServiceProfessionals(service.professionals);
//     setSelectedServiceName(getLocalizedName(service.service));
//     setShowProfessionalsDialog(true);
//   };

//   // Handle filter type change
//   const handleFilterChange = (type: FilterType) => {
//     setFilterType(type);
//     setSearchQuery('');
//     if (type !== 'category') setSelectedCategory(null);
//     if (type !== 'subcategory') setSelectedSubCategory(null);
//   };

//   // Clear all filters
//   const handleClearFilters = () => {
//     setSearchQuery('');
//     setSelectedCategory(null);
//     setSelectedSubCategory(null);
//     setIsSearching(false);
//     setFilterType('name');
//   };

//   // Navigate to service details
//   const navigateToServiceDetails = (serviceId: number, serviceName: string) => {
//     router.push(`/services/${serviceId}`);
//   };

//   // Render professionals avatars
//   const renderProfessionals = (service: GroupedService) => {
//     const visible = service.professionals.slice(0, 2);
//     const extra = service.professionals.length - visible.length;
    
//     return (
//       <div className="flex items-center gap-2 mt-3">
//         <div className="flex -space-x-2">
//           {visible.map((prof, index) => (
//             <Avatar key={index} className="border-2 border-background">
//               <AvatarImage src={prof.user.profile_image || undefined} />
//               <AvatarFallback>
//                 {prof.user.full_name.charAt(0).toUpperCase()}
//               </AvatarFallback>
//             </Avatar>
//           ))}
//         </div>
        
//         {extra > 0 && (
//           <Button
//             variant="link"
//             size="sm"
//             className="text-primary h-auto p-0"
//             onClick={(e) => {
//               e.stopPropagation();
//               showAllProfessionals(service);
//             }}
//           >
//             +{extra} {language === 'ne' ? 'थप हेर्नुहोस्' : 'more'}
//           </Button>
//         )}
        
//         {service.professionals.length === 0 && (
//           <span className="text-sm text-muted-foreground">
//             {language === 'ne' ? 'व्यावसायिक उपलब्ध छैन' : 'No professionals'}
//           </span>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       {/* App Bar */}
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
            
//             {isSearching ? (
//               <div className="flex-1">
//                 <Input
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   placeholder={language === 'ne' ? 'खोज्न टाइप गर्नुहोस्' : 'Type here to search'}
//                   className="border-0 bg-transparent text-primary-background placeholder:text-primary-background/70 focus-visible:ring-0 focus-visible:ring-offset-0"
//                   autoFocus
//                 />
//               </div>
//             ) : (
//               <h1 className="text-lg font-semibold">
//                 {language === 'ne' 
//                   ? (screenTitle === 'Services' ? 'सेवाहरू' : screenTitle)
//                   : screenTitle}
//               </h1>
//             )}
//           </div>

//           <div className="flex items-center gap-2">
//             <Button
//               variant="ghost"
//               size="icon"
//               className="text-primary-background hover:bg-primary-background/20"
//               onClick={() => {
//                 setIsSearching(!isSearching);
//                 if (isSearching) setSearchQuery('');
//               }}
//             >
//               {isSearching ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
//             </Button>

//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   className="text-primary-background hover:bg-primary-background/20"
//                 >
//                   <Filter className="h-5 w-5" />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end">
//                 <DropdownMenuItem onClick={() => handleFilterChange('name')}>
//                   {language === 'ne' ? 'नाम द्वारा' : 'By Name'}
//                 </DropdownMenuItem>
//                 <DropdownMenuItem onClick={() => handleFilterChange('category')}>
//                   {language === 'ne' ? 'श्रेणी द्वारा' : 'By Category'}
//                 </DropdownMenuItem>
//                 <DropdownMenuItem onClick={() => handleFilterChange('subcategory')}>
//                   {language === 'ne' ? 'उपश्रेणी द्वारा' : 'By Subcategory'}
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>
//         </div>
//       </header>

//       <main className="container mx-auto px-4 py-6">
//         {/* Category Filter */}
//         {filterType === 'category' && (
//           <div className="mb-6">
//             <h3 className="mb-3 text-sm font-medium text-muted-foreground">
//               {language === 'ne' ? 'श्रेणीहरू' : 'Categories'}
//             </h3>
//             <div className="flex overflow-x-auto pb-2">
//               <div className="flex gap-2">
//                 <Badge
//                   variant={!selectedCategory ? "default" : "outline"}
//                   className="cursor-pointer px-4 py-2 whitespace-nowrap"
//                   onClick={() => setSelectedCategory(null)}
//                 >
//                   {language === 'ne' ? 'सबै' : 'All'}
//                 </Badge>
//                 {categoriesData.map((category) => (
//                   <Badge
//                     key={category.id}
//                     variant={selectedCategory?.id === category.id ? "default" : "outline"}
//                     className="cursor-pointer px-4 py-2 whitespace-nowrap"
//                     onClick={() => setSelectedCategory(
//                       selectedCategory?.id === category.id ? null : category
//                     )}
//                   >
//                     {language === 'ne' ? category.name_np : category.name_en}
//                   </Badge>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Subcategory Filter (only when category is selected) */}
//         {filterType === 'subcategory' && selectedCategory && (
//           <div className="mb-6">
//             <div className="mb-3 flex items-center justify-between">
//               <h3 className="text-sm font-medium text-muted-foreground">
//                 {language === 'ne' ? 'उपश्रेणीहरू' : 'Subcategories'}
//                 <span className="ml-2 text-xs">
//                   ({language === 'ne' ? 'श्रेणी' : 'Category'}: {language === 'ne' ? selectedCategory.name_np : selectedCategory.name_en})
//                 </span>
//               </h3>
//             </div>
//             <div className="flex overflow-x-auto pb-2">
//               {isLoadingSubCategories ? (
//                 <div className="flex gap-2">
//                   {[...Array(4)].map((_, i) => (
//                     <Skeleton key={i} className="h-10 w-32 rounded-full" />
//                   ))}
//                 </div>
//               ) : (
//                 <div className="flex gap-2">
//                   <Badge
//                     variant={!selectedSubCategory ? "default" : "outline"}
//                     className="cursor-pointer px-4 py-2 whitespace-nowrap"
//                     onClick={() => setSelectedSubCategory(null)}
//                   >
//                     {language === 'ne' ? 'सबै' : 'All'}
//                   </Badge>
//                   {subCategories.map((sub) => (
//                     <Badge
//                       key={sub.id}
//                       variant={selectedSubCategory?.id === sub.id ? "default" : "outline"}
//                       className="cursor-pointer px-4 py-2 whitespace-nowrap"
//                       onClick={() => setSelectedSubCategory(
//                         selectedSubCategory?.id === sub.id ? null : sub
//                       )}
//                     >
//                       {language === 'ne' ? sub.name_np : sub.name_en}
//                     </Badge>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Services Grid Header */}
//         <div className="mb-4 flex items-center justify-between">
//           <h2 className="text-lg font-semibold">
//             {language === 'ne' ? 'सेवाहरू' : 'Services'}
//             <span className="ml-2 text-sm text-muted-foreground">
//               ({filteredServices.length})
//             </span>
//           </h2>
          
//           {(searchQuery || selectedCategory || selectedSubCategory) && (
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={handleClearFilters}
//               className="text-sm"
//             >
//               {language === 'ne' ? 'फिल्टर हटाउनुहोस्' : 'Clear Filters'}
//             </Button>
//           )}
//         </div>

//         {/* Services Grid */}
//         {filteredServices.length === 0 ? (
//           <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed">
//             <Search className="mb-4 h-12 w-12 text-muted-foreground" />
//             <p className="text-muted-foreground">
//               {language === 'ne' 
//                 ? 'कुनै सेवा फेला परेन' 
//                 : 'No services found'}
//             </p>
//             <Button
//               variant="outline"
//               className="mt-4"
//               onClick={handleClearFilters}
//             >
//               {language === 'ne' ? 'सबै हेर्नुहोस्' : 'View All'}
//             </Button>
//           </div>
//         ) : (
//           <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//             {filteredServices.map(({ service, professionals, prices }) => (
//               <Card
//                 key={service.id}
//                 className="group cursor-pointer overflow-hidden transition-all hover:border-primary hover:shadow-md"
//                 onClick={() => navigateToServiceDetails(service.id, getLocalizedName(service))}
//               >
//                 {/* Service Image */}
//                 <div className="relative h-48 w-full overflow-hidden bg-muted">
//                   {service.image ? (
//                     <Image
//                       src={service.image}
//                       alt={getLocalizedName(service)}
//                       fill
//                       sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
//                       className="object-cover transition-transform duration-300 group-hover:scale-105"
//                     />
//                   ) : (
//                     <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
//                       <Home className="h-16 w-16 text-muted-foreground/50" />
//                     </div>
//                   )}
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
//                 </div>

//                 <CardContent className="p-4">
//                   {/* Service Name */}
//                   <h3 className="mb-2 line-clamp-1 font-semibold">
//                     {getLocalizedName(service)}
//                   </h3>

//                   {/* Category Badge */}
//                   <div className="mb-2">
//                     <Badge variant="secondary" className="text-xs">
//                       {getLocalizedCategoryName(service)}
//                     </Badge>
//                   </div>

//                   {/* Price Range */}
//                   {prices.length > 0 && (
//                     <div className="mb-3 flex items-center gap-1">
//                       <DollarSign className="h-4 w-4 text-primary" />
//                       <span className="font-semibold text-primary">
//                         {getPriceRange(prices)}
//                       </span>
//                     </div>
//                   )}

//                   {/* Professionals */}
//                   <div className="mt-2">
//                     <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
//                       <Users className="h-4 w-4" />
//                       <span>
//                         {professionals.length} {language === 'ne' ? 'व्यावसायिक' : 'professionals'}
//                       </span>
//                     </div>
//                     {renderProfessionals({ service, professionals, prices })}
//                   </div>

//                   {/* View Details Arrow */}
//                   <div className="mt-4 flex items-center justify-between">
//                     <span className="text-sm text-muted-foreground">
//                       {language === 'ne' ? 'विवरण हेर्नुहोस्' : 'View details'}
//                     </span>
//                     <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         )}

//         {/* Active Filters Indicator */}
//         {(searchQuery || selectedCategory || selectedSubCategory || filterType !== 'name') && (
//           <div className="mt-8 rounded-lg border bg-card p-4">
//             <div className="flex flex-wrap items-center gap-2">
//               <span className="text-sm text-muted-foreground">
//                 {language === 'ne' ? 'सक्रिय फिल्टरहरू:' : 'Active filters:'}
//               </span>
              
//               {filterType !== 'name' && (
//                 <Badge variant="secondary" className="gap-1">
//                   {filterType === 'category' 
//                     ? (language === 'ne' ? 'श्रेणी' : 'Category')
//                     : (language === 'ne' ? 'उपश्रेणी' : 'Subcategory')}
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="ml-1 h-3 w-3 p-0 hover:bg-transparent"
//                     onClick={() => setFilterType('name')}
//                   >
//                     <X className="h-2 w-2" />
//                   </Button>
//                 </Badge>
//               )}
              
//               {selectedCategory && (
//                 <Badge variant="secondary" className="gap-1">
//                   {language === 'ne' ? selectedCategory.name_np : selectedCategory.name_en}
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="ml-1 h-3 w-3 p-0 hover:bg-transparent"
//                     onClick={() => setSelectedCategory(null)}
//                   >
//                     <X className="h-2 w-2" />
//                   </Button>
//                 </Badge>
//               )}
              
//               {selectedSubCategory && (
//                 <Badge variant="secondary" className="gap-1">
//                   {language === 'ne' ? selectedSubCategory.name_np : selectedSubCategory.name_en}
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="ml-1 h-3 w-3 p-0 hover:bg-transparent"
//                     onClick={() => setSelectedSubCategory(null)}
//                   >
//                     <X className="h-2 w-2" />
//                   </Button>
//                 </Badge>
//               )}
              
//               {searchQuery && (
//                 <Badge variant="secondary" className="gap-1">
//                   {searchQuery}
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="ml-1 h-3 w-3 p-0 hover:bg-transparent"
//                     onClick={() => setSearchQuery('')}
//                   >
//                     <X className="h-2 w-2" />
//                   </Button>
//                 </Badge>
//               )}
//             </div>
//           </div>
//         )}
//       </main>

//       {/* Professionals Dialog */}
//       <Dialog open={showProfessionalsDialog} onOpenChange={setShowProfessionalsDialog}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>
//               {language === 'ne' 
//                 ? `${selectedServiceName} का व्यावसायिकहरू`
//                 : `Professionals for ${selectedServiceName}`}
//             </DialogTitle>
//             <DialogDescription>
//               {selectedServiceProfessionals.length} {language === 'ne' ? 'व्यावसायिकहरू' : 'professionals available'}
//             </DialogDescription>
//           </DialogHeader>
          
//           <div className="max-h-96 overflow-y-auto">
//             {selectedServiceProfessionals.map((prof, index) => (
//               <div key={index} className="flex items-center gap-3 py-3 border-b last:border-0">
//                 <Avatar>
//                   <AvatarImage src={prof.user.profile_image || undefined} />
//                   <AvatarFallback>
//                     {prof.user.full_name.charAt(0).toUpperCase()}
//                   </AvatarFallback>
//                 </Avatar>
//                 <div>
//                   <p className="font-medium">{prof.user.full_name}</p>
//                   <p className="text-sm text-muted-foreground">
//                     {prof.skill || language === 'ne' ? 'व्यावसायिक' : 'Professional'}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }


'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { useRouter } from 'next/navigation';
import { fetchSubCategories } from '@/lib/api/subcategories';
import { GroupedService, Service } from '@/lib/data/service';
import { Category } from '@/lib/data/categories';
import { SubCategory } from '@/lib/data/subcategories';
import { 
  Search, 
  X, 
  Filter, 
  ChevronRight,
  Home,
  User,
  DollarSign,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import Link from 'next/link';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ServicesClientProps {
  servicesData: GroupedService[];
  categoriesData: Category[];
  initialCategoryId?: number;
  initialSubCategoryId?: number;
  screenTitle?: string;
}

type FilterType = 'name' | 'category' | 'subcategory';

export function ServicesClient({
  servicesData,
  categoriesData,
  initialCategoryId,
  initialSubCategoryId,
  screenTitle = 'Services',
}: ServicesClientProps) {
  const { language } = useI18n();
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [filterType, setFilterType] = useState<FilterType>('name');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    categoriesData.find(c => c.id === initialCategoryId) || null
  );
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [isLoadingSubCategories, setIsLoadingSubCategories] = useState(false);
  const [showProfessionalsDialog, setShowProfessionalsDialog] = useState(false);
  const [selectedServiceProfessionals, setSelectedServiceProfessionals] = useState<any[]>([]);
  const [selectedServiceName, setSelectedServiceName] = useState('');

  // Fetch subcategories when category is selected
  useEffect(() => {
    if (selectedCategory) {
      setIsLoadingSubCategories(true);
      fetchSubCategories(1, 50, selectedCategory.id)
        .then(data => {
          setSubCategories(data.sub_categories);
          // Auto-select subcategory if initialSubCategoryId provided
          if (initialSubCategoryId) {
            const sub = data.sub_categories.find(s => s.id === initialSubCategoryId);
            if (sub) setSelectedSubCategory(sub);
          } else {
            // Reset subcategory when category changes
            setSelectedSubCategory(null);
          }
        })
        .finally(() => setIsLoadingSubCategories(false));
    } else {
      setSubCategories([]);
      setSelectedSubCategory(null);
    }
  }, [selectedCategory, initialSubCategoryId]);

  // Apply filtering
  const filteredServices = servicesData.filter(({ service }) => {
    const query = searchQuery.toLowerCase();
    
    // Search by name
    if (query && filterType === 'name') {
      const serviceName = language === 'ne' 
        ? service.name_np.toLowerCase()
        : service.name_en.toLowerCase();
      return serviceName.includes(query);
    }
    
    // Filter by category
    if (selectedCategory && filterType === 'category') {
      // If subcategory is also selected, filter by both
      if (selectedSubCategory) {
        return service.category_id === selectedCategory.id && 
               service.sub_category_id === selectedSubCategory.id;
      }
      // Otherwise filter only by category
      return service.category_id === selectedCategory.id;
    }
    
    // Filter by subcategory (only in subcategory filter mode)
    if (selectedSubCategory && filterType === 'subcategory') {
      return service.sub_category_id === selectedSubCategory.id;
    }
    
    // If no filters applied, show all
    if (!selectedCategory && !selectedSubCategory && !query) {
      return true;
    }
    
    return false;
  }).sort((a, b) => {
    const nameA = language === 'ne' ? a.service.name_np : a.service.name_en;
    const nameB = language === 'ne' ? b.service.name_np : b.service.name_en;
    return nameA.localeCompare(nameB);
  });

  // Get localized name
  const getLocalizedName = (service: Service) => {
    return language === 'ne' ? service.name_np : service.name_en;
  };

  // Get localized category name
  const getLocalizedCategoryName = (service: Service) => {
    return language === 'ne' 
      ? service.category?.name_np || ''
      : service.category?.name_en || '';
  };

  // Get price range
  const getPriceRange = (prices: any[]) => {
    if (!prices || prices.length === 0) return '';
    
    const priceValues = prices.map(p => p.price);
    const min = Math.min(...priceValues);
    const max = Math.max(...priceValues);
    
    if (min === max) {
      return `${min} NPR`;
    }
    return `${min} - ${max} NPR`;
  };

  // Show all professionals dialog
  const showAllProfessionals = (service: GroupedService) => {
    setSelectedServiceProfessionals(service.professionals);
    setSelectedServiceName(getLocalizedName(service.service));
    setShowProfessionalsDialog(true);
  };

  // Handle filter type change
  const handleFilterChange = (type: FilterType) => {
    setFilterType(type);
    setSearchQuery('');
    if (type !== 'category') setSelectedCategory(null);
    if (type !== 'subcategory') setSelectedSubCategory(null);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedSubCategory(null);
    setIsSearching(false);
    setFilterType('name');
  };

  // Navigate to service details
  const navigateToServiceDetails = (serviceId: number, serviceName: string) => {
    router.push(`/services/${serviceId}`);
  };

  // Render professionals avatars
  const renderProfessionals = (service: GroupedService) => {
    const visible = service.professionals.slice(0, 2);
    const extra = service.professionals.length - visible.length;
    
    return (
      <div className="flex items-center gap-2 mt-3">
        <div className="flex -space-x-2">
          {visible.map((prof, index) => (
            <Avatar key={index} className="border-2 border-background">
              <AvatarImage src={prof.user.profile_image || undefined} />
              <AvatarFallback>
                {prof.user.full_name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          ))}
        </div>
        
        {extra > 0 && (
          <Button
            variant="link"
            size="sm"
            className="text-primary h-auto p-0"
            onClick={(e) => {
              e.stopPropagation();
              showAllProfessionals(service);
            }}
          >
            +{extra} {language === 'ne' ? 'थप हेर्नुहोस्' : 'more'}
          </Button>
        )}
        
        {service.professionals.length === 0 && (
          <span className="text-sm text-muted-foreground">
            {language === 'ne' ? 'व्यावसायिक उपलब्ध छैन' : 'No professionals'}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* App Bar */}
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
            
            {isSearching ? (
              <div className="flex-1">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === 'ne' ? 'खोज्न टाइप गर्नुहोस्' : 'Type here to search'}
                  className="border-0 bg-transparent text-primary-background placeholder:text-primary-background/70 focus-visible:ring-0 focus-visible:ring-offset-0"
                  autoFocus
                />
              </div>
            ) : (
              <h1 className="text-lg font-semibold">
                {language === 'ne' 
                  ? (screenTitle === 'Services' ? 'सेवाहरू' : screenTitle)
                  : screenTitle}
              </h1>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-background hover:bg-primary-background/20"
              onClick={() => {
                setIsSearching(!isSearching);
                if (isSearching) setSearchQuery('');
              }}
            >
              {isSearching ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-primary-background hover:bg-primary-background/20"
                >
                  <Filter className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleFilterChange('name')}>
                  {language === 'ne' ? 'नाम द्वारा' : 'By Name'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFilterChange('category')}>
                  {language === 'ne' ? 'श्रेणी द्वारा' : 'By Category'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFilterChange('subcategory')}>
                  {language === 'ne' ? 'उपश्रेणी द्वारा' : 'By Subcategory'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Category Filter */}
        {filterType === 'category' && (
          <div className="mb-6">
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">
              {language === 'ne' ? 'श्रेणीहरू' : 'Categories'}
            </h3>
            <div className="flex overflow-x-auto pb-2">
              <div className="flex gap-2">
                <Badge
                  variant={!selectedCategory ? "default" : "outline"}
                  className="cursor-pointer px-4 py-2 whitespace-nowrap"
                  onClick={() => {
                    setSelectedCategory(null);
                    setSelectedSubCategory(null);
                  }}
                >
                  {language === 'ne' ? 'सबै' : 'All'}
                </Badge>
                {categoriesData.map((category) => (
                  <Badge
                    key={category.id}
                    variant={selectedCategory?.id === category.id ? "default" : "outline"}
                    className="cursor-pointer px-4 py-2 whitespace-nowrap"
                    onClick={() => {
                      if (selectedCategory?.id === category.id) {
                        setSelectedCategory(null);
                        setSelectedSubCategory(null);
                      } else {
                        setSelectedCategory(category);
                        // Reset subcategory when changing category
                        setSelectedSubCategory(null);
                      }
                    }}
                  >
                    {language === 'ne' ? category.name_np : category.name_en}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Show subcategories when a category is selected */}
            {selectedCategory && (
              <div className="mt-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    {language === 'ne' ? 'उपश्रेणीहरू' : 'Subcategories'}
                    <span className="ml-2 text-xs">
                      ({language === 'ne' ? 'श्रेणी' : 'Category'}: {language === 'ne' ? selectedCategory.name_np : selectedCategory.name_en})
                    </span>
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs"
                    onClick={() => setSelectedSubCategory(null)}
                    disabled={!selectedSubCategory}
                  >
                    {language === 'ne' ? 'सबै हेर्नुहोस्' : 'View All'}
                  </Button>
                </div>
                {isLoadingSubCategories ? (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {[...Array(4)].map((_, i) => (
                      <Skeleton key={i} className="h-10 w-32 rounded-full" />
                    ))}
                  </div>
                ) : subCategories.length > 0 ? (
                  <div className="flex overflow-x-auto gap-2 pb-2">
                    <Badge
                      variant={!selectedSubCategory ? "default" : "outline"}
                      className="cursor-pointer px-4 py-2 whitespace-nowrap"
                      onClick={() => setSelectedSubCategory(null)}
                    >
                      {language === 'ne' ? 'सबै' : 'All'}
                    </Badge>
                    {subCategories.map((sub) => (
                      <Badge
                        key={sub.id}
                        variant={selectedSubCategory?.id === sub.id ? "default" : "outline"}
                        className="cursor-pointer px-4 py-2 whitespace-nowrap"
                        onClick={() => setSelectedSubCategory(
                          selectedSubCategory?.id === sub.id ? null : sub
                        )}
                      >
                        {language === 'ne' ? sub.name_np : sub.name_en}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed p-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      {language === 'ne' 
                        ? 'यो श्रेणीमा कुनै उपश्रेणी छैन' 
                        : 'No subcategories available for this category'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Subcategory Filter (only when filterType is 'subcategory') */}
        {filterType === 'subcategory' && (
          <div className="mb-6">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">
                {language === 'ne' ? 'श्रेणी छनोट गर्नुहोस्' : 'Select Category'}
                {selectedCategory && (
                  <span className="ml-2 text-xs">
                    ({language === 'ne' ? 'श्रेणी' : 'Category'}: {language === 'ne' ? selectedCategory.name_np : selectedCategory.name_en})
                  </span>
                )}
              </h3>
            </div>
            
            {/* Category selection for subcategory filter mode */}
            <div className="mb-4 flex overflow-x-auto pb-2">
              <div className="flex gap-2">
                <Badge
                  variant={!selectedCategory ? "default" : "outline"}
                  className="cursor-pointer px-4 py-2 whitespace-nowrap"
                  onClick={() => {
                    setSelectedCategory(null);
                    setSelectedSubCategory(null);
                  }}
                >
                  {language === 'ne' ? 'सबै श्रेणी' : 'All Categories'}
                </Badge>
                {categoriesData.map((category) => (
                  <Badge
                    key={category.id}
                    variant={selectedCategory?.id === category.id ? "default" : "outline"}
                    className="cursor-pointer px-4 py-2 whitespace-nowrap"
                    onClick={() => {
                      if (selectedCategory?.id === category.id) {
                        setSelectedCategory(null);
                        setSelectedSubCategory(null);
                      } else {
                        setSelectedCategory(category);
                        setSelectedSubCategory(null);
                      }
                    }}
                  >
                    {language === 'ne' ? category.name_np : category.name_en}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Subcategory selection (only when category is selected) */}
            {selectedCategory && (
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    {language === 'ne' ? 'उपश्रेणीहरू' : 'Subcategories'}
                  </h3>
                </div>
                {isLoadingSubCategories ? (
                  <div className="flex gap-2">
                    {[...Array(4)].map((_, i) => (
                      <Skeleton key={i} className="h-10 w-32 rounded-full" />
                    ))}
                  </div>
                ) : (
                  <div className="flex overflow-x-auto gap-2 pb-2">
                    <Badge
                      variant={!selectedSubCategory ? "default" : "outline"}
                      className="cursor-pointer px-4 py-2 whitespace-nowrap"
                      onClick={() => setSelectedSubCategory(null)}
                    >
                      {language === 'ne' ? 'सबै' : 'All'}
                    </Badge>
                    {subCategories.map((sub) => (
                      <Badge
                        key={sub.id}
                        variant={selectedSubCategory?.id === sub.id ? "default" : "outline"}
                        className="cursor-pointer px-4 py-2 whitespace-nowrap"
                        onClick={() => setSelectedSubCategory(
                          selectedSubCategory?.id === sub.id ? null : sub
                        )}
                      >
                        {language === 'ne' ? sub.name_np : sub.name_en}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Services Grid Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {language === 'ne' ? 'सेवाहरू' : 'Services'}
            <span className="ml-2 text-sm text-muted-foreground">
              ({filteredServices.length})
            </span>
          </h2>
          
          {(searchQuery || selectedCategory || selectedSubCategory || filterType !== 'name') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="text-sm"
            >
              {language === 'ne' ? 'फिल्टर हटाउनुहोस्' : 'Clear Filters'}
            </Button>
          )}
        </div>

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed">
            <Search className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">
              {language === 'ne' 
                ? 'कुनै सेवा फेला परेन' 
                : 'No services found'}
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={handleClearFilters}
            >
              {language === 'ne' ? 'सबै हेर्नुहोस्' : 'View All'}
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredServices.map(({ service, professionals, prices }) => (
              <Card
                key={service.id}
                className="group cursor-pointer overflow-hidden transition-all hover:border-primary hover:shadow-md"
                onClick={() => navigateToServiceDetails(service.id, getLocalizedName(service))}
              >
                {/* Service Image */}
                <div className="relative h-48 w-full overflow-hidden bg-muted">
                  {service.image ? (
                    <Image
                      src={service.image}
                      alt={getLocalizedName(service)}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                      <Home className="h-16 w-16 text-muted-foreground/50" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>

                <CardContent className="p-4">
                  {/* Service Name */}
                  <h3 className="mb-2 line-clamp-1 font-semibold">
                    {getLocalizedName(service)}
                  </h3>

                  {/* Category Badge */}
                  <div className="mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {getLocalizedCategoryName(service)}
                    </Badge>
                  </div>

                  {/* Price Range */}
                  {prices.length > 0 && (
                    <div className="mb-3 flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-primary" />
                      <span className="font-semibold text-primary">
                        {getPriceRange(prices)}
                      </span>
                    </div>
                  )}

                  {/* Professionals */}
                  <div className="mt-2">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                      <Users className="h-4 w-4" />
                      <span>
                        {professionals.length} {language === 'ne' ? 'व्यावसायिक' : 'professionals'}
                      </span>
                    </div>
                    {renderProfessionals({ service, professionals, prices })}
                  </div>

                  {/* View Details Arrow */}
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {language === 'ne' ? 'विवरण हेर्नुहोस्' : 'View details'}
                    </span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Active Filters Indicator */}
        {(searchQuery || selectedCategory || selectedSubCategory || filterType !== 'name') && (
          <div className="mt-8 rounded-lg border bg-card p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {language === 'ne' ? 'सक्रिय फिल्टरहरू:' : 'Active filters:'}
              </span>
              
              {filterType !== 'name' && (
                <Badge variant="secondary" className="gap-1">
                  {filterType === 'category' 
                    ? (language === 'ne' ? 'श्रेणी' : 'Category')
                    : (language === 'ne' ? 'उपश्रेणी' : 'Subcategory')}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-1 h-3 w-3 p-0 hover:bg-transparent"
                    onClick={() => setFilterType('name')}
                  >
                    <X className="h-2 w-2" />
                  </Button>
                </Badge>
              )}
              
              {selectedCategory && (
                <Badge variant="secondary" className="gap-1">
                  {language === 'ne' ? selectedCategory.name_np : selectedCategory.name_en}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-1 h-3 w-3 p-0 hover:bg-transparent"
                    onClick={() => setSelectedCategory(null)}
                  >
                    <X className="h-2 w-2" />
                  </Button>
                </Badge>
              )}
              
              {selectedSubCategory && (
                <Badge variant="secondary" className="gap-1">
                  {language === 'ne' ? selectedSubCategory.name_np : selectedSubCategory.name_en}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-1 h-3 w-3 p-0 hover:bg-transparent"
                    onClick={() => setSelectedSubCategory(null)}
                  >
                    <X className="h-2 w-2" />
                  </Button>
                </Badge>
              )}
              
              {searchQuery && (
                <Badge variant="secondary" className="gap-1">
                  {searchQuery}
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
            </div>
          </div>
        )}
      </main>

      {/* Professionals Dialog */}
      <Dialog open={showProfessionalsDialog} onOpenChange={setShowProfessionalsDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {language === 'ne' 
                ? `${selectedServiceName} का व्यावसायिकहरू`
                : `Professionals for ${selectedServiceName}`}
            </DialogTitle>
            <DialogDescription>
              {selectedServiceProfessionals.length} {language === 'ne' ? 'व्यावसायिकहरू' : 'professionals available'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="max-h-96 overflow-y-auto">
            {selectedServiceProfessionals.map((prof, index) => (
              <div key={index} className="flex items-center gap-3 py-3 border-b last:border-0">
                <Avatar>
                  <AvatarImage src={prof.user.profile_image || undefined} />
                  <AvatarFallback>
                    {prof.user.full_name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{prof.user.full_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {prof.skill || language === 'ne' ? 'व्यावसायिक' : 'Professional'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}