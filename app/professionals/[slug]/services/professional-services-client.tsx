'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n/context';
import { 
  Search, 
  X, 
  Filter, 
  ChevronRight, 
  Wrench, 
  Tag, 
  DollarSign,
  SlidersHorizontal,
  Star
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Image from 'next/image';
import { BookNowButton } from '@/components/professional/book-now-button';
import { FilterSheet, FilterSection } from '@/components/ui/filter-sheet'; // Import your new component

interface ProfessionalServicesClientProps {
  professionalId: number;
  professionalName: string;
  services: any[];
}

type FilterType = 'name' | 'price' | 'category';
type SortOption = 'price-low' | 'price-high' | 'name-asc' | 'name-desc' | 'popular';

const tagFilters = [
  { id: 'best_deal', labelEn: 'Best Deal', labelNp: 'उत्कृष्ट सम्झौता', icon: <Star className="h-3 w-3" /> },
  { id: 'bumper_offer', labelEn: 'Bumper Offer', labelNp: 'बम्पर अफर', icon: <Tag className="h-3 w-3" /> },
  { id: 'dashain_offer', labelEn: 'Dashain Offer', labelNp: 'दशैं अफर', icon: <Tag className="h-3 w-3" /> },
  { id: 'featured', labelEn: 'Featured', labelNp: 'विशेष', icon: <Star className="h-3 w-3" /> },
];

const priceRanges = [
  { label: 'Under Rs. 500', value: 500, min: 0, max: 500 },
  { label: 'Rs. 500 - Rs. 1000', value: 1000, min: 500, max: 1000 },
  { label: 'Rs. 1000 - Rs. 2000', value: 2000, min: 1000, max: 2000 },
  { label: 'Above Rs. 2000', value: 2001, min: 2000, max: Infinity },
];

export function ProfessionalServicesClient({
  professionalId,
  professionalName,
  services,
}: ProfessionalServicesClientProps) {
  const router = useRouter();
  const { language } = useI18n();
  
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [filterType, setFilterType] = useState<FilterType>('name');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [showFilters, setShowFilters] = useState(false);

  const getLocalizedText = (en: string, np: string) => {
    return language === 'ne' ? np : en;
  };

  // Format price with discount
  const formatPriceDisplay = (price: any) => {
    const hasDiscount = price.discount_percentage > 0 && price.discount_is_active;
    const discountedPrice = hasDiscount
      ? Math.round(price.price * (1 - price.discount_percentage / 100))
      : null;

    return {
      hasDiscount,
      originalPrice: price.price,
      discountedPrice,
      discountPercentage: price.discount_percentage,
      unit: price.price_unit?.name || '',
      quality: price.quality_type?.name || '',
      isMinimumPrice: price.is_minimum_price,
    };
  };

  // Get minimum price for a service
  const getMinPrice = (prices: any[]) => {
    if (!prices || prices.length === 0) return Infinity;
    return Math.min(...prices.map(p => p.price));
  };

  // Apply filters and sorting
  const filteredAndSortedServices = useMemo(() => {
    let filtered = [...services];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(service => {
        const nameEn = service.service?.name_en?.toLowerCase() || '';
        const nameNp = service.service?.name_np?.toLowerCase() || '';
        const descEn = service.service?.description_en?.toLowerCase() || '';
        return nameEn.includes(query) || nameNp.includes(query) || descEn.includes(query);
      });
    }

    // Tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(service => {
        return selectedTags.some(tag => service.tag === tag);
      });
    }

    // Price range filter
    if (selectedPriceRange) {
      const range = priceRanges.find(r => r.value === selectedPriceRange);
      if (range) {
        filtered = filtered.filter(service => {
          const minPrice = getMinPrice(service.prices);
          return minPrice >= range.min && minPrice < range.max;
        });
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aMinPrice = getMinPrice(a.prices);
      const bMinPrice = getMinPrice(b.prices);
      
      switch (sortBy) {
        case 'price-low':
          return aMinPrice - bMinPrice;
        case 'price-high':
          return bMinPrice - aMinPrice;
        case 'name-asc':
          return (a.service?.name_en || '').localeCompare(b.service?.name_en || '');
        case 'name-desc':
          return (b.service?.name_en || '').localeCompare(a.service?.name_en || '');
        case 'popular':
        default:
          return 0;
      }
    });

    return filtered;
  }, [services, searchQuery, selectedTags, selectedPriceRange, sortBy]);

  // Toggle tag selection
  const toggleTag = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(t => t !== tagId)
        : [...prev, tagId]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
    setSelectedPriceRange(null);
    setSortBy('popular');
  };

  // Create a professional object for the BookNowButton
  const createProfessionalObject = (service: any) => ({
    id: service.professional_id,
    professional_id: service.professional_id,
    full_name: professionalName,
    service_name: language === 'ne' ? service.service?.name_np : service.service?.name_en,
    all_prices: service.prices || [],
  });

  const hasActiveFilters = searchQuery || selectedTags.length > 0 || selectedPriceRange;

  // Define filter sections for the reusable FilterSheet
  const filterSections: FilterSection[] = [
    {
      id: 'tags',
      titleEn: 'Special Offers',
      titleNp: 'विशेष अफरहरू',
      type: 'multiple',
      options: tagFilters.map(tag => ({
        id: tag.id,
        labelEn: tag.labelEn,
        labelNp: tag.labelNp,
        icon: tag.icon,
      })),
    },
    {
      id: 'priceRange',
      titleEn: 'Price Range',
      titleNp: 'मूल्य सीमा',
      type: 'single',
      options: priceRanges.map(range => ({
        id: range.value.toString(),
        labelEn: range.label,
        labelNp: range.label, // You can add Nepali translations if needed
        value: range.value,
      })),
    },
  ];

  // Handle filter changes from the FilterSheet
  const handleApplyFilters = (filters: Record<string, any>) => {
    setSelectedTags(filters.tags || []);
    setSelectedPriceRange(filters.priceRange ? parseInt(filters.priceRange) : null);
    setShowFilters(false);
  };

  const handleResetFilters = () => {
    clearFilters();
    setShowFilters(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-primary text-primary-foreground">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground hover:bg-primary-foreground/20"
              onClick={() => router.back()}
            >
              <ChevronRight className="h-5 w-5 rotate-180" />
            </Button>
            
            {isSearching ? (
              <div className="flex-1">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={getLocalizedText(
                    'Search services...',
                    'सेवाहरू खोज्नुहोस्...'
                  )}
                  className="border-0 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/70 focus-visible:ring-0 focus-visible:ring-offset-0"
                  autoFocus
                />
              </div>
            ) : (
              <div>
                <h1 className="text-lg font-semibold">{professionalName}</h1>
                <p className="text-xs text-primary-foreground/70">
                  {filteredAndSortedServices.length} {getLocalizedText('services', 'सेवाहरू')}
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground hover:bg-primary-foreground/20"
              onClick={() => {
                setIsSearching(!isSearching);
                if (isSearching) setSearchQuery('');
              }}
            >
              {isSearching ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </Button>

            {/* Replace the old filter button with FilterSheet */}
            <FilterSheet
              trigger={
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-primary-foreground hover:bg-primary-foreground/20 relative"
                >
                  <SlidersHorizontal className="h-5 w-5" />
                </Button>
              }
              sections={filterSections}
              activeFilters={{
                tags: selectedTags,
                priceRange: selectedPriceRange?.toString(),
              }}
              onApplyFilters={handleApplyFilters}
              onReset={handleResetFilters}
              title={getLocalizedText('Filter Services', 'सेवाहरू फिल्टर गर्नुहोस्')}
              description={getLocalizedText(
                'Filter services by your preferences',
                'आफ्नो प्राथमिकता अनुसार सेवाहरू फिल्टर गर्नुहोस्'
              )}
              side="right"
            />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-primary-foreground hover:bg-primary-foreground/20"
                >
                  <Filter className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortBy('popular')}>
                  {getLocalizedText('Popular', 'लोकप्रिय')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('price-low')}>
                  {getLocalizedText('Price: Low to High', 'मूल्य: न्यून देखि उच्च')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('price-high')}>
                  {getLocalizedText('Price: High to Low', 'मूल्य: उच्च देखि न्यून')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('name-asc')}>
                  {getLocalizedText('Name: A to Z', 'नाम: A देखि Z')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('name-desc')}>
                  {getLocalizedText('Name: Z to A', 'नाम: Z देखि A')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {getLocalizedText('Active filters:', 'सक्रिय फिल्टरहरू:')}
            </span>
            
            {searchQuery && (
              <Badge variant="secondary" className="gap-1">
                {getLocalizedText('Search', 'खोज')}: {searchQuery}
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
            
            {selectedTags.map(tagId => {
              const tag = tagFilters.find(t => t.id === tagId);
              return tag ? (
                <Badge key={tagId} variant="secondary" className="gap-1">
                  {tag.icon}
                  {getLocalizedText(tag.labelEn, tag.labelNp)}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-1 h-3 w-3 p-0 hover:bg-transparent"
                    onClick={() => toggleTag(tagId)}
                  >
                    <X className="h-2 w-2" />
                  </Button>
                </Badge>
              ) : null;
            })}
            
            {selectedPriceRange && (
              <Badge variant="secondary" className="gap-1">
                {getLocalizedText('Price', 'मूल्य')}: {
                  priceRanges.find(r => r.value === selectedPriceRange)?.label
                }
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-1 h-3 w-3 p-0 hover:bg-transparent"
                  onClick={() => setSelectedPriceRange(null)}
                >
                  <X className="h-2 w-2" />
                </Button>
              </Badge>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={clearFilters}
            >
              {getLocalizedText('Clear all', 'सबै हटाउनुहोस्')}
            </Button>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {getLocalizedText('All Services', 'सबै सेवाहरू')}
          </h2>
          <span className="text-sm text-muted-foreground">
            {filteredAndSortedServices.length} {getLocalizedText('services found', 'सेवाहरू फेला पर्यो')}
          </span>
        </div>
        
        {/* Services Grid */}
        {filteredAndSortedServices.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed">
            <Search className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">
              {getLocalizedText('No services found', 'कुनै सेवा फेला परेन')}
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={clearFilters}
            >
              {getLocalizedText('Clear Filters', 'फिल्टर हटाउनुहोस्')}
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAndSortedServices.map((service: any) => {
              const professional = createProfessionalObject(service);
              const pricedItems = service.prices?.filter((p: any) => p.price !== null) || [];
              
              return (
                <Card 
                  key={service.id} 
                  className="group h-full overflow-hidden transition-all hover:border-primary hover:shadow-lg cursor-pointer"
                //   onClick={() => router.push(`/services/${service.service_id}/professionals`)}
                >
                  <CardContent className="p-0">
                    {/* Service Image */}
                    <div className="relative h-44 w-full overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
                      {service.service?.image ? (
                        <Image
                          src={service.service.image}
                          alt={service.service.name_en}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Wrench className="h-12 w-12 text-muted-foreground/30" />
                        </div>
                      )}
                      
                      {/* Price Badge */}
                      {pricedItems.length > 0 && (
                        <div className="absolute top-3 right-3">
                          <div className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-lg">
                            <DollarSign className="inline h-3 w-3" />
                            {Math.min(...pricedItems.map((p: any) => p.price))}+
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-4">
                      {/* Service Name */}
                      <div>
                        <h3 className="text-lg font-semibold line-clamp-1">
                          {language === 'ne' ? service.service?.name_np : service.service?.name_en}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {service.service?.description_en}
                        </p>
                      </div>

                      {/* Prices Section */}
                      {pricedItems.length > 0 && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <DollarSign className="h-4 w-4" />
                            <span>{getLocalizedText('Pricing', 'मूल्य निर्धारण')}</span>
                          </div>
                          
                          <div className="space-y-2">
                            {pricedItems.slice(0, 2).map((price: any) => {
                              const priceDisplay = formatPriceDisplay(price);
                              
                              return (
                                <div
                                  key={price.id}
                                  className="rounded-lg border bg-card p-3 transition-colors hover:bg-accent/50"
                                >
                                  <div className="flex items-start justify-between">
                                    {/* Price */}
                                    <div>
                                      {priceDisplay.hasDiscount ? (
                                        <div className="space-y-1">
                                          <div className="flex items-center gap-2">
                                            <span className="text-lg font-bold text-primary">
                                              Rs. {priceDisplay.discountedPrice}
                                            </span>
                                            <span className="text-xs line-through text-muted-foreground">
                                              Rs. {priceDisplay.originalPrice}
                                            </span>
                                          </div>
                                          <div className="flex items-center gap-1">
                                            <Tag className="h-3 w-3 text-green-500" />
                                            <span className="text-xs font-medium text-green-500">
                                              {priceDisplay.discountPercentage}% OFF
                                            </span>
                                          </div>
                                        </div>
                                      ) : (
                                        <span className="text-lg font-bold text-primary">
                                          Rs. {priceDisplay.originalPrice}
                                        </span>
                                      )}
                                      
                                      {/* Unit and Quality */}
                                      <div className="mt-1 text-xs text-muted-foreground">
                                        {priceDisplay.unit} • {priceDisplay.quality}
                                      </div>
                                    </div>

                                    {/* Minimum Price Badge */}
                                    {priceDisplay.isMinimumPrice && (
                                      <span className="rounded-full bg-blue-100 px-2 py-1 text-[10px] font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                        {getLocalizedText('Starting', 'सुरु')}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                            
                            {/* Show count of additional prices */}
                            {pricedItems.length > 2 && (
                              <p className="text-xs text-muted-foreground text-center pt-1">
                                +{pricedItems.length - 2} {getLocalizedText('more options', 'थप विकल्पहरू')}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Book Now Button */}
                      <div onClick={(e) => e.stopPropagation()} className="pt-2">
                        <BookNowButton 
                          professional={professional}
                          size="default"
                          variant="default"
                          className="w-full"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>

      {/* Remove the old Filter Sheet - it's now replaced by the FilterSheet component above */}
    </div>
  );
}