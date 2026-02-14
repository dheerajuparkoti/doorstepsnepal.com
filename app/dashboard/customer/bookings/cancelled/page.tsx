

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
  XCircle,
  Package,
  X,
  Calendar,
  DollarSign,
  User,
  Eye,
  Undo2,
  History
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

export default function CancelledBookingsPage() {
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

  // Filter and sort cancelled orders
  const cancelledOrders = orders
    .filter(order => order.order_status === OrderStatus.CANCELLED)
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
        order.total_price.toString().includes(query) ||
        order.order_notes?.toLowerCase().includes(query) 
        // (order.cancellation_reason && order.cancellation_reason.toLowerCase().includes(query))
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

  const handleViewDetails = (orderId: number) => {
    window.location.href = `/orders/${orderId}`;
  };

  const handleBookSimilar = (serviceName: string) => {
    window.location.href = `/services?search=${encodeURIComponent(serviceName)}`;
  };

  const getTotalCancelledValue = () => {
    return cancelledOrders.reduce((sum, order) => sum + order.total_price, 0);
  };

  const getCancellationRate = () => {
    if (orders.length === 0) return 0;
    return (cancelledOrders.length / orders.length) * 100;
  };

  if (isLoading && !isRefreshing) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">
            {locale === 'ne' ? 'रद्द गरिएका बुकिंगहरू' : 'Cancelled Bookings'}
          </h1>
          <p className="text-muted-foreground">
            {locale === 'ne' 
              ? 'रद्द गरिएका सेवा बुकिंगहरू'
              : 'Cancelled service bookings'
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
              {locale === 'ne' ? 'रद्द गरिएका बुकिंगहरू' : 'Cancelled Bookings'}
            </h1>
            <p className="text-muted-foreground">
              {locale === 'ne' 
                ? 'रद्द गरिएका सेवा बुकिंगहरूको इतिहास'
                : 'History of cancelled service bookings'
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
                    ? 'सेवा, पेशेवर, स्थान, आईडी, मूल्य, वा रद्द गर्ने कारण द्वारा खोज्नुहोस्...'
                    : 'Search by service, professional, location, ID, price, or cancellation reason...'
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
                  {locale === 'ne' ? 'रद्द मिति (नयाँ देखि पुरानो)' : 'Cancellation Date (Newest First)'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('date_asc')}>
                  {locale === 'ne' ? 'रद्द मिति (पुरानो देखि नयाँ)' : 'Cancellation Date (Oldest First)'}
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
                ? `${cancelledOrders.length} वटा रद्द बुकिंग "${searchQuery}" सँग मिल्दो`
                : `Found ${cancelledOrders.length} cancelled booking${cancelledOrders.length !== 1 ? 's' : ''} matching "${searchQuery}"`
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

      {cancelledOrders.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="mx-auto w-24 h-24 mb-4 flex items-center justify-center rounded-full bg-red-50">
              <XCircle className="w-12 h-12 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {locale === 'ne' ? 'कुनै रद्द बुकिंगहरू छैनन्' : 'No Cancelled Bookings'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery
                ? (locale === 'ne' 
                  ? 'तपाईंको खोजसँग मिल्ने कुनै रद्द बुकिंगहरू फेला परेन'
                  : 'No cancelled bookings match your search')
                : (locale === 'ne'
                  ? 'तपाईंसँग हाल कुनै रद्द गरिएका बुकिंगहरू छैनन्'
                  : 'You have no cancelled bookings at the moment')
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
                ? `कुल ${orders.filter(o => o.order_status === OrderStatus.CANCELLED).length} मध्ये ${cancelledOrders.length} वटा रद्द बुकिंगहरू देखाइएको`
                : `Showing ${cancelledOrders.length} of ${orders.filter(o => o.order_status === OrderStatus.CANCELLED).length} cancelled bookings`
              }
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-red-50">
                <XCircle className="w-3 h-3 mr-1" />
                {cancelledOrders.length} {locale === 'ne' ? 'रद्द' : 'Cancelled'}
              </Badge>
            </div>
          </div>

          <Separator className="my-2" />

          {/* Cancellation Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {locale === 'ne' ? 'कुल रद्द मूल्य' : 'Total Cancelled Value'}
                    </p>
                    <p className="text-2xl font-bold text-red-600">
                      Rs. {getTotalCancelledValue().toLocaleString()}
                    </p>
                  </div>
                  <XCircle className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {locale === 'ne' ? 'रद्द दर' : 'Cancellation Rate'}
                    </p>
                    <p className="text-2xl font-bold text-orange-600">
                      {getCancellationRate().toFixed(1)}%
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
                      {locale === 'ne' ? 'औसत रद्द मूल्य' : 'Average Cancelled Price'}
                    </p>
                    <p className="text-2xl font-bold">
                      Rs. {cancelledOrders.length > 0 ? (getTotalCancelledValue() / cancelledOrders.length).toFixed(2) : '0.00'}
                    </p>
                  </div>
                  <History className="w-8 h-8 text-gray-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Rebooking Suggestion */}
          <Card className="mb-4 border-orange-200 bg-orange-50 dark:bg-orange-950/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Undo2 className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-orange-800 dark:text-orange-300 mb-1">
                    {locale === 'ne' ? 'पुनः बुक गर्ने सुझाव' : 'Rebooking Suggestion'}
                  </p>
                  <p className="text-sm text-orange-700 dark:text-orange-400">
                    {locale === 'ne' 
                      ? 'तपाईंले रद्द गर्नुभएको सेवा पुनः बुक गर्न चाहनुहुन्छ? हामीले तपाईंलाई फेरि समान सेवा खोज्न मद्दत गर्न सक्छौं।'
                      : 'Want to rebook a service you cancelled? We can help you find similar services again.'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Use your existing OrderCard component */}
          <div className="space-y-4">
            {cancelledOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                isProfessional={false}
                showActions={false} // No actions for cancelled orders
              />
            ))}
          </div>

          {/* Cancelled Orders Summary */}
          <Card className="mt-6">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">
                {locale === 'ne' ? 'रद्द बुकिंग विश्लेषण' : 'Cancelled Bookings Analysis'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {locale === 'ne' ? 'कुल बुकिंग' : 'Total Bookings'}
                    </span>
                    <span className="font-medium">{orders.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {locale === 'ne' ? 'रद्द बुकिंग' : 'Cancelled Bookings'}
                    </span>
                    <span className="font-medium text-red-600">{cancelledOrders.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {locale === 'ne' ? 'रद्द दर' : 'Cancellation Rate'}
                    </span>
                    <span className="font-medium">{getCancellationRate().toFixed(1)}%</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {locale === 'ne' ? 'उच्चतम रद्द मूल्य' : 'Highest Cancelled Price'}
                    </span>
                    <span className="font-medium">
                      Rs. {cancelledOrders.length > 0 ? Math.max(...cancelledOrders.map(o => o.total_price)).toLocaleString() : '0'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {locale === 'ne' ? 'न्यूनतम रद्द मूल्य' : 'Lowest Cancelled Price'}
                    </span>
                    <span className="font-medium">
                      Rs. {cancelledOrders.length > 0 ? Math.min(...cancelledOrders.map(o => o.total_price)).toLocaleString() : '0'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {locale === 'ne' ? 'भिन्न सेवाहरू' : 'Different Services'}
                    </span>
                    <span className="font-medium">
                      {new Set(cancelledOrders.map(o => o.service_name_en)).size}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}