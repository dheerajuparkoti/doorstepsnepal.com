// components/professional/book-now-button.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n/context';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MapPin, User } from 'lucide-react';

interface BookNowButtonProps {
  professional: any;
  className?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  variant?: 'default' | 'outline' | 'ghost';
}

export function BookNowButton({ 
  professional, 
  className = "flex-1", 
  size = "sm",
  variant = "default"
}: BookNowButtonProps) {
  const { language, t } = useI18n();
  const [showBookingSheet, setShowBookingSheet] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    priceItem: null as any,
    quantity: 1,
    scheduledDate: new Date(),
    scheduledTime: new Date(),
    address: null as any,
    notes: '',
  });

  const getLocalizedText = (en: string, np: string) => {
    return language === 'ne' ? np : en;
  };

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

  const handleBookNow = () => {
    if (professional.all_prices?.length === 1) {
      setBookingDetails(prev => ({
        ...prev,
        priceItem: professional.all_prices[0]
      }));
    }
    setShowBookingSheet(true);
  };

  return (
    <>
      <Button 
        size={size}
        variant={variant}
        className={className}
        onClick={handleBookNow}
      >
        {getLocalizedText('Book Now', 'बुक गर्नुहोस्')}
      </Button>

      {/* Booking Sheet */}
      <Sheet open={showBookingSheet} onOpenChange={setShowBookingSheet}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>
              {getLocalizedText('Book Service', 'सेवा बुक गर्नुहोस्')}
            </SheetTitle>
            <SheetDescription>
              {getLocalizedText('Book with', 'संग बुक गर्नुहोस्')} {professional.full_name}
            </SheetDescription>
          </SheetHeader>
          
          <ScrollArea className="h-full pr-6">
            <div className="space-y-6 py-4">
              {/* Service Info */}
              <div className="space-y-2">
                <h3 className="font-semibold">{professional.service_name}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>{professional.full_name}</span>
                </div>
              </div>

              {/* Price Selection */}
              {professional.all_prices?.length > 0 && (
                <div className="space-y-2">
                  <Label>{getLocalizedText('Select Price Option', 'मूल्य विकल्प छान्नुहोस्')}</Label>
                  <Select 
                    value={bookingDetails.priceItem?.id}
                    onValueChange={(value) => {
                      const priceItem = professional.all_prices.find(
                        (p: any) => p.id === parseInt(value)
                      );
                      setBookingDetails(prev => ({ ...prev, priceItem }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={getLocalizedText('Select price', 'मूल्य छान्नुहोस्')} />
                    </SelectTrigger>
                    <SelectContent>
                      {professional.all_prices.map((price: any) => {
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
              )}

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
    </>
  );
}