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
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
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

  return (
    <>
      <div className="min-h-screen bg-background">
     {/* Header */}
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

        <main className="container mx-auto px-4 py-6">
          {/* Service Detail Card */}
          <div className="max-w-4xl mx-auto">
            <Card className="overflow-hidden">
              {/* Service Image */}
              <div className="relative h-64 w-full overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
                {service.service?.image ? (
                  <Image
                    src={service.service.image}
                    alt={service.service.name_en}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Wrench className="h-16 w-16 text-muted-foreground/30" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                {/* Favorite Buttons */}
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

              {/* Service Info */}
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Title and Description */}
                  <div>
                    <h2 className="text-2xl font-bold">
                      {language === 'ne' ? service.service?.name_np : service.service?.name_en}
                    </h2>
                    <p className="mt-2 text-muted-foreground">
                      {language === 'ne' ? service.service?.description_np : service.service?.description_en}
                    </p>
                  </div>

                  {/* Pricing Section */}
                  {pricedItems.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Banknote className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-semibold">
                          {getLocalizedText('Pricing Options', 'मूल्य विकल्पहरू')}
                        </h3>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        {pricedItems.map((price: any) => {
                          const priceDisplay = formatPriceDisplay(price);
                          
                          return (
                            <Card key={price.id} className="border-2 hover:border-primary transition-colors">
                              <CardContent className="p-4">
                                {/* Price */}
                                <div className="mb-3">
                                  {priceDisplay.hasDiscount ? (
                                    <div>
                                      <div className="flex items-baseline gap-2">
                                        <span className="text-2xl font-bold text-primary">
                                          Rs. {priceDisplay.discountedPrice}
                                        </span>
                                        <span className="text-sm line-through text-muted-foreground">
                                          Rs. {priceDisplay.originalPrice}
                                        </span>
                                      </div>
                                      <Badge variant="secondary" className="mt-1">
                                        <Tag className="mr-1 h-3 w-3" />
                                        {priceDisplay.discountPercentage}% OFF
                                      </Badge>
                                    </div>
                                  ) : (
                                    <span className="text-2xl font-bold text-primary">
                                      Rs. {priceDisplay.originalPrice}
                                    </span>
                                  )}
                                </div>

                                {/* Details */}
                                <div className="space-y-2 text-sm">
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <Package className="h-4 w-4" />
                                    <span>{priceDisplay.unit}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <Star className="h-4 w-4" />
                                    <span>{priceDisplay.quality}</span>
                                  </div>
                                  {priceDisplay.isMinimumPrice && (
                                    <Badge variant="secondary">
                                      {getLocalizedText('Minimum Price', 'न्यूनतम मूल्य')}
                                    </Badge>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Book Now Button */}
                  <div className="pt-4">
                    <Button
                      onClick={handleBookNow}
                      size="lg"
                      className="w-full md:w-auto md:min-w-[200px]"
                    >
                      <Calendar className="mr-2 h-5 w-5" />
                      {getLocalizedText('Book This Service', 'यो सेवा बुक गर्नुहोस्')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
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