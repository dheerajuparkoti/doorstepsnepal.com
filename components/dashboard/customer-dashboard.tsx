"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { useUser } from "@/lib/context/user-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { serviceCategories, promotions } from "@/lib/data/services";
import {
  Plus,
  Search,
  CalendarDays,
  ArrowRight,
  Clock,
  CheckCircle,
  Percent,
  Star,
} from "lucide-react";

// Mock data for active bookings
const activeBookings = [
  {
    id: "booking-1",
    serviceName: "AC Repair",
    serviceNameNe: "एसी मर्मत",
    professionalName: "Ram Bahadur",
    professionalNameNe: "राम बहादुर",
    professionalAvatar: "/images/professionals/pro-1.jpg",
    status: "pending",
    scheduledDate: "2024-01-20",
    scheduledTime: "10:00 AM",
  },
  {
    id: "booking-2",
    serviceName: "Deep Cleaning",
    serviceNameNe: "गहिरो सफाई",
    professionalName: "Sita Kumari",
    professionalNameNe: "सीता कुमारी",
    professionalAvatar: "/images/professionals/pro-2.jpg",
    status: "ongoing",
    scheduledDate: "2024-01-21",
    scheduledTime: "2:00 PM",
  },
];

const statusConfig: Record<string, { label: string; labelNe: string; className: string }> = {
  pending: { label: "Pending", labelNe: "पेन्डिङ", className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500" },
  ongoing: { label: "Ongoing", labelNe: "जारी", className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500" },
  completed: { label: "Completed", labelNe: "पूरा भयो", className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500" },
};

export function CustomerDashboard() {
  const { t, language } = useI18n();
  const { user } = useUser();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">
            {t.dashboard.hi}, {language === "ne" ? user?.nameNe : user?.name}!
          </h1>
          <p className="mt-1 text-muted-foreground">{t.customer.welcome.subtitle}</p>
        </div>
        <Button asChild>
          <Link href="/services">
            <Plus className="mr-2 h-4 w-4" />
            {t.customer.quickActions.bookService}
          </Link>
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="cursor-pointer transition-all hover:border-primary hover:shadow-md">
          <Link href="/services">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Plus className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">{t.customer.quickActions.bookService}</h3>
                <p className="text-sm text-muted-foreground">
                  {language === "ne" ? "नयाँ सेवा बुक गर्नुहोस्" : "Book a new service"}
                </p>
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="cursor-pointer transition-all hover:border-primary hover:shadow-md">
          <Link href="/services">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Search className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">{t.customer.quickActions.browseServices}</h3>
                <p className="text-sm text-muted-foreground">
                  {language === "ne" ? "सबै सेवाहरू हेर्नुहोस्" : "Explore all services"}
                </p>
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="cursor-pointer transition-all hover:border-primary hover:shadow-md">
          <Link href="/dashboard/bookings">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <CalendarDays className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">{t.customer.quickActions.viewActiveBookings}</h3>
                <p className="text-sm text-muted-foreground">
                  {language === "ne" ? "तपाईंको बुकिङहरू" : "Your bookings"}
                </p>
              </div>
            </CardContent>
          </Link>
        </Card>
      </div>

      {/* Active Bookings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t.customer.bookings.active}</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/bookings">
              {t.common.seeAll}
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {activeBookings.length > 0 ? (
            <div className="space-y-4">
              {activeBookings.map((booking) => {
                const status = statusConfig[booking.status];
                return (
                  <div
                    key={booking.id}
                    className="flex flex-col gap-4 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={booking.professionalAvatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {booking.professionalName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">
                          {language === "ne" ? booking.serviceNameNe : booking.serviceName}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {language === "ne" ? booking.professionalNameNe : booking.professionalName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {booking.scheduledDate} - {booking.scheduledTime}
                      </div>
                      <Badge className={status.className}>
                        {language === "ne" ? status.labelNe : status.label}
                      </Badge>
                      <Button variant="outline" size="sm">
                        {t.customer.bookings.viewDetails}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              <CalendarDays className="mx-auto mb-4 h-12 w-12 opacity-50" />
              <p>{t.customer.bookings.noBookings}</p>
              <Button className="mt-4" asChild>
                <Link href="/services">{t.customer.quickActions.bookService}</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recommended Services */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t.customer.recommended}</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/services">
              {t.common.seeAll}
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {serviceCategories.slice(0, 4).map((category) => (
              <Link key={category.id} href={`/services/${category.id}`}>
                <Card className="group cursor-pointer transition-all hover:border-primary hover:shadow-md">
                  <CardContent className="p-4">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <CheckCircle className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold">
                      {language === "ne" ? category.nameNe : category.name}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                      {language === "ne" ? category.descriptionNe : category.description}
                    </p>
                    <div className="mt-3 flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>4.8</span>
                      <span className="text-muted-foreground">(120+ reviews)</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Promotions */}
      <Card>
        <CardHeader>
          <CardTitle>{t.promotions.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {promotions.map((promo) => (
              <Card
                key={promo.id}
                className="group relative overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge className="gap-1 bg-primary text-primary-foreground">
                        <Percent className="h-3 w-3" />
                        {promo.discount}% {t.promotions.off}
                      </Badge>
                      <h3 className="mt-2 font-semibold">
                        {language === "ne" ? promo.titleNe : promo.title}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {language === "ne" ? promo.descriptionNe : promo.description}
                      </p>
                    </div>
                  </div>
                  <Button className="mt-4 w-full" size="sm">
                    {t.promotions.bookNow}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
