
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
  Eye,
  X,
  DollarSign,
  Calendar,
  User,
  CheckCircle,
  FileText,
  Clock,
  Calculator
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

export default function InspectedJobsPage() {
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
        status: OrderStatus.INSPECTED,
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

  // Filter and sort inspected jobs
  const inspectedJobs = orders
    .filter(order => order.order_status === OrderStatus.INSPECTED)
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
        order.inspection_notes?.toLowerCase().includes(query) ||
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
        // case 'inspection_desc':
        //   return new Date(b.inspection_date || b.order_date).getTime() - new Date(a.inspection_date || a.order_date).getTime();
        // case 'inspection_asc':
        //   return new Date(a.inspection_date || a.order_date).getTime() - new Date(b.inspection_date || b.order_date).getTime();
        default:
          return 0;
      }
    });

  const getTotalInspectedValue = () => {
    return inspectedJobs.reduce((sum, order) => sum + order.total_price, 0);
  };

  const getAverageInspectedPrice = () => {
    if (inspectedJobs.length === 0) return 0;
    return getTotalInspectedValue() / inspectedJobs.length;
  };

  const getJobsWithPayment = () => {
    return inspectedJobs.filter(order => order.payment_status === PaymentStatus.PAID || order.payment_status === PaymentStatus.PARTIAL).length;
  };

  const getJobsReadyForCompletion = () => {
    return inspectedJobs.filter(order => order.payment_status === PaymentStatus.PAID).length;
  };

  if (isLoading && !isRefreshing) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">
            {locale === 'ne' ? 'निरीक्षण गरिएका जबहरू' : 'Inspected Jobs'}
          </h1>
          <p className="text-muted-foreground">
            {locale === 'ne' 
              ? 'साइट निरीक्षण पछिका जबहरू'
              : 'Jobs after site inspection'
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
              {locale === 'ne' ? 'निरीक्षण गरिएका जबहरू' : 'Inspected Jobs'}
            </h1>
            <p className="text-muted-foreground">
              {locale === 'ne' 
                ? 'साइट निरीक्षण पछिका जबहरू - अन्तिम मूल्य निश्चित भयो'
                : 'Jobs after site inspection - Final price confirmed'
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
                <DropdownMenuItem onClick={() => setSortBy('inspection_desc')}>
                  {locale === 'ne' ? 'निरीक्षण मिति (नयाँ देखि पुरानो)' : 'Inspection Date (Newest First)'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('inspection_asc')}>
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
            {(searchQuery || sortBy !== 'inspection_desc') && (
              <Button
                variant="outline"
                onClick={() => {
                  clearSearch();
                  setSortBy('inspection_desc');
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
                ? `${inspectedJobs.length} वटा निरीक्षण गरिएको जब "${searchQuery}" सँग मिल्दो`
                : `Found ${inspectedJobs.length} inspected job${inspectedJobs.length !== 1 ? 's' : ''} matching "${searchQuery}"`
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

      {inspectedJobs.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="mx-auto w-24 h-24 mb-4 flex items-center justify-center rounded-full bg-purple-50">
              <Eye className="w-12 h-12 text-purple-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {locale === 'ne' ? 'कुनै निरीक्षण गरिएका जबहरू छैनन्' : 'No Inspected Jobs'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery
                ? (locale === 'ne' 
                  ? 'तपाईंको खोजसँग मिल्ने कुनै निरीक्षण गरिएका जबहरू फेला परेन'
                  : 'No inspected jobs match your search')
                : (locale === 'ne'
                  ? 'तपाईंसँग हाल कुनै निरीक्षण गरिएका जबहरू छैनन्'
                  : 'You have no inspected jobs at the moment')
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
                ? `कुल ${orders.filter(o => o.order_status === OrderStatus.INSPECTED).length} मध्ये ${inspectedJobs.length} वटा निरीक्षण गरिएका जबहरू देखाइएको`
                : `Showing ${inspectedJobs.length} of ${orders.filter(o => o.order_status === OrderStatus.INSPECTED).length} inspected jobs`
              }
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-purple-50">
                <Eye className="w-3 h-3 mr-1" />
                {inspectedJobs.length} {locale === 'ne' ? 'निरीक्षण गरियो' : 'Inspected'}
              </Badge>
            </div>
          </div>

          <Separator className="my-2" />

          {/* Inspected Jobs Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {locale === 'ne' ? 'कुल अन्तिम मूल्य' : 'Total Final Price'}
                    </p>
                    <p className="text-2xl font-bold text-purple-600">
                      Rs. {getTotalInspectedValue().toLocaleString()}
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
                      {locale === 'ne' ? 'सम्पन्नको लागि तयार' : 'Ready for Completion'}
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {getJobsReadyForCompletion()}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {locale === 'ne' ? 'भुक्तानीको प्रतिक्षा' : 'Awaiting Payment'}
                    </p>
                    <p className="text-2xl font-bold text-orange-600">
                      {inspectedJobs.length - getJobsWithPayment()}
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Reminder Section */}
          <Card className="mb-4 border-orange-200 bg-orange-50 dark:bg-orange-950/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <DollarSign className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-orange-800 dark:text-orange-300 mb-1">
                    {locale === 'ne' ? 'भुक्तानी अनुस्मारक' : 'Payment Reminder'}
                  </p>
                  <p className="text-sm text-orange-700 dark:text-orange-400">
                    {locale === 'ne' 
                      ? 'भुक्तानी प्राप्त भएपछि मात्र सेवा सम्पन्न गर्नुहोस्। ग्राहकहरूलाई भुक्तानी गर्न अनुरोध गर्नुहोस्।'
                      : 'Complete services only after receiving payment. Request customers to make payment.'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Inspection Notes Summary */}
          <Card className="mb-4">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">
                {locale === 'ne' ? 'निरीक्षण नोटहरू' : 'Inspection Notes'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium">
                      {locale === 'ne' ? 'निरीक्षण नोटहरू' : 'Inspection Notes'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {locale === 'ne' 
                      ? `${inspectedJobs.filter(o => o.inspection_notes).length} जबहरूमा निरीक्षण नोटहरू छन्`
                      : `${inspectedJobs.filter(o => o.inspection_notes).length} jobs have inspection notes`
                    }
                  </p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Calculator className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium">
                      {locale === 'ne' ? 'मूल्य परिवर्तन' : 'Price Changes'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {locale === 'ne' 
                      ? 'निरीक्षण पछि मूल्य निश्चित भयो'
                      : 'Prices finalized after inspection'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Order Cards */}
          <div className="space-y-4">
            {inspectedJobs.map((order) => (
              <ProfessionalOrderCard
                key={order.id}
                order={order}
                showActions={true}
              />
            ))}
          </div>

          {/* Inspected Jobs Summary */}
          <Card className="mt-6">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">
                {locale === 'ne' ? 'निरीक्षण गरिएका जब विश्लेषण' : 'Inspected Jobs Analysis'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {locale === 'ne' ? 'औसत अन्तिम मूल्य' : 'Average Final Price'}
                    </span>
                    <span className="font-medium">
                      Rs. {getAverageInspectedPrice().toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {locale === 'ne' ? 'भुक्तानी भएका जबहरू' : 'Jobs with Payment'}
                    </span>
                    <span className="font-medium text-green-600">
                      {getJobsWithPayment()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {locale === 'ne' ? 'भुक्तानी बाँकी' : 'Payment Pending'}
                    </span>
                    <span className="font-medium text-orange-600">
                      {inspectedJobs.length - getJobsWithPayment()}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {locale === 'ne' ? 'उच्चतम अन्तिम मूल्य' : 'Highest Final Price'}
                    </span>
                    <span className="font-medium">
                      Rs. {inspectedJobs.length > 0 ? Math.max(...inspectedJobs.map(o => o.total_price)).toLocaleString() : '0'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {locale === 'ne' ? 'न्यूनतम अन्तिम मूल्य' : 'Lowest Final Price'}
                    </span>
                    <span className="font-medium">
                      Rs. {inspectedJobs.length > 0 ? Math.min(...inspectedJobs.map(o => o.total_price)).toLocaleString() : '0'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {locale === 'ne' ? 'कुल निरीक्षण नोटहरू' : 'Total Inspection Notes'}
                    </span>
                    <span className="font-medium">
                      {inspectedJobs.filter(o => o.inspection_notes).length}
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