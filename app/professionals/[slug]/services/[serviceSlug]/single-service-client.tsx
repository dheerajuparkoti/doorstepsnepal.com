//SERVICE DETAIL PAGE STYLE 


'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n/context';
import { 
  ChevronRight,
  Wrench,
  Tag,
  Calendar,
  Banknote,
  Heart,
  User,
  ArrowLeft,
  Package,
  Clock,
  Star,
  MapPin,
  Shield,
  Award,
  CheckCircle,
  Info,
  ShieldCheck,
  Phone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { BookNowButton } from '@/components/professional/book-now-button';
import { BookingDetails, BookingSheet } from '@/components/booking/booking-sheet';
import { useConfirmationDialog } from '@/hooks/use-confirmation-dialog';
import { toast } from "sonner";
import { CreateOrderDTO } from '@/lib/data/order';
import { NepaliDateService } from '@/lib/utils/nepaliDate';
import { useAuth } from '@/lib/context/auth-context';
import { useOrderStore } from '@/stores/order-store';
import { useAddressStore, useAddresses } from '@/stores/address-store';
import { Address } from '@/lib/data/address';
import { AddressData } from '@/components/booking/booking-sheet';
import { cn } from '@/lib/utils';
import { useGuestStore } from '@/stores/guest-store';
import { addFavorite } from '@/lib/api/favorites';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';

interface SingleProfessionalServiceClientProps {
  professionalId: number;
  professionalName: string;
  service: any; 
}

export function SingleProfessionalServiceClient({
  professionalId,
  professionalName,
  service,
}: SingleProfessionalServiceClientProps) {
  const router = useRouter();
  const { language } = useI18n();
  const { createOrder } = useOrderStore();
  const { confirm, ConfirmationDialog } = useConfirmationDialog();
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  
  // Booking state
  const [selectedProfessional, setSelectedProfessional] = useState<any>(null);
  const [isBookingSheetOpen, setIsBookingSheetOpen] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const { user } = useAuth();

  // Address store
  const addresses = useAddresses();
  const fetchAddresses = useAddressStore((state) => state.fetchAddresses);
  const createAddress = useAddressStore((state) => state.createAddress);
  const updateAddress = useAddressStore((state) => state.updateAddress);
  const isLoadingAddresses = useAddressStore((state) => state.isLoading);

  // Filter and convert addresses to AddressData type
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

  // Create professional object for booking
  const createProfessionalObject = () => ({
    id: service.id,
    professional_id: service.professional_id,
    full_name: professionalName,
    service_name: language === 'ne' ? service.service?.name_np : service.service?.name_en,
    all_prices: service.prices || [],
    user_id: service.professional_user_id,
  });

  const handleBookNow = () => {
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
    if (service.professional?.user?.id === user.id) {
      toast.error(
        getLocalizedText('Cannot Book', 'बुक गर्न सकिँदैन'),
        {
          description: getLocalizedText('You cannot book your own service', 'तपाईं आफ्नै सेवा बुक गर्न सक्नुहुन्न'),
        }
      );
      return;
    }

    setSelectedProfessional(createProfessionalObject());
    setIsBookingSheetOpen(true);
  };

  // Handle address operations
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

  const handleConfirmBooking = async (bookingDetails: BookingDetails) => {
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
        title: getLocalizedText('Proceed to Payment?', 'भुक्तानीमा जाने?'),
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
    } catch (error: any) {
      console.error('Error creating order:', error);
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

  const handleProfessionalFavorite = async () => {
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
        professional_id: service.professional_id,
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

  const handleServiceFavorite = async () => {
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
        professional_service_id: service.id,
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

  const pricedItems = service.prices?.filter((p: any) => p.price !== null) || [];
  
  // Calculate price range
  const getPriceRange = () => {
    if (pricedItems.length === 0) return null;
    const prices = pricedItems.map((p: any) => p.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    return {
      min: minPrice,
      max: maxPrice,
      isRange: minPrice !== maxPrice
    };
  };

  const priceRange = getPriceRange();
  const currencySymbol = language === "ne" ? "रु" : "Rs.";
  const serviceName = language === 'ne' ? service.service?.name_np : service.service?.name_en;
  const description = language === 'ne' ? service.service?.description_np : service.service?.description_en;

  // Group prices by quality type
  const pricesByQuality = (pricedItems || []).reduce((acc: any, price: any) => {
    const qualityName = price.quality_type?.name || 'Standard';
    if (!acc[qualityName]) {
      acc[qualityName] = [];
    }
    acc[qualityName].push(price);
    return acc;
  }, {});

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header - KEPT EXACTLY THE SAME */}
        <header className="sticky top-0 z-50 w-full border-b bg-primary text-primary-foreground">
          <div className="container mx-auto flex h-16 items-center px-4">
            <Button
              variant="ghost"
              size="icon"
              className="mr-4 text-primary-foreground hover:bg-primary-foreground/20"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto text-primary-foreground hover:bg-primary-foreground/20"
              onClick={() => {
                const pathParts = window.location.pathname.split('/');
                const basePath = pathParts.slice(0, -2).join('/');
                router.push(`${basePath}/services`);
              }}
            >
              {getLocalizedText('View All Services', 'सबै सेवाहरू हेर्नुहोस्')}
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
            
            <div>
              <h1 className="text-lg font-semibold">{professionalName}</h1>
              <p className="text-xs text-primary-foreground/70">
                {getLocalizedText('Service Details', 'सेवा विवरण')}
              </p>
            </div>
          </div>
        </header>

        {/* Hero Section with Image - Similar to service detail page */}
        <div className="relative h-[300px] md:h-[400px] w-full bg-gray-900">
          {service.service?.image ? (
            <Image
              src={service.service.image}
              alt={serviceName}
              fill
              className="object-cover opacity-60"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10" />
          )}
          
          {/* Overlay Content */}
          <div className="absolute inset-0 bg-black/50" />
          
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 max-w-3xl">
                {serviceName}
              </h1>
              
              {description && (
                <p className="text-white/90 text-lg max-w-2xl line-clamp-2">
                  {description}
                </p>
              )}

              {/* Favorite Buttons - Moved to hero section */}
              <TooltipProvider>
                <div className="absolute top-4 right-4 z-10 flex gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "h-10 w-10 rounded-full backdrop-blur-md shadow-md",
                          "bg-white/80 dark:bg-black/60",
                          "hover:scale-110 hover:shadow-lg",
                          service.is_professional_favorited
                            ? "text-green-500"
                            : "text-muted-foreground hover:text-green-500"
                        )}
                        onClick={handleProfessionalFavorite}
                      >
                        <User className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {service.is_professional_favorited
                        ? "Remove Professional from Favorites"
                        : "Add Professional to Favorites"}
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "h-10 w-10 rounded-full backdrop-blur-md shadow-md",
                          "bg-white/80 dark:bg-black/60",
                          "hover:scale-110 hover:shadow-lg",
                          service.is_service_favorited
                            ? "text-red-500"
                            : "text-muted-foreground hover:text-red-500"
                        )}
                        onClick={handleServiceFavorite}
                      >
                        <Heart
                          className={cn(
                            "h-5 w-5",
                            service.is_service_favorited && "fill-current"
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
          </div>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content (2/3 width) */}
            <div className="lg:col-span-2 space-y-8">
              {/* Full Description Card */}
              {description && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Info className="h-5 w-5 text-primary" />
                      {getLocalizedText('Description', 'विवरण')}
                    </h2>
                    <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                      {description}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Professional Information Card */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    {getLocalizedText('Professional Information', 'व्यवसायिक जानकारी')}
                  </h2>
                  
                  <div className="flex items-start gap-4">
                    <div className="relative h-16 w-16 rounded-full overflow-hidden bg-muted">
                      {service.professional?.user?.profile_image ? (
                        <Image
                          src={service.professional.user.profile_image}
                          alt={professionalName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-primary/10">
                          <User className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{professionalName}</h3>
                      <p className="text-sm text-muted-foreground">{service.professional?.skill || 'Professional'}</p>
                      
                      {/* Service Areas */}
                      {service.professional?.service_areas?.length > 0 && (
                        <div className="mt-3 flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                          <div className="flex flex-wrap gap-1">
                            {service.professional.service_areas.slice(0, 3).map((area: any) => (
                              <Badge key={area.id} variant="outline" className="text-xs">
                                {area.name}
                              </Badge>
                            ))}
                            {service.professional.service_areas.length > 3 && (
                              <span className="text-xs text-muted-foreground">
                                +{service.professional.service_areas.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Price Options by Quality */}
              {pricedItems.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                      <Banknote className="h-5 w-5 text-primary" />
                      {getLocalizedText('Price Options', 'मूल्य विकल्पहरू')}
                    </h2>
                    
                    <div className="space-y-8">
                      {Object.entries(pricesByQuality).map(([qualityName, prices]: [string, any]) => (
                        <div key={qualityName}>
                          <h3 className="font-medium text-lg mb-4 flex items-center gap-2">
                            <Award className="h-5 w-5 text-primary" />
                            {qualityName}
                          </h3>
                          <div className="grid gap-4">
                            {(prices as any[]).map((price) => {
                              const hasDiscount = price.discount_percentage > 0 && price.discount_is_active;
                              const originalPrice = price.price;
                              const discountedPrice = hasDiscount
                                ? Math.round(originalPrice * (1 - price.discount_percentage / 100))
                                : null;
                              
                              return (
                                <div 
                                  key={price.id}
                                  className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border rounded-lg hover:border-primary transition-colors bg-white dark:bg-gray-800 cursor-pointer"
                                  onClick={() => handleBookNow()}
                                >
                                  <div className="flex-1 mb-3 sm:mb-0">
                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                      {price.is_minimum_price && (
                                        <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                                          {getLocalizedText('Starting Price', 'सुरुवाती मूल्य')}
                                        </Badge>
                                      )}
                                      {hasDiscount && (
                                        <Badge variant="destructive" className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
                                          {price.discount_percentage}% OFF
                                        </Badge>
                                      )}
                                    </div>

                                    {/* Price Unit */}
                                    {price.price_unit && (
                                      <p className="text-xs text-muted-foreground mt-1">
                                        {getLocalizedText('Per', 'प्रति')} {price.price_unit.name}
                                      </p>
                                    )}

                                    {/* Warranty */}
                                    {price.has_warranty && (
                                      <div className="flex items-center gap-1 mt-1 text-xs text-emerald-600 font-medium">
                                        <ShieldCheck className="h-3.5 w-3.5" />
                                        {price.warranty_duration} {price.warranty_unit} {getLocalizedText('warranty', 'वारेन्टी')}
                                      </div>
                                    )}
                                  </div>
                                  
                                  <div className="text-right sm:ml-4">
                                    {hasDiscount && discountedPrice ? (
                                      <>
                                        <p className="text-sm text-muted-foreground line-through">
                                          {currencySymbol} {originalPrice?.toLocaleString()}
                                        </p>
                                        <p className="text-2xl font-bold text-primary">
                                          {currencySymbol} {discountedPrice.toLocaleString()}
                                        </p>
                                        {price.discount_name && (
                                          <p className="text-xs text-green-600 dark:text-green-400 mt-1 font-medium">
                                            {price.discount_name}
                                          </p>
                                        )}
                                      </>
                                    ) : (
                                      <p className="text-2xl font-bold">
                                        {currencySymbol} {originalPrice?.toLocaleString()}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Sidebar (1/3 width) */}
            <div className="space-y-6">
              {/* Quick Info Card */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    {getLocalizedText('Quick Info', 'द्रुत जानकारी')}
                  </h3>
                  
                  <div className="space-y-5">
                    {/* Price Range */}
                    {priceRange && (
                      <div className="flex items-start gap-3 pb-3 border-b">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <Banknote className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            {getLocalizedText('Price Range', 'मूल्य दायरा')}
                          </p>
                          <p className="font-bold text-xl">
                            {currencySymbol} {priceRange.min.toLocaleString()}
                            {priceRange.isRange && ` - ${currencySymbol} ${priceRange.max.toLocaleString()}`}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Total Options */}
                    <div className="flex items-start gap-3 pb-3 border-b">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {getLocalizedText('Available Options', 'उपलब्ध विकल्प')}
                        </p>
                        <p className="font-semibold text-lg">
                          {pricedItems.length} {getLocalizedText('options', 'विकल्पहरू')}
                        </p>
                      </div>
                    </div>

                    {/* Quality Types */}
                    {Object.keys(pricesByQuality).length > 0 && (
                      <div className="flex items-start gap-3 pb-3 border-b">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <Award className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {getLocalizedText('Quality Types', 'गुणस्तर प्रकार')}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {Object.keys(pricesByQuality).map((quality) => (
                              <Badge key={quality} variant="outline" className="px-3 py-1">
                                {quality}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Professional Status */}
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <Shield className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {getLocalizedText('Professional Status', 'व्यवसायिक स्थिति')}
                        </p>
                        <p className="font-semibold">
                          {service.professional?.user?.is_admin_approved ? (
                            <span className="text-green-600">✓ {getLocalizedText('Verified', 'प्रमाणित')}</span>
                          ) : (
                            <span className="text-yellow-600">{getLocalizedText('Pending Verification', 'प्रमाणित हुन बाँकी')}</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Booking Card - Sticky */}
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {getLocalizedText('Book This Service', 'यो सेवा बुक गर्नुहोस्')}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground mb-6">
                    {getLocalizedText(
                      'Click the button below to book this service. Our professional team will contact you soon.',
                      'यो सेवा बुक गर्न तलको बटनमा क्लिक गर्नुहोस्। हाम्रो व्यवसायिक टोलीले चाँडै सम्पर्क गर्नेछ।'
                    )}
                  </p>
                  
                  <div className="space-y-3">
                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={handleBookNow}
                    >
                      <Calendar className="mr-2 h-5 w-5" />
                      {getLocalizedText('Book Now', 'अहिले बुक गर्नुहोस्')}
                    </Button>
                    
                    {service.professional?.user?.phone_number && (
                      <Button variant="outline" className="w-full" asChild>
                        <Link href={`tel:${service.professional.user.phone_number}`}>
                          <Phone className="h-4 w-4 mr-2" />
                          {getLocalizedText('Contact', 'सम्पर्क गर्नुहोस्')}
                        </Link>
                      </Button>
                    )}
                  </div>
                  
                  <div className="mt-6 flex items-center justify-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Shield className="h-3 w-3" />
                      <span>{getLocalizedText('Secure', 'सुरक्षित')}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3 w-3" />
                      <span>{getLocalizedText('Quick', 'द्रुत')}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Star className="h-3 w-3" />
                      <span>{getLocalizedText('Guaranteed', 'ग्यारेन्टी')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Sheet */}
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