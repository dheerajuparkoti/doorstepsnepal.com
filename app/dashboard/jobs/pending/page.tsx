
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n/context';
import { useOrderStore } from '@/stores/order-store';
import { OrderStatus } from '@/lib/data/order';
import { ProfessionalOrderCard } from '@/components/orders/professional-order-card';
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
  Calendar,
  DollarSign,
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

export default function PendingJobsPage() {
  const { t, locale } = useI18n();
  const router = useRouter();
  const {
    orders,
    isLoading,
    error,
    fetchOrders,
  } = useOrderStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date_desc');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock professional ID - in real app, get from auth
  const mockProfessionalId = 24;

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setIsRefreshing(true);
      await fetchOrders({
        professional_id: mockProfessionalId,
        status: OrderStatus.PENDING,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to load jobs',
        variant: 'destructive',
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadJobs();
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  // Filter and sort pending jobs
  const pendingJobs = orders
    .filter(order => order.order_status === OrderStatus.PENDING)
    .filter(order => {
      if (!searchQuery.trim()) return true;
      
      const query = searchQuery.toLowerCase();
      return (
        order.service_name_en.toLowerCase().includes(query) ||
        order.service_name_np.toLowerCase().includes(query) ||
        order.customer_name.toLowerCase().includes(query) ||
        order.id.toString().includes(query) ||
        order.customer_address?.municipality.toLowerCase().includes(query) ||
        order.customer_address?.district.toLowerCase().includes(query) ||
        order.total_price.toString().includes(query) ||
        order.order_notes?.toLowerCase().includes(query)
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

  const getTotalPendingValue = () => {
    return pendingJobs.reduce((sum, order) => sum + order.total_price, 0);
  };

  const getAveragePendingPrice = () => {
    if (pendingJobs.length === 0) return 0;
    return getTotalPendingValue() / pendingJobs.length;
  };

  if (isLoading && !isRefreshing) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">
            {locale === 'ne' ? 'बाँकी जबहरू' : 'Pending Jobs'}
          </h1>
          <p className="text-muted-foreground">
            {locale === 'ne' 
              ? 'तपाईंको स्वीकृतिको लागि पर्खिरहेका जबहरू'
              : 'Jobs waiting for your acceptance'
            }
          </p>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
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
              {locale === 'ne' ? 'जबहरू लोड गर्न त्रुटि' : 'Error Loading Jobs'}
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
              {locale === 'ne' ? 'बाँकी जबहरू' : 'Pending Jobs'}
            </h1>
            <p className="text-muted-foreground">
              {locale === 'ne' 
                ? 'तपाईंको स्वीकृतिको लागि पर्खिरहेका जबहरू'
                : 'Jobs waiting for your acceptance'
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
                    ? 'सेवा, ग्राहक, स्थान, आईडी, मूल्य, वा नोटहरू द्वारा खोज्नुहोस्...'
                    : 'Search by service, customer, location, ID, price, or notes...'
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
                  {locale === 'ne' ? 'जबहरू क्रमबद्ध गर्नुहोस्' : 'Sort Jobs'}
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
                ? `${pendingJobs.length} वटा बाँकी जब "${searchQuery}" सँग मिल्दो`
                : `Found ${pendingJobs.length} pending job${pendingJobs.length !== 1 ? 's' : ''} matching "${searchQuery}"`
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

      {pendingJobs.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="mx-auto w-24 h-24 mb-4 flex items-center justify-center rounded-full bg-yellow-50">
              <Clock className="w-12 h-12 text-yellow-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {locale === 'ne' ? 'कुनै बाँकी जबहरू छैनन्' : 'No Pending Jobs'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery
                ? (locale === 'ne' 
                  ? 'तपाईंको खोजसँग मिल्ने कुनै बाँकी जबहरू फेला परेन'
                  : 'No pending jobs match your search')
                : (locale === 'ne'
                  ? 'तपाईंसँग हाल कुनै बाँकी जबहरू छैनन्'
                  : 'You have no pending jobs at the moment')
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button onClick={() => router.push('/services')}>
                <Package className="w-4 h-4 mr-2" />
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
                ? `कुल ${orders.filter(o => o.order_status === OrderStatus.PENDING).length} मध्ये ${pendingJobs.length} वटा बाँकी जबहरू देखाइएको`
                : `Showing ${pendingJobs.length} of ${orders.filter(o => o.order_status === OrderStatus.PENDING).length} pending jobs`
              }
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-yellow-50">
                <Clock className="w-3 h-3 mr-1" />
                {pendingJobs.length} {locale === 'ne' ? 'बाँकी' : 'Pending'}
              </Badge>
            </div>
          </div>

          <Separator className="my-2" />

          {/* Pending Jobs Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {locale === 'ne' ? 'कुल बाँकी मूल्य' : 'Total Pending Value'}
                    </p>
                    <p className="text-2xl font-bold text-yellow-600">
                      Rs. {getTotalPendingValue().toLocaleString()}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {locale === 'ne' ? 'औसत बाँकी मूल्य' : 'Average Pending Price'}
                    </p>
                    <p className="text-2xl font-bold">
                      Rs. {getAveragePendingPrice().toFixed(2)}
                    </p>
                  </div>
                  <Calendar className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {locale === 'ne' ? 'ग्राहकहरू' : 'Unique Customers'}
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {new Set(pendingJobs.map(o => o.customer_name)).size}
                    </p>
                  </div>
                  <User className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Action Reminder */}
          <Card className="mb-4 border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-yellow-800 dark:text-yellow-300 mb-1">
                    {locale === 'ne' ? 'शीघ्र कार्य अनुरोध' : 'Quick Action Request'}
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-400">
                    {locale === 'ne' 
                      ? 'ग्राहकहरू तपाईंको प्रतिक्रियाको प्रतिक्षा गरिरहेका छन्। शीघ्र स्वीकार वा अस्वीकार गरेर उनीहरूको समय बचाउनुहोस्।'
                      : 'Customers are waiting for your response. Help save their time by quickly accepting or rejecting jobs.'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Order Cards */}
          <div className="space-y-4">
            {pendingJobs.map((order) => (
              <ProfessionalOrderCard
                key={order.id}
                order={order}
                showActions={true}
              />
            ))}
          </div>

          {/* Pending Jobs Summary */}
          <Card className="mt-6">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">
                {locale === 'ne' ? 'बाँकी जब विश्लेषण' : 'Pending Jobs Analysis'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {locale === 'ne' ? 'विभिन्न सेवाहरू' : 'Different Services'}
                    </span>
                    <span className="font-medium">
                      {new Set(pendingJobs.map(o => o.service_name_en)).size}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {locale === 'ne' ? 'विभिन्न स्थानहरू' : 'Different Locations'}
                    </span>
                    <span className="font-medium">
                      {new Set(pendingJobs.map(o => o.customer_address?.municipality)).size}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {locale === 'ne' ? 'आजको बाँकी जबहरू' : "Today's Pending Jobs"}
                    </span>
                    <span className="font-medium">
                      {pendingJobs.filter(order => {
                        const orderDate = new Date(order.order_date);
                        const today = new Date();
                        return orderDate.toDateString() === today.toDateString();
                      }).length}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {locale === 'ne' ? 'उच्चतम बाँकी मूल्य' : 'Highest Pending Price'}
                    </span>
                    <span className="font-medium">
                      Rs. {pendingJobs.length > 0 ? Math.max(...pendingJobs.map(o => o.total_price)).toLocaleString() : '0'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {locale === 'ne' ? 'न्यूनतम बाँकी मूल्य' : 'Lowest Pending Price'}
                    </span>
                    <span className="font-medium">
                      Rs. {pendingJobs.length > 0 ? Math.min(...pendingJobs.map(o => o.total_price)).toLocaleString() : '0'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {locale === 'ne' ? 'कुल ग्राहक नोटहरू' : 'Total Customer Notes'}
                    </span>
                    <span className="font-medium">
                      {pendingJobs.filter(o => o.order_notes).length}
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