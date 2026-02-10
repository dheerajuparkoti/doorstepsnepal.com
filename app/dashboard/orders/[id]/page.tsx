'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  Package,
  DollarSign,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Printer,
  Download,
  Share2,
  Star
} from 'lucide-react';
import { format } from 'date-fns';
import { useI18n } from '@/lib/i18n/context';
import { useOrderStore } from '@/stores/order-store';
import { OrderStatus, PaymentStatus } from '@/lib/data/order';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';

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

export default function OrderDetailsPage() {
  const { t, locale } = useI18n();
  const params = useParams();
  const router = useRouter();
  const orderId = parseInt(params.id as string);
  
  const { currentOrder, isLoading, error, fetchOrderById } = useOrderStore();

  useEffect(() => {
    if (orderId) {
      fetchOrderById(orderId);
    }
  }, [orderId]);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Order #${orderId}`,
          text: `Check out my order details for ${currentOrder?.service_name_en}`,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link Copied',
        description: 'Order link copied to clipboard',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 md:p-6">
        <div className="space-y-6">
          <Skeleton className="h-8 w-[200px]" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !currentOrder) {
    return (
      <div className="container mx-auto p-4 md:p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Order Not Found</h3>
            <p className="text-muted-foreground mb-4">
              {error || 'The order you are looking for does not exist.'}
            </p>
            <Button onClick={() => router.push('/orders')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Orders
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const status = currentOrder.order_status as OrderStatus;
  const paymentStatus = currentOrder.payment_status as PaymentStatus;
  const statusInfo = statusConfig[status];
  const paymentInfo = paymentStatusConfig[paymentStatus];
  const StatusIcon = statusInfo.icon;

  const formattedDate = format(new Date(currentOrder.scheduled_date), 'MMMM dd, yyyy');
  const formattedTime = format(new Date(currentOrder.scheduled_time), 'hh:mm a');
  const orderDate = format(new Date(currentOrder.order_date), 'MMMM dd, yyyy');

  const paymentSummary = currentOrder.payment_summary;

  return (
    <div className="container mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push('/orders')}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Order #{currentOrder.id}
            </h1>
            <p className="text-muted-foreground">
              {locale === 'ne' ? currentOrder.service_name_np : currentOrder.service_name_en}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Status Badges */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <Badge className={`${statusInfo.color} px-4 py-2 text-sm font-semibold`}>
          <StatusIcon className="w-4 h-4 mr-2" />
          {locale === 'ne' ? statusInfo.labelNp : statusInfo.label}
        </Badge>
        <Badge className={`${paymentInfo.color} px-4 py-2 text-sm font-semibold`}>
          {locale === 'ne' ? paymentInfo.labelNp : paymentInfo.label}
        </Badge>
        <Badge variant="outline" className="px-4 py-2">
          Order Date: {orderDate}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Service</span>
                  </div>
                  <p>{locale === 'ne' ? currentOrder.service_name_np : currentOrder.service_name_en}</p>
                  <p className="text-sm text-muted-foreground">
                    {locale === 'ne' ? currentOrder.service_description_np : currentOrder.service_description_en}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Professional</span>
                  </div>
                  <p>{currentOrder.professional_name}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-3 h-3" />
                    <span>{currentOrder.customer_phone}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Scheduled Date</span>
                  </div>
                  <p>{formattedDate}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Scheduled Time</span>
                  </div>
                  <p>{formattedTime}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Quantity & Quality</span>
                  </div>
                  <p>{currentOrder.quantity} units • Quality Type {currentOrder.quality_type_id}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardHeader>
              <CardTitle>Service Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground mt-1" />
                <div className="space-y-1">
                  <p className="font-medium">{currentOrder.customer_address.street_address}</p>
                  <p className="text-sm text-muted-foreground">
                    Ward {currentOrder.customer_address.ward_no}, {currentOrder.customer_address.municipality}<br />
                    {currentOrder.customer_address.district}, {currentOrder.customer_address.province}
                  </p>
                  <Badge variant="outline" className="mt-2">
                    {currentOrder.customer_address.type === 'temporary' ? 'Temporary Address' : 'Permanent Address'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Tabs defaultValue="order-notes" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="order-notes">Order Notes</TabsTrigger>
              <TabsTrigger value="inspection-notes">Inspection Notes</TabsTrigger>
            </TabsList>
            <TabsContent value="order-notes">
              <Card>
                <CardContent className="pt-6">
                  {currentOrder.order_notes ? (
                    <div className="prose dark:prose-invert max-w-none">
                      <p className="whitespace-pre-wrap">{currentOrder.order_notes}</p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No order notes provided</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="inspection-notes">
              <Card>
                <CardContent className="pt-6">
                  {currentOrder.inspection_notes ? (
                    <div className="prose dark:prose-invert max-w-none">
                      <p className="whitespace-pre-wrap">{currentOrder.inspection_notes}</p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No inspection notes available</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Payment & Actions */}
        <div className="space-y-6">
          {/* Payment Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Price</span>
                  <span className="font-bold text-lg">Rs. {currentOrder.total_price}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Amount Paid</span>
                  <span>Rs. {currentOrder.total_paid_amount}</span>
                </div>
                {paymentSummary.remaining_amount > 0 && (
                  <div className="flex justify-between text-orange-600">
                    <span>Balance Due</span>
                    <span>Rs. {paymentSummary.remaining_amount}</span>
                  </div>
                )}
              </div>

              {paymentSummary.payment_percentage > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Payment Progress</span>
                    <span>{paymentSummary.payment_percentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={paymentSummary.payment_percentage} className="h-2" />
                </div>
              )}

              <Separator />

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Payment Status</p>
                  <Badge className={paymentInfo.color}>
                    {locale === 'ne' ? paymentInfo.labelNp : paymentInfo.label}
                  </Badge>
                </div>
                <div>
                  <p className="text-muted-foreground">Order Status</p>
                  <Badge className={statusInfo.color}>
                    {locale === 'ne' ? statusInfo.labelNp : statusInfo.label}
                  </Badge>
                </div>
              </div>

              {paymentStatus !== PaymentStatus.PAID && status !== OrderStatus.CANCELLED && (
                <Button className="w-full" size="lg">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Make Payment
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Phone className="w-4 h-4 mr-2" />
                Call Professional
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Mail className="w-4 h-4 mr-2" />
                Send Message
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <User className="w-4 h-4 mr-2" />
                View Professional Profile
              </Button>
              
              {status === OrderStatus.PENDING && (
                <Button variant="destructive" className="w-full">
                  <XCircle className="w-4 h-4 mr-2" />
                  Cancel Order
                </Button>
              )}

              {status === OrderStatus.COMPLETED && (
                <Button className="w-full bg-yellow-600 hover:bg-yellow-700">
                  <Star className="w-4 h-4 mr-2" />
                  Rate Service
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Payment History */}
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentOrder.total_paid_amount > 0 ? (
                  <>
                    <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-950/20 rounded-md">
                      <div>
                        <p className="font-medium">Initial Payment</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(currentOrder.order_date), 'MMM dd, yyyy')}
                        </p>
                      </div>
                      <p className="font-bold text-green-600">Rs. {currentOrder.total_paid_amount}</p>
                    </div>
                    {paymentSummary.remaining_amount > 0 && (
                      <p className="text-sm text-center text-muted-foreground">
                        {paymentSummary.remaining_amount} remaining
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    No payment history available
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}