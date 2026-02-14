
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
  Eye,
  Package,
  X,
  FileText,
  Calendar,
  DollarSign,
  Phone,
  User,
  CheckCircle,
  MessageSquare
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

export default function InspectedBookingsPage() {
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

  // Filter and sort inspected orders
  const inspectedOrders = orders
    .filter(order => order.order_status === OrderStatus.INSPECTED)
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
        order.inspection_notes?.toLowerCase().includes(query)
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

  const handleMakePayment = (orderId: number) => {
    window.location.href = `/payment/${orderId}`;
  };

  const handleCallProfessional = (phone: string) => {
    window.open(`tel:${phone}`);
  };

  const handleViewDetails = (orderId: number) => {
    window.location.href = `/orders/${orderId}`;
  };

  if (isLoading && !isRefreshing) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">
            {locale === 'ne' ? 'निरीक्षण गरिएका बुकिंगहरू' : 'Inspected Bookings'}
          </h1>
          <p className="text-muted-foreground">
            {locale === 'ne' 
              ? 'साइट निरीक्षण पछिका बुकिंगहरू'
              : 'Bookings after site inspection'
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
              {locale === 'ne' ? 'निरीक्षण गरिएका बुकिंगहरू' : 'Inspected Bookings'}
            </h1>
            <p className="text-muted-foreground">
              {locale === 'ne' 
                ? 'साइट निरीक्षण पछिका बुकिंगहरू - अन्तिम मूल्य निश्चित भयो'
                : 'Bookings after site inspection - Final price confirmed'
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
                    ? 'सेवा, पेशेवर, स्थान, आईडी, मूल्य, वा निरीक्षण नोट द्वारा खोज्नुहोस्...'
                    : 'Search by service, professional, location, ID, price, or inspection notes...'
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
                  {locale === 'ne' ? 'निरीक्षण मिति (नयाँ देखि पुरानो)' : 'Inspection Date (Newest First)'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('date_asc')}>
                  {locale === 'ne' ? 'निरीक्षण मिति (पुरानो देखि नयाँ)' : 'Inspection Date (Oldest First)'}
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
                ? `${inspectedOrders.length} वटा निरीक्षण गरिएको बुकिंग "${searchQuery}" सँग मिल्दो`
                : `Found ${inspectedOrders.length} inspected booking${inspectedOrders.length !== 1 ? 's' : ''} matching "${searchQuery}"`
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

      {inspectedOrders.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="mx-auto w-24 h-24 mb-4 flex items-center justify-center rounded-full bg-purple-50">
              <Eye className="w-12 h-12 text-purple-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {locale === 'ne' ? 'कुनै निरीक्षण गरिएका बुकिंगहरू छैनन्' : 'No Inspected Bookings'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery
                ? (locale === 'ne' 
                  ? 'तपाईंको खोजसँग मिल्ने कुनै निरीक्षण गरिएका बुकिंगहरू फेला परेन'
                  : 'No inspected bookings match your search')
                : (locale === 'ne'
                  ? 'तपाईंसँग हाल कुनै निरीक्षण गरिएका बुकिंगहरू छैनन्'
                  : 'You have no inspected bookings at the moment')
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
                ? `कुल ${orders.filter(o => o.order_status === OrderStatus.INSPECTED).length} मध्ये ${inspectedOrders.length} वटा निरीक्षण गरिएका बुकिंगहरू देखाइएको`
                : `Showing ${inspectedOrders.length} of ${orders.filter(o => o.order_status === OrderStatus.INSPECTED).length} inspected bookings`
              }
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-purple-50">
                <Eye className="w-3 h-3 mr-1" />
                {inspectedOrders.length} {locale === 'ne' ? 'निरीक्षण गरियो' : 'Inspected'}
              </Badge>
            </div>
          </div>

          <Separator className="my-2" />

          {/* Stats Summary for Inspected Bookings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {locale === 'ne' ? 'कुल अन्तिम मूल्य' : 'Total Final Price'}
                    </p>
                    <p className="text-2xl font-bold">
                      Rs. {inspectedOrders.reduce((sum, order) => sum + order.total_price, 0)}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {locale === 'ne' ? 'भुक्तानी बाँकी' : 'Payment Required'}
                    </p>
                    <p className="text-2xl font-bold text-orange-600">
                      {inspectedOrders.filter(o => o.payment_status !== PaymentStatus.PAID).length}
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
                      {locale === 'ne' ? 'भुक्तानी भयो' : 'Payment Done'}
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {inspectedOrders.filter(o => o.payment_status === PaymentStatus.PAID).length}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Use your existing OrderCard component */}
          <div className="space-y-4">
            {inspectedOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                isProfessional={false}
                showActions={true}
              />
            ))}
          </div>

          {/* Important Note for Inspected Bookings */}
          <Card className="mt-6 border-purple-200 bg-purple-50 dark:bg-purple-950/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-purple-800 dark:text-purple-300 mb-1">
                    {locale === 'ne' ? 'महत्त्वपूर्ण जानकारी' : 'Important Information'}
                  </p>
                  <p className="text-sm text-purple-700 dark:text-purple-400">
                    {locale === 'ne' 
                      ? 'निरीक्षण गरिएका बुकिंगहरूमा अन्तिम मूल्य निश्चित भइसकेको छ। सेवा सुरु गर्नुअघि भुक्तानी गर्नुपर्ने हुनसक्छ।'
                      : 'Inspected bookings have confirmed final prices. Payment may be required before service can begin.'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}