'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  User, 
  Calendar, 
  Clock, 
  FileText, 
  Check, 
  X, 
  Edit, 
  Plus,
  ChevronRight,
  Home,
  Building,
  MapPinned,
  Tag,
  Package,
  CreditCard
} from 'lucide-react';
import { AddressDialog } from '@/components/booking/address-picker';
import { cn } from '@/lib/utils';

import { DatePicker } from 'hamro-nepali-patro';
import 'hamro-nepali-patro/dist/styles.css';
import { NepaliDateService } from '@/lib/utils/nepaliDate';
import { useAddressStore } from '@/stores/address-store';
// Types
export interface PriceItem {
  id: number;
  price: number;
  discount_is_active: boolean;
  discount_percentage: number;
  price_unit?: { name: string; name_ne?: string };
  quality_type?: { name: string; name_ne?: string };
  is_minimum_price?: boolean;
    price_unit_id: number; 
  quality_type_id: number; 
}

export interface AddressData {
  type: 'temporary';
  province: string;
  district: string;
  municipality: string;
  ward_no: string;
  street_address: string;
  id?: number;
  label?: string;
  is_default?: boolean;
}

export interface BookingDetails {
  priceItem: PriceItem | null;
  quantity: number;
  scheduledDate: string;
  scheduledTime: string;
  address: AddressData | null;
  notes: string;
}




// interface BookingSheetProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   professional: any;
//   onConfirm: (details: BookingDetails) => Promise<void>;
//   formatPrice: (priceItem: PriceItem) => {
//     originalPrice: number;
//     discountedPrice: number;
//     hasDiscount: boolean;
//     display: string;
//     display_ne?: string;
//     unit: string;
//     unit_ne?: string;
//     quality: string;
//     quality_ne?: string;
//   };
//   User's saved addresses (temporary addresses only)
//   savedAddresses?: AddressData[];
//   onAddAddress?: (address: AddressData) => Promise<void>;
//   onUpdateAddress?: (address: AddressData) => Promise<void>;
  
// }
interface BookingSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  professional: any;
  onConfirm: (details: BookingDetails) => Promise<void>;
  formatPrice: (priceItem: PriceItem) => {
    originalPrice: number;
    discountedPrice: number;
    hasDiscount: boolean;
    display: string;
    display_ne?: string;
    unit: string;
    unit_ne?: string;
    quality: string;
    quality_ne?: string;
  };
  // User's saved addresses (temporary addresses only)
  savedAddresses?: AddressData[];
  onAddAddress?: (address: any) => Promise<any>;
  onUpdateAddress?: (addressId: number, address: any) => Promise<any>;
  isLoadingAddresses?: boolean; // Add loading state
}

export function BookingSheet({
  open,
  onOpenChange,
  professional,
  onConfirm,
  formatPrice,
  savedAddresses = [],
  onAddAddress,
  onUpdateAddress,
}: BookingSheetProps) {
  const { language } = useI18n();


    const getCurrentDateString = (): string => {
    const now = NepaliDateService.now();
    return now.format('YYYY-MM-DD'); // Format as string
  };
  
  const getCurrentTime24Hour = (): string => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`; // Returns "14:30" for 2:30 PM
  };


  const formatTimeTo12Hour = (time24: string): string => {
  if (!time24) return '';
  
  const [hours, minutes] = time24.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  
  return `${hour12}:${minutes} ${ampm}`;
};
  
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
    priceItem: null,
    quantity: 1,
    scheduledDate:getCurrentDateString(),
    scheduledTime: getCurrentTime24Hour(),
    address: null,
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [selectedAddressForEdit, setSelectedAddressForEdit] = useState<AddressData | null>(null);
  const [isAddressSaving, setIsAddressSaving] = useState(false);
  const [step, setStep] = useState<'details' | 'address' | 'confirm'>('details');
  const isLoadingAddresses = useAddressStore((state) => state.isLoading);
  const getLocalizedText = (en: string, np: string) => {
    return language === 'ne' ? np : en;
  };





  const formatAddressDisplay = (address: AddressData): string => {
    if (language === 'ne') {
      return `${address.street_address}, ${address.municipality}, ${address.district}, ${address.province} - ${address.ward_no}`;
    }
    return `${address.street_address}, ${address.municipality}, ${address.district}, ${address.province} - ${address.ward_no}`;
  };

const handleAddressSave = async (addressData: any) => {
  try {
    setIsAddressSaving(true);
    const address: AddressData = {
      ...addressData,
      type: 'temporary', // Force to temporary for booking
      id: selectedAddressForEdit?.id || Date.now(),
    };

    if (selectedAddressForEdit && onUpdateAddress) {
      // For update, ensure we have a valid ID
      const addressId = selectedAddressForEdit.id;
      
      // Check if addressId exists and is a number
      if (typeof addressId === 'number') {
        await onUpdateAddress(addressId, address);
      } else if (typeof addressId === 'string') {
        // If it's a string (like from Date.now()), convert to number
        const parsedId = parseInt(addressId, 10);
        if (!isNaN(parsedId)) {
          await onUpdateAddress(parsedId, address);
        } else {
          throw new Error('Invalid address ID');
        }
      } else {
        throw new Error('Address ID is required for update');
      }
    } else if (onAddAddress) {
      // For add, just pass the address
      await onAddAddress(address);
    }
    
    // Select the newly added/updated address
    setBookingDetails(prev => ({ ...prev, address }));
    setAddressDialogOpen(false);
    setSelectedAddressForEdit(null);
  } catch (error) {
    console.error('Error saving address:', error);
  } finally {
    setIsAddressSaving(false);
  }
};

  const handleConfirmBooking = async () => {
    if (!bookingDetails.priceItem || !bookingDetails.address) return;
    
    setIsSubmitting(true);
    try {
      await onConfirm(bookingDetails);
      onOpenChange(false);
      // Reset form after successful booking
      setBookingDetails({
        priceItem: null,
        quantity: 1,
        scheduledDate: getCurrentDateString(),
        scheduledTime: getCurrentTime24Hour(),
        address: null,
        notes: '',
      });
      setStep('details');
    } catch (error) {
      console.error('Error confirming booking:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = {
    details: bookingDetails.priceItem && bookingDetails.quantity > 0,
    address: bookingDetails.address !== null,
    confirm: true,
  };

  const selectedPriceInfo = bookingDetails.priceItem 
    ? formatPrice(bookingDetails.priceItem)
    : null;

  const totalPrice = selectedPriceInfo 
    ? selectedPriceInfo.discountedPrice * bookingDetails.quantity 
    : 0;

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="sm:max-w-md p-0 flex flex-col">
          <SheetHeader className="p-6 pb-2">
            <SheetTitle className="text-2xl">
              {getLocalizedText('Book Service', 'सेवा बुक गर्नुहोस्')}
            </SheetTitle>
            <SheetDescription>
              {professional && (
                <span>
                  {getLocalizedText('with', 'संग')} <span className="font-medium text-foreground">{professional.full_name}</span>
                </span>
              )}
            </SheetDescription>
          </SheetHeader>

          {/* Step Indicator */}
          <div className="px-6 pt-2">
            <div className="flex items-center justify-between">
              {[
                { key: 'details', label: getLocalizedText('Details', 'विवरण') },
                { key: 'address', label: getLocalizedText('Address', 'ठेगाना') },
                { key: 'confirm', label: getLocalizedText('Confirm', 'पुष्टि') },
              ].map((s, index) => (
                <div key={s.key} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                      step === s.key 
                        ? "bg-primary text-primary-foreground" 
                        : canProceed[s.key as keyof typeof canProceed]
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                    )}>
                      {canProceed[s.key as keyof typeof canProceed] && step !== s.key ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span className="text-xs mt-1 text-muted-foreground">{s.label}</span>
                  </div>
                  {index < 2 && (
                    <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <ScrollArea className="flex-1 px-6">
            <div className="space-y-6 py-4">
              {/* Service Info Card */}
              <Card className="p-4 bg-muted/50">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{professional?.service_name}</h3>
                    <p className="text-sm text-muted-foreground">{professional?.full_name}</p>
                    {professional?.experience_years && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {getLocalizedText(
                          `${professional.experience_years}+ years experience`,
                          `${professional.experience_years}+ वर्ष अनुभव`
                        )}
                      </p>
                    )}
                  </div>
                </div>
              </Card>

              {step === 'details' && (
                <div className="space-y-6">
                  {/* Price Selection */}
                  <div className="space-y-3">
                    <Label className="text-base font-semibold flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      {getLocalizedText('Select Service Type', 'सेवा प्रकार छान्नुहोस्')}
                    </Label>
                    <div className="grid gap-2">
                      {professional?.all_prices?.map((price: PriceItem) => {
                        const priceInfo = formatPrice(price);
                        const isSelected = bookingDetails.priceItem?.id === price.id;
                        return (
                          <Card
                            key={price.id}
                            className={cn(
                              "p-4 cursor-pointer transition-all hover:border-primary",
                              isSelected && "border-primary bg-primary/5"
                            )}
                            onClick={() => setBookingDetails(prev => ({ ...prev, priceItem: price }))}
                          >
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <div className="font-medium">
                                  {language === 'ne' ? priceInfo.quality_ne : priceInfo.quality}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {getLocalizedText('Unit', 'एकाइ')}: {language === 'ne' ? priceInfo.unit_ne : priceInfo.unit}
                                </div>
                                {priceInfo.hasDiscount && (
                                  <Badge variant="secondary" className="mt-1">
                                    {getLocalizedText(
                                      `${price.discount_percentage}% OFF`,
                                      `${price.discount_percentage}% छुट`
                                    )}
                                  </Badge>
                                )}
                              </div>
                              <div className="text-right">
                                {priceInfo.hasDiscount ? (
                                  <>
                                    <div className="text-sm text-muted-foreground line-through">
                                      Rs. {priceInfo.originalPrice}
                                    </div>
                                    <div className="text-lg font-bold text-primary">
                                      Rs. {priceInfo.discountedPrice}
                                    </div>
                                  </>
                                ) : (
                                  <div className="text-lg font-bold">
                                    Rs. {priceInfo.originalPrice}
                                  </div>
                                )}
                              </div>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="space-y-3">
                    <Label className="text-base font-semibold flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      {getLocalizedText('Quantity', 'परिमाण')}
                    </Label>
                    <div className="flex items-center justify-between p-2 border rounded-lg">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10"
                        onClick={() => setBookingDetails(prev => ({
                          ...prev,
                          quantity: Math.max(1, prev.quantity - 1)
                        }))}
                        disabled={bookingDetails.quantity <= 1}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <span className="text-2xl font-semibold min-w-[60px] text-center">
                        {bookingDetails.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10"
                        onClick={() => setBookingDetails(prev => ({
                          ...prev,
                          quantity: prev.quantity + 1
                        }))}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

{/* Date and Time */}
<div className="space-y-3">
  <Label className="text-base font-semibold flex items-center gap-2">
    <Calendar className="h-4 w-4" />
    {getLocalizedText('Schedule', 'मिति र समय')}
  </Label>
  
  <div className="grid grid-cols-2 gap-3">
    {/* Date */}
    <div className="space-y-2">
      <Label className="text-sm text-muted-foreground">
        {getLocalizedText('Date', 'मिति')}
      </Label>
      <div className="relative">
        <DatePicker
          value={bookingDetails.scheduledDate}
          onChange={(value: string) => {
            console.log('Selected date:', value); 
            setBookingDetails(prev => ({
              ...prev,
              scheduledDate: value
            }));
          }}
          calendarType="BS" 
          dateFormat="YYYY-MM-DD"
          showMonthDropdown
          showYearDropdown
          isClearable={false}
          className="w-full border rounded-md !h-10 [&>input]:!h-10 [&>input]:!min-h-0 [&>input]:!py-0 [&>input]:!px-3 [&>input]:pl-10"
          inputClassName="!h-10 !min-h-0 !py-0 !px-3 !pl-10"
          placeholder={getLocalizedText('Select date', 'मिति चयन गर्नुहोस्')}
        />
     
      </div>
    </div>
   
    {/* Time */}
    <div className="space-y-2">
      <Label className="text-sm text-muted-foreground">
        {getLocalizedText('Time', 'समय')}
      </Label>
      <div className="relative">
        <Input
          type="time"
          className="w-full h-10 px-3 border rounded-md"
          value={bookingDetails.scheduledTime}
          onChange={(e) => {
            setBookingDetails(prev => ({
              ...prev,
              scheduledTime: e.target.value
            }));
          }}
        />
      </div>
    </div>
  </div>
</div>
                  {/* Next Button */}
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={() => setStep('address')}
                    disabled={!canProceed.details}
                  >
                    {getLocalizedText('Continue to Address', 'ठेगानामा जानुहोस्')}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}

              {step === 'address' && (
                <div className="space-y-6">
                  {/* Address Selection */}
                  <div className="space-y-3">
                    <Label className="text-base font-semibold flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {getLocalizedText('Delivery Address', 'डेलिभरी ठेगाना')}
                    </Label>
                    
                    {/* Saved Addresses
                    {savedAddresses.length > 0 && (
                      <div className="space-y-2">
                        {savedAddresses.map((addr) => (
                          <Card
                            key={addr.id}
                            className={cn(
                              "p-4 cursor-pointer transition-all hover:border-primary",
                              bookingDetails.address?.id === addr.id && "border-primary bg-primary/5"
                            )}
                            onClick={() => setBookingDetails(prev => ({ ...prev, address: addr }))}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge variant="outline" className="bg-primary/5">
                                    {getLocalizedText('Temporary', 'अस्थायी')}
                                  </Badge>
                                  {addr.is_default && (
                                    <Badge variant="secondary">
                                      {getLocalizedText('Default', 'पूर्वनिर्धारित')}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm">{formatAddressDisplay(addr)}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 ml-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedAddressForEdit(addr);
                                  setAddressDialogOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )} */}

                    {/* Saved Addresses */}
{/* Saved Addresses */}
{savedAddresses.length > 0 && (
  <div className="space-y-2">
    {isLoadingAddresses ? (
      // Loading skeleton
      <div className="space-y-2">
        {[1, 2].map((i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="h-16 bg-muted rounded"></div>
          </Card>
        ))}
      </div>
    ) : (
      savedAddresses.map((addr) => (
        <Card
          key={addr.id}
          className={cn(
            "p-4 cursor-pointer transition-all hover:border-primary",
            bookingDetails.address?.id === addr.id && "border-primary bg-primary/5"
          )}
          onClick={() => setBookingDetails(prev => ({ ...prev, address: addr }))}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="bg-primary/5">
                  {getLocalizedText('Temporary', 'अस्थायी')}
                </Badge>
                {/* Removed is_default badge since it doesn't exist in your table */}
              </div>
              <p className="text-sm">{formatAddressDisplay(addr)}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 ml-2"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedAddressForEdit(addr);
                setAddressDialogOpen(true);
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ))
    )}
  </div>
)}
                    {/* Add New Address Button */}
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                      onClick={() => {
                        setSelectedAddressForEdit(null);
                        setAddressDialogOpen(true);
                      }}
                    >
                      <Plus className="h-4 w-4" />
                      {getLocalizedText('Add New Address', 'नयाँ ठेगाना थप्नुहोस्')}
                    </Button>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setStep('details')}
                    >
                      {getLocalizedText('Back', 'पछाडि')}
                    </Button>
                    <Button 
                      className="flex-1"
                      onClick={() => setStep('confirm')}
                      disabled={!canProceed.address}
                    >
                      {getLocalizedText('Continue', 'अगाडि बढ्नुहोस्')}
                    </Button>
                  </div>
                </div>
              )}

              {step === 'confirm' && (
                <div className="space-y-6">
                  {/* Booking Summary */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">
                      {getLocalizedText('Booking Summary', 'बुकिङ सारांश')}
                    </h3>
                    
                    {/* Service Details */}
                    <Card className="p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {getLocalizedText('Service', 'सेवा')}
                        </span>
                        <span className="font-medium">{professional?.service_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {getLocalizedText('Provider', 'प्रदायक')}
                        </span>
                        <span className="font-medium">{professional?.full_name}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {getLocalizedText('Type', 'प्रकार')}
                        </span>
                        <span className="font-medium">
                          {language === 'ne' 
                            ? selectedPriceInfo?.quality_ne 
                            : selectedPriceInfo?.quality}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {getLocalizedText('Quantity', 'परिमाण')}
                        </span>
                        <span className="font-medium">{bookingDetails.quantity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {getLocalizedText('Unit Price', 'एकाइ मूल्य')}
                        </span>
                        <span className="font-medium">
                          Rs. {selectedPriceInfo?.discountedPrice}
                        </span>
                      </div>
                    </Card>

{/* Schedule */}
<Card className="p-4 space-y-3">
  <div className="flex justify-between">
    <span className="text-muted-foreground">
      {getLocalizedText('Date', 'मिति')}
    </span>
    <span className="font-medium">
      {typeof bookingDetails.scheduledDate === 'string' 
        ? bookingDetails.scheduledDate 
        : String(bookingDetails.scheduledDate) || 'N/A'}
    </span>
  </div>
  <div className="flex justify-between">
    <span className="text-muted-foreground">
      {getLocalizedText('Time', 'समय')}
    </span>
    <span className="font-medium">
         {formatTimeTo12Hour(bookingDetails.scheduledTime)|| 'N/A'}
    </span>
  </div>
</Card>
                    {/* Address */}
                    {bookingDetails.address && (
                      <Card className="p-4 space-y-3">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                          <div className="flex-1">
                            <p className="text-sm">{formatAddressDisplay(bookingDetails.address)}</p>
                          </div>
                        </div>
                      </Card>
                    )}

                    {/* Notes */}
                    {bookingDetails.notes && (
                      <Card className="p-4 space-y-3">
                        <div className="flex items-start gap-2">
                          <FileText className="h-4 w-4 mt-1 text-muted-foreground" />
                          <div className="flex-1">
                            <p className="text-sm text-muted-foreground">
                              {getLocalizedText('Notes', 'नोट')}
                            </p>
                            <p className="text-sm mt-1">{bookingDetails.notes}</p>
                          </div>
                        </div>
                      </Card>
                    )}

                    {/* Total */}
                    <Card className="p-4 bg-primary/5 border-primary">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-lg">
                          {getLocalizedText('Total', 'जम्मा')}
                        </span>
                        <span className="text-2xl font-bold text-primary">
                          Rs. {totalPrice.toLocaleString()}
                        </span>
                      </div>
                    </Card>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setStep('address')}
                      disabled={isSubmitting}
                    >
                      {getLocalizedText('Back', 'पछाडि')}
                    </Button>
                    <Button 
                      className="flex-1"
                      size="lg"
                      onClick={handleConfirmBooking}
                      disabled={isSubmitting || !canProceed.confirm}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
                          {getLocalizedText('Booking...', 'बुक गर्दै...')}
                        </>
                      ) : (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          {getLocalizedText('Confirm Booking', 'बुकिङ पुष्टि गर्नुहोस्')}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Address Dialog */}
      <AddressDialog
        open={addressDialogOpen}
        onOpenChange={setAddressDialogOpen}
        onSubmit={handleAddressSave}
        initialData={selectedAddressForEdit ? {
          ...selectedAddressForEdit,
          type: 'temporary'
        } : null}
        title={selectedAddressForEdit 
          ? getLocalizedText('Edit Address', 'ठेगाना सम्पादन गर्नुहोस्')
          : getLocalizedText('Add New Address', 'नयाँ ठेगाना थप्नुहोस्')
        }
        description={getLocalizedText(
          'Enter your temporary delivery address details',
          'आफ्नो अस्थायी डेलिभरी ठेगाना विवरणहरू प्रविष्ट गर्नुहोस्'
        )}
        isLoading={isAddressSaving}
        addressType="temporary"
      />
    </>
  );
}