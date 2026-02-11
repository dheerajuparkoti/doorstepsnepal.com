
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n/context';
import { useOrderStore } from '@/stores/order-store';
import { OrderStatus, PaymentStatus } from '@/lib/data/order';
import { CompactPaymentCard } from '@/components/orders/orders-payment-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Search,
  Filter,
  RefreshCw,
  AlertCircle,
  DollarSign,
  CreditCard,
  CheckCircle,
  XCircle,
  Calendar,
  Package,
  X,
  BarChart3,
  Wallet,
  Receipt,
  Users,
  TrendingUp,
  TrendingDown
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
import { Progress } from '@/components/ui/progress';

export default function PaymentDashboardPage() {
  const { t, locale } = useI18n();
  const router = useRouter();
  const {
    orders,
    isLoading,
    error,
    fetchCustomerOrders,
    fetchOrders,
  } = useOrderStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date_desc');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isProfessional, setIsProfessional] = useState(false);

  // Mock IDs - in real app, get from auth
  const mockCustomerId = 49;
  const mockProfessionalId = 24;

  useEffect(() => {
 
    const userType = localStorage.getItem('user_type') || 'customer';
    setIsProfessional(userType === 'professional');
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setIsRefreshing(true);
      if (isProfessional) {
        await fetchOrders({ professional_id: mockProfessionalId });
      } else {
        await fetchCustomerOrders(mockCustomerId);
          // await fetchOrders({ professional_id: mockProfessionalId });
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to load payment data',
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

  // Calculate payment statistics
  const calculatePaymentStats = () => {
    let totalAmount = 0;
    let totalPaid = 0;
    let totalPending = 0;
    let totalOrders = orders.length;
    let completedOrders = 0;
    let cancelledOrders = 0;
    let pendingOrders = 0;

    orders.forEach(order => {
      totalAmount += order.total_price;
      const paidAmount = order.total_paid_amount || 0;
      totalPaid += paidAmount;
      totalPending += order.total_price - paidAmount;
      
      if (order.order_status === OrderStatus.COMPLETED) {
        completedOrders++;
      }
      if (order.order_status === OrderStatus.CANCELLED) {
        cancelledOrders++;
      }
      if (order.order_status === OrderStatus.PENDING) {
        pendingOrders++;
      }
    });

    const paymentPercentage = totalAmount > 0 ? (totalPaid / totalAmount * 100) : 0;
    const completionRate = totalOrders > 0 ? (completedOrders / totalOrders * 100) : 0;

    return {
      totalAmount,
      totalPaid,
      totalPending,
      paymentPercentage,
      totalOrders,
      completedOrders,
      cancelledOrders,
      pendingOrders,
      completionRate,
    };
  };

  const stats = calculatePaymentStats();

  // Filter and sort orders based on search
  const filteredOrders = orders
    .filter(order => {
      if (!searchQuery.trim()) return true;
      
      const query = searchQuery.toLowerCase();
      return (
        order.service_name_en.toLowerCase().includes(query) ||
        order.service_name_np.toLowerCase().includes(query) ||
        (isProfessional 
          ? order.customer_name.toLowerCase().includes(query)
          : order.professional_name?.toLowerCase().includes(query)) ||
        order.id.toString().includes(query) ||
        order.total_price.toString().includes(query) ||
        order.payment_status.toLowerCase().includes(query) ||
        order.order_status.toLowerCase().includes(query)
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
        case 'paid_desc':
          return (b.total_paid_amount || 0) - (a.total_paid_amount || 0);
        case 'paid_asc':
          return (a.total_paid_amount || 0) - (b.total_paid_amount || 0);
        default:
          return 0;
      }
    });

  if (isLoading && !isRefreshing) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">
            {locale === 'ne' ? 'भुक्तानी' : 'Payments'}
          </h1>
          <Skeleton className="h-4 w-[200px] mt-2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
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
              {locale === 'ne' ? 'भुक्तानी डाटा लोड गर्न त्रुटि' : 'Error Loading Payment Data'}
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
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {isProfessional 
                ? (locale === 'ne' ? 'भुक्तानी संग्रह' : 'Payment Collections')
                : (locale === 'ne' ? 'सबै भुक्तानीहरू' : 'All Payments')
              }
            </h1>
            <p className="text-muted-foreground">
              {isProfessional
                ? (locale === 'ne' 
                    ? 'तपाईंको जबहरूको भुक्तानी विवरण'
                    : 'Payment details for your jobs')
                : (locale === 'ne'
                    ? 'तपाईंको सबै सेवाहरूको भुक्तानी विवरण'
                    : 'Payment details for all your services')
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
                    ? 'सेवा, ग्राहक, आईडी, मूल्य, वा भुक्तानी स्थिति द्वारा खोज्नुहोस्...'
                    : 'Search by service, customer, ID, price, or payment status...'
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
                  {locale === 'ne' ? 'भुक्तानी क्रमबद्ध गर्नुहोस्' : 'Sort Payments'}
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
                <DropdownMenuItem onClick={() => setSortBy('paid_desc')}>
                  {locale === 'ne' ? 'भुक्तानी (उच्च देखि न्यून)' : 'Paid Amount (High to Low)'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('paid_asc')}>
                  {locale === 'ne' ? 'भुक्तानी (न्यून देखि उच्च)' : 'Paid Amount (Low to High)'}
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
                ? `${filteredOrders.length} वटा भुक्तानी "${searchQuery}" सँग मिल्दो`
                : `Found ${filteredOrders.length} payment${filteredOrders.length !== 1 ? 's' : ''} matching "${searchQuery}"`
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

      {/* Quick Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium">
              {isProfessional ? 'Total Value' : 'Total Spend'}
            </span>
          </div>
          <p className="text-xl font-bold">Rs. {stats.totalAmount.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">{stats.totalOrders} orders</p>
        </div>

        <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Wallet className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium">
              {isProfessional ? 'Collected' : 'Paid'}
            </span>
          </div>
          <p className="text-xl font-bold text-green-600">Rs. {stats.totalPaid.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">{stats.paymentPercentage.toFixed(1)}% complete</p>
        </div>

        <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Receipt className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-medium">
              {isProfessional ? 'Due' : 'Pending'}
            </span>
          </div>
          <p className="text-xl font-bold text-orange-600">Rs. {stats.totalPending.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">{stats.pendingOrders} pending</p>
        </div>

        <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium">Completed</span>
          </div>
          <p className="text-xl font-bold text-purple-600">{stats.completedOrders}</p>
          <p className="text-xs text-muted-foreground">{stats.completionRate.toFixed(1)}% rate</p>
        </div>
      </div>

      {/* Payment Progress */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              {locale === 'ne' ? 'भुक्तानी प्रगति' : 'Payment Progress'}
            </h3>
            <Badge variant="outline">
              {stats.paymentPercentage.toFixed(1)}% {locale === 'ne' ? 'पूर्ण' : 'complete'}
            </Badge>
          </div>
          <Progress value={stats.paymentPercentage} className="h-3 mb-2" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Rs. {stats.totalPaid.toLocaleString()} {isProfessional ? 'collected' : 'paid'}</span>
            <span>Rs. {stats.totalAmount.toLocaleString()} total</span>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">
            {locale === 'ne' ? 'भुक्तानी विवरणहरू' : 'Payment Details'}
          </h3>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {filteredOrders.length} {locale === 'ne' ? 'जबहरू' : 'orders'}
            </Badge>
            {isProfessional && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                <Users className="w-3 h-3 mr-1" />
                {new Set(filteredOrders.map(o => o.customer_name)).size} {locale === 'ne' ? 'ग्राहकहरू' : 'customers'}
              </Badge>
            )}
          </div>
        </div>

        <Separator className="my-2" />

        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="mx-auto w-24 h-24 mb-4 flex items-center justify-center rounded-full bg-gray-100">
                <CreditCard className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {locale === 'ne' ? 'कुनै भुक्तानी फेला परेन' : 'No Payments Found'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery
                  ? (locale === 'ne' 
                    ? 'तपाईंको खोजसँग मिल्ने कुनै भुक्तानी फेला परेन'
                    : 'No payments match your search')
                  : (locale === 'ne'
                    ? 'तपाईंसँग हाल कुनै भुक्तानीहरू छैनन्'
                    : 'You have no payments at the moment')
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOrders.map((order) => (
              <CompactPaymentCard
                key={order.id}
                order={order}
                isProfessional={isProfessional}
              />
            ))}
          </div>
        )}
      </div>

      {/* Payment Tips */}
      <Card className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
              <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-1">
                {isProfessional
                  ? (locale === 'ne' ? 'भुक्तानी संग्रह टिप्स' : 'Payment Collection Tips')
                  : (locale === 'ne' ? 'भुक्तानी गर्ने टिप्स' : 'Payment Tips')
                }
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                {isProfessional
                  ? (locale === 'ne' 
                    ? '• सेवा सम्पन्न गर्नुअघि भुक्तानी प्राप्त गर्नुहोस्\n• ग्राहकहरूलाई भुक्तानी अनुस्मारक पठाउनुहोस्\n• विभिन्न भुक्तानी विधिहरू स्वीकार गर्नुहोस्'
                    : '• Receive payment before completing the service\n• Send payment reminders to customers\n• Accept multiple payment methods'
                  )
                  : (locale === 'ne'
                    ? '• सेवा प्राप्त गर्नुअघि भुक्तानी गर्नुहोस्\n• भुक्तानी रसिद सङ्ग्रह गर्नुहोस्\n• सुरक्षित भुक्तानी विधिहरू प्रयोग गर्नुहोस्'
                    : '• Make payments before receiving the service\n• Keep payment receipts for records\n• Use secure payment methods'
                  )
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}