
'use client';

import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { useI18n } from '@/lib/i18n/context';
import { Order, OrderStatus, PaymentStatus } from '@/lib/data/order';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  Calendar,
  Clock,
  User,
  Phone,
  DollarSign,
  CreditCard,
  Eye,
  ArrowRight,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface CompactPaymentCardProps {
  order: Order;
  isProfessional?: boolean;
}

const statusConfig = {
  [OrderStatus.PENDING]: {
    label: 'Pending',
    labelNp: 'बाँकी',
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    icon: AlertCircle,
  },
  [OrderStatus.ACCEPTED]: {
    label: 'Accepted',
    labelNp: 'स्वीकृत',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    icon: CheckCircle,
  },
  [OrderStatus.INSPECTED]: {
    label: 'Inspected',
    labelNp: 'निरीक्षण गरियो',
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    icon: AlertCircle,
  },
  [OrderStatus.COMPLETED]: {
    label: 'Completed',
    labelNp: 'सम्पन्न',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    icon: CheckCircle,
  },
  [OrderStatus.CANCELLED]: {
    label: 'Cancelled',
    labelNp: 'रद्द',
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    icon: XCircle,
  },
};

const paymentStatusConfig = {
  [PaymentStatus.UNPAID]: {
    label: 'Unpaid',
    labelNp: 'भुक्तानी बाँकी',
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    icon: DollarSign,
  },
  [PaymentStatus.PARTIAL]: {
    label: 'Partial',
    labelNp: 'आंशिक भुक्तानी',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    icon: DollarSign,
  },
  [PaymentStatus.PAID]: {
    label: 'Paid',
    labelNp: 'भुक्तानी भयो',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    icon: CheckCircle,
  },
};

export function CompactPaymentCard({ order, isProfessional = false }: CompactPaymentCardProps) {
  const { t, locale } = useI18n();
  const router = useRouter();

  const status = order.order_status as OrderStatus;
  const paymentStatus = order.payment_status as PaymentStatus;
  const statusInfo = statusConfig[status];
  const paymentInfo = paymentStatusConfig[paymentStatus];

  const formattedDate = format(new Date(order.order_date), 'MMM dd, yyyy');
  const formattedTime = format(new Date(order.order_date), 'hh:mm a');

  const remainingAmount = order.payment_summary.remaining_amount;
  const paymentPercentage = order.payment_summary.payment_percentage;
  const paidAmount = order.total_paid_amount || 0;
  const totalAmount = order.total_price;

  const handleViewDetails = () => {
    router.push(`/orders/${order.id}`);
  };

  const handleMakePayment = () => {
    router.push(`/payment/${order.id}?professional=${isProfessional}`);
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        {/* Header Row */}
        <div className="flex items-start justify-between mb-3">
          <div className="min-w-0">
            <h3 className="font-semibold text-sm truncate">
              {locale === 'ne' ? order.service_name_np : order.service_name_en}
            </h3>
            <p className="text-xs text-muted-foreground truncate">
              #{order.id} • {formattedDate}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge className={`text-xs ${statusInfo.color}`}>
              {locale === 'ne' ? statusInfo.labelNp : statusInfo.label}
            </Badge>
            <Badge className={`text-xs ${paymentInfo.color}`}>
              {locale === 'ne' ? paymentInfo.labelNp : paymentInfo.label}
            </Badge>
          </div>
        </div>

        <Separator className="my-2" />

        {/* Contact Info */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">
              {isProfessional ? order.customer_name : order.professional_name}
            </span>
          </div>
          {!isProfessional && status !== OrderStatus.PENDING && (
            <div className="flex items-center gap-1">
              <Phone className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {order.customer_phone}
              </span>
            </div>
          )}
        </div>

        {/* Payment Summary */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Payment Summary</span>
            </div>
            <span className="text-sm font-bold">Rs. {totalAmount}</span>
          </div>

          {/* Progress Bar */}
          {paymentPercentage > 0 && (
            <div className="space-y-1">
              <Progress value={paymentPercentage} className="h-1.5" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{paymentPercentage.toFixed(1)}% paid</span>
                <span>Rs. {paidAmount} / Rs. {totalAmount}</span>
              </div>
            </div>
          )}

          {/* Amount Breakdown */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center justify-between p-1.5 bg-green-50 dark:bg-green-950/20 rounded">
              <span className="text-green-700 dark:text-green-300">Paid</span>
              <span className="font-medium text-green-700 dark:text-green-300">
                Rs. {paidAmount}
              </span>
            </div>
            <div className="flex items-center justify-between p-1.5 bg-orange-50 dark:bg-orange-950/20 rounded">
              <span className="text-orange-700 dark:text-orange-300">Balance</span>
              <span className="font-medium text-orange-700 dark:text-orange-300">
                Rs. {remainingAmount}
              </span>
            </div>
          </div>
        </div>

        <Separator className="my-3" />

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs"
            onClick={handleViewDetails}
          >
            <Eye className="w-3 h-3 mr-1" />
            Details
          </Button>

          {paymentStatus !== PaymentStatus.PAID && status !== OrderStatus.CANCELLED && (
            <Button
              size="sm"
              className="h-8 text-xs bg-green-600 hover:bg-green-700"
              onClick={handleMakePayment}
            >
              <CreditCard className="w-3 h-3 mr-1" />
              {isProfessional ? 'Receive Payment' : 'Make Payment'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}