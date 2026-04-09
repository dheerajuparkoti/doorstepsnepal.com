'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Star, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Eye,
  FileText,
  CreditCard,
  User,
  Package,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Info,
  Loader2,
  Banknote
} from 'lucide-react';
import { format } from 'date-fns';
import { useI18n } from '@/lib/i18n/context';
import { Order, OrderStatus, PaymentStatus, UpdateOrderDTO } from '@/lib/data/order';
import { useOrderStore } from '@/stores/order-store';
import { useUserStore } from '@/stores/user-store';
import { usePayments } from '@/hooks/use-payment'; 
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/components/ui/use-toast';
import { NepaliDateService } from '@/lib/utils/nepaliDate';
import { CreatePaymentSheet } from '@/components/professional/payments/create-payment-sheet';
import { useNotificationStore } from '@/stores/notification-store';
import { useConfirmationDialog } from '@/hooks/use-confirmation-dialog';
import { WriteReviewDialog } from '../reviews/write-review-dialog';

interface OrderCardProps {
  order: Order;
  isProfessional?: boolean;
  showActions?: boolean;
  onPaymentSuccess?: () => void;
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
    icon: Eye,
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
  },
  [PaymentStatus.PARTIAL]: {
    label: 'Partial',
    labelNp: 'आंशिक भुक्तानी',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  },
  [PaymentStatus.PAID]: {
    label: 'Paid',
    labelNp: 'भुक्तानी भयो',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  },
};

export function OrderCard({ order, isProfessional = false, showActions = true, onPaymentSuccess }: OrderCardProps) {
  const { t, locale } = useI18n();
  const router = useRouter();
  const { user } = useUserStore();
  const { updateOrderStatus, updateOrder } = useOrderStore();
  const [isExpanded, setIsExpanded] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaymentSheetOpen, setIsPaymentSheetOpen] = useState(false);
  const { confirm, ConfirmationDialog } = useConfirmationDialog();
const { createNotification } = useNotificationStore();
  
  // Use the payments hook to check for pending payments
  const {
    payments,
    paymentSummary,
    isLoading: paymentsLoading,
    pendingPayments,
    loadPayments
  } = usePayments(order.id);

  const getLocalizedText = (en: string, np: string) => {
    return locale === 'ne' ? np : en;
  };

  const status = order.order_status as OrderStatus;
  const paymentStatus = order.payment_status as PaymentStatus;
  const statusInfo = statusConfig[status];
  const paymentInfo = paymentStatusConfig[paymentStatus];
  const StatusIcon = statusInfo.icon;

  const formattedDate = NepaliDateService.formatNepaliMonth(order.scheduled_date);
  const formattedTime = format((order.scheduled_time), 'hh:mm a');
  const orderDate = NepaliDateService.formatNepaliMonth(order.order_date);

  const remainingAmount = order.payment_summary.remaining_amount;
  const paymentPercentage = order.payment_summary.payment_percentage;

  // Check if there are any pending payments
  const hasPendingPayments = pendingPayments.length > 0;

  // Load payments when component mounts
  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    try {
      await updateOrderStatus(order.id, newStatus);
      toast({
        title: getLocalizedText('Status Updated', 'स्थिति अद्यावधिक गरियो'),
        description: getLocalizedText(
          `Order status updated to ${newStatus}`,
          `अर्डर स्थिति ${newStatus} मा अद्यावधिक गरियो`
        ),
      });
    } catch (error) {
      toast({
        title: getLocalizedText('Error', 'त्रुटि'),
        description: getLocalizedText('Failed to update order status', 'अर्डर स्थिति अद्यावधिक गर्न असफल'),
        variant: 'destructive',
      });
    }
  };

  const handleMakePayment = () => {
    // Check if there are pending payments before opening the sheet
    if (hasPendingPayments) {
      toast({
        title: getLocalizedText('Pending Payments Exist', 'पेन्डिङ भुक्तानीहरू छन्'),
        description: getLocalizedText(
          'Please wait for pending payments to be processed before adding a new one',
          'कृपया नयाँ भुक्तानी थप्नु अघि पेन्डिङ भुक्तानीहरू प्रक्रिया हुनको लागि प्रतीक्षा गर्नुहोस्'
        ),
        variant: 'destructive',
      });
      return;
    }
    
    // Open the payment sheet
    setIsPaymentSheetOpen(true);
  };

  const handleViewDetails = () => {
    router.push(`booking-details/${order.id}`);
  };
  
  const handleViewPaymentInfo = () => {
    router.push(`/dashboard/payments/orders/${order.id}`);
  };

  const handlePaymentSuccess = () => {
    // Close the payment sheet
    setIsPaymentSheetOpen(false);
    
    // Reload payments to get updated data
    loadPayments();
    
    // Show success message
    toast({
      title: getLocalizedText('Payment Successful', 'भुक्तानी सफल भयो'),
      description: getLocalizedText('Your payment has been recorded', 'तपाईंको भुक्तानी रेकर्ड गरिएको छ'),
    });
    
    // Call the parent callback if provided to refresh data
    if (onPaymentSuccess) {
      onPaymentSuccess();
    }
  };

  const handlePaymentSheetClose = () => {
    setIsPaymentSheetOpen(false);
  };


const handleCustomerApproval = async (approved: boolean) => {
  try {
    // Show confirmation dialog
    const confirmed = await confirm({
      title: approved 
        ? getLocalizedText('Accept Price Change?', 'मूल्य परिवर्तन स्वीकार गर्ने?')
        : getLocalizedText('Reject Price Change?', 'मूल्य परिवर्तन अस्वीकार गर्ने?'),
      description: approved
        ? getLocalizedText(
            `Are you sure you want to accept the new price of Rs. ${order.total_price.toLocaleString()}?`,
            `के तपाईं रु. ${order.total_price.toLocaleString()} को नयाँ मूल्य स्वीकार गर्न चाहनुहुन्छ?`
          )
        : getLocalizedText(
            'Are you sure you want to reject the price change? The professional will be notified.',
            'के तपाईं मूल्य परिवर्तन अस्वीकार गर्न चाहनुहुन्छ? प्राविधिकलाई सूचित गरिनेछ।'
          ),
      confirmText: approved 
        ? getLocalizedText('Yes, Accept', 'हो, स्वीकार गर्नुहोस्')
        : getLocalizedText('Yes, Reject', 'हो, अस्वीकार गर्नुहोस्'),
      cancelText: getLocalizedText('Cancel', 'रद्द गर्नुहोस्'),
      // Remove confirmVariant if not supported
    });

    if (!confirmed) return;

 setIsSubmitting(true);

    // Prepare update data
    const updateData: UpdateOrderDTO = {
      order_status: approved ? OrderStatus.ACCEPTED : OrderStatus.INSPECTED,
      // Keep the same price (the new price remains)
    };

    // Update order status
    await updateOrder(order.id, updateData);

    // Send notification to professional
    const notificationTitle = approved ? 'Inspection Approved' : 'Inspection Rejected';
    const notificationBody = approved
      ? `The customer has confirmed the revised inspection price of Rs. ${order.total_price.toLocaleString()}. You can now proceed with the service execution. Tap to view your job.`
      : `The customer has declined the revised inspection quotation for Rs. ${order.total_price.toLocaleString()}. Please review the request or communicate with the customer for further clarification. Tap to view your job.`;

    await createNotification({
      user_id: order.professional_user_id,
      type: 'Order Update',
      title: notificationTitle,
      body: notificationBody,
      action_route: 'order',
      custom_data: {
        orderId: order.id,
        total_price: order.total_price,
        initial_price: order.initial_price
      }
    });

    // Show success message
    toast({
      title: approved 
        ? getLocalizedText('Price Accepted', 'मूल्य स्वीकार गरियो')
        : getLocalizedText('Price Rejected', 'मूल्य अस्वीकार गरियो'),
      description: approved
        ? getLocalizedText('The professional has been notified', 'प्राविधिकलाई सूचित गरिएको छ')
        : getLocalizedText('The professional has been notified of your decision', 'तपाईंको निर्णय बारे प्राविधिकलाई सूचित गरिएको छ'),
    });

  } catch (error) {
    console.error('Failed to update order:', error);
    toast({
      title: getLocalizedText('Error', 'त्रुटि'),
      description: getLocalizedText('Failed to process your request', 'तपाईंको अनुरोध प्रक्रिया गर्न असफल'),
      variant: 'destructive',
    });
  }finally {
    setIsSubmitting(false);
  }
};





{/* Accept/Reject Buttons */}
<div className="flex gap-3 mt-4">
  <Button
    variant="outline"
    size="sm"
    onClick={() => handleCustomerApproval(false)}
    disabled={isSubmitting}
    className="flex-1 border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/30"
  >
    {isSubmitting ? (
      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
    ) : (
      <XCircle className="w-4 h-4 mr-2" />
    )}
    {getLocalizedText('Reject', 'अस्वीकार गर्नुहोस्')}
  </Button>
  
  <Button
    variant="default"
    size="sm"
    onClick={() => handleCustomerApproval(true)}
    disabled={isSubmitting}
    className="flex-1 bg-green-600 hover:bg-green-700"
  >
    {isSubmitting ? (
      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
    ) : (
      <CheckCircle className="w-4 h-4 mr-2" />
    )}
    {getLocalizedText('Accept', 'स्वीकार गर्नुहोस्')}
  </Button>
</div>

  // Determine if payment button should be shown
  const shouldShowPaymentButton = 
    paymentStatus !== PaymentStatus.PAID && 
    status !== OrderStatus.CANCELLED && 
    !hasPendingPayments; 

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">
                  {locale === 'ne' ? order.service_name_np : order.service_name_en}
                </h3>
                <Badge variant="outline" className="font-mono text-xs">
                  #{order.id}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {locale === 'ne' ? order.service_description_np : order.service_description_en}
              </p>
              
              {/* Professional/Customer Info  */}
              <div className="flex items-center gap-4 mt-2 pt-2 border-t">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {isProfessional 
                      ? getLocalizedText('Customer:', 'ग्राहक:')
                      : getLocalizedText('Professional:', 'प्राविधिक:')}
                  </span>
                  <span className="text-sm font-semibold">
                    {isProfessional ? order.customer_name : order.professional_name}
                  </span>
                </div>
                  <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    {getLocalizedText('Ordered:', 'अर्डर मिति:')} {orderDate}
                  </span>
                </div>
                
                {/* Show pending payments indicator if any */}
                {hasPendingPayments && (
                  <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span className="text-xs">
                      {getLocalizedText(
                        `${pendingPayments.length} pending`, 
                        `${pendingPayments.length} पेन्डिङ`
                      )}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge className={statusInfo.color}>
                <StatusIcon className="w-3 h-3 mr-1" />
                {locale === 'ne' ? statusInfo.labelNp : statusInfo.label}
              </Badge>
              <Badge className={paymentInfo.color}>
                {locale === 'ne' ? paymentInfo.labelNp : paymentInfo.label}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Service Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {getLocalizedText('Service Details', 'सेवा विवरण')}
                </span>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {getLocalizedText('Quantity:', 'परिमाण:')}
                  </span>
                  <span className="font-medium">{order.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {getLocalizedText('Quality Type:', 'गुणस्तर प्रकार:')}
                  </span>
                  <span className="font-medium">{order.quality_type_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {getLocalizedText('Price Unit:', 'मूल्य एकाइ:')}
                  </span>
                  <span className="font-medium">{order.price_unit_name}</span>
                </div>
                {order.has_warranty && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">
                      {getLocalizedText('Warranty:', 'वारेन्टी:')}
                    </span>
                    <span className="flex items-center gap-1 text-emerald-600 font-medium text-xs">
                      <span>🛡</span>
                      {order.warranty_duration} {order.warranty_unit}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Schedule Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {getLocalizedText('Schedule', 'तालिका')}
                </span>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{formattedTime}</span>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                   <Banknote className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {getLocalizedText('Payment', 'भुक्तानी')}
                </span>
              </div>
              <div className="space-y-2">
                <div className="text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {getLocalizedText('Total:', 'जम्मा:')}
                    </span>
                    <span className="font-bold text-lg">Rs. {order.total_price}</span>
                  </div>
                  {order.total_paid_amount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>{getLocalizedText('Paid:', 'भुक्तानी भयो:')}</span>
                      <span>Rs. {order.total_paid_amount}</span>
                    </div>
                  )}
                  {remainingAmount > 0 && (
                    <div className="flex justify-between text-orange-600">
                      <span>{getLocalizedText('Balance:', 'बाँकी:')}</span>
                      <span>Rs. {remainingAmount}</span>
                    </div>
                  )}
                </div>
                {paymentPercentage > 0 && (
                  <div className="space-y-1">
                    <Progress value={paymentPercentage} className="h-2" />
                    <p className="text-xs text-muted-foreground text-center">
                      {paymentPercentage.toFixed(1)}% {getLocalizedText('paid', 'भुक्तानी भयो')}
                    </p>
                  </div>
                )}
                
                {/* Show pending payments info if any */}
                {hasPendingPayments && (
                  <div className="mt-2 p-2 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                    <p className="text-xs text-amber-700 dark:text-amber-300 flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      {getLocalizedText(
                        `${pendingPayments.length} payment(s) pending approval`,
                        `${pendingPayments.length} भुक्तानी(हरू) पेन्डिङ छन्`
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

{/* Price Comparison for Inspected Orders */}
{!isProfessional && status === OrderStatus.INSPECTED && order.initial_price && order.inspection_notes && (
  <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
    <div className="flex items-start gap-2 mb-3">
      <Info className="w-5 h-5 text-orange-600 mt-0.5" />
      <div>
        <h4 className="text-sm font-semibold text-orange-800 dark:text-orange-200">
          {getLocalizedText('Price Update After Inspection', 'निरीक्षण पछि मूल्य अद्यावधिक')}
        </h4>
        <p className="text-xs text-orange-700 dark:text-orange-300">
          {getLocalizedText(
            'The professional has updated the price after inspection. Please review and accept or reject the new price.',
            'प्राविधिकले निरीक्षण पछि मूल्य अद्यावधिक गरेका छन्। कृपया समीक्षा गरी नयाँ मूल्य स्वीकार वा अस्वीकार गर्नुहोस्।'
          )}
        </p>
      </div>
    </div>

    {/* Price Comparison Table */}
    <div className="space-y-2 text-sm">
      {/* Previous Price */}
      <div className="flex justify-between items-center py-1 border-b border-orange-200 dark:border-orange-800">
        <span className="text-muted-foreground">
          {getLocalizedText('Previous Price:', 'पुरानो मूल्य:')}
        </span>
        <span className="font-medium line-through text-muted-foreground">
          Rs. {order.initial_price.toLocaleString()}
        </span>
      </div>

      {/* Price Difference */}
      {(() => {
        const difference = order.total_price - order.initial_price;
        const isIncrease = difference > 0;
        const isDecrease = difference < 0;
        const absoluteDiff = Math.abs(difference);
        
        return (
          <div className="flex justify-between items-center py-1 border-b border-orange-200 dark:border-orange-800">
            <span className="text-muted-foreground">
              {getLocalizedText('Price Difference:', 'मूल्य अन्तर:')}
            </span>
            <div className="flex items-center gap-1">
              {isIncrease && (
                <>
                  <span className="text-red-600 font-medium">+</span>
                  <span className="text-red-600 font-medium">Rs. {absoluteDiff.toLocaleString()}</span>
                  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                </>
              )}
              {isDecrease && (
                <>
                  <span className="text-green-600 font-medium">-</span>
                  <span className="text-green-600 font-medium">Rs. {absoluteDiff.toLocaleString()}</span>
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </>
              )}
              {!isIncrease && !isDecrease && (
                <span className="text-gray-600 font-medium">
                  {getLocalizedText('No change', 'कुनै परिवर्तन छैन')}
                </span>
              )}
            </div>
          </div>
        );
      })()}

      {/* New Price */}
      <div className="flex justify-between items-center py-1">
        <span className="font-semibold">
          {getLocalizedText('New Price:', 'नयाँ मूल्य:')}
        </span>
        <span className="font-bold text-lg text-orange-600">
          Rs. {order.total_price.toLocaleString()}
        </span>
      </div>

      {/* Inspection Notes */}
      {order.inspection_notes && (
        <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded-md">
          <p className="text-xs text-muted-foreground mb-1">
            {getLocalizedText('Inspection Notes:', 'निरीक्षण नोटहरू:')}
          </p>
          <p className="text-sm whitespace-pre-wrap">{order.inspection_notes}</p>
        </div>
      )}
    </div>

    {/* Accept/Reject Buttons */}
    <div className="flex gap-3 mt-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleCustomerApproval(false)}
        disabled={isSubmitting}
        className="flex-1 border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/30"
      >
        {isSubmitting ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <XCircle className="w-4 h-4 mr-2" />
        )}
        {getLocalizedText('Reject', 'अस्वीकार गर्नुहोस्')}
      </Button>
      
      <Button
        variant="default"
        size="sm"
        onClick={() => handleCustomerApproval(true)}
        disabled={isSubmitting}
        className="flex-1 bg-green-600 hover:bg-green-700"
      >
        {isSubmitting ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <CheckCircle className="w-4 h-4 mr-2" />
        )}
        {getLocalizedText('Accept', 'स्वीकार गर्नुहोस्')}
      </Button>
    </div>
  </div>
)}

          {/* Price Comparison for Inspected Orders - Customer View */}
{/* {!isProfessional && status === OrderStatus.INSPECTED && order.initial_price && order.inspection_notes && (
  <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
    <div className="flex items-start gap-2 mb-3">
      <Info className="w-5 h-5 text-orange-600 mt-0.5" />
      <div>
        <h4 className="text-sm font-semibold text-orange-800 dark:text-orange-200">
          {getLocalizedText('Price Update After Inspection', 'निरीक्षण पछि मूल्य अद्यावधिक')}
        </h4>
        <p className="text-xs text-orange-700 dark:text-orange-300">
          {getLocalizedText(
            'The professional has updated the price after inspection. Please review and accept or reject the new price.',
            'प्राविधिकले निरीक्षण पछि मूल्य अद्यावधिक गरेका छन्। कृपया समीक्षा गरी नयाँ मूल्य स्वीकार वा अस्वीकार गर्नुहोस्।'
          )}
        </p>
      </div>
    </div> */}

    {/* Price Comparison Table */}
    {/* <div className="space-y-2 text-sm"> */}
      {/* Previous Price */}
      {/* <div className="flex justify-between items-center py-1 border-b border-orange-200 dark:border-orange-800">
        <span className="text-muted-foreground">
          {getLocalizedText('Previous Price:', 'पुरानो मूल्य:')}
        </span>
        <span className="font-medium line-through text-muted-foreground">
          Rs. {order.initial_price.toLocaleString()}
        </span>
      </div> */}

      {/* Price Difference */}
      {/* {(() => {
        const difference = order.total_price - order.initial_price;
        const isIncrease = difference > 0;
        const isDecrease = difference < 0;
        const absoluteDiff = Math.abs(difference);
        
        return (
          <div className="flex justify-between items-center py-1 border-b border-orange-200 dark:border-orange-800">
            <span className="text-muted-foreground">
              {getLocalizedText('Price Difference:', 'मूल्य अन्तर:')}
            </span>
            <div className="flex items-center gap-1">
              {isIncrease && (
                <>
                  <span className="text-red-600 font-medium">+</span>
                  <span className="text-red-600 font-medium">Rs. {absoluteDiff.toLocaleString()}</span>
                  <span className="text-red-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                  </span>
                </>
              )}
              {isDecrease && (
                <>
                  <span className="text-green-600 font-medium">-</span>
                  <span className="text-green-600 font-medium">Rs. {absoluteDiff.toLocaleString()}</span>
                  <span className="text-green-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </span>
                </>
              )}
              {!isIncrease && !isDecrease && (
                <span className="text-gray-600 font-medium">
                  {getLocalizedText('No change', 'कुनै परिवर्तन छैन')}
                </span>
              )}
            </div>
          </div>
        );
      })()} */}

      {/* New Price */}
      {/* <div className="flex justify-between items-center py-1">
        <span className="font-semibold">
          {getLocalizedText('New Price:', 'नयाँ मूल्य:')}
        </span>
        <span className="font-bold text-lg text-orange-600">
          Rs. {order.total_price.toLocaleString()}
        </span>
      </div> */}

      {/* Inspection Notes */}
      {/* {order.inspection_notes && (
        <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded-md">
          <p className="text-xs text-muted-foreground mb-1">
            {getLocalizedText('Inspection Notes:', 'निरीक्षण नोटहरू:')}
          </p>
          <p className="text-sm">{order.inspection_notes}</p>
        </div>
      )}
    </div> */}

    {/* Accept/Reject Buttons */}
    {/* <div className="flex gap-3 mt-4">
      <Button
        variant="destructive"
        size="sm"
        onClick={() => {
          // TODO: Handle reject action
          toast({
            title: getLocalizedText('Coming Soon', 'चाँडै आउँदैछ'),
            description: getLocalizedText(
              'Reject functionality will be implemented soon',
              'अस्वीकार कार्यक्षमता चाँडै लागू हुनेछ'
            ),
          });
        }}
        className="flex-1"
      >
        <XCircle className="w-4 h-4 mr-2" />
        {getLocalizedText('Reject', 'अस्वीकार गर्नुहोस्')}
      </Button>
      <Button
        variant="default"
        size="sm"
        onClick={() => {
          // TODO: Handle accept action
          toast({
            title: getLocalizedText('Coming Soon', 'चाँडै आउँदैछ'),
            description: getLocalizedText(
              'Accept functionality will be implemented soon',
              'स्वीकार कार्यक्षमता चाँडै लागू हुनेछ'
            ),
          });
        }}
        className="flex-1 bg-green-600 hover:bg-green-700"
      >
        <CheckCircle className="w-4 h-4 mr-2" />
        {getLocalizedText('Accept', 'स्वीकार गर्नुहोस्')}
      </Button>
    </div>
  </div>
)} */}

          {/* Expandable Details (same as before) */}
          {isExpanded && (
            <div className="mt-4 pt-4 border-t space-y-3">
              {/* Address and notes sections remain the same */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {getLocalizedText('Address', 'ठेगाना')}
                  </span>
                </div>
                <p className="text-sm">
                  {order.customer_address?.street_address}, {order.customer_address?.ward_no},<br />
                  {order.customer_address?.municipality}, {order.customer_address?.district},<br />
                  {order.customer_address?.province}
                </p>
              </div>

              {order.order_notes && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {getLocalizedText('Order Notes', 'अर्डर नोटहरू')}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                    {order.order_notes}
                  </p>
                </div>
              )}

              {order.inspection_notes && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {getLocalizedText('Inspection Notes', 'निरीक्षण नोटहरू')}
                    </span>
                  </div>
                  <p className="text-sm text-blue-600 bg-blue-50 dark:bg-blue-950/30 p-3 rounded-md">
                    {order.inspection_notes}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Expand/Collapse Button */}
          <Button
            variant="ghost"
            size="sm"
            className="w-full mt-4"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4 mr-2" />
                {getLocalizedText('Show Less', 'कम देखाउनुहोस्')}
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-2" />
                {getLocalizedText('Show More Details', 'थप विवरण देखाउनुहोस्')}
              </>
            )}
          </Button>
        </CardContent>

        <Separator />

        {/* Actions */}
        {showActions && (
          <CardFooter className="pt-4">
            <div className="flex flex-wrap gap-2 w-full">
              {/* View Details Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleViewDetails}
                className="flex-1 min-w-[120px]"
              >
                <Eye className="w-4 h-4 mr-2" />
                {getLocalizedText('View Details', 'विवरण हेर्नुहोस्')}
              </Button>

              {/* Payment Button - Only show if no pending payments */}
              {shouldShowPaymentButton && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleMakePayment}
                  className="flex-1 min-w-[140px] bg-green-600 hover:bg-green-700"
                  disabled={paymentsLoading} // Disable while loading
                >
                  {paymentsLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <CreditCard className="w-4 h-4 mr-2" />
                  )}
                  {getLocalizedText('Make Payment', 'भुक्तानी गर्नुहोस्')}
                </Button>
              )}

              {/* Disabled Payment Button when pending payments exist */}
              {paymentStatus !== PaymentStatus.PAID && 
               status !== OrderStatus.CANCELLED && 
               hasPendingPayments && (
                <Button
                  variant="outline"
                  size="sm"
                  disabled
                  className="flex-1 min-w-[140px] opacity-50 cursor-not-allowed"
                  title={getLocalizedText(
                    'Cannot add payment while pending payments exist',
                    'पेन्डिङ भुक्तानीहरू भएको बेला भुक्तानी थप्न सकिँदैन'
                  )}
                >
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {getLocalizedText('Payment Pending', 'भुक्तानी पेन्डिङ')}
                </Button>
              )}

              {/* View Payment Info Button */}
              <Button
                variant="outline"
                size="sm"
                className="flex-1 min-w-[120px]"
                onClick={handleViewPaymentInfo}
              >
                <Info className="w-4 h-4 mr-2" />
                {getLocalizedText('View Payment Info', 'भुक्तानी जानकारी हेर्नुहोस्')}
              </Button>

              {/* Status Actions Dropdown (for professionals) */}
              {isProfessional && status !== OrderStatus.COMPLETED && status !== OrderStatus.CANCELLED && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      {getLocalizedText('Update Status', 'स्थिति अद्यावधिक')}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                      {getLocalizedText('Update Order Status', 'अर्डर स्थिति अद्यावधिक')}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {status === OrderStatus.PENDING && (
                      <DropdownMenuItem onClick={() => handleStatusUpdate(OrderStatus.ACCEPTED)}>
                        {getLocalizedText('Accept Order', 'अर्डर स्वीकार गर्नुहोस्')}
                      </DropdownMenuItem>
                    )}
                    {status === OrderStatus.ACCEPTED && (
                      <DropdownMenuItem onClick={() => handleStatusUpdate(OrderStatus.INSPECTED)}>
                        {getLocalizedText('Mark as Inspected', 'निरीक्षण गरियो')}
                      </DropdownMenuItem>
                    )}
                    {status === OrderStatus.INSPECTED && (
                      <DropdownMenuItem onClick={() => handleStatusUpdate(OrderStatus.COMPLETED)}>
                        {getLocalizedText('Mark as Completed', 'सम्पन्न भयो')}
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

         {/* Write Review Dialog  Customer View */}
      {!isProfessional && status === OrderStatus.COMPLETED && order.professional_service_id && (
        <WriteReviewDialog
          professionalServiceId={order.professional_service_id}
          targetName={order.professional_name}
          targetType="professional"
          onSuccess={() => {
            toast({
              title: getLocalizedText('Thank You!', 'धन्यवाद!'),
              description: getLocalizedText(
                'Your review has been posted successfully.',
                'तपाईंको समीक्षा सफलतापूर्वक पोस्ट गरिएको छ।'
              ),
            });
          }}
          trigger={
            <Button 
              variant="default" 
              size="sm" 
              className="flex-1 min-w-[140px] bg-yellow-600 hover:bg-yellow-700"
            >
              <Star className="w-4 h-4 mr-2" />
              {getLocalizedText('Write Review', 'समीक्षा लेख्नुहोस्')}
            </Button>
          }
        />
      )}
            </div>
          </CardFooter>
        )}
      </Card>

      {/* Create Payment Sheet - Only shown if no pending payments */}
      {paymentStatus !== PaymentStatus.PAID && 
       status !== OrderStatus.CANCELLED && 
       !hasPendingPayments && (
        <CreatePaymentSheet
          isOpen={isPaymentSheetOpen}
          onClose={handlePaymentSheetClose}
          orderId={order.id}
          remainingAmount={remainingAmount}
          isProfessional={isProfessional}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
      <ConfirmationDialog />
    </>
  );
}

function updateOrder(id: number, updateData: UpdateOrderDTO) {
  throw new Error('Function not implemented.');
}
