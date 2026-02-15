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
  Users,
  SlidersHorizontal,
  Star,
  Tag
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

interface ServicesClientProps {
  servicesData: GroupedService[];
  categoriesData: Category[];
  initialCategoryId?: number;
  initialSubCategoryId?: number;
  screenTitle?: string;
}

type FilterType = 'name' | 'category' | 'subcategory';

// Define filter options
const sortOptions = [
  { id: 'popular', labelEn: 'Popular', labelNp: 'लोकप्रिय', icon: <Star className="h-3 w-3" /> },
  { id: 'price_low', labelEn: 'Price: Low to High', labelNp: 'मूल्य: न्यून देखि उच्च', icon: <DollarSign className="h-3 w-3" /> },
  { id: 'price_high', labelEn: 'Price: High to Low', labelNp: 'मूल्य: उच्च देखि न्यून', icon: <DollarSign className="h-3 w-3" /> },
  { id: 'name_asc', labelEn: 'Name: A to Z', labelNp: 'नाम: A देखि Z', icon: <Tag className="h-3 w-3" /> },
  { id: 'name_desc', labelEn: 'Name: Z to A', labelNp: 'नाम: Z देखि A', icon: <Tag className="h-3 w-3" /> },
];

const priceRangeOptions = [
  { id: 'under_500', labelEn: 'Under Rs. 500', labelNp: 'रु. ५०० मुनि', value: { min: 0, max: 500 } },
  { id: '500_1000', labelEn: 'Rs. 500 - Rs. 1000', labelNp: 'रु. ५०० - रु. १०००', value: { min: 500, max: 1000 } },
  { id: '1000_2000', labelEn: 'Rs. 1000 - Rs. 2000', labelNp: 'रु. १००० - रु. २०००', value: { min: 1000, max: 2000 } },
  { id: 'above_2000', labelEn: 'Above Rs. 2000', labelNp: 'रु. २००० माथि', value: { min: 2000, max: Infinity } },
];

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
  
  // Filter sheet state
  const [filterSheetFilters, setFilterSheetFilters] = useState({
    sortBy: 'popular',
    priceRange: null as string | null,
    hasProfessionals: false,
    hasPrices: false,
  });

  // Define filter sections for FilterSheet
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
      options: priceRangeOptions,
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

  // Set initial values on mount
  useEffect(() => {
    if (initialCategoryId && !selectedCategory) {
      const category = categoriesData.find(c => c.id === initialCategoryId);
      if (category) {
        setSelectedCategory(category);
      }
    }
  }, [initialCategoryId, categoriesData, selectedCategory]);

  // Fetch subcategories when category is selected
  useEffect(() => {
    if (selectedCategory) {
      setIsLoadingSubCategories(true);
      fetchSubCategories(1, 50, selectedCategory.id)
        .then(data => {
          setSubCategories(data.sub_categories);
          // Auto-select subcategory if initialSubCategoryId provided
          if (initialSubCategoryId && !selectedSubCategory) {
            const sub = data.sub_categories.find(s => s.id === initialSubCategoryId);
            if (sub) {
              setSelectedSubCategory(sub);
            }
          }
        })
        .finally(() => setIsLoadingSubCategories(false));
    } else {
      setSubCategories([]);
      if (!initialSubCategoryId) {
        setSelectedSubCategory(null);
      }
    }
  }, [selectedCategory, initialSubCategoryId, selectedSubCategory]);

  // Apply filtering
  const filteredServices = servicesData.filter(({ service, professionals, prices }) => {
    const query = searchQuery.toLowerCase();
    
    // Apply category/subcategory filters (always active)
    let matchesCategory = true;
    let matchesSubCategory = true;
    
    if (selectedCategory) {
      matchesCategory = service.category_id === selectedCategory.id;
    }
    
    if (selectedSubCategory) {
      matchesSubCategory = service.sub_category_id === selectedSubCategory.id;
    }
    
    if (!matchesCategory || !matchesSubCategory) {
      return false;
    }
    
    // Apply filter sheet filters
    if (filterSheetFilters.hasProfessionals && professionals.length === 0) {
      return false;
    }
    
    if (filterSheetFilters.hasPrices && prices.length === 0) {
      return false;
    }
    
    if (filterSheetFilters.priceRange) {
      const range = priceRangeOptions.find(r => r.id === filterSheetFilters.priceRange)?.value;
      if (range && prices.length > 0) {
        const minPrice = Math.min(...prices.map(p => p.price));
        if (minPrice < range.min || minPrice > range.max) {
          return false;
        }
      }
    }
    
    // Apply search filter
    if (query) {
      if (filterType === 'name') {
        const serviceName = language === 'ne' 
          ? service.name_np.toLowerCase()
          : service.name_en.toLowerCase();
        return serviceName.includes(query);
      }
      
      if (filterType === 'category') {
        const categoryName = language === 'ne'
          ? service.category?.name_np?.toLowerCase() || ''
          : service.category?.name_en?.toLowerCase() || '';
        return categoryName.includes(query);
      }
      
      if (filterType === 'subcategory') {
        const subCategoryName = language === 'ne'
          ? service.sub_category?.name_np?.toLowerCase() || ''
          : service.sub_category?.name_en?.toLowerCase() || '';
        return subCategoryName.includes(query);
      }
    }
    
    return true;
  });

  // Apply sorting
  const sortedServices = [...filteredServices].sort((a, b) => {
    switch (filterSheetFilters.sortBy) {
      case 'price_low':
        const aMinPrice = a.prices.length > 0 ? Math.min(...a.prices.map(p => p.price)) : Infinity;
        const bMinPrice = b.prices.length > 0 ? Math.min(...b.prices.map(p => p.price)) : Infinity;
        return aMinPrice - bMinPrice;
      case 'price_high':
        const aMaxPrice = a.prices.length > 0 ? Math.max(...a.prices.map(p => p.price)) : -Infinity;
        const bMaxPrice = b.prices.length > 0 ? Math.max(...b.prices.map(p => p.price)) : -Infinity;
        return bMaxPrice - aMaxPrice;
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
        // Sort by number of professionals (popularity)
        return (b.professionals?.length || 0) - (a.professionals?.length || 0);
    }
  });

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
  const showAllProfessionals = (service: GroupedService) => {
    setSelectedServiceProfessionals(service.professionals);
    setSelectedServiceName(getLocalizedName(service.service));
    setShowProfessionalsDialog(true);
  };

  // Handle filter type change
  const handleFilterChange = (type: FilterType) => {
    setFilterType(type);
    setSearchQuery('');
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedSubCategory(null);
    setIsSearching(false);
    setFilterType('name');
    handleResetFilters();
  };

  // Navigate to service details
  const navigateToServiceDetails = (serviceId: number) => {
    router.push(`/services/${serviceId}/professionals`);
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
              <AvatarImage src={prof.user?.profile_image || undefined} />
              <AvatarFallback>
                {prof.user?.full_name?.charAt(0).toUpperCase() || 'P'}
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

            {/* Filter Sheet */}
            <FilterSheet
              trigger={
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-primary-background hover:bg-primary-background/20 relative"
                >
                  <SlidersHorizontal className="h-5 w-5" />
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

        {/* Subcategory Filter */}
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
            
            {/* Category selection */}
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

            {/* Subcategory selection */}
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
                        ? 'यस श्रेणीमा कुनै उपश्रेणी छैन' 
                        : 'No subcategories in this category'}
                    </p>
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
              ({sortedServices.length})
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
        {sortedServices.length === 0 ? (
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
            {sortedServices.map(({ service, professionals, prices }) => (
              <Card
                key={service.id}
                className="group cursor-pointer overflow-hidden transition-all hover:border-primary hover:shadow-md"
                onClick={() => navigateToServiceDetails(service.id)}
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
                  <AvatarImage src={prof.user?.profile_image || undefined} />
                  <AvatarFallback>
                    {prof.user?.full_name?.charAt(0).toUpperCase() || 'P'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{prof.user?.full_name || 'Professional'}</p>
                  <p className="text-sm text-muted-foreground">
                    {prof.skill || (language === 'ne' ? 'व्यावसायिक' : 'Professional')}
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