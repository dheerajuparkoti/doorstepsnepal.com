'use client';

import { useState, useEffect, useMemo } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { useProfessionalStore } from '@/stores/professional-store';
import { PaymentMethod, PaymentInfo, EmergencyContact } from '@/lib/data/professional';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import {
  Edit,
  Save,
  X,
  RefreshCw,
  AlertCircle,
  CreditCard,
  Building,
  User,
  Phone,
  MapPin,
  Shield,
  Users,
  Wallet,
  Banknote,
  Smartphone,
  PiggyBankIcon,
  AlertTriangle,
  PiggyBank,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

// Mock professional ID get from auth or params
const MOCK_PROFESSIONAL_ID = 24;

// Bank data for Nepal
const BANKS_NEPAL = [
  'Nepal Rastra Bank',
  'Nepal Bank Limited',
  'Rastriya Banijya Bank',
  'Agricultural Development Bank',
  'Nabil Bank',
  'NIC Asia Bank',
  'Global IME Bank',
  'Prabhu Bank',
  'Everest Bank',
  'Himalayan Bank',
  'Kumari Bank',
  'Laxmi Bank',
  'Siddhartha Bank',
  'Sunrise Bank',
  'Prime Commercial Bank',
  'NMB Bank',
  'Machhapuchchhre Bank',
  'Sanima Bank',
  'Citizens Bank',
  'Standard Chartered Bank Nepal',
];

// Form validation schema
const paymentFormSchema = z.object({
  payment_method: z.enum(['cash', 'esewa', 'khalti', 'imepay', 'bank_transfer']),
  phone_number: z.string().optional(),
  bank_account_number: z.string().optional(),
  bank_branch_name: z.string().optional(),
  bank_name: z.string().optional(),
  bank_account_holder_name: z.string().optional(),
  ec_name: z.string().min(1, 'Emergency contact name is required'),
  ec_relationship: z.string().min(1, 'Relationship is required'),
  ec_phone: z.string().min(1, 'Emergency phone is required'),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

export default function ProfessionalPaymentsPage() {
  const { locale } = useI18n();
  const {
    profile,
    isLoading,
    error,
    isUpdating,
    fetchProfile,
    patchProfile,
    clearError,
  } = useProfessionalStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [showBankSearch, setShowBankSearch] = useState(false);
  const [bankSearchQuery, setBankSearchQuery] = useState('');

  // Initialize form
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      payment_method: 'cash',
      phone_number: '',
      bank_account_number: '',
      bank_branch_name: '',
      bank_name: '',
      bank_account_holder_name: '',
      ec_name: '',
      ec_relationship: '',
      ec_phone: '',
    },
  });

  // Watch payment method to conditionally show fields
  const paymentMethod = form.watch('payment_method');

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    if (error) {
      toast({
        title: locale === 'ne' ? 'त्रुटि' : 'Error',
        description: error,
        variant: 'destructive',
      });
      clearError();
    }
  }, [error]);

  useEffect(() => {
    if (profile && !isEditing) {
      // Populate form with profile data
      form.reset({
        payment_method: profile.payment_method || 'cash',
        phone_number: profile.phone_number || '',
        bank_account_number: profile.bank_account_number || '',
        bank_branch_name: profile.bank_branch_name || '',
        bank_name: profile.bank_name || '',
        bank_account_holder_name: profile.bank_account_holder_name || '',
        ec_name: profile.ec_name || '',
        ec_relationship: profile.ec_relationship || '',
        ec_phone: profile.ec_phone || '',
      });
    }
  }, [profile, isEditing]);

  const loadProfile = async () => {
    try {
      await fetchProfile(MOCK_PROFESSIONAL_ID);
    } catch (err) {
      // Error handled by store
    }
  };

  const handleSubmit = async (data: PaymentFormValues) => {
    try {
      // Validate digital payment methods require phone number
      if (
        (data.payment_method === 'esewa' || 
         data.payment_method === 'khalti' || 
         data.payment_method === 'imepay') &&
        !data.phone_number?.trim()
      ) {
        toast({
          title: locale === 'ne' ? 'चेतावनी' : 'Warning',
          description: locale === 'ne'
            ? 'कृपया फोन नम्बर प्रदान गर्नुहोस्'
            : 'Please provide phone number',
          variant: 'destructive',
        });
        return;
      }

// Convert payment_method string to PaymentMethod enum
    const paymentMethodMap: Record<string, PaymentMethod> = {
      'cash': PaymentMethod.CASH,
      'esewa': PaymentMethod.ESEWA,
      'khalti': PaymentMethod.KHALTI,
      'imepay': PaymentMethod.IMEPAY,
      'bank_transfer': PaymentMethod.BANK_TRANSFER,
    };
      
 const patchData = {
      ...data,
      payment_method: paymentMethodMap[data.payment_method],
    };

      await patchProfile(MOCK_PROFESSIONAL_ID, patchData);
      
      toast({
        title: locale === 'ne' ? 'सफलता' : 'Success',
        description: locale === 'ne'
          ? 'भुक्तानी जानकारी सफलतापूर्वक अपडेट गरियो'
          : 'Payment information updated successfully',
      });
      
      setIsEditing(false);
    } catch (err) {
      // Error handled by store
    }
  };

  const getPaymentMethodDisplay = (method: PaymentMethod) => {
    const methods = {
      [PaymentMethod.CASH]: { 
        label: locale === 'ne' ? 'नगद' : 'Cash', 
        icon: Banknote,
        color: 'bg-green-100 text-green-800' 
      },
      [PaymentMethod.ESEWA]: { 
        label: 'eSewa', 
        icon: Smartphone,
        color: 'bg-purple-100 text-purple-800' 
      },
      [PaymentMethod.KHALTI]: { 
        label: 'Khalti', 
        icon: Smartphone,
        color: 'bg-red-100 text-red-800' 
      },
      [PaymentMethod.IMEPAY]: { 
        label: 'IME Pay', 
        icon: Smartphone,
        color: 'bg-blue-100 text-blue-800' 
      },
      [PaymentMethod.BANK_TRANSFER]: { 
        label: locale === 'ne' ? 'बैंक हस्तान्तरण' : 'Bank Transfer', 
        icon: PiggyBank,
        color: 'bg-indigo-100 text-indigo-800' 
      },
    };
    
    return methods[method] || methods[PaymentMethod.CASH];
  };

  const filteredBanks = useMemo(() => {
    if (!bankSearchQuery.trim()) return BANKS_NEPAL;
    return BANKS_NEPAL.filter(bank =>
      bank.toLowerCase().includes(bankSearchQuery.toLowerCase())
    );
  }, [bankSearchQuery]);

  if (isLoading && !profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <Skeleton className="h-10 w-64" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {locale === 'ne' ? 'भुक्तानी र सम्पर्क' : 'Payments & Contacts'}
            </h1>
            <p className="text-muted-foreground">
              {locale === 'ne'
                ? 'आफ्नो भुक्तानी विधि र आपतकालिन सम्पर्क जानकारी व्यवस्थापन गर्नुहोस्'
                : 'Manage your payment methods and emergency contact information'}
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={loadProfile}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {locale === 'ne' ? 'ताजा पार्नुहोस्' : 'Refresh'}
          </Button>
        </div>
      </div>

      {!isEditing ? (
        // READ-ONLY VIEW
        <div className="space-y-6">
          {/* Payment Information Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle>
                      {locale === 'ne' ? 'भुक्तानी जानकारी' : 'Payment Information'}
                    </CardTitle>
                    <CardDescription>
                      {locale === 'ne'
                        ? 'तपाईंको भुक्तानी प्राप्त गर्ने विधि'
                        : 'Your preferred payment method for receiving payments'}
                    </CardDescription>
                  </div>
                </div>
                <Badge className={getPaymentMethodDisplay(profile?.payment_method || PaymentMethod.CASH).color}>
                  {getPaymentMethodDisplay(profile?.payment_method || PaymentMethod.CASH).label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Payment Method Details */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Wallet className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">
                        {locale === 'ne' ? 'भुक्तानी विधि' : 'Payment Method'}
                      </p>
                      <p className="text-lg font-semibold">
                        {getPaymentMethodDisplay(profile?.payment_method || PaymentMethod.CASH).label}
                      </p>
                    </div>
                  </div>

                  {/* Digital Payment Details */}
                  {(profile?.payment_method === PaymentMethod.ESEWA ||
                    profile?.payment_method === PaymentMethod.KHALTI ||
                    profile?.payment_method === PaymentMethod.IMEPAY) && (
                    <div className="space-y-3">
                      <Separator />
                      <div className="flex items-center gap-3">
                        <Smartphone className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">
                            {locale === 'ne' ? 'फोन नम्बर' : 'Phone Number'}
                          </p>
                          <p className="text-lg font-semibold">
                            {profile?.phone_number || 'Not provided'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Bank Transfer Details */}
                  {profile?.payment_method === PaymentMethod.BANK_TRANSFER && (
                    <div className="space-y-3">
                      <Separator />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Building className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium">
                              {locale === 'ne' ? 'बैंक' : 'Bank'}
                            </span>
                          </div>
                          <p className="font-semibold">
                            {profile?.bank_name || 'Not provided'}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium">
                              {locale === 'ne' ? 'खाता धनी' : 'Account Holder'}
                            </span>
                          </div>
                          <p className="font-semibold">
                            {profile?.bank_account_holder_name || 'Not provided'}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium">
                              {locale === 'ne' ? 'खाता नम्बर' : 'Account Number'}
                            </span>
                          </div>
                          <p className="font-semibold">
                            {profile?.bank_account_number || 'Not provided'}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium">
                              {locale === 'ne' ? 'शाखा' : 'Branch'}
                            </span>
                          </div>
                          <p className="font-semibold">
                            {profile?.bank_branch_name || 'Not provided'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Payment Method Icon */}
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                      {(() => {
                        const Icon = getPaymentMethodDisplay(profile?.payment_method || PaymentMethod.CASH).icon;
                        return <Icon className="w-16 h-16 text-blue-600" />;
                      })()}
                    </div>
                    <div className="absolute -top-2 -right-2 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Shield className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-50 rounded-lg">
                  <Users className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <CardTitle>
                    {locale === 'ne' ? 'आपतकालिन सम्पर्क' : 'Emergency Contact'}
                  </CardTitle>
                  <CardDescription>
                    {locale === 'ne'
                      ? 'आपतकालिन अवस्थामा सम्पर्क गर्ने व्यक्ति'
                      : 'Person to contact in case of emergency'}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4 p-4 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="text-sm font-medium text-red-800">
                        {locale === 'ne' ? 'नाम' : 'Name'}
                      </p>
                      <p className="text-lg font-semibold text-red-900">
                        {profile?.ec_name || 'Not provided'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4 p-4 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="text-sm font-medium text-orange-800">
                        {locale === 'ne' ? 'सम्बन्ध' : 'Relationship'}
                      </p>
                      <p className="text-lg font-semibold text-orange-900">
                        {profile?.ec_relationship || 'Not provided'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4 p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-green-800">
                        {locale === 'ne' ? 'फोन नम्बर' : 'Phone Number'}
                      </p>
                      <p className="text-lg font-semibold text-green-900">
                        {profile?.ec_phone || 'Not provided'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Edit Button */}
          <div className="flex justify-end">
            <Button
              onClick={() => setIsEditing(true)}
              className="gap-2"
            >
              <Edit className="w-4 h-4" />
              {locale === 'ne' ? 'सम्पादन गर्नुहोस्' : 'Edit Information'}
            </Button>
          </div>
        </div>
      ) : (
        // EDITABLE FORM
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <CreditCard className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle>
                        {locale === 'ne' ? 'भुक्तानी जानकारी सम्पादन' : 'Edit Payment Information'}
                      </CardTitle>
                      <CardDescription>
                        {locale === 'ne'
                          ? 'आफ्नो भुक्तानी विधि र विवरण अपडेट गर्नुहोस्'
                          : 'Update your payment method and details'}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Payment Method Selection */}
                <FormField
                  control={form.control}
                  name="payment_method"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {locale === 'ne' ? 'भुक्तानी विधि' : 'Payment Method'} *
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={locale === 'ne' ? 'भुक्तानी विधि छान्नुहोस्' : 'Select payment method'} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="cash">
                            {locale === 'ne' ? 'नगद' : 'Cash'}
                          </SelectItem>
                          <SelectItem value="esewa">eSewa</SelectItem>
                          <SelectItem value="khalti">Khalti</SelectItem>
                          <SelectItem value="imepay">IME Pay</SelectItem>
                          <SelectItem value="bank_transfer">
                            {locale === 'ne' ? 'बैंक हस्तान्तरण' : 'Bank Transfer'}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        {locale === 'ne'
                          ? 'तपाईंले भुक्तानी प्राप्त गर्न चाहनुभएको विधि'
                          : 'How you want to receive payments'}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Digital Payment Fields */}
                {(paymentMethod === 'esewa' || paymentMethod === 'khalti' || paymentMethod === 'imepay') && (
                  <FormField
                    control={form.control}
                    name="phone_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {locale === 'ne' ? 'फोन नम्बर' : 'Phone Number'} *
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder={locale === 'ne' ? '९८XXXXXXXX' : '98XXXXXXXX'}
                            type="tel"
                          />
                        </FormControl>
                        <FormDescription>
                          {locale === 'ne'
                            ? 'तपाईंको भुक्तानी खातासँग जोडिएको फोन नम्बर'
                            : 'Phone number linked to your payment account'}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Bank Transfer Fields */}
                {paymentMethod === 'bank_transfer' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="bank_account_holder_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {locale === 'ne' ? 'खाता धनीको नाम' : 'Account Holder Name'} *
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder={locale === 'ne' ? 'जन डो' : 'John Doe'}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bank_account_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {locale === 'ne' ? 'खाता नम्बर' : 'Account Number'} *
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="1234567890123456"
                              type="text"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bank_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {locale === 'ne' ? 'बैंकको नाम' : 'Bank Name'} *
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                {...field}
                                readOnly
                                placeholder={locale === 'ne' ? 'बैंक छान्नुहोस्' : 'Select bank'}
                                onClick={() => setShowBankSearch(true)}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1/2 transform -translate-y-1/2"
                                onClick={() => setShowBankSearch(true)}
                              >
                                <AlertCircle className="w-4 h-4" />
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bank_branch_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {locale === 'ne' ? 'शाखा नाम' : 'Branch Name'}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder={locale === 'ne' ? 'काठमाडौं शाखा' : 'Kathmandu Branch'}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Emergency Contact Form */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-50 rounded-lg">
                    <Users className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <CardTitle>
                      {locale === 'ne' ? 'आपतकालिन सम्पर्क' : 'Emergency Contact'}
                    </CardTitle>
                    <CardDescription>
                      {locale === 'ne'
                        ? 'आपतकालिन अवस्थामा सम्पर्क गर्ने व्यक्ति'
                        : 'Person to contact in case of emergency'}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="ec_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {locale === 'ne' ? 'नाम' : 'Name'} *
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder={locale === 'ne' ? 'जन डो' : 'John Doe'}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ec_relationship"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {locale === 'ne' ? 'सम्बन्ध' : 'Relationship'} *
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder={locale === 'ne' ? 'आमा, बुबा, श्रीमान्' : 'Mother, Father, Spouse'}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ec_phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {locale === 'ne' ? 'फोन नम्बर' : 'Phone Number'} *
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="98XXXXXXXX"
                            type="tel"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Important Note */}
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-800">
                        {locale === 'ne' ? 'महत्त्वपूर्ण नोट' : 'Important Note'}
                      </p>
                      <p className="text-sm text-yellow-700 mt-1">
                        {locale === 'ne'
                          ? 'आपतकालिन सम्पर्क जानकारी केवल आपतकालिन अवस्थामा मात्र प्रयोग गरिनेछ। यो जानकारी सुरक्षित राखिनेछ।'
                          : 'Emergency contact information will only be used in case of emergencies. This information will be kept secure.'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditing(false)}
                disabled={isUpdating}
              >
                <X className="w-4 h-4 mr-2" />
                {locale === 'ne' ? 'रद्द गर्नुहोस्' : 'Cancel'}
              </Button>
              <Button
                type="submit"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    {locale === 'ne' ? 'बचत हुदैछ...' : 'Saving...'}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {locale === 'ne' ? 'परिवर्तनहरू बचत गर्नुहोस्' : 'Save Changes'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      )}

      {/* Bank Search Dialog */}
      {showBankSearch && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {locale === 'ne' ? 'बैंक खोज्नुहोस्' : 'Search Bank'}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setShowBankSearch(false);
                    setBankSearchQuery('');
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  placeholder={locale === 'ne' ? 'बैंकको नाम खोज्नुहोस्...' : 'Search bank name...'}
                  value={bankSearchQuery}
                  onChange={(e) => setBankSearchQuery(e.target.value)}
                  className="w-full"
                />
                <div className="border rounded-lg overflow-hidden max-h-[50vh] overflow-y-auto">
                  {filteredBanks.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                      {locale === 'ne' ? 'कुनै बैंक फेला परेन' : 'No banks found'}
                    </div>
                  ) : (
                    <div className="divide-y">
                      {filteredBanks.map((bank) => (
                        <button
                          key={bank}
                          type="button"
                          className="w-full p-4 text-left hover:bg-gray-50 focus:bg-gray-50 transition-colors"
                          onClick={() => {
                            form.setValue('bank_name', bank);
                            setShowBankSearch(false);
                            setBankSearchQuery('');
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{bank}</span>
                            {form.getValues('bank_name') === bank && (
                              <Badge variant="outline" className="bg-green-50 text-green-700">
                                {locale === 'ne' ? 'चयन गरियो' : 'Selected'}
                              </Badge>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}