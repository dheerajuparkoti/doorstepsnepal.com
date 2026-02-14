
'use client';

import { useEffect, useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { useOrderStore } from '@/stores/order-store';
import { OrderStatus, PaymentStatus } from '@/lib/data/order';
import { OrderCard } from '@/components/orders/customer-order-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Search,
  Filter,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Package,
  X,
  Eye,
  DollarSign,
  Phone,
  MessageSquare,
  Calendar,
  Clock,
  MapPin,
  User
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const paymentStatusConfig = {
  [PaymentStatus.UNPAID]: {
    label: "Unpaid",
    labelNp: "भुक्तानी बाँकी",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  },
  [PaymentStatus.PARTIAL]: {
    label: "Partial",
    labelNp: "आंशिक भुक्तानी",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  },
  [PaymentStatus.PAID]: {
    label: "Paid",
    labelNp: "भुक्तानी भयो",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  },
};

export default function AcceptedBookingsPage() {
  const { t, locale } = useI18n();
  const {
    orders,
    isLoading,
    error,
    fetchCustomerOrders,
  } = useOrderStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date_desc');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock customer ID - in real app, get from auth
  const mockCustomerId = 49;

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setIsRefreshing(true);
      await fetchCustomerOrders(mockCustomerId);
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to load bookings',
        variant: 'destructive',
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadOrders();
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  // Filter and sort accepted orders
  const acceptedOrders = orders
    .filter(order => order.order_status === OrderStatus.ACCEPTED)
    .filter(order => {
      if (!searchQuery.trim()) return true;
      
      const query = searchQuery.toLowerCase();
      return (
        order.service_name_en.toLowerCase().includes(query) ||
        order.service_name_np.toLowerCase().includes(query) ||
        order.professional_name?.toLowerCase().includes(query) ||
        order.id.toString().includes(query) ||
        order.customer_address?.municipality.toLowerCase().includes(query) ||
        order.customer_address?.district.toLowerCase().includes(query) ||
        order.total_price.toString().includes(query)
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date_desc':
          return new Date(b.order_date).getTime() - new Date(a.order_date).getTime();
        case 'date_asc':
          return new Date(a.order_date).getTime() - new Date(b.order_date).getTime();
        case 'price_desc':
          return b.total_price - a.total_price;
        case 'price_asc':
          return a.total_price - b.total_price;
        case 'scheduled_desc':
          return new Date(b.scheduled_date).getTime() - new Date(a.scheduled_date).getTime();
        case 'scheduled_asc':
          return new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime();
        default:
          return 0;
      }
    });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleMakePayment = (orderId: number) => {
    window.location.href = `/payment/${orderId}`;
  };

  const handleCallProfessional = (phone: string) => {
    window.open(`tel:${phone}`);
  };

  if (isLoading && !isRefreshing) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">
            {locale === 'ne' ? 'स्वीकृत बुकिंगहरू' : 'Accepted Bookings'}
          </h1>
          <p className="text-muted-foreground">
            {locale === 'ne' 
              ? 'पेशेवरहरूद्वारा स्वीकृत बुकिंगहरू'
              : 'Bookings accepted by professionals'
            }
          </p>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <Skeleton className="h-6 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {locale === 'ne' ? 'बुकिंगहरू लोड गर्न त्रुटि' : 'Error Loading Bookings'}
            </h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={handleRefresh}>
              <RefreshCw className="w-4 h-4 mr-2" />
              {locale === 'ne' ? 'पुनः प्रयास गर्नुहोस्' : 'Try Again'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {locale === 'ne' ? 'स्वीकृत बुकिंगहरू' : 'Accepted Bookings'}
            </h1>
            <p className="text-muted-foreground">
              {locale === 'ne' 
                ? 'पेशेवरहरूद्वारा स्वीकृत बुकिंगहरू'
                : 'Bookings accepted by professionals'
              }
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing 
                ? (locale === 'ne' ? 'ताजा पार्दै...' : 'Refreshing...') 
                : (locale === 'ne' ? 'ताजा पार्नुहोस्' : 'Refresh')
              }
            </Button>
            <Button onClick={() => window.location.href = '/services'}>
              <Package className="w-4 h-4 mr-2" />
              {locale === 'ne' ? 'नयाँ सेवा बुक गर्नुहोस्' : 'Book New Service'}
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder={
                  locale === 'ne' 
                    ? 'सेवा, पेशेवर, स्थान, आईडी, वा मूल्य द्वारा खोज्नुहोस्...'
                    : 'Search by service, professional, location, ID, or price...'
                }
                className="pl-10 pr-10"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
                  onClick={clearSearch}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  {locale === 'ne' ? 'क्रमबद्ध गर्नुहोस्' : 'Sort By'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  {locale === 'ne' ? 'बुकिंग क्रमबद्ध गर्नुहोस्' : 'Sort Bookings'}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSortBy('date_desc')}>
                  {locale === 'ne' ? 'आर्डर मिति (नयाँ देखि पुरानो)' : 'Order Date (Newest First)'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('date_asc')}>
                  {locale === 'ne' ? 'आर्डर मिति (पुरानो देखि नयाँ)' : 'Order Date (Oldest First)'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('scheduled_desc')}>
                  {locale === 'ne' ? 'सेवा मिति (नयाँ देखि पुरानो)' : 'Service Date (Newest First)'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('scheduled_asc')}>
                  {locale === 'ne' ? 'सेवा मिति (पुरानो देखि नयाँ)' : 'Service Date (Oldest First)'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('price_desc')}>
                  {locale === 'ne' ? 'मूल्य (उच्च देखि न्यून)' : 'Price (High to Low)'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('price_asc')}>
                  {locale === 'ne' ? 'मूल्य (न्यून देखि उच्च)' : 'Price (Low to High)'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Clear Filters Button */}
            {(searchQuery || sortBy !== 'date_desc') && (
              <Button
                variant="outline"
                onClick={() => {
                  clearSearch();
                  setSortBy('date_desc');
                }}
              >
                {locale === 'ne' ? 'फिल्टरहरू हटाउनुहोस्' : 'Clear Filters'}
              </Button>
            )}
          </div>
        </div>

        {/* Search Results Info */}
        {searchQuery && (
          <div className="flex items-center justify-between text-sm mb-4">
            <p className="text-muted-foreground">
              {locale === 'ne' 
                ? `${acceptedOrders.length} वटा स्वीकृत बुकिंग "${searchQuery}" सँग मिल्दो`
                : `Found ${acceptedOrders.length} accepted booking${acceptedOrders.length !== 1 ? 's' : ''} matching "${searchQuery}"`
              }
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
            >
              {locale === 'ne' ? 'खोज हटाउनुहोस्' : 'Clear search'}
            </Button>
          </div>
        )}
      </div>

      {acceptedOrders.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="mx-auto w-24 h-24 mb-4 flex items-center justify-center rounded-full bg-blue-50">
              <CheckCircle className="w-12 h-12 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {locale === 'ne' ? 'कुनै स्वीकृत बुकिंगहरू छैनन्' : 'No Accepted Bookings'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery
                ? (locale === 'ne' 
                  ? 'तपाईंको खोजसँग मिल्ने कुनै स्वीकृत बुकिंगहरू फेला परेन'
                  : 'No accepted bookings match your search')
                : (locale === 'ne'
                  ? 'तपाईंसँग हाल कुनै स्वीकृत बुकिंगहरू छैनन्'
                  : 'You have no accepted bookings at the moment')
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button onClick={() => window.location.href = '/services'}>
                {locale === 'ne' ? 'सेवाहरू ब्राउज गर्नुहोस्' : 'Browse Services'}
              </Button>
              {searchQuery && (
                <Button variant="outline" onClick={clearSearch}>
                  {locale === 'ne' ? 'सबै खोज हटाउनुहोस्' : 'Clear all search'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {locale === 'ne'
                ? `कुल ${orders.filter(o => o.order_status === OrderStatus.ACCEPTED).length} मध्ये ${acceptedOrders.length} वटा स्वीकृत बुकिंगहरू देखाइएको`
                : `Showing ${acceptedOrders.length} of ${orders.filter(o => o.order_status === OrderStatus.ACCEPTED).length} accepted bookings`
              }
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-50">
                <CheckCircle className="w-3 h-3 mr-1" />
                {acceptedOrders.length} {locale === 'ne' ? 'स्वीकृत' : 'Accepted'}
              </Badge>
            </div>
          </div>

          <Separator className="my-2" />

          {/* Use your existing OrderCard component */}
          <div className="space-y-4">
            {acceptedOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                isProfessional={false}
                showActions={true}
              />
            ))}
          </div>

          {/* Optional: Statistics Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {locale === 'ne' ? 'कुल मूल्य' : 'Total Value'}
                    </p>
                    <p className="text-2xl font-bold">
                      Rs. {acceptedOrders.reduce((sum, order) => sum + order.total_price, 0)}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {locale === 'ne' ? 'भुक्तानी बाँकी' : 'Pending Payment'}
                    </p>
                    <p className="text-2xl font-bold text-orange-600">
                      {acceptedOrders.filter(o => o.payment_status !== PaymentStatus.PAID).length}
                    </p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {locale === 'ne' ? 'भुक्तानी भयो' : 'Paid'}
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {acceptedOrders.filter(o => o.payment_status === PaymentStatus.PAID).length}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}