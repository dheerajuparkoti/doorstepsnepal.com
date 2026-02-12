
import React, { JSX, useState } from 'react';
import { Payment, PaymentMethod, PaymentStatus } from '@/lib/data/professional/payment';
import { CurrencyFormatter } from '@/lib/utils/formatters';
import { NepaliDateService } from '@/lib/utils/nepaliDate';
import { StatusBadge } from '@/components/ui/professional-payment/status-badge';
import { BottomSheet } from '@/components/ui/professional-payment/bottom-sheet';
import { QRCodeSection } from './qr-code-section';

interface PaymentCardProps {
  payment: Payment;
  onDownloadReceipt: (payment: Payment) => Promise<void>;
}

const paymentMethodConfig: Record<PaymentMethod, { icon: JSX.Element; color: string }> = {
  khalti: {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    color: 'text-purple-600 dark:text-purple-400'
  },
  esewa: {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    color: 'text-green-600 dark:text-green-400'
  },
  fonepay: {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    color: 'text-blue-600 dark:text-blue-400'
  },
  bank_transfer: {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4-9 4-9-4z" />
      </svg>
    ),
    color: 'text-blue-600 dark:text-blue-400'
  },
  cash: {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    color: 'text-green-600 dark:text-green-400'
  },
  card: {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    color: 'text-blue-600 dark:text-blue-400'
  },
  mobile_banking: {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    color: 'text-teal-600 dark:text-teal-400'
  },
  digital_wallet: {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    color: 'text-orange-600 dark:text-orange-400'
  },
  imepay: {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    color: 'text-red-600 dark:text-red-400'
  }
};

const statusConfig: Record<PaymentStatus, {
  color: string; colorClass: string; icon: JSX.Element 
}> = {
  pending: {
    colorClass: 'text-amber-700 dark:text-amber-300 border-amber-400 dark:border-amber-600 bg-amber-100 dark:bg-amber-900/20',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'amber'
  },
  completed: {
    colorClass: 'text-green-700 dark:text-green-300 border-green-400 dark:border-green-600 bg-green-100 dark:bg-green-900/20',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    color: 'green'
  },
  failed: {
    colorClass: 'text-red-700 dark:text-red-300 border-red-400 dark:border-red-600 bg-red-100 dark:bg-red-900/20',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    color: 'red'
  },
  refunded: {
    colorClass: 'text-blue-700 dark:text-blue-300 border-blue-400 dark:border-blue-600 bg-blue-100 dark:bg-blue-900/20',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14v-1a4 4 0 00-4-4h-3.5M4 20h16a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    color: 'blue'
  }
};


export function PaymentCard({ payment, onDownloadReceipt }: PaymentCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const methodConfig = paymentMethodConfig[payment.payment_method];
  const status = statusConfig[payment.payment_status];

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
        <div className="p-4">
          {/* Status Indicator */}
          <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl" style={{
            backgroundColor: payment.payment_status === 'completed' ? '#10B981' : 
                           payment.payment_status === 'pending' ? '#F59E0B' : 
                           payment.payment_status === 'failed' ? '#EF4444' : '#3B82F6'
          }} />

          <div className="flex items-start space-x-3">
            {/* Method Icon */}
            <div className={`p-2.5 rounded-lg bg-gray-100 dark:bg-gray-700 ${methodConfig?.color}`}>
              {methodConfig?.icon}
            </div>

            {/* Payment Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-1">
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {CurrencyFormatter.format(payment.amount)}
                </p>
             <StatusBadge
  status={payment.paymentStatus}
  variant="outline"
  size="sm"
  icon={status?.icon}
  className={status?.colorClass}
/>

              </div>

              <div className="space-y-1.5">
                <div className="flex items-center text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    {payment.paymentMethod}
                  </span>
                  <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
                  <span className="text-gray-500 dark:text-gray-500">
                    {NepaliDateService.formatHeader(payment.payment_date)}
                  </span>
                </div>

                {payment.transactionId && (
                  <p className="text-xs text-gray-500 dark:text-gray-500 font-mono">
                    TXN: {payment.transactionId}
                  </p>
                )}

                {payment.notes && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                    {payment.notes}
                  </p>
                )}

                {payment.isProfessional && (
                  <div className="inline-flex items-center px-2 py-0.5 bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 text-xs rounded-full">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Professional Entry
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-2 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
            <button
              onClick={() => setShowDetails(true)}
              className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Details</span>
            </button>
            <button
              onClick={() => onDownloadReceipt(payment)}
              className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/20 dark:hover:bg-primary-900/40 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Receipt</span>
            </button>
          </div>
        </div>
      </div>

      {/* Details Bottom Sheet */}
      <BottomSheet
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        title="Payment Details"
      >
        <div className="p-4 space-y-6">
          {/* Status Badge */}
          <div className="flex justify-center">
            <div className={`px-4 py-2 rounded-full ${status?.color === 'green' ? 'bg-green-100 dark:bg-green-900/40' : 
              status?.color === 'amber' ? 'bg-amber-100 dark:bg-amber-900/40' : 
              status?.color === 'red' ? 'bg-red-100 dark:bg-red-900/40' : 
              'bg-blue-100 dark:bg-blue-900/40'}`}>
              <div className="flex items-center space-x-2">
                <span className={status?.color === 'green' ? 'text-green-700 dark:text-green-300' : 
                  status?.color === 'amber' ? 'text-amber-700 dark:text-amber-300' : 
                  status?.color === 'red' ? 'text-red-700 dark:text-red-300' : 
                  'text-blue-700 dark:text-blue-300'}>
                  {status?.icon}
                </span>
                <span className={`text-sm font-bold ${
                  status?.color === 'green' ? 'text-green-700 dark:text-green-300' : 
                  status?.color === 'amber' ? 'text-amber-700 dark:text-amber-300' : 
                  status?.color === 'red' ? 'text-red-700 dark:text-red-300' : 
                  'text-blue-700 dark:text-blue-300'
                }`}>
                  {payment.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* QR Code Section for Pending Payments */}
          {payment.canShowQR && (
            <QRCodeSection
              method={payment.paymentMethod}
              amount={payment.amount}
            />
          )}

          {/* Payment Details */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
              PAYMENT DETAILS
            </h3>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Amount</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {CurrencyFormatter.format(payment.amount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Method</span>
                <div className="flex items-center space-x-1.5">
                  <span className={methodConfig?.color}>{methodConfig?.icon}</span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {payment.paymentMethod}
                  </span>
                </div>
              </div>
              {payment.transactionId && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Transaction ID</span>
                  <span className="text-sm font-mono text-gray-900 dark:text-white">
                    {payment.transactionId}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Date</span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {NepaliDateService.formatWithTime(payment.payment_date)}
                </span>
              </div>
              {payment.isProfessional && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Initiator</span>
                  <span className="text-sm text-orange-600 dark:text-orange-400 font-medium">
                    Professional
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {payment.notes && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                NOTES
              </h3>
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {payment.notes}
                </p>
              </div>
            </div>
          )}

          {/* Professional Warning */}
          {payment.isProfessional && (
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-orange-800 dark:text-orange-300">
                    Professional Payment Entry
                  </p>
                  <p className="text-sm text-orange-700 dark:text-orange-400">
                    This payment was recorded by the professional. The professional confirms receipt of funds and accepts responsibility for this digital entry.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Download Button */}
          <button
            onClick={() => {
              onDownloadReceipt(payment);
              setShowDetails(false);
            }}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Download Receipt</span>
          </button>
        </div>
      </BottomSheet>
    </>
  );
}

