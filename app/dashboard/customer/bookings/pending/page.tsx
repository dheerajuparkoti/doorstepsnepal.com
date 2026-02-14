
'use client';

import { useEffect, useState, useCallback } from 'react';
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
  Clock,
  Package,
  X,
  ChevronLeft,
  ChevronRight
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

export default function PendingBookingsPage() {
  const { t, locale } = useI18n();
  const {
    orders,
    isLoading,
    error,
    fetchCustomerOrders,
  } = useOrderStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date_desc');
  const [isSearching, setIsSearching] = useState(false);

  // Mock customer ID - in real app, get from auth
  const mockCustomerId = 49;

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setIsSearching(true);
      await fetchCustomerOrders(mockCustomerId);
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to load bookings',
        variant: 'destructive',
      });
    } finally {
      setIsSearching(false);
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

  // Filter and sort orders
  const filteredOrders = orders
    .filter(order => order.order_status === OrderStatus.PENDING)
    .filter(order => {
      if (!searchQuery.trim()) return true;
      
      const query = searchQuery.toLowerCase();
      return (
        order.service_name_en.toLowerCase().includes(query) ||
        order.service_name_np.toLowerCase().includes(query) ||
        order.professional_name?.toLowerCase().includes(query) ||
        order.id.toString().includes(query) ||
        order.customer_address?.municipality.toLowerCase().includes(query) ||
        order.customer_address?.district.toLowerCase().includes(query)
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
        default:
          return 0;
      }
    });

  if (isLoading && !isSearching) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Pending Bookings</h1>
          <p className="text-muted-foreground">Bookings waiting for acceptance</p>
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
            <h3 className="text-lg font-semibold mb-2">Error Loading Bookings</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={handleRefresh}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
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
              {locale === 'ne' ? 'बाँकी बुकिंगहरू' : 'Pending Bookings'}
            </h1>
            <p className="text-muted-foreground">
              {locale === 'ne' 
                ? 'पेशेवर स्वीकृतिको लागि पर्खिरहेका बुकिंगहरू'
                : 'Bookings waiting for professional acceptance'
              }
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleRefresh} disabled={isSearching}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isSearching ? 'animate-spin' : ''}`} />
              {isSearching ? 'Refreshing...' : 'Refresh'}
            </Button>
            <Button onClick={() => window.location.href = '/services'}>
              <Package className="w-4 h-4 mr-2" />
              {locale === 'ne' ? 'नयाँ सेवा बुक गर्नुहोस्' : 'Book New Service'}
            </Button>
          </div>
        </div>

        {/* Search and Filters - Similar to jobs/pending/page.tsx */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder={
                  locale === 'ne' 
                    ? 'सेवा, पेशेवर, स्थान, वा आईडी द्वारा खोज्नुहोस्...'
                    : 'Search by service, professional, location, or ID...'
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
                  {locale === 'ne' ? 'मिति (नयाँ देखि पुरानो)' : 'Date (Newest First)'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('date_asc')}>
                  {locale === 'ne' ? 'मिति (पुरानो देखि नयाँ)' : 'Date (Oldest First)'}
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
                ? `${filteredOrders.length} वटा बुकिंग "${searchQuery}" सँग मिल्दो`
                : `Found ${filteredOrders.length} booking${filteredOrders.length !== 1 ? 's' : ''} matching "${searchQuery}"`
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

      {filteredOrders.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="mx-auto w-24 h-24 mb-4 flex items-center justify-center rounded-full bg-yellow-50">
              <Clock className="w-12 h-12 text-yellow-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {locale === 'ne' ? 'कुनै बाँकी बुकिंगहरू छैनन्' : 'No Pending Bookings'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery
                ? (locale === 'ne' 
                  ? 'तपाईंको खोजसँग मिल्ने कुनै बुकिंगहरू फेला परेन'
                  : 'No pending bookings match your search')
                : (locale === 'ne'
                  ? 'तपाईंसँग हाल कुनै बाँकी बुकिंगहरू छैनन्'
                  : 'You have no pending bookings at the moment')
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
                ? `कुल ${orders.length} मध्ये ${filteredOrders.length} वटा बुकिंगहरू देखाइएको`
                : `Showing ${filteredOrders.length} of ${orders.length} bookings`
              }
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-yellow-50">
                <Clock className="w-3 h-3 mr-1" />
                {filteredOrders.length} {locale === 'ne' ? 'बाँकी' : 'Pending'}
              </Badge>
            </div>
          </div>

          <Separator className="my-2" />

          {/* Use your existing OrderCard component */}
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                isProfessional={false}
                showActions={true}
              />
            ))}
          </div>

          {/* Optional: Add pagination if you have many orders */}
          {filteredOrders.length > 10 && (
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex-1 text-sm text-muted-foreground">
                {locale === 'ne'
                  ? `पृष्ठ १ को ${Math.ceil(filteredOrders.length / 10)}`
                  : `Page 1 of ${Math.ceil(filteredOrders.length / 10)}`
                }
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={true} // You can implement pagination later
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  {locale === 'ne' ? 'अघिल्लो' : 'Previous'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={true} // You can implement pagination later
                >
                  {locale === 'ne' ? 'अर्को' : 'Next'}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}