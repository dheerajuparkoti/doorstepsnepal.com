
'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { usePayments } from '@/hooks/use-payment';
import { useUserStore } from '@/stores/user-store';
import { PaymentSummaryCard } from '@/components/professional/payments/payment-summary-card';
import { PaymentCard } from '@/components/professional/payments/payment-card';
import { CreatePaymentSheet } from '@/components/professional/payments/create-payment-sheet';
import { LoadingShimmer } from '@/components/ui/professional-payment/loading-shimmer';
import { MasonryGrid } from '@/components/ui/professional-payment/masonry-grid';
import { NetworkBanner } from '@/components/ui/professional-payment/network-banner';
import { CurrencyFormatter } from '@/lib/utils/formatters';

interface PageProps {
  params: Promise<{ id: string }>; 
}

export default function OrderPaymentsPage({ params }: PageProps) {
  const router = useRouter();
  const [id, setId] = useState<string | null>(null);
  const { user } = useUserStore();
  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);
  
  // Unwrap params Promise
  useEffect(() => {
    const unwrapParams = async () => {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    };
    
    unwrapParams();
  }, [params]);

  const {
    payments,
    paymentSummary,
    isLoading,
    error,
    completedPayments,
    pendingPayments,
    totalCompletedAmount,
    loadPayments,
    createPayment,
    downloadPaymentReceipt
  } = usePayments(id ? Number(id) : 0);

  const isFullyPaid = paymentSummary?.payment_status === 'paid';
  const hasPendingPayments = pendingPayments.length > 0;

  const handlePaymentSuccess = () => {
    loadPayments();
    setIsCreateSheetOpen(false);
  };

  // Load payments on mount
  useEffect(() => {
    if (id) {
      loadPayments();
    }
  }, [id, loadPayments]);


  if (!id) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <NetworkBanner />
        <div className="space-y-6">
          <LoadingShimmer type="profile" />
          <LoadingShimmer type="card" count={3} />
        </div>
      </div>
    );
  }

  if (isLoading && !paymentSummary) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <NetworkBanner />
        <div className="space-y-6">
          <LoadingShimmer type="profile" />
          <LoadingShimmer type="card" count={3} />
        </div>
      </div>
    );
  }



  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <NetworkBanner />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <button
            onClick={() => router.back()}
            className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-2"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Order
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Payment Collections
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Order #{id}
          </p>
        </div>

        {/* Wallet Link */}
        <button
          onClick={() => router.push('/dashboard/professional/wallet')}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" 
            />
          </svg>
          <span>My Wallet</span>
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <div className="flex items-center space-x-3">
            <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          </div>
        </div>
      )}




      {/* Payment Summary */}
      {paymentSummary && (
        <PaymentSummaryCard

          summary={paymentSummary}
          completedCount={completedPayments.length}
          pendingCount={pendingPayments.length}
          totalCompletedAmount={totalCompletedAmount}
        />
      )}
      {/* Payments List Header */}
      <div className="flex items-center justify-between mt-8 mb-4">
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            All Payments
          </h2>
        </div>
        <span className="px-2.5 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
          {payments.length} Payments
        </span>
      </div>

      {/* Payments Grid */}
    {payments.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center border border-gray-200 dark:border-gray-700">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No payments yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Add your first payment to this order</p>
        </div>
      ) : (
        <MasonryGrid
          items={payments}
          columnCount={{ default: 1, sm: 1, md: 2, lg: 2, xl: 2 }}
          gap={16}
          keyExtractor={(payment) => `payment-${payment.id}`}
          renderItem={(payment) => (
            <PaymentCard payment={payment} onDownloadReceipt={downloadPaymentReceipt} />
          )}
        />
      )}


      {/* Add Payment Button */}
      {!isFullyPaid && !hasPendingPayments && paymentSummary && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setIsCreateSheetOpen(true)}
            className="inline-flex items-center space-x-2 px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Add Payment</span>
          </button>
        </div>
      )}



      {/* Create Payment Sheet */}
      {!isFullyPaid && !hasPendingPayments && paymentSummary && (
        <CreatePaymentSheet
          isOpen={isCreateSheetOpen}
          onClose={() => setIsCreateSheetOpen(false)}
          orderId={Number(id)}
        // orderId={98}
          remainingAmount={paymentSummary.remaining_amount}
          isProfessional={user?.type === 'professional' || user?.mode === 'professional'}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}