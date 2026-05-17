"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useI18n } from "@/lib/i18n/context";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Download,
  Calendar,
  IndianRupee,
  CreditCard,
  Clock,
} from "lucide-react";

const earningsData = {
  totalEarnings: 45600,
  thisMonth: 12500,
  lastMonth: 10800,
  pendingPayout: 3200,
  completedJobs: 28,
  avgPerJob: 1628,
};

const transactions = [
  {
    id: "TXN001",
    date: "2024-01-20",
    type: "credit",
    amount: 550,
    description: "Plumbing repair - Bikram Shrestha",
    status: "completed",
  },
  {
    id: "TXN002",
    date: "2024-01-19",
    type: "credit",
    amount: 1200,
    description: "Installation - Sunita Maharjan",
    status: "completed",
  },
  {
    id: "TXN003",
    date: "2024-01-18",
    type: "withdrawal",
    amount: 5000,
    description: "Bank transfer - NIC Asia",
    status: "completed",
  },
  {
    id: "TXN004",
    date: "2024-01-17",
    type: "credit",
    amount: 800,
    description: "Maintenance - Rajesh Tamang",
    status: "pending",
  },
  {
    id: "TXN005",
    date: "2024-01-16",
    type: "credit",
    amount: 650,
    description: "Emergency repair - Kamala Thapa",
    status: "completed",
  },
];

export default function EarningsPage() {
  const { locale } = useI18n();
  const ne = locale === "ne";

  const txt = {
    earnings: ne ? "आम्दानी" : "Earnings",
    trackYourEarnings: ne ? "आफ्नो आम्दानी ट्र्याक गर्नुहोस्" : "Track your earnings",
    thisMonth: ne ? "यो महिना" : "This Month",
    lastMonth: ne ? "गत महिना" : "Last Month",
    last3Months: ne ? "अन्तिम ३ महिना" : "Last 3 Months",
    thisYear: ne ? "यो वर्ष" : "This Year",
    export: ne ? "निर्यात" : "Export",
    totalEarnings: ne ? "कुल आम्दानी" : "Total Earnings",
    allTime: ne ? "सबै समय" : "All time",
    fromLastMonth: ne ? "गत महिनाबाट" : "from last month",
    pendingPayout: ne ? "पेन्डिङ भुक्तानी" : "Pending Payout",
    withdraw: ne ? "निकाल्नुहोस्" : "Withdraw",
    avgPerJob: ne ? "प्रति काम औसत" : "Avg per Job",
    jobsCompleted: ne ? "काम सम्पन्न" : "jobs completed",
    recentTransactions: ne ? "हालका कारोबारहरू" : "Recent Transactions",
    viewAll: ne ? "सबै हेर्नुहोस्" : "View All",
    completed: ne ? "सम्पन्न" : "Completed",
    pending: ne ? "पेन्डिङ" : "Pending",
  };

  const growthPercent = (
    ((earningsData.thisMonth - earningsData.lastMonth) /
      earningsData.lastMonth) *
    100
  ).toFixed(1);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{txt.earnings}</h1>
          <p className="text-muted-foreground">{txt.trackYourEarnings}</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="thisMonth">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="thisMonth">{txt.thisMonth}</SelectItem>
              <SelectItem value="lastMonth">{txt.lastMonth}</SelectItem>
              <SelectItem value="last3Months">{txt.last3Months}</SelectItem>
              <SelectItem value="thisYear">{txt.thisYear}</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Download className="w-4 h-4" />
            {txt.export}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">{txt.totalEarnings}</p>
              <Wallet className="w-5 h-5 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">
              Rs. {earningsData.totalEarnings.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{txt.allTime}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">{txt.thisMonth}</p>
              {Number(growthPercent) >= 0 ? (
                <TrendingUp className="w-5 h-5 text-green-600" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-600" />
              )}
            </div>
            <p className="text-2xl font-bold text-foreground">
              Rs. {earningsData.thisMonth.toLocaleString()}
            </p>
            <p
              className={`text-xs mt-1 ${Number(growthPercent) >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {Number(growthPercent) >= 0 ? "+" : ""}
              {growthPercent}% {txt.fromLastMonth}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">{txt.pendingPayout}</p>
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-foreground">
              Rs. {earningsData.pendingPayout.toLocaleString()}
            </p>
            <Button size="sm" className="mt-2 w-full bg-transparent" variant="outline">
              {txt.withdraw}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">{txt.avgPerJob}</p>
              <IndianRupee className="w-5 h-5 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">
              Rs. {earningsData.avgPerJob.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {earningsData.completedJobs} {txt.jobsCompleted}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{txt.recentTransactions}</span>
            <Button variant="link" size="sm">
              {txt.viewAll}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.map((txn) => (
              <div
                key={txn.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      txn.type === "credit"
                        ? "bg-green-100 text-green-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {txn.type === "credit" ? (
                      <ArrowUpRight className="w-5 h-5" />
                    ) : (
                      <CreditCard className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {txn.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {new Date(txn.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-semibold ${
                      txn.type === "credit" ? "text-green-600" : "text-foreground"
                    }`}
                  >
                    {txn.type === "credit" ? "+" : "-"}Rs. {txn.amount}
                  </p>
                  <Badge
                    variant={txn.status === "completed" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {txn.status === "completed" ? txt.completed : txt.pending}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
