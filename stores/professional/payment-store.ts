
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
  // New Refresh actions
  refreshAfterPayment: (orderId: number) => Promise<void>;
  fetchPaymentsByOrder: (orderId: number) => Promise<void>;
  
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
        get().completedPayments().reduce((sum, p) => sum + p.amount, 0),



        //  Refresh after payment notification
      refreshAfterPayment: async (orderId: number) => {
        set({ isLoading: true });
        try {
          // Fetch latest payments for this order
          const response = await fetch(`/api/orders/${orderId}/payments`);
          const data = await response.json();
          
          // Update payments list
          const updatedPayments = [...get().payments];
          const index = updatedPayments.findIndex(p => p.order_id === orderId);
          if (index !== -1) {
            updatedPayments[index] = data.payments;
          } else {
            updatedPayments.push(...data.payments);
          }
          
          set({ 
            payments: updatedPayments,
            paymentSummary: data.summary,
            isLoading: false 
          });
        } catch (error) {
          // set({ error: error.message, isLoading: false });
        }
      },
      
      // NEW: Fetch payments by order
      fetchPaymentsByOrder: async (orderId: number) => {
        set({ isLoading: true });
        try {
          const response = await fetch(`/api/orders/${orderId}/payments`);
          const data = await response.json();
          set({ 
            payments: data.payments,
            paymentSummary: data.summary,
            isLoading: false 
          });
        } catch (error) {
          // set({ error: error.message, isLoading: false });
        }
      }




    }),




    { name: 'payment-store' }
  )
);