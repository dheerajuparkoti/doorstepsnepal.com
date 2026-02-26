'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Phone, User, Heart, Users, AlertCircle } from 'lucide-react';
import { IntlPhoneInput } from '@/components/ui/intl-phone-input';
import { getEmergencySchema, EmergencyFormValues } from '@/lib/schemas/emergency-schema';

const REFERRAL_OPTIONS = [
  'Friend',
  'Advertisement',
  'Social Media',
  'Self Research',
  'Radio/TV',
  'Newspaper',
];

interface EmergencyStepProps {
  initialData?: any;
  onUpdate: (data: any) => void;
}

export function EmergencyStep({ initialData, onUpdate }: EmergencyStepProps) {
  const { locale, language } = useI18n();
  const [showReferrerName, setShowReferrerName] = useState(
    initialData?.referred_by === 'Friend'
  );
  const getLocalizedText = (en: string, ne: string) => {
    return language === 'ne' ? ne : en;
  };



  const form = useForm<EmergencyFormValues>({
    resolver: zodResolver(getEmergencySchema(getLocalizedText)),
    defaultValues: {
      ec_name: initialData?.ec_name || '',
      ec_relationship: initialData?.ec_relationship || '',
      ec_phone: initialData?.ec_phone || '',
      referred_by: initialData?.referred_by || '',
      referrer_name: initialData?.referrer_name || '',
    },
    mode: 'onChange', 
  });

  const watchReferredBy = form.watch('referred_by');

  useEffect(() => {
    setShowReferrerName(watchReferredBy === 'Friend');
    if (watchReferredBy !== 'Friend') {
      form.setValue('referrer_name', '');

      form.clearErrors('referrer_name');
    }
  }, [watchReferredBy, form]);

  useEffect(() => {
    const subscription = form.watch((value: any) => {
      onUpdate(value);
    });
    return () => subscription.unsubscribe();
  }, [form, onUpdate]);


  const handleNameInput = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
  
    const sanitized = e.target.value.replace(/[^a-zA-Z\s]/g, '');
    field.onChange(sanitized);
  };

  return (
    <Form {...form}>
      <div className="space-y-6">
        {/* Emergency Contact Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            {locale === 'ne' ? 'आपतकालिन सम्पर्क' : 'Emergency Contact'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="ec_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {locale === 'ne' ? 'नाम' : 'Name'} *
                  </FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      onChange={(e) => handleNameInput(e, field)}
                      placeholder={locale === 'ne' ? 'राम बहादुर' : 'Ram Bahadur'}
                      className="transition-all focus:ring-2 focus:ring-primary/20"
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
                  <FormLabel className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {locale === 'ne' ? 'सम्बन्ध' : 'Relationship'} *
                  </FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      onChange={(e) => handleNameInput(e, field)}
                      placeholder={locale === 'ne' ? 'आमा, बुबा, श्रीमान्' : 'Mother, Father, Spouse'}
                      className="transition-all focus:ring-2 focus:ring-primary/20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="ec_phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {locale === 'ne' ? 'फोन नम्बर' : 'Phone Number'} *
                </FormLabel>
                <FormControl>
                  <IntlPhoneInput
                    value={field.value}
                    onChange={field.onChange}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Referral Section */}
        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            {locale === 'ne' ? 'सन्दर्भ स्रोत' : 'Referral Source'}
          </h3>

          <FormField
            control={form.control}
            name="referred_by"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {locale === 'ne' ? 'तपाईंले हाम्रो बारे कसरी थाहा पाउनुभयो?' : 'How did you hear about us?'} *
                </FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="transition-all focus:ring-2 focus:ring-primary/20">
                      <SelectValue placeholder={locale === 'ne' ? 'छान्नुहोस्' : 'Select an option'} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {REFERRAL_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {showReferrerName && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <FormField
                control={form.control}
                name="referrer_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {locale === 'ne' ? 'साथीको नाम' : "Friend's Name"} *
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        value={field.value || ''}
                        onChange={(e) => handleNameInput(e, field)}
                        placeholder={locale === 'ne' ? 'साथीको नाम' : "Enter friend's name"}
                        className="transition-all focus:ring-2 focus:ring-primary/20"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
          )}
        </div>

        {/* Important Note */}
        <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/30 rounded-xl">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
          <p className="text-sm text-amber-800 dark:text-amber-300">
            {locale === 'ne'
              ? 'आपतकालिन सम्पर्क जानकारी गोप्य राखिनेछ र आवश्यक परेको बेला मात्र प्रयोग गरिनेछ।'
              : 'Emergency contact information is kept confidential and used only when necessary.'}
          </p>
        </div>
      </div>
    </Form>
  );
}