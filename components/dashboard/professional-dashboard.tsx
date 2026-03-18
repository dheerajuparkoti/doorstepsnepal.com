

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import { useAuth } from "@/lib/context/auth-context";
import { useOrderStore } from "@/stores/order-store";
import { useWalletStore } from "@/stores/professional/wallet-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { differenceInMilliseconds, format, formatDistanceToNow, isFuture } from 'date-fns';
import {
  Briefcase,
  Clock,
  Banknote,
  Star,
  CheckCircle,
  ArrowRight,
  MapPin,
  TrendingUp,
  AlertCircle,
  Eye,
  EyeOff,
  Wallet,
  Check,
  X,
  Bell,
  Calendar,
  Sparkles,
  Zap,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { OrderStatus } from "@/lib/data/order";
import { NepaliDateService } from "@/lib/utils/nepaliDate";
import { formatAddress } from "@/lib/utils/address-fromatter";
import { useNotificationStore } from "@/stores/notification-store";
import { useConfirmationDialog } from "@/hooks/use-confirmation-dialog";

import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Types for the component
interface JobRequest {
  id: string;
  serviceName: string;
  serviceNameNe: string;
  customerName: string;
  customerAvatar?: string;
  location: string;
  locationNe: string;
  scheduledDate?: string;
  scheduledTime?: string;
  price: number;
}

interface ActiveJob {
  id: string;
  serviceName: string;
  serviceNameNe: string;
  customerName: string;
  customerNameNe: string;
  status: string;
  customer_address: string;

  scheduledDate?: string;
  scheduledTime?: string;
}

export function ProfessionalDashboard() {
  const { t, language ,locale} = useI18n();
  const { user } = useAuth();
  const router = useRouter();
    const { updateOrder } = useOrderStore();
    const { createNotification } = useNotificationStore();
    const { confirm, ConfirmationDialog } = useConfirmationDialog();

    const [isExpanded, setIsExpanded] = useState(false);
    const [isInspecting, setIsInspecting] = useState(false);
    const [inspectionNotes, setInspectionNotes] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
  
    const getLocalizedText = (en: string, np: string) => {
      return locale === 'ne' ? np : en;
    };
  // Get stores
  const { 
    orders, 
    isLoading: ordersLoading, 
    fetchOrders,
    getFilteredOrders 
  } = useOrderStore();
  
  const {
    wallet,
    isLoading: walletLoading,
    refreshWalletData,
    getWalletStats,
    isBalanceVisible,
    toggleBalanceVisibility
  } = useWalletStore();

  // Fetch data on mount
  useEffect(() => {
    if (user?.professional_id) {
      fetchOrders({ professional_id: user.professional_id });
      refreshWalletData(user.professional_id);
    }
  }, [user?.professional_id, fetchOrders, refreshWalletData]);

  // Filter orders by status
  const completedJobs = getFilteredOrders(OrderStatus.COMPLETED);
  const pendingJobs = getFilteredOrders(OrderStatus.PENDING);
  const acceptedJobs = getFilteredOrders(OrderStatus.ACCEPTED);
  const cancelledJobs = getFilteredOrders(OrderStatus.CANCELLED);

  // Calculate total earnings from completed jobs
  const totalEarnings = completedJobs.reduce((sum, order) => sum + (order.total_price || 0), 0);

  // Get wallet stats
  const walletStats = getWalletStats();

// Get today's schedule (accepted jobs for today)
const todayBS = NepaliDateService.now();
const todaySchedule = acceptedJobs.filter((job) => {
  if (!job.scheduled_date) return false;
  try {
    const jobBSDate = NepaliDateService.toBS(job.scheduled_date);
    if (!jobBSDate) return false;
    
    return jobBSDate.getYear() === todayBS.getYear() &&
           jobBSDate.getMonth() === todayBS.getMonth() &&
           jobBSDate.getDate() === todayBS.getDate();
  } catch {
    return false;
  }
}).sort((a, b) => {
  if (!a.scheduled_time) return 1;
  if (!b.scheduled_time) return -1;
  
  // Convert Dates to strings for comparison
  const timeA = a.scheduled_time instanceof Date 
    ? format(a.scheduled_time, 'HH:mm') 
    : String(a.scheduled_time).split(' ')[1] || String(a.scheduled_time);
  const timeB = b.scheduled_time instanceof Date 
    ? format(b.scheduled_time, 'HH:mm') 
    : String(b.scheduled_time).split(' ')[1] || String(b.scheduled_time);
    
  return timeA.localeCompare(timeB);
});

// Prepare monthly earnings data for chart
const getMonthlyEarnings = () => {
  const monthlyData: { [key: string]: number } = {};
  
  completedJobs.forEach((order) => {
    if (order.scheduled_date) {
      // Handle both Date objects and strings
      let dateStr: string;
      if (order.scheduled_date instanceof Date) {
        dateStr = format(order.scheduled_date, 'yyyy-MM-dd');
      } else {
        dateStr = String(order.scheduled_date);
      }
      
      const month = dateStr.substring(0, 7); // YYYY-MM format
      monthlyData[month] = (monthlyData[month] || 0) + (order.total_price || 0);
    }
  });

  // Convert to array for chart
  return Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, amount]) => ({
      month: NepaliDateService.formatNepaliMonth(month),
      amount,
    }))
    .slice(-6); // Last 6 months
};
  const monthlyEarnings = getMonthlyEarnings();

  // Stats for the top cards
  const stats = [
    {
      label: t.professional.stats.totalJobs,
      value: orders.length.toString(),
      icon: Briefcase,
      change: `+${completedJobs.length} completed`,
      changeType: "positive" as const,
    },
    {
      label: t.professional.stats.activeJobs,
      value: acceptedJobs.length.toString(),
      icon: Clock,
      change: `${pendingJobs.length} pending`,
      changeType: "neutral" as const,
    },
    {
      label: t.professional.stats.earnings,
      value: `Rs. ${totalEarnings.toLocaleString()}`,
      icon: Banknote,
      change: wallet?.total_earned ? `+${((totalEarnings / wallet.total_earned) * 100).toFixed(0)}%` : "0%",
      changeType: "positive" as const,
    },
   
  ];

const getTimeUntilNextJob = (scheduledTime: Date | string | undefined) => {
  if (!scheduledTime) return null;
  
  try {
    // Get current Nepali time
    const now = NepaliDateService.now();
    const currentTimeStr = now.format('HH:mm');
    
    // Get scheduled time string
    let scheduledTimeStr: string;
    if (scheduledTime instanceof Date) {
      const nepaliDate = NepaliDateService.toBS(scheduledTime);
      if (!nepaliDate) return null;
      scheduledTimeStr = nepaliDate.format('HH:mm');
    } else {
      const timeMatch = scheduledTime.match(/(\d{2}):(\d{2})/);
      if (!timeMatch) return null;
      scheduledTimeStr = `${timeMatch[1]}:${timeMatch[2]}`;
    }
    
    // Parse hours
    const scheduledHour = parseInt(scheduledTimeStr.split(':')[0]);
    const currentHour = parseInt(currentTimeStr.split(':')[0]);
    
    let hoursUntil = scheduledHour - currentHour;
    
    // Handle next day case
    if (hoursUntil < 0) {
      hoursUntil += 24;
    }
    
    if (hoursUntil === 0) {
      return getLocalizedText('Soon', 'तुरुन्त');
    }
    
    return getLocalizedText(`in ${hoursUntil} hour${hoursUntil > 1 ? 's' : ''}`, `${hoursUntil} घण्टामा`);
  } catch (error) {
    return null;
  }
};

// For progress, just return a static value based on hours
const getTimeProgress = (scheduledTime: Date | string | undefined) => {
  if (!scheduledTime) return 0;
  
  try {
    // Get current Nepali time
    const now = NepaliDateService.now();
    const currentTimeStr = now.format('HH:mm');
    
    let scheduledTimeStr: string;
    if (scheduledTime instanceof Date) {
      const nepaliDate = NepaliDateService.toBS(scheduledTime);
      if (!nepaliDate) return 0;
      scheduledTimeStr = nepaliDate.format('HH:mm');
    } else {
      const timeMatch = scheduledTime.match(/(\d{2}):(\d{2})/);
      if (!timeMatch) return 0;
      scheduledTimeStr = `${timeMatch[1]}:${timeMatch[2]}`;
    }
    
    const scheduledHour = parseInt(scheduledTimeStr.split(':')[0]);
    const currentHour = parseInt(currentTimeStr.split(':')[0]);
    
    let hoursUntil = scheduledHour - currentHour;
    if (hoursUntil < 0) hoursUntil += 24;
    
    // Progress bar fills up as time approaches (more hours left = less progress)
    return Math.min(100, Math.max(0, 100 - (hoursUntil * 100 / 12)));
  } catch (error) {
    return 0;
  }
};
  if (ordersLoading || walletLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">
            {t.dashboard.welcome}, {language === "ne" ? user?.nameNe || user?.name : user?.name}!
          </h1>
          <p className="mt-1 text-muted-foreground">{t.professional.welcome.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          {user?.is_admin_approved ? (
            <Badge className="gap-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500">
              <CheckCircle className="h-3 w-3" />
              {t.professional.verification.verified}
            </Badge>
          ) : (
            <Badge variant="secondary" className="gap-1">
              <AlertCircle className="h-3 w-3" />
              {t.professional.verification.pending}
            </Badge>
          )}
        </div>
      </div>

      {/* Wallet Balance Card */}
      {wallet && (
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Wallet className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t.professional.wallet.availableBalance}</p>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold">
                      {isBalanceVisible 
                        ? `Rs. ${wallet.current_balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        : "Rs. ••••••"}
                    </h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={toggleBalanceVisibility}
                    >
                      {isBalanceVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <div className="flex gap-4 mt-1 text-sm">
                    <span className="text-muted-foreground">
                      {t.professional.wallet.totalEarned}: Rs. {wallet.total_earned.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground">
                      {t.professional.wallet.totalWithdrawn}: Rs. {wallet.total_withdrawn.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
          <Button asChild className="gap-2">
  <Link href="/dashboard/professional/wallet">
    {t.professional.wallet.myWallet}
    <ArrowRight className="h-4 w-4" />
  </Link>
</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Deletion Notice Banner */}
      {user?.deletion_requested && (
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-500">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm">
                {t.professional.deletion.notice}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  {stat.changeType === "positive" && (
                    <div className="flex items-center gap-1 text-sm text-green-600">
                      <TrendingUp className="h-4 w-4" />
                      {stat.change}
                    </div>
                  )}
                  {stat.changeType === "neutral" && (
                    <span className="text-sm text-muted-foreground">{stat.change}</span>
                  )}
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Job Requests (Pending Jobs) - HIGHLIGHTED */}
        <Card className={cn(
          "relative overflow-hidden transition-all duration-300",
          pendingJobs.length > 0 && [
            "border-2 border-primary/50 shadow-lg",
            "hover:shadow-xl hover:border-primary",
            "bg-gradient-to-br from-background via-background to-primary/5"
          ]
        )}>
          {pendingJobs.length > 0 && (
            <>
              {/* Animated pulse effect */}
              <div className="absolute inset-0 bg-primary/5 animate-pulse pointer-events-none" />
              
              {/* Corner accent */}
              {/* <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-bl-3xl" /> */}
              
              {/* Sparkle icon */}
              {/* <div className="absolute top-2 right-2 text-primary/30">
                <Sparkles className="h-5 w-5" />
              </div> */}
            </>
          )}
          
          <CardHeader className="flex flex-row items-center justify-between relative">
            <div className="flex items-center gap-2">
              <CardTitle className={cn(
                "flex items-center gap-2",
                pendingJobs.length > 0 && "text-primary"
              )}>
                {t.professional.jobs.requests}
                {pendingJobs.length > 0 && (
                  <>
                    <Badge variant="default" className="ml-2 animate-bounce">
                      {pendingJobs.length} {getLocalizedText('New', 'नयाँ')}
                    </Badge>
                    <Bell className="h-4 w-4 text-primary animate-pulse" />
                  </>
                )}
              </CardTitle>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/professional/jobs/pending">
                {t.common.seeAll}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {pendingJobs.length > 0 ? (
              <div className="space-y-4">
                {pendingJobs.slice(0, 3).map((job, index) => (
                  <div
                    key={job.id}
                    className={cn(
                      "rounded-lg border p-4 transition-all duration-300",
                      "hover:bg-accent/50 cursor-pointer",
                      index === 0 && [
                        "border-primary/50 bg-primary/5",
                        "hover:border-primary hover:bg-primary/10",
                        "shadow-md"
                      ]
                    )}
                    onClick={() => router.push(`/dashboard/professional/jobs/job-details/${job.id}`)}
                  >
                    {index === 0 && (
                      <div className="flex items-center gap-1 mb-2 text-xs font-medium text-primary">
                        <Zap className="h-3 w-3 fill-primary" />
                        {getLocalizedText('New Request', 'नयाँ अनुरोध')}
                      </div>
                    )}
                    
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className={cn(
                          "h-10 w-10",
                          index === 0 && "ring-2 ring-primary ring-offset-2"
                        )}>
                          <AvatarFallback className={cn(
                            "bg-primary/10",
                            index === 0 && "bg-primary/20"
                          )}>
                            {job.customer_name?.[0] || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">
                            {language === "ne" ? job.service_name_np : job.service_name_en}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {language === "ne" ? job.customer_name : job.customer_name}
                          </p>
                        </div>
                      </div>
                      <span className={cn(
                        "font-semibold",
                        index === 0 ? "text-primary" : "text-primary"
                      )}>
                        Rs. {job.total_price?.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      {job.customer_address && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {formatAddress(job.customer_address)}
                        </div>
                      )}

                      {job.scheduled_time && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {NepaliDateService.format(job.scheduled_date)} - {NepaliDateService.formatTime(job.scheduled_time)}
                        </div>
                      )}
                    </div>
                    
                    {/* Quick action buttons for the most recent job */}
                    {/* {index === 0 && (
                      <div className="mt-4 flex gap-2">
                        <Button 
                          size="sm" 
                          className="flex-1 gap-1 bg-primary hover:bg-primary/90"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle quick accept
                          }}
                        >
                          <Check className="h-4 w-4" />
                          {getLocalizedText('Quick Accept', 'द्रुत स्वीकार')}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1 gap-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle view details
                            router.push(`/dashboard/professional/jobs/job-details/${job.id}`);
                          }}
                        >
                          {getLocalizedText('View Details', 'विवरण हेर्नुहोस्')}
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    )} */}
                  </div>
                ))}
                
                {pendingJobs.length > 3 && (
                  <div className="text-center text-sm text-muted-foreground pt-2 border-t">
                    +{pendingJobs.length - 3} {getLocalizedText('more requests', 'थप अनुरोधहरू')}
                  </div>
                )}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <Briefcase className="mx-auto mb-4 h-12 w-12 opacity-50" />
                <p>{t.professional.jobs.noRequests}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Today's Schedule (Accepted Jobs) - HIGHLIGHTED */}
        <Card className={cn(
          "relative overflow-hidden transition-all duration-300",
          todaySchedule.length > 0 && [
            "border-2 border-blue-500/50 shadow-lg",
            "hover:shadow-xl hover:border-blue-500",
            "bg-gradient-to-br from-background via-background to-blue-500/5"
          ]
        )}>
          {todaySchedule.length > 0 && (
            <>
              {/* Animated pulse effect */}
              <div className="absolute inset-0 bg-blue-500/5 animate-pulse pointer-events-none" />
              
              {/* Corner accent */}
              {/* <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 rounded-bl-3xl" /> */}
              
              {/* Calendar icon */}
              {/* <div className="absolute top-2 right-2 text-blue-500/30">
                <Calendar className="h-5 w-5" />
              </div> */}
            </>
          )}
          
          <CardHeader className="flex flex-row items-center justify-between relative">
            <div className="flex items-center gap-2">
              <CardTitle className={cn(
                "flex items-center gap-2",
                todaySchedule.length > 0 && "text-blue-500"
              )}>
                {t.professional.jobs.todaySchedule}
                {todaySchedule.length > 0 && (
                  <>
                    <Badge variant="default" className="ml-2 bg-blue-500 hover:bg-blue-600">
                      {todaySchedule.length} {getLocalizedText('Today', 'आज')}
                    </Badge>
                    <div className="flex -space-x-1">
                      {todaySchedule.slice(0, 3).map((job) => (
                        <Avatar key={job.id} className="h-6 w-6 border-2 border-background">
                          <AvatarFallback className="text-[10px] bg-blue-100 text-blue-800">
                            {job.customer_name?.[0] || "U"}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                  </>
                )}
              </CardTitle>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/professional/jobs/accepted">
                {t.common.seeAll}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {todaySchedule.length > 0 ? (
              <div className="space-y-4">
                {todaySchedule.map((job, index) => (
                  <div
                    key={job.id}
                    className={cn(
                      "rounded-lg border p-4 transition-all duration-300",
                      "hover:bg-accent/50 cursor-pointer",
                      "border-blue-200 dark:border-blue-800",
                      "hover:border-blue-300 dark:hover:border-blue-700"
                    )}
                    onClick={() => router.push(`/dashboard/professional/jobs/job-details/${job.id}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar>
                            <AvatarFallback className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500">
                              {job.customer_name?.[0] || "U"}
                            </AvatarFallback>
                          </Avatar>
                          {/* Time indicator dot */}
                          <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-green-500 ring-2 ring-background" />
                        </div>
                        <div>
                          <h4 className="font-medium">
                            {language === "ne" ? job.service_name_np : job.service_name_en}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {job.customer_name}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500 text-sm">
                        <Clock className="h-3 w-3 mr-1" />
                          {   format(new Date(job.scheduled_time), 'hh:mm a')}
               
                        
                     

                      </Badge>
                    </div>
                    
                    {job.customer_address && (
                      <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 text-blue-500" />
                        {formatAddress(job.customer_address)}
                      </div>
                    )}
                    
               {/* Progress indicator for upcoming jobs */}
{index === 0 && (
  <div className="mt-3">
    <div className="flex justify-between text-xs mb-1">
      <span className="text-blue-600 dark:text-blue-400">
        {getLocalizedText('Next Job', 'अर्को काम')}
      </span>
      <span className="text-muted-foreground">
        {getTimeUntilNextJob(
          job.scheduled_time instanceof Date 
            ? job.scheduled_time.toISOString() 
            : job.scheduled_time
        ) || getLocalizedText('in 2 hours', '२ घण्टामा')}
      </span>
    </div>
    <div className="h-1.5 w-full bg-blue-100 dark:bg-blue-900/30 rounded-full overflow-hidden">
      <div 
        className="h-full bg-blue-500 rounded-full transition-all duration-500"
        style={{ width: `${getTimeProgress(
          job.scheduled_time instanceof Date 
            ? job.scheduled_time.toISOString() 
            : job.scheduled_time
        )}%` }}
      />
    </div>
  </div>
)}
                  </div>
                ))}
                
                {todaySchedule.length > 3 && (
                  <div className="text-center text-sm text-muted-foreground pt-2 border-t">
                    +{todaySchedule.length - 3} {getLocalizedText('more jobs today', 'आज थप कामहरू')}
                  </div>
                )}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <Clock className="mx-auto mb-4 h-12 w-12 opacity-50" />
                <p>{t.professional.jobs.noSchedule}</p>
                {/* <Button variant="link" className="mt-2 text-blue-500">
                  {getLocalizedText('Check available jobs', 'उपलब्ध कामहरू हेर्नुहोस्')}
                </Button> */}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Monthly Earnings Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t.professional.earnings.monthlyEarnings}</CardTitle>
        </CardHeader>
        <CardContent>
          {monthlyEarnings.length > 0 ? (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyEarnings}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis
                    dataKey="month"
                    className="text-xs text-muted-foreground"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis
                    className="text-xs text-muted-foreground"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                    tickFormatter={(value) => `Rs. ${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                    formatter={(value: number) => [`Rs. ${value.toLocaleString()}`, t.professional.earnings.amount]}
                  />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              <p>{t.professional.earnings.noData}</p>
            </div>
          )}
        </CardContent>
      </Card>
      <ConfirmationDialog />
    </div>
  );
}

// Skeleton Loader Component
function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-8 w-24" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="mt-3 h-6 w-24" />
              <Skeleton className="mt-1 h-4 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3].map((j) => (
                <Skeleton key={j} className="h-24 w-full" />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    </div>
  );
}