
import { PaymentMethod } from '@/lib/data/professional';
export { PaymentMethod };

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

export interface Payment {
  [x: string]: any;
  id: number;
  order_id: number;
  amount: number;
  payment_method: PaymentMethod;
  transaction_id?: string;
  payment_status: PaymentStatus;
  payment_date: string;
  gateway_response?: string;
  notes?: string;
  is_professional?: boolean;
}

export interface PaymentSummary {
  order_id: number;
  total_price: number;
  total_paid: number;
  remaining_amount: number;
  payment_percentage: number;
  payment_status: 'paid' | 'partial' | 'unpaid' ;
  // paymentStatus: 'pending' | 'completed' | 'refunded' | 'failed'
  
}




export interface PaymentCreateRequest {
  order_id: number;
  amount: number;
  payment_method: PaymentMethod;
  transaction_id?: string;
  gateway_response?: string;
  notes?: string;
  is_professional?: boolean;
  payment_status: string;
}

export interface PaymentCompleteResponse {
  payment: Payment;
  summary: PaymentSummary;
  order?: any;
}