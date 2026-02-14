'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
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
import { Building, CreditCard, User, MapPin, Search, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// Bank data from payments page
const BANKS_NEPAL = [
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

interface BankDetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  onComplete: (data: any) => void;
  initialData?: any;
}

export function BankDetailsDrawer({ open, onClose, onComplete, initialData }: BankDetailsDrawerProps) {
  const { locale } = useI18n();
  const [formData, setFormData] = useState({
    bank_account_number: initialData?.bank_account_number || '',
    bank_account_holder_name: initialData?.bank_account_holder_name || '',
    bank_name: initialData?.bank_name || '',
    bank_branch_name: initialData?.bank_branch_name || '',
  });
  const [showBankSearch, setShowBankSearch] = useState(false);
  const [bankSearchQuery, setBankSearchQuery] = useState('');

  const filteredBanks = bankSearchQuery
    ? BANKS_NEPAL.filter(bank => 
        bank.toLowerCase().includes(bankSearchQuery.toLowerCase())
      )
    : BANKS_NEPAL;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields are filled
    if (!formData.bank_account_number || !formData.bank_account_holder_name || 
        !formData.bank_name || !formData.bank_branch_name) {
      return;
    }

    onComplete(formData);
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Account Number */}
            <div className="space-y-2">
              <Label htmlFor="accountNumber" className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                {locale === 'ne' ? 'खाता नम्बर' : 'Account Number'} *
              </Label>
              <Input
                id="accountNumber"
                value={formData.bank_account_number}
                onChange={(e) => setFormData({ ...formData, bank_account_number: e.target.value })}
                placeholder="1234567890123456"
                required
                className="transition-all focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Account Holder Name */}
            <div className="space-y-2">
              <Label htmlFor="holderName" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {locale === 'ne' ? 'खाता धनीको नाम' : 'Account Holder Name'} *
              </Label>
              <Input
                id="holderName"
                value={formData.bank_account_holder_name}
                onChange={(e) => setFormData({ ...formData, bank_account_holder_name: e.target.value })}
                placeholder={locale === 'ne' ? 'राम बहादुर' : 'Ram Bahadur'}
                required
                className="transition-all focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Bank Name */}
            <div className="space-y-2">
              <Label htmlFor="bankName" className="flex items-center gap-2">
                <Building className="w-4 h-4" />
                {locale === 'ne' ? 'बैंकको नाम' : 'Bank Name'} *
              </Label>
              <div className="relative">
                <Input
                  id="bankName"
                  value={formData.bank_name}
                  readOnly
                  placeholder={locale === 'ne' ? 'बैंक छान्नुहोस्' : 'Select bank'}
                  onClick={() => setShowBankSearch(true)}
                  className="cursor-pointer pr-10 transition-all focus:ring-2 focus:ring-primary/20"
                  required
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Branch Name */}
            <div className="space-y-2">
              <Label htmlFor="branchName" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {locale === 'ne' ? 'शाखाको नाम' : 'Branch Name'} *
              </Label>
              <Input
                id="branchName"
                value={formData.bank_branch_name}
                onChange={(e) => setFormData({ ...formData, bank_branch_name: e.target.value })}
                placeholder={locale === 'ne' ? 'काठमाडौं शाखा' : 'Kathmandu Branch'}
                required
                className="transition-all focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {locale === 'ne' ? 'बैंक विवरण बचत गर्नुहोस्' : 'Save Bank Details'}
            </Button>
          </form>
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
                  className="w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                  onClick={() => {
                    setFormData({ ...formData, bank_name: bank });
                    setShowBankSearch(false);
                    setBankSearchQuery('');
                  }}
                >
                  <span className="font-medium">{bank}</span>
                </button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}