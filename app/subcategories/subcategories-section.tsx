'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { useRouter } from 'next/navigation';
import { fetchCategories } from '@/lib/api/categories';
import { SubCategory, SubCategoriesResponse } from '@/lib/data/subcategories';
import { Category } from '@/lib/data/categories';
import { 
  Search, 
  X, 
  Filter, 
  Info, 
  ChevronRight,
  Home,
  Sparkles,
  Tag,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import Link from 'next/link';

interface SubCategoriesClientProps {
  subCategoriesData: SubCategoriesResponse;
  initialCategoryId?: number;
  screenTitle?: string;
    isCategorySpecific?: boolean;
}

type FilterType = 'name' | 'tag' | 'category';

const tags = [
  { id: 'best_deal', labelEn: 'Best Deal', labelNp: 'उत्कृष्ट सम्झौता' },
  { id: 'bumper_offer', labelEn: 'Bumper Offer', labelNp: 'बम्पर अफर' },
  { id: 'dashain_offer', labelEn: 'Dashain Offer', labelNp: 'दशैं अफर' },
  { id: 'featured', labelEn: 'Featured', labelNp: 'विशेष' },
];

export function SubCategoriesClient({
  subCategoriesData,
  initialCategoryId,
  screenTitle = 'Subcategories',
   isCategorySpecific = false, 
}: SubCategoriesClientProps) {
  const { language } = useI18n();
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
//   const [filterType, setFilterType] = useState<FilterType>('name');
  const [filterType, setFilterType] = useState<FilterType>(
    isCategorySpecific ? 'category' : 'name'
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string>('');

  const { sub_categories } = subCategoriesData;

  // Fetch categories when needed
  useEffect(() => {
    if (filterType === 'category' && categories.length === 0) {
      setIsLoadingCategories(true);
      fetchCategories(1, 50)
        .then(data => setCategories(data.categories))
        .finally(() => setIsLoadingCategories(false));
    }
  }, [filterType, categories.length]);

  // Apply filtering logic similar to Flutter
  const filteredSubCategories = sub_categories.filter((sub) => {
    const query = searchQuery.toLowerCase();
    
    if (filterType === 'category' && query && selectedTag) {
      return false; // Clear tag selection when searching by category
    }
    
    if (filterType === 'category' && query) {
      const categoryName = language === 'ne' 
        ? sub.category?.name_np.toLowerCase() || ''
        : sub.category?.name_en.toLowerCase() || '';
      return categoryName.includes(query);
    }
    
    if (query) {
      switch (filterType) {
        case 'name':
          const subName = language === 'ne' 
            ? sub.name_np.toLowerCase()
            : sub.name_en.toLowerCase();
          return subName.includes(query);
        
        case 'tag':
          // Simplified tag filtering - in real app, you'd have tags in your API
          return selectedTag === 'featured' || selectedTag === 'best_deal';
        
        case 'category':
          const categoryName = language === 'ne' 
            ? sub.category?.name_np.toLowerCase() || ''
            : sub.category?.name_en.toLowerCase() || '';
          return categoryName.includes(query);
      }
    }
    
    // If initial category is provided, filter by it
    if (initialCategoryId && filterType === 'category' && !query) {
      return sub.category?.id === initialCategoryId;
    }
    
    return true;
  }).sort((a, b) => {
    const nameA = language === 'ne' ? a.name_np : a.name_en;
    const nameB = language === 'ne' ? b.name_np : b.name_en;
    return nameA.localeCompare(nameB);
  });

  // Handle filter type change
  const handleFilterChange = (type: FilterType) => {
    setFilterType(type);
    setSearchQuery('');
    setSelectedTag('');
    if (type === 'tag') {
      setIsSearching(false);
    }
  };

  // Handle tag selection
  const handleTagSelect = (tagId: string) => {
    setSelectedTag(tagId === selectedTag ? '' : tagId);
    setSearchQuery(tagId === selectedTag ? '' : tagId);
  };

  // Handle category selection
  const handleCategorySelect = (categoryName: string) => {
    setSearchQuery(categoryName);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedTag('');
    setIsSearching(false);
    setFilterType('name');
  };

  // Navigate to services list
  const navigateToServices = (subCategory: SubCategory) => {
    router.push(`/services/${subCategory.category_id}/subcategories/${subCategory.id}`);
  };

  // Get localized name
  const getLocalizedName = (sub: SubCategory) => {
    return language === 'ne' ? sub.name_np : sub.name_en;
  };

  // Get localized category name
  const getLocalizedCategoryName = (sub: SubCategory) => {
    return language === 'ne' 
      ? sub.category?.name_np || ''
      : sub.category?.name_en || '';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* App Bar */}
      {/* <header className="sticky top-0 z-50 w-full border-b bg-primary text-primary-foreground"> */}
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
                  ? (screenTitle === 'Subcategories' ? 'उपश्रेणीहरू' : screenTitle)
                  : screenTitle}
              </h1>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Search Button */}
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-background hover:bg-primary-background/20"
              onClick={() => {
                setIsSearching(!isSearching);
                if (isSearching) {
                  setSearchQuery('');
                }
              }}
            >
              {isSearching ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </Button>

            {/* Filter Dropdown */}
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
                <DropdownMenuItem onClick={() => handleFilterChange('tag')}>
                  {language === 'ne' ? 'ट्याग द्वारा' : 'By Tag'}
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
        {/* Tags Section (only for tag filter) */}
        {filterType === 'tag' && (
          <div className="mb-6">
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">
              {language === 'ne' ? 'ट्यागहरू' : 'Tags'}
            </h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant={selectedTag === tag.id ? "default" : "outline"}
                  className="cursor-pointer px-3 py-1.5"
                  onClick={() => handleTagSelect(tag.id)}
                >
                  {language === 'ne' ? tag.labelNp : tag.labelEn}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Categories Section (only for category filter) */}
        {filterType === 'category' && (
          <div className="mb-6">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-background">
                {language === 'ne' ? 'श्रेणीहरू' : 'Categories'}
              </h3>
            </div>
            <div className="flex overflow-x-auto pb-2">
              {isLoadingCategories ? (
                <div className="flex gap-2">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-10 w-32 rounded-full" />
                  ))}
                </div>
              ) : (
                <div className="flex gap-2">
                  <Badge
                    variant={!searchQuery ? "default" : "outline"}
                    className="cursor-pointer px-4 py-2"
                    onClick={() => handleClearFilters()}
                  >
                    {language === 'ne' ? 'सबै' : 'All'}
                  </Badge>
                  {categories.map((category) => (
                    <Badge
                      key={category.id}
                      variant={
                        searchQuery === (language === 'ne' ? category.name_np.toLowerCase() : category.name_en.toLowerCase())
                          ? "default"
                          : "outline"
                      }
                      className="cursor-pointer whitespace-nowrap px-4 py-2"
                      onClick={() => handleCategorySelect(
                        language === 'ne' 
                          ? category.name_np.toLowerCase()
                          : category.name_en.toLowerCase()
                      )}
                    >
                      {language === 'ne' ? category.name_np : category.name_en}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Subcategories Grid Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {language === 'ne' ? 'उपश्रेणीहरू' : 'Subcategories'}
            <span className="ml-2 text-sm text-muted-foreground">
              ({filteredSubCategories.length})
            </span>
          </h2>
          
          {(searchQuery || selectedTag) && (
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

        {/* Subcategories Grid */}
        {filteredSubCategories.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed">
            <Search className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">
              {language === 'ne' 
                ? 'कुनै उपश्रेणी फेला परेन' 
                : 'No subcategories found'}
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
            {filteredSubCategories.map((sub) => (
              <Card
                key={sub.id}
                className="group cursor-pointer overflow-hidden transition-all hover:border-primary hover:shadow-md"
                onClick={() => navigateToServices(sub)}
              >
                {/* Image */}
                <div className="relative h-48 w-full overflow-hidden bg-muted">
                  {sub.image ? (
                    <Image
                      src={sub.image}
                      alt={getLocalizedName(sub)}
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
                  {/* Name */}
                  <h3 className="mb-1 line-clamp-2 font-semibold">
                    {getLocalizedName(sub)}
                  </h3>

                  {/* Category */}
                  <div className="mb-3">
                    <Badge variant="secondary" className="text-xs">
                      {getLocalizedCategoryName(sub)}
                    </Badge>
                  </div>

                  {/* Description */}
                  <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                    {language === 'ne' 
                      ? sub.description_np || 'विवरण उपलब्ध छैन'
                      : sub.description_en || 'No description available'}
                  </p>

                  {/* View Info Button */}
                  <div className="flex items-center justify-between">
                    <Button
                      variant="link"
                      className="h-auto p-0 text-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Open info modal/sheet
                      }}
                    >
                      {language === 'ne' ? 'जानकारी हेर्नुहोस्' : 'View Info'}
                    </Button>
                    
                    <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Active Filters Indicator */}
        {(searchQuery || selectedTag || filterType !== 'name') && (
          <div className="mt-8 rounded-lg border bg-card p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {language === 'ne' ? 'सक्रिय फिल्टरहरू:' : 'Active filters:'}
              </span>
              
              {filterType !== 'name' && (
                <Badge variant="secondary" className="gap-1">
                  {filterType === 'tag' 
                    ? (language === 'ne' ? 'ट्याग' : 'Tag')
                    : (language === 'ne' ? 'श्रेणी' : 'Category')}
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
              
              {searchQuery && filterType !== 'tag' && (
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
              
              {selectedTag && (
                <Badge variant="secondary" className="gap-1">
                  {tags.find(t => t.id === selectedTag)?.[language === 'ne' ? 'labelNp' : 'labelEn']}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-1 h-3 w-3 p-0 hover:bg-transparent"
                    onClick={() => {
                      setSelectedTag('');
                      setSearchQuery('');
                    }}
                  >
                    <X className="h-2 w-2" />
                  </Button>
                </Badge>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}