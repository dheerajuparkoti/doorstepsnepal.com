
export enum PaymentMethod {
  KHALTI = 'khalti',
  ESEWA = 'esewa',
  FONEPAY = 'fonepay',
  BANK_TRANSFER = 'bank_transfer',
  CASH = 'cash',
  CARD = 'card',
  MOBILE_BANKING = 'mobile_banking',
  DIGITAL_WALLET = 'digital_wallet',
  IMEPAY = 'imepay'
}

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
  payment_status: 'paid' | 'partial' | 'unpaid';
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