'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  fetchBrowseableServices,
  createProfessionalService,
  fetchPriceUnits,
  fetchQualityTypes,
  createPrice,
} from '@/lib/api/professional-services';
import { fetchCategories } from '@/lib/api/categories';
import { fetchSubCategories } from '@/lib/api/subcategories';
import { BrowseableService } from '@/lib/data/professional-services';
import { PriceUnit, QualityType } from '@/lib/data/professional-services';
import { Category } from '@/lib/data/categories';
import { SubCategory } from '@/lib/data/subcategories';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Search, 
  X, 
  Check, 
  ChevronsUpDown,
  Plus,
  ArrowLeft,
  Loader2,
  Image as ImageIcon
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function BrowseableServicesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  
  // const professionalId = Number(searchParams.get('professionalId'));
  const professionalId = 24;
  const [services, setServices] = useState<BrowseableService[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Category states - using real API data
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null);
  const [openCategory, setOpenCategory] = useState(false);
  const [openSubCategory, setOpenSubCategory] = useState(false);
  
  // Price modal states
  const [priceModalOpen, setPriceModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<BrowseableService | null>(null);
  const [priceUnits, setPriceUnits] = useState<PriceUnit[]>([]);
  const [qualityTypes, setQualityTypes] = useState<QualityType[]>([]);
  const [price, setPrice] = useState('');
  const [discountName, setDiscountName] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [selectedPriceUnitId, setSelectedPriceUnitId] = useState<number | null>(null);
  const [selectedQualityTypeId, setSelectedQualityTypeId] = useState<number | null>(null);
  const [discountIsActive, setDiscountIsActive] = useState(false);
  const [isMinimumPrice, setIsMinimumPrice] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (professionalId) {
      loadData();
    }
  }, [professionalId]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Fetch all data in parallel
      const [
        servicesData, 
        categoriesData, 
        subCategoriesData, 
        unitsData, 
        typesData
      ] = await Promise.all([
        fetchBrowseableServices(professionalId),
        fetchCategories(1, 1000),
        fetchSubCategories(1, 1000),
        fetchPriceUnits(),
        fetchQualityTypes()
      ]);
      
      // Extract categories and subcategories from responses
      setServices(servicesData);
      setCategories(categoriesData.categories || []);
      setSubCategories(subCategoriesData.sub_categories || []);
      setPriceUnits(unitsData);
      setQualityTypes(typesData);
      
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getSubCategoriesForCategory = () => {
    if (!selectedCategory) return [];
    return subCategories.filter(sub => sub.category_id === selectedCategory.id);
  };

  const getCategoryById = (id: number) => {
    return categories.find(c => c.id === id);
  };

  const getSubCategoryById = (id: number) => {
    return subCategories.find(s => s.id === id);
  };

  // Helper function to truncate long text
  const truncateText = (text: string, maxLength: number = 20) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const handleSelectService = (service: BrowseableService) => {
    setSelectedService(service);
    resetPriceForm();
    setPriceModalOpen(true);
  };

  const resetPriceForm = () => {
    setPrice('');
    setDiscountName('');
    setDiscountPercentage('');
    setSelectedPriceUnitId(null);
    setSelectedQualityTypeId(null);
    setDiscountIsActive(false);
    setIsMinimumPrice(false);
  };

  const handleSaveServiceWithPrice = async () => {
    if (!selectedService || !selectedPriceUnitId || !selectedQualityTypeId || !price) {
      toast({
        title: 'Validation Error',
        description: 'Please fill all required fields',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      // First, create the professional service
      const serviceResponse = await createProfessionalService({
        professional_id: professionalId,
        service_id: selectedService.id,
      });

      if (!serviceResponse) {
        throw new Error('Failed to create service');
      }

      // Then, create the price
      await createPrice({
        professional_service_id: serviceResponse.id,
        price_unit_id: selectedPriceUnitId,
        quality_type_id: selectedQualityTypeId,
        price: Number(price),
        discount_percentage: Number(discountPercentage) || 0,
        discount_name: discountName,
        discount_is_active: discountIsActive,
        is_minimum_price: isMinimumPrice,
      });

      toast({
        title: 'Success',
        description: 'Service added successfully',
      });

      setPriceModalOpen(false);
      resetPriceForm();
      loadData(); // Refresh the list
      // Navigate back to choose page after a delay
      setTimeout(() => {
        router.push(`/dashboard/services/choose?professionalId=${professionalId}`);
      }, 1500);
    } catch (error) {
      console.error('Error saving service:', error);
      toast({
        title: 'Error',
        description: 'Failed to add service',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Filter services based on search, category, and subcategory
  const filteredServices = services.filter(service => {
    const matchesSearch = searchQuery === '' || 
      service.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (service.name_np && service.name_np.includes(searchQuery));
    
    const matchesCategory = !selectedCategory || service.category_id === selectedCategory.id;
    
    const matchesSubCategory = !selectedSubCategory || service.sub_category_id === selectedSubCategory.id;
    
    return matchesSearch && matchesCategory && matchesSubCategory;
  });

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedSubCategory(null);
    setSearchQuery('');
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push(`/dashboard/services/choose?professionalId=${professionalId}`)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Browse Services</h1>
            <p className="text-muted-foreground">
              Add new services to your offerings
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search services..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                    onClick={() => setSearchQuery('')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <Popover open={openCategory} onOpenChange={setOpenCategory}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openCategory}
                    className="w-[200px] justify-between min-w-[150px]"
                  >
                    <span className="truncate">
                      {selectedCategory ? truncateText(selectedCategory.name_en, 25) : "Select category..."}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command>
                    <CommandInput placeholder="Search category..." />
                    <CommandList>
                      <CommandEmpty>No category found.</CommandEmpty>
                      <CommandGroup>
                        {categories.map((category) => (
                          <CommandItem
                            key={category.id}
                            value={category.name_en}
                            onSelect={() => {
                              setSelectedCategory(
                                category.id === selectedCategory?.id ? null : category
                              );
                              setSelectedSubCategory(null);
                              setOpenCategory(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4 shrink-0",
                                selectedCategory?.id === category.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <span className="truncate" title={category.name_en}>
                              {category.name_en}
                            </span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              <Popover open={openSubCategory} onOpenChange={setOpenSubCategory}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openSubCategory}
                    className="w-[200px] justify-between min-w-[150px]"
                    disabled={!selectedCategory}
                  >
                    <span className="truncate">
                      {selectedSubCategory ? truncateText(selectedSubCategory.name_en, 25) : "Select sub-category..."}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command>
                    <CommandInput placeholder="Search sub-category..." />
                    <CommandList>
                      <CommandEmpty>No sub-category found.</CommandEmpty>
                      <CommandGroup>
                        {getSubCategoriesForCategory().map((subCategory) => (
                          <CommandItem
                            key={subCategory.id}
                            value={subCategory.name_en}
                            onSelect={() => {
                              setSelectedSubCategory(
                                subCategory.id === selectedSubCategory?.id ? null : subCategory
                              );
                              setOpenSubCategory(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4 shrink-0",
                                selectedSubCategory?.id === subCategory.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <span className="truncate" title={subCategory.name_en}>
                              {subCategory.name_en}
                            </span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {(selectedCategory || selectedSubCategory || searchQuery) && (
                <Button variant="ghost" onClick={clearFilters} className="shrink-0">
                  <X className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Active filters display */}
          {(selectedCategory || selectedSubCategory) && (
            <div className="flex flex-wrap gap-2 mt-4">
              {selectedCategory && (
                <Badge variant="secondary" className="gap-1 max-w-full">
                  <span className="truncate" title={selectedCategory.name_en}>
                    Category: {selectedCategory.name_en}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-1 shrink-0"
                    onClick={() => {
                      setSelectedCategory(null);
                      setSelectedSubCategory(null);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              {selectedSubCategory && (
                <Badge variant="secondary" className="gap-1 max-w-full">
                  <span className="truncate" title={selectedSubCategory.name_en}>
                    Sub-category: {selectedSubCategory.name_en}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-1 shrink-0"
                    onClick={() => setSelectedSubCategory(null)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                <Search className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No services found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery || selectedCategory || selectedSubCategory
                  ? 'Try changing your search or filters'
                  : 'No more services available to add'}
              </p>
              {(searchQuery || selectedCategory || selectedSubCategory) && (
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => {
            const category = getCategoryById(service.category_id);
            const subCategory = getSubCategoryById(service.sub_category_id);
            
            return (
              <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48 bg-muted">
                  {service.image ? (
                    <Image
                      src={service.image}
                      alt={service.name_en}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-1" title={service.name_en}>
                    {service.name_en}
                  </CardTitle>
                  <CardDescription className="line-clamp-2" title={service.description_en}>
                    {service.description_en}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {category && (
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="max-w-full">
                          <span className="truncate" title={category.name_en}>
                            {category.name_en}
                          </span>
                        </Badge>
                      </div>
                    )}
                    {subCategory && (
                      <div className="text-sm text-muted-foreground truncate" title={subCategory.name_en}>
                        {subCategory.name_en}
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={() => handleSelectService(service)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Service
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Price Setting Modal */}
      <Dialog open={priceModalOpen} onOpenChange={setPriceModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="truncate" title={`Set Price for ${selectedService?.name_en}`}>
              Set Price for {selectedService?.name_en}
            </DialogTitle>
            <DialogDescription className="truncate" title={selectedService?.name_en}>
              {selectedService?.name_en}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter price"
                min="0"
                step="0.01"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="minimum-price">Minimum Price</Label>
              <Switch
                id="minimum-price"
                checked={isMinimumPrice}
                onCheckedChange={setIsMinimumPrice}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="price-unit">Price Unit *</Label>
              <Select
                value={selectedPriceUnitId?.toString()}
                onValueChange={(value) => setSelectedPriceUnitId(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select price unit" />
                </SelectTrigger>
                <SelectContent>
                  {priceUnits.map((unit) => (
                    <SelectItem key={unit.id} value={unit.id.toString()}>
                      <span className="truncate" title={unit.name}>
                        {unit.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="quality-type">Quality Type *</Label>
              <Select
                value={selectedQualityTypeId?.toString()}
                onValueChange={(value) => setSelectedQualityTypeId(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select quality type" />
                </SelectTrigger>
                <SelectContent>
                  {qualityTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      <span className="truncate" title={type.name}>
                        {type.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="discount-name">Discount Name</Label>
              <Input
                id="discount-name"
                value={discountName}
                onChange={(e) => setDiscountName(e.target.value)}
                placeholder="e.g., Summer Sale"
                maxLength={50}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="discount-percentage">Discount Percentage</Label>
              <Input
                id="discount-percentage"
                type="number"
                value={discountPercentage}
                onChange={(e) => setDiscountPercentage(e.target.value)}
                placeholder="0"
                min="0"
                max="100"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="discount-active">Activate Discount</Label>
              <Switch
                id="discount-active"
                checked={discountIsActive}
                onCheckedChange={setDiscountIsActive}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPriceModalOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveServiceWithPrice} disabled={submitting}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save & Add Service
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}