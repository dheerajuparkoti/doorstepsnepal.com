'use client';

import { useI18n } from '@/lib/i18n/context';
import { AddressSection } from '@/components/account/address-section';
import { Info } from 'lucide-react';

interface AddressStepProps {
  initialData?: any;
  onUpdate: (data: any) => void;
}

export function AddressStep({ onUpdate }: AddressStepProps) {
  const { locale } = useI18n();

  return (
    <div className="space-y-6">
      {/* Info banner */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/50 rounded-xl border border-blue-100 dark:border-blue-900">
        <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-medium text-blue-800 dark:text-blue-300">
            {locale === 'ne' ? 'ठेगाना जानकारी' : 'Address Information'}
          </p>
          <p className="text-sm text-blue-700 dark:text-blue-400">
            {locale === 'ne' 
              ? 'कृपया आफ्नो स्थायी र अस्थायी ठेगाना भर्नुहोस्। स्थायी ठेगाना अनिवार्य छ।'
              : 'Please provide your permanent and temporary addresses. Permanent address is required.'}
          </p>
        </div>
      </div>

      {/* Reuse the beautiful AddressSection component */}
      <AddressSection />

      {/* Address tips */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-xl">
          <h4 className="font-medium text-green-700 dark:text-green-400 mb-1">
            {locale === 'ne' ? 'स्थायी ठेगाना' : 'Permanent Address'}
          </h4>
          <p className="text-sm text-green-600 dark:text-green-500">
            {locale === 'ne' 
              ? 'तपाईंको स्थायी घर ठेगाना'
              : 'Your permanent home address'}
          </p>
        </div>
        <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-xl">
          <h4 className="font-medium text-amber-700 dark:text-amber-400 mb-1">
            {locale === 'ne' ? 'अस्थायी ठेगाना' : 'Temporary Address'}
          </h4>
          <p className="text-sm text-amber-600 dark:text-amber-500">
            {locale === 'ne' 
              ? 'हाल बसोबास गरेको ठेगाना'
              : 'Your current residence address'}
          </p>
        </div>
      </div>
    </div>
  );
}