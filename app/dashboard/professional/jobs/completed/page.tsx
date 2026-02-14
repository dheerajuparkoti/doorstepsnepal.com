
'use client';

import { useEffect, useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { useOrderStore } from '@/stores/order-store';
import { OrderStatus, PaymentStatus } from '@/lib/data/order';
import { ProfessionalOrderCard } from '@/components/orders/professional-order-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Search,
  Filter,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  X,
  DollarSign,
  Calendar,
  User,
  Star,
  ThumbsUp,
  Award,
  TrendingUp,
  BarChart3
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

export default function CompletedJobsPage() {
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
        status: OrderStatus.COMPLETED,
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

  // Filter and sort completed jobs
  const completedJobs = orders
    .filter(order => order.order_status === OrderStatus.COMPLETED)
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
        order.order_notes?.toLowerCase().includes(query) ||
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
        // case 'completion_desc':
        //   return new Date(b.completion_date || b.order_date).getTime() - new Date(a.completion_date || a.order_date).getTime();
        // case 'completion_asc':
        //   return new Date(a.completion_date || a.order_date).getTime() - new Date(b.completion_date || b.order_date).getTime();
        default:
          return 0;
      }
    });

  const getTotalCompletedValue = () => {
    return completedJobs.reduce((sum, order) => sum + order.total_price, 0);
  };

  const getAverageCompletedPrice = () => {
    if (completedJobs.length === 0) return 0;
    return getTotalCompletedValue() / completedJobs.length;
  };

  const getTotalEarnings = () => {
    // Assuming all completed jobs are fully paid
    return getTotalCompletedValue();
  };

  const getJobsWithReviews = () => {
    // Mock - in real app, check if order has review
    return Math.floor(completedJobs.length * 0.7); // Assuming 70% have reviews
  };

  const getAverageRating = () => {
    // Mock - in real app, calculate from actual ratings
    return 4.5; // Assuming average rating
  };

  const getRepeatCustomers = () => {
    const customerCounts: { [key: string]: number } = {};
    completedJobs.forEach(order => {
      customerCounts[order.customer_name] = (customerCounts[order.customer_name] || 0) + 1;
    });
    return Object.values(customerCounts).filter(count => count > 1).length;
  };

  if (isLoading && !isRefreshing) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">
            {locale === 'ne' ? 'सम्पन्न जबहरू' : 'Completed Jobs'}
          </h1>
          <p className="text-muted-foreground">
            {locale === 'ne' 
              ? 'सफलतापूर्वक सम्पन्न गरिएका जबहरू'
              : 'Successfully completed jobs'
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
              {locale === 'ne' ? 'सम्पन्न जबहरू' : 'Completed Jobs'}
            </h1>
            <p className="text-muted-foreground">
              {locale === 'ne' 
                ? 'सफलतापूर्वक सम्पन्न गरिएका जबहरू - तपाईंको सेवा इतिहास'
                : 'Successfully completed jobs - Your service history'
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
                    ? 'सेवा, ग्राहक, स्थान, आईडी, मूल्य, निरीक्षण नोट, वा नोटहरू द्वारा खोज्नुहोस्...'
                    : 'Search by service, customer, location, ID, price, inspection notes, or notes...'
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
                <DropdownMenuItem onClick={() => setSortBy('completion_desc')}>
                  {locale === 'ne' ? 'सम्पन्न मिति (नयाँ देखि पुरानो)' : 'Completion Date (Newest First)'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('completion_asc')}>
                  {locale === 'ne' ? 'सम्पन्न मिति (पुरानो देखि नयाँ)' : 'Completion Date (Oldest First)'}
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
            {(searchQuery || sortBy !== 'completion_desc') && (
              <Button
                variant="outline"
                onClick={() => {
                  clearSearch();
                  setSortBy('completion_desc');
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
                ? `${completedJobs.length} वटा सम्पन्न जब "${searchQuery}" सँग मिल्दो`
                : `Found ${completedJobs.length} completed job${completedJobs.length !== 1 ? 's' : ''} matching "${searchQuery}"`
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

      {completedJobs.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="mx-auto w-24 h-24 mb-4 flex items-center justify-center rounded-full bg-green-50">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {locale === 'ne' ? 'कुनै सम्पन्न जबहरू छैनन्' : 'No Completed Jobs'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery
                ? (locale === 'ne' 
                  ? 'तपाईंको खोजसँग मिल्ने कुनै सम्पन्न जबहरू फेला परेन'
                  : 'No completed jobs match your search')
                : (locale === 'ne'
                  ? 'तपाईंसँग हाल कुनै सम्पन्न जबहरू छैनन्'
                  : 'You have no completed jobs yet')
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
                ? `कुल ${orders.filter(o => o.order_status === OrderStatus.COMPLETED).length} मध्ये ${completedJobs.length} वटा सम्पन्न जबहरू देखाइएको`
                : `Showing ${completedJobs.length} of ${orders.filter(o => o.order_status === OrderStatus.COMPLETED).length} completed jobs`
              }
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-50">
                <CheckCircle className="w-3 h-3 mr-1" />
                {completedJobs.length} {locale === 'ne' ? 'सम्पन्न' : 'Completed'}
              </Badge>
            </div>
          </div>

          <Separator className="my-2" />

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {locale === 'ne' ? 'कुल आम्दानी' : 'Total Earnings'}
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      Rs. {getTotalEarnings().toLocaleString()}
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
                      {locale === 'ne' ? 'औसत रेटिंग' : 'Average Rating'}
                    </p>
                    <div className="flex items-center">
                      <p className="text-2xl font-bold text-yellow-600 mr-2">
                        {getAverageRating()}
                      </p>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(getAverageRating())
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <Award className="w-8 h-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {locale === 'ne' ? 'समीक्षा प्राप्त' : 'Reviews Received'}
                    </p>
                    <p className="text-2xl font-bold text-blue-600">
                      {getJobsWithReviews()}
                    </p>
                  </div>
                  <ThumbsUp className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {locale === 'ne' ? 'पुनः ग्राहकहरू' : 'Repeat Customers'}
                    </p>
                    <p className="text-2xl font-bold text-purple-600">
                      {getRepeatCustomers()}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Success Celebration */}
          <Card className="mb-4 border-green-200 bg-green-50 dark:bg-green-950/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Award className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-green-800 dark:text-green-300 mb-1">
                    {locale === 'ne' ? 'सफलता उपलब्धि' : 'Success Achievement'}
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    {locale === 'ne' 
                      ? `तपाईंले ${completedJobs.length} वटा जबहरू सफलतापूर्वक सम्पन्न गर्नुभयो! यो तपाईंको सेवा गुणस्तरको प्रमाण हो।`
                      : `You have successfully completed ${completedJobs.length} jobs! This is a testament to your service quality.`
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Performance */}
          <Card className="mb-4">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">
                {locale === 'ne' ? 'मासिक प्रदर्शन' : 'Monthly Performance'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium">
                      {locale === 'ne' ? 'यस महिना' : 'This Month'}
                    </span>
                  </div>
                  <p className="text-lg font-bold">
                    {completedJobs.filter(order => {
                      const orderDate = new Date(order.order_date);
                      const now = new Date();
                      return orderDate.getMonth() === now.getMonth() && 
                             orderDate.getFullYear() === now.getFullYear();
                    }).length}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {locale === 'ne' ? 'जबहरू सम्पन्न' : 'Jobs Completed'}
                  </p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium">
                      {locale === 'ne' ? 'औसत प्रति जब' : 'Avg Per Job'}
                    </span>
                  </div>
                  <p className="text-lg font-bold">
                    Rs. {getAverageCompletedPrice().toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {locale === 'ne' ? 'मूल्य' : 'Price'}
                  </p>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-purple-500" />
                    <span className="text-sm font-medium">
                      {locale === 'ne' ? 'विशिष्ट ग्राहकहरू' : 'Unique Customers'}
                    </span>
                  </div>
                  <p className="text-lg font-bold">
                    {new Set(completedJobs.map(o => o.customer_name)).size}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {locale === 'ne' ? 'ग्राहकहरू' : 'Customers'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Order Cards */}
          <div className="space-y-4">
            {completedJobs.map((order) => (
              <ProfessionalOrderCard
                key={order.id}
                order={order}
                showActions={false} // No actions needed for completed jobs
              />
            ))}
          </div>

          {/* Completed Jobs Summary */}
          <Card className="mt-6">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">
                {locale === 'ne' ? 'सम्पन्न जब विश्लेषण' : 'Completed Jobs Analysis'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {locale === 'ne' ? 'कुल जबहरू' : 'Total Jobs'}
                    </span>
                    <span className="font-medium">{completedJobs.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {locale === 'ne' ? 'विभिन्न सेवाहरू' : 'Different Services'}
                    </span>
                    <span className="font-medium">
                      {new Set(completedJobs.map(o => o.service_name_en)).size}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {locale === 'ne' ? 'विभिन्न स्थानहरू' : 'Different Locations'}
                    </span>
                    <span className="font-medium">
                      {new Set(completedJobs.map(o => o.customer_address?.municipality)).size}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {locale === 'ne' ? 'उच्चतम जब मूल्य' : 'Highest Job Price'}
                    </span>
                    <span className="font-medium">
                      Rs. {completedJobs.length > 0 ? Math.max(...completedJobs.map(o => o.total_price)).toLocaleString() : '0'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {locale === 'ne' ? 'न्यूनतम जब मूल्य' : 'Lowest Job Price'}
                    </span>
                    <span className="font-medium">
                      Rs. {completedJobs.length > 0 ? Math.min(...completedJobs.map(o => o.total_price)).toLocaleString() : '0'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {locale === 'ne' ? 'सफलता दर' : 'Success Rate'}
                    </span>
                    <span className="font-medium text-green-600">
                      100%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Yearly Summary */}
          <Card className="mt-4">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">
                {locale === 'ne' ? 'वार्षिक सारांश' : 'Yearly Summary'}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{completedJobs.length}</p>
                  <p className="text-sm text-muted-foreground">
                    {locale === 'ne' ? 'जबहरू' : 'Jobs'}
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">
                    Rs. {Math.round(getTotalEarnings() / 100000 * 10) / 10}L
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {locale === 'ne' ? 'आम्दानी' : 'Earnings'}
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">
                    {new Set(completedJobs.map(o => o.customer_name)).size}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {locale === 'ne' ? 'ग्राहकहरू' : 'Customers'}
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <p className="text-2xl font-bold text-orange-600">
                    {new Set(completedJobs.map(o => o.service_name_en)).size}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {locale === 'ne' ? 'सेवाहरू' : 'Services'}
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