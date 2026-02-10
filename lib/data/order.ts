import { z } from "zod";

// Address Type
export interface CustomerAddress {
  id: number;
  type: 'temporary' | 'permanent';
  province: string;
  district: string;
  municipality: string;
  ward_no: string;
  street_address: string;
}

// Payment Summary Type
export interface PaymentSummary {
  total_price: number;
  total_paid: number;
  remaining_amount: number;
  payment_percentage: number;
  payment_status: string;
  is_fully_paid: boolean;
  is_partially_paid: boolean;
  is_unpaid: boolean;
}

// Order Type
export interface Order {
  id: number;
  professional_service_id: number;
  customer_id: number;
  professional_id: number;
  professional_name: string;
  customer_name: string;
  customer_phone: string;
  service_name_en: string;
  service_name_np: string;
  service_description_en: string;
  service_description_np: string;
  price_unit_id: number;
  quality_type_id: number;
  quantity: number;
  total_price: number;
  order_date: string;
  order_status: string;
  payment_status: string;
  scheduled_date: string;
  scheduled_time: string;
  order_notes: string;
  inspection_notes: string;
  customer_address: CustomerAddress;
  total_paid_amount: number;
  payment_summary: PaymentSummary;
}

// Order Status Enum
export enum OrderStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  INSPECTED = 'inspected',
  COMPLETED = 'completed',
  CANCELLED = 'canceled'
}

// Payment Status Enum
export enum PaymentStatus {
  UNPAID = 'unpaid',
  PARTIAL = 'partial',
  PAID = 'paid'
}

// Pagination Response
export interface OrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// Order Filters
// export interface OrderFilters {
//   customer_id?: number;
//   professional_id?: number;
//   professional_service_id?: number;
//   min_price?: number;
//   max_price?: number;
//   page?: number;
//   per_page?: number;
//   status?: OrderStatus;
// }

export interface OrderFilters {
  [key: string]: string | number | boolean | null | undefined;

  professional_id?: number;
  professional_service_id?: number;
  min_price?: number;
  max_price?: number;
  page?: number;
  per_page?: number;
  status?: OrderStatus;
}
// Create Order DTO
export interface CreateOrderDTO {
  professional_service_id: number;
  customer_id: number;
  scheduled_date: string;
  scheduled_time: string;
  order_notes: string;
  price_unit_id: number;
  quality_type_id: number;
  quantity: number;
  total_price: number;
  address: Omit<CustomerAddress, 'id'>;
  order_date?: string;
}

// Update Order DTO
export interface UpdateOrderDTO {
  order_status?: string;
  payment_status?: string;
  inspection_notes?: string;
  total_price?: number;
  total_paid_amount?: number;
}

// Validation Schemas
export const createOrderSchema = z.object({
  professional_service_id: z.number().positive(),
  customer_id: z.number().positive(),
  scheduled_date: z.string().datetime(),
  scheduled_time: z.string().datetime(),
  order_notes: z.string().optional(),
  price_unit_id: z.number().positive(),
  quality_type_id: z.number().positive(),
  quantity: z.number().positive(),
  total_price: z.number().min(0),
  address: z.object({
    type: z.enum(['temporary', 'permanent']),
    province: z.string(),
    district: z.string(),
    municipality: z.string(),
    ward_no: z.string(),
    street_address: z.string(),
  }),
  order_date: z.string().optional(),
});

export const updateOrderSchema = z.object({
  order_status: z.string().optional(),
  payment_status: z.string().optional(),
  inspection_notes: z.string().optional(),
  total_price: z.number().min(0).optional(),
  total_paid_amount: z.number().min(0).optional(),
});