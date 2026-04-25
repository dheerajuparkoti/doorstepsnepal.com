// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { 
//   Calendar, 
//   Clock, 
//   MapPin, 
//   Phone, 
//   MessageSquare, 
//   User,
//   Package,
//   DollarSign,
//   CheckCircle,
//   XCircle,
//   Eye,
//   FileText,
//   AlertCircle,
//   ChevronDown,
//   ChevronUp,
//   Calculator,
//   Ruler,
//   Award,
//   CreditCard,
//   Search,
//   Edit
// } from 'lucide-react';
// import { format } from 'date-fns';
// import { useI18n } from '@/lib/i18n/context';
// import { Order, OrderStatus, PaymentStatus } from '@/lib/data/order';
// import { useOrderStore } from '@/stores/order-store';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
// import { Separator } from '@/components/ui/separator';
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from '@/components/ui/dialog';
// import { Textarea } from '@/components/ui/textarea';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Progress } from '@/components/ui/progress';
// import { toast } from '@/components/ui/use-toast';

// interface ProfessionalOrderCardProps {
//   order: Order;
//   showActions?: boolean;
// }

// const statusConfig = {
//   [OrderStatus.PENDING]: {
//     label: 'Pending',
//     labelNp: 'बाँकी',
//     color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
//     icon: AlertCircle,
//     bgColor: 'bg-yellow-50 dark:bg-yellow-950/10',
//   },
//   [OrderStatus.ACCEPTED]: {
//     label: 'Accepted',
//     labelNp: 'स्वीकृत',
//     color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
//     icon: CheckCircle,
//     bgColor: 'bg-blue-50 dark:bg-blue-950/10',
//   },
//   [OrderStatus.INSPECTED]: {
//     label: 'Inspected',
//     labelNp: 'निरीक्षण गरियो',
//     color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
//     icon: Search,
//     bgColor: 'bg-purple-50 dark:bg-purple-950/10',
//   },
//   [OrderStatus.COMPLETED]: {
//     label: 'Completed',
//     labelNp: 'सम्पन्न',
//     color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
//     icon: CheckCircle,
//     bgColor: 'bg-green-50 dark:bg-green-950/10',
//   },
//   [OrderStatus.CANCELLED]: {
//     label: 'Cancelled',
//     labelNp: 'रद्द',
//     color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
//     icon: XCircle,
//     bgColor: 'bg-red-50 dark:bg-red-950/10',
//   },
// };

// const paymentStatusConfig = {
//   [PaymentStatus.UNPAID]: {
//     label: 'Unpaid',
//     labelNp: 'भुक्तानी बाँकी',
//     color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
//     icon: DollarSign,
//   },
//   [PaymentStatus.PARTIAL]: {
//     label: 'Partial',
//     labelNp: 'आंशिक भुक्तानी',
//     color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
//     icon: DollarSign,
//   },
//   [PaymentStatus.PAID]: {
//     label: 'Paid',
//     labelNp: 'भुक्तानी भयो',
//     color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
//     icon: CheckCircle,
//   },
// };

// export function ProfessionalOrderCard({ order, showActions = true }: ProfessionalOrderCardProps) {
//   const { t, locale } = useI18n();
//   const router = useRouter();
//   const { updateOrder } = useOrderStore();
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [isInspecting, setIsInspecting] = useState(false);
//   const [inspectionNotes, setInspectionNotes] = useState('');
//   const [newPrice, setNewPrice] = useState(order.total_price.toString());
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const status = order.order_status as OrderStatus;
//   const paymentStatus = order.payment_status as PaymentStatus;
//   const statusInfo = statusConfig[status];
//   const paymentInfo = paymentStatusConfig[paymentStatus];
//   const StatusIcon = statusInfo.icon;

//   const formattedDate = format(new Date(order.scheduled_date), 'MMM dd, yyyy');
//   const formattedTime = format(new Date(order.scheduled_time), 'hh:mm a');
//   const orderDate = format(new Date(order.order_date), 'MMM dd, yyyy');

//   const remainingAmount = order.payment_summary.remaining_amount;
//   const paymentPercentage = order.payment_summary.payment_percentage;
//   const hasPaidAmount = order.total_paid_amount > 0;
//   const balance = order.total_price - order.total_paid_amount;
//   const isPaymentPending = paymentStatus !== PaymentStatus.PAID;

//   // Mock price units and quality types - replace with actual data from your API
//   const priceUnits = [
//     { id: 1, name: 'Square Feet', nameNp: 'वर्ग फिट' },
//     { id: 2, name: 'Square Meter', nameNp: 'वर्ग मिटर' },
//     { id: 3, name: 'Piece', nameNp: 'टुक्रा' },
//     { id: 4, name: 'Hour', nameNp: 'घण्टा' },
//     { id: 5, name: 'Day', nameNp: 'दिन' },
//   ];

//   const qualityTypes = [
//     { id: 1, name: 'Standard', nameNp: 'मानक' },
//     { id: 2, name: 'Premium', nameNp: 'प्रिमियम' },
//     { id: 3, name: 'Luxury', nameNp: 'लक्जरी' },
//   ];

//   const priceUnitName = priceUnits.find(u => u.id === order.price_unit_id)?.name || `Unit ${order.price_unit_id}`;
//   const qualityTypeName = qualityTypes.find(q => q.id === order.quality_type_id)?.name || `Quality ${order.quality_type_id}`;

//   const handleStatusUpdate = async (newStatus: OrderStatus) => {
//     try {
//       setIsSubmitting(true);
//       await updateOrder(order.id, { order_status: newStatus });
//       toast({
//         title: 'Status Updated',
//         description: `Job status updated to ${newStatus}`,
//       });
//     } catch (error) {
//       toast({
//         title: 'Error',
//         description: 'Failed to update job status',
//         variant: 'destructive',
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleInspectionSubmit = async () => {
//     if (!inspectionNotes.trim() || !newPrice.trim()) {
//       toast({
//         title: 'Error',
//         description: 'Please fill in all required fields',
//         variant: 'destructive',
//       });
//       return;
//     }

//     try {
//       setIsSubmitting(true);
//       await updateOrder(order.id, {
//         order_status: OrderStatus.INSPECTED,
//         inspection_notes: inspectionNotes,
//         total_price: parseFloat(newPrice)
//       });
      
//       setIsInspecting(false);
//       setInspectionNotes('');
//       toast({
//         title: 'Inspection Submitted',
//         description: 'Job marked as inspected with updated details',
//       });
//     } catch (error) {
//       toast({
//         title: 'Error',
//         description: 'Failed to submit inspection',
//         variant: 'destructive',
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleCallCustomer = () => {
//     if (status !== OrderStatus.PENDING && order.customer_phone) {
//       window.open(`tel:+977${order.customer_phone}`);
//     } else {
//       toast({
//         title: 'Phone Not Available',
//         description: 'Customer phone will be visible after accepting the job',
//         variant: 'destructive',
//       });
//     }
//   };

//   const handleViewDetails = () => {
//     // router.push(`/jobs/${order.id}`);
//   };

//   const handleViewPayment = () => {
//     // router.push(`/payment/${order.id}?professional=true`);
//   };

//   return (
//     <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
//       <CardHeader className={`pb-3 ${statusInfo.bgColor}`}>
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
//           <div className="space-y-1">
//             <div className="flex items-center gap-2">
//               <h3 className="font-semibold text-lg">
//                 {locale === 'ne' ? order.service_name_np : order.service_name_en}
//               </h3>
//               <Badge variant="outline" className="font-mono text-xs">
//                 #{order.id}
//               </Badge>
//             </div>
//             <p className="text-sm text-muted-foreground">
//               Customer: {order.customer_name}
//             </p>
//           </div>
//           <div className="flex items-center gap-2">
//             <Badge className={statusInfo.color}>
//               <StatusIcon className="w-3 h-3 mr-1" />
//               {locale === 'ne' ? statusInfo.labelNp : statusInfo.label}
//             </Badge>
//             <Badge className={paymentInfo.color}>
//               {locale === 'ne' ? paymentInfo.labelNp : paymentInfo.label}
//             </Badge>
//           </div>
//         </div>
//       </CardHeader>

//       <Separator />

//       <CardContent className="pt-4">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {/* Job Details */}
//           <div className="space-y-2">
//             <div className="flex items-center gap-2">
//               <Package className="w-4 h-4 text-muted-foreground" />
//               <span className="text-sm font-medium">Job Details</span>
//             </div>
//             <div className="space-y-1 text-sm">
//               <div className="flex justify-between">
//                 <span className="text-muted-foreground">Quantity:</span>
//                 <span className="font-medium">{order.quantity}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-muted-foreground">Quality:</span>
//                 <span className="font-medium">{qualityTypeName}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-muted-foreground">Unit:</span>
//                 <span className="font-medium">{priceUnitName}</span>
//               </div>
//             </div>
//           </div>

//           {/* Customer Info */}
//           <div className="space-y-2">
//             <div className="flex items-center gap-2">
//               <User className="w-4 h-4 text-muted-foreground" />
//               <span className="text-sm font-medium">Customer Info</span>
//             </div>
//             <div className="space-y-1 text-sm">
//               <div className="flex justify-between">
//                 <span className="text-muted-foreground">Name:</span>
//                 <span className="font-medium">{order.customer_name}</span>
//               </div>
//               {status !== OrderStatus.PENDING && status !== OrderStatus.CANCELLED ? (
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Phone:</span>
//                   <span className="font-medium">{order.customer_phone}</span>
//                 </div>
//               ) : (
//                 <div className="flex items-center gap-2 text-muted-foreground text-xs">
//                   <AlertCircle className="w-3 h-3" />
//                   <span>Phone visible after acceptance</span>
//                 </div>
//               )}
//               <div className="flex justify-between">
//                 <span className="text-muted-foreground">Order Date:</span>
//                 <span className="font-medium">{orderDate}</span>
//               </div>
//             </div>
//           </div>

//           {/* Schedule & Payment */}
//           <div className="space-y-2">
//             <div className="flex items-center gap-2">
//               <Calendar className="w-4 h-4 text-muted-foreground" />
//               <span className="text-sm font-medium">Schedule & Payment</span>
//             </div>
//             <div className="space-y-1 text-sm">
//               <div className="flex items-center gap-2">
//                 <Calendar className="w-4 h-4" />
//                 <span>{formattedDate}</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Clock className="w-4 h-4" />
//                 <span>{formattedTime}</span>
//               </div>
//               <div className="flex justify-between mt-1">
//                 <span className="text-muted-foreground">Total:</span>
//                 <span className="font-bold text-lg">Rs. {order.total_price}</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Payment Information */}
//         {hasPaidAmount && (
//           <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
//             <div className="flex items-center gap-2 mb-2">
//               <CreditCard className="w-4 h-4 text-blue-600" />
//               <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
//                 Payment Information
//               </span>
//             </div>
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
//               <div>
//                 <span className="text-muted-foreground">Paid:</span>
//                 <span className="ml-2 font-medium text-green-600">
//                   Rs. {order.total_paid_amount}
//                 </span>
//               </div>
//               {balance > 0 && (
//                 <div>
//                   <span className="text-muted-foreground">Balance:</span>
//                   <span className="ml-2 font-medium text-orange-600">
//                     Rs. {balance}
//                   </span>
//                 </div>
//               )}
//               {paymentPercentage > 0 && (
//                 <div>
//                   <span className="text-muted-foreground">Progress:</span>
//                   <span className="ml-2 font-medium">
//                     {paymentPercentage.toFixed(1)}%
//                   </span>
//                 </div>
//               )}
//             </div>
//             {paymentPercentage > 0 && (
//               <Progress value={paymentPercentage} className="h-2 mt-2" />
//             )}
//           </div>
//         )}

//         {/* Expandable Details */}
//         {isExpanded && (
//           <div className="mt-4 pt-4 border-t space-y-3">
//             {/* Address */}
//             <div className="space-y-1">
//               <div className="flex items-center gap-2">
//                 <MapPin className="w-4 h-4 text-muted-foreground" />
//                 <span className="text-sm font-medium">Service Address</span>
//               </div>
//               <p className="text-sm">
//                 {order.customer_address?.street_address}, {order.customer_address?.ward_no},<br />
//                 {order.customer_address?.municipality}, {order.customer_address?.district},<br />
//                 {order.customer_address?.province}
//               </p>
//               {order.customer_address?.type && (
//                 <Badge variant="outline" className="mt-1">
//                   {order.customer_address.type === 'temporary' ? 'Temporary Address' : 'Permanent Address'}
//                 </Badge>
//               )}
//             </div>

//             {/* Notes */}
//             {order.order_notes && (
//               <div className="space-y-1">
//                 <div className="flex items-center gap-2">
//                   <FileText className="w-4 h-4 text-muted-foreground" />
//                   <span className="text-sm font-medium">Customer Notes</span>
//                 </div>
//                 <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
//                   {order.order_notes}
//                 </p>
//               </div>
//             )}

//             {order.inspection_notes && (
//               <div className="space-y-1">
//                 <div className="flex items-center gap-2">
//                   <Search className="w-4 h-4 text-muted-foreground" />
//                   <span className="text-sm font-medium">Inspection Notes</span>
//                 </div>
//                 <p className="text-sm text-blue-600 bg-blue-50 dark:bg-blue-950/30 p-3 rounded-md">
//                   {order.inspection_notes}
//                 </p>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Expand/Collapse Button */}
//         <Button
//           variant="ghost"
//           size="sm"
//           className="w-full mt-4"
//           onClick={() => setIsExpanded(!isExpanded)}
//         >
//           {isExpanded ? (
//             <>
//               <ChevronUp className="w-4 h-4 mr-2" />
//               Show Less Details
//             </>
//           ) : (
//             <>
//               <ChevronDown className="w-4 h-4 mr-2" />
//               Show More Details
//             </>
//           )}
//         </Button>
//       </CardContent>

//       <Separator />

//       {/* Professional Actions */}
//       {showActions && (
//         <CardFooter className="pt-4">
//           <div className="flex flex-col gap-3 w-full">
//             {/* Status-specific actions */}
//             {status === OrderStatus.PENDING && (
//               <div className="flex flex-col sm:flex-row gap-2">
//                 <Button
//                   variant="outline"
//                   onClick={() => handleStatusUpdate(OrderStatus.ACCEPTED)}
//                   disabled={isSubmitting}
//                   className="flex-1"
//                 >
//                   <CheckCircle className="w-4 h-4 mr-2" />
//                   Accept Job
//                 </Button>
//                 <Button
//                   variant="destructive"
//                   onClick={() => handleStatusUpdate(OrderStatus.CANCELLED)}
//                   disabled={isSubmitting}
//                   className="flex-1"
//                 >
//                   <XCircle className="w-4 h-4 mr-2" />
//                   Reject
//                 </Button>
//               </div>
//             )}

//             {status === OrderStatus.ACCEPTED && (
//               <div className="flex flex-col sm:flex-row gap-2">
//                 <Dialog open={isInspecting} onOpenChange={setIsInspecting}>
//                   <DialogTrigger asChild>
//                     <Button className="flex-1">
//                       <Search className="w-4 h-4 mr-2" />
//                       Perform Inspection
//                     </Button>
//                   </DialogTrigger>
//                   <DialogContent>
//                     <DialogHeader>
//                       <DialogTitle>Site Inspection</DialogTitle>
//                       <DialogDescription>
//                         Update the job details after site inspection
//                       </DialogDescription>
//                     </DialogHeader>
//                     <div className="space-y-4">
//                       <div className="bg-yellow-50 dark:bg-yellow-950/20 p-3 rounded-md">
//                         <div className="flex items-start gap-2">
//                           <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
//                           <div>
//                             <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
//                               Important Note
//                             </p>
//                             <p className="text-sm text-yellow-700 dark:text-yellow-300">
//                               After marking as inspected, the price cannot be changed. 
//                               Please verify all details before submitting.
//                             </p>
//                           </div>
//                         </div>
//                       </div>

//                       <div>
//                         <Label htmlFor="current-price">Current Price</Label>
//                         <div className="flex items-center mt-1">
//                           <Calculator className="w-4 h-4 mr-2 text-muted-foreground" />
//                           <span className="text-lg font-bold">Rs. {order.total_price}</span>
//                         </div>
//                       </div>

//                       <div>
//                         <Label htmlFor="new-price">New Price (After Inspection)</Label>
//                         <div className="flex items-center mt-1">
//                           <span className="mr-2">Rs.</span>
//                           <Input
//                             id="new-price"
//                             type="number"
//                             value={newPrice}
//                             onChange={(e) => setNewPrice(e.target.value)}
//                             placeholder="Enter updated price"
//                             min="0"
//                           />
//                         </div>
//                       </div>

//                       <div>
//                         <Label htmlFor="inspection-notes">Inspection Notes</Label>
//                         <Textarea
//                           id="inspection-notes"
//                           value={inspectionNotes}
//                           onChange={(e) => setInspectionNotes(e.target.value)}
//                           placeholder="Describe site conditions, any changes needed, additional requirements..."
//                           rows={4}
//                           className="mt-1"
//                         />
//                       </div>

//                       <DialogFooter>
//                         <Button
//                           variant="outline"
//                           onClick={() => setIsInspecting(false)}
//                         >
//                           Cancel
//                         </Button>
//                         <Button
//                           onClick={handleInspectionSubmit}
//                           disabled={isSubmitting || !inspectionNotes.trim() || !newPrice.trim()}
//                         >
//                           {isSubmitting ? 'Submitting...' : 'Submit Inspection'}
//                         </Button>
//                       </DialogFooter>
//                     </div>
//                   </DialogContent>
//                 </Dialog>
                
//                 <Button
//                   variant="outline"
//                   onClick={() => handleStatusUpdate(OrderStatus.COMPLETED)}
//                   disabled={isSubmitting || isPaymentPending}
//                   className="flex-1"
//                 >
//                   <CheckCircle className="w-4 h-4 mr-2" />
//                   Mark as Completed
//                 </Button>
//               </div>
//             )}

//             {status === OrderStatus.INSPECTED && (
//               <Button
//                 onClick={() => handleStatusUpdate(OrderStatus.COMPLETED)}
//                 disabled={isSubmitting || isPaymentPending}
//                 className="w-full"
//               >
//                 <CheckCircle className="w-4 h-4 mr-2" />
//                 Mark as Completed
//               </Button>
//             )}

//             {/* Common actions */}
//             <div className="flex flex-wrap gap-2">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={handleViewDetails}
//                 className="flex-1 min-w-[120px]"
//               >
//                 <Eye className="w-4 h-4 mr-2" />
//                 View Details
//               </Button>

//               {status !== OrderStatus.PENDING && (
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={handleCallCustomer}
//                   className="flex-1 min-w-[120px]"
//                 >
//                   <Phone className="w-4 h-4 mr-2" />
//                   Call Customer
//                 </Button>
//               )}

//               <Button
//                 variant="outline"
//                 size="sm"
//                 className="flex-1 min-w-[120px]"
//               >
//                 <MessageSquare className="w-4 h-4 mr-2" />
//                 Message
//               </Button>

//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={handleViewPayment}
//                 className="flex-1 min-w-[140px]"
//               >
//                 <CreditCard className="w-4 h-4 mr-2" />
//                 Payment Details
//               </Button>
//             </div>
//           </div>
//         </CardFooter>
//       )}
//     </Card>
//   );
// }


// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { 
//   Calendar, 
//   Clock, 
//   MapPin, 
//   Phone, 
//   MessageSquare, 
//   User,
//   Package,
//   DollarSign,
//   CheckCircle,
//   XCircle,
//   Eye,
//   FileText,
//   AlertCircle,
//   ChevronDown,
//   ChevronUp,
//   Calculator,
//   Ruler,
//   Award,
//   CreditCard,
//   Search,
//   Edit,
//   Loader2
// } from 'lucide-react';
// import { format } from 'date-fns';
// import { useI18n } from '@/lib/i18n/context';
// import { Order, OrderStatus, PaymentStatus } from '@/lib/data/order';
// import { useOrderStore } from '@/stores/order-store';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
// import { Separator } from '@/components/ui/separator';
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from '@/components/ui/dialog';
// import { Textarea } from '@/components/ui/textarea';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Progress } from '@/components/ui/progress';
// import { toast } from '@/components/ui/use-toast';

// interface ProfessionalOrderCardProps {
//   order: Order;
//   showActions?: boolean;
// }

// const statusConfig = {
//   [OrderStatus.PENDING]: {
//     label: 'Pending',
//     labelNp: 'बाँकी',
//     color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
//     icon: AlertCircle,
//     bgColor: 'bg-yellow-50 dark:bg-yellow-950/10',
//   },
//   [OrderStatus.ACCEPTED]: {
//     label: 'Accepted',
//     labelNp: 'स्वीकृत',
//     color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
//     icon: CheckCircle,
//     bgColor: 'bg-blue-50 dark:bg-blue-950/10',
//   },
//   [OrderStatus.INSPECTED]: {
//     label: 'Inspected',
//     labelNp: 'निरीक्षण गरियो',
//     color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
//     icon: Search,
//     bgColor: 'bg-purple-50 dark:bg-purple-950/10',
//   },
//   [OrderStatus.COMPLETED]: {
//     label: 'Completed',
//     labelNp: 'सम्पन्न',
//     color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
//     icon: CheckCircle,
//     bgColor: 'bg-green-50 dark:bg-green-950/10',
//   },
//   [OrderStatus.CANCELLED]: {
//     label: 'Cancelled',
//     labelNp: 'रद्द',
//     color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
//     icon: XCircle,
//     bgColor: 'bg-red-50 dark:bg-red-950/10',
//   },
// };

// const paymentStatusConfig = {
//   [PaymentStatus.UNPAID]: {
//     label: 'Unpaid',
//     labelNp: 'भुक्तानी बाँकी',
//     color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
//     icon: DollarSign,
//   },
//   [PaymentStatus.PARTIAL]: {
//     label: 'Partial',
//     labelNp: 'आंशिक भुक्तानी',
//     color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
//     icon: DollarSign,
//   },
//   [PaymentStatus.PAID]: {
//     label: 'Paid',
//     labelNp: 'भुक्तानी भयो',
//     color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
//     icon: CheckCircle,
//   },
// };

// export function ProfessionalOrderCard({ order, showActions = true }: ProfessionalOrderCardProps) {
//   const { t, locale } = useI18n();
//   const router = useRouter();
//   const { updateOrder } = useOrderStore();
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [isInspecting, setIsInspecting] = useState(false);
//   const [inspectionNotes, setInspectionNotes] = useState('');
//   const [newPrice, setNewPrice] = useState(order.total_price.toString());
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const getLocalizedText = (en: string, np: string) => {
//     return locale === 'ne' ? np : en;
//   };

//   const status = order.order_status as OrderStatus;
//   const paymentStatus = order.payment_status as PaymentStatus;
//   const statusInfo = statusConfig[status];
//   const paymentInfo = paymentStatusConfig[paymentStatus];
//   const StatusIcon = statusInfo.icon;

//   const formattedDate = format(new Date(order.scheduled_date), 'MMM dd, yyyy');
//   const formattedTime = format(new Date(order.scheduled_time), 'hh:mm a');
//   const orderDate = format(new Date(order.order_date), 'MMM dd, yyyy');

//   const remainingAmount = order.payment_summary.remaining_amount;
//   const paymentPercentage = order.payment_summary.payment_percentage;
//   const hasPaidAmount = order.total_paid_amount > 0;
//   const balance = order.total_price - order.total_paid_amount;
//   const isPaymentPending = paymentStatus !== PaymentStatus.PAID;




//   const handleStatusUpdate = async (newStatus: OrderStatus) => {
//     try {
//       setIsSubmitting(true);
//       await updateOrder(order.id, { order_status: newStatus });
//       toast({
//         title: getLocalizedText('Status Updated', 'स्थिति अद्यावधिक गरियो'),
//         description: getLocalizedText(
//           `Job status updated to ${newStatus}`,
//           `कामको स्थिति ${newStatus} मा अद्यावधिक गरियो`
//         ),
//       });
//     } catch (error) {
//       toast({
//         title: getLocalizedText('Error', 'त्रुटि'),
//         description: getLocalizedText('Failed to update job status', 'कामको स्थिति अद्यावधिक गर्न असफल'),
//         variant: 'destructive',
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleInspectionSubmit = async () => {
//     if (!inspectionNotes.trim() || !newPrice.trim()) {
//       toast({
//         title: getLocalizedText('Error', 'त्रुटि'),
//         description: getLocalizedText('Please fill in all required fields', 'कृपया सबै आवश्यक फिल्डहरू भर्नुहोस्'),
//         variant: 'destructive',
//       });
//       return;
//     }

//     try {
//       setIsSubmitting(true);
//       await updateOrder(order.id, {
//         order_status: OrderStatus.INSPECTED,
//         inspection_notes: inspectionNotes,
//         total_price: parseFloat(newPrice)
//       });
      
//       setIsInspecting(false);
//       setInspectionNotes('');
//       toast({
//         title: getLocalizedText('Inspection Submitted', 'निरीक्षण पेश गरियो'),
//         description: getLocalizedText('Job marked as inspected with updated details', 'काम निरीक्षण गरिएको र अद्यावधिक विवरणहरू सहित चिन्हित गरियो'),
//       });
//     } catch (error) {
//       toast({
//         title: getLocalizedText('Error', 'त्रुटि'),
//         description: getLocalizedText('Failed to submit inspection', 'निरीक्षण पेश गर्न असफल'),
//         variant: 'destructive',
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleCallCustomer = () => {
//     if (status !== OrderStatus.PENDING && order.customer_phone) {
//       window.open(`tel:+977${order.customer_phone}`);
//     } else {
//       toast({
//         title: getLocalizedText('Phone Not Available', 'फोन उपलब्ध छैन'),
//         description: getLocalizedText(
//           'Customer phone will be visible after accepting the job',
//           'ग्राहकको फोन नम्बर काम स्वीकार गरेपछि मात्र देखिनेछ'
//         ),
//         variant: 'destructive',
//       });
//     }
//   };

//   const handleViewDetails = () => {
//     // router.push(`/jobs/${order.id}`);
//   };

//   const handleViewPayment = () => {
//     // router.push(`/payment/${order.id}?professional=true`);
//   };

//   return (
//     <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
//       <CardHeader className={`pb-3 ${statusInfo.bgColor}`}>
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
//           <div className="space-y-1">
//             <div className="flex items-center gap-2">
//               <h3 className="font-semibold text-lg">
//                 {locale === 'ne' ? order.service_name_np : order.service_name_en}
//               </h3>
//               <Badge variant="outline" className="font-mono text-xs">
//                 #{order.id}
//               </Badge>
//             </div>
//             <p className="text-sm text-muted-foreground">
//               {getLocalizedText('Customer:', 'ग्राहक:')} {order.customer_name}
//             </p>
            
//             {/* Customer Info - Moved to CardHeader */}
//             <div className="flex flex-wrap items-center gap-4 mt-2 pt-2 border-t">
//               <div className="flex items-center gap-2">
//                 <User className="w-4 h-4 text-muted-foreground" />
//                 <span className="text-sm font-medium">
//                   {getLocalizedText('Customer:', 'ग्राहक:')}
//                 </span>
//                 <span className="text-sm font-semibold">
//                   {order.customer_name}
//                 </span>
//               </div>
              
//               {status !== OrderStatus.PENDING && status !== OrderStatus.CANCELLED ? (
//                 <div className="flex items-center gap-2">
//                   <Phone className="w-4 h-4 text-muted-foreground" />
//                   <span className="text-sm">{order.customer_phone}</span>
//                 </div>
//               ) : (
//                 <div className="flex items-center gap-2 text-xs text-muted-foreground">
//                   <AlertCircle className="w-3 h-3" />
//                   <span>{getLocalizedText('Phone visible after acceptance', 'फोन स्वीकार पछि मात्र देखिनेछ')}</span>
//                 </div>
//               )}
              
//               <div className="flex items-center gap-2">
//                 <Calendar className="w-4 h-4 text-muted-foreground" />
//                 <span className="text-sm">
//                   {getLocalizedText('Ordered:', 'अर्डर मिति:')} {orderDate}
//                 </span>
//               </div>
//             </div>
//           </div>
          
//           <div className="flex items-center gap-2">
//             <Badge className={statusInfo.color}>
//               <StatusIcon className="w-3 h-3 mr-1" />
//               {locale === 'ne' ? statusInfo.labelNp : statusInfo.label}
//             </Badge>
//             <Badge className={paymentInfo.color}>
//               {locale === 'ne' ? paymentInfo.labelNp : paymentInfo.label}
//             </Badge>
//           </div>
//         </div>
//       </CardHeader>

//       <Separator />

//       <CardContent className="pt-4">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           {/* Job Details */}
//           <div className="space-y-2">
//             <div className="flex items-center gap-2">
//               <Package className="w-4 h-4 text-muted-foreground" />
//               <span className="text-sm font-medium">
//                 {getLocalizedText('Job Details', 'कामको विवरण')}
//               </span>
//             </div>
//             <div className="space-y-1 text-sm">
//               <div className="flex justify-between">
//                 <span className="text-muted-foreground">
//                   {getLocalizedText('Quantity:', 'परिमाण:')}
//                 </span>
//                 <span className="font-medium">{order.quantity}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-muted-foreground">
//                   {getLocalizedText('Quality:', 'गुणस्तर:')}
//                 </span>
//                 <span className="font-medium">{order.quality_type_id}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-muted-foreground">
//                   {getLocalizedText('Unit:', 'एकाइ:')}
//                 </span>
//                 <span className="font-medium">{order.price_unit_id}</span>
//               </div>
//             </div>
//           </div>

//           {/* Schedule Info */}
//           <div className="space-y-2">
//             <div className="flex items-center gap-2">
//               <Calendar className="w-4 h-4 text-muted-foreground" />
//               <span className="text-sm font-medium">
//                 {getLocalizedText('Schedule', 'तालिका')}
//               </span>
//             </div>
//             <div className="space-y-1 text-sm">
//               <div className="flex items-center gap-2">
//                 <Calendar className="w-4 h-4" />
//                 <span>{formattedDate}</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Clock className="w-4 h-4" />
//                 <span>{formattedTime}</span>
//               </div>
//             </div>
//           </div>

//           {/* Payment Info */}
//           <div className="space-y-2">
//             <div className="flex items-center gap-2">
//                  <Banknote className="w-4 h-4 text-muted-foreground" />
//               <span className="text-sm font-medium">
//                 {getLocalizedText('Payment', 'भुक्तानी')}
//               </span>
//             </div>
//             <div className="space-y-2">
//               <div className="text-sm">
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">
//                     {getLocalizedText('Total:', 'जम्मा:')}
//                   </span>
//                   <span className="font-bold text-lg">Rs. {order.total_price}</span>
//                 </div>
//                 {order.total_paid_amount > 0 && (
//                   <div className="flex justify-between text-green-600">
//                     <span>{getLocalizedText('Paid:', 'भुक्तानी भयो:')}</span>
//                     <span>Rs. {order.total_paid_amount}</span>
//                   </div>
//                 )}
//                 {balance > 0 && (
//                   <div className="flex justify-between text-orange-600">
//                     <span>{getLocalizedText('Balance:', 'बाँकी:')}</span>
//                     <span>Rs. {balance}</span>
//                   </div>
//                 )}
//               </div>
//               {paymentPercentage > 0 && (
//                 <div className="space-y-1">
//                   <Progress value={paymentPercentage} className="h-2" />
//                   <p className="text-xs text-muted-foreground text-center">
//                     {paymentPercentage.toFixed(1)}% {getLocalizedText('paid', 'भुक्तानी भयो')}
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Payment Information */}
//         {hasPaidAmount && (
//           <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
//             <div className="flex items-center gap-2 mb-2">
//               <CreditCard className="w-4 h-4 text-blue-600" />
//               <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
//                 {getLocalizedText('Payment Information', 'भुक्तानी जानकारी')}
//               </span>
//             </div>
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
//               <div>
//                 <span className="text-muted-foreground">{getLocalizedText('Paid:', 'भुक्तानी:')}</span>
//                 <span className="ml-2 font-medium text-green-600">
//                   Rs. {order.total_paid_amount}
//                 </span>
//               </div>
//               {balance > 0 && (
//                 <div>
//                   <span className="text-muted-foreground">{getLocalizedText('Balance:', 'बाँकी:')}</span>
//                   <span className="ml-2 font-medium text-orange-600">
//                     Rs. {balance}
//                   </span>
//                 </div>
//               )}
//               {paymentPercentage > 0 && (
//                 <div>
//                   <span className="text-muted-foreground">{getLocalizedText('Progress:', 'प्रगति:')}</span>
//                   <span className="ml-2 font-medium">
//                     {paymentPercentage.toFixed(1)}%
//                   </span>
//                 </div>
//               )}
//             </div>
//             {paymentPercentage > 0 && (
//               <Progress value={paymentPercentage} className="h-2 mt-2" />
//             )}
//           </div>
//         )}



//         {/* Waiting for Customer Approval - Inspected Orders */}
// {status === OrderStatus.INSPECTED && order.initial_price &&  order.order_notes  &&(
//   <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
//     <div className="flex items-start gap-2 mb-3">
//       <div className="relative">
//         <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
//       </div>
//       <div>
//         <h4 className="text-sm font-semibold text-purple-800 dark:text-purple-200">
//           {getLocalizedText('Waiting for Customer Approval', 'ग्राहकको स्वीकृतिको प्रतिक्षामा')}
//         </h4>
//         <p className="text-xs text-purple-700 dark:text-purple-300">
//           {getLocalizedText(
//             'You have submitted the inspection report. The customer is reviewing the price update.',
//             'तपाईंले निरीक्षण प्रतिवेदन पेश गरिसक्नुभएको छ। ग्राहकले मूल्य अद्यावधिकको समीक्षा गरिरहेका छन्।'
//           )}
//         </p>
//       </div>
//     </div>

//     {/* Price Comparison - What professional proposed */}
//     <div className="space-y-2 text-sm bg-white dark:bg-gray-800 p-3 rounded-md">
//       <div className="flex justify-between items-center py-1">
//         <span className="text-muted-foreground">
//           {getLocalizedText('Previous Price:', 'पुरानो मूल्य:')}
//         </span>
//         <span className="font-medium line-through text-muted-foreground">
//           Rs. {order.initial_price.toLocaleString()}
//         </span>
//       </div>

//       {/* Price Difference */}
//       {(() => {
//         const difference = order.total_price - order.initial_price;
//         const isIncrease = difference > 0;
//         const isDecrease = difference < 0;
//         const absoluteDiff = Math.abs(difference);
        
//         return (
//           <div className="flex justify-between items-center py-1 border-t border-dashed border-purple-200 dark:border-purple-800">
//             <span className="text-muted-foreground">
//               {getLocalizedText('Price Difference:', 'मूल्य अन्तर:')}
//             </span>
//             <div className="flex items-center gap-1">
//               {isIncrease && (
//                 <>
//                   <span className="text-green-600 font-medium">+</span>
//                   <span className="text-green-600 font-medium">Rs. {absoluteDiff.toLocaleString()}</span>
//                   <span className="text-green-600">
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
//                     </svg>
//                   </span>
//                 </>
//               )}
//               {isDecrease && (
//                 <>
//                   <span className="text-red-600 font-medium">-</span>
//                   <span className="text-red-600 font-medium">Rs. {absoluteDiff.toLocaleString()}</span>
//                   <span className="text-red-600">
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
//                     </svg>
//                   </span>
//                 </>
//               )}
//               {!isIncrease && !isDecrease && (
//                 <span className="text-gray-600 font-medium">
//                   {getLocalizedText('No change', 'कुनै परिवर्तन छैन')}
//                 </span>
//               )}
//             </div>
//           </div>
//         );
//       })()}

//       {/* New Price */}
//       <div className="flex justify-between items-center py-1 border-t border-dashed border-purple-200 dark:border-purple-800">
//         <span className="font-semibold">
//           {getLocalizedText('New Price (Proposed):', 'नयाँ मूल्य (प्रस्तावित):')}
//         </span>
//         <span className="font-bold text-lg text-purple-600">
//           Rs. {order.total_price.toLocaleString()}
//         </span>
//       </div>

//       {/* Inspection Notes Summary */}
//       {order.inspection_notes && (
//         <div className="mt-2 pt-2 border-t border-purple-200 dark:border-purple-800">
//           <p className="text-xs text-muted-foreground mb-1">
//             {getLocalizedText('Your Inspection Notes:', 'तपाईंको निरीक्षण नोटहरू:')}
//           </p>
//           <p className="text-sm italic">"{order.inspection_notes}"</p>
//         </div>
//       )}
//     </div>

//     {/* Status Indicator */}
//     <div className="mt-3 flex items-center gap-2 text-xs text-purple-600">
//       <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></div>
//       <span>
//         {getLocalizedText(
//           'Awaiting customer response...',
//           'ग्राहकको प्रतिक्रिया पर्खंदै...'
//         )}
//       </span>
//     </div>

//     {/* Note about next steps */}
//     <div className="mt-3 p-2 bg-purple-100 dark:bg-purple-900/30 rounded text-xs">
//       <p className="text-purple-700 dark:text-purple-300">
//         {getLocalizedText(
//           'Once the customer accepts the price, you will be able to mark this job as completed after receiving payment.',
//           'ग्राहकले मूल्य स्वीकार गरेपछि, भुक्तानी प्राप्त भएपछि तपाईंले यो काम सम्पन्न भनेर चिन्हित गर्न सक्नुहुनेछ।'
//         )}
//       </p>
//     </div>
//   </div>
// )}

//         {/* Expandable Details */}
//         {isExpanded && (
//           <div className="mt-4 pt-4 border-t space-y-3">
//             {/* Address */}
//             <div className="space-y-1">
//               <div className="flex items-center gap-2">
//                 <MapPin className="w-4 h-4 text-muted-foreground" />
//                 <span className="text-sm font-medium">
//                   {getLocalizedText('Service Address', 'सेवा ठेगाना')}
//                 </span>
//               </div>
//               <p className="text-sm">
//                 {order.customer_address?.street_address}, {order.customer_address?.ward_no},<br />
//                 {order.customer_address?.municipality}, {order.customer_address?.district},<br />
//                 {order.customer_address?.province}
//               </p>
//               {order.customer_address?.type && (
//                 <Badge variant="outline" className="mt-1">
//                   {order.customer_address.type === 'temporary' 
//                     ? getLocalizedText('Temporary Address', 'अस्थायी ठेगाना')
//                     : getLocalizedText('Permanent Address', 'स्थायी ठेगाना')}
//                 </Badge>
//               )}
//             </div>

//             {/* Notes */}
//             {order.order_notes && (
//               <div className="space-y-1">
//                 <div className="flex items-center gap-2">
//                   <FileText className="w-4 h-4 text-muted-foreground" />
//                   <span className="text-sm font-medium">
//                     {getLocalizedText('Customer Notes', 'ग्राहक नोटहरू')}
//                   </span>
//                 </div>
//                 <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
//                   {order.order_notes}
//                 </p>
//               </div>
//             )}

//             {order.inspection_notes && (
//               <div className="space-y-1">
//                 <div className="flex items-center gap-2">
//                   <Search className="w-4 h-4 text-muted-foreground" />
//                   <span className="text-sm font-medium">
//                     {getLocalizedText('Inspection Notes', 'निरीक्षण नोटहरू')}
//                   </span>
//                 </div>
//                 <p className="text-sm text-blue-600 bg-blue-50 dark:bg-blue-950/30 p-3 rounded-md">
//                   {order.inspection_notes}
//                 </p>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Expand/Collapse Button */}
//         <Button
//           variant="ghost"
//           size="sm"
//           className="w-full mt-4"
//           onClick={() => setIsExpanded(!isExpanded)}
//         >
//           {isExpanded ? (
//             <>
//               <ChevronUp className="w-4 h-4 mr-2" />
//               {getLocalizedText('Show Less Details', 'कम विवरण देखाउनुहोस्')}
//             </>
//           ) : (
//             <>
//               <ChevronDown className="w-4 h-4 mr-2" />
//               {getLocalizedText('Show More Details', 'थप विवरण देखाउनुहोस्')}
//             </>
//           )}
//         </Button>
//       </CardContent>

//       <Separator />

//       {/* Professional Actions */}
//       {showActions && (
//         <CardFooter className="pt-4">
//           <div className="flex flex-col gap-3 w-full">
//             {/* Status-specific actions */}
//             {status === OrderStatus.PENDING && (
//               <div className="flex flex-col sm:flex-row gap-2">
//                 <Button
//                   variant="outline"
//                   onClick={() => handleStatusUpdate(OrderStatus.ACCEPTED)}
//                   disabled={isSubmitting}
//                   className="flex-1"
//                 >
//                   <CheckCircle className="w-4 h-4 mr-2" />
//                   {getLocalizedText('Accept Job', 'काम स्वीकार गर्नुहोस्')}
//                 </Button>
//                 <Button
//                   variant="destructive"
//                   onClick={() => handleStatusUpdate(OrderStatus.CANCELLED)}
//                   disabled={isSubmitting}
//                   className="flex-1"
//                 >
//                   <XCircle className="w-4 h-4 mr-2" />
//                   {getLocalizedText('Reject', 'अस्वीकार गर्नुहोस्')}
//                 </Button>
//               </div>
//             )}

//             {status === OrderStatus.ACCEPTED && (
//               <div className="flex flex-col sm:flex-row gap-2">
//                 <Dialog open={isInspecting} onOpenChange={setIsInspecting}>
//                   <DialogTrigger asChild>
//                     <Button className="flex-1">
//                       <Search className="w-4 h-4 mr-2" />
//                       {getLocalizedText('Perform Inspection', 'निरीक्षण गर्नुहोस्')}
//                     </Button>
//                   </DialogTrigger>
//                   <DialogContent>
//                     <DialogHeader>
//                       <DialogTitle>
//                         {getLocalizedText('Site Inspection', 'स्थल निरीक्षण')}
//                       </DialogTitle>
//                       <DialogDescription>
//                         {getLocalizedText(
//                           'Update the job details after site inspection',
//                           'स्थल निरीक्षण पछि कामको विवरण अद्यावधिक गर्नुहोस्'
//                         )}
//                       </DialogDescription>
//                     </DialogHeader>
//                     <div className="space-y-4">
//                       <div className="bg-yellow-50 dark:bg-yellow-950/20 p-3 rounded-md">
//                         <div className="flex items-start gap-2">
//                           <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
//                           <div>
//                             <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
//                               {getLocalizedText('Important Note', 'महत्त्वपूर्ण नोट')}
//                             </p>
//                             <p className="text-sm text-yellow-700 dark:text-yellow-300">
//                               {getLocalizedText(
//                                 'After marking as inspected, the price cannot be changed. Please verify all details before submitting.',
//                                 'निरीक्षण गरियो भनेर चिन्हित गरेपछि, मूल्य परिवर्तन गर्न सकिन्न। कृपया पेश गर्नु अघि सबै विवरणहरू जाँच गर्नुहोस्।'
//                               )}
//                             </p>
//                           </div>
//                         </div>
//                       </div>

//                       <div>
//                         <Label htmlFor="current-price">
//                           {getLocalizedText('Current Price', 'हालको मूल्य')}
//                         </Label>
//                         <div className="flex items-center mt-1">
//                           <Calculator className="w-4 h-4 mr-2 text-muted-foreground" />
//                           <span className="text-lg font-bold">Rs. {order.total_price}</span>
//                         </div>
//                       </div>

//                       <div>
//                         <Label htmlFor="new-price">
//                           {getLocalizedText('New Price (After Inspection)', 'नयाँ मूल्य (निरीक्षण पछि)')}
//                         </Label>
//                         <div className="flex items-center mt-1">
//                           <span className="mr-2">Rs.</span>
//                           <Input
//                             id="new-price"
//                             type="number"
//                             value={newPrice}
//                             onChange={(e) => setNewPrice(e.target.value)}
//                             placeholder={getLocalizedText('Enter updated price', 'अद्यावधिक मूल्य प्रविष्ट गर्नुहोस्')}
//                             min="0"
//                           />
//                         </div>
//                       </div>

//                       <div>
//                         <Label htmlFor="inspection-notes">
//                           {getLocalizedText('Inspection Notes', 'निरीक्षण नोटहरू')}
//                         </Label>
//                         <Textarea
//                           id="inspection-notes"
//                           value={inspectionNotes}
//                           onChange={(e) => setInspectionNotes(e.target.value)}
//                           placeholder={getLocalizedText(
//                             'Describe site conditions, any changes needed, additional requirements...',
//                             'स्थलको अवस्था, आवश्यक परिवर्तनहरू, अतिरिक्त आवश्यकताहरू वर्णन गर्नुहोस्...'
//                           )}
//                           rows={4}
//                           className="mt-1"
//                         />
//                       </div>

//                       <DialogFooter>
//                         <Button
//                           variant="outline"
//                           onClick={() => setIsInspecting(false)}
//                         >
//                           {getLocalizedText('Cancel', 'रद्द गर्नुहोस्')}
//                         </Button>
//                         <Button
//                           onClick={handleInspectionSubmit}
//                           disabled={isSubmitting || !inspectionNotes.trim() || !newPrice.trim()}
//                         >
//                           {isSubmitting 
//                             ? getLocalizedText('Submitting...', 'पेश गर्दै...')
//                             : getLocalizedText('Submit Inspection', 'निरीक्षण पेश गर्नुहोस्')}
//                         </Button>
//                       </DialogFooter>
//                     </div>
//                   </DialogContent>
//                 </Dialog>
                
//                 <Button
//                   variant="outline"
//                   onClick={() => handleStatusUpdate(OrderStatus.COMPLETED)}
//                   disabled={isSubmitting || isPaymentPending}
//                   className="flex-1"
//                 >
//                   <CheckCircle className="w-4 h-4 mr-2" />
//                   {getLocalizedText('Mark as Completed', 'सम्पन्न भयो चिन्हित गर्नुहोस्')}
//                 </Button>
//               </div>
//             )}

//             {status === OrderStatus.INSPECTED && (
//               <Button
//                 onClick={() => handleStatusUpdate(OrderStatus.COMPLETED)}
//                 disabled={isSubmitting || isPaymentPending}
//                 className="w-full"
//               >
//                 <CheckCircle className="w-4 h-4 mr-2" />
//                 {getLocalizedText('Mark as Completed', 'सम्पन्न भयो चिन्हित गर्नुहोस्')}
//               </Button>
//             )}

//             {/* Common actions */}
//             <div className="flex flex-wrap gap-2">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={handleViewDetails}
//                 className="flex-1 min-w-[120px]"
//               >
//                 <Eye className="w-4 h-4 mr-2" />
//                 {getLocalizedText('View Details', 'विवरण हेर्नुहोस्')}
//               </Button>

//               {status !== OrderStatus.PENDING && (
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={handleCallCustomer}
//                   className="flex-1 min-w-[120px]"
//                 >
//                   <Phone className="w-4 h-4 mr-2" />
//                   {getLocalizedText('Call Customer', 'ग्राहकलाई फोन गर्नुहोस्')}
//                 </Button>
//               )}

//               <Button
//                 variant="outline"
//                 size="sm"
//                 className="flex-1 min-w-[120px]"
//               >
//                 <MessageSquare className="w-4 h-4 mr-2" />
//                 {getLocalizedText('Message', 'सन्देश')}
//               </Button>

//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={handleViewPayment}
//                 className="flex-1 min-w-[140px]"
//               >
//                 <CreditCard className="w-4 h-4 mr-2" />
//                 {getLocalizedText('Payment Details', 'भुक्तानी विवरण')}
//               </Button>
//             </div>
//           </div>
//         </CardFooter>
//       )}
//     </Card>
//   );
// }




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
  CreditCard,
  Search,
  Loader2,
  Info,
  Banknote
} from 'lucide-react';
import { format } from 'date-fns';
import { useI18n } from '@/lib/i18n/context';
import { Order, OrderStatus, PaymentStatus, UpdateOrderDTO } from '@/lib/data/order';
import { useOrderStore } from '@/stores/order-store';
import { useNotificationStore } from '@/stores/notification-store';
import { useConfirmationDialog } from '@/hooks/use-confirmation-dialog';
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
import { NepaliDateService } from '@/lib/utils/nepaliDate';
import { ProperCaseFormatter } from '@/lib/utils/formatters';

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
  const { locale } = useI18n();
  const router = useRouter();
  const { updateOrder } = useOrderStore();
  const { createNotification } = useNotificationStore();
  const { confirm, ConfirmationDialog } = useConfirmationDialog();
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [isInspecting, setIsInspecting] = useState(false);
  const [inspectionNotes, setInspectionNotes] = useState('');
  const [newPrice, setNewPrice] = useState(order.total_price.toString());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const getLocalizedText = (en: string, np: string) => {
    return locale === 'ne' ? np : en;
  };

  const status = order.order_status as OrderStatus;
  const paymentStatus = order.payment_status as PaymentStatus;
  const statusInfo = statusConfig[status];
  const paymentInfo = paymentStatusConfig[paymentStatus];
  const StatusIcon = statusInfo.icon;

  // Safely handle payment summary with fallback values
  const paymentSummary = order.payment_summary || {
    total_price: order.total_price,
    total_paid: order.total_paid_amount || 0,
    remaining_amount: (order.total_price - (order.total_paid_amount || 0)),
    payment_percentage: order.total_paid_amount ? (order.total_paid_amount / order.total_price) * 100 : 0,
    payment_status: order.payment_status,
    is_fully_paid: order.payment_status === PaymentStatus.PAID,
    is_partially_paid: order.payment_status === PaymentStatus.PARTIAL,
    is_unpaid: order.payment_status === PaymentStatus.UNPAID
  };

  const formattedDate = NepaliDateService.formatNepaliMonth(order.scheduled_date);
 const formattedTime = format((order.scheduled_time), 'hh:mm a');
  const orderDate = NepaliDateService.formatNepaliMonth(order.order_date);

  const remainingAmount = paymentSummary.remaining_amount;
  const paymentPercentage = paymentSummary.payment_percentage;
  const hasPaidAmount = (order.total_paid_amount || 0) > 0;
  const balance = (order.total_price - (order.total_paid_amount || 0));
  const isPaymentPending = paymentStatus !== PaymentStatus.PAID;

  // Handle status update with notifications
  const handleStatusUpdate = async (newStatus: OrderStatus) => {
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
       //console.log("=================ORDER CHECK");
      // Update order status
     const response= await updateOrder(order.id, { order_status: newStatus });
      //console.log(response);
      //console.log(newStatus);

      //console.log("=================ORDER COMPLETED");



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

  // Handle reject with reason
  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) return;
    try {
      setIsSubmitting(true);
      await updateOrder(order.id, {
        order_status: OrderStatus.CANCELLED,
        rejected_reason: rejectReason.trim(),
      });
      await createNotification({
        user_id: order.customer_id,
        type: 'Order Update',
        title: 'Order Expired',
        body: `We apologize! Your order has been automatically canceled because no professional accepted the request in time. Please try booking again or adjust your service time.`,
        action_route: 'order',
        custom_data: { orderId: order.id },
      });
      setIsRejectDialogOpen(false);
      setRejectReason('');
      toast({
        title: getLocalizedText('Order Rejected', 'काम अस्वीकार गरियो'),
        description: getLocalizedText('The job has been rejected with a reason.', 'कारण सहित काम अस्वीकार गरियो।'),
      });
    } catch (error) {
      toast({
        title: getLocalizedText('Error', 'त्रुटि'),
        description: getLocalizedText('Failed to reject job', 'काम अस्वीकार गर्न असफल'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle inspection submission
  const handleInspectionSubmit = async () => {
    if (!inspectionNotes.trim() || !newPrice.trim()) {
      toast({
        title: getLocalizedText('Error', 'त्रुटि'),
        description: getLocalizedText('Please fill in all required fields', 'कृपया सबै आवश्यक फिल्डहरू भर्नुहोस्'),
        variant: 'destructive',
      });
      return;
    }

    // Show confirmation dialog
    const confirmed = await confirm({
      title: getLocalizedText('Submit Inspection?', 'निरीक्षण पेश गर्ने?'),
      description: getLocalizedText(
        'After marking as inspected, the price cannot be changed. Are you sure?',
        'निरीक्षण गरियो भनेर चिन्हित गरेपछि, मूल्य परिवर्तन गर्न सकिन्न। के तपाईं निश्चित हुनुहुन्छ?'
      ),
      confirmText: getLocalizedText('Yes, Submit', 'हो, पेश गर्नुहोस्'),
      cancelText: getLocalizedText('Cancel', 'रद्द गर्नुहोस्'),
    });

    if (!confirmed) return;

    try {
      setIsSubmitting(true);
      
      // Update order with inspection details
      await updateOrder(order.id, {
        order_status: OrderStatus.INSPECTED,
        inspection_notes: inspectionNotes,
        total_price: parseFloat(newPrice)
      });
      
      // Send notification to customer about inspection
      await createNotification({
        user_id: order.customer_id,
        type: 'Order Update',
        title: 'Inspection Completed',
        body: `The professional has inspected the site. A new price of Rs. ${parseFloat(newPrice).toLocaleString()} has been proposed based on the findings. Tap to review notes.`,
        action_route: 'order',
        custom_data: {
          orderId: order.id,
          total_price: parseFloat(newPrice),
          initial_price: order.total_price
        }
      });
      
      setIsInspecting(false);
      setInspectionNotes('');
      setNewPrice(order.total_price.toString());
      
      toast({
        title: getLocalizedText('Inspection Submitted', 'निरीक्षण पेश गरियो'),
        description: getLocalizedText('Job marked as inspected with updated details', 'काम निरीक्षण गरिएको र अद्यावधिक विवरणहरू सहित चिन्हित गरियो'),
      });
    } catch (error) {
      console.error('Failed to submit inspection:', error);
      toast({
        title: getLocalizedText('Error', 'त्रुटि'),
        description: getLocalizedText('Failed to submit inspection', 'निरीक्षण पेश गर्न असफल'),
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
        title: getLocalizedText('Phone Not Available', 'फोन उपलब्ध छैन'),
        description: getLocalizedText(
          'Customer phone will be visible after accepting the job',
          'ग्राहकको फोन नम्बर काम स्वीकार गरेपछि मात्र देखिनेछ'
        ),
        variant: 'destructive',
      });
    }
  };

  const handleViewDetails = () => {
    router.push(`job-details/${order.id}`);
  };

  const handleViewPayment = () => {
    router.push(`/dashboard/payments/orders/${order.id}`);
  };

  return (
    <>
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
              
              {/* Customer Info */}
              <div className="flex flex-wrap items-center gap-4 mt-2 pt-2 border-t">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {getLocalizedText('Customer:', 'ग्राहक:')}
                  </span>
                  <span className="text-sm font-semibold">
                    {order.customer_name}
                  </span>
                </div>
                
                {status !== OrderStatus.PENDING && status !== OrderStatus.CANCELLED ? (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{order.customer_phone}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <AlertCircle className="w-3 h-3" />
                    <span>{getLocalizedText('Phone visible after acceptance', 'फोन स्वीकार पछि मात्र देखिनेछ')}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    {getLocalizedText('Ordered:', 'अर्डर मिति:')} {orderDate}
                  </span>
                </div>
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
            {/* Job Details */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {getLocalizedText('Job Details', 'कामको विवरण')}
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
                    {getLocalizedText('Quality:', 'गुणस्तर:')}
                  </span>
                  <span className="font-medium">{order.quality_type_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {getLocalizedText('Unit:', 'एकाइ:')}
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
                    <span className="font-bold text-lg">Rs. {order.total_price.toLocaleString()}</span>
                  </div>
                  {hasPaidAmount && (
                    <div className="flex justify-between text-green-600">
                      <span>{getLocalizedText('Paid:', 'भुक्तानी भयो:')}</span>
                      <span>Rs. {order.total_paid_amount?.toLocaleString()}</span>
                    </div>
                  )}
                  {balance > 0 && (
                    <div className="flex justify-between text-orange-600">
                      <span>{getLocalizedText('Balance:', 'बाँकी:')}</span>
                      <span>Rs. {balance.toLocaleString()}</span>
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
              </div>
            </div>
          </div>

          {/* Payment Information Summary */}
          {hasPaidAmount && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  {getLocalizedText('Payment Information', 'भुक्तानी जानकारी')}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">{getLocalizedText('Paid:', 'भुक्तानी:')}</span>
                  <span className="ml-2 font-medium text-green-600">
                    Rs. {order.total_paid_amount?.toLocaleString()}
                  </span>
                </div>
                {balance > 0 && (
                  <div>
                    <span className="text-muted-foreground">{getLocalizedText('Balance:', 'बाँकी:')}</span>
                    <span className="ml-2 font-medium text-orange-600">
                      Rs. {balance.toLocaleString()}
                    </span>
                  </div>
                )}
                {paymentPercentage > 0 && (
                  <div>
                    <span className="text-muted-foreground">{getLocalizedText('Progress:', 'प्रगति:')}</span>
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

          {/* Waiting for Customer Approval - Inspected Orders */}
          {status === OrderStatus.INSPECTED && order.initial_price && (
            <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex items-start gap-2 mb-3">
                <div className="relative">
                  <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-purple-800 dark:text-purple-200">
                    {getLocalizedText('Waiting for Customer Approval', 'ग्राहकको स्वीकृतिको प्रतिक्षामा')}
                  </h4>
                  <p className="text-xs text-purple-700 dark:text-purple-300">
                    {getLocalizedText(
                      'You have submitted the inspection report. The customer is reviewing the price update.',
                      'तपाईंले निरीक्षण प्रतिवेदन पेश गरिसक्नुभएको छ। ग्राहकले मूल्य अद्यावधिकको समीक्षा गरिरहेका छन्।'
                    )}
                  </p>
                </div>
              </div>

              {/* Price Comparison */}
              <div className="space-y-2 text-sm bg-white dark:bg-gray-800 p-3 rounded-md">
                <div className="flex justify-between items-center py-1">
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
                    <div className="flex justify-between items-center py-1 border-t border-dashed border-purple-200 dark:border-purple-800">
                      <span className="text-muted-foreground">
                        {getLocalizedText('Price Difference:', 'मूल्य अन्तर:')}
                      </span>
                      <div className="flex items-center gap-1">
                        {isIncrease && (
                          <>
                            <span className="text-green-600 font-medium">+</span>
                            <span className="text-green-600 font-medium">Rs. {absoluteDiff.toLocaleString()}</span>
                            <span className="text-green-600">↑</span>
                          </>
                        )}
                        {isDecrease && (
                          <>
                            <span className="text-red-600 font-medium">-</span>
                            <span className="text-red-600 font-medium">Rs. {absoluteDiff.toLocaleString()}</span>
                            <span className="text-red-600">↓</span>
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
                <div className="flex justify-between items-center py-1 border-t border-dashed border-purple-200 dark:border-purple-800">
                  <span className="font-semibold">
                    {getLocalizedText('New Price (Proposed):', 'नयाँ मूल्य (प्रस्तावित):')}
                  </span>
                  <span className="font-bold text-lg text-purple-600">
                    Rs. {order.total_price.toLocaleString()}
                  </span>
                </div>

                {/* Inspection Notes Summary */}
                {order.inspection_notes && (
                  <div className="mt-2 pt-2 border-t border-purple-200 dark:border-purple-800">
                    <p className="text-xs text-muted-foreground mb-1">
                      {getLocalizedText('Your Inspection Notes:', 'तपाईंको निरीक्षण नोटहरू:')}
                    </p>
                    <p className="text-sm italic">"{order.inspection_notes}"</p>
                  </div>
                )}
              </div>

              {/* Status Indicator */}
              <div className="mt-3 flex items-center gap-2 text-xs text-purple-600">
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></div>
                <span>
                  {getLocalizedText(
                    'Awaiting customer response...',
                    'ग्राहकको प्रतिक्रिया पर्खंदै...'
                  )}
                </span>
              </div>
            </div>
          )}

          {/* Rejected Reason - Cancelled Orders */}
          {status === OrderStatus.CANCELLED && order.rejected_reason && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
              <div className="flex items-start gap-2">
                <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-red-700 dark:text-red-300 mb-0.5">
                    {getLocalizedText('Rejection Reason', 'अस्वीकृति कारण')}
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {order.rejected_reason}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Expandable Details */}
          {isExpanded && (
            <div className="mt-4 pt-4 border-t space-y-3">
              {/* Address */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {getLocalizedText('Service Address', 'सेवा ठेगाना')}
                  </span>
                </div>
                <p className="text-sm">
                  {order.customer_address?.street_address}, {order.customer_address?.ward_no},<br />
                  {order.customer_address?.municipality}, {order.customer_address?.district},<br />
                  {order.customer_address?.province}
                </p>
              </div>

              {/* Customer Notes */}
              {order.order_notes && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {getLocalizedText('Customer Notes', 'ग्राहक नोटहरू')}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                    {order.order_notes}
                  </p>
                </div>
              )}

              {/* Inspection Notes */}
              {order.inspection_notes && status !== OrderStatus.INSPECTED && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-muted-foreground" />
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
                {getLocalizedText('Show Less Details', 'कम विवरण देखाउनुहोस्')}
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

        {/* Professional Actions */}
        {showActions && (
          <CardFooter className="pt-4">
            <div className="flex flex-col gap-3 w-full">
              {/* PENDING Status Actions */}
              {status === OrderStatus.PENDING && (
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleStatusUpdate(OrderStatus.ACCEPTED)}
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    )}
                    {getLocalizedText('Accept Job', 'काम स्वीकार गर्नुहोस्')}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => setIsRejectDialogOpen(true)}
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    {getLocalizedText('Reject', 'अस्वीकार गर्नुहोस्')}
                  </Button>
                </div>
              )}

              {/* ACCEPTED Status Actions */}
              {status === OrderStatus.ACCEPTED && (
                <div className="flex flex-col sm:flex-row gap-2">
                  <Dialog open={isInspecting} onOpenChange={setIsInspecting}>
                    <DialogTrigger asChild>
                      <Button className="flex-1" disabled={isSubmitting}>
                        <Search className="w-4 h-4 mr-2" />
                        {getLocalizedText('Perform Inspection', 'निरीक्षण गर्नुहोस्')}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {getLocalizedText('Site Inspection', 'स्थल निरीक्षण')}
                        </DialogTitle>
                        <DialogDescription>
                          {getLocalizedText(
                            'Update the job details after site inspection',
                            'स्थल निरीक्षण पछि कामको विवरण अद्यावधिक गर्नुहोस्'
                          )}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="bg-yellow-50 dark:bg-yellow-950/20 p-3 rounded-md">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                {getLocalizedText('Important Note', 'महत्त्वपूर्ण नोट')}
                              </p>
                              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                {getLocalizedText(
                                  'After marking as inspected, the price cannot be changed. Please verify all details before submitting.',
                                  'निरीक्षण गरियो भनेर चिन्हित गरेपछि, मूल्य परिवर्तन गर्न सकिन्न। कृपया पेश गर्नु अघि सबै विवरणहरू जाँच गर्नुहोस्।'
                                )}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="current-price">
                            {getLocalizedText('Current Price', 'हालको मूल्य')}
                          </Label>
                          <div className="flex items-center mt-1 p-2 bg-muted rounded-md">
                            <Calculator className="w-4 h-4 mr-2 text-muted-foreground" />
                            <span className="text-lg font-bold">Rs. {order.total_price.toLocaleString()}</span>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="new-price">
                            {getLocalizedText('New Price (After Inspection)', 'नयाँ मूल्य (निरीक्षण पछि)')}
                          </Label>
                          <div className="flex items-center mt-1">
                            <span className="mr-2 font-medium">Rs.</span>
                          <Input
  id="new-price"
  type="number"
  value={newPrice}
  onChange={(e) => setNewPrice(e.target.value)}
  placeholder={getLocalizedText('Enter updated price', 'अद्यावधिक मूल्य प्रविष्ट गर्नुहोस्')}
  min="100"
  step="100"
  onKeyDown={(e) => {
 
    if (e.key === '-' || e.key === 'e') {
      e.preventDefault();
    }
  }}
  onBlur={(e) => {
  
    const value = parseFloat(e.target.value);
    if (value < 100) {
      setNewPrice('100');
    }
  }}
/>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="inspection-notes">
                            {getLocalizedText('Inspection Notes', 'निरीक्षण नोटहरू')}
                          </Label>
                          <Textarea
                            id="inspection-notes"
                            value={inspectionNotes}
                            // onChange={(e) => setInspectionNotes(e.target.value)}
                                onChange={(e) => {
    const formatted = ProperCaseFormatter.format(e.target.value);
    setInspectionNotes(formatted);  
  }}  
                            placeholder={getLocalizedText(
                              'Describe site conditions, any changes needed, additional requirements...',
                              'स्थलको अवस्था, आवश्यक परिवर्तनहरू, अतिरिक्त आवश्यकताहरू वर्णन गर्नुहोस्...'
                            )}
                            rows={4}
                            maxLength={250}
                            className="mt-1"
                          />
                        </div>

                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setIsInspecting(false)}
                          >
                            {getLocalizedText('Cancel', 'रद्द गर्नुहोस्')}
                          </Button>
                          <Button
                            onClick={handleInspectionSubmit}
                            disabled={isSubmitting || !inspectionNotes.trim() || !newPrice.trim()}
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                {getLocalizedText('Submitting...', 'पेश गर्दै...')}
                              </>
                            ) : (
                              getLocalizedText('Submit Inspection', 'निरीक्षण पेश गर्नुहोस्')
                            )}
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
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    )}
                    {getLocalizedText('Mark as Completed', 'सम्पन्न भयो चिन्हित गर्नुहोस्')}
                  </Button>
                </div>
              )}

              {/* INSPECTED Status Actions */}
              {/* {status === OrderStatus.INSPECTED && (
                <Button
                  onClick={() => handleStatusUpdate(OrderStatus.COMPLETED)}
                  disabled={isSubmitting || isPaymentPending}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  )}
                  {getLocalizedText('Mark as Completed', 'सम्पन्न भयो चिन्हित गर्नुहोस्')}
                </Button>
              )} */}

              {/* Common Actions */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleViewDetails}
                  className="flex-1 min-w-[120px]"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {getLocalizedText('View Details', 'विवरण हेर्नुहोस्')}
                </Button>

                {status !== OrderStatus.PENDING && status !== OrderStatus.CANCELLED && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCallCustomer}
                    className="flex-1 min-w-[120px]"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    {getLocalizedText('Call', 'फोन')}
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleViewPayment}
                  className="flex-1 min-w-[140px]"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  {getLocalizedText('Payment Details', 'भुक्तानी विवरण')}
                </Button>
              </div>
            </div>
          </CardFooter>
        )}
      </Card>
      {/* Reject Job Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={(open) => { setIsRejectDialogOpen(open); if (!open) setRejectReason(''); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{getLocalizedText('Reject Job', 'काम अस्वीकार गर्नुहोस्')}</DialogTitle>
            <DialogDescription>
              {getLocalizedText(
                'Please provide a reason for rejecting this job. This will be visible to the customer.',
                'कृपया यो काम अस्वीकार गर्नुको कारण लेख्नुहोस्। यो ग्राहकलाई देखिनेछ।'
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-md border border-red-200 dark:border-red-800">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-700 dark:text-red-300">
                  {getLocalizedText(
                    'This action is irreversible. The customer will be notified with your reason.',
                    'यो कार्य फिर्ता गर्न सकिन्न। ग्राहकलाई तपाईंको कारण सहित सूचित गरिनेछ।'
                  )}
                </p>
              </div>
            </div>
            <div>
              <Label htmlFor="reject-reason">
                {getLocalizedText('Reason for Rejection', 'अस्वीकृतिको कारण')} *
              </Label>
              <Textarea
                id="reject-reason"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder={getLocalizedText(
                  'e.g. Location is too far, Schedule conflict, Unable to perform this service...',
                  'जस्तै: स्थान धेरै टाढा छ, समय मिलेन, यो सेवा गर्न असमर्थ...'
                )}
                rows={4}
                maxLength={300}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground text-right mt-1">
                {rejectReason.length}/300
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsRejectDialogOpen(false); setRejectReason(''); }}>
              {getLocalizedText('Cancel', 'रद्द गर्नुहोस्')}
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectSubmit}
              disabled={isSubmitting || !rejectReason.trim()}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {getLocalizedText('Rejecting...', 'अस्वीकार गर्दै...')}
                </>
              ) : (
                getLocalizedText('Confirm Rejection', 'अस्वीकृति पुष्टि गर्नुहोस्')
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmationDialog />
    </>
  );
}