// components/professional-services-client.tsx (with parent-managed booking state)
'use client';

import { useState, useMemo, useEffect } from 'react';
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
  Star,
  Calendar,
  Banknote,
  Heart,
  User
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
import { FilterSheet, FilterSection } from '@/components/ui/filter-sheet'; 
import { BookingDetails, BookingSheet } from '@/components/booking/booking-sheet';
import { useConfirmationDialog } from '@/hooks/use-confirmation-dialog';
import { toast } from "sonner";
import { CreateOrderDTO } from '@/lib/data/order';
import { NepaliDateService } from '@/lib/utils/nepaliDate';
import { useAuth } from '@/lib/context/auth-context';
import { useOrderStore } from '@/stores/order-store';
import { useAddressStore, useTemporaryAddress, useAddresses } from '@/stores/address-store';
import { Address } from '@/lib/data/address';
import { AddressData } from '@/components/booking/booking-sheet';
import { cn } from '@/lib/utils';
import { useGuestStore } from '@/stores/guest-store';
import { addFavorite } from '@/lib/api/favorites';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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
  const { createOrder } = useOrderStore(); 
    const { confirm, ConfirmationDialog } = useConfirmationDialog();
     const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [filterType, setFilterType] = useState<FilterType>('name');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [showFilters, setShowFilters] = useState(false);
  
  // Booking state
  const [selectedProfessional, setSelectedProfessional] = useState<any>(null);
  const [isBookingSheetOpen, setIsBookingSheetOpen] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [showBookingSheet, setShowBookingSheet] = useState(false);
  const [showProfessionalsDialog, setShowProfessionalsDialog] = useState(false);
  const { user } = useAuth();


    // Address store
  const addresses = useAddresses();
  const temporaryAddress = useTemporaryAddress();
  const fetchAddresses = useAddressStore((state) => state.fetchAddresses);
  const createAddress = useAddressStore((state) => state.createAddress);
  const updateAddress = useAddressStore((state) => state.updateAddress);
  const isLoadingAddresses = useAddressStore((state) => state.isLoading);
  

  

  // Filter and convert addresses to AddressData type (only fields that exist)
  const temporaryAddresses = useMemo((): AddressData[] => {
    return addresses
      .filter((addr): addr is Address & { type: 'temporary' } => addr.type === 'temporary')
      .map((addr) => ({
        id: addr.id,
        type: 'temporary',
        province: addr.province,
        district: addr.district,
        municipality: addr.municipality,
        ward_no: addr.ward_no,
        street_address: addr.street_address,
    
        
      }));
  }, [addresses]);


   // Fetch addresses when user is logged in
  useEffect(() => {
    if (user) {
      fetchAddresses();
    }
  }, [user, fetchAddresses]);

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

  // Format price for booking sheet
  const formatPriceForBooking = (priceItem: any) => {
    const hasDiscount = priceItem.discount_is_active && priceItem.discount_percentage > 0;
    const discountedPrice = hasDiscount
      ? Math.round(priceItem.price * (1 - priceItem.discount_percentage / 100))
      : priceItem.price;

    return {
      originalPrice: priceItem.price,
      discountedPrice,
      hasDiscount,
      display: hasDiscount
        ? `Rs. ${discountedPrice} (${priceItem.discount_percentage}% off)`
        : `Rs. ${priceItem.price}`,
      display_ne: hasDiscount
        ? `रु. ${discountedPrice} (${priceItem.discount_percentage}% छुट)`
        : `रु. ${priceItem.price}`,
      unit: priceItem.price_unit?.name || 'Unit',
      unit_ne: priceItem.price_unit?.name_ne || 'एकाइ',
      quality: priceItem.quality_type?.name || 'Standard',
      quality_ne: priceItem.quality_type?.name_ne || 'सामान्य',
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
    user_id : service.professional_user_id,
  });

  // Handle book now click
  // const handleBookNow = (professional: any) => {
  //   setSelectedProfessional(professional);
  //   setIsBookingSheetOpen(true);
  // };


  const handleBookNow = (professional: any) => {
  
  if (!user) {
    toast.error(
      getLocalizedText('Authentication Required', 'प्रमाणीकरण आवश्यक छ'),
      {
        description: getLocalizedText('Please log in to book a service', 'सेवा बुक गर्न कृपया लग इन गर्नुहोस्'),
      }
    );
    router.push('/login?redirect=' + encodeURIComponent(window.location.pathname));
    return;
  }

  // Check if booking own profile
  if (professional.user_id === user.id) {
    toast.error(
      getLocalizedText('Cannot Book', 'बुक गर्न सकिँदैन'),
      {
        description: getLocalizedText('You cannot book your own service', 'तपाईं आफ्नै सेवा बुक गर्न सक्नुहुन्न'),
      }
    );
    return;
  }

  setSelectedProfessional(professional);
setIsBookingSheetOpen(true);
};




  // Handle address operations using the store
  const handleAddAddress = async (addressData: any) => {
    try {
      const newAddress = await createAddress({
        type: 'temporary',
        province: addressData.province,
        district: addressData.district,
        municipality: addressData.municipality,
        ward_no: addressData.ward_no,
        street_address: addressData.street_address,
      });
      
      toast.success(
        getLocalizedText('Address Added', 'ठेगाना थपियो'),
        {
          description: getLocalizedText(
            'Address has been added successfully',
            'ठेगाना सफलतापूर्वक थपियो'
          ),
        }
      );
      
      return newAddress;
    } catch (error: any) {
      toast.error(
        getLocalizedText('Failed to Add Address', 'ठेगाना थप्न असफल'),
        {
          description: error.message,
        }
      );
      throw error;
    }
  };

  const handleUpdateAddress = async (addressId: number, addressData: any) => {
    try {
      const updatedAddress = await updateAddress(addressId, {
        type: 'temporary',
        province: addressData.province,
        district: addressData.district,
        municipality: addressData.municipality,
        ward_no: addressData.ward_no,
        street_address: addressData.street_address,
      });
      
      toast.success(
        getLocalizedText('Address Updated', 'ठेगाना अद्यावधिक गरियो'),
        {
          description: getLocalizedText(
            'Address has been updated successfully',
            'ठेगाना सफलतापूर्वक अद्यावधिक गरियो'
          ),
        }
      );
      
      return updatedAddress;
    } catch (error: any) {
      toast.error(
        getLocalizedText('Failed to Update Address', 'ठेगाना अद्यावधिक गर्न असफल'),
        {
          description: error.message,
        }
      );
      throw error;
    }
  };



  const handleConfirmBooking= async (bookingDetails: BookingDetails) => {
  try {
    if (!user) {
       toast.error(
        getLocalizedText('Authentication Required', 'प्रमाणीकरण आवश्यक छ'),
        {
          description: getLocalizedText('Please log in to book a service', 'सेवा बुक गर्न कृपया लग इन गर्नुहोस्'),
        }
      );
      router.push('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }


    if (!bookingDetails.priceItem) {
      throw new Error('No price item selected');
    }
    if (!bookingDetails.address) {
      throw new Error('No delivery address selected');
    }
    if (!selectedProfessional) {
      throw new Error('No professional selected');
    }

    const selectedPriceInfo = formatPriceForBooking(bookingDetails.priceItem);
    const totalPrice = selectedPriceInfo.discountedPrice * bookingDetails.quantity;

    const bsDateString = bookingDetails.scheduledDate;
    const timeString = bookingDetails.scheduledTime; 
    const [hours, minutes] = timeString.split(':').map(Number);
    const adDate = NepaliDateService.convertBSToAD(bsDateString);
    if (!adDate) {
      throw new Error('Invalid BS date');
    }
    const year = adDate.getFullYear();
    const month = String(adDate.getMonth() + 1).padStart(2, '0');
    const day = String(adDate.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`; 
    const hourStr = String(hours).padStart(2, '0');
    const minuteStr = String(minutes).padStart(2, '0');
    const timeStringFormatted = `${hourStr}:${minuteStr}:00`;
    const dateTimeString = `${dateString} ${timeStringFormatted}`; // "2024-02-24 21:06:00"

    const localISOString = `${dateString}T${timeStringFormatted}`;
 
    const orderData: CreateOrderDTO = {
      professional_service_id: selectedProfessional.id,
      customer_id: user.id, 
  scheduled_date: localISOString,
      scheduled_time: localISOString,
      order_notes: bookingDetails.notes || '',
      price_unit_id: bookingDetails.priceItem.price_unit_id || 1, 
      quality_type_id: bookingDetails.priceItem.quality_type_id || 1, 
      quantity: bookingDetails.quantity,
      total_price: totalPrice,
      address: {
        type: 'temporary',
        province: bookingDetails.address.province,
        district: bookingDetails.address.district,
        municipality: bookingDetails.address.municipality,
        ward_no: bookingDetails.address.ward_no,
        street_address: bookingDetails.address.street_address,
      },
  
    };



    const createdOrder = await createOrder(orderData);

    console.log('Order created successfully:', createdOrder);

setIsBookingSheetOpen(false);

      toast.success(
  getLocalizedText('Booking Successful!', 'बुकिङ सफल भयो!'),
  {
    description: getLocalizedText(
      'Your booking has been confirmed. You will receive a notification soon.',
      'तपाईंको बुकिङ पुष्टि भएको छ। तपाईंलाई चाँडै सूचना प्राप्त हुनेछ।'
    ),
  }
);
 
      const shouldProceedToPayment = await confirm({
        title: getLocalizedText(
          'Proceed to Payment?',
          'भुक्तानीमा जाने?'
        ),
        description: getLocalizedText(
          `Your booking has been created successfully!\n\nTotal amount: Rs. ${totalPrice.toLocaleString()}\n\nWould you like to proceed to payment now?`,
          `तपाईंको बुकिङ सफलतापूर्वक सिर्जना गरिएको छ!\n\nजम्मा रकम: रु. ${totalPrice.toLocaleString()}\n\nके तपाईं अहिले भुक्तानीमा जान चाहनुहुन्छ?`
        ),
        confirmText: getLocalizedText('Pay Now', 'अहिले भुक्तानी गर्नुहोस्'),
        cancelText: getLocalizedText('Pay Later', 'पछि भुक्तानी गर्नुहोस्'),
      });
      
      if (shouldProceedToPayment) {
        router.push(`/orders/${createdOrder.id}/payment`);
      }
  console.log('Toast shown'); // Add this
    } catch (error: any) {
      console.error('Error creating order:', error);
      
     // For error toasts:
toast.error(
  getLocalizedText('Booking Failed', 'बुकिङ असफल भयो'),
  {
    description: error.message || getLocalizedText(
      'Failed to create booking. Please try again.',
      'बुकिङ सिर्जना गर्न असफल भयो। कृपया पुनः प्रयास गर्नुहोस्।'
    ),
  }
);
    }
  };

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
        labelNp: range.label,
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


const handleProfessionalFavorite = async (proId: number) => {
  const { isGuest } = useGuestStore.getState();
  
  if (isGuest) {
      toast.warning(
      language === 'ne'
        ? 'कृपया लाग-इन गर्नुहोस्'
        : 'Please log in to favorite'
    );
    return;
  }

  setIsFavoriteLoading(true);
  try {
    await addFavorite({
      professional_id: proId, 
    });
    
    toast.success(
     language === 'ne' 
        ? 'प्रोफेशनल मनपर्नेमा थपियो' 
        : 'Professional added to favorites'
    );
  } catch (error) {
     toast.info(
    language === 'ne' 
        ? 'यो प्रोफेशनल पहिले नै मनपर्नेमा थपिएको छ'
        : 'This professional has already been added'
    );
  
  } finally {
    setIsFavoriteLoading(false);
  }
};


const handleServiceFavorite = async (serId: number) => {
  const { isGuest } = useGuestStore.getState();
  
  if (isGuest) {
    toast.warning(
      language === 'ne'
        ? 'कृपया लाग-इन गर्नुहोस्'
        : 'Please log in to favorite'
    );
    return;
  }

  setIsFavoriteLoading(true);
  try {
    await addFavorite({
      professional_service_id: serId, 
    });
    
    toast.success(
      language === 'ne' 
        ? 'सेवा मनपर्नेमा थपियो' 
        : 'Service added to favorites'
    );
  } catch (error) {
     toast.info(
    language === 'ne' 
      ? 'यो सेवा पहिले नै मनपर्नेमा थपिएको छ'
      : 'This service has already been added'
  );
  } finally {
    setIsFavoriteLoading(false);
  }
};

  return (
    <>
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

              {/* FilterSheet */}
              <FilterSheet
                trigger={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-primary-foreground hover:bg-primary-foreground/20 relative"
                  >
                    <SlidersHorizontal className="h-5 w-5" />
                    {hasActiveFilters && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground flex items-center justify-center">
                        {(selectedTags.length + (selectedPriceRange ? 1 : 0))}
                      </span>
                    )}
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
                    className="group h-full overflow-hidden transition-all hover:border-primary hover:shadow-lg"
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

  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
               <TooltipProvider>
  <div className="absolute top-3 right-3 z-10 flex gap-2">

    {/* Favorite Professional */}
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-9 w-9 rounded-full backdrop-blur-md shadow-md transition-all duration-300",
            "bg-white/80 dark:bg-black/60",
            "hover:scale-110 hover:shadow-lg",
            service.is_professional_favorited
              ? "text-green-500"
              : "text-muted-foreground hover:text-green-500"
          )}
          onClick={(e) => {
            e.stopPropagation();
            handleProfessionalFavorite(service.professional_id);
          }}
        >
          <User
            className={cn(
              "h-4 w-4 transition-all duration-300",
              service.is_professional_favorited && "scale-110"
            )}
          />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {service.is_professional_favorited
          ? "Remove Professional from Favorites"
          : "Add Professional to Favorites"}
      </TooltipContent>
    </Tooltip>

    {/* Favorite Service */}
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-9 w-9 rounded-full backdrop-blur-md shadow-md transition-all duration-300",
            "bg-white/80 dark:bg-black/60",
            "hover:scale-110 hover:shadow-lg",
            service.is_service_favorited
              ? "text-red-500"
              : "text-muted-foreground hover:text-red-500"
          )}
          onClick={(e) => {
            e.stopPropagation();
            handleServiceFavorite(service.id);
          }}
        >
          <Heart
            className={cn(
              "h-4 w-4 transition-all duration-300",
              service.is_service_favorited && "fill-current scale-110"
            )}
          />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {service.is_service_favorited
          ? "Remove Service from Favorites"
          : "Add Service to Favorites"}
      </TooltipContent>
    </Tooltip>

  </div>
</TooltipProvider>
                        
                        
               
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
                              <Banknote className="h-4 w-4" />
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
                          <Button
                            onClick={() => handleBookNow(professional)}
                            className="w-full"
                            size="default"
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {getLocalizedText('Book Now', 'अहिले बुक गर्नुहोस्')}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </main>
      </div>

        {/* Booking Sheet - Pass the temporary addresses */}
      {selectedProfessional && (
        <BookingSheet
          open={isBookingSheetOpen}
          onOpenChange={setIsBookingSheetOpen}
          professional={selectedProfessional}
          onConfirm={handleConfirmBooking}
          formatPrice={formatPriceForBooking}
          savedAddresses={temporaryAddresses}
          onAddAddress={handleAddAddress}
          onUpdateAddress={handleUpdateAddress}
          isLoadingAddresses={isLoadingAddresses}
        />
      )}

      {/* Confirmation dialog */}
      <ConfirmationDialog />
    </>
  );
}