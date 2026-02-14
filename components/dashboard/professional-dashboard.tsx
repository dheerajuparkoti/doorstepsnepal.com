// "use client";

// import Link from "next/link";
// import { useI18n } from "@/lib/i18n/context";
// import { useAuth } from "@/lib/context/auth-context";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import {
//   Briefcase,
//   Clock,
//   DollarSign,
//   Star,
//   CheckCircle,
//   ArrowRight,
//   Check,
//   X,
//   MapPin,
//   TrendingUp,
//   AlertCircle,
// } from "lucide-react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// // Mock data
// const jobRequests = [
//   {
//     id: "job-1",
//     serviceName: "AC Repair",
//     serviceNameNe: "एसी मर्मत",
//     customerName: "Hari Prasad",
//     customerNameNe: "हरि प्रसाद",
//     customerAvatar: "/images/customers/customer-1.jpg",
//     location: "Kathmandu, Ward 10",
//     locationNe: "काठमाडौं, वडा १०",
//     scheduledDate: "2024-01-22",
//     scheduledTime: "10:00 AM",
//     price: 1500,
//   },
//   {
//     id: "job-2",
//     serviceName: "Electrical Wiring",
//     serviceNameNe: "विद्युत वायरिङ",
//     customerName: "Maya Devi",
//     customerNameNe: "माया देवी",
//     customerAvatar: "/images/customers/customer-2.jpg",
//     location: "Lalitpur, Ward 5",
//     locationNe: "ललितपुर, वडा ५",
//     scheduledDate: "2024-01-23",
//     scheduledTime: "2:00 PM",
//     price: 2500,
//   },
// ];

// const activeJobs = [
//   {
//     id: "active-1",
//     serviceName: "Pipe Repair",
//     serviceNameNe: "पाइप मर्मत",
//     customerName: "Krishna Bahadur",
//     customerNameNe: "कृष्ण बहादुर",
//     status: "in-progress",
//     location: "Bhaktapur",
//     locationNe: "भक्तपुर",
//   },
// ];

// const earningsData = [
//   { month: "Jan", amount: 25000 },
//   { month: "Feb", amount: 32000 },
//   { month: "Mar", amount: 28000 },
//   { month: "Apr", amount: 35000 },
//   { month: "May", amount: 42000 },
//   { month: "Jun", amount: 38000 },
// ];

// export function ProfessionalDashboard() {
//   const { t, language } = useI18n();
//   const { user } = useAuth();

//   const stats = [
//     {
//       label: t.professional.stats.totalJobs,
//       value: "156",
//       icon: Briefcase,
//       change: "+12%",
//       changeType: "positive" as const,
//     },
//     {
//       label: t.professional.stats.activeJobs,
//       value: "3",
//       icon: Clock,
//       change: "2 pending",
//       changeType: "neutral" as const,
//     },
//     {
//       label: t.professional.stats.earnings,
//       value: "Rs. 45,000",
//       icon: DollarSign,
//       change: "+8%",
//       changeType: "positive" as const,
//     },
//     {
//       label: t.professional.stats.rating,
//       value: "4.9",
//       icon: Star,
//       change: "245 reviews",
//       changeType: "neutral" as const,
//     },
//   ];

//   return (
//     <div className="space-y-6">
//       {/* Welcome Section */}
//       <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//         <div className="flex items-center gap-4">
//           <div>
//             <h1 className="text-2xl font-bold text-foreground md:text-3xl">
//               {t.dashboard.welcome}, {language === "ne" ? user?.nameNe : user?.name}!
//             </h1>
//             <p className="mt-1 text-muted-foreground">{t.professional.welcome.subtitle}</p>
//           </div>
//         </div>
//         <div className="flex items-center gap-2">
//           {user?.isProfessionalVerified ? (
//             <Badge className="gap-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500">
//               <CheckCircle className="h-3 w-3" />
//               {t.professional.verification.verified}
//             </Badge>
//           ) : (
//             <Badge variant="secondary" className="gap-1">
//               <AlertCircle className="h-3 w-3" />
//               {t.professional.verification.pending}
//             </Badge>
//           )}
//         </div>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
//         {stats.map((stat) => {
//           const Icon = stat.icon;
//           return (
//             <Card key={stat.label}>
//               <CardContent className="p-4">
//                 <div className="flex items-center justify-between">
//                   <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
//                     <Icon className="h-5 w-5" />
//                   </div>
//                   {stat.changeType === "positive" && (
//                     <div className="flex items-center gap-1 text-sm text-green-600">
//                       <TrendingUp className="h-4 w-4" />
//                       {stat.change}
//                     </div>
//                   )}
//                   {stat.changeType === "neutral" && (
//                     <span className="text-sm text-muted-foreground">{stat.change}</span>
//                   )}
//                 </div>
//                 <div className="mt-3">
//                   <p className="text-2xl font-bold">{stat.value}</p>
//                   <p className="text-sm text-muted-foreground">{stat.label}</p>
//                 </div>
//               </CardContent>
//             </Card>
//           );
//         })}
//       </div>

//       <div className="grid gap-6 lg:grid-cols-2">
//         {/* Job Requests */}
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between">
//             <CardTitle>{t.professional.jobs.requests}</CardTitle>
//             <Button variant="ghost" size="sm" asChild>
//               <Link href="/dashboard/jobs/pending">
//                 {t.common.seeAll}
//                 <ArrowRight className="ml-1 h-4 w-4" />
//               </Link>
//             </Button>
//           </CardHeader>
//           <CardContent>
//             {jobRequests.length > 0 ? (
//               <div className="space-y-4">
//                 {jobRequests.map((job) => (
//                   <div
//                     key={job.id}
//                     className="rounded-lg border border-border p-4"
//                   >
//                     <div className="flex items-start justify-between">
//                       <div className="flex items-center gap-3">
//                         <Avatar className="h-10 w-10">
//                           <AvatarImage src={job.customerAvatar || "/placeholder.svg"} />
//                           <AvatarFallback className="bg-primary/10 text-primary">
//                             {job.customerName[0]}
//                           </AvatarFallback>
//                         </Avatar>
//                         <div>
//                           <h4 className="font-medium">
//                             {language === "ne" ? job.serviceNameNe : job.serviceName}
//                           </h4>
//                           <p className="text-sm text-muted-foreground">
//                             {language === "ne" ? job.customerNameNe : job.customerName}
//                           </p>
//                         </div>
//                       </div>
//                       <span className="font-semibold text-primary">
//                         Rs. {job.price}
//                       </span>
//                     </div>
//                     <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
//                       <div className="flex items-center gap-1">
//                         <MapPin className="h-4 w-4" />
//                         {language === "ne" ? job.locationNe : job.location}
//                       </div>
//                       <div className="flex items-center gap-1">
//                         <Clock className="h-4 w-4" />
//                         {job.scheduledDate} - {job.scheduledTime}
//                       </div>
//                     </div>
//                     <div className="mt-4 flex gap-2">
//                       <Button size="sm" className="flex-1 gap-1">
//                         <Check className="h-4 w-4" />
//                         {t.professional.jobs.accept}
//                       </Button>
//                       <Button size="sm" variant="outline" className="flex-1 gap-1 bg-transparent">
//                         <X className="h-4 w-4" />
//                         {t.professional.jobs.reject}
//                       </Button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="py-8 text-center text-muted-foreground">
//                 <Briefcase className="mx-auto mb-4 h-12 w-12 opacity-50" />
//                 <p>{t.professional.jobs.noRequests}</p>
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         {/* Active Jobs */}
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between">
//             <CardTitle>{t.professional.jobs.active}</CardTitle>
//             <Button variant="ghost" size="sm" asChild>
//               <Link href="/dashboard/jobs/accepted">
//                 {t.common.seeAll}
//                 <ArrowRight className="ml-1 h-4 w-4" />
//               </Link>
//             </Button>
//           </CardHeader>
//           <CardContent>
//             {activeJobs.length > 0 ? (
//               <div className="space-y-4">
//                 {activeJobs.map((job) => (
//                   <div
//                     key={job.id}
//                     className="rounded-lg border border-border p-4"
//                   >
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <h4 className="font-medium">
//                           {language === "ne" ? job.serviceNameNe : job.serviceName}
//                         </h4>
//                         <p className="text-sm text-muted-foreground">
//                           {language === "ne" ? job.customerNameNe : job.customerName}
//                         </p>
//                       </div>
//                       <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500">
//                         In Progress
//                       </Badge>
//                     </div>
//                     <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
//                       <MapPin className="h-4 w-4" />
//                       {language === "ne" ? job.locationNe : job.location}
//                     </div>
//                     <Button variant="outline" size="sm" className="mt-4 w-full bg-transparent">
//                       {t.professional.jobs.viewDetails}
//                     </Button>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="py-8 text-center text-muted-foreground">
//                 <Clock className="mx-auto mb-4 h-12 w-12 opacity-50" />
//                 <p>{t.professional.jobs.noActive}</p>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>

//       {/* Earnings Summary */}
//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between">
//           <CardTitle>{t.professional.earnings.summary}</CardTitle>
//           <Button variant="outline" disabled>
//             {t.professional.earnings.withdraw}
//           </Button>
//         </CardHeader>
//         <CardContent>
//           <div className="h-[300px]">
//             <ResponsiveContainer width="100%" height="100%">
//               <LineChart data={earningsData}>
//                 <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
//                 <XAxis
//                   dataKey="month"
//                   className="text-xs text-muted-foreground"
//                   tick={{ fill: "hsl(var(--muted-foreground))" }}
//                 />
//                 <YAxis
//                   className="text-xs text-muted-foreground"
//                   tick={{ fill: "hsl(var(--muted-foreground))" }}
//                   tickFormatter={(value) => `Rs. ${value / 1000}k`}
//                 />
//                 <Tooltip
//                   contentStyle={{
//                     backgroundColor: "hsl(var(--card))",
//                     border: "1px solid hsl(var(--border))",
//                     borderRadius: "8px",
//                   }}
//                   labelStyle={{ color: "hsl(var(--foreground))" }}
//                   formatter={(value: number) => [`Rs. ${value.toLocaleString()}`, "Earnings"]}
//                 />
//                 <Line
//                   type="monotone"
//                   dataKey="amount"
//                   stroke="hsl(var(--primary))"
//                   strokeWidth={2}
//                   dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }


"use client";

import { useEffect } from "react";
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
import {
  Briefcase,
  Clock,
  DollarSign,
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
  const { t, language } = useI18n();
  const { user } = useAuth();
  const router = useRouter();
  
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
    return a.scheduled_time.localeCompare(b.scheduled_time);
  });

  // Prepare monthly earnings data for chart
  const getMonthlyEarnings = () => {
    const monthlyData: { [key: string]: number } = {};
    
    completedJobs.forEach((order) => {
      if (order.scheduled_date) {
        const month = order.scheduled_date.substring(0, 7); // YYYY-MM format
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
      icon: DollarSign,
      change: wallet?.total_earned ? `+${((totalEarnings / wallet.total_earned) * 100).toFixed(0)}%` : "0%",
      changeType: "positive" as const,
    },
    {
      label: t.professional.stats.rating,
      value: "4.9",
      icon: Star,
      change: `${completedJobs.length} reviews`,
      changeType: "neutral" as const,
    },
  ];

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
          {user?.isProfessionalVerified ? (
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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
        {/* Job Requests (Pending Jobs) */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>
              {pendingJobs.length > 0 
                ? `${t.professional.jobs.requests} - ${pendingJobs.length}`
                : t.professional.jobs.requests}
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/jobs/pending">
                {t.common.seeAll}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {pendingJobs.length > 0 ? (
              <div className="space-y-4">
                {pendingJobs.slice(0, 3).map((job) => (
                  <div
                    key={job.id}
                    className="rounded-lg border border-border p-4 hover:bg-accent/50 cursor-pointer transition-colors"
                    onClick={() => router.push(`/orders/${job.id}`)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          {/* <AvatarImage src={job.customer_name?.avatar || "/placeholder.svg"} /> */}
                          <AvatarFallback className="bg-primary/10 text-primary">
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
                      <span className="font-semibold text-primary">
                        Rs. {job.total_price?.toLocaleString()}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  {job.customer_address && (
  <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
    <MapPin className="h-4 w-4" />
     {formatAddress(job.customer_address)}
  </div>
)}

                      {job.scheduled_time && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {NepaliDateService.format(job.scheduled_date)}  -   {NepaliDateService.formatTime(job.scheduled_time)} 
                          {/* {job.scheduled_date} - {job.scheduled_time} */}
                        </div>
                      )}
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button 
                        size="sm" 
                        className="flex-1 gap-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle accept
                        }}
                      >
                        <Check className="h-4 w-4" />
                        {t.professional.jobs.accept}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 gap-1 bg-transparent"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle reject
                        }}
                      >
                        <X className="h-4 w-4" />
                        {t.professional.jobs.reject}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <Briefcase className="mx-auto mb-4 h-12 w-12 opacity-50" />
                <p>{t.professional.jobs.noRequests}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Today's Schedule (Accepted Jobs) */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t.professional.jobs.todaySchedule}</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/jobs/accepted">
                {t.common.seeAll}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {todaySchedule.length > 0 ? (
              <div className="space-y-4">
                {todaySchedule.map((job) => (
                  <div
                    key={job.id}
                    className="rounded-lg border border-border p-4 hover:bg-accent/50 cursor-pointer transition-colors"
                    onClick={() => router.push(`/orders/${job.id}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">
                          {language === "ne" ? job.service_name_np : job.service_name_en}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {job.customer_name}
                        </p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500">
                         {NepaliDateService.formatTime(job.scheduled_time)} 
                      </Badge>
                    </div>
                 {job.customer_address && (
  <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
    <MapPin className="h-4 w-4" />
  {formatAddress(job.customer_address)}
  </div>
)}

                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <Clock className="mx-auto mb-4 h-12 w-12 opacity-50" />
                <p>{t.professional.jobs.noSchedule}</p>
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