'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  X, 
  Filter, 
  ChevronRight,
  User,
  MapPin,
  DollarSign,
  Star,
  Tag,
  Award,
  Clock,
  CheckCircle
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import Link from 'next/link';

interface ServiceProfessionalsClientProps {
  professionalsData: any[];
  serviceName: string;
}

type FilterType = 'name' | 'tag' | 'address' | 'skills' | 'price';

const tagFilters = [
  { id: 'best_deal', labelEn: 'Best Deal', labelNp: 'उत्कृष्ट सम्झौता' },
  { id: 'bumper_offer', labelEn: 'Bumper Offer', labelNp: 'बम्पर अफर' },
  { id: 'dashain_offer', labelEn: 'Dashain Offer', labelNp: 'दशैं अफर' },
  { id: 'featured', labelEn: 'Featured', labelNp: 'विशेष' },
];

const priceRanges = [
  { label: '< Rs. 300', value: 300 },
  { label: 'Rs. 300 - Rs. 800', value: 800 },
  { label: '> Rs. 800', value: 801 },
];

export function ServiceProfessionalsClient({
  professionalsData,
  serviceName,
}: ServiceProfessionalsClientProps) {
  const { language } = useI18n();
  const router = useRouter();
  
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [filterType, setFilterType] = useState<FilterType>('name');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<any>(null);
  const [showBookingSheet, setShowBookingSheet] = useState(false);
  const [showProfessionalsDialog, setShowProfessionalsDialog] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    priceItem: null as any,
    quantity: 1,
    scheduledDate: new Date(),
    scheduledTime: new Date(),
    address: null as any,
    notes: '',
  });

  // Apply filters
  const filteredProfessionals = professionalsData.filter((professional) => {
    const query = searchQuery.toLowerCase();
    
    // Tag filter
    if (selectedTag && filterType === 'tag') {
      if (professional.tag !== selectedTag) return false;
    }
    
    // Price filter
    if (selectedPriceRange && filterType === 'price') {
      const hasMatchingPrice = professional.all_prices.some((price: any) => {
        const priceValue = price.price;
        if (selectedPriceRange === 300) return priceValue <= 300;
        if (selectedPriceRange === 800) return priceValue > 300 && priceValue <= 800;
        if (selectedPriceRange === 801) return priceValue > 800;
        return false;
      });
      if (!hasMatchingPrice) return false;
    }
    
    // Search filter
    if (query) {
      switch (filterType) {
        case 'name':
          return professional.full_name.toLowerCase().includes(query);
        case 'address':
          return professional.service_areas_display.toLowerCase().includes(query);
        case 'skills':
          return professional.all_skills.toLowerCase().includes(query);
        default:
          return true;
      }
    }
    
    return true;
  });

  // Get localized text
  const getLocalizedText = (en: string, np: string) => {
    return language === 'ne' ? np : en;
  };

  // Format price display
  const formatPrice = (priceItem: any) => {
    const hasDiscount = priceItem.discount_is_active && priceItem.discount_percentage > 0;
    const originalPrice = priceItem.price;
    const discountedPrice = hasDiscount
      ? Math.floor(originalPrice - (originalPrice * priceItem.discount_percentage / 100))
      : originalPrice;
    
    const unit = priceItem.price_unit?.name || '';
    const quality = priceItem.quality_type?.name || '';
    
    return {
      originalPrice,
      discountedPrice,
      hasDiscount,
      display: `Rs. ${discountedPrice}${hasDiscount ? ` (${priceItem.discount_percentage}% off)` : ''} / ${unit}, ${quality}`,
      unit,
      quality,
    };
  };

  // Handle booking
  const handleBookNow = (professional: any, priceItem: any) => {
    setSelectedProfessional(professional);
    setBookingDetails(prev => ({
      ...prev,
      priceItem,
    }));
    setShowBookingSheet(true);
  };

  // Render price chips
  const renderPriceChips = (prices: any[]) => {
    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {prices.map((priceItem, index) => {
          const priceInfo = formatPrice(priceItem);
          return (
            <Badge 
              key={index}
              variant="secondary"
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                handleBookNow(professionalsData[0], priceItem);
              }}
            >
              <DollarSign className="h-3 w-3 mr-1" />
              {priceInfo.display}
              {priceItem.is_minimum_price && (
                <Badge variant="outline" className="ml-1 text-xs">
                  {getLocalizedText('Starting at', 'सुरु हुन्छ')}
                </Badge>
              )}
            </Badge>
          );
        })}
      </div>
    );
  };

  // Render professional card
  const renderProfessionalCard = (professional: any) => {
    return (
      <Card 
        key={professional.id}
        className="group overflow-hidden transition-all hover:shadow-lg hover:border-primary"
      >
        <CardContent className="p-0">
          {/* Professional Header with Image */}
          <div className="relative h-48 w-full">
            {professional.profile_image_url ? (
              <Image
                src={professional.profile_image_url}
                alt={professional.full_name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <User className="h-16 w-16 text-muted-foreground/50" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            
            {/* Professional Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {professional.full_name}
                  </h3>
                  <p className="text-sm text-white/80">
                    {professional.service_name}
                  </p>
                </div>
                {professional.tag && (
                  <Badge variant="default" className="bg-primary">
                    <Tag className="h-3 w-3 mr-1" />
                    {professional.tag}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Card Content */}
          <div className="p-4">
            {/* Service Areas */}
 
            <div className="mb-3">
  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
    <MapPin className="h-4 w-4" />
    <span>{getLocalizedText('Service Areas', 'सेवा क्षेत्रहरू')}:</span>
  </div>
  <p className="text-sm line-clamp-2">
    {professional.service_areas_display || 
     (professional.service_areas_full?.length > 0 
      ? professional.service_areas_full.map((area: any) => area.name).join(', ')
      : getLocalizedText('No service areas listed', 'कुनै सेवा क्षेत्र सूचीबद्ध छैन')
    )}
  </p>
  {professional.service_areas_full?.length > 3 && (
    <Button
      variant="link"
      size="sm"
      className="h-auto p-0 text-primary"
      onClick={() => {
        setSelectedProfessional(professional);
        setShowProfessionalsDialog(true);
      }}
    >
      {getLocalizedText('View all', 'सबै हेर्नुहोस्')} ({professional.service_areas_full.length})
    </Button>
  )}
</div>

            {/* Skills */}
            <div className="mb-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Award className="h-4 w-4" />
                <span>{getLocalizedText('Skills', 'कौशलहरू')}:</span>
              </div>
              <p className="text-sm line-clamp-2">
                {professional.all_skills}
              </p>
            </div>

            {/* Prices */}
            <div className="mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <DollarSign className="h-4 w-4" />
                <span>{getLocalizedText('Prices', 'मूल्यहरू')}:</span>
              </div>
              {renderPriceChips(professional.all_prices)}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="flex-1"
                onClick={() => router.push(`/professional-detail/${professional.professional_id}`)}
              >
                {getLocalizedText('View Profile', 'प्रोफाइल हेर्नुहोस्')}
              </Button>
              <Button 
                size="sm"
                className="flex-1"
                onClick={() => {
                  if (professional.all_prices.length === 1) {
                    handleBookNow(professional, professional.all_prices[0]);
                  } else {
                    setSelectedProfessional(professional);
                    setShowBookingSheet(true);
                  }
                }}
              >
                {getLocalizedText('Book Now', 'बुक गर्नुहोस्')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
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
            
            {isSearching ? (
              <div className="flex-1">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={getLocalizedText(
                    `Search by ${filterType}...`,
                    `${filterType} द्वारा खोज्नुहोस्...`
                  )}
                  className="border-0 bg-transparent text-primary-background placeholder:text-primary-background/70 focus-visible:ring-0 focus-visible:ring-offset-0"
                  autoFocus
                />
              </div>
            ) : (
              <div>
                <h1 className="text-lg font-semibold">
                  {serviceName}
                </h1>
                <p className="text-xs text-primary-background/70">
                  {filteredProfessionals.length} {getLocalizedText('professionals', 'व्यावसायिकहरू')}
                </p>
              </div>
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
                <DropdownMenuItem onClick={() => setFilterType('name')}>
                  {getLocalizedText('By Name', 'नाम द्वारा')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType('address')}>
                  {getLocalizedText('By Address', 'ठेगाना द्वारा')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType('skills')}>
                  {getLocalizedText('By Skills', 'कौशल द्वारा')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType('tag')}>
                  {getLocalizedText('By Tag', 'ट्याग द्वारा')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType('price')}>
                  {getLocalizedText('By Price', 'मूल्य द्वारा')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Filter Sections */}
        {filterType === 'tag' && (
          <div className="mb-6">
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">
              {getLocalizedText('Tags', 'ट्यागहरू')}
            </h3>
            <div className="flex flex-wrap gap-2">
              {tagFilters.map((tag) => (
                <Badge
                  key={tag.id}
                  variant={selectedTag === tag.id ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedTag(selectedTag === tag.id ? null : tag.id)}
                >
                  {getLocalizedText(tag.labelEn, tag.labelNp)}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {filterType === 'price' && (
          <div className="mb-6">
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">
              {getLocalizedText('Price Range', 'मूल्य सीमा')}
            </h3>
            <div className="flex flex-wrap gap-2">
              {priceRanges.map((range) => (
                <Badge
                  key={range.value}
                  variant={selectedPriceRange === range.value ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedPriceRange(
                    selectedPriceRange === range.value ? null : range.value
                  )}
                >
                  {range.label}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {getLocalizedText('Available Professionals', 'उपलब्ध व्यावसायिकहरू')}
          </h2>
          <span className="text-sm text-muted-foreground">
            {filteredProfessionals.length} {getLocalizedText('found', 'फेला पर्यो')}
          </span>
        </div>

        {/* Professionals Grid */}
        {filteredProfessionals.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed">
            <Search className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">
              {getLocalizedText(
                'No professionals found',
                'कुनै व्यावसायिक फेला परेन'
              )}
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchQuery('');
                setSelectedTag(null);
                setSelectedPriceRange(null);
              }}
            >
              {getLocalizedText('Clear Filters', 'फिल्टर हटाउनुहोस्')}
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProfessionals.map(renderProfessionalCard)}
          </div>
        )}

        {/* Active Filters */}
        {(searchQuery || selectedTag || selectedPriceRange) && (
          <div className="mt-8 rounded-lg border bg-card p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {getLocalizedText('Active filters:', 'सक्रिय फिल्टरहरू:')}
              </span>
              
              {selectedTag && (
                <Badge variant="secondary" className="gap-1">
                  {getLocalizedText('Tag', 'ट्याग')}: {
                    tagFilters.find(t => t.id === selectedTag)?.[
                      language === 'ne' ? 'labelNp' : 'labelEn'
                    ]
                  }
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-1 h-3 w-3 p-0 hover:bg-transparent"
                    onClick={() => setSelectedTag(null)}
                  >
                    <X className="h-2 w-2" />
                  </Button>
                </Badge>
              )}
              
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

      {/* Booking Sheet */}
      <Sheet open={showBookingSheet} onOpenChange={setShowBookingSheet}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>
              {getLocalizedText('Book Service', 'सेवा बुक गर्नुहोस्')}
            </SheetTitle>
            <SheetDescription>
              {selectedProfessional && 
                `${getLocalizedText('Book with', 'संग बुक गर्नुहोस्')} ${selectedProfessional.full_name}`
              }
            </SheetDescription>
          </SheetHeader>
          
          <ScrollArea className="h-full pr-6">
            <div className="space-y-6 py-4">
              {/* Service Info */}
              {selectedProfessional && (
                <div className="space-y-2">
                  <h3 className="font-semibold">{selectedProfessional.service_name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>{selectedProfessional.full_name}</span>
                  </div>
                </div>
              )}

              {/* Price Selection */}
              <div className="space-y-2">
                <Label>{getLocalizedText('Select Price Option', 'मूल्य विकल्प छान्नुहोस्')}</Label>
                <Select 
                  value={bookingDetails.priceItem?.id}
                  onValueChange={(value) => {
                    const priceItem = selectedProfessional?.all_prices.find(
                      (p: any) => p.id === parseInt(value)
                    );
                    setBookingDetails(prev => ({ ...prev, priceItem }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={getLocalizedText('Select price', 'मूल्य छान्नुहोस्')} />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedProfessional?.all_prices.map((price: any) => {
                      const priceInfo = formatPrice(price);
                      return (
                        <SelectItem key={price.id} value={price.id.toString()}>
                          {priceInfo.display}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* Quantity */}
              <div className="space-y-2">
                <Label>{getLocalizedText('Quantity', 'परिमाण')}</Label>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setBookingDetails(prev => ({
                      ...prev,
                      quantity: Math.max(1, prev.quantity - 1)
                    }))}
                  >
                    -
                  </Button>
                  <span className="text-lg font-semibold">{bookingDetails.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setBookingDetails(prev => ({
                      ...prev,
                      quantity: prev.quantity + 1
                    }))}
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Total Price */}
              {bookingDetails.priceItem && (
                <div className="space-y-2">
                  <Label>{getLocalizedText('Total Price', 'कूल मूल्य')}</Label>
                  <div className="text-2xl font-bold text-primary">
                    Rs. {formatPrice(bookingDetails.priceItem).discountedPrice * bookingDetails.quantity}
                  </div>
                </div>
              )}

              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{getLocalizedText('Date', 'मिति')}</Label>
                  <Input
                    type="date"
                    value={bookingDetails.scheduledDate.toISOString().split('T')[0]}
                    onChange={(e) => setBookingDetails(prev => ({
                      ...prev,
                      scheduledDate: new Date(e.target.value)
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{getLocalizedText('Time', 'समय')}</Label>
                  <Input
                    type="time"
                    value={bookingDetails.scheduledTime.toTimeString().slice(0,5)}
                    onChange={(e) => {
                      const [hours, minutes] = e.target.value.split(':');
                      const newTime = new Date(bookingDetails.scheduledDate);
                      newTime.setHours(parseInt(hours), parseInt(minutes));
                      setBookingDetails(prev => ({
                        ...prev,
                        scheduledTime: newTime
                      }));
                    }}
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label>{getLocalizedText('Delivery Address', 'डेलिभरी ठेगाना')}</Label>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    // TODO: Implement address picker
                  }}
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  {bookingDetails.address 
                    ? bookingDetails.address.display
                    : getLocalizedText('Select address', 'ठेगाना छान्नुहोस्')
                  }
                </Button>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label>{getLocalizedText('Notes (Optional)', 'नोटहरू (वैकल्पिक)')}</Label>
                <Textarea
                  placeholder={getLocalizedText('Any special instructions...', 'कुनै विशेष निर्देशनहरू...')}
                  value={bookingDetails.notes}
                  onChange={(e) => setBookingDetails(prev => ({
                    ...prev,
                    notes: e.target.value
                  }))}
                />
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-4">
                <Button className="w-full" size="lg">
                  {getLocalizedText('Confirm Booking', 'बुकिङ पुष्टि गर्नुहोस्')}
                </Button>
                <Button variant="outline" className="w-full" onClick={() => setShowBookingSheet(false)}>
                  {getLocalizedText('Cancel', 'रद्द गर्नुहोस्')}
                </Button>
              </div>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Service Areas Dialog */}
      <Dialog open={showProfessionalsDialog} onOpenChange={setShowProfessionalsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {getLocalizedText('Service Areas', 'सेवा क्षेत्रहरू')}
            </DialogTitle>
            <DialogDescription>
              {selectedProfessional?.full_name}'s service areas
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-64">
            {selectedProfessional?.service_areas_full?.map((area: any, index: number) => (
              <div key={index} className="py-2 border-b last:border-0">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{area.name}</span>
                </div>
              </div>
            ))}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}