'use client';

import { useState } from 'react';
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
  ChevronUp
} from 'lucide-react';
import { format } from 'date-fns';
import { useI18n } from '@/lib/i18n/context';
import { Order, OrderStatus, PaymentStatus } from '@/lib/data/order';
import { useOrderStore } from '@/stores/order-store';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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

interface OrderCardProps {
  order: Order;
  isProfessional?: boolean;
  showActions?: boolean;
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

export function OrderCard({ order, isProfessional = false, showActions = true }: OrderCardProps) {
  const { t, locale } = useI18n();
  const router = useRouter();
  const { updateOrderStatus } = useOrderStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const status = order.order_status as OrderStatus;
  const paymentStatus = order.payment_status as PaymentStatus;
  const statusInfo = statusConfig[status];
  const paymentInfo = paymentStatusConfig[paymentStatus];
  const StatusIcon = statusInfo.icon;

  const formattedDate = format(new Date(order.scheduled_date), 'MMM dd, yyyy');
  const formattedTime = format(new Date(order.scheduled_time), 'hh:mm a');

  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    try {
      await updateOrderStatus(order.id, newStatus);
      toast({
        title: 'Status Updated',
        description: `Order status updated to ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update order status',
        variant: 'destructive',
      });
    }
  };

  const handleMakePayment = () => {
    // Navigate to payment page
    router.push(`/payment/${order.id}`);
  };

  const handleViewDetails = () => {
    router.push(`/orders/${order.id}`);
  };

  const handleWriteReview = async () => {
    if (reviewRating === 0) {
      toast({
        title: 'Error',
        description: 'Please select a rating',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Call review API here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast({
        title: 'Review Submitted',
        description: 'Thank you for your feedback!',
      });
      setReviewRating(0);
      setReviewText('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit review',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const remainingAmount = order.payment_summary.remaining_amount;
  const paymentPercentage = order.payment_summary.payment_percentage;

  return (
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Service Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Service Details</span>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Quantity:</span>
                <span className="font-medium">{order.quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Quality Type:</span>
                <span className="font-medium">{order.quality_type_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Price Unit:</span>
                <span className="font-medium">{order.price_unit_id}</span>
              </div>
            </div>
          </div>

          {/* Professional/Customer Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                {isProfessional ? 'Customer Info' : 'Professional Info'}
              </span>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name:</span>
                <span className="font-medium">
                  {isProfessional ? order.customer_name : order.professional_name}
                </span>
              </div>
              {!isProfessional && order.order_status !== OrderStatus.PENDING && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone:</span>
                  <span className="font-medium">{order.customer_phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Schedule Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Schedule</span>
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
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Payment</span>
            </div>
            <div className="space-y-2">
              <div className="text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total:</span>
                  <span className="font-bold text-lg">Rs. {order.total_price}</span>
                </div>
                {order.total_paid_amount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Paid:</span>
                    <span>Rs. {order.total_paid_amount}</span>
                  </div>
                )}
                {remainingAmount > 0 && (
                  <div className="flex justify-between text-orange-600">
                    <span>Balance:</span>
                    <span>Rs. {remainingAmount}</span>
                  </div>
                )}
              </div>
              {paymentPercentage > 0 && (
                <div className="space-y-1">
                  <Progress value={paymentPercentage} className="h-2" />
                  <p className="text-xs text-muted-foreground text-center">
                    {paymentPercentage.toFixed(1)}% paid
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Expandable Details */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t space-y-3">
            {/* Address */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Address</span>
              </div>
              <p className="text-sm">
                {order.customer_address?.street_address}, {order.customer_address?.ward_no},<br />
                {order.customer_address?.municipality}, {order.customer_address?.district},<br />
                {order.customer_address?.province}
              </p>
            </div>

            {/* Notes */}
            {order.order_notes && (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Order Notes</span>
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
                  <span className="text-sm font-medium">Inspection Notes</span>
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
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 mr-2" />
              Show More Details
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
              View Details
            </Button>

            {/* Payment Button */}
            {paymentStatus !== PaymentStatus.PAID && status !== OrderStatus.CANCELLED && (
              <Button
                variant="default"
                size="sm"
                onClick={handleMakePayment}
                className="flex-1 min-w-[140px] bg-green-600 hover:bg-green-700"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Make Payment
              </Button>
            )}

            {/* Call Button */}
            {!isProfessional && order.order_status !== OrderStatus.PENDING && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1 min-w-[100px]"
                onClick={() => window.open(`tel:${order.customer_phone}`)}
              >
                <Phone className="w-4 h-4 mr-2" />
                Call
              </Button>
            )}

            {/* Message Button */}
            <Button
              variant="outline"
              size="sm"
              className="flex-1 min-w-[120px]"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Message
            </Button>

            {/* Status Actions Dropdown (for professionals) */}
            {isProfessional && status !== OrderStatus.COMPLETED && status !== OrderStatus.CANCELLED && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Update Status
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Update Order Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {status === OrderStatus.PENDING && (
                    <DropdownMenuItem onClick={() => handleStatusUpdate(OrderStatus.ACCEPTED)}>
                      Accept Order
                    </DropdownMenuItem>
                  )}
                  {status === OrderStatus.ACCEPTED && (
                    <DropdownMenuItem onClick={() => handleStatusUpdate(OrderStatus.INSPECTED)}>
                      Mark as Inspected
                    </DropdownMenuItem>
                  )}
                  {status === OrderStatus.INSPECTED && (
                    <DropdownMenuItem onClick={() => handleStatusUpdate(OrderStatus.COMPLETED)}>
                      Mark as Completed
                    </DropdownMenuItem>
                  )}
                  {/* {status !== OrderStatus.CANCELLED && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleStatusUpdate(OrderStatus.CANCELLED)}
                        className="text-red-600"
                      >
                        Cancel Order
                      </DropdownMenuItem>
                    </>
                  )} */}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Review Dialog for Completed Orders */}
            {status === OrderStatus.COMPLETED && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="default" size="sm" className="flex-1 min-w-[140px]">
                    <Star className="w-4 h-4 mr-2" />
                    Write Review
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Rate Your Experience</DialogTitle>
                    <DialogDescription>
                      Share your feedback about {isProfessional ? 'the customer' : 'the professional'}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="flex justify-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-8 h-8 ${
                              star <= reviewRating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-muted-foreground'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <Textarea
                      placeholder="Share your experience with this service..."
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      rows={4}
                    />
                    <DialogFooter>
                      <Button
                        onClick={handleWriteReview}
                        disabled={isSubmitting}
                        className="w-full"
                      >
                        {isSubmitting ? 'Submitting...' : 'Submit Review'}
                      </Button>
                    </DialogFooter>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}