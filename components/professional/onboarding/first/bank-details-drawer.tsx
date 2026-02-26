'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Building, CreditCard, User, MapPin, Search, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getBankDetailsSchema, BankDetailsFormValues } from '@/lib/schemas/bank-details-schema';

import {  BANKS_NEPAL } from '@/lib/constants/banks/nepal';

interface BankDetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  onComplete: (data: BankDetailsFormValues) => void;
  initialData?: Partial<BankDetailsFormValues>;
}

export function BankDetailsDrawer({ open, onClose, onComplete, initialData }: BankDetailsDrawerProps) {
  const { locale, language } = useI18n();
  const [showBankSearch, setShowBankSearch] = useState(false);
  const [bankSearchQuery, setBankSearchQuery] = useState('');
  const getLocalizedText = (en: string, ne: string) => {
    return language === 'ne' ? ne : en;
  };

  const form = useForm<BankDetailsFormValues>({
    resolver: zodResolver(getBankDetailsSchema(getLocalizedText)),
    defaultValues: {
      bank_account_number: initialData?.bank_account_number || '',
      bank_account_holder_name: initialData?.bank_account_holder_name || '',
      bank_name: initialData?.bank_name || '',
      bank_branch_name: initialData?.bank_branch_name || '',
    },
    mode: 'onChange',
  });

  const filteredBanks = bankSearchQuery
    ? BANKS_NEPAL.filter(bank => 
        bank.toLowerCase().includes(bankSearchQuery.toLowerCase())
      )
    : BANKS_NEPAL;

  const handleSubmit = (data: BankDetailsFormValues) => {
    onComplete(data);
    onClose();
  };

  // Input sanitization for text fields
  const handleTextInput = (
    e: React.ChangeEvent<HTMLInputElement>, 
    field: any,
    allowNumbers: boolean = false
  ) => {
    let sanitized;
    if (allowNumbers) {
      // For account number - allow numbers and spaces
      sanitized = e.target.value.replace(/[^0-9\s]/g, '');
    } else {
      // For names - allow only English letters and spaces
      sanitized = e.target.value.replace(/[^a-zA-Z\s]/g, '');
    }
    field.onChange(sanitized);
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onClose}>
<SheetContent
  side="right"
  className="w-full sm:max-w-md overflow-y-auto p-4 sm:p-6"
>
          <SheetHeader className="mb-6">
            <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {locale === 'ne' ? 'बैंक विवरण' : 'Bank Details'}
            </SheetTitle>
            <SheetDescription>
              {locale === 'ne'
                ? 'भुक्तानी प्राप्तिको लागि आफ्नो बैंक विवरण भर्नुहोस्'
                : 'Enter your bank details to receive payments'}
            </SheetDescription>
          </SheetHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* Account Number */}
              <FormField
                control={form.control}
                name="bank_account_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      {locale === 'ne' ? 'खाता नम्बर' : 'Account Number'} *
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => handleTextInput(e, field, true)}
                        placeholder="1234567890123456"
                        className="transition-all focus:ring-2 focus:ring-primary/20"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Account Holder Name */}
              <FormField
                control={form.control}
                name="bank_account_holder_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {locale === 'ne' ? 'खाता धनीको नाम' : 'Account Holder Name'} *
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => handleTextInput(e, field)}
                        placeholder={locale === 'ne' ? 'राम बहादुर' : 'Ram Bahadur'}
                        className="transition-all focus:ring-2 focus:ring-primary/20"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Bank Name */}
              <FormField
                control={form.control}
                name="bank_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      {locale === 'ne' ? 'बैंकको नाम' : 'Bank Name'} *
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          readOnly
                          placeholder={locale === 'ne' ? 'बैंक छान्नुहोस्' : 'Select bank'}
                          onClick={() => setShowBankSearch(true)}
                          className="cursor-pointer pr-10 transition-all focus:ring-2 focus:ring-primary/20"
                        />
                        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Branch Name */}
              <FormField
                control={form.control}
                name="bank_branch_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {locale === 'ne' ? 'शाखाको नाम' : 'Branch Name'} *
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => handleTextInput(e, field)}
                        placeholder={locale === 'ne' ? 'काठमाडौं शाखा' : 'Kathmandu Branch'}
                        className="transition-all focus:ring-2 focus:ring-primary/20"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                disabled={!form.formState.isValid}
              >
                {locale === 'ne' ? 'बैंक विवरण बचत गर्नुहोस्' : 'Save Bank Details'}
              </Button>
            </form>
          </Form>
        </SheetContent>
      </Sheet>

      {/* Bank Search Dialog */}
      <Dialog open={showBankSearch} onOpenChange={setShowBankSearch}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {locale === 'ne' ? 'बैंक खोज्नुहोस्' : 'Search Bank'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder={locale === 'ne' ? 'बैंकको नाम खोज्नुहोस्...' : 'Search bank name...'}
                value={bankSearchQuery}
                onChange={(e) => setBankSearchQuery(e.target.value)}
                className="pl-10"
                autoFocus
              />
              {bankSearchQuery && (
                <button
                  type="button"
                  onClick={() => setBankSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>

            <div className="max-h-60 overflow-y-auto border rounded-lg divide-y">
              {filteredBanks.map((bank) => (
                <button
                  key={bank}
                  type="button"
                  className="w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                  onClick={() => {
                    form.setValue('bank_name', bank, { shouldValidate: true });
                    setShowBankSearch(false);
                    setBankSearchQuery('');
                  }}
                >
                  <span className="font-medium">{bank}</span>
                </button>
              ))}
              {filteredBanks.length === 0 && (
                <div className="p-4 text-center text-gray-500">
                  {locale === 'ne' ? 'कुनै बैंक फेला परेन' : 'No banks found'}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}