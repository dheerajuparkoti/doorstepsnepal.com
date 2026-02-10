'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  MessageSquare, 
  User,
  Package,
  DollarSign,
  CheckCircle,
  XCircle,
  Eye,
  FileText,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Calculator,
  Ruler,
  Award,
  CreditCard,
  Search,
  Edit
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
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/components/ui/use-toast';

interface ProfessionalOrderCardProps {
  order: Order;
  showActions?: boolean;
}

const statusConfig = {
  [OrderStatus.PENDING]: {
    label: 'Pending',
    labelNp: 'बाँकी',
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    icon: AlertCircle,
    bgColor: 'bg-yellow-50 dark:bg-yellow-950/10',
  },
  [OrderStatus.ACCEPTED]: {
    label: 'Accepted',
    labelNp: 'स्वीकृत',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    icon: CheckCircle,
    bgColor: 'bg-blue-50 dark:bg-blue-950/10',
  },
  [OrderStatus.INSPECTED]: {
    label: 'Inspected',
    labelNp: 'निरीक्षण गरियो',
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    icon: Search,
    bgColor: 'bg-purple-50 dark:bg-purple-950/10',
  },
  [OrderStatus.COMPLETED]: {
    label: 'Completed',
    labelNp: 'सम्पन्न',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    icon: CheckCircle,
    bgColor: 'bg-green-50 dark:bg-green-950/10',
  },
  [OrderStatus.CANCELLED]: {
    label: 'Cancelled',
    labelNp: 'रद्द',
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    icon: XCircle,
    bgColor: 'bg-red-50 dark:bg-red-950/10',
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

export function ProfessionalOrderCard({ order, showActions = true }: ProfessionalOrderCardProps) {
  const { t, locale } = useI18n();
  const router = useRouter();
  const { updateOrder } = useOrderStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isInspecting, setIsInspecting] = useState(false);
  const [inspectionNotes, setInspectionNotes] = useState('');
  const [newPrice, setNewPrice] = useState(order.total_price.toString());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const status = order.order_status as OrderStatus;
  const paymentStatus = order.payment_status as PaymentStatus;
  const statusInfo = statusConfig[status];
  const paymentInfo = paymentStatusConfig[paymentStatus];
  const StatusIcon = statusInfo.icon;

  const formattedDate = format(new Date(order.scheduled_date), 'MMM dd, yyyy');
  const formattedTime = format(new Date(order.scheduled_time), 'hh:mm a');
  const orderDate = format(new Date(order.order_date), 'MMM dd, yyyy');

  const remainingAmount = order.payment_summary.remaining_amount;
  const paymentPercentage = order.payment_summary.payment_percentage;
  const hasPaidAmount = order.total_paid_amount > 0;
  const balance = order.total_price - order.total_paid_amount;
  const isPaymentPending = paymentStatus !== PaymentStatus.PAID;

  // Mock price units and quality types - replace with actual data from your API
  const priceUnits = [
    { id: 1, name: 'Square Feet', nameNp: 'वर्ग फिट' },
    { id: 2, name: 'Square Meter', nameNp: 'वर्ग मिटर' },
    { id: 3, name: 'Piece', nameNp: 'टुक्रा' },
    { id: 4, name: 'Hour', nameNp: 'घण्टा' },
    { id: 5, name: 'Day', nameNp: 'दिन' },
  ];

  const qualityTypes = [
    { id: 1, name: 'Standard', nameNp: 'मानक' },
    { id: 2, name: 'Premium', nameNp: 'प्रिमियम' },
    { id: 3, name: 'Luxury', nameNp: 'लक्जरी' },
  ];

  const priceUnitName = priceUnits.find(u => u.id === order.price_unit_id)?.name || `Unit ${order.price_unit_id}`;
  const qualityTypeName = qualityTypes.find(q => q.id === order.quality_type_id)?.name || `Quality ${order.quality_type_id}`;

  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    try {
      setIsSubmitting(true);
      await updateOrder(order.id, { order_status: newStatus });
      toast({
        title: 'Status Updated',
        description: `Job status updated to ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update job status',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInspectionSubmit = async () => {
    if (!inspectionNotes.trim() || !newPrice.trim()) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await updateOrder(order.id, {
        order_status: OrderStatus.INSPECTED,
        inspection_notes: inspectionNotes,
        total_price: parseFloat(newPrice)
      });
      
      setIsInspecting(false);
      setInspectionNotes('');
      toast({
        title: 'Inspection Submitted',
        description: 'Job marked as inspected with updated details',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit inspection',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCallCustomer = () => {
    if (status !== OrderStatus.PENDING && order.customer_phone) {
      window.open(`tel:+977${order.customer_phone}`);
    } else {
      toast({
        title: 'Phone Not Available',
        description: 'Customer phone will be visible after accepting the job',
        variant: 'destructive',
      });
    }
  };

  const handleViewDetails = () => {
    router.push(`/jobs/${order.id}`);
  };

  const handleViewPayment = () => {
    router.push(`/payment/${order.id}?professional=true`);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardHeader className={`pb-3 ${statusInfo.bgColor}`}>
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
              Customer: {order.customer_name}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Job Details */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Job Details</span>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Quantity:</span>
                <span className="font-medium">{order.quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Quality:</span>
                <span className="font-medium">{qualityTypeName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Unit:</span>
                <span className="font-medium">{priceUnitName}</span>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Customer Info</span>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name:</span>
                <span className="font-medium">{order.customer_name}</span>
              </div>
              {status !== OrderStatus.PENDING && status !== OrderStatus.CANCELLED ? (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone:</span>
                  <span className="font-medium">{order.customer_phone}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-muted-foreground text-xs">
                  <AlertCircle className="w-3 h-3" />
                  <span>Phone visible after acceptance</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Date:</span>
                <span className="font-medium">{orderDate}</span>
              </div>
            </div>
          </div>

          {/* Schedule & Payment */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Schedule & Payment</span>
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
              <div className="flex justify-between mt-1">
                <span className="text-muted-foreground">Total:</span>
                <span className="font-bold text-lg">Rs. {order.total_price}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        {hasPaidAmount && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Payment Information
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Paid:</span>
                <span className="ml-2 font-medium text-green-600">
                  Rs. {order.total_paid_amount}
                </span>
              </div>
              {balance > 0 && (
                <div>
                  <span className="text-muted-foreground">Balance:</span>
                  <span className="ml-2 font-medium text-orange-600">
                    Rs. {balance}
                  </span>
                </div>
              )}
              {paymentPercentage > 0 && (
                <div>
                  <span className="text-muted-foreground">Progress:</span>
                  <span className="ml-2 font-medium">
                    {paymentPercentage.toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
            {paymentPercentage > 0 && (
              <Progress value={paymentPercentage} className="h-2 mt-2" />
            )}
          </div>
        )}

        {/* Expandable Details */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t space-y-3">
            {/* Address */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Service Address</span>
              </div>
              <p className="text-sm">
                {order.customer_address?.street_address}, {order.customer_address?.ward_no},<br />
                {order.customer_address?.municipality}, {order.customer_address?.district},<br />
                {order.customer_address?.province}
              </p>
              {order.customer_address?.type && (
                <Badge variant="outline" className="mt-1">
                  {order.customer_address.type === 'temporary' ? 'Temporary Address' : 'Permanent Address'}
                </Badge>
              )}
            </div>

            {/* Notes */}
            {order.order_notes && (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Customer Notes</span>
                </div>
                <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                  {order.order_notes}
                </p>
              </div>
            )}

            {order.inspection_notes && (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-muted-foreground" />
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
              Show Less Details
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

      {/* Professional Actions */}
      {showActions && (
        <CardFooter className="pt-4">
          <div className="flex flex-col gap-3 w-full">
            {/* Status-specific actions */}
            {status === OrderStatus.PENDING && (
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleStatusUpdate(OrderStatus.ACCEPTED)}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Accept Job
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleStatusUpdate(OrderStatus.CANCELLED)}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              </div>
            )}

            {status === OrderStatus.ACCEPTED && (
              <div className="flex flex-col sm:flex-row gap-2">
                <Dialog open={isInspecting} onOpenChange={setIsInspecting}>
                  <DialogTrigger asChild>
                    <Button className="flex-1">
                      <Search className="w-4 h-4 mr-2" />
                      Perform Inspection
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Site Inspection</DialogTitle>
                      <DialogDescription>
                        Update the job details after site inspection
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="bg-yellow-50 dark:bg-yellow-950/20 p-3 rounded-md">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                              Important Note
                            </p>
                            <p className="text-sm text-yellow-700 dark:text-yellow-300">
                              After marking as inspected, the price cannot be changed. 
                              Please verify all details before submitting.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="current-price">Current Price</Label>
                        <div className="flex items-center mt-1">
                          <Calculator className="w-4 h-4 mr-2 text-muted-foreground" />
                          <span className="text-lg font-bold">Rs. {order.total_price}</span>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="new-price">New Price (After Inspection)</Label>
                        <div className="flex items-center mt-1">
                          <span className="mr-2">Rs.</span>
                          <Input
                            id="new-price"
                            type="number"
                            value={newPrice}
                            onChange={(e) => setNewPrice(e.target.value)}
                            placeholder="Enter updated price"
                            min="0"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="inspection-notes">Inspection Notes</Label>
                        <Textarea
                          id="inspection-notes"
                          value={inspectionNotes}
                          onChange={(e) => setInspectionNotes(e.target.value)}
                          placeholder="Describe site conditions, any changes needed, additional requirements..."
                          rows={4}
                          className="mt-1"
                        />
                      </div>

                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setIsInspecting(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleInspectionSubmit}
                          disabled={isSubmitting || !inspectionNotes.trim() || !newPrice.trim()}
                        >
                          {isSubmitting ? 'Submitting...' : 'Submit Inspection'}
                        </Button>
                      </DialogFooter>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Button
                  variant="outline"
                  onClick={() => handleStatusUpdate(OrderStatus.COMPLETED)}
                  disabled={isSubmitting || isPaymentPending}
                  className="flex-1"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark as Completed
                </Button>
              </div>
            )}

            {status === OrderStatus.INSPECTED && (
              <Button
                onClick={() => handleStatusUpdate(OrderStatus.COMPLETED)}
                disabled={isSubmitting || isPaymentPending}
                className="w-full"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark as Completed
              </Button>
            )}

            {/* Common actions */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleViewDetails}
                className="flex-1 min-w-[120px]"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>

              {status !== OrderStatus.PENDING && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCallCustomer}
                  className="flex-1 min-w-[120px]"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Customer
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                className="flex-1 min-w-[120px]"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Message
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleViewPayment}
                className="flex-1 min-w-[140px]"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Payment Details
              </Button>
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}