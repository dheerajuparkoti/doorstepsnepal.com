
'use client';

import { useEffect, useState } from 'react';
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
  XCircle,
  X,
  DollarSign,
  Calendar,
  User,
  Package,
  TrendingDown,
  AlertTriangle,
  RotateCcw,
  Info
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

export default function CancelledJobsPage() {
  const { t, locale } = useI18n();
  const {
    orders,
    isLoading,
    error,
    fetchOrders,
  } = useOrderStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date_desc');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const mockProfessionalId = 24; // Replace with actual professional ID

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setIsRefreshing(true);
      await fetchOrders({
        professional_id: mockProfessionalId,
        status: OrderStatus.CANCELLED,
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

  // Filter and sort cancelled jobs
  const cancelledJobs = orders
    .filter(order => order.order_status === OrderStatus.CANCELLED)
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
        // case 'cancellation_desc':
        //   return new Date(b.cancellation_date || b.order_date).getTime() - new Date(a.cancellation_date || a.order_date).getTime();
        // case 'cancellation_asc':
        //   return new Date(a.cancellation_date || a.order_date).getTime() - new Date(b.cancellation_date || b.order_date).getTime();
        default:
          return 0;
      }
    });

  const getTotalCancelledValue = () => {
    return cancelledJobs.reduce((sum, order) => sum + order.total_price, 0);
  };

  const getAverageCancelledPrice = () => {
    if (cancelledJobs.length === 0) return 0;
    return getTotalCancelledValue() / cancelledJobs.length;
  };

  const getCancellationRate = () => {
    if (orders.length === 0) return 0;
    return (cancelledJobs.length / orders.length) * 100;
  };

  const getRecentCancellations = () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return cancelledJobs.filter(order => {
      const cancellationDate = new Date(order.order_date || order.order_date);
      return cancellationDate >= thirtyDaysAgo;
    }).length;
  };

  if (isLoading && !isRefreshing) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">
            {locale === 'ne' ? 'रद्द गरिएका जबहरू' : 'Cancelled Jobs'}
          </h1>
          <p className="text-muted-foreground">
            {locale === 'ne' 
              ? 'रद्द गरिएका वा अस्वीकृत जबहरू'
              : 'Cancelled or rejected jobs'
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
              {locale === 'ne' ? 'रद्द गरिएका जबहरू' : 'Cancelled Jobs'}
            </h1>
            <p className="text-muted-foreground">
              {locale === 'ne' 
                ? 'रद्द गरिएका वा अस्वीकृत जबहरूको इतिहास'
                : 'History of cancelled or rejected jobs'
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
                    ? 'सेवा, ग्राहक, स्थान, आईडी, मूल्य, रद्द गर्ने कारण, वा नोटहरू द्वारा खोज्नुहोस्...'
                    : 'Search by service, customer, location, ID, price, cancellation reason, or notes...'
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
                <DropdownMenuItem onClick={() => setSortBy('cancellation_desc')}>
                  {locale === 'ne' ? 'रद्द मिति (नयाँ देखि पुरानो)' : 'Cancellation Date (Newest First)'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('cancellation_asc')}>
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
            {(searchQuery || sortBy !== 'cancellation_desc') && (
              <Button
                variant="outline"
                onClick={() => {
                  clearSearch();
                  setSortBy('cancellation_desc');
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
                ? `${cancelledJobs.length} वटा रद्द जब "${searchQuery}" सँग मिल्दो`
                : `Found ${cancelledJobs.length} cancelled job${cancelledJobs.length !== 1 ? 's' : ''} matching "${searchQuery}"`
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

      {cancelledJobs.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="mx-auto w-24 h-24 mb-4 flex items-center justify-center rounded-full bg-red-50">
              <XCircle className="w-12 h-12 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {locale === 'ne' ? 'कुनै रद्द जबहरू छैनन्' : 'No Cancelled Jobs'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery
                ? (locale === 'ne' 
                  ? 'तपाईंको खोजसँग मिल्ने कुनै रद्द जबहरू फेला परेन'
                  : 'No cancelled jobs match your search')
                : (locale === 'ne'
                  ? 'तपाईंसँग हाल कुनै रद्द गरिएका जबहरू छैनन्'
                  : 'You have no cancelled jobs')
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
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
                ? `कुल ${orders.filter(o => o.order_status === OrderStatus.CANCELLED).length} मध्ये ${cancelledJobs.length} वटा रद्द जबहरू देखाइएको`
                : `Showing ${cancelledJobs.length} of ${orders.filter(o => o.order_status === OrderStatus.CANCELLED).length} cancelled jobs`
              }
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-red-50">
                <XCircle className="w-3 h-3 mr-1" />
                {cancelledJobs.length} {locale === 'ne' ? 'रद्द' : 'Cancelled'}
              </Badge>
            </div>
          </div>

          <Separator className="my-2" />

          {/* Cancellation Analytics */}
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
                  <DollarSign className="w-8 h-8 text-red-500" />
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
                  <TrendingDown className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {locale === 'ne' ? 'पछिल्लो ३० दिन' : 'Last 30 Days'}
                    </p>
                    <p className="text-2xl font-bold text-purple-600">
                      {getRecentCancellations()}
                    </p>
                  </div>
                  <Calendar className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Improvement Suggestions */}
          <Card className="mb-4 border-orange-200 bg-orange-50 dark:bg-orange-950/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-orange-800 dark:text-orange-300 mb-1">
                    {locale === 'ne' ? 'सुधारको सुझाव' : 'Improvement Suggestions'}
                  </p>
                  <p className="text-sm text-orange-700 dark:text-orange-400">
                    {locale === 'ne' 
                      ? 'रद्द जबहरूको कारणहरू विश्लेषण गरेर सेवा सुधार गर्नुहोस्। उच्च मूल्यका जबहरूमा ध्यान दिनुहोस्।'
                      : 'Analyze cancellation reasons to improve your service. Pay attention to high-value cancellations.'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rebooking Opportunities */}
          <Card className="mb-4">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">
                {locale === 'ne' ? 'पुनः बुक गर्ने अवसरहरू' : 'Rebooking Opportunities'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button variant="outline" className="justify-start">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  {locale === 'ne' ? 'समान सेवाहरू ब्राउज गर्नुहोस्' : 'Browse Similar Services'}
                </Button>
                <Button variant="outline" className="justify-start">
                  <Package className="w-4 h-4 mr-2" />
                  {locale === 'ne' ? 'नयाँ जबहरू खोज्नुहोस्' : 'Find New Jobs'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Cancellation Reasons Summary */}
          <Card className="mb-4">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">
                {locale === 'ne' ? 'रद्द गर्ने कारणहरू' : 'Cancellation Reasons'}
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium">
                      {locale === 'ne' ? 'रद्द गर्ने कारणहरू' : 'Cancellation Reasons'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {locale === 'ne' 
                      ? 'रद्द गर्ने कारणहरू ट्र्याक गरेर भविष्यमा सुधार गर्नुहोस्'
                      : 'Track cancellation reasons to improve future performance'
                    }
                  </p>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium">
                      {locale === 'ne' ? 'ग्राहकहरू' : 'Customers'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {locale === 'ne' 
                      ? `${new Set(cancelledJobs.map(o => o.customer_name)).size} विभिन्न ग्राहकहरू`
                      : `${new Set(cancelledJobs.map(o => o.customer_name)).size} different customers`
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Order Cards */}
          <div className="space-y-4">
            {cancelledJobs.map((order) => (
              <ProfessionalOrderCard
                key={order.id}
                order={order}
                showActions={false} // No actions for cancelled jobs
              />
            ))}
          </div>

          {/* Cancelled Jobs Analysis */}
          <Card className="mt-6">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">
                {locale === 'ne' ? 'रद्द जब विश्लेषण' : 'Cancelled Jobs Analysis'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {locale === 'ne' ? 'कुल जबहरू' : 'Total Jobs'}
                    </span>
                    <span className="font-medium">{orders.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {locale === 'ne' ? 'रद्द जबहरू' : 'Cancelled Jobs'}
                    </span>
                    <span className="font-medium text-red-600">{cancelledJobs.length}</span>
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
                      Rs. {cancelledJobs.length > 0 ? Math.max(...cancelledJobs.map(o => o.total_price)).toLocaleString() : '0'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {locale === 'ne' ? 'न्यूनतम रद्द मूल्य' : 'Lowest Cancelled Price'}
                    </span>
                    <span className="font-medium">
                      Rs. {cancelledJobs.length > 0 ? Math.min(...cancelledJobs.map(o => o.total_price)).toLocaleString() : '0'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {locale === 'ne' ? 'औसत रद्द मूल्य' : 'Average Cancelled Price'}
                    </span>
                    <span className="font-medium">
                      Rs. {getAverageCancelledPrice().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Improvement Plan */}
          <Card className="mt-4 border-blue-200">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">
                {locale === 'ne' ? 'सुधार योजना' : 'Improvement Plan'}
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium">1</span>
                  </div>
                  <div>
                    <p className="font-medium">
                      {locale === 'ne' ? 'रद्द गर्ने कारणहरू विश्लेषण गर्नुहोस्' : 'Analyze Cancellation Reasons'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {locale === 'ne' 
                        ? 'किन ग्राहकहरूले रद्द गरे? यो बुझेर सेवा सुधार गर्नुहोस्।'
                        : 'Understand why customers cancelled to improve your service.'
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium">2</span>
                  </div>
                  <div>
                    <p className="font-medium">
                      {locale === 'ne' ? 'स्पष्ट संचार' : 'Clear Communication'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {locale === 'ne' 
                        ? 'ग्राहकहरूसँग स्पष्ट संचार बढाउनुहोस् र अपेक्षाहरू स्थापित गर्नुहोस्।'
                        : 'Improve communication with customers and set clear expectations.'
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium">3</span>
                  </div>
                  <div>
                    <p className="font-medium">
                      {locale === 'ne' ? 'नयाँ जबहरूमा ध्यान दिनुहोस्' : 'Focus on New Opportunities'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {locale === 'ne' 
                        ? 'रद्द जबहरूको सट्टा नयाँ जबहरूमा ध्यान दिनुहोस्।'
                        : 'Focus on new job opportunities instead of cancelled ones.'
                      }
                    </p>
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