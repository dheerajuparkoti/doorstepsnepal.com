// // components/account/address-dialog.tsx
// 'use client';

// import { useState, useEffect, useMemo } from 'react';
// import { useI18n } from '@/lib/i18n/context';
// import { useForm } from 'react-hook-form';
// import * as z from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog';
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '@/components/ui/form';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { Check, Loader2, MapPin, Building, Navigation, Home } from 'lucide-react';
// import { PROVINCES, DISTRICT_DATA, AddressType } from '@/lib/data/address';

// const addressFormSchema = z.object({
//   type: z.enum(['permanent', 'temporary']),
//   province: z.string().min(1, 'Province is required'),
//   district: z.string().min(1, 'District is required'),
//   municipality: z.string().min(1, 'Municipality is required'),
//   ward_no: z.string().min(1, 'Ward number is required'),
//   street_address: z.string().min(1, 'Street address is required'),
// });

// type AddressFormValues = z.infer<typeof addressFormSchema>;

// interface AddressDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   onSubmit: (data: AddressFormValues) => Promise<void>;
//   initialData?: AddressFormValues | null;
//   title: string;
//   description?: string;
//   isLoading?: boolean;
//   addressType: AddressType;
// }

// export function AddressDialog({
//   open,
//   onOpenChange,
//   onSubmit,
//   initialData,
//   title,
//   description,
//   isLoading = false,
//   addressType,
// }: AddressDialogProps) {
//   const { locale } = useI18n();
//   const [districtSearch, setDistrictSearch] = useState('');
//   const [municipalitySearch, setMunicipalitySearch] = useState('');

//   const form = useForm<AddressFormValues>({
//     resolver: zodResolver(addressFormSchema),
//     defaultValues: initialData || {
//       type: addressType,
//       province: '',
//       district: '',
//       municipality: '',
//       ward_no: '',
//       street_address: '',
//     },
//   });

//   const selectedDistrict = form.watch('district');

//   // Reset form when dialog opens with new initial data
//   useEffect(() => {
//     if (open) {
//       if (initialData) {
//         form.reset(initialData);
//       } else {
//         form.reset({
//           type: addressType,
//           province: '',
//           district: '',
//           municipality: '',
//           ward_no: '',
//           street_address: '',
//         });
//       }
//       setDistrictSearch('');
//       setMunicipalitySearch('');
//     }
//   }, [open, initialData, addressType, form]);

//   // Filter districts based on search
//   const filteredDistricts = useMemo(() => {
//     if (!districtSearch.trim()) return DISTRICT_DATA.allDistricts;
//     return DISTRICT_DATA.allDistricts.filter(district =>
//       district.toLowerCase().includes(districtSearch.toLowerCase())
//     );
//   }, [districtSearch]);

//   // Filter municipalities based on search
//   const filteredMunicipalities = useMemo(() => {
//     if (!selectedDistrict) return [];
//     const municipalities = DISTRICT_DATA.localLevelList[selectedDistrict as keyof typeof DISTRICT_DATA.localLevelList] || [];
    
//     if (!municipalitySearch.trim()) return municipalities;
//     return municipalities.filter(municipality =>
//       municipality.toLowerCase().includes(municipalitySearch.toLowerCase())
//     );
//   }, [selectedDistrict, municipalitySearch]);

//   const handleSubmit = async (data: AddressFormValues) => {
//     await onSubmit(data);
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>{title}</DialogTitle>
//           {description && <DialogDescription>{description}</DialogDescription>}
//         </DialogHeader>

//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
//             {/* Address Type (Hidden - set by parent) */}
//             <FormField
//               control={form.control}
//               name="type"
//               render={({ field }) => (
//                 <input type="hidden" {...field} />
//               )}
//             />

//             {/* Province Selection */}
//             <FormField
//               control={form.control}
//               name="province"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>
//                     {locale === 'ne' ? 'प्रदेश' : 'Province'} *
//                   </FormLabel>
//                   <Select
//                     onValueChange={field.onChange}
//                     defaultValue={field.value}
//                   >
//                     <FormControl>
//                       <SelectTrigger>
//                         <SelectValue placeholder={locale === 'ne' ? 'प्रदेश छान्नुहोस्' : 'Select province'} />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent>
//                       {PROVINCES.map((province) => (
//                         <SelectItem key={province} value={province}>
//                           {province}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* District Selection */}
//             <FormField
//               control={form.control}
//               name="district"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>
//                     {locale === 'ne' ? 'जिल्ला' : 'District'} *
//                   </FormLabel>
//                   <div className="relative">
//                     <FormControl>
//                       <div>
//                         <Input
//                           placeholder={locale === 'ne' ? 'जिल्ला खोज्नुहोस्...' : 'Search district...'}
//                           value={districtSearch}
//                           onChange={(e) => setDistrictSearch(e.target.value)}
//                           className="mb-2"
//                         />
//                         <Select
//                           onValueChange={(value) => {
//                             field.onChange(value);
//                             setDistrictSearch('');
//                             form.setValue('municipality', '');
//                             setMunicipalitySearch('');
//                           }}
//                           defaultValue={field.value}
//                         >
//                           <FormControl>
//                             <SelectTrigger>
//                               <SelectValue placeholder={locale === 'ne' ? 'जिल्ला छान्नुहोस्' : 'Select district'} />
//                             </SelectTrigger>
//                           </FormControl>
//                           <SelectContent>
//                             {filteredDistricts.map((district) => (
//                               <SelectItem key={district} value={district}>
//                                 {district}
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                       </div>
//                     </FormControl>
//                   </div>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Municipality Selection */}
//             <FormField
//               control={form.control}
//               name="municipality"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>
//                     {locale === 'ne' ? 'नगरपालिका' : 'Municipality'} *
//                   </FormLabel>
//                   <div className="relative">
//                     <FormControl>
//                       <div>
//                         <Input
//                           placeholder={locale === 'ne' ? 'नगरपालिका खोज्नुहोस्...' : 'Search municipality...'}
//                           value={municipalitySearch}
//                           onChange={(e) => setMunicipalitySearch(e.target.value)}
//                           disabled={!selectedDistrict}
//                           className="mb-2"
//                         />
//                         <Select
//                           onValueChange={(value) => {
//                             field.onChange(value);
//                             setMunicipalitySearch('');
//                           }}
//                           defaultValue={field.value}
//                           disabled={!selectedDistrict}
//                         >
//                           <FormControl>
//                             <SelectTrigger>
//                               <SelectValue placeholder={locale === 'ne' ? 'नगरपालिका छान्नुहोस्' : 'Select municipality'} />
//                             </SelectTrigger>
//                           </FormControl>
//                           <SelectContent>
//                             {filteredMunicipalities.map((municipality) => (
//                               <SelectItem key={municipality} value={municipality}>
//                                 {municipality}
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                       </div>
//                     </FormControl>
//                   </div>
//                   <FormDescription>
//                     {!selectedDistrict ? (
//                       locale === 'ne'
//                         ? 'जिल्ला छानेपछि मात्र नगरपालिका छान्न सकिन्छ'
//                         : 'Municipality can only be selected after choosing district'
//                     ) : (
//                       locale === 'ne'
//                         ? `${selectedDistrict} जिल्लाका नगरपालिकाहरू`
//                         : `Municipalities in ${selectedDistrict} district`
//                     )}
//                   </FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Ward Number */}
//             <FormField
//               control={form.control}
//               name="ward_no"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>
//                     {locale === 'ne' ? 'वडा नम्बर' : 'Ward Number'} *
//                   </FormLabel>
//                   <Select
//                     onValueChange={field.onChange}
//                     defaultValue={field.value}
//                   >
//                     <FormControl>
//                       <SelectTrigger>
//                         <SelectValue placeholder={locale === 'ne' ? 'वडा नम्बर छान्नुहोस्' : 'Select ward number'} />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent>
//                       {DISTRICT_DATA.wards.map((ward) => (
//                         <SelectItem key={ward} value={ward.toString()}>
//                           {ward}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Street Address */}
//             <FormField
//               control={form.control}
//               name="street_address"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>
//                     {locale === 'ne' ? 'सडक ठेगाना' : 'Street Address'} *
//                   </FormLabel>
//                   <FormControl>
//                     <div className="relative">
//                       <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//                       <Input
//                         placeholder={locale === 'ne' 
//                           ? 'सडकको नाम, घर नम्बर, आदि' 
//                           : 'Street name, house number, etc.'
//                         }
//                         className="pl-10"
//                         {...field}
//                       />
//                     </div>
//                   </FormControl>
//                   <FormDescription>
//                     {locale === 'ne'
//                       ? 'उदाहरण: गणेशमान चोक, घर नं. १२३'
//                       : 'Example: Ganeshman Chowk, House No. 123'}
//                   </FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Action Buttons */}
//             <div className="flex justify-end gap-3 pt-4 border-t">
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() => onOpenChange(false)}
//                 disabled={isLoading}
//               >
//                 {locale === 'ne' ? 'रद्द गर्नुहोस्' : 'Cancel'}
//               </Button>
//               <Button
//                 type="submit"
//                 disabled={isLoading}
//               >
//                 {isLoading ? (
//                   <>
//                     <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                     {locale === 'ne' ? 'सुरक्षित गर्दै...' : 'Saving...'}
//                   </>
//                 ) : (
//                   <>
//                     <Check className="w-4 h-4 mr-2" />
//                     {locale === 'ne' ? 'सुरक्षित गर्नुहोस्' : 'Save Address'}
//                   </>
//                 )}
//               </Button>
//             </div>
//           </form>
//         </Form>
//       </DialogContent>
//     </Dialog>
//   );
// }


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
import { Check, Loader2, Home } from 'lucide-react';
import { 
  ALL_PROVINCES, 
  TEMPORARY_PROVINCES,
  getDistrictsByProvince, 
  getMunicipalitiesByDistrict,
  getProvincesByType,
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
    },
  });

  const selectedProvince = form.watch('province');
  const selectedDistrict = form.watch('district');

  // Get available provinces based on address type
  const availableProvinces = useMemo(() => {
    return getProvincesByType(addressType);
  }, [addressType]);

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
        });
      }
    }
  }, [open, initialData, addressType, form]);

  const handleSubmit = async (data: AddressFormValues) => {
    await onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Address Type (Hidden - set by parent) */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <input type="hidden" {...field} />
              )}
            />

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
                      // Reset district and municipality when province changes
                      form.setValue('district', '');
                      form.setValue('municipality', '');
                    }}
                    defaultValue={field.value}
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
                  {addressType === 'temporary' && (
                    <FormDescription>
                      {locale === 'ne'
                        ? 'अस्थायी ठेगानाको लागि बागमती र गण्डकी प्रदेश मात्र उपलब्ध छ'
                        : 'Only Bagmati and Gandaki provinces are available for temporary addresses'}
                    </FormDescription>
                  )}
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
                      // Reset municipality when district changes
                      form.setValue('municipality', '');
                    }}
                    defaultValue={field.value}
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
                    defaultValue={field.value}
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
                  <FormDescription>
                    {!selectedDistrict ? (
                      locale === 'ne'
                        ? 'जिल्ला छानेपछि मात्र नगरपालिका छान्न सकिन्छ'
                        : 'Municipality can only be selected after choosing district'
                    ) : (
                      locale === 'ne'
                        ? `${selectedDistrict} जिल्लाका नगरपालिकाहरू`
                        : `Municipalities in ${selectedDistrict} district`
                    )}
                  </FormDescription>
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
                    defaultValue={field.value}
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