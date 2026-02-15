'use client';

import { useState, useEffect } from 'react'; 
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
  Star
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { createProfessionalSlug } from '@/lib/utils/slug';
import { FilterSheet, FilterSection } from '@/components/ui/filter-sheet';

interface ProfessionalsClientProps {
  professionalsData: any[];
  isSingleProfessionalView?: boolean;
  professionalName?: string;
  specificProfessionalId?: number;
}

type FilterType = 'name' | 'service' | 'skills' | 'address' | 'price';

const priceRanges = [
  { id: 'under_300', label: '< Rs. 300', value: 300 },
  { id: '300_800', label: 'Rs. 300 - Rs. 800', value: 800 },
  { id: 'above_800', label: '> Rs. 800', value: 801 },
];

// Define filter options for the FilterSheet
const searchFilterOptions = [
  { id: 'name', labelEn: 'By Name', labelNp: 'नाम द्वारा', icon: <User className="h-3 w-3" /> },
  { id: 'service', labelEn: 'By Service', labelNp: 'सेवा द्वारा', icon: <Building className="h-3 w-3" /> },
  { id: 'skills', labelEn: 'By Skills', labelNp: 'कौशल द्वारा', icon: <Award className="h-3 w-3" /> },
  { id: 'address', labelEn: 'By Address', labelNp: 'ठेगाना द्वारा', icon: <MapPin className="h-3 w-3" /> },
  { id: 'price', labelEn: 'By Price', labelNp: 'मूल्य द्वारा', icon: <DollarSign className="h-3 w-3" /> },
];

const priceFilterOptions = [
  { id: 'under_300', labelEn: 'Under Rs. 300', labelNp: 'रु. ३०० मुनि', value: 300 },
  { id: '300_800', labelEn: 'Rs. 300 - Rs. 800', labelNp: 'रु. ३०० - रु. ८००', value: 800 },
  { id: 'above_800', labelEn: 'Above Rs. 800', labelNp: 'रु. ८०० माथि', value: 801 },
];

const sortOptions = [
  { id: 'name_asc', labelEn: 'Name (A to Z)', labelNp: 'नाम (A देखि Z)', icon: <User className="h-3 w-3" /> },
  { id: 'name_desc', labelEn: 'Name (Z to A)', labelNp: 'नाम (Z देखि A)', icon: <User className="h-3 w-3" /> },
  { id: 'price_low', labelEn: 'Price: Low to High', labelNp: 'मूल्य: न्यून देखि उच्च', icon: <DollarSign className="h-3 w-3" /> },
  { id: 'price_high', labelEn: 'Price: High to Low', labelNp: 'मूल्य: उच्च देखि न्यून', icon: <DollarSign className="h-3 w-3" /> },
  { id: 'services', labelEn: 'Most Services', labelNp: 'धेरै सेवाहरू', icon: <Star className="h-3 w-3" /> },
];

export function ProfessionalsClient({
  professionalsData,
  isSingleProfessionalView = false,
  professionalName,
  specificProfessionalId,
}: ProfessionalsClientProps) {
  const { language } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [filterType, setFilterType] = useState<FilterType>('name');
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<any>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showPricesDialog, setShowPricesDialog] = useState(false);
  const [detailType, setDetailType] = useState<'service_areas' | 'services' | 'skills' | null>(null);
  const [displayProfessionals, setDisplayProfessionals] = useState<any[]>([]);
  
  // Filter sheet state
  const [filterSheetFilters, setFilterSheetFilters] = useState({
    searchType: 'name',
    priceRange: null as string | null,
    sortBy: 'name_asc',
    hasDiscount: false,
    hasMinimumPrice: false,
    location: null as string | null,
  });

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
      searchType: filters.searchType || 'name',
      priceRange: filters.priceRange || null,
      sortBy: filters.sortBy || 'name_asc',
      hasDiscount: filters.special?.includes('hasDiscount') || false,
      hasMinimumPrice: filters.special?.includes('hasMinimumPrice') || false,
      location: filters.location || null,
    });
    
    // Also update the local filter type for compatibility
    setFilterType((filters.searchType || 'name') as FilterType);
    
    // Update price range if selected
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
      searchType: 'name',
      priceRange: null,
      sortBy: 'name_asc',
      hasDiscount: false,
      hasMinimumPrice: false,
      location: null,
    });
    setFilterType('name');
    setSelectedPriceRange(null);
  };

  // Initialize display professionals based on props
  useEffect(() => {
    let filtered = professionalsData;
    
    // If specificProfessionalId is provided, show only that professional
    if (specificProfessionalId) {
      filtered = professionalsData.filter(
        professional => professional.id === specificProfessionalId
      );
    }
    
    setDisplayProfessionals(filtered);
  }, [professionalsData, specificProfessionalId]);

  // Filter and sort professionals
  const filteredProfessionals = professionalsData
    .filter((professional) => {
      const query = searchQuery.toLowerCase();
      
      // Location filter from URL params
      const province = searchParams?.get('province');
      const district = searchParams?.get('district');
      const municipality = searchParams?.get('municipality');
      
      // Apply location filters from URL
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
      
      // Apply filter sheet location filter
      if (filterSheetFilters.location) {
        const locationLower = filterSheetFilters.location.toLowerCase();
        const hasMatchingLocation = professional.service_areas_full?.some((area: any) =>
          area.name?.toLowerCase().includes(locationLower)
        ) || professional.service_areas_display?.toLowerCase().includes(locationLower);
        if (!hasMatchingLocation) return false;
      }
      
      // Price filter from filter sheet
      if (filterSheetFilters.priceRange) {
        const range = priceFilterOptions.find(r => r.id === filterSheetFilters.priceRange);
        const hasMatchingPrice = professional.all_prices?.some((price: any) => {
          const priceValue = price.price;
          if (range?.value === 300) return priceValue <= 300;
          if (range?.value === 800) return priceValue > 300 && priceValue <= 800;
          if (range?.value === 801) return priceValue > 800;
          return false;
        });
        if (!hasMatchingPrice) return false;
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
      
      // Search filter
      if (query) {
        switch (filterSheetFilters.searchType) {
          case 'name':
            return professional.full_name?.toLowerCase().includes(query);
          case 'service':
            return professional.service_name?.toLowerCase().includes(query);
          case 'skills':
            return professional.all_skills?.toLowerCase().includes(query);
          case 'address':
            return professional.service_areas_display?.toLowerCase().includes(query);
          case 'price':
            // Search in price descriptions
            return professional.all_prices?.some((price: any) => 
              price.price.toString().includes(query) ||
              price.price_unit?.name?.toLowerCase().includes(query) ||
              price.quality_type?.name?.toLowerCase().includes(query)
            );
          default:
            return true;
        }
      }
      
      return true;
    })
    .sort((a, b) => {
      switch (filterSheetFilters.sortBy) {
        case 'name_asc':
          return (a.full_name || '').localeCompare(b.full_name || '');
        case 'name_desc':
          return (b.full_name || '').localeCompare(a.full_name || '');
        case 'price_low':
          const aMin = a.all_prices?.length ? Math.min(...a.all_prices.map((p: any) => p.price)) : Infinity;
          const bMin = b.all_prices?.length ? Math.min(...b.all_prices.map((p: any) => p.price)) : Infinity;
          return aMin - bMin;
        case 'price_high':
          const aMax = a.all_prices?.length ? Math.max(...a.all_prices.map((p: any) => p.price)) : -Infinity;
          const bMax = b.all_prices?.length ? Math.max(...b.all_prices.map((p: any) => p.price)) : -Infinity;
          return bMax - aMax;
        case 'services':
          return (b.services?.length || 0) - (a.services?.length || 0);
        default:
          return 0;
      }
    });

  // Get localized text
  const getLocalizedText = (en: string, np: string) => {
    return language === 'ne' ? np : en;
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

  // Get display items for each type
  const getDisplayItems = (professional: any, type: 'services' | 'skills' | 'service_areas') => {
    switch (type) {
      case 'services':
        return professional.services?.map((s: any) => s.service?.name_en || s.name) || 
               [professional.service_name].filter(Boolean);
      case 'skills':
        return professional.all_skills?.split(', ').filter(Boolean) || [];
      case 'service_areas':
        return professional.service_areas_full?.map((area: any) => area.name) || 
               (professional.service_areas_display ? [professional.service_areas_display] : []);
      default:
        return [];
    }
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

  // Calculate price range
  const calculatePriceRange = (prices: any[]) => {
    if (!prices || prices.length === 0) {
      return {
        min: null,
        max: null,
        hasDiscount: false,
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

  const hasActiveFilters = searchQuery || filterSheetFilters.priceRange || 
    filterSheetFilters.searchType !== 'name' || filterSheetFilters.sortBy !== 'name_asc' ||
    filterSheetFilters.hasDiscount || filterSheetFilters.hasMinimumPrice || filterSheetFilters.location;

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
              <div className="flex-1">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={getLocalizedText(
                    `Search by ${filterType}...`,
                    `${filterSheetFilters.searchType} द्वारा खोज्नुहोस्...`
                  )}
                  className="border-0 bg-transparent text-primary-background placeholder:text-primary-background/70 focus-visible:ring-0 focus-visible:ring-offset-0"
                  autoFocus
                />
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
                    : `${filteredProfessionals.length} ${getLocalizedText('professionals', 'व्यावसायिक')}`
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
                  if (isSearching) setSearchQuery('');
                }}
              >
                {isSearching ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
              </Button>

              {/* Replace the old filter dropdown with FilterSheet */}
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
                  searchType: filterSheetFilters.searchType,
                  priceRange: filterSheetFilters.priceRange,
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
            
            {filterSheetFilters.searchType !== 'name' && (
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
                    setFilterSheetFilters(prev => ({ ...prev, searchType: 'name' }));
                    setFilterType('name');
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
          <div className={`grid gap-6 ${specificProfessionalId ? 'grid-cols-1 max-w-2xl mx-auto' : 'grid-cols-1 md:grid-cols-2'}`}>
            {filteredProfessionals.map((professional) => {
              const priceRange = calculatePriceRange(professional.all_prices);
              const hasMultiplePrices = professional.all_prices && professional.all_prices.length > 1;
              
              return (
                <Card 
                  key={professional.id}
                  className={`overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col ${specificProfessionalId ? 'border-primary/20 border-2' : ''}`}
                >
                  <CardContent className="p-5 flex-1 flex flex-col">
                    {/* Header with Avatar and Name */}
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
                    </div>

                    {/* Services (Limited to 3) */}
                    <div className="mb-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Building className="h-4 w-4" />
                        <span className="font-medium">{getLocalizedText('Services', 'सेवाहरू')}:</span>
                      </div>
                      {renderTruncatedList(getDisplayItems(professional, 'services'), 3, 'services', professional)}
                    </div>

                    {/* Skills (Limited to 3) */}
                    <div className="mb-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Award className="h-4 w-4" />
                        <span className="font-medium">{getLocalizedText('Skills', 'कौशलहरू')}:</span>
                      </div>
                      {renderTruncatedList(getDisplayItems(professional, 'skills'), 3, 'skills', professional)}
                    </div>

                    {/* Service Areas (Limited to 3) */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <MapPin className="h-4 w-4" />
                        <span className="font-medium">{getLocalizedText('Service Areas', 'सेवा क्षेत्रहरू')}:</span>
                      </div>
                      {renderTruncatedList(getDisplayItems(professional, 'service_areas'), 3, 'service_areas', professional)}
                    </div>

                    {/* Price Range - Highlighted */}
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
        )}
      </main>

      {/* Details Dialog for Services/Skills/Service Areas */}
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