// 'use client';

// import { useEffect } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { 
//   ArrowLeft, 
//   Calendar, 
//   Clock, 
//   MapPin, 
//   Phone, 
//   Mail, 
//   User, 
//   Package,
//   DollarSign,
//   FileText,
//   CheckCircle,
//   XCircle,
//   AlertCircle,
//   Printer,
//   Download,
//   Share2,
//   Star
// } from 'lucide-react';
// import { format } from 'date-fns';
// import { useI18n } from '@/lib/i18n/context';
// import { useOrderStore } from '@/stores/order-store';
// import { OrderStatus, PaymentStatus } from '@/lib/data/order';
// import { Payment} from '@/lib/data/professional/payment';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Separator } from '@/components/ui/separator';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Progress } from '@/components/ui/progress';
// import { Skeleton } from '@/components/ui/skeleton';
// import { toast } from '@/components/ui/use-toast';
// import { NepaliDateService } from '@/lib/utils/nepaliDate';

// const statusConfig = {
//   [OrderStatus.PENDING]: {
//     label: 'Pending',
//     labelNp: 'बाँकी',
//     color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
//     icon: AlertCircle,
//   },
//   [OrderStatus.ACCEPTED]: {
//     label: 'Accepted',
//     labelNp: 'स्वीकृत',
//     color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
//     icon: CheckCircle,
//   },
//   [OrderStatus.INSPECTED]: {
//     label: 'Inspected',
//     labelNp: 'निरीक्षण गरियो',
//     color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
//     icon: AlertCircle,
//   },
//   [OrderStatus.COMPLETED]: {
//     label: 'Completed',
//     labelNp: 'सम्पन्न',
//     color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
//     icon: CheckCircle,
//   },
//   [OrderStatus.CANCELLED]: {
//     label: 'Cancelled',
//     labelNp: 'रद्द',
//     color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
//     icon: XCircle,
//   },
// };

// const paymentStatusConfig = {
//   [PaymentStatus.UNPAID]: {
//     label: 'Unpaid',
//     labelNp: 'भुक्तानी बाँकी',
//     color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
//   },
//   [PaymentStatus.PARTIAL]: {
//     label: 'Partial',
//     labelNp: 'आंशिक भुक्तानी',
//     color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
//   },
//   [PaymentStatus.PAID]: {
//     label: 'Paid',
//     labelNp: 'भुक्तानी भयो',
//     color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
//   },
// };

// export default function OrderDetailsPage() {
//   const { t, locale } = useI18n();
//   const params = useParams();
//   const router = useRouter();
//   const orderId = parseInt(params.id as string);
  
//   const { currentOrder, isLoading, error, fetchOrderById } = useOrderStore();
//   const getLocalizedText = (en: string, np: string) => {
//     return locale === 'ne' ? np : en;
//   };
//   useEffect(() => {
//     if (orderId) {
//       fetchOrderById(orderId);
//     }
//   }, [orderId]);

//   const handlePrint = () => {
//     window.print();
//   };

//   const handleShare = async () => {
//     if (navigator.share) {
//       try {
//         await navigator.share({
//           title: `Order #${orderId}`,
//           text: `Check out my order details for ${currentOrder?.service_name_en}`,
//           url: window.location.href,
//         });
//       } catch (err) {
//         console.error('Error sharing:', err);
//       }
//     } else {
//       navigator.clipboard.writeText(window.location.href);
//       toast({
//         title: 'Link Copied',
//         description: 'Order link copied to clipboard',
//       });
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="container mx-auto p-4 md:p-6">
//         <div className="space-y-6">
//           <Skeleton className="h-8 w-[200px]" />
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             <div className="lg:col-span-2 space-y-6">
//               <Skeleton className="h-48 w-full" />
//               <Skeleton className="h-48 w-full" />
//             </div>
//             <div className="space-y-6">
//               <Skeleton className="h-48 w-full" />
//               <Skeleton className="h-48 w-full" />
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error || !currentOrder) {
//     return (
//       <div className="container mx-auto p-4 md:p-6">
//         <Card>
//           <CardContent className="p-8 text-center">
//             <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
//             <h3 className="text-lg font-semibold mb-2">Order Not Found</h3>
//             <p className="text-muted-foreground mb-4">
//               {error || 'The order you are looking for does not exist.'}
//             </p>
//             <Button onClick={() => router.back()}>
//               <ArrowLeft className="w-4 h-4 mr-2" />
//               Back to Orders
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   const status = currentOrder.order_status as OrderStatus;
//   const paymentStatus = currentOrder.payment_status as PaymentStatus;
//   const statusInfo = statusConfig[status];
//   const paymentInfo = paymentStatusConfig[paymentStatus];
//   const StatusIcon = statusInfo.icon;

//   const formattedDate = NepaliDateService.formatNepaliMonth(currentOrder.scheduled_date);

//   const formattedTime = format(new Date(currentOrder.scheduled_time), 'hh:mm a');
// const orderDate = NepaliDateService.formatNepaliMonth(currentOrder.order_date);

//   const paymentSummary = currentOrder.payment_summary;

//   return (
//     <div className="container mx-auto p-4 md:p-6">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
//         <div className="flex items-center gap-4">
//           <Button
//             variant="outline"
//             size="icon"
//             onClick={() => router.back()}
//           >
//             <ArrowLeft className="w-4 h-4" />
//           </Button>
//           <div>
//             <h1 className="text-3xl font-bold tracking-tight">
//               Order #{currentOrder.id}
//             </h1>
//             <p className="text-muted-foreground">
//               {locale === 'ne' ? currentOrder.service_name_np : currentOrder.service_name_en}
//             </p>
//           </div>
//         </div>
//         <div className="flex items-center gap-2">
//           <Button variant="outline" onClick={handlePrint}>
//             <Printer className="w-4 h-4 mr-2" />
//             Print
//           </Button>
//           <Button variant="outline" onClick={handleShare}>
//             <Share2 className="w-4 h-4 mr-2" />
//             Share
//           </Button>
//           <Button variant="outline">
//             <Download className="w-4 h-4 mr-2" />
//             Export
//           </Button>
//         </div>
//       </div>

//       {/* Status Badges */}
//       <div className="flex flex-wrap items-center gap-3 mb-6">
//         <Badge className={`${statusInfo.color} px-4 py-2 text-sm font-semibold`}>
//           <StatusIcon className="w-4 h-4 mr-2" />
//           {locale === 'ne' ? statusInfo.labelNp : statusInfo.label}
//         </Badge>
//         <Badge className={`${paymentInfo.color} px-4 py-2 text-sm font-semibold`}>
//           {locale === 'ne' ? paymentInfo.labelNp : paymentInfo.label}
//         </Badge>
//         <Badge variant="outline" className="px-4 py-2">
//           Order Date: {orderDate}
//         </Badge>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Left Column - Main Details */}
//         <div className="lg:col-span-2 space-y-6">
//           {/* Order Summary */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Order Summary</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <div className="flex items-center gap-2">
//                     <Package className="w-4 h-4 text-muted-foreground" />
//                     <span className="font-medium">Service</span>
//                   </div>
//                   <p>{locale === 'ne' ? currentOrder.service_name_np : currentOrder.service_name_en}</p>
//                   <p className="text-sm text-muted-foreground">
//                     {locale === 'ne' ? currentOrder.service_description_np : currentOrder.service_description_en}
//                   </p>
//                 </div>

//                 <div className="space-y-2">
//                   <div className="flex items-center gap-2">
//                     <User className="w-4 h-4 text-muted-foreground" />
//                     <span className="font-medium">Customer</span>
//                   </div>
//                   <p>{currentOrder.customer_name}</p>
             
//                    {status !== OrderStatus.PENDING && status !== OrderStatus.CANCELLED ? (
//                   <div className="flex items-center gap-2">
//                     <Phone className="w-4 h-4 text-muted-foreground" />
//                     <span className="text-sm">{currentOrder.customer_phone}</span>
//                   </div>
//                 ) : (
//                   <div className="flex items-center gap-2 text-xs text-muted-foreground">
//                     <AlertCircle className="w-3 h-3" />
//                     <span>{getLocalizedText('Phone visible after acceptance', 'फोन स्वीकार पछि मात्र देखिनेछ')}</span>
//                   </div>
//                 )}
//                 </div>
//               </div>

//               <Separator />

//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div className="space-y-2">
//                   <div className="flex items-center gap-2">
//                     <Calendar className="w-4 h-4 text-muted-foreground" />
//                     <span className="font-medium">Scheduled Date</span>
//                   </div>
//                   <p>{formattedDate}</p>
//                 </div>

//                 <div className="space-y-2">
//                   <div className="flex items-center gap-2">
//                     <Clock className="w-4 h-4 text-muted-foreground" />
//                     <span className="font-medium">Scheduled Time</span>
//                   </div>
//                   <p>{formattedTime}</p>
//                 </div>

//                 <div className="space-y-2">
//                   <div className="flex items-center gap-2">
//                     <FileText className="w-4 h-4 text-muted-foreground" />
//                     <span className="font-medium">Quantity & Quality</span>
//                   </div>
//                   <p>{currentOrder.quantity} units • Quality Type {currentOrder.quality_type_id}</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Address Information */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Service Address</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="flex items-start gap-3">
//                 <MapPin className="w-5 h-5 text-muted-foreground mt-1" />
//                 <div className="space-y-1">
//                   <p className="font-medium">{currentOrder.customer_address.street_address}</p>
//                   <p className="text-sm text-muted-foreground">
//                     Ward {currentOrder.customer_address.ward_no}, {currentOrder.customer_address.municipality}<br />
//                     {currentOrder.customer_address.district}, {currentOrder.customer_address.province}
//                   </p>
//                   <Badge variant="outline" className="mt-2">
//                     {currentOrder.customer_address.type === 'temporary' ? 'Temporary Address' : 'Permanent Address'}
//                   </Badge>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Notes */}
//           <Tabs defaultValue="order-notes" className="w-full">
//             <TabsList className="grid w-full grid-cols-2">
//               <TabsTrigger value="order-notes">Order Notes</TabsTrigger>
//               <TabsTrigger value="inspection-notes">Inspection Notes</TabsTrigger>
//             </TabsList>
//             <TabsContent value="order-notes">
//               <Card>
//                 <CardContent className="pt-6">
//                   {currentOrder.order_notes ? (
//                     <div className="prose dark:prose-invert max-w-none">
//                       <p className="whitespace-pre-wrap">{currentOrder.order_notes}</p>
//                     </div>
//                   ) : (
//                     <p className="text-muted-foreground">No order notes provided</p>
//                   )}
//                 </CardContent>
//               </Card>
//             </TabsContent>
//             <TabsContent value="inspection-notes">
//               <Card>
//                 <CardContent className="pt-6">
//                   {currentOrder.inspection_notes ? (
//                     <div className="prose dark:prose-invert max-w-none">
//                       <p className="whitespace-pre-wrap">{currentOrder.inspection_notes}</p>
//                     </div>
//                   ) : (
//                     <p className="text-muted-foreground">No inspection notes available</p>
//                   )}
//                 </CardContent>
//               </Card>
//             </TabsContent>
//           </Tabs>
//         </div>

//         {/* Right Column - Payment & Actions */}
//         <div className="space-y-6">
//           {/* Payment Summary */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Payment Summary</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="space-y-2">
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Total Price</span>
//                   <span className="font-bold text-lg">Rs. {currentOrder.total_price}</span>
//                 </div>
//                 <div className="flex justify-between text-green-600">
//                   <span>Amount Paid</span>
//                   <span>Rs. {currentOrder.total_paid_amount}</span>
//                 </div>
//                 {paymentSummary.remaining_amount > 0 && (
//                   <div className="flex justify-between text-orange-600">
//                     <span>Balance Due</span>
//                     <span>Rs. {paymentSummary.remaining_amount}</span>
//                   </div>
//                 )}
//               </div>

//               {paymentSummary.payment_percentage > 0 && (
//                 <div className="space-y-2">
//                   <div className="flex justify-between text-sm">
//                     <span>Payment Progress</span>
//                     <span>{paymentSummary.payment_percentage.toFixed(1)}%</span>
//                   </div>
//                   <Progress value={paymentSummary.payment_percentage} className="h-2" />
//                 </div>
//               )}

//               <Separator />

//               <div className="grid grid-cols-2 gap-4 text-sm">
//                 <div>
//                   <p className="text-muted-foreground">Payment Status</p>
//                   <Badge className={paymentInfo.color}>
//                     {locale === 'ne' ? paymentInfo.labelNp : paymentInfo.label}
//                   </Badge>
//                 </div>
//                 <div>
//                   <p className="text-muted-foreground">Order Status</p>
//                   <Badge className={statusInfo.color}>
//                     {locale === 'ne' ? statusInfo.labelNp : statusInfo.label}
//                   </Badge>
//                 </div>
//               </div>

//               {paymentStatus !== PaymentStatus.PAID && status !== OrderStatus.CANCELLED && (
//                 <Button className="w-full" size="lg">
//                   <DollarSign className="w-4 h-4 mr-2" />
//                   Make Payment
//                 </Button>
//               )}
//             </CardContent>
//           </Card>

//           {/* Actions */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Quick Actions</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-3">
//                  {status === OrderStatus.ACCEPTED && (
//               <Button variant="outline" className="w-full justify-start">
//                 <Phone className="w-4 h-4 mr-2" />
//                 Call Customer
//               </Button>
//                  )}
//               <Button variant="outline" className="w-full justify-start">
//                 <Mail className="w-4 h-4 mr-2" />
//                 Send Message
//               </Button>
//                {status === OrderStatus.ACCEPTED && (
//               <Button variant="outline" className="w-full justify-start">
//                 <User className="w-4 h-4 mr-2" />
//                 View Customer Profile
//               </Button>
//                )}
//                 {status === OrderStatus.PENDING && (
//                 <Button variant="outline" className="w-full">
//                   <XCircle className="w-4 h-4 mr-2" />
//                   Accept Job
//                 </Button>
//               )}
//               {status === OrderStatus.PENDING && (
//                 <Button variant="destructive" className="w-full">
//                   <XCircle className="w-4 h-4 mr-2" />
//                   Cancel Job
//                 </Button>
//               )}

//             </CardContent>
//           </Card>

        
//         </div>
//       </div>
//     </div>
//   );
// }


'use client';

import { useEffect, useState } from 'react';
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
  Star,
  Loader2,
  CreditCard
} from 'lucide-react';
import { format } from 'date-fns';
import { useI18n } from '@/lib/i18n/context';
import { useOrderStore } from '@/stores/order-store';
import { OrderStatus, PaymentStatus } from '@/lib/data/order';
import { Payment} from '@/lib/data/professional/payment';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import { NepaliDateService } from '@/lib/utils/nepaliDate';
import { usePayments } from '@/hooks/use-payment'; 
import { CreatePaymentSheet } from '@/components/professional/payments/create-payment-sheet';
import { useConfirmationDialog } from '@/hooks/use-confirmation-dialog';
import { useNotificationStore } from '@/stores/notification-store';

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
  const [isPaymentSheetOpen, setIsPaymentSheetOpen] = useState(false);
    const { confirm, ConfirmationDialog } = useConfirmationDialog();
  const { currentOrder, isLoading, error, fetchOrderById } = useOrderStore();
 const { updateOrder } = useOrderStore();
  const { createNotification } = useNotificationStore();
 
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [isInspecting, setIsInspecting] = useState(false);
  const [inspectionNotes, setInspectionNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);


    // Use the payments hook to check for pending payments
    const {
      isLoading: paymentsLoading,
      pendingPayments,
      loadPayments
    } = usePayments(orderId);
  const getLocalizedText = (en: string, np: string) => {
    return locale === 'ne' ? np : en;
  };

  useEffect(() => {
    if (orderId) {
      fetchOrderById(orderId);
    }
  }, [orderId, fetchOrderById]);

  const handlePrint = () => {
    window.print();
  };

 

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: getLocalizedText(`Order #${orderId}`, `अर्डर #${orderId}`),
          text: getLocalizedText(
            `Check out my order details for ${currentOrder?.service_name_en}`,
            `${currentOrder?.service_name_np} को अर्डर विवरण हेर्नुहोस्`
          ),
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: getLocalizedText('Link Copied', 'लिङ्क कपी गरियो'),
        description: getLocalizedText('Order link copied to clipboard', 'अर्डर लिङ्क क्लिपबोर्डमा कपी गरियो'),
      });
    }
  };

  const handlePaymentSuccess = () => {
  // Close the payment sheet
  setIsPaymentSheetOpen(false);
  
  // Refresh order data
  fetchOrderById(orderId);
  loadPayments();
  
  // Show success message
  toast({
    title: getLocalizedText('Payment Successful', 'भुक्तानी सफल भयो'),
    description: getLocalizedText('Your payment has been recorded', 'तपाईंको भुक्तानी रेकर्ड गरिएको छ'),
  });
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
            <h3 className="text-lg font-semibold mb-2">
              {getLocalizedText('Order Not Found', 'अर्डर फेला परेन')}
            </h3>
            <p className="text-muted-foreground mb-4">
              {error || getLocalizedText(
                'The order you are looking for does not exist.',
                'तपाईंले खोजिरहनु भएको अर्डर अवस्थित छैन।'
              )}
            </p>
            <Button onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {getLocalizedText('Back to Orders', 'अर्डरहरूमा फर्कनुहोस्')}
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

  const formattedDate = NepaliDateService.formatNepaliMonth(currentOrder.scheduled_date);
  const formattedTime = format(new Date(currentOrder.scheduled_time), 'hh:mm a');
  const orderDate = NepaliDateService.formatNepaliMonth(currentOrder.order_date);
  const paymentSummary = currentOrder.payment_summary;
  // Check if there are any pending payments
  const hasPendingPayments = pendingPayments.length > 0;

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


  
  // Handle status update with notifications
  const handleStatusUpdate = async (order:any, newStatus: OrderStatus) => {
    try {
      // Show confirmation dialog based on action
      let confirmTitle = '';
      let confirmDescription = '';
      
      if (newStatus === OrderStatus.ACCEPTED) {
        confirmTitle = getLocalizedText('Accept Job?', 'काम स्वीकार गर्ने?');
        confirmDescription = getLocalizedText(
          'Are you sure you want to accept this job?',
          'के तपाईं यो काम स्वीकार गर्न निश्चित हुनुहुन्छ?'
        );
      } else if (newStatus === OrderStatus.CANCELLED) {
        confirmTitle = getLocalizedText('Reject Job?', 'काम अस्वीकार गर्ने?');
        confirmDescription = getLocalizedText(
          'Are you sure you want to reject this job?',
          'के तपाईं यो काम अस्वीकार गर्न निश्चित हुनुहुन्छ?'
        );
      } else if (newStatus === OrderStatus.COMPLETED) {
        confirmTitle = getLocalizedText('Mark as Completed?', 'सम्पन्न भयो चिन्हित गर्ने?');
        confirmDescription = getLocalizedText(
          'Have you received full payment for this job?',
          'के तपाईंले यो कामको पूरा भुक्तानी प्राप्त गर्नुभएको छ?'
        );
      }

      const confirmed = await confirm({
        title: confirmTitle,
        description: confirmDescription,
        confirmText: getLocalizedText('Yes, Proceed', 'हो, अगाडि बढ्नुहोस्'),
        cancelText: getLocalizedText('Cancel', 'रद्द गर्नुहोस्'),
      });

      if (!confirmed) return;

      setIsSubmitting(true);
      
      // Update order status
      await updateOrder(order.id, { order_status: newStatus });

      // Send notification to customer based on status change
      let notificationTitle = '';
      let notificationBody = '';

      switch (newStatus) {
        case OrderStatus.ACCEPTED:
          notificationTitle = 'Order Confirmed!';
          notificationBody = 'Great news! Your service provider has accepted your booking. The professional will contact you soon to finalize details. Tap to view your order.';
          break;
        case OrderStatus.INSPECTED:
          notificationTitle = 'Inspection Completed';
          notificationBody = `The professional has inspected the site. A new price of Rs. ${order.total_price} has been proposed based on the findings. Tap to review notes.`;
          break;
        case OrderStatus.COMPLETED:
          notificationTitle = 'Service Finished!';
          notificationBody = 'Your service order is now completed. Please review the work and provide your valuable feedback.';
          break;
        case OrderStatus.CANCELLED:
          notificationTitle = 'Order Expired';
          notificationBody = 'We apologize! Your order has been automatically canceled because no professional accepted the request in time. Please try booking again or adjust your service time.';
          break;
        default:
          notificationTitle = `Order Status Change: ${newStatus}`;
          notificationBody = `The status of your service order (ID: ${order.id}) has been updated to "${newStatus}". Tap to view details.`;
      }

      await createNotification({
        user_id: order.customer_id,
        type: 'Order Update',
        title: notificationTitle,
        body: notificationBody,
        mode_channel: false,
        action_route: 'order',
        custom_data: {
          orderId: order.id,
          total_price: order.total_price,
          initial_price: order.initial_price
        }
      });

      toast({
        title: getLocalizedText('Status Updated', 'स्थिति अद्यावधिक गरियो'),
        description: getLocalizedText(
          `Job status updated to ${newStatus}`,
          `कामको स्थिति ${newStatus} मा अद्यावधिक गरियो`
        ),
      });
    } catch (error) {
      console.error('Failed to update status:', error);
      toast({
        title: getLocalizedText('Error', 'त्रुटि'),
        description: getLocalizedText('Failed to update job status', 'कामको स्थिति अद्यावधिक गर्न असफल'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };


    // Determine if payment button should be shown
  const shouldShowPaymentButton = 
    paymentStatus !== PaymentStatus.PAID && 
    status !== OrderStatus.CANCELLED && 
    !hasPendingPayments; 

  return (
    <div className="container mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {getLocalizedText(`Order #${currentOrder.id}`, `अर्डर #${currentOrder.id}`)}
            </h1>
            <p className="text-muted-foreground">
              {locale === 'ne' ? currentOrder.service_name_np : currentOrder.service_name_en}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            {getLocalizedText('Print', 'प्रिन्ट')}
          </Button>
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" />
            {getLocalizedText('Share', 'सेयर')}
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
          {getLocalizedText('Order Date:', 'अर्डर मिति:')} {orderDate}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>{getLocalizedText('Order Summary', 'अर्डर सारांश')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{getLocalizedText('Service', 'सेवा')}</span>
                  </div>
                  <p>{locale === 'ne' ? currentOrder.service_name_np : currentOrder.service_name_en}</p>
                  <p className="text-sm text-muted-foreground">
                    {locale === 'ne' ? currentOrder.service_description_np : currentOrder.service_description_en}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{getLocalizedText('Customer', 'ग्राहक')}</span>
                  </div>
                  <p>{currentOrder.customer_name}</p>
             
                  {status !== OrderStatus.PENDING && status !== OrderStatus.CANCELLED ? (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{currentOrder.customer_phone}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <AlertCircle className="w-3 h-3" />
                      <span>{getLocalizedText('Phone visible after acceptance', 'फोन स्वीकार पछि मात्र देखिनेछ')}</span>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{getLocalizedText('Scheduled Date', 'निर्धारित मिति')}</span>
                  </div>
                  <p>{formattedDate}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{getLocalizedText('Scheduled Time', 'निर्धारित समय')}</span>
                  </div>
                  <p>{formattedTime}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{getLocalizedText('Quantity & Quality', 'मात्रा र गुणस्तर')}</span>
                  </div>
                  <p>
                    {currentOrder.quantity} {getLocalizedText('units', 'एकाइ')} • 
                    {getLocalizedText(' Quality Type ', ' गुणस्तर प्रकार ')}{currentOrder.quality_type_id}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
{/* Address Information */}
<Card>
  <CardHeader>
    <CardTitle>{getLocalizedText('Service Address', 'सेवा ठेगाना')}</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="flex items-start gap-3">
      <MapPin className="w-5 h-5 text-muted-foreground mt-1" />
      <div className="space-y-1">
        {currentOrder.customer_address ? (
          <>
            <p className="font-medium">{currentOrder.customer_address.street_address || 'N/A'}</p>
            <p className="text-sm text-muted-foreground">
              {currentOrder.customer_address.municipality || ''} {currentOrder.customer_address.ward_no || ''},<br />
              {currentOrder.customer_address.district || ''}, {currentOrder.customer_address.province || ''}
            </p>
            <Badge variant="outline" className="mt-2">
              {currentOrder.customer_address.type === 'temporary' 
                ? getLocalizedText('Temporary Address', 'अस्थायी ठेगाना')
                : getLocalizedText('Permanent Address', 'स्थायी ठेगाना')}
            </Badge>
          </>
        ) : (
          <p className="text-muted-foreground">
            {getLocalizedText('Address not available', 'ठेगाना उपलब्ध छैन')}
          </p>
        )}
      </div>
    </div>
  </CardContent>
</Card>

          {/* Notes */}
          <Tabs defaultValue="order-notes" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="order-notes">
                {getLocalizedText('Order Notes', 'अर्डर नोटहरू')}
              </TabsTrigger>
              <TabsTrigger value="inspection-notes">
                {getLocalizedText('Inspection Notes', 'निरीक्षण नोटहरू')}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="order-notes">
              <Card>
                <CardContent className="pt-6">
                  {currentOrder.order_notes ? (
                    <div className="prose dark:prose-invert max-w-none">
                      <p className="whitespace-pre-wrap">{currentOrder.order_notes}</p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      {getLocalizedText('No order notes provided', 'कुनै अर्डर नोट प्रदान गरिएको छैन')}
                    </p>
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
                    <p className="text-muted-foreground">
                      {getLocalizedText('No inspection notes available', 'कुनै निरीक्षण नोट उपलब्ध छैन')}
                    </p>
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
    <CardTitle>{getLocalizedText('Payment Summary', 'भुक्तानी सारांश')}</CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    <div className="space-y-2">
      <div className="flex justify-between">
        <span className="text-muted-foreground">{getLocalizedText('Total Price', 'कुल मूल्य')}</span>
        <span className="font-bold text-lg">Rs. {currentOrder.total_price || 0}</span>
      </div>
      <div className="flex justify-between text-green-600">
        <span>{getLocalizedText('Amount Paid', 'भुक्तानी रकम')}</span>
        <span>Rs. {currentOrder.total_paid_amount || 0}</span>
      </div>
      
      {/* Safely check if paymentSummary exists before accessing properties */}
      {paymentSummary && paymentSummary.remaining_amount > 0 && (
        <div className="flex justify-between text-orange-600">
          <span>{getLocalizedText('Balance Due', 'बाँकी रकम')}</span>
          <span>Rs. {paymentSummary.remaining_amount}</span>
        </div>
      )}
    </div>

    {/* Safely check if paymentSummary exists before showing progress */}
    {paymentSummary && paymentSummary.payment_percentage > 0 && (
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>{getLocalizedText('Payment Progress', 'भुक्तानी प्रगति')}</span>
          <span>{paymentSummary.payment_percentage.toFixed(1)}%</span>
        </div>
        <Progress value={paymentSummary.payment_percentage} className="h-2" />
      </div>
    )}

    <Separator />

    <div className="grid grid-cols-2 gap-4 text-sm">
      <div>
        <p className="text-muted-foreground">{getLocalizedText('Payment Status', 'भुक्तानी स्थिति')}</p>
        <Badge className={paymentInfo.color}>
          {locale === 'ne' ? paymentInfo.labelNp : paymentInfo.label}
        </Badge>
      </div>
      <div>
        <p className="text-muted-foreground">{getLocalizedText('Order Status', 'अर्डर स्थिति')}</p>
        <Badge className={statusInfo.color}>
          {locale === 'ne' ? statusInfo.labelNp : statusInfo.label}
        </Badge>
      </div>
    </div>

    {/* Payment Button - Only show if no pending payments */}
    {shouldShowPaymentButton && (
      <Button
        variant="default"
        size="lg"
        onClick={handleMakePayment}
        className="flex-1 w-full bg-green-600 hover:bg-green-700"
        disabled={paymentsLoading} 
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
  </CardContent>
</Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>{getLocalizedText('Quick Actions', 'द्रुत कार्यहरू')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {status === OrderStatus.ACCEPTED && (
                <Button variant="outline" className="w-full justify-start">
                  <Phone className="w-4 h-4 mr-2" />
                  {getLocalizedText('Call Customer', 'ग्राहकलाई फोन गर्नुहोस्')}
                </Button>
              )}
              {/* <Button variant="outline" className="w-full justify-start">
                <Mail className="w-4 h-4 mr-2" />
                {getLocalizedText('Send Message', 'सन्देश पठाउनुहोस्')}
              </Button> */}
             {status === OrderStatus.ACCEPTED && (
  <Button 
    variant="outline" 
    className="w-full justify-start"
    onClick={() => router.push(`/dashboard/profile/customer/${currentOrder.customer_id}`)}
  >
    <User className="w-4 h-4 mr-2" />
    {getLocalizedText('View Customer Profile', 'ग्राहक प्रोफाइल हेर्नुहोस्')}
  </Button>
)}
              {status === OrderStatus.PENDING && (
                <Button variant="outline"
                  onClick={() => handleStatusUpdate(currentOrder,OrderStatus.ACCEPTED)}
                      disabled={isSubmitting}
                 className="w-full">
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    )}
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {getLocalizedText('Accept Job', 'काम स्वीकार गर्नुहोस्')}
                </Button>


              )}
              {status === OrderStatus.PENDING && (
                <Button variant="destructive" 
                    onClick={() => handleStatusUpdate(currentOrder,OrderStatus.CANCELLED)}
                    disabled={isSubmitting}
                className="w-full">
                 {isSubmitting ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <XCircle className="w-4 h-4 mr-2" />
                    )}
                          {getLocalizedText('Reject', 'अस्वीकार गर्नुहोस्')}
                </Button>




                
              )}
            </CardContent>
            
          </Card>
  {/* Add CreatePaymentSheet here - after both cards */}
  {currentOrder && paymentStatus !== PaymentStatus.PAID && 
   status !== OrderStatus.CANCELLED && 
   !hasPendingPayments && (
   <CreatePaymentSheet
  isOpen={isPaymentSheetOpen}
  onClose={() => setIsPaymentSheetOpen(false)}
  orderId={orderId}
  remainingAmount={paymentSummary?.remaining_amount || 0}
  isProfessional={true}
  onPaymentSuccess={handlePaymentSuccess}
/>
  )}
      
        </div>
        
      </div>
         <ConfirmationDialog />
    </div>
    
  );
}