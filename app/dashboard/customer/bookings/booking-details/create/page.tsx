'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { 
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Package,
  DollarSign,
  FileText,
  User,
  Plus,
  Minus,
  CheckCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { useI18n } from '@/lib/i18n/context';
import { useOrderStore } from '@/stores/order-store';
import { createOrderSchema } from '@/lib/data/order';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { toast } from '@/components/ui/use-toast';

const priceUnits = [
  { id: 1, name: 'Square Feet', nameNp: 'वर्ग फिट' },
  { id: 2, name: 'Square Meter', nameNp: 'वर्ग मिटर' },
  { id: 3, name: 'Piece', nameNp: 'टुक्रा' },
  { id: 4, name: 'Hour', nameNp: 'घण्टा' },
  { id: 5, name: 'Day', nameNp: 'दिन' },
];

const qualityTypes = [
  { id: 1, name: 'Standard', nameNp: 'मानक' },
  { id: 2, name: 'Premium', nameNp: 'प्रिमियम' },
  { id: 3, name: 'Luxury', nameNp: 'लक्जरी' },
];

// Mock data - in real app, fetch from API
const services = [
  { id: 1, name_en: 'Plumbing', name_np: 'प्लम्बिङ', base_price: 500 },
  { id: 2, name_en: 'Cleaning', name_np: 'सफाई', base_price: 800 },
  { id: 3, name_en: 'Electrical', name_np: 'बिजुली', base_price: 650 },
  { id: 4, name_en: 'Painting', name_np: 'रङ्गाई', base_price: 1200 },
  { id: 5, name_en: 'Carpentry', name_np: 'बढई काम', base_price: 900 },
];

type FormData = z.infer<typeof createOrderSchema>;

export default function CreateOrderPage() {
  const { t, locale } = useI18n();
  const router = useRouter();
  const { createOrder, isLoading } = useOrderStore();

  const [selectedService, setSelectedService] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  const form = useForm<FormData>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      professional_service_id: 1,
      customer_id: 1, // Mock customer ID
      scheduled_date: new Date().toISOString(),
      scheduled_time: new Date().toISOString(),
      order_notes: '',
      price_unit_id: 1,
      quality_type_id: 1,
      quantity: 1,
      total_price: 0,
      address: {
        type: 'temporary',
        province: '',
        district: '',
        municipality: '',
        ward_no: '',
        street_address: '',
      },
    },
  });

  const calculateTotal = (serviceId: number, qty: number, qualityId: number) => {
    const service = services.find(s => s.id === serviceId);
    if (!service) return 0;
    
    const qualityMultiplier = qualityId === 2 ? 1.5 : qualityId === 3 ? 2 : 1;
    return service.base_price * qty * qualityMultiplier;
  };

  const handleServiceChange = (serviceId: number) => {
    const service = services.find(s => s.id === serviceId);
    setSelectedService(service);
    
    const currentQty = form.getValues('quantity');
    const currentQuality = form.getValues('quality_type_id');
    const total = calculateTotal(serviceId, currentQty, currentQuality);
    
    setTotalPrice(total);
    form.setValue('total_price', total);
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = Math.max(1, quantity + change);
    setQuantity(newQuantity);
    form.setValue('quantity', newQuantity);
    
    const serviceId = form.getValues('professional_service_id');
    const qualityId = form.getValues('quality_type_id');
    const total = calculateTotal(serviceId, newQuantity, qualityId);
    
    setTotalPrice(total);
    form.setValue('total_price', total);
  };

  const handleQualityChange = (qualityId: number) => {
    form.setValue('quality_type_id', qualityId);
    
    const serviceId = form.getValues('professional_service_id');
    const total = calculateTotal(serviceId, quantity, qualityId);
    
    setTotalPrice(total);
    form.setValue('total_price', total);
  };

  const onSubmit = async (data: FormData) => {
    try {
    //   await createOrder(data);
      toast({
        title: 'Order Created',
        description: 'Your order has been successfully created.',
      });
      router.push('/orders');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create order. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push('/orders')}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Order</h1>
          <p className="text-muted-foreground">
            Fill in the details to book a service
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Service Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Service Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Service Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="professional_service_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Service</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(parseInt(value));
                            handleServiceChange(parseInt(value));
                          }}
                          defaultValue={field.value.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a service" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {services.map((service) => (
                              <SelectItem key={service.id} value={service.id.toString()}>
                                {locale === 'ne' ? service.name_np : service.name_en}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {selectedService && (
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Base Price:</span>
                        <span className="font-bold">Rs. {selectedService.base_price}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Select quantity and quality type to calculate total price
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Quantity */}
                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity</FormLabel>
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => handleQuantityChange(-1)}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={(e) => {
                                  const value = parseInt(e.target.value) || 1;
                                  setQuantity(value);
                                  field.onChange(value);
                                  handleQuantityChange(value - quantity);
                                }}
                                className="text-center"
                              />
                            </FormControl>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => handleQuantityChange(1)}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Quality Type */}
                    <FormField
                      control={form.control}
                      name="quality_type_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quality Type</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(parseInt(value));
                              handleQualityChange(parseInt(value));
                            }}
                            defaultValue={field.value.toString()}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select quality type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {qualityTypes.map((type) => (
                                <SelectItem key={type.id} value={type.id.toString()}>
                                  {locale === 'ne' ? type.nameNp : type.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Price Unit */}
                    <FormField
                      control={form.control}
                      name="price_unit_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price Unit</FormLabel>
                          <Select
                            onValueChange={(value) => field.onChange(parseInt(value))}
                            defaultValue={field.value.toString()}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select price unit" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {priceUnits.map((unit) => (
                                <SelectItem key={unit.id} value={unit.id.toString()}>
                                  {locale === 'ne' ? unit.nameNp : unit.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Schedule */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="scheduled_date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className="w-full justify-start text-left font-normal"
                                >
                                  <Calendar className="mr-2 h-4 w-4" />
                                  {field.value ? (
                                    format(new Date(field.value), 'PPP')
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <CalendarComponent
                                mode="single"
                                selected={new Date(field.value)}
                                onSelect={(date) => {
                                  if (date) {
                                    field.onChange(date.toISOString());
                                  }
                                }}
                                disabled={(date) => date < new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="scheduled_time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Time</FormLabel>
                          <FormControl>
                            <Input
                              type="time"
                              value={field.value ? format(new Date(field.value), 'HH:mm') : ''}
                              onChange={(e) => {
                                const time = e.target.value;
                                const date = new Date(form.getValues('scheduled_date'));
                                const [hours, minutes] = time.split(':');
                                date.setHours(parseInt(hours), parseInt(minutes));
                                field.onChange(date.toISOString());
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Service Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="address.type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select address type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="temporary">Temporary</SelectItem>
                            <SelectItem value="permanent">Permanent</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="address.province"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Province</FormLabel>
                          <FormControl>
                            <Input placeholder="Province" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address.district"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>District</FormLabel>
                          <FormControl>
                            <Input placeholder="District" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address.municipality"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Municipality</FormLabel>
                          <FormControl>
                            <Input placeholder="Municipality" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address.ward_no"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ward Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Ward No" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="address.street_address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="House number, street name, landmark..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Notes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Additional Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="order_notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Order Notes (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Any special instructions or requirements..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Provide any additional information for the professional
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Summary & Actions */}
            <div className="space-y-6">
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedService && (
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Service:</span>
                        <span className="font-medium">
                          {locale === 'ne' ? selectedService.name_np : selectedService.name_en}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Base Price:</span>
                        <span>Rs. {selectedService.base_price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Quantity:</span>
                        <span>{quantity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Quality Type:</span>
                        <span>
                          {qualityTypes.find(q => q.id === form.watch('quality_type_id'))?.name}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total Price:</span>
                        <span className="text-primary">Rs. {totalPrice}</span>
                      </div>
                    </div>
                  )}

                  <FormField
                    control={form.control}
                    name="total_price"
                    render={({ field }) => (
                      <Input type="hidden" {...field} value={totalPrice} />
                    )}
                  />

                  <div className="space-y-3 pt-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4" />
                      <span>Secure payment processing</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="w-4 h-4" />
                      <span>Verified professionals only</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Flexible scheduling</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Creating Order...' : 'Confirm & Place Order'}
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => router.back()}
                    >
                      Cancel
                    </Button>

                    <div className="text-center text-sm text-muted-foreground">
                      By placing this order, you agree to our{' '}
                      <a href="/terms" className="text-primary hover:underline">
                        Terms of Service
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Service Guarantee */}
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <h4 className="font-semibold mb-3">Service Guarantee</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      <span>100% satisfaction guarantee</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      <span>Professional background verified</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      <span>On-time service or money back</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      <span>Secure payment protection</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}