"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { useAuth } from "@/lib/context/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Briefcase,
  Clock,
  DollarSign,
  Star,
  CheckCircle,
  ArrowRight,
  Check,
  X,
  MapPin,
  TrendingUp,
  AlertCircle,
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

// Mock data
const jobRequests = [
  {
    id: "job-1",
    serviceName: "AC Repair",
    serviceNameNe: "एसी मर्मत",
    customerName: "Hari Prasad",
    customerNameNe: "हरि प्रसाद",
    customerAvatar: "/images/customers/customer-1.jpg",
    location: "Kathmandu, Ward 10",
    locationNe: "काठमाडौं, वडा १०",
    scheduledDate: "2024-01-22",
    scheduledTime: "10:00 AM",
    price: 1500,
  },
  {
    id: "job-2",
    serviceName: "Electrical Wiring",
    serviceNameNe: "विद्युत वायरिङ",
    customerName: "Maya Devi",
    customerNameNe: "माया देवी",
    customerAvatar: "/images/customers/customer-2.jpg",
    location: "Lalitpur, Ward 5",
    locationNe: "ललितपुर, वडा ५",
    scheduledDate: "2024-01-23",
    scheduledTime: "2:00 PM",
    price: 2500,
  },
];

const activeJobs = [
  {
    id: "active-1",
    serviceName: "Pipe Repair",
    serviceNameNe: "पाइप मर्मत",
    customerName: "Krishna Bahadur",
    customerNameNe: "कृष्ण बहादुर",
    status: "in-progress",
    location: "Bhaktapur",
    locationNe: "भक्तपुर",
  },
];

const earningsData = [
  { month: "Jan", amount: 25000 },
  { month: "Feb", amount: 32000 },
  { month: "Mar", amount: 28000 },
  { month: "Apr", amount: 35000 },
  { month: "May", amount: 42000 },
  { month: "Jun", amount: 38000 },
];

export function ProfessionalDashboard() {
  const { t, language } = useI18n();
  const { user } = useAuth();

  const stats = [
    {
      label: t.professional.stats.totalJobs,
      value: "156",
      icon: Briefcase,
      change: "+12%",
      changeType: "positive" as const,
    },
    {
      label: t.professional.stats.activeJobs,
      value: "3",
      icon: Clock,
      change: "2 pending",
      changeType: "neutral" as const,
    },
    {
      label: t.professional.stats.earnings,
      value: "Rs. 45,000",
      icon: DollarSign,
      change: "+8%",
      changeType: "positive" as const,
    },
    {
      label: t.professional.stats.rating,
      value: "4.9",
      icon: Star,
      change: "245 reviews",
      changeType: "neutral" as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground md:text-3xl">
              {t.dashboard.welcome}, {language === "ne" ? user?.nameNe : user?.name}!
            </h1>
            <p className="mt-1 text-muted-foreground">{t.professional.welcome.subtitle}</p>
          </div>
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
        {/* Job Requests */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t.professional.jobs.requests}</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/jobs/pending">
                {t.common.seeAll}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {jobRequests.length > 0 ? (
              <div className="space-y-4">
                {jobRequests.map((job) => (
                  <div
                    key={job.id}
                    className="rounded-lg border border-border p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={job.customerAvatar || "/placeholder.svg"} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {job.customerName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">
                            {language === "ne" ? job.serviceNameNe : job.serviceName}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {language === "ne" ? job.customerNameNe : job.customerName}
                          </p>
                        </div>
                      </div>
                      <span className="font-semibold text-primary">
                        Rs. {job.price}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {language === "ne" ? job.locationNe : job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {job.scheduledDate} - {job.scheduledTime}
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button size="sm" className="flex-1 gap-1">
                        <Check className="h-4 w-4" />
                        {t.professional.jobs.accept}
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 gap-1 bg-transparent">
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

        {/* Active Jobs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t.professional.jobs.active}</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/jobs/accepted">
                {t.common.seeAll}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {activeJobs.length > 0 ? (
              <div className="space-y-4">
                {activeJobs.map((job) => (
                  <div
                    key={job.id}
                    className="rounded-lg border border-border p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">
                          {language === "ne" ? job.serviceNameNe : job.serviceName}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {language === "ne" ? job.customerNameNe : job.customerName}
                        </p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500">
                        In Progress
                      </Badge>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {language === "ne" ? job.locationNe : job.location}
                    </div>
                    <Button variant="outline" size="sm" className="mt-4 w-full bg-transparent">
                      {t.professional.jobs.viewDetails}
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <Clock className="mx-auto mb-4 h-12 w-12 opacity-50" />
                <p>{t.professional.jobs.noActive}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Earnings Summary */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t.professional.earnings.summary}</CardTitle>
          <Button variant="outline" disabled>
            {t.professional.earnings.withdraw}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={earningsData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis
                  dataKey="month"
                  className="text-xs text-muted-foreground"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  className="text-xs text-muted-foreground"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                  tickFormatter={(value) => `Rs. ${value / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                  formatter={(value: number) => [`Rs. ${value.toLocaleString()}`, "Earnings"]}
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
        </CardContent>
      </Card>
    </div>
  );
}
