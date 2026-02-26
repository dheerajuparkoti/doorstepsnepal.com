
'use client';

import { useState, useEffect, useMemo } from 'react';
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
  CheckCircle,
  SlidersHorizontal,
  Heart
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
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';
import Link from 'next/link';
import { obfuscateId } from '@/lib/utils/id-obfuscator';
import { createProfessionalSlug } from '@/lib/utils/slug';
import { FilterSheet, FilterSection } from '@/components/ui/filter-sheet';
import { BookingSheet, BookingDetails, AddressData } from '@/components/booking/booking-sheet';
import { useOrderStore } from '@/stores/order-store';
import { toast } from "sonner";
import { CreateOrderDTO } from '@/lib/data/order';
import { useAuth } from '@/lib/context/auth-context';
import { NepaliDateService } from '@/lib/utils/nepaliDate';
import { useConfirmationDialog } from '@/hooks/use-confirmation-dialog';
import { useAddresses, useAddressStore, useTemporaryAddress } from '@/stores/address-store';
import { Address } from '@/lib/data/address';
import { notificationApi } from '@/lib/api/notification'; //for notification
import { addFavorite } from '@/lib/api/favorites';
import { useGuestStore } from '@/stores/guest-store';
import { cn } from '@/lib/utils';
import { id } from 'date-fns/locale';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
interface ServiceProfessionalsClientProps {
  professionalsData: any[];
  serviceName: string;
}

type FilterType = 'name' | 'tag' | 'address' | 'skills' | 'price';

interface FilterState {
  searchQuery: string;
  filterType: FilterType;
  selectedTag: string | null;
  selectedPriceRange: number | null;
  minPrice: number | null;
  maxPrice: number | null;
  selectedSkills: string[];
  selectedAreas: string[];
  rating: number | null;
}

const tagFilters = [
  { id: 'best_deal', labelEn: 'Best Deal', labelNp: 'उत्कृष्ट सम्झौता' },
  { id: 'bumper_offer', labelEn: 'Bumper Offer', labelNp: 'बम्पर अफर' },
  { id: 'dashain_offer', labelEn: 'Dashain Offer', labelNp: 'दशैं अफर' },
  { id: 'featured', labelEn: 'Featured', labelNp: 'विशेष' },
];

const priceRanges = [
  { label: '< Rs. 300', value: 300, min: 0, max: 300 },
  { label: 'Rs. 300 - Rs. 800', value: 800, min: 301, max: 800 },
  { label: '> Rs. 800', value: 801, min: 801, max: Infinity },
];

export function ServiceProfessionalsClient({
  professionalsData,
  serviceName,
}: ServiceProfessionalsClientProps) {
  const { language } = useI18n();
  const router = useRouter();

  const { createOrder } = useOrderStore(); 
    const { confirm, ConfirmationDialog } = useConfirmationDialog();
      const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  
  // State management
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    filterType: 'name',
    selectedTag: null,
    selectedPriceRange: null,
    minPrice: null,
    maxPrice: null,
    selectedSkills: [],
    selectedAreas: [],
    rating: null,
  });
  
  const [isSearching, setIsSearching] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState<any>(null);
  const [showBookingSheet, setShowBookingSheet] = useState(false);
  const [showProfessionalsDialog, setShowProfessionalsDialog] = useState(false);
  const { user } = useAuth();
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);

      // Address store
    const addresses = useAddresses();
    const temporaryAddress = useTemporaryAddress();
    const fetchAddresses = useAddressStore((state) => state.fetchAddresses);
    const createAddress = useAddressStore((state) => state.createAddress);
    const updateAddress = useAddressStore((state) => state.updateAddress);
    const isLoadingAddresses = useAddressStore((state) => state.isLoading);



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
  // Get unique skills from all professionals
  const allSkills = [...new Set(
    professionalsData.flatMap(p => 
      p.all_skills?.split(',').map((s: string) => s.trim()) || []
    )
  )].map(skill => ({
    id: skill.toLowerCase().replace(/\s+/g, '_'),
    labelEn: skill,
    labelNp: skill, // You might want to add Nepali translations
  }));

  // Get unique service areas
  const allAreas = [...new Set(
    professionalsData.flatMap(p => 
      p.service_areas_full?.map((area: any) => area.name) || []
    )
  )].map(area => ({
    id: area.toLowerCase().replace(/\s+/g, '_'),
    labelEn: area,
    labelNp: area, // You might want to add Nepali translations
    icon: <MapPin className="h-3 w-3" />,
  }));

  // Define filter sections for FilterSheet
  const filterSections: FilterSection[] = [
    {
      id: 'filterType',
      titleEn: 'Search By',
      titleNp: 'खोजी आधार',
      type: 'single',
      options: [
        { id: 'name', labelEn: 'Name', labelNp: 'नाम', icon: <User className="h-3 w-3" /> },
        { id: 'address', labelEn: 'Address', labelNp: 'ठेगाना', icon: <MapPin className="h-3 w-3" /> },
        { id: 'skills', labelEn: 'Skills', labelNp: 'कौशल', icon: <Award className="h-3 w-3" /> },
        { id: 'tag', labelEn: 'Tag', labelNp: 'ट्याग', icon: <Tag className="h-3 w-3" /> },
        { id: 'price', labelEn: 'Price', labelNp: 'मूल्य', icon: <DollarSign className="h-3 w-3" /> },
      ],
    },
    {
      id: 'selectedTag',
      titleEn: 'Tags',
      titleNp: 'ट्यागहरू',
      type: 'single',
      options: tagFilters.map(tag => ({
        id: tag.id,
        labelEn: tag.labelEn,
        labelNp: tag.labelNp,
        icon: <Tag className="h-3 w-3" />,
      })),
    },
    {
      id: 'selectedPriceRange',
      titleEn: 'Price Range',
      titleNp: 'मूल्य सीमा',
      type: 'single',
      options: priceRanges.map(range => ({
        id: range.value.toString(),
        labelEn: range.label,
        labelNp: range.label,
        icon: <DollarSign className="h-3 w-3" />,
        value: range.value,
      })),
    },
    {
      id: 'selectedSkills',
      titleEn: 'Skills',
      titleNp: 'कौशलहरू',
      type: 'multiple',
      options: allSkills,
    },
    {
      id: 'selectedAreas',
      titleEn: 'Service Areas',
      titleNp: 'सेवा क्षेत्रहरू',
      type: 'multiple',
      options: allAreas,
    },
    {
      id: 'rating',
      titleEn: 'Minimum Rating',
      titleNp: 'न्यूनतम रेटिंग',
      type: 'single',
      options: [
        { id: '4', labelEn: '4+ Stars', labelNp: '४+ तारा', icon: <Star className="h-3 w-3" /> },
        { id: '3', labelEn: '3+ Stars', labelNp: '३+ तारा', icon: <Star className="h-3 w-3" /> },
        { id: '2', labelEn: '2+ Stars', labelNp: '२+ तारा', icon: <Star className="h-3 w-3" /> },
      ],
    },
  ];

  // Apply filters
  const filteredProfessionals = professionalsData.filter((professional) => {
    const query = filters.searchQuery.toLowerCase();
    
    // Tag filter
    if (filters.selectedTag) {
      if (professional.tag !== filters.selectedTag) return false;
    }
    
    // Price range filter
    if (filters.selectedPriceRange) {
      const range = priceRanges.find(r => r.value === filters.selectedPriceRange);
      if (range) {
        const hasMatchingPrice = professional.all_prices.some((price: any) => {
          const priceValue = price.price;
          return priceValue >= range.min && priceValue <= range.max;
        });
        if (!hasMatchingPrice) return false;
      }
    }
    
  // Skills filter 
  if (filters.selectedSkills && filters.selectedSkills.length > 0) {
    const professionalSkills = professional.all_skills?.toLowerCase() || '';
    const hasMatchingSkill = filters.selectedSkills.some(skill => 
      professionalSkills.includes(skill.replace(/_/g, ' '))
    );
    if (!hasMatchingSkill) return false;
  }
  
  // Service areas filter 
  if (filters.selectedAreas && filters.selectedAreas.length > 0) {
    const professionalAreas = professional.service_areas_full?.map((a: any) => 
      a.name.toLowerCase()
    ) || [];
    const hasMatchingArea = filters.selectedAreas.some(area => 
      professionalAreas.includes(area.replace(/_/g, ' '))
    );
    if (!hasMatchingArea) return false;
  }
  
    // Rating filter
    // if (filters.rating) {
    //   const rating = parseFloat(filters.rating);
    //   if ((professional.average_rating || 0) < rating) return false;
    // }
    
    // Search filter
    if (query) {
      switch (filters.filterType) {
        case 'name':
          return professional.full_name.toLowerCase().includes(query);
        case 'address':
          return professional.service_areas_display.toLowerCase().includes(query);
        case 'skills':
          return professional.all_skills?.toLowerCase().includes(query);
        case 'tag':
          return professional.tag?.toLowerCase().includes(query);
        case 'price':
          return professional.all_prices.some((price: any) => 
            price.price.toString().includes(query)
          );
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
  // const handleBookNow = (professional: any, priceItem: any) => {
  //   setSelectedProfessional(professional);
  //   setShowBookingSheet(true);
  // };
  // Handle address operations


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


const handleBookNow = (professional: any, priceItem: any) => {
  
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
  setShowBookingSheet(true);
};

  // Handle booking confirmation
  // const handleBookingConfirm = (bookingDetails: BookingDetails) => {
  //   console.log('Booking confirmed:', bookingDetails);
  //   // TODO: Implement actual booking submission
  //   alert('Booking confirmed! (Demo)');
  // };
const createOrderNotifications = async (
  professionalUserId: number,
  customerUserId: number,
  orderId: number,
  totalPrice: number
) => {
  try {
    // Professional notification
    await notificationApi.createNotification({
      user_id: professionalUserId,
      type: 'New Order',
      title: 'New Service Request Available',
      body: 'A new service request is ready for your attention. Tap to view the service details and accept or reject the assignment.',
      action_route: 'order',
      custom_data: { orderId, total_price: totalPrice }
    });

    // Customer notification
    await notificationApi.createNotification({
      user_id: customerUserId,
      type: 'Order Confirmation',
      title: 'Order Successfully Placed!',
      body: 'Thank you! Your booking has been successfully placed and is now awaiting confirmation from a professional.',
      action_route: 'order',
      custom_data: { orderId, total_price: totalPrice }
    });
  } catch (error) {
    console.error('Failed to create notifications:', error);
    throw error; // Re-throw if you want to handle it differently
  }
};

const handleBookingConfirm = async (bookingDetails: BookingDetails) => {
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

    const selectedPriceInfo = formatPrice(bookingDetails.priceItem);
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

    try {
      await createOrderNotifications(
        selectedProfessional.user_id,
        user.id,
        createdOrder.id,
        totalPrice
      );
    } catch (notificationError) {
   
      console.error('Failed to create notifications:', notificationError);
      // Optionally show a non-blocking warning
      toast.warning(
        getLocalizedText('Order Created', 'अर्डर सिर्जना गरियो'),
        {
          description: getLocalizedText(
            'Order was created but notifications could not be sent',
            'अर्डर सिर्जना गरियो तर सूचना पठाउन सकिएन'
          ),
        }
      );
    }
        

    setShowBookingSheet(false);

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
        router.push(`/dashboard/payments/orders/${createdOrder.id}`);
      }

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


  // Handle filter changes
  const handleFilterChange = (newFilters: Record<string, any>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
    }));
  };

  // Reset all filters
  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      filterType: 'name',
      selectedTag: null,
      selectedPriceRange: null,
      minPrice: null,
      maxPrice: null,
      selectedSkills: [],
      selectedAreas: [],
      rating: null,
    });
    setIsSearching(false);
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
                handleBookNow(selectedProfessional || professionalsData[0], priceItem);
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
        ? 'व्यवसायी मनपर्नेमा थपियो' 
        : 'Professional added to favorites'
    );
  } catch (error) {
     toast.info(
    language === 'ne' 
        ? 'यो व्यवसायी पहिले नै मनपर्नेमा थपिएको छ'
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
            professional.is_professional_favorited
              ? "text-green-500"
              : "text-muted-foreground hover:text-green-500"
          )}
          onClick={(e) => {
            e.stopPropagation();
            handleProfessionalFavorite(professional.professional_id);
          }}
        >
          <User
            className={cn(
              "h-4 w-4 transition-all duration-300",
              professional.is_professional_favorited && "scale-110"
            )}
          />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {professional.is_professional_favorited
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
            professional.is_service_favorited
              ? "text-red-500"
              : "text-muted-foreground hover:text-red-500"
          )}
          onClick={(e) => {
            e.stopPropagation();
            handleServiceFavorite(professional.id);
          }}
        >
          <Heart
            className={cn(
              "h-4 w-4 transition-all duration-300",
              professional.is_service_favorited && "fill-current scale-110"
            )}
          />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {professional.is_service_favorited
          ? "Remove Service from Favorites"
          : "Add Service to Favorites"}
      </TooltipContent>
    </Tooltip>

  </div>
</TooltipProvider>
          
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
            {/* Rating */}
            {professional.average_rating > 0 && (
              <div className="flex items-center gap-1 mb-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{professional.average_rating}</span>
                <span className="text-xs text-muted-foreground">
                  ({professional.total_reviews || 0} {getLocalizedText('reviews', 'समीक्षा')})
                </span>
              </div>
            )}

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
            {professional.all_skills && (
              <div className="mb-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Award className="h-4 w-4" />
                  <span>{getLocalizedText('Skills', 'कौशलहरू')}:</span>
                </div>
                <p className="text-sm line-clamp-2">
                  {professional.all_skills}
                </p>
              </div>
            )}

            {/* Prices */}
            {professional.all_prices?.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <DollarSign className="h-4 w-4" />
                  <span>{getLocalizedText('Prices', 'मूल्यहरू')}:</span>
                </div>
                {renderPriceChips(professional.all_prices)}
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
                    professional.professional_id
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
    else{
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



 const activeFilterCount = [
  filters.selectedTag,
  filters.selectedPriceRange,
  ...(filters.selectedSkills || []),
  ...(filters.selectedAreas || []),
  // filters.rating,
  filters.searchQuery,
].filter(Boolean).length;

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
                  value={filters.searchQuery}
                  onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                  placeholder={getLocalizedText(
                    `Search by ${filters.filterType}...`,
                    `${filters.filterType} द्वारा खोज्नुहोस्...`
                  )}
                  className="border-0 bg-transparent text-primary-background placeholder:text-primary-background70 focus-visible:ring-0 focus-visible:ring-offset-0"
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
                if (isSearching) setFilters(prev => ({ ...prev, searchQuery: '' }));
              }}
            >
              {isSearching ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </Button>

            {/* Filter Sheet */}
            <FilterSheet
              sections={filterSections}
              activeFilters={filters}
              onApplyFilters={handleFilterChange}
              onReset={handleResetFilters}
              triggerClassName="text-primary-background hover:bg-primary-background/20"
              trigger={
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-primary-background hover:bg-primary-foreground/20"
                >
                  <SlidersHorizontal className="h-5 w-5" />
                  {activeFilterCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-white text-primary text-xs font-medium flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
              }
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Active Filters Display */}
        {(filters.searchQuery || filters.selectedTag || filters.selectedPriceRange || 
          filters.selectedSkills.length > 0 || filters.selectedAreas.length > 0) && (
          <div className="mb-6 rounded-lg border bg-card p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-background">
                {getLocalizedText('Active filters:', 'सक्रिय फिल्टरहरू:')}
              </span>
              
              {filters.selectedTag && (
                <Badge variant="secondary" className="gap-1">
                  {getLocalizedText('Tag', 'ट्याग')}: {
                    tagFilters.find(t => t.id === filters.selectedTag)?.[
                      language === 'ne' ? 'labelNp' : 'labelEn'
                    ]
                  }
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-1 h-3 w-3 p-0 hover:bg-transparent"
                    onClick={() => setFilters(prev => ({ ...prev, selectedTag: null }))}
                  >
                    <X className="h-2 w-2" />
                  </Button>
                </Badge>
              )}
              
              {filters.selectedPriceRange && (
                <Badge variant="secondary" className="gap-1">
                  {getLocalizedText('Price', 'मूल्य')}: {
                    priceRanges.find(r => r.value === filters.selectedPriceRange)?.label
                  }
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-1 h-3 w-3 p-0 hover:bg-transparent"
                    onClick={() => setFilters(prev => ({ ...prev, selectedPriceRange: null }))}
                  >
                    <X className="h-2 w-2" />
                  </Button>
                </Badge>
              )}
              
              {filters.selectedSkills.map(skill => (
                <Badge key={skill} variant="secondary" className="gap-1">
                  {skill.replace(/_/g, ' ')}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-1 h-3 w-3 p-0 hover:bg-transparent"
                    onClick={() => setFilters(prev => ({
                      ...prev,
                      selectedSkills: prev.selectedSkills.filter(s => s !== skill)
                    }))}
                  >
                    <X className="h-2 w-2" />
                  </Button>
                </Badge>
              ))}
              
              {filters.selectedAreas.map(area => (
                <Badge key={area} variant="secondary" className="gap-1">
                  {area.replace(/_/g, ' ')}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-1 h-3 w-3 p-0 hover:bg-transparent"
                    onClick={() => setFilters(prev => ({
                      ...prev,
                      selectedAreas: prev.selectedAreas.filter(a => a !== area)
                    }))}
                  >
                    <X className="h-2 w-2" />
                  </Button>
                </Badge>
              ))}
              
              {/* {filters.rating && (
                <Badge variant="secondary" className="gap-1">
                  {filters.rating}+ Stars
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-1 h-3 w-3 p-0 hover:bg-transparent"
                    onClick={() => setFilters(prev => ({ ...prev, rating: null }))}
                  >
                    <X className="h-2 w-2" />
                  </Button>
                </Badge>
              )}
               */}
              {filters.searchQuery && (
                <Badge variant="secondary" className="gap-1">
                  {filters.searchQuery}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-1 h-3 w-3 p-0 hover:bg-transparent"
                    onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
                  >
                    <X className="h-2 w-2" />
                  </Button>
                </Badge>
              )}
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
              onClick={handleResetFilters}
            >
              {getLocalizedText('Clear Filters', 'फिल्टर हटाउनुहोस्')}
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProfessionals.map(renderProfessionalCard)}
          </div>
        )}
      </main>

      {/* Booking Sheet */}
      <BookingSheet
        open={showBookingSheet}
        onOpenChange={setShowBookingSheet}
        professional={selectedProfessional}
        onConfirm={handleBookingConfirm}
        formatPrice={formatPrice}
          onAddAddress={handleAddAddress}
          onUpdateAddress={handleUpdateAddress}
          savedAddresses={temporaryAddresses}
          isLoadingAddresses={isLoadingAddresses}
        // 
           
      />
    {/*  the confirmation dialog */}
    <ConfirmationDialog />
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