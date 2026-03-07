'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { useRouter, useSearchParams } from 'next/navigation';
import { searchProfessionalServices } from '@/lib/api/professional-services';
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
  Users,
  SlidersHorizontal,
  Star,
  Tag,
  Loader2
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
import { FilterSheet, FilterSection } from '@/components/ui/filter-sheet';
import { ScrollArea } from '@radix-ui/react-scroll-area';

interface ServicesClientProps {
  servicesData: any[];
  categoriesData: Category[];
  subCategoriesData?: SubCategory[];
  totalPages?: number;
  currentPage?: number;
  totalResults?: number;
  initialCategoryId?: number;
  initialSubCategoryId?: number;
  screenTitle?: string;
}

type FilterType = 'name' | 'category';

// Define filter options
const sortOptions = [
  { id: 'popular', labelEn: 'Popular', labelNp: 'लोकप्रिय', icon: <Star className="h-3 w-3" /> },
  { id: 'price_low', labelEn: 'Price: Low to High', labelNp: 'मूल्य: न्यून देखि उच्च', icon: <DollarSign className="h-3 w-3" /> },
  { id: 'price_high', labelEn: 'Price: High to Low', labelNp: 'मूल्य: उच्च देखि न्यून', icon: <DollarSign className="h-3 w-3" /> },
  { id: 'name_asc', labelEn: 'Name: A to Z', labelNp: 'नाम: A देखि Z', icon: <Tag className="h-3 w-3" /> },
  { id: 'name_desc', labelEn: 'Name: Z to A', labelNp: 'नाम: Z देखि A', icon: <Tag className="h-3 w-3" /> },
];

const priceRangeOptions = [
  { id: 'under_500', labelEn: 'Under Rs. 500', labelNp: 'रु. ५०० मुनि', min: 0, max: 500 },
  { id: '500_1000', labelEn: 'Rs. 500 - Rs. 1000', labelNp: 'रु. ५०० - रु. १०००', min: 500, max: 1000 },
  { id: '1000_2000', labelEn: 'Rs. 1000 - Rs. 2000', labelNp: 'रु. १००० - रु. २०००', min: 1000, max: 2000 },
  { id: 'above_2000', labelEn: 'Above Rs. 2000', labelNp: 'रु. २००० माथि', min: 2000, max: Infinity },
];

export function ServicesClient({
  servicesData: initialServicesData,
  categoriesData,
  subCategoriesData: initialSubCategoriesData = [],
  totalPages: initialTotalPages = 1,
  currentPage: initialCurrentPage = 1,
  totalResults: initialTotalResults = 0,
  initialCategoryId,
  initialSubCategoryId,
  screenTitle = 'Services',
}: ServicesClientProps) {
  const { language } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State for services and pagination - simplified to single source of truth
  const [services, setServices] = useState<any[]>(initialServicesData);
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
  
  // Filter state
  const [filterType, setFilterType] = useState<FilterType>('name');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    categoriesData.find(c => c.id === initialCategoryId) || null
  );
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null);
  const [subCategories, setSubCategories] = useState<SubCategory[]>(initialSubCategoriesData);
  const [isLoadingSubCategories, setIsLoadingSubCategories] = useState(false);
  
  // Dialog state
  const [showProfessionalsDialog, setShowProfessionalsDialog] = useState(false);
  const [selectedServiceProfessionals, setSelectedServiceProfessionals] = useState<any[]>([]);
  const [selectedServiceName, setSelectedServiceName] = useState('');
  
  // Refs for infinite scroll and request tracking
  const loaderRef = useRef<HTMLDivElement>(null);
  const latestRequestId = useRef<string>('');
  
  // Filter sheet state
  const [filterSheetFilters, setFilterSheetFilters] = useState({
    sortBy: 'popular',
    priceRange: null as string | null,
    hasProfessionals: false,
    hasPrices: false,
  });

  // Set initial values
  useEffect(() => {
    if (initialCategoryId && !selectedCategory) {
      const category = categoriesData.find(c => c.id === initialCategoryId);
      if (category) {
        setSelectedCategory(category);
      }
    }
    if (initialSubCategoryId && !selectedSubCategory) {
      const subCategory = initialSubCategoriesData.find(s => s.id === initialSubCategoryId);
      if (subCategory) {
        setSelectedSubCategory(subCategory);
      }
    }
  }, [initialCategoryId, initialSubCategoryId, categoriesData, initialSubCategoriesData]);

  // Fetch subcategories when category changes
  useEffect(() => {
    if (selectedCategory) {
      setIsLoadingSubCategories(true);
      fetchSubCategories(1, 100, selectedCategory.id)
        .then(data => {
          setSubCategories(data.sub_categories);
        })
        .finally(() => setIsLoadingSubCategories(false));
    } else {
      setSubCategories([]);
      setSelectedSubCategory(null);
    }
  }, [selectedCategory]);

  // Debounce search
// Debounce search
useEffect(() => {
  const timer = setTimeout(() => {
    if (searchQuery.length >= 2) {
      setDebouncedSearchQuery(searchQuery);
      handleSearch(false, { 
        search: searchQuery,
        categoryId: selectedCategory?.id,
        subCategoryId: selectedSubCategory?.id 
      });
    } else if (searchQuery.length === 0) {
      setDebouncedSearchQuery('');
      // Only reset to initial if there are no active filters
      if (!selectedCategory && !selectedSubCategory) {
        setServices(initialServicesData);
      }
    }
  }, 500);

  return () => clearTimeout(timer);
}, [searchQuery, selectedCategory, selectedSubCategory]);

  const handleSearch = async (loadMore = false, filters?: {
    categoryId?: number | null;
    subCategoryId?: number | null;
    search?: string;
  }) => {
    if (loadMore && !hasMorePages) return;
    
    // Create a unique ID for this request
    const requestId = `${Date.now()}-${Math.random()}`;
    latestRequestId.current = requestId;
    
    console.log('========== HANDLE SEARCH ==========');
    console.log('Request ID:', requestId);
    console.log('loadMore:', loadMore);
    console.log('filters received:', filters);
    
    setIsSearchLoading(true);
    try {
      const nextPage = loadMore ? currentPage + 1 : 1;
      
      // Use provided filters or current state, and convert null to undefined
      const categoryId = filters?.categoryId !== undefined ? filters.categoryId : selectedCategory?.id;
      const subCategoryId = filters?.subCategoryId !== undefined ? filters.subCategoryId : selectedSubCategory?.id;
      const searchTerm = filters?.search !== undefined ? filters.search : debouncedSearchQuery;
      
      console.log('Using categoryId:', categoryId);
      console.log('Using subCategoryId:', subCategoryId);
      
      const response = await searchProfessionalServices({
        page: nextPage,
        per_page: 20,
        search: searchTerm || undefined,
        category_id: categoryId === null ? undefined : categoryId,
        sub_category_id: subCategoryId === null ? undefined : subCategoryId,
      });
      
      // Check if this is still the latest request
      if (latestRequestId.current !== requestId) {
        console.log('Ignoring stale request:', requestId);
        return;
      }
      
      console.log('API response:', response);
      
      // Group the results
      const groupedServices = groupProfessionalServices(response.professional_services || []);
      const servicesArray = Array.from(groupedServices.values()).map(group => ({
        service: group.service,
        professionals: group.professionals,
        prices: group.prices,
        professionalCount: group.professionalCount,
      }));
      
      console.log('Services array length:', servicesArray.length);
      
      if (loadMore) {
        setServices(prev => [...prev, ...servicesArray]);
      } else {
        setServices(servicesArray);
        setCurrentPage(1); // Reset to page 1 for new searches
      }
      
      setCurrentPage(response.page);
      setTotalPages(response.total_pages);
      setTotalResults(response.total);
      setHasMorePages(response.page < response.total_pages);
      
      console.log('========== SEARCH COMPLETE ==========');
    } catch (error) {
      console.error('Error searching services:', error);
    } finally {
      setIsSearchLoading(false);
    }
  };

  // Load more for infinite scroll
  const loadMoreServices = useCallback(async () => {
    if (isLoadingMore || !hasMorePages) return;
    setIsLoadingMore(true);
    await handleSearch(true);
    setIsLoadingMore(false);
  }, [currentPage, hasMorePages, isLoadingMore]);

  // Intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMorePages && !isLoadingMore && !isSearchLoading) {
          loadMoreServices();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [hasMorePages, isLoadingMore, isSearchLoading, loadMoreServices]);

  // Define filter sections
  const filterSections: FilterSection[] = [
    {
      id: 'sortBy',
      titleEn: 'Sort By',
      titleNp: 'क्रमबद्ध गर्नुहोस्',
      type: 'single',
      options: sortOptions,
    },
    {
      id: 'priceRange',
      titleEn: 'Price Range',
      titleNp: 'मूल्य सीमा',
      type: 'single',
      options: priceRangeOptions.map(opt => ({
        id: opt.id,
        labelEn: opt.labelEn,
        labelNp: opt.labelNp,
        value: opt,
      })),
    },
    {
      id: 'availability',
      titleEn: 'Availability',
      titleNp: 'उपलब्धता',
      type: 'multiple',
      options: [
        { id: 'hasProfessionals', labelEn: 'Has Professionals', labelNp: 'व्यावसायिक उपलब्ध', icon: <Users className="h-3 w-3" /> },
        { id: 'hasPrices', labelEn: 'Has Prices', labelNp: 'मूल्य उपलब्ध', icon: <DollarSign className="h-3 w-3" /> },
      ],
    },
  ];

  // Handle filter sheet apply
  const handleApplyFilters = (filters: Record<string, any>) => {
    setFilterSheetFilters({
      sortBy: filters.sortBy || 'popular',
      priceRange: filters.priceRange || null,
      hasProfessionals: filters.availability?.includes('hasProfessionals') || false,
      hasPrices: filters.availability?.includes('hasPrices') || false,
    });
  };

  // Handle filter sheet reset
  const handleResetFilters = () => {
    setFilterSheetFilters({
      sortBy: 'popular',
      priceRange: null,
      hasProfessionals: false,
      hasPrices: false,
    });
  };

  // Apply filters and sorting
  const filteredServices = useMemo(() => {

    return services
      .filter((item) => {
        const { service, professionals, prices } = item;
        
        // Apply price range filter
        if (filterSheetFilters.priceRange) {
          const range = priceRangeOptions.find(r => r.id === filterSheetFilters.priceRange);
          if (range && prices.length > 0) {
            const minPrice = Math.min(...prices.map((p: any) => p.price));
            if (minPrice < range.min || minPrice > range.max) {
              return false;
            }
          }
        }
        
        // Apply availability filters
        if (filterSheetFilters.hasProfessionals && professionals.length === 0) {
          return false;
        }
        
        if (filterSheetFilters.hasPrices && prices.length === 0) {
          return false;
        }
        
        return true;
      })
      .sort((a, b) => {
        switch (filterSheetFilters.sortBy) {
          case 'price_low':
            const aMin = a.prices.length > 0 ? Math.min(...a.prices.map((p: any) => p.price)) : Infinity;
            const bMin = b.prices.length > 0 ? Math.min(...b.prices.map((p: any) => p.price)) : Infinity;
            return aMin - bMin;
          case 'price_high':
            const aMax = a.prices.length > 0 ? Math.max(...a.prices.map((p: any) => p.price)) : -Infinity;
            const bMax = b.prices.length > 0 ? Math.max(...b.prices.map((p: any) => p.price)) : -Infinity;
            return bMax - aMax;
          case 'name_asc':
            const aName = language === 'ne' ? a.service.name_np : a.service.name_en;
            const bName = language === 'ne' ? b.service.name_np : b.service.name_en;
            return aName.localeCompare(bName);
          case 'name_desc':
            const aNameDesc = language === 'ne' ? a.service.name_np : a.service.name_en;
            const bNameDesc = language === 'ne' ? b.service.name_np : b.service.name_en;
            return bNameDesc.localeCompare(aNameDesc);
          case 'popular':
          default:
            return (b.professionals?.length || 0) - (a.professionals?.length || 0);
        }
      });
  }, [services, filterSheetFilters, language]);

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
      return `Rs. ${min}`;
    }
    return `Rs. ${min} - Rs. ${max}`;
  };

  // Show all professionals dialog
  const showAllProfessionals = (professionals: any[], serviceName: string) => {
    setSelectedServiceProfessionals(professionals);
    setSelectedServiceName(serviceName);
    setShowProfessionalsDialog(true);
  };

  // Render professionals row  
  const renderProfessionalsRow = (item: any) => {
    const professionals = item.professionals || [];
    const visible = professionals.slice(0, 2);
    const extra = professionals.length - visible.length;
    
    if (professionals.length === 0) {
      return (
        <div className="flex items-center gap-2 mt-3">
          <span className="text-sm text-muted-foreground">
            {language === 'ne' ? 'कुनै व्यावसायिक छैन' : 'No professionals'}
          </span>
        </div>
      );
    }
    
    return (
      <div className="flex items-center gap-2 mt-3 flex-wrap">
        <div className="flex -space-x-2">
          {visible.map((prof: any, index: number) => (
            <Avatar key={index} className="border-2 border-background h-8 w-8">
              <AvatarImage src={prof.profile_image || undefined} />
              <AvatarFallback className="text-xs">
                {prof.full_name?.charAt(0).toUpperCase() || 'P'}
              </AvatarFallback>
            </Avatar>
          ))}
        </div>
        
        {extra > 0 && (
          <Button
            variant="link"
            size="sm"
            className="text-primary h-auto p-0 text-sm"
            onClick={(e) => {
              e.stopPropagation();
              showAllProfessionals(professionals, getLocalizedName(item.service));
            }}
          >
            {/* +{extra} {language === 'ne' ? 'थप हेर्नुहोस्' : 'more'} */}
                 + {language === 'ne' ? 'थप हेर्नुहोस्' : 'view more'}
          </Button>
        )}
      </div>
    );
  };

  // Handle filter type change
  const handleFilterChange = (type: FilterType) => {
    setFilterType(type);
    setSearchQuery('');
    if (type === 'name') {
      setSelectedCategory(null);
      setSelectedSubCategory(null);
    }
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setDebouncedSearchQuery('');
    setSelectedCategory(null);
    setSelectedSubCategory(null);
    setIsSearching(false);
    setFilterType('name');
    handleResetFilters();
    setServices(initialServicesData);
  };

  // Navigate to service details
  const navigateToServiceDetails = (serviceId: number, serviceName: string) => {
    router.push(`/services/${serviceId}/professionals?serviceName=${encodeURIComponent(serviceName)}`);
  };

  const hasActiveFilters = searchQuery || selectedCategory || selectedSubCategory || 
    filterSheetFilters.sortBy !== 'popular' || filterSheetFilters.priceRange || 
    filterSheetFilters.hasProfessionals || filterSheetFilters.hasPrices;

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
              <div className="flex-1 relative">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === 'ne' ? 'खोज्न टाइप गर्नुहोस्' : 'Type here to search'}
                  className="border-0 bg-transparent text-primary-background placeholder:text-primary-background/70 focus-visible:ring-0 focus-visible:ring-offset-0 pr-8"
                  autoFocus
                />
                {isSearchLoading && (
                  <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-primary-background/70" />
                )}
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
                if (isSearching) {
                  setSearchQuery('');
                  setDebouncedSearchQuery('');
                }
              }}
            >
              {isSearching ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </Button>

            {/* Filter Sheet */}
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
                sortBy: filterSheetFilters.sortBy,
                priceRange: filterSheetFilters.priceRange,
                availability: [
                  ...(filterSheetFilters.hasProfessionals ? ['hasProfessionals'] : []),
                  ...(filterSheetFilters.hasPrices ? ['hasPrices'] : []),
                ],
              }}
              onApplyFilters={handleApplyFilters}
              onReset={handleResetFilters}
              title={language === 'ne' ? 'फिल्टरहरू' : 'Filters'}
              description={language === 'ne' 
                ? 'आफ्नो प्राथमिकता अनुसार सेवाहरू फिल्टर गर्नुहोस्'
                : 'Filter services by your preferences'
              }
              side="right"
            />

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
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Category Filter Section */}
        {filterType === 'category' && (
          <div className="mb-6">
            {/* Categories */}
            <div className="mb-4">
              <h3 className="mb-3 text-sm font-medium text-muted-foreground">
                {language === 'ne' ? 'श्रेणीहरू' : 'Categories'}
              </h3>
              <div className="flex overflow-x-auto pb-2 -mx-1 px-1">
                <div className="flex gap-2">
                  <Badge
                    variant={!selectedCategory ? "default" : "outline"}
                    className="cursor-pointer px-4 py-2 whitespace-nowrap"
                    onClick={() => {
                      setSelectedCategory(null);
                      setSelectedSubCategory(null);
                      handleSearch(false, { categoryId: null, subCategoryId: null });
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
                          handleSearch(false, { categoryId: null, subCategoryId: null });
                        } else {
                          setSelectedCategory(category);
                          setSelectedSubCategory(null);
                          handleSearch(false, { categoryId: category.id, subCategoryId: null });
                        }
                      }}
                    >
                      {language === 'ne' ? category.name_np : category.name_en}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Subcategories */}
            {selectedCategory && (
              <div className="mt-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    {language === 'ne' ? 'उपश्रेणीहरू' : 'Subcategories'}
                    <span className="ml-2 text-xs">
                      ({language === 'ne' ? selectedCategory.name_np : selectedCategory.name_en})
                    </span>
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs"
                    onClick={() => {
                      setSelectedSubCategory(null);
                      handleSearch(false, { 
                        categoryId: selectedCategory.id, 
                        subCategoryId: null 
                      });
                    }}
                    disabled={!selectedSubCategory}
                  >
                    {language === 'ne' ? 'सबै हेर्नुहोस्' : 'View All'}
                  </Button>
                </div>
                
                {isLoadingSubCategories ? (
                  <div className="flex overflow-x-auto gap-2 pb-2">
                    {[...Array(4)].map((_, i) => (
                      <Skeleton key={i} className="h-10 w-32 rounded-full flex-shrink-0" />
                    ))}
                  </div>
                ) : subCategories.length > 0 ? (
                  <div className="flex overflow-x-auto gap-2 pb-2">
                    <Badge
                      variant={!selectedSubCategory ? "default" : "outline"}
                      className="cursor-pointer px-4 py-2 whitespace-nowrap"
                      onClick={() => {
                        setSelectedSubCategory(null);
                        handleSearch(false, { 
                          categoryId: selectedCategory.id, 
                          subCategoryId: null 
                        });
                      }}
                    >
                      {language === 'ne' ? 'सबै' : 'All'}
                    </Badge>
                    {subCategories.map((sub) => (
                      <Badge
                        key={sub.id}
                        variant={selectedSubCategory?.id === sub.id ? "default" : "outline"}
                        className="cursor-pointer px-4 py-2 whitespace-nowrap"
                        onClick={() => {
                          const newSubCategoryId = selectedSubCategory?.id === sub.id ? null : sub.id;
                          console.log('Clicking subcategory:', sub.id, sub.name_en);
                          console.log('newSubCategoryId:', newSubCategoryId);
                          
                          setSelectedSubCategory(newSubCategoryId ? sub : null);
                          
                          handleSearch(false, { 
                            categoryId: selectedCategory.id, 
                            subCategoryId: newSubCategoryId 
                          });
                        }}
                      >
                        {language === 'ne' ? sub.name_np : sub.name_en}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed p-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      {language === 'ne' 
                        ? 'यस श्रेणीमा कुनै उपश्रेणी छैन' 
                        : 'No subcategories in this category'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Results Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {language === 'ne' ? 'सेवाहरू' : 'Services'}
            <span className="ml-2 text-sm text-muted-foreground">
              ({totalResults || filteredServices.length})
            </span>
          </h2>
          
          {hasActiveFilters && (
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
          <>
            <div 
              key={`services-${selectedSubCategory?.id || 'all'}-${filteredServices.length}`} 
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {filteredServices.map((item, index) => {
                const { service, professionals, prices } = item;
                const priceRange = getPriceRange(prices);
                const uniqueKey = `${service.id}-${index}`;
                
                return (
                  <Card
                    key={uniqueKey}
                    // className="group cursor-pointer overflow-hidden transition-all hover:border-primary hover:shadow-md"
                     className="group h-full overflow-hidden transition-all hover:border-primary hover:shadow-lg p-0 gap-0 cursor-pointer"
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
                      {priceRange && (
                        <div className="mb-3 flex items-center gap-1">
                          <span className="font-semibold text-primary">
                            {priceRange}
                          </span>
                        </div>
                      )}

                      {/* Professionals Count */}
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                        <Users className="h-4 w-4" />
                        <span>
                          {/* {professionals.length} {language === 'ne' ? 'व्यावसायिक' : 'professionals'} */}
                                {language === 'ne' ? 'व्यावसायिक' : 'professionals'}
                        </span>
                      </div>

                      {/* Professionals Row with Avatars */}
                      {renderProfessionalsRow(item)}

                      {/* View Details Arrow */}
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {language === 'ne' ? 'विवरण हेर्नुहोस्' : 'View details'}
                        </span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Infinite Scroll Loader */}
            {hasMorePages && (
              <div ref={loaderRef} className="py-8 flex justify-center">
                {(isLoadingMore || isSearchLoading) && (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground">
                      {language === 'ne' ? 'थप लोड हुँदै...' : 'Loading more...'}
                    </span>
                  </div>
                )}
              </div>
            )}
          </>
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
          
          <ScrollArea className="max-h-96 pr-4">
            <div className="space-y-2 py-2">
              {selectedServiceProfessionals.map((prof, index) => (
                <div key={index} className="flex items-center gap-3 py-2 border-b last:border-0">
                  <Avatar>
                    <AvatarImage src={prof.profile_image || undefined} />
                    <AvatarFallback>
                      {prof.full_name?.charAt(0).toUpperCase() || 'P'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{prof.full_name || 'Professional'}</p>
                    <p className="text-sm text-muted-foreground">
                      {prof.skill || (language === 'ne' ? 'व्यावसायिक' : 'Professional')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Helper function to group professional services
function groupProfessionalServices(professionalServices: any[]): Map<number, any> {
  const groupedMap = new Map<number, any>();
  
  for (const ps of professionalServices) {
    if (!ps.service || !ps.professional) continue;
    
    const serviceId = ps.service.id;
    
    if (!groupedMap.has(serviceId)) {
      groupedMap.set(serviceId, {
        service: ps.service,
        professionals: [],
        prices: [],
        uniqueProfessionalIds: new Set<number>()
      });
    }
    
    const group = groupedMap.get(serviceId)!;
    
    // Add professional if unique
    const professionalId = ps.professional.id;
    if (!group.uniqueProfessionalIds.has(professionalId)) {
      group.uniqueProfessionalIds.add(professionalId);
      group.professionals.push({
        id: professionalId,
        user_id: ps.professional.user_id,
        full_name: ps.professional.user.full_name,
        profile_image: ps.professional.user.profile_image,
        skill: ps.professional.skill
      });
    }
    
    // Add prices
    if (ps.prices) {
      group.prices.push(...ps.prices);
    }
  }
  
  return groupedMap;
}



// 'use client';

// import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
// import { useI18n } from '@/lib/i18n/context';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { searchProfessionalServices } from '@/lib/api/professional-services';
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
//   Users,
//   SlidersHorizontal,
//   Star,
//   Tag,
//   Loader2
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
// import { FilterSheet, FilterSection } from '@/components/ui/filter-sheet';
// import { ScrollArea } from '@radix-ui/react-scroll-area';

// interface ServicesClientProps {
//   servicesData: any[];
//   categoriesData: Category[];
//   subCategoriesData?: SubCategory[];
//   totalPages?: number;
//   currentPage?: number;
//   totalResults?: number;
//   initialCategoryId?: number;
//   initialSubCategoryId?: number;
//   screenTitle?: string;
// }

// type FilterType = 'name' | 'category';

// // Define filter options
// const sortOptions = [
//   { id: 'popular', labelEn: 'Popular', labelNp: 'लोकप्रिय', icon: <Star className="h-3 w-3" /> },
//   { id: 'price_low', labelEn: 'Price: Low to High', labelNp: 'मूल्य: न्यून देखि उच्च', icon: <DollarSign className="h-3 w-3" /> },
//   { id: 'price_high', labelEn: 'Price: High to Low', labelNp: 'मूल्य: उच्च देखि न्यून', icon: <DollarSign className="h-3 w-3" /> },
//   { id: 'name_asc', labelEn: 'Name: A to Z', labelNp: 'नाम: A देखि Z', icon: <Tag className="h-3 w-3" /> },
//   { id: 'name_desc', labelEn: 'Name: Z to A', labelNp: 'नाम: Z देखि A', icon: <Tag className="h-3 w-3" /> },
// ];

// const priceRangeOptions = [
//   { id: 'under_500', labelEn: 'Under Rs. 500', labelNp: 'रु. ५०० मुनि', min: 0, max: 500 },
//   { id: '500_1000', labelEn: 'Rs. 500 - Rs. 1000', labelNp: 'रु. ५०० - रु. १०००', min: 500, max: 1000 },
//   { id: '1000_2000', labelEn: 'Rs. 1000 - Rs. 2000', labelNp: 'रु. १००० - रु. २०००', min: 1000, max: 2000 },
//   { id: 'above_2000', labelEn: 'Above Rs. 2000', labelNp: 'रु. २००० माथि', min: 2000, max: Infinity },
// ];

// export function ServicesClient({
//   servicesData: initialServicesData,
//   categoriesData,
//   subCategoriesData: initialSubCategoriesData = [],
//   totalPages: initialTotalPages = 1,
//   currentPage: initialCurrentPage = 1,
//   totalResults: initialTotalResults = 0,
//   initialCategoryId,
//   initialSubCategoryId,
//   screenTitle = 'Services',
// }: ServicesClientProps) {
//   const { language } = useI18n();
//   const router = useRouter();
//   const searchParams = useSearchParams();
  
//   // State for services and pagination
//   const [allServices, setAllServices] = useState<any[]>(initialServicesData);
//   const [displayServices, setDisplayServices] = useState<any[]>(initialServicesData);
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
//   const [filterType, setFilterType] = useState<FilterType>('name');
//   const [selectedCategory, setSelectedCategory] = useState<Category | null>(
//     categoriesData.find(c => c.id === initialCategoryId) || null
//   );
//   const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null);
//   const [subCategories, setSubCategories] = useState<SubCategory[]>(initialSubCategoriesData);
//   const [isLoadingSubCategories, setIsLoadingSubCategories] = useState(false);
  
//   // Dialog state
//   const [showProfessionalsDialog, setShowProfessionalsDialog] = useState(false);
//   const [selectedServiceProfessionals, setSelectedServiceProfessionals] = useState<any[]>([]);
//   const [selectedServiceName, setSelectedServiceName] = useState('');
  
//   // Refs for infinite scroll
//   const loaderRef = useRef<HTMLDivElement>(null);
  
//   // Filter sheet state
//   const [filterSheetFilters, setFilterSheetFilters] = useState({
//     sortBy: 'popular',
//     priceRange: null as string | null,
//     hasProfessionals: false,
//     hasPrices: false,
//   });

//   // Set initial values
//   useEffect(() => {
//     if (initialCategoryId && !selectedCategory) {
//       const category = categoriesData.find(c => c.id === initialCategoryId);
//       if (category) {
//         setSelectedCategory(category);
//       }
//     }
//     if (initialSubCategoryId && !selectedSubCategory) {
//       const subCategory = initialSubCategoriesData.find(s => s.id === initialSubCategoryId);
//       if (subCategory) {
//         setSelectedSubCategory(subCategory);
//       }
//     }
//   }, [initialCategoryId, initialSubCategoryId, categoriesData, initialSubCategoriesData]);

//   // Fetch subcategories when category changes
//   useEffect(() => {
//     if (selectedCategory) {
//       setIsLoadingSubCategories(true);
//       fetchSubCategories(1, 100, selectedCategory.id)
//         .then(data => {
//           setSubCategories(data.sub_categories);
//         })
//         .finally(() => setIsLoadingSubCategories(false));
//     } else {
//       setSubCategories([]);
//       setSelectedSubCategory(null);
//     }
//   }, [selectedCategory]);


// // Debounce search
// useEffect(() => {
//   const timer = setTimeout(() => {
//     if (searchQuery.length >= 2 || searchQuery.length === 0) {
//       setDebouncedSearchQuery(searchQuery);
//       if (searchQuery.length >= 2) {
//         handleSearch(false, { 
//           search: searchQuery,
//           categoryId: selectedCategory?.id,
//           subCategoryId: selectedSubCategory?.id 
//         });
//       } else if (searchQuery.length === 0) {
//         // Reset to initial when search cleared
//         setDisplayServices(allServices);
//       }
//     }
//   }, 500);

//   return () => clearTimeout(timer);
// }, [searchQuery, selectedCategory, selectedSubCategory]);

// const handleSearch = async (loadMore = false, filters?: {
//   categoryId?: number | null;
//   subCategoryId?: number | null;
//   search?: string;
// }) => {
//   if (loadMore && !hasMorePages) return;
  
//   console.log('handleSearch called with filters:', filters);
//   console.log('Current selectedCategory:', selectedCategory?.id);
//   console.log('Current selectedSubCategory:', selectedSubCategory?.id);
  
//   setIsSearchLoading(true);
//   try {
//     const nextPage = loadMore ? currentPage + 1 : 1;
    
//     // Use provided filters or current state, and convert null to undefined
//     const categoryId = filters?.categoryId !== undefined ? filters.categoryId : selectedCategory?.id;
//     const subCategoryId = filters?.subCategoryId !== undefined ? filters.subCategoryId : selectedSubCategory?.id;
//     const searchTerm = filters?.search !== undefined ? filters.search : debouncedSearchQuery;
    
//     console.log('Using categoryId:', categoryId);
//     console.log('Using subCategoryId:', subCategoryId);
    
//     const response = await searchProfessionalServices({
//       page: nextPage,
//       per_page: 20,
//       search: searchTerm || undefined,
//       category_id: categoryId === null ? undefined : categoryId,
//       sub_category_id: subCategoryId === null ? undefined : subCategoryId,
//     });
    
//     console.log('API response:', response);
    
//     // Group the results
//     const groupedServices = groupProfessionalServices(response.professional_services);
//     const servicesArray = Array.from(groupedServices.values()).map(group => ({
//       service: group.service,
//       professionals: group.professionals,
//       prices: group.prices,
//       professionalCount: group.professionalCount,
//     }));
    
//     if (loadMore) {
//       setAllServices(prev => [...prev, ...servicesArray]);
//       setDisplayServices(prev => [...prev, ...servicesArray]);
//     } else {
//       setAllServices(servicesArray);
//       setDisplayServices(servicesArray);
//       setCurrentPage(1); // Reset to page 1 for new searches
//     }
    
//     setCurrentPage(response.page);
//     setTotalPages(response.total_pages);
//     setTotalResults(response.total);
//     setHasMorePages(response.page < response.total_pages);
//   } catch (error) {
//     console.error('Error searching services:', error);
//   } finally {
//     setIsSearchLoading(false);
//   }
// };
//   // Load more for infinite scroll
//   const loadMoreServices = useCallback(async () => {
//     if (isLoadingMore || !hasMorePages) return;
//     setIsLoadingMore(true);
//     await handleSearch(true);
//     setIsLoadingMore(false);
//   }, [currentPage, hasMorePages, isLoadingMore, debouncedSearchQuery, selectedCategory, selectedSubCategory]);

//   // Intersection observer for infinite scroll
//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         const first = entries[0];
//         if (first.isIntersecting && hasMorePages && !isLoadingMore && !isSearchLoading) {
//           loadMoreServices();
//         }
//       },
//       { threshold: 0.1, rootMargin: '100px' }
//     );

//     if (loaderRef.current) {
//       observer.observe(loaderRef.current);
//     }

//     return () => observer.disconnect();
//   }, [hasMorePages, isLoadingMore, isSearchLoading, loadMoreServices]);

//   // Define filter sections
//   const filterSections: FilterSection[] = [
//     {
//       id: 'sortBy',
//       titleEn: 'Sort By',
//       titleNp: 'क्रमबद्ध गर्नुहोस्',
//       type: 'single',
//       options: sortOptions,
//     },
//     {
//       id: 'priceRange',
//       titleEn: 'Price Range',
//       titleNp: 'मूल्य सीमा',
//       type: 'single',
//       options: priceRangeOptions.map(opt => ({
//         id: opt.id,
//         labelEn: opt.labelEn,
//         labelNp: opt.labelNp,
//         value: opt,
//       })),
//     },
//     {
//       id: 'availability',
//       titleEn: 'Availability',
//       titleNp: 'उपलब्धता',
//       type: 'multiple',
//       options: [
//         { id: 'hasProfessionals', labelEn: 'Has Professionals', labelNp: 'व्यावसायिक उपलब्ध', icon: <Users className="h-3 w-3" /> },
//         { id: 'hasPrices', labelEn: 'Has Prices', labelNp: 'मूल्य उपलब्ध', icon: <DollarSign className="h-3 w-3" /> },
//       ],
//     },
//   ];

//   // Handle filter sheet apply
//   const handleApplyFilters = (filters: Record<string, any>) => {
//     setFilterSheetFilters({
//       sortBy: filters.sortBy || 'popular',
//       priceRange: filters.priceRange || null,
//       hasProfessionals: filters.availability?.includes('hasProfessionals') || false,
//       hasPrices: filters.availability?.includes('hasPrices') || false,
//     });
//   };

//   // Handle filter sheet reset
//   const handleResetFilters = () => {
//     setFilterSheetFilters({
//       sortBy: 'popular',
//       priceRange: null,
//       hasProfessionals: false,
//       hasPrices: false,
//     });
//   };

//   // Apply filters and sorting
//   const filteredServices = useMemo(() => {
//     return displayServices
//       .filter((item) => {
//         const { service, professionals, prices } = item;
        
//         // Apply price range filter
//         if (filterSheetFilters.priceRange) {
//           const range = priceRangeOptions.find(r => r.id === filterSheetFilters.priceRange);
//           if (range && prices.length > 0) {
//             const minPrice = Math.min(...prices.map((p: any) => p.price));
//             if (minPrice < range.min || minPrice > range.max) {
//               return false;
//             }
//           }
//         }
        
//         // Apply availability filters
//         if (filterSheetFilters.hasProfessionals && professionals.length === 0) {
//           return false;
//         }
        
//         if (filterSheetFilters.hasPrices && prices.length === 0) {
//           return false;
//         }
        
//         return true;
//       })
//       .sort((a, b) => {
//         switch (filterSheetFilters.sortBy) {
//           case 'price_low':
//             const aMin = a.prices.length > 0 ? Math.min(...a.prices.map((p: any) => p.price)) : Infinity;
//             const bMin = b.prices.length > 0 ? Math.min(...b.prices.map((p: any) => p.price)) : Infinity;
//             return aMin - bMin;
//           case 'price_high':
//             const aMax = a.prices.length > 0 ? Math.max(...a.prices.map((p: any) => p.price)) : -Infinity;
//             const bMax = b.prices.length > 0 ? Math.max(...b.prices.map((p: any) => p.price)) : -Infinity;
//             return bMax - aMax;
//           case 'name_asc':
//             const aName = language === 'ne' ? a.service.name_np : a.service.name_en;
//             const bName = language === 'ne' ? b.service.name_np : b.service.name_en;
//             return aName.localeCompare(bName);
//           case 'name_desc':
//             const aNameDesc = language === 'ne' ? a.service.name_np : a.service.name_en;
//             const bNameDesc = language === 'ne' ? b.service.name_np : b.service.name_en;
//             return bNameDesc.localeCompare(aNameDesc);
//           case 'popular':
//           default:
//             return (b.professionals?.length || 0) - (a.professionals?.length || 0);
//         }
//       });
//   }, [displayServices, filterSheetFilters, language]);

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
//       return `Rs. ${min}`;
//     }
//     return `Rs. ${min} - Rs. ${max}`;
//   };

//   // Show all professionals dialog
//   const showAllProfessionals = (professionals: any[], serviceName: string) => {
//     setSelectedServiceProfessionals(professionals);
//     setSelectedServiceName(serviceName);
//     setShowProfessionalsDialog(true);
//   };

//   // Render professionals row (like Flutter)
//   const renderProfessionalsRow = (item: any) => {
//     const professionals = item.professionals || [];
//     const visible = professionals.slice(0, 2);
//     const extra = professionals.length - visible.length;
    
//     if (professionals.length === 0) {
//       return (
//         <div className="flex items-center gap-2 mt-3">
//           <span className="text-sm text-muted-foreground">
//             {language === 'ne' ? 'कुनै व्यावसायिक छैन' : 'No professionals'}
//           </span>
//         </div>
//       );
//     }
    
//     return (
//       <div className="flex items-center gap-2 mt-3 flex-wrap">
//         <div className="flex -space-x-2">
//           {visible.map((prof: any, index: number) => (
//             <Avatar key={index} className="border-2 border-background h-8 w-8">
//               <AvatarImage src={prof.profile_image || undefined} />
//               <AvatarFallback className="text-xs">
//                 {prof.full_name?.charAt(0).toUpperCase() || 'P'}
//               </AvatarFallback>
//             </Avatar>
//           ))}
//         </div>
        
//         {extra > 0 && (
//           <Button
//             variant="link"
//             size="sm"
//             className="text-primary h-auto p-0 text-sm"
//             onClick={(e) => {
//               e.stopPropagation();
//               showAllProfessionals(professionals, getLocalizedName(item.service));
//             }}
//           >
//             +{extra} {language === 'ne' ? 'थप हेर्नुहोस्' : 'more'}
//           </Button>
//         )}
//       </div>
//     );
//   };

//   // Handle filter type change
//   const handleFilterChange = (type: FilterType) => {
//     setFilterType(type);
//     setSearchQuery('');
//     if (type === 'name') {
//       setSelectedCategory(null);
//       setSelectedSubCategory(null);
//     }
//   };

//   // Clear all filters
//   const handleClearFilters = () => {
//     setSearchQuery('');
//     setDebouncedSearchQuery('');
//     setSelectedCategory(null);
//     setSelectedSubCategory(null);
//     setIsSearching(false);
//     setFilterType('name');
//     handleResetFilters();
//   };

//   // Navigate to service details
//   const navigateToServiceDetails = (serviceId: number, serviceName: string) => {
//     router.push(`/services/${serviceId}/professionals?serviceName=${encodeURIComponent(serviceName)}`);
//   };

//   const hasActiveFilters = searchQuery || selectedCategory || selectedSubCategory || 
//     filterSheetFilters.sortBy !== 'popular' || filterSheetFilters.priceRange || 
//     filterSheetFilters.hasProfessionals || filterSheetFilters.hasPrices;

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
//               <div className="flex-1 relative">
//                 <Input
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   placeholder={language === 'ne' ? 'खोज्न टाइप गर्नुहोस्' : 'Type here to search'}
//                   className="border-0 bg-transparent text-primary-background placeholder:text-primary-background/70 focus-visible:ring-0 focus-visible:ring-offset-0 pr-8"
//                   autoFocus
//                 />
//                 {isSearchLoading && (
//                   <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-primary-background/70" />
//                 )}
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
//                 if (isSearching) {
//                   setSearchQuery('');
//                   setDebouncedSearchQuery('');
//                 }
//               }}
//             >
//               {isSearching ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
//             </Button>

//             {/* Filter Sheet */}
//             <FilterSheet
//               trigger={
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   className="text-primary-background hover:bg-primary-background/20 relative"
//                 >
//                   <SlidersHorizontal className="h-5 w-5" />
//                   {hasActiveFilters && (
//                     <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500" />
//                   )}
//                 </Button>
//               }
//               sections={filterSections}
//               activeFilters={{
//                 sortBy: filterSheetFilters.sortBy,
//                 priceRange: filterSheetFilters.priceRange,
//                 availability: [
//                   ...(filterSheetFilters.hasProfessionals ? ['hasProfessionals'] : []),
//                   ...(filterSheetFilters.hasPrices ? ['hasPrices'] : []),
//                 ],
//               }}
//               onApplyFilters={handleApplyFilters}
//               onReset={handleResetFilters}
//               title={language === 'ne' ? 'फिल्टरहरू' : 'Filters'}
//               description={language === 'ne' 
//                 ? 'आफ्नो प्राथमिकता अनुसार सेवाहरू फिल्टर गर्नुहोस्'
//                 : 'Filter services by your preferences'
//               }
//               side="right"
//             />

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
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>
//         </div>
//       </header>

//       <main className="container mx-auto px-4 py-6">
//         {/* Category Filter Section (like Flutter) */}
//    {filterType === 'category' && (
//   <div className="mb-6">
//     {/* Categories */}
// <div className="mb-4">
//   <h3 className="mb-3 text-sm font-medium text-muted-foreground">
//     {language === 'ne' ? 'श्रेणीहरू' : 'Categories'}
//   </h3>
//   <div className="flex overflow-x-auto pb-2 -mx-1 px-1">
//     <div className="flex gap-2">
//       <Badge
//         variant={!selectedCategory ? "default" : "outline"}
//         className="cursor-pointer px-4 py-2 whitespace-nowrap"
//         onClick={() => {
//           setSelectedCategory(null);
//           setSelectedSubCategory(null);
//           // Pass null values directly
//           handleSearch(false, { categoryId: null, subCategoryId: null });
//         }}
//       >
//         {language === 'ne' ? 'सबै' : 'All'}
//       </Badge>
//       {categoriesData.map((category) => (
//         <Badge
//           key={category.id}
//           variant={selectedCategory?.id === category.id ? "default" : "outline"}
//           className="cursor-pointer px-4 py-2 whitespace-nowrap"
//           onClick={() => {
//             if (selectedCategory?.id === category.id) {
//               setSelectedCategory(null);
//               setSelectedSubCategory(null);
//               handleSearch(false, { categoryId: null, subCategoryId: null });
//             } else {
//               setSelectedCategory(category);
//               setSelectedSubCategory(null);
//               // Pass the new category ID directly
//               handleSearch(false, { categoryId: category.id, subCategoryId: null });
//             }
//           }}
//         >
//           {language === 'ne' ? category.name_np : category.name_en}
//         </Badge>
//       ))}
//     </div>
//   </div>
// </div>

// {/* Subcategories */}
// {selectedCategory && (
//   <div className="mt-4">
//     <div className="mb-3 flex items-center justify-between">
//       <h3 className="text-sm font-medium text-muted-foreground">
//         {language === 'ne' ? 'उपश्रेणीहरू' : 'Subcategories'}
//         <span className="ml-2 text-xs">
//           ({language === 'ne' ? selectedCategory.name_np : selectedCategory.name_en})
//         </span>
//       </h3>
//       <Button
//         variant="ghost"
//         size="sm"
//         className="h-6 text-xs"
//         onClick={() => {
//           setSelectedSubCategory(null);
//           // Pass the current category ID but null subcategory
//           handleSearch(false, { 
//             categoryId: selectedCategory.id, 
//             subCategoryId: null 
//           });
//         }}
//         disabled={!selectedSubCategory}
//       >
//         {language === 'ne' ? 'सबै हेर्नुहोस्' : 'View All'}
//       </Button>
//     </div>
    
//     {isLoadingSubCategories ? (
//       <div className="flex overflow-x-auto gap-2 pb-2">
//         {[...Array(4)].map((_, i) => (
//           <Skeleton key={i} className="h-10 w-32 rounded-full flex-shrink-0" />
//         ))}
//       </div>
//     ) : subCategories.length > 0 ? (
//       <div className="flex overflow-x-auto gap-2 pb-2">
//         <Badge
//           variant={!selectedSubCategory ? "default" : "outline"}
//           className="cursor-pointer px-4 py-2 whitespace-nowrap"
//           onClick={() => {
//             setSelectedSubCategory(null);
//             handleSearch(false, { 
//               categoryId: selectedCategory.id, 
//               subCategoryId: null 
//             });
//           }}
//         >
//           {language === 'ne' ? 'सबै' : 'All'}
//         </Badge>
//         {/* {subCategories.map((sub) => (
//           <Badge
//             key={sub.id}
//             variant={selectedSubCategory?.id === sub.id ? "default" : "outline"}
//             className="cursor-pointer px-4 py-2 whitespace-nowrap"
//             onClick={() => {
//               const newSubCategoryId = selectedSubCategory?.id === sub.id ? null : sub.id;
//               setSelectedSubCategory(newSubCategoryId ? sub : null);
//               // Pass the new subcategory ID directly
//               handleSearch(false, { 
//                 categoryId: selectedCategory.id, 
//                 subCategoryId: newSubCategoryId 
//               });
//             }}
//           >
//             {language === 'ne' ? sub.name_np : sub.name_en}
//           </Badge>
//         ))} */}
//         {subCategories.map((sub) => (
//   <Badge
//     key={sub.id}
//     variant={selectedSubCategory?.id === sub.id ? "default" : "outline"}
//     className="cursor-pointer px-4 py-2 whitespace-nowrap"
//     onClick={() => {
//       const newSubCategoryId = selectedSubCategory?.id === sub.id ? null : sub.id;
//       console.log('Clicking subcategory:', sub.id, sub.name_en);
//       console.log('newSubCategoryId:', newSubCategoryId);
      
//       setSelectedSubCategory(newSubCategoryId ? sub : null);
      
//       // Pass the new subcategory ID directly
//       handleSearch(false, { 
//         categoryId: selectedCategory.id, 
//         subCategoryId: newSubCategoryId 
//       });
//     }}
//   >
//     {language === 'ne' ? sub.name_np : sub.name_en}
//   </Badge>
// ))}
//       </div>
//     ) : (
//       <div className="rounded-lg border border-dashed p-4 text-center">
//         <p className="text-sm text-muted-foreground">
//           {language === 'ne' 
//             ? 'यस श्रेणीमा कुनै उपश्रेणी छैन' 
//             : 'No subcategories in this category'}
//         </p>
//       </div>
//     )}
//   </div>
// )}



//   </div>
// )}

//         {/* Results Header */}
//         <div className="mb-4 flex items-center justify-between">
//           <h2 className="text-lg font-semibold">
//             {language === 'ne' ? 'सेवाहरू' : 'Services'}
//             <span className="ml-2 text-sm text-muted-foreground">
//               ({totalResults || filteredServices.length})
//             </span>
//           </h2>
          
//           {hasActiveFilters && (
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
//           <>
//             <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//               {filteredServices.map((item, index) => {
//                 const { service, professionals, prices } = item;
//                 const priceRange = getPriceRange(prices);
//                 const uniqueKey = `${service.id}-${index}`;
                
//                 return (
//                   <Card
//                     key={uniqueKey}
//                     className="group cursor-pointer overflow-hidden transition-all hover:border-primary hover:shadow-md"
//                     onClick={() => navigateToServiceDetails(service.id, getLocalizedName(service))}
//                   >
//                     {/* Service Image */}
//                     <div className="relative h-48 w-full overflow-hidden bg-muted">
//                       {service.image ? (
//                         <Image
//                           src={service.image}
//                           alt={getLocalizedName(service)}
//                           fill
//                           sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
//                           className="object-cover transition-transform duration-300 group-hover:scale-105"
//                         />
//                       ) : (
//                         <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
//                           <Home className="h-16 w-16 text-muted-foreground/50" />
//                         </div>
//                       )}
//                       <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
//                     </div>

//                     <CardContent className="p-4">
//                       {/* Service Name */}
//                       <h3 className="mb-2 line-clamp-1 font-semibold">
//                         {getLocalizedName(service)}
//                       </h3>

//                       {/* Category Badge */}
//                       <div className="mb-2">
//                         <Badge variant="secondary" className="text-xs">
//                           {getLocalizedCategoryName(service)}
//                         </Badge>
//                       </div>

//                       {/* Price Range */}
//                       {priceRange && (
//                         <div className="mb-3 flex items-center gap-1">
        
//                           <span className="font-semibold text-primary">
//                             {priceRange}
//                           </span>
//                         </div>
//                       )}

//                       {/* Professionals Count */}
//                       <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
//                         <Users className="h-4 w-4" />
//                         <span>
//                           {professionals.length} {language === 'ne' ? 'व्यावसायिक' : 'professionals'}
//                         </span>
//                       </div>

//                       {/* Professionals Row with Avatars */}
//                       {renderProfessionalsRow(item)}

//                       {/* View Details Arrow */}
//                       <div className="mt-4 flex items-center justify-between">
//                         <span className="text-sm text-muted-foreground">
//                           {language === 'ne' ? 'विवरण हेर्नुहोस्' : 'View details'}
//                         </span>
//                         <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
//                       </div>
//                     </CardContent>
//                   </Card>
//                 );
//               })}
//             </div>

//             {/* Infinite Scroll Loader */}
//             {hasMorePages && (
//               <div ref={loaderRef} className="py-8 flex justify-center">
//                 {(isLoadingMore || isSearchLoading) && (
//                   <div className="flex items-center gap-2">
//                     <Loader2 className="h-5 w-5 animate-spin text-primary" />
//                     <span className="text-sm text-muted-foreground">
//                       {language === 'ne' ? 'थप लोड हुँदै...' : 'Loading more...'}
//                     </span>
//                   </div>
//                 )}
//               </div>
//             )}
//           </>
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
          
//           <ScrollArea className="max-h-96 pr-4">
//             <div className="space-y-2 py-2">
//               {selectedServiceProfessionals.map((prof, index) => (
//                 <div key={index} className="flex items-center gap-3 py-2 border-b last:border-0">
//                   <Avatar>
//                     <AvatarImage src={prof.profile_image || undefined} />
//                     <AvatarFallback>
//                       {prof.full_name?.charAt(0).toUpperCase() || 'P'}
//                     </AvatarFallback>
//                   </Avatar>
//                   <div>
//                     <p className="font-medium">{prof.full_name || 'Professional'}</p>
//                     <p className="text-sm text-muted-foreground">
//                       {prof.skill || (language === 'ne' ? 'व्यावसायिक' : 'Professional')}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </ScrollArea>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

// // Helper function to group professional services (same as in types)
// function groupProfessionalServices(professionalServices: any[]): Map<number, any> {
//   const groupedMap = new Map<number, any>();
  
//   for (const ps of professionalServices) {
//     if (!ps.service || !ps.professional) continue;
    
//     const serviceId = ps.service.id;
    
//     if (!groupedMap.has(serviceId)) {
//       groupedMap.set(serviceId, {
//         service: ps.service,
//         professionals: [],
//         prices: [],
//         uniqueProfessionalIds: new Set<number>()
//       });
//     }
    
//     const group = groupedMap.get(serviceId)!;
    
//     // Add professional if unique
//     const professionalId = ps.professional.id;
//     if (!group.uniqueProfessionalIds.has(professionalId)) {
//       group.uniqueProfessionalIds.add(professionalId);
//       group.professionals.push({
//         id: professionalId,
//         user_id: ps.professional.user_id,
//         full_name: ps.professional.user.full_name,
//         profile_image: ps.professional.user.profile_image,
//         skill: ps.professional.skill
//       });
//     }
    
//     // Add prices
//     if (ps.prices) {
//       group.prices.push(...ps.prices);
//     }
//   }
  
//   return groupedMap;
// }