
import React from 'react';
import Image from 'next/image';
import { PaymentMethod } from '@/lib/data/professional/payment';
import { QR_CODE_PATHS } from '@/lib/data/professional/constants';
import { CurrencyFormatter, FileDownloader } from '@/lib/utils/formatters';

interface QRCodeSectionProps {
  method: PaymentMethod;
  amount: number;
}

// ===== Type-safe color maps =====
const methodColors: Record<PaymentMethod, string> = {
    [PaymentMethod.KHALTI]: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
    [PaymentMethod.ESEWA]: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    [PaymentMethod.FONEPAY]: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    [PaymentMethod.IMEPAY]: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    [PaymentMethod.MOBILE_BANKING]: 'bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800',
    [PaymentMethod.BANK_TRANSFER]: '',
    [PaymentMethod.CASH]: '',
    [PaymentMethod.CARD]: '',
    [PaymentMethod.DIGITAL_WALLET]: ''
};

const textColors: Record<PaymentMethod, string> = {
    [PaymentMethod.KHALTI]: 'text-purple-700 dark:text-purple-300',
    [PaymentMethod.ESEWA]: 'text-green-700 dark:text-green-300',
    [PaymentMethod.FONEPAY]: 'text-blue-700 dark:text-blue-300',
    [PaymentMethod.IMEPAY]: 'text-red-700 dark:text-red-300',
    [PaymentMethod.MOBILE_BANKING]: 'text-teal-700 dark:text-teal-300',
    [PaymentMethod.BANK_TRANSFER]: '',
    [PaymentMethod.CASH]: '',
    [PaymentMethod.CARD]: '',
    [PaymentMethod.DIGITAL_WALLET]: ''
};

// Helper to convert enum to display name
const getDisplayName = (method: PaymentMethod): string =>
  method
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export function QRCodeSection({ method, amount }: QRCodeSectionProps) {
  const qrPath = QR_CODE_PATHS[method];

  if (!qrPath) return null;

  const handleDownloadQR = async () => {
    await FileDownloader.download(
      qrPath,
      `${method}_qr_${Date.now()}.png`
    );
  };

  const displayName = getDisplayName(method);

  return (
    <div className={`p-4 rounded-xl border ${methodColors[method]}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className={`text-sm font-medium ${textColors[method]}`}>
            {displayName} QR
          </span>
        </div>
        <button
          onClick={handleDownloadQR}
          className={`p-1.5 rounded-lg hover:bg-white/50 dark:hover:bg-black/20 transition-colors ${textColors[method]}`}
          title="Download QR Code"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </button>
      </div>

      {/* QR Code */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-lg">
        <div className="relative w-48 h-48 mx-auto">
          <Image
            src={qrPath}
            alt={`${displayName} QR Code`}
            fill
            className="object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2U1ZTdlYiIvPjxwYXRoIGQ9Ik01MCA1MGgxMDB2MTAwSDUweiIgZmlsbD0iI2QxZDVkYSIvPjxwYXRoIGQ9Ik03MCA3MGg2MHY2MEg3MHoiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNMTAwIDgwaDIwdjQwaC0yMHoiIGZpbGw9IiM2YjcyODAiLz48L3N2Zz4=';
            }}
          />
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-4 text-center space-y-1">
        <p className={`text-sm font-medium ${textColors[method]}`}>
          Scan to pay via {displayName}
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Amount: {CurrencyFormatter.format(amount)}
        </p>
      </div>

      {/* Download Button */}
      <button
        onClick={handleDownloadQR}
        className="w-full mt-4 flex items-center justify-center space-x-2 px-4 py-2.5 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium rounded-lg border border-gray-200 dark:border-gray-700 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        <span>Download QR Code</span>
      </button>
    </div>
  );
}
