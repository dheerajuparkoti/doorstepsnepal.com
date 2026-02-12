import { PaymentMethod } from "./payment";

export const WITHDRAWAL_CONSTANTS = {
  MINIMUM_WITHDRAWAL: 1000,
  PROCESSING_DAYS: '3-5 business days'
} as const;

export const PAYMENT_CONSTANTS = {
  MINIMUM_AMOUNT: 10
} as const;

export const QUICK_FILTERS = [
  { key: 'all', label: 'All', days: null },
  { key: '3_days', label: '3 Days', days: 3 },
  { key: 'week', label: 'Week', days: 7 },
  { key: '15_days', label: '15 Days', days: 15 },
  { key: 'month', label: 'Month', days: 30 },
  { key: '3_months', label: '3 Months', days: 90 },
  { key: '6_months', label: '6 Months', days: 180 },
  { key: 'year', label: 'Year', days: 365 }
] as const;

export const QR_CODE_PATHS: Record<PaymentMethod, string> = {
  [PaymentMethod.KHALTI]: '/images/qr/khalti_qr.png',
  [PaymentMethod.ESEWA]: '/images/qr/esewa_qr.png',
  [PaymentMethod.FONEPAY]: '/images/qr/fonepay_qr.png',
  [PaymentMethod.IMEPAY]: '/images/qr/imepay_qr.png',
  [PaymentMethod.MOBILE_BANKING]: '/images/qr/mobile_banking_qr.png',
  [PaymentMethod.BANK_TRANSFER]: '',
  [PaymentMethod.CASH]: '',
  [PaymentMethod.CARD]: '',
  [PaymentMethod.DIGITAL_WALLET]: ''
};