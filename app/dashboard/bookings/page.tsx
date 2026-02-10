// "use client";

// import { useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Textarea } from "@/components/ui/textarea";
// import { useI18n } from "@/lib/i18n/context";
// import {
//   Calendar,
//   Clock,
//   MapPin,
//   Phone,
//   MessageSquare,
//   Star,
//   MoreVertical,
//   XCircle,
//   CheckCircle,
//   AlertCircle,
// } from "lucide-react";

// const bookings = [
//   {
//     id: "DN-2024-ABC123",
//     professional: {
//       name: "Ram Bahadur Thapa",
//       nameNp: "राम बहादुर थापा",
//       photo: "/placeholder.svg?height=100&width=100",
//       phone: "+977 9841234567",
//       rating: 4.9,
//     },
//     service: "Plumbing",
//     serviceNp: "प्लम्बिङ",
//     date: "2024-01-20",
//     time: "10:00 AM",
//     address: "Baluwatar, Kathmandu",
//     status: "confirmed",
//     price: 550,
//     description: "Kitchen sink pipe leaking",
//   },
//   {
//     id: "DN-2024-DEF456",
//     professional: {
//       name: "Sita Kumari Sharma",
//       nameNp: "सीता कुमारी शर्मा",
//       photo: "/placeholder.svg?height=100&width=100",
//       phone: "+977 9851234567",
//       rating: 4.8,
//     },
//     service: "Cleaning",
//     serviceNp: "सफाई",
//     date: "2024-01-22",
//     time: "02:00 PM",
//     address: "Patan, Lalitpur",
//     status: "pending",
//     price: 800,
//     description: "Full house deep cleaning",
//   },
//   {
//     id: "DN-2024-GHI789",
//     professional: {
//       name: "Krishna Prasad Adhikari",
//       nameNp: "कृष्ण प्रसाद अधिकारी",
//       photo: "/placeholder.svg?height=100&width=100",
//       phone: "+977 9861234567",
//       rating: 4.7,
//     },
//     service: "Electrical",
//     serviceNp: "बिजुली",
//     date: "2024-01-15",
//     time: "11:00 AM",
//     address: "Bhaktapur",
//     status: "completed",
//     price: 650,
//     description: "Wiring repair in bedroom",
//   },
//   {
//     id: "DN-2024-JKL012",
//     professional: {
//       name: "Maya Devi Gurung",
//       nameNp: "माया देवी गुरुङ",
//       photo: "/placeholder.svg?height=100&width=100",
//       phone: "+977 9871234567",
//       rating: 4.9,
//     },
//     service: "Beauty",
//     serviceNp: "सौन्दर्य",
//     date: "2024-01-10",
//     time: "03:00 PM",
//     address: "Thamel, Kathmandu",
//     status: "cancelled",
//     price: 1200,
//     description: "Bridal makeup session",
//   },
// ];

// const statusConfig = {
//   pending: {
//     label: "Pending",
//     labelNp: "बाँकी",
//     color: "bg-yellow-100 text-yellow-800",
//     icon: AlertCircle,
//   },
//   confirmed: {
//     label: "Confirmed",
//     labelNp: "पुष्टि भयो",
//     color: "bg-blue-100 text-blue-800",
//     icon: CheckCircle,
//   },
//   completed: {
//     label: "Completed",
//     labelNp: "सम्पन्न",
//     color: "bg-green-100 text-green-800",
//     icon: CheckCircle,
//   },
//   cancelled: {
//     label: "Cancelled",
//     labelNp: "रद्द",
//     color: "bg-red-100 text-red-800",
//     icon: XCircle,
//   },
// };

// export default function BookingsPage() {
//   const { t, locale } = useI18n();
//   const [activeTab, setActiveTab] = useState("all");
//   const [reviewRating, setReviewRating] = useState(0);
//   const [reviewText, setReviewText] = useState("");

//   const filteredBookings =
//     activeTab === "all"
//       ? bookings
//       : bookings.filter((b) => b.status === activeTab);

//   return (
//     <div className="p-4 sm:p-6 lg:p-8">
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-foreground">{t("myBookings")}</h1>
//         <p className="text-muted-foreground">{t("manageYourBookings")}</p>
//       </div>

//       <Tabs value={activeTab} onValueChange={setActiveTab}>
//         <TabsList className="mb-6 flex-wrap h-auto gap-2">
//           <TabsTrigger value="all">{t("all")}</TabsTrigger>
//           <TabsTrigger value="pending">{t("pending")}</TabsTrigger>
//           <TabsTrigger value="confirmed">{t("confirmed")}</TabsTrigger>
//           <TabsTrigger value="completed">{t("completed")}</TabsTrigger>
//           <TabsTrigger value="cancelled">{t("cancelled")}</TabsTrigger>
//         </TabsList>

//         <TabsContent value={activeTab} className="space-y-4">
//           {filteredBookings.length === 0 ? (
//             <Card>
//               <CardContent className="p-8 text-center">
//                 <p className="text-muted-foreground">{t("noBookingsFound")}</p>
//                 <Link href="/services">
//                   <Button className="mt-4">{t("browseServices")}</Button>
//                 </Link>
//               </CardContent>
//             </Card>
//           ) : (
//             filteredBookings.map((booking) => {
//               const status =
//                 statusConfig[booking.status as keyof typeof statusConfig];
//               const StatusIcon = status.icon;

//               return (
//                 <Card key={booking.id} className="overflow-hidden">
//                   <CardContent className="p-0">
//                     <div className="flex flex-col lg:flex-row">
//                       {/* Professional Info */}
//                       <div className="p-4 sm:p-6 flex-1">
//                         <div className="flex items-start gap-4 mb-4">
//                           <div className="w-16 h-16 relative rounded-lg overflow-hidden shrink-0">
//                             <Image
//                               src={booking.professional.photo || "/placeholder.svg"}
//                               alt={booking.professional.name}
//                               fill
//                               className="object-cover"
//                             />
//                           </div>
//                           <div className="flex-1 min-w-0">
//                             <div className="flex items-start justify-between gap-2">
//                               <div>
//                                 <h3 className="font-semibold text-foreground">
//                                   {locale === "ne"
//                                     ? booking.professional.nameNp
//                                     : booking.professional.name}
//                                 </h3>
//                                 <p className="text-sm text-muted-foreground">
//                                   {locale === "ne"
//                                     ? booking.serviceNp
//                                     : booking.service}
//                                 </p>
//                               </div>
//                               <Badge className={status.color}>
//                                 <StatusIcon className="w-3 h-3 mr-1" />
//                                 {locale === "ne" ? status.labelNp : status.label}
//                               </Badge>
//                             </div>
//                             <div className="flex items-center gap-1 mt-1">
//                               <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
//                               <span className="text-sm">
//                                 {booking.professional.rating}
//                               </span>
//                             </div>
//                           </div>
//                         </div>

//                         <div className="grid sm:grid-cols-2 gap-3 text-sm">
//                           <div className="flex items-center gap-2 text-muted-foreground">
//                             <Calendar className="w-4 h-4" />
//                             {new Date(booking.date).toLocaleDateString()}
//                           </div>
//                           <div className="flex items-center gap-2 text-muted-foreground">
//                             <Clock className="w-4 h-4" />
//                             {booking.time}
//                           </div>
//                           <div className="flex items-center gap-2 text-muted-foreground sm:col-span-2">
//                             <MapPin className="w-4 h-4 shrink-0" />
//                             {booking.address}
//                           </div>
//                         </div>

//                         <p className="text-sm text-muted-foreground mt-3 p-3 bg-muted/50 rounded-lg">
//                           {booking.description}
//                         </p>
//                       </div>

//                       {/* Actions */}
//                       <div className="p-4 sm:p-6 lg:w-64 border-t lg:border-t-0 lg:border-l border-border bg-muted/30 flex flex-col justify-between">
//                         <div>
//                           <p className="text-sm text-muted-foreground mb-1">
//                             {t("bookingId")}
//                           </p>
//                           <p className="font-mono text-sm font-medium mb-4">
//                             {booking.id}
//                           </p>
//                           <p className="text-2xl font-bold text-primary">
//                             Rs. {booking.price}
//                           </p>
//                         </div>

//                         <div className="flex flex-col gap-2 mt-4">
//                           {(booking.status === "pending" ||
//                             booking.status === "confirmed") && (
//                             <>
//                               <Button size="sm" variant="outline" className="gap-2 bg-transparent">
//                                 <Phone className="w-4 h-4" />
//                                 {t("call")}
//                               </Button>
//                               <Button size="sm" variant="outline" className="gap-2 bg-transparent">
//                                 <MessageSquare className="w-4 h-4" />
//                                 {t("message")}
//                               </Button>
//                               {booking.status === "pending" && (
//                                 <Button
//                                   size="sm"
//                                   variant="destructive"
//                                   className="gap-2"
//                                 >
//                                   <XCircle className="w-4 h-4" />
//                                   {t("cancel")}
//                                 </Button>
//                               )}
//                             </>
//                           )}

//                           {booking.status === "completed" && (
//                             <Dialog>
//                               <DialogTrigger asChild>
//                                 <Button size="sm" className="gap-2">
//                                   <Star className="w-4 h-4" />
//                                   {t("writeReview")}
//                                 </Button>
//                               </DialogTrigger>
//                               <DialogContent>
//                                 <DialogHeader>
//                                   <DialogTitle>{t("rateYourExperience")}</DialogTitle>
//                                 </DialogHeader>
//                                 <div className="space-y-4">
//                                   <div className="flex justify-center gap-2">
//                                     {[1, 2, 3, 4, 5].map((star) => (
//                                       <button
//                                         key={star}
//                                         type="button"
//                                         onClick={() => setReviewRating(star)}
//                                         className="p-1"
//                                       >
//                                         <Star
//                                           className={`w-8 h-8 ${
//                                             star <= reviewRating
//                                               ? "fill-yellow-400 text-yellow-400"
//                                               : "text-muted-foreground"
//                                           }`}
//                                         />
//                                       </button>
//                                     ))}
//                                   </div>
//                                   <Textarea
//                                     placeholder={t("shareYourExperience")}
//                                     value={reviewText}
//                                     onChange={(e) => setReviewText(e.target.value)}
//                                     rows={4}
//                                   />
//                                   <Button className="w-full">
//                                     {t("submitReview")}
//                                   </Button>
//                                 </div>
//                               </DialogContent>
//                             </Dialog>
//                           )}

//                           {booking.status === "cancelled" && (
//                             <Link href="/services">
//                               <Button size="sm" className="w-full">
//                                 {t("bookAgain")}
//                               </Button>
//                             </Link>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               );
//             })
//           )}
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }


// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { 
//   Search, 
//   Filter, 
//   Plus, 
//   RefreshCw,
//   Download,
//   Eye,
//   Calendar,
//   DollarSign,
//   User,
//   Package,
//   AlertCircle
// } from 'lucide-react';
// import { useI18n } from '@/lib/i18n/context';
// import { useOrderStore } from '@/stores/order-store';
// import { OrderStatus } from '@/lib/data/order';
// import { OrderCard } from '@/components/orders/order-card';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import { Badge } from '@/components/ui/badge';
// import { Skeleton } from '@/components/ui/skeleton';
// import { toast } from '@/components/ui/use-toast';

// const statusTabs = [
//   { value: 'all', label: 'All', labelNp: 'सबै' },
//   { value: OrderStatus.PENDING, label: 'Pending', labelNp: 'बाँकी' },
//   { value: OrderStatus.ACCEPTED, label: 'Accepted', labelNp: 'स्वीकृत' },
//   { value: OrderStatus.INSPECTED, label: 'Inspected', labelNp: 'निरीक्षण' },
//   { value: OrderStatus.COMPLETED, label: 'Completed', labelNp: 'सम्पन्न' },
//   { value: OrderStatus.CANCELLED, label: 'Cancelled', labelNp: 'रद्द' },
// ];

// export default function OrdersPage() {
//   const { t, locale } = useI18n();
//   const router = useRouter();
//   const {
//     orders,
//     isLoading,
//     error,
//     pagination,
//     filters,
//     fetchCustomerOrders,
//     setFilters,
//     clearFilters,
//   } = useOrderStore();

//   const [activeTab, setActiveTab] = useState<string>('all');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [customerId, setCustomerId] = useState<number | null>(null);

//   // Mock customer ID - in real app, get from auth
//   const mockCustomerId = 49;

//   useEffect(() => {
//     loadOrders();
//   }, [activeTab, filters]);

//   const loadOrders = async () => {
//     try {
//       await fetchCustomerOrders(mockCustomerId);
//     } catch (err) {
//       toast({
//         title: 'Error',
//         description: 'Failed to load orders',
//         variant: 'destructive',
//       });
//     }
//   };

//   const handleRefresh = () => {
//     loadOrders();
//   };

//   const handleSearch = (value: string) => {
//     setSearchQuery(value);
//     // Implement search logic here
//   };

//   const handleFilterChange = (key: keyof typeof filters, value: any) => {
//     setFilters({ [key]: value });
//   };

//   const filteredOrders = orders.filter((order) => {
//     if (activeTab === 'all') return true;
//     return order.order_status === activeTab;
//   }).filter((order) => {
//     if (!searchQuery) return true;
//     const query = searchQuery.toLowerCase();
//     return (
//       order.service_name_en.toLowerCase().includes(query) ||
//       order.service_name_np.toLowerCase().includes(query) ||
//       order.customer_name.toLowerCase().includes(query) ||
//       order.professional_name.toLowerCase().includes(query) ||
//       order.id.toString().includes(query)
//     );
//   });

//   const stats = {
//     total: orders.length,
//     pending: orders.filter(o => o.order_status === OrderStatus.PENDING).length,
//     completed: orders.filter(o => o.order_status === OrderStatus.COMPLETED).length,
//     revenue: orders.reduce((sum, order) => sum + order.total_price, 0),
//   };

//   return (
//     <div className="container mx-auto p-4 md:p-6">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
//           <p className="text-muted-foreground">
//             Manage and track all your service orders
//           </p>
//         </div>
//         <div className="flex items-center gap-2">
//           <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
//             <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
//             Refresh
//           </Button>
//           <Button onClick={() => router.push('/services')}>
//             <Plus className="w-4 h-4 mr-2" />
//             New Order
//           </Button>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//         <Card>
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
//                 <h3 className="text-2xl font-bold">{stats.total}</h3>
//               </div>
//               <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
//                 <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-muted-foreground">Pending</p>
//                 <h3 className="text-2xl font-bold">{stats.pending}</h3>
//               </div>
//               <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
//                 <Calendar className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-muted-foreground">Completed</p>
//                 <h3 className="text-2xl font-bold">{stats.completed}</h3>
//               </div>
//               <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
//                 <Eye className="w-6 h-6 text-green-600 dark:text-green-400" />
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
//                 <h3 className="text-2xl font-bold">Rs. {stats.revenue.toLocaleString()}</h3>
//               </div>
//               <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
//                 <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-400" />
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Controls */}
//       <div className="flex flex-col md:flex-row gap-4 mb-6">
//         <div className="flex-1">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
//             <Input
//               placeholder="Search orders by service, name, or ID..."
//               className="pl-10"
//               value={searchQuery}
//               onChange={(e) => handleSearch(e.target.value)}
//             />
//           </div>
//         </div>
//         <div className="flex gap-2">
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="outline">
//                 <Filter className="w-4 h-4 mr-2" />
//                 Filters
//                 {Object.values(filters).filter(Boolean).length > 0 && (
//                   <Badge className="ml-2" variant="secondary">
//                     {Object.values(filters).filter(Boolean).length}
//                   </Badge>
//                 )}
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end" className="w-56">
//               <DropdownMenuLabel>Filter Orders</DropdownMenuLabel>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem onClick={() => handleFilterChange('min_price', 0)}>
//                 Show all prices
//               </DropdownMenuItem>
//               <DropdownMenuItem onClick={() => handleFilterChange('min_price', 1000)}>
//                 Above Rs. 1000
//               </DropdownMenuItem>
//               <DropdownMenuItem onClick={() => handleFilterChange('max_price', 5000)}>
//                 Below Rs. 5000
//               </DropdownMenuItem>
//               {Object.values(filters).filter(Boolean).length > 0 && (
//                 <>
//                   <DropdownMenuSeparator />
//                   <DropdownMenuItem onClick={clearFilters} className="text-red-600">
//                     Clear all filters
//                   </DropdownMenuItem>
//                 </>
//               )}
//             </DropdownMenuContent>
//           </DropdownMenu>

//           <Button variant="outline">
//             <Download className="w-4 h-4 mr-2" />
//             Export
//           </Button>
//         </div>
//       </div>

//       {/* Tabs */}
//       <Tabs value={activeTab} onValueChange={setActiveTab}>
//         <TabsList className="w-full overflow-x-auto">
//           {statusTabs.map((tab) => (
//             <TabsTrigger key={tab.value} value={tab.value} className="flex-1 min-w-[100px]">
//               {locale === 'ne' ? tab.labelNp : tab.label}
//             </TabsTrigger>
//           ))}
//         </TabsList>

//         <TabsContent value={activeTab} className="mt-6">
//           {isLoading ? (
//             <div className="space-y-4">
//               {[...Array(3)].map((_, i) => (
//                 <Card key={i}>
//                   <CardContent className="p-6">
//                     <div className="space-y-3">
//                       <Skeleton className="h-4 w-[250px]" />
//                       <Skeleton className="h-4 w-[200px]" />
//                       <Skeleton className="h-4 w-[300px]" />
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           ) : error ? (
//             <Card>
//               <CardContent className="p-8 text-center">
//                 <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
//                 <h3 className="text-lg font-semibold mb-2">Error Loading Orders</h3>
//                 <p className="text-muted-foreground mb-4">{error}</p>
//                 <Button onClick={handleRefresh}>Try Again</Button>
//               </CardContent>
//             </Card>
//           ) : filteredOrders.length === 0 ? (
//             <Card>
//               <CardContent className="p-8 text-center">
//                 <div className="mx-auto w-24 h-24 mb-4 flex items-center justify-center rounded-full bg-muted">
//                   <Package className="w-12 h-12 text-muted-foreground" />
//                 </div>
//                 <h3 className="text-lg font-semibold mb-2">No Orders Found</h3>
//                 <p className="text-muted-foreground mb-6">
//                   {searchQuery
//                     ? 'No orders match your search criteria'
//                     : activeTab === 'all'
//                     ? "You haven't placed any orders yet"
//                     : `No ${activeTab} orders found`}
//                 </p>
//                 <Button onClick={() => router.push('/services')}>
//                   Browse Services
//                 </Button>
//               </CardContent>
//             </Card>
//           ) : (
//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <p className="text-sm text-muted-foreground">
//                   Showing {filteredOrders.length} of {orders.length} orders
//                 </p>
//                 <p className="text-sm text-muted-foreground">
//                   Page {pagination.page} of {pagination.total_pages}
//                 </p>
//               </div>

//               {filteredOrders.map((order) => (
//                 <OrderCard
//                   key={order.id}
//                   order={order}
//                   isProfessional={false}
//                   showActions={true}
//                 />
//               ))}
//             </div>
//           )}
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }

