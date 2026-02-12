
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Payment, PaymentSummary } from '@/lib/data/professional/payment';

interface PaymentState {
  // Data
  payments: Payment[];
  paymentSummary: PaymentSummary | null;
  
  // UI State
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setPayments: (payments: Payment[]) => void;
  setPaymentSummary: (summary: PaymentSummary | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearPayments: () => void;
  
  // Computed
  completedPayments: () => Payment[];
  pendingPayments: () => Payment[];
  totalCompletedAmount: () => number;
}

export const usePaymentStore = create<PaymentState>()(
  devtools(
    (set, get) => ({
      payments: [],
      paymentSummary: null,
      isLoading: false,
      error: null,

      setPayments: (payments) => set({ payments }),
      setPaymentSummary: (paymentSummary) => set({ paymentSummary }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      clearPayments: () => set({ payments: [], paymentSummary: null }),

      completedPayments: () => 
        get().payments.filter(p => p.payment_status === 'completed'),
      
      pendingPayments: () => 
        get().payments.filter(p => p.paymentStatus === 'pending'),
      
      totalCompletedAmount: () => 
        get().completedPayments().reduce((sum, p) => sum + p.amount, 0)
    }),
    { name: 'payment-store' }
  )
);