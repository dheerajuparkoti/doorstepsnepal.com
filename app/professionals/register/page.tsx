// app/professional/register/page.tsx - FOR FUTURE USE
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n/context';
import { useProfessionalStore } from '@/stores/professional-store';
import { PaymentMethod } from '@/lib/data/professional';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
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

// Form validation schema for registration
const registrationSchema = z.object({
  user_id: z.number().min(1, 'User ID is required'),
  skill: z.string().min(1, 'Skill is required'),
  payment_method: z.enum(['cash', 'esewa', 'khalti', 'imepay', 'bank_transfer']),
  bank_account_number: z.string().optional(),
  bank_branch_name: z.string().optional(),
  bank_name: z.string().optional(),
  bank_account_holder_name: z.string().optional(),
  phone_number: z.string().optional(),
  ec_name: z.string().min(1, 'Emergency contact name is required'),
  ec_relationship: z.string().min(1, 'Relationship is required'),
  ec_phone: z.string().min(1, 'Emergency phone is required'),
  experience: z.number().min(0, 'Experience must be 0 or more'),
});

type RegistrationFormValues = z.infer<typeof registrationSchema>;

export default function ProfessionalRegistrationPage() {
  const { locale } = useI18n();
  const router = useRouter();
  const { registerProfessional, isRegistering, error, clearError } = useProfessionalStore();
  
  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      user_id: 0, // This should come from auth context
      skill: '',
      payment_method: 'cash',
      bank_account_number: '',
      bank_branch_name: '',
      bank_name: '',
      bank_account_holder_name: '',
      phone_number: '',
      ec_name: '',
      ec_relationship: '',
      ec_phone: '',
      experience: 0,
    },
  });

  const paymentMethod = form.watch('payment_method');

  const handleSubmit = async (data: RegistrationFormValues) => {
    try {
      // Validate digital payments require phone number
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
            : 'Please provide phone number for digital payment',
          variant: 'destructive',
        });
        return;
      }

      // Prepare addresses array (simplified for example)
      const addresses = [{
        type: 'temporary' as const,
        province: '',
        district: '',
        municipality: '',
        ward_no: '',
        street_address: '',
      }];

      const registrationData = {
        ...data,
        addresses,
      };

    //   await registerProfessional(registrationData);
      
      toast({
        title: locale === 'ne' ? 'सफलता' : 'Success',
        description: locale === 'ne'
          ? 'पेशेवर दर्ता सफल भयो'
          : 'Professional registration successful',
      });
      
      // Redirect to dashboard or profile page
      router.push('/dashboard');
      
    } catch (err) {
      // Error handled by store
      toast({
        title: locale === 'ne' ? 'त्रुटि' : 'Error',
        description: error || 'Registration failed',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>
            {locale === 'ne' ? 'पेशेवर दर्ता' : 'Professional Registration'}
          </CardTitle>
          <CardDescription>
            {locale === 'ne'
              ? 'Doorstep मा पेशेवरको रूपमा दर्ता गर्नुहोस्'
              : 'Register as a professional on Doorstep'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  {locale === 'ne' ? 'मूल जानकारी' : 'Basic Information'}
                </h3>
                
                <FormField
                  control={form.control}
                  name="skill"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {locale === 'ne' ? 'कौशल' : 'Skill'} *
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={locale === 'ne' ? 'उदाहरण: इलेक्ट्रिसियन, प्लम्बर' : 'e.g., Electrician, Plumber'} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {locale === 'ne' ? 'अनुभव (वर्षमा)' : 'Experience (in years)'} *
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="number" 
                          min="0"
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Payment Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  {locale === 'ne' ? 'भुक्तानी जानकारी' : 'Payment Information'}
                </h3>
                
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
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Conditionally show fields based on payment method */}
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
                          <Input {...field} placeholder="98XXXXXXXX" type="tel" />
                        </FormControl>
                        <FormDescription>
                          {locale === 'ne'
                            ? 'तपाईंको डिजिटल भुक्तानी खातासँग जोडिएको फोन नम्बर'
                            : 'Phone number linked to your digital payment account'}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

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
                            <Input {...field} placeholder={locale === 'ne' ? 'जन डो' : 'John Doe'} />
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
                            <Input {...field} placeholder="1234567890123456" />
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
                            <Input {...field} placeholder={locale === 'ne' ? 'बैंकको नाम' : 'Bank name'} />
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
                            <Input {...field} placeholder={locale === 'ne' ? 'काठमाडौं शाखा' : 'Kathmandu Branch'} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>

              {/* Emergency Contact */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  {locale === 'ne' ? 'आपतकालिन सम्पर्क' : 'Emergency Contact'}
                </h3>
                
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
                          <Input {...field} placeholder={locale === 'ne' ? 'जन डो' : 'John Doe'} />
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
                          <Input {...field} placeholder={locale === 'ne' ? 'आमा, बुबा' : 'Mother, Father'} />
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
                          <Input {...field} placeholder="98XXXXXXXX" type="tel" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isRegistering}
                className="w-full"
              >
                {isRegistering ? (
                  <>
                    {locale === 'ne' ? 'दर्ता हुदैछ...' : 'Registering...'}
                  </>
                ) : (
                  locale === 'ne' ? 'दर्ता गर्नुहोस्' : 'Register Now'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}