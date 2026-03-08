
// "use client";

// import { useI18n } from "@/lib/i18n/context";
// import Image from "next/image";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import { 
//   ArrowLeft, 
//   Tag, 
//   Clock, 
//   CheckCircle, 
//   Star,
//   Shield,
//   Award,
//   Calendar,
//   MapPin,
//   Phone,
//   User
// } from "lucide-react";
// import type { ProfessionalService } from "@/lib/data/professional-services";

// interface ServiceDetailClientProps {
//   service: ProfessionalService;
// }

// export function ServiceDetailClient({ service }: ServiceDetailClientProps) {
//   const { language } = useI18n();
  

//   const getCurrencySymbol = () => {
//     return language === "ne" ? "रु" : "Rs.";
//   };

//   // Calculate price range
//   const getPriceRange = () => {
//     const validPrices = service.prices.filter(p => p.price !== null);
//     if (validPrices.length === 0) return null;
    
//     const priceValues = validPrices.map(p => p.price);
//     const minPrice = Math.min(...priceValues);
//     const maxPrice = Math.max(...priceValues);
    
//     return {
//       min: minPrice,
//       max: maxPrice,
//       isRange: minPrice !== maxPrice
//     };
//   };

//   const priceRange = getPriceRange();
//   const currencySymbol = getCurrencySymbol();
  
//   // Localized content
//   const serviceName = language === "ne" ? service.service.name_np : service.service.name_en;
//   const description = language === "ne" ? service.service.description_np : service.service.description_en;
  
//   // Group prices by quality type
//   const pricesByQuality = service.prices.reduce((acc, price) => {
//     const qualityName =price.quality_type.name ;
//     if (!acc[qualityName]) {
//       acc[qualityName] = [];
//     }
//     acc[qualityName].push(price);
//     return acc;
//   }, {} as Record<string, typeof service.prices>);

//   // Professional info
//   const professional = service.professional;
//   const professionalName = professional.user.full_name;
//   const professionalImage = professional.user.profile_image;
//   const professionalSkill = professional.skill;
//   const serviceAreas = professional.service_areas || [];

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
//       {/* Hero Section with Image */}
//       <div className="relative h-[300px] md:h-[400px] w-full bg-gray-900">
//         {service.service.image ? (
//           <Image
//             src={service.service.image}
//             alt={serviceName}
//             fill
//             className="object-cover opacity-60"
//             priority
//           />
//         ) : (
//           <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10" />
//         )}
        
//         {/* Overlay Content */}
//         <div className="absolute inset-0 bg-black/50" />
        
//         <div className="absolute inset-0 flex items-center">
//           <div className="container mx-auto px-4">
//             <Link 
//               href="/services" 
//               className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors"
//             >
//               <ArrowLeft className="h-4 w-4 mr-2" />
//               {language === "ne" ? "सेवाहरूमा फर्कनुहोस्" : "Back to Services"}
//             </Link>
            
//             <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 max-w-3xl">
//               {serviceName}
//             </h1>
            
//             {description && (
//               <p className="text-white/90 text-lg max-w-2xl line-clamp-2">
//                 {description}
//               </p>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="container mx-auto px-4 py-8 md:py-12">
//         <div className="grid lg:grid-cols-3 gap-8">
//           {/* Left Column - Main Content */}
//           <div className="lg:col-span-2 space-y-8">
//             {/* Full Description */}
//             {description && (
//               <Card>
//                 <CardContent className="p-6">
//                   <h2 className="text-xl font-semibold mb-4">
//                     {language === "ne" ? "विवरण" : "Description"}
//                   </h2>
//                   <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
//                     {description}
//                   </p>
//                 </CardContent>
//               </Card>
//             )}

//             {/* Professional Information */}
//             <Card>
//               <CardContent className="p-6">
//                 <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
//                   <User className="h-5 w-5" />
//                   {language === "ne" ? "व्यवसायिक जानकारी" : "Professional Information"}
//                 </h2>
                
//                 <div className="flex items-start gap-4">
//                   {professionalImage && (
//                     <div className="relative h-16 w-16 rounded-full overflow-hidden">
//                       <Image
//                         src={professionalImage}
//                         alt={professionalName}
//                         fill
//                         className="object-cover"
//                       />
//                     </div>
//                   )}
//                   <div>
//                     <h3 className="font-semibold text-lg">{professionalName}</h3>
//                     <p className="text-sm text-muted-foreground">{professionalSkill}</p>
                    
//                     {/* Service Areas */}
//                     {serviceAreas.length > 0 && (
//                       <div className="mt-2 flex items-start gap-2">
//                         <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
//                         <div className="flex flex-wrap gap-1">
//                           {serviceAreas.map((area) => (
//                             <Badge key={area.id} variant="outline" className="text-xs">
//                               {area.name}
//                             </Badge>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Price Options by Quality */}
//             <Card>
//               <CardContent className="p-6">
//                 <h2 className="text-xl font-semibold mb-6">
//                   {language === "ne" ? "मूल्य विकल्पहरू" : "Price Options"}
//                 </h2>
                
//                 <div className="space-y-8">
//                   {Object.entries(pricesByQuality).map(([qualityName, prices]) => (
//                     <div key={qualityName}>
//                       <h3 className="font-medium text-lg mb-4 flex items-center gap-2">
//                         <Award className="h-5 w-5 text-primary" />
//                         {qualityName}
//                       </h3>
//                       <div className="grid gap-4">
//                         {prices.map((price) => {
//                           const hasDiscount = price.discount_percentage > 0;
//                           const originalPrice = price.price;
//                           const discountedPrice = hasDiscount && originalPrice
//                             ? originalPrice - (originalPrice * price.discount_percentage / 100)
//                             : null;
                          
//                           return (
//                             <div 
//                               key={price.id}
//                               className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border rounded-lg hover:border-primary transition-colors bg-white dark:bg-gray-800"
//                             >
//                               <div className="flex-1 mb-3 sm:mb-0">
//                                 <div className="flex flex-wrap items-center gap-2 mb-2">
//                                   {price.is_minimum_price && (
//                                     <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
//                                       {language === "ne" ? "सुरुवाती मूल्य" : "Starting Price"}
//                                     </Badge>
//                                   )}
//                                   {hasDiscount && (
//                                     <Badge variant="destructive" className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
//                                       {price.discount_percentage}% OFF
//                                     </Badge>
//                                   )}
//                                 </div>
                                
//                                 {/* {price.description && (
//                                   <p className="text-sm text-muted-foreground">
//                                     {language === "ne" ? price.description_np : price.description_en}
//                                   </p>
//                                 )} */}

//                                 {/* Price Unit */}
//                                 {price.price_unit && (
//                                   <p className="text-xs text-muted-foreground mt-1">
//                                     {language === "ne" ? "प्रति" : "Per"} {price.price_unit.name}
//                                   </p>
//                                 )}
//                               </div>
                              
//                               <div className="text-right sm:ml-4">
//                                 {hasDiscount && discountedPrice ? (
//                                   <>
//                                     <p className="text-sm text-muted-foreground line-through">
//                                       {currencySymbol} {originalPrice?.toLocaleString()}
//                                     </p>
//                                     <p className="text-2xl font-bold text-primary">
//                                       {currencySymbol} {discountedPrice.toLocaleString()}
//                                     </p>
//                                     {price.discount_name && (
//                                       <p className="text-xs text-green-600 dark:text-green-400 mt-1 font-medium">
//                                         {price.discount_name}
//                                       </p>
//                                     )}
//                                   </>
//                                 ) : (
//                                   <p className="text-2xl font-bold">
//                                     {currencySymbol} {originalPrice?.toLocaleString()}
//                                   </p>
//                                 )}
//                               </div>
//                             </div>
//                           );
//                         })}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Right Column - Sidebar */}
//           <div className="space-y-6">
//             {/* Quick Info Card */}
//             <Card>
//               <CardContent className="p-6">
//                 <h3 className="font-semibold mb-4 flex items-center gap-2">
//                   <Tag className="h-5 w-5" />
//                   {language === "ne" ? "द्रुत जानकारी" : "Quick Info"}
//                 </h3>
                
//                 <div className="space-y-5">
//                   {/* Price Range */}
//                   {priceRange && (
//                     <div className="flex items-start gap-3 pb-3 border-b">
//                       <div className="bg-primary/10 p-2 rounded-lg">
//                         <Tag className="h-5 w-5 text-primary" />
//                       </div>
//                       <div>
//                         <p className="text-sm text-muted-foreground">
//                           {language === "ne" ? "मूल्य दायरा" : "Price Range"}
//                         </p>
//                         <p className="font-bold text-xl">
//                           {currencySymbol} {priceRange.min.toLocaleString()}
//                           {priceRange.isRange && ` - ${currencySymbol} ${priceRange.max.toLocaleString()}`}
//                         </p>
//                       </div>
//                     </div>
//                   )}

//                   {/* Total Options */}
//                   <div className="flex items-start gap-3 pb-3 border-b">
//                     <div className="bg-primary/10 p-2 rounded-lg">
//                       <CheckCircle className="h-5 w-5 text-primary" />
//                     </div>
//                     <div>
//                       <p className="text-sm text-muted-foreground">
//                         {language === "ne" ? "उपलब्ध विकल्प" : "Available Options"}
//                       </p>
//                       <p className="font-semibold text-lg">
//                         {service.prices.length} {language === "ne" ? "विकल्पहरू" : "options"}
//                       </p>
//                     </div>
//                   </div>

//                   {/* Quality Types */}
//                   <div className="flex items-start gap-3 pb-3 border-b">
//                     <div className="bg-primary/10 p-2 rounded-lg">
//                       <Award className="h-5 w-5 text-primary" />
//                     </div>
//                     <div>
//                       <p className="text-sm text-muted-foreground mb-2">
//                         {language === "ne" ? "गुणस्तर प्रकार" : "Quality Types"}
//                       </p>
//                       <div className="flex flex-wrap gap-2">
//                         {Object.keys(pricesByQuality).map((quality) => (
//                           <Badge key={quality} variant="outline" className="px-3 py-1">
//                             {quality}
//                           </Badge>
//                         ))}
//                       </div>
//                     </div>
//                   </div>

//                   {/* Professional Status */}
//                   <div className="flex items-start gap-3">
//                     <div className="bg-primary/10 p-2 rounded-lg">
//                       <Shield className="h-5 w-5 text-primary" />
//                     </div>
//                     <div>
//                       <p className="text-sm text-muted-foreground">
//                         {language === "ne" ? "व्यवसायिक स्थिति" : "Professional Status"}
//                       </p>
//                       <p className="font-semibold">
//                         {professional.user.is_admin_approved ? (
//                           <span className="text-green-600">✓ {language === "ne" ? "प्रमाणित" : "Verified"}</span>
//                         ) : (
//                           <span className="text-yellow-600">{language === "ne" ? "प्रमाणित हुन बाँकी" : "Pending Verification"}</span>
//                         )}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Booking Card */}
//             <Card className="sticky top-24">
//               <CardContent className="p-6">
//                 <h3 className="font-semibold mb-4 flex items-center gap-2">
//                   <Calendar className="h-5 w-5" />
//                   {language === "ne" ? "बुक गर्नुहोस्" : "Book This Service"}
//                 </h3>
                
//                 <p className="text-sm text-muted-foreground mb-6">
//                   {language === "ne" 
//                     ? "यो सेवा बुक गर्न तलको बटनमा क्लिक गर्नुहोस्। हाम्रो व्यवसायिक टोलीले चाँडै सम्पर्क गर्नेछ।" 
//                     : "Click the button below to book this service. Our professional team will contact you soon."}
//                 </p>
                
//                 <div className="space-y-3">
//                   <Button className="w-full" size="lg" asChild>
//                     <Link href={`/services/${service.id}/book`}>
//                       {language === "ne" ? "अहिले बुक गर्नुहोस्" : "Book Now"}
//                     </Link>
//                   </Button>
                  
//                   <Button variant="outline" className="w-full" asChild>
//                     <Link href={`tel:${professional.user.phone_number}`}>
//                       <Phone className="h-4 w-4 mr-2" />
//                       {language === "ne" ? "सम्पर्क गर्नुहोस्" : "Contact"}
//                     </Link>
//                   </Button>
//                 </div>
                
//                 <div className="mt-6 flex items-center justify-center gap-6 text-xs text-muted-foreground">
//                   <div className="flex items-center gap-1.5">
//                     <Shield className="h-4 w-4" />
//                     <span>{language === "ne" ? "सुरक्षित" : "Secure"}</span>
//                   </div>
//                   <div className="flex items-center gap-1.5">
//                     <Clock className="h-4 w-4" />
//                     <span>{language === "ne" ? "द्रुत" : "Quick"}</span>
//                   </div>
//                   <div className="flex items-center gap-1.5">
//                     <Star className="h-4 w-4" />
//                     <span>{language === "ne" ? "ग्यारेन्टी" : "Guaranteed"}</span>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



"use client";

import { useState, useMemo, useEffect } from "react";
import { useI18n } from "@/lib/i18n/context";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Tag, 
  Clock, 
  CheckCircle, 
  Star,
  Shield,
  Award,
  Calendar,
  MapPin,
  Phone,
  User
} from "lucide-react";
import type { ProfessionalService } from "@/lib/data/professional-services";
import { BookingSheet, BookingDetails, AddressData } from "@/components/booking/booking-sheet";
import { useOrderStore } from '@/stores/order-store';
import { toast } from "sonner";
import { CreateOrderDTO } from '@/lib/data/order';
import { useAuth } from '@/lib/context/auth-context';
import { NepaliDateService } from '@/lib/utils/nepaliDate';
import { useConfirmationDialog } from '@/hooks/use-confirmation-dialog';
import { useAddresses, useAddressStore, useTemporaryAddress } from '@/stores/address-store';
import { Address } from '@/lib/data/address';
import { notificationApi } from '@/lib/api/notification';
import { useRouter } from 'next/navigation';

interface ServiceDetailClientProps {
  service: ProfessionalService;
}

export function ServiceDetailClient({ service }: ServiceDetailClientProps) {
  const { language } = useI18n();
  const router = useRouter();
  const { user } = useAuth();
  const { createOrder } = useOrderStore();
  const { confirm, ConfirmationDialog } = useConfirmationDialog();
  
  // State for booking sheet
  const [showBookingSheet, setShowBookingSheet] = useState(false);
  const [selectedPriceItem, setSelectedPriceItem] = useState<any>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<any>(null);
  // Address store
  const addresses = useAddresses();
  const fetchAddresses = useAddressStore((state) => state.fetchAddresses);
  const createAddress = useAddressStore((state) => state.createAddress);
  const updateAddress = useAddressStore((state) => state.updateAddress);
  const isLoadingAddresses = useAddressStore((state) => state.isLoading);

  // Fetch addresses when user is logged in
  useEffect(() => {
    if (user) {
      fetchAddresses();
    }
  }, [user, fetchAddresses]);

  const getCurrencySymbol = () => {
    return language === "ne" ? "रु" : "Rs.";
  };

  // Calculate price range
  const getPriceRange = () => {
    const validPrices = service.prices.filter(p => p.price !== null);
    if (validPrices.length === 0) return null;
    
    const priceValues = validPrices.map(p => p.price);
    const minPrice = Math.min(...priceValues);
    const maxPrice = Math.max(...priceValues);
    
    return {
      min: minPrice,
      max: maxPrice,
      isRange: minPrice !== maxPrice
    };
  };

  const priceRange = getPriceRange();
  const currencySymbol = getCurrencySymbol();
  
  // Localized content
  const serviceName = language === "ne" ? service.service.name_np : service.service.name_en;
  const description = language === "ne" ? service.service.description_np : service.service.description_en;
  
  // Group prices by quality type
  const pricesByQuality = service.prices.reduce((acc, price) => {
    const qualityName = price.quality_type.name;
    if (!acc[qualityName]) {
      acc[qualityName] = [];
    }
    acc[qualityName].push(price);
    return acc;
  }, {} as Record<string, typeof service.prices>);

  // Professional info
  const professional = service.professional;
  const professionalName = professional.user.full_name;
  const professionalImage = professional.user.profile_image;
  const professionalSkill = professional.skill;
  const serviceAreas = professional.service_areas || [];

  // Format price display
  const formatPrice = (priceItem: any) => {
    const hasDiscount = priceItem.discount_percentage > 0;
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

  // Get temporary addresses
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

  const getLocalizedText = (en: string, np: string) => {
    return language === 'ne' ? np : en;
  };

  // Format professional for booking sheet
const createProfessionalObject = () => ({
  id: service.id,
  professional_id: service.professional_id,
  full_name: professionalName,
  service_name: serviceName,
  all_prices: service.prices || [],
  user_id: professional.user_id,
});

// Handle book now click
const handleBookNow = (priceItem: any) => {
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

  setSelectedPriceItem(priceItem);
  setSelectedProfessional(createProfessionalObject()); // Add this line
  setShowBookingSheet(true);
};

  const createOrderNotifications = async (
    professionalUserId: number,
    customerUserId: number,
    orderId: number,
    totalPrice: number
  ) => {
    try {
      await notificationApi.createNotification({
        user_id: professionalUserId,
        type: 'New Order',
        title: 'New Service Request Available',
        body: 'A new service request is ready for your attention. Tap to view the service details and accept or reject the assignment.',
        action_route: 'order',
        custom_data: { orderId, total_price: totalPrice }
      });

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
    }
  };

  // Handle booking confirmation
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
        professional_service_id: service.id,
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

      try {
        await createOrderNotifications(
          professional.user_id,
          user.id,
          createdOrder.id,
          totalPrice
        );
      } catch (notificationError) {
        console.error('Failed to create notifications:', notificationError);
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section with Image */}
      <div className="relative h-[300px] md:h-[400px] w-full bg-gray-900">
        {service.service.image ? (
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
            <Link 
              href="/#" 
              className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
            {language === "ne" ? "गृहपृष्ठमा फर्कनुहोस्" : "Back to Home"}
            </Link>
            
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 max-w-3xl">
              {serviceName}
            </h1>
            
            {description && (
              <p className="text-white/90 text-lg max-w-2xl line-clamp-2">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Full Description */}
            {description && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    {language === "ne" ? "विवरण" : "Description"}
                  </h2>
                  <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                    {description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Professional Information */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {language === "ne" ? "व्यवसायिक जानकारी" : "Professional Information"}
                </h2>
                
                <div className="flex items-start gap-4">
                  {professionalImage && (
                    <div className="relative h-16 w-16 rounded-full overflow-hidden">
                      <Image
                        src={professionalImage}
                        alt={professionalName}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-lg">{professionalName}</h3>
                    <p className="text-sm text-muted-foreground">{professionalSkill}</p>
                    
                    {/* Service Areas */}
                    {serviceAreas.length > 0 && (
                      <div className="mt-2 flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                        <div className="flex flex-wrap gap-1">
                          {serviceAreas.map((area) => (
                            <Badge key={area.id} variant="outline" className="text-xs">
                              {area.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Price Options by Quality */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-6">
                  {language === "ne" ? "मूल्य विकल्पहरू" : "Price Options"}
                </h2>
                
                <div className="space-y-8">
                  {Object.entries(pricesByQuality).map(([qualityName, prices]) => (
                    <div key={qualityName}>
                      <h3 className="font-medium text-lg mb-4 flex items-center gap-2">
                        <Award className="h-5 w-5 text-primary" />
                        {qualityName}
                      </h3>
                      <div className="grid gap-4">
                        {prices.map((price) => {
                          const hasDiscount = price.discount_percentage > 0;
                          const originalPrice = price.price;
                          const discountedPrice = hasDiscount && originalPrice
                            ? originalPrice - (originalPrice * price.discount_percentage / 100)
                            : null;
                          
                          return (
                            <div 
                              key={price.id}
                              className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border rounded-lg hover:border-primary transition-colors bg-white dark:bg-gray-800 cursor-pointer"
                              onClick={() => handleBookNow(price)}
                            >
                              <div className="flex-1 mb-3 sm:mb-0">
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                  {price.is_minimum_price && (
                                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                                      {language === "ne" ? "सुरुवाती मूल्य" : "Starting Price"}
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
                                    {language === "ne" ? "प्रति" : "Per"} {price.price_unit.name}
                                  </p>
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
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Quick Info Card */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  {language === "ne" ? "द्रुत जानकारी" : "Quick Info"}
                </h3>
                
                <div className="space-y-5">
                  {/* Price Range */}
                  {priceRange && (
                    <div className="flex items-start gap-3 pb-3 border-b">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <Tag className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {language === "ne" ? "मूल्य दायरा" : "Price Range"}
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
                      <CheckCircle className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {language === "ne" ? "उपलब्ध विकल्प" : "Available Options"}
                      </p>
                      <p className="font-semibold text-lg">
                        {service.prices.length} {language === "ne" ? "विकल्पहरू" : "options"}
                      </p>
                    </div>
                  </div>

                  {/* Quality Types */}
                  <div className="flex items-start gap-3 pb-3 border-b">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Award className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {language === "ne" ? "गुणस्तर प्रकार" : "Quality Types"}
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

                  {/* Professional Status */}
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {language === "ne" ? "व्यवसायिक स्थिति" : "Professional Status"}
                      </p>
                      <p className="font-semibold">
                        {professional.user.is_admin_approved ? (
                          <span className="text-green-600">✓ {language === "ne" ? "प्रमाणित" : "Verified"}</span>
                        ) : (
                          <span className="text-yellow-600">{language === "ne" ? "प्रमाणित हुन बाँकी" : "Pending Verification"}</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Card */}
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {language === "ne" ? "बुक गर्नुहोस्" : "Book This Service"}
                </h3>
                
                <p className="text-sm text-muted-foreground mb-6">
                  {language === "ne" 
                    ? "यो सेवा बुक गर्न तलको बटनमा क्लिक गर्नुहोस्। हाम्रो व्यवसायिक टोलीले चाँडै सम्पर्क गर्नेछ।" 
                    : "Click the button below to book this service. Our professional team will contact you soon."}
                </p>
                
                <div className="space-y-3">
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={() => {
                      if (service.prices && service.prices.length > 0) {
                        handleBookNow(service.prices[0]);
                      }
                    }}
                  >
                    {language === "ne" ? "अहिले बुक गर्नुहोस्" : "Book Now"}
                  </Button>
                  
                  {/* <Button variant="outline" className="w-full" asChild>
                    <Link href={`tel:${professional.user.phone_number}`}>
                      <Phone className="h-4 w-4 mr-2" />
                      {language === "ne" ? "सम्पर्क गर्नुहोस्" : "Contact"}
                    </Link>
                  </Button> */}
                     <Button className="w-full" variant="outline" asChild>
                    <Link href={`/services/${service.service_id}/professionals`}>
         {language === "ne" ? "उपलब्ध प्रोफेशनलहरू हेर्नुहोस्" : "View Available Professionals"}
                    </Link>
                  </Button>
                </div>
                
                <div className="mt-6 flex items-center justify-center gap-6 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Shield className="h-4 w-4" />
                    <span>{language === "ne" ? "सुरक्षित" : "Secure"}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    <span>{language === "ne" ? "द्रुत" : "Quick"}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Star className="h-4 w-4" />
                    <span>{language === "ne" ? "ग्यारेन्टी" : "Guaranteed"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

   {/* Booking Sheet */}
{selectedProfessional && (
  <BookingSheet
    open={showBookingSheet}
    onOpenChange={setShowBookingSheet}
    professional={selectedProfessional}
    onConfirm={handleBookingConfirm}
    formatPrice={formatPrice}
    savedAddresses={temporaryAddresses}
    onAddAddress={handleAddAddress}
    onUpdateAddress={handleUpdateAddress}
    isLoadingAddresses={isLoadingAddresses}
  />
)}

      {/* Confirmation Dialog */}
      <ConfirmationDialog />
    </div>
  );
}