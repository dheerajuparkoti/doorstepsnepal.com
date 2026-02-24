// components/address-dialog.tsx (updated version)
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, Loader2, Home, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
  TEMPORARY_PROVINCES,
  getDistrictsByProvince, 
  getMunicipalitiesByDistrict,
  WARDS,
  AddressType 
} from '@/lib/data/address';

const addressFormSchema = z.object({
  type: z.enum(['permanent', 'temporary']),
  province: z.string().min(1, 'Province is required'),
  district: z.string().min(1, 'District is required'),
  municipality: z.string().min(1, 'Municipality is required'),
  ward_no: z.string().min(1, 'Ward number is required'),
  street_address: z.string().min(1, 'Street address is required'),
  // Optional fields for better UX
  label: z.string().optional(),
  is_default: z.boolean().optional(),
});

type AddressFormValues = z.infer<typeof addressFormSchema>;

interface AddressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AddressFormValues) => Promise<void>;
  initialData?: AddressFormValues | null;
  title: string;
  description?: string;
  isLoading?: boolean;
  addressType: AddressType;
  showLabelField?: boolean;
}

export function AddressDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  title,
  description,
  isLoading = false,
  addressType,
  showLabelField = true,
}: AddressDialogProps) {
  const { locale } = useI18n();

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: initialData || {
      type: addressType,
      province: '',
      district: '',
      municipality: '',
      ward_no: '',
      street_address: '',
      label: '',
      is_default: false,
    },
  });

  const selectedProvince = form.watch('province');
  const selectedDistrict = form.watch('district');

  // Get districts based on selected province
  const availableDistricts = useMemo(() => {
    if (!selectedProvince) return [];
    return getDistrictsByProvince(selectedProvince);
  }, [selectedProvince]);

  // Get municipalities based on selected district
  const availableMunicipalities = useMemo(() => {
    if (!selectedDistrict) return [];
    return getMunicipalitiesByDistrict(selectedDistrict);
  }, [selectedDistrict]);

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset(initialData);
      } else {
        form.reset({
          type: addressType,
          province: '',
          district: '',
          municipality: '',
          ward_no: '',
          street_address: '',
          label: '',
          is_default: false,
        });
      }
    }
  }, [open, initialData, addressType, form]);

  const handleSubmit = async (data: AddressFormValues) => {
    await onSubmit(data);
  };

  // Only show provinces available for temporary addresses
  const availableProvinces = TEMPORARY_PROVINCES;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {title}
          </DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Address Type (Hidden - set by parent) */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <input type="hidden" {...field} value="temporary" />
              )}
            />

            {/* Address Label (Optional) */}
            {showLabelField && (
              <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {locale === 'ne' ? 'ठेगानाको नाम' : 'Address Label'} 
                      <span className="text-muted-foreground text-sm ml-1">
                        ({locale === 'ne' ? 'वैकल्पिक' : 'optional'})
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={locale === 'ne' 
                          ? 'जस्तै: घर, कार्यालय, आदि' 
                          : 'E.g., Home, Office, etc.'
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {locale === 'ne'
                        ? 'यस ठेगानालाई सजिलै चिन्न नाम दिनुहोस्'
                        : 'Give this address a name to easily identify it'}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Province Selection */}
            <FormField
              control={form.control}
              name="province"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {locale === 'ne' ? 'प्रदेश' : 'Province'} *
                  </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      form.setValue('district', '');
                      form.setValue('municipality', '');
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={locale === 'ne' ? 'प्रदेश छान्नुहोस्' : 'Select province'} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableProvinces.map((province) => (
                        <SelectItem key={province} value={province}>
                          {province}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription className="flex items-center gap-1">
                    <Badge variant="outline" className="text-xs">
                      {locale === 'ne' ? 'अस्थायी ठेगाना' : 'Temporary Address'}
                    </Badge>
                    <span>
                      {locale === 'ne'
                        ? 'बागमती र गण्डकी प्रदेश मात्र उपलब्ध'
                        : 'Only Bagmati and Gandaki provinces available'}
                    </span>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* District Selection */}
            <FormField
              control={form.control}
              name="district"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {locale === 'ne' ? 'जिल्ला' : 'District'} *
                  </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      form.setValue('municipality', '');
                    }}
                    value={field.value}
                    disabled={!selectedProvince || availableDistricts.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={
                          !selectedProvince
                            ? locale === 'ne' 
                              ? 'पहिला प्रदेश छान्नुहोस्' 
                              : 'Select province first'
                            : locale === 'ne' 
                              ? 'जिल्ला छान्नुहोस्' 
                              : 'Select district'
                        } />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableDistricts.map((district) => (
                        <SelectItem key={district} value={district}>
                          {district}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Municipality Selection */}
            <FormField
              control={form.control}
              name="municipality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {locale === 'ne' ? 'नगरपालिका' : 'Municipality'} *
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={!selectedDistrict || availableMunicipalities.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={
                          !selectedDistrict
                            ? locale === 'ne' 
                              ? 'पहिला जिल्ला छान्नुहोस्' 
                              : 'Select district first'
                            : locale === 'ne' 
                              ? 'नगरपालिका छान्नुहोस्' 
                              : 'Select municipality'
                        } />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableMunicipalities.map((municipality) => (
                        <SelectItem key={municipality} value={municipality}>
                          {municipality}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedDistrict && (
                    <FormDescription>
                      {locale === 'ne'
                        ? `${selectedDistrict} जिल्लाका नगरपालिकाहरू`
                        : `Municipalities in ${selectedDistrict} district`}
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Ward Number */}
            <FormField
              control={form.control}
              name="ward_no"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {locale === 'ne' ? 'वडा नम्बर' : 'Ward Number'} *
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={locale === 'ne' ? 'वडा नम्बर छान्नुहोस्' : 'Select ward number'} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {WARDS.map((ward) => (
                        <SelectItem key={ward} value={ward.toString()}>
                          {ward}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Street Address */}
            <FormField
              control={form.control}
              name="street_address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {locale === 'ne' ? 'सडक ठेगाना' : 'Street Address'} *
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder={locale === 'ne' 
                          ? 'सडकको नाम, घर नम्बर, आदि' 
                          : 'Street name, house number, etc.'
                        }
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    {locale === 'ne'
                      ? 'उदाहरण: गणेशमान चोक, घर नं. १२३'
                      : 'Example: Ganeshman Chowk, House No. 123'}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Default Address Checkbox */}
            <FormField
              control={form.control}
              name="is_default"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="h-4 w-4 mt-1"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      {locale === 'ne' ? 'पूर्वनिर्धारित ठेगाना' : 'Set as default address'}
                    </FormLabel>
                    <FormDescription>
                      {locale === 'ne'
                        ? 'यो ठेगाना भविष्यका बुकिङहरूको लागि पूर्वनिर्धारित रूपमा प्रयोग गर्नुहोस्'
                        : 'Use this address as default for future bookings'}
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                {locale === 'ne' ? 'रद्द गर्नुहोस्' : 'Cancel'}
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="min-w-[120px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {locale === 'ne' ? 'सुरक्षित गर्दै...' : 'Saving...'}
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    {locale === 'ne' ? 'सुरक्षित गर्नुहोस्' : 'Save Address'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}