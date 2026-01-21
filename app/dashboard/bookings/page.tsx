"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/lib/i18n/context";
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  MessageSquare,
  Star,
  MoreVertical,
  XCircle,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const bookings = [
  {
    id: "DN-2024-ABC123",
    professional: {
      name: "Ram Bahadur Thapa",
      nameNp: "राम बहादुर थापा",
      photo: "/placeholder.svg?height=100&width=100",
      phone: "+977 9841234567",
      rating: 4.9,
    },
    service: "Plumbing",
    serviceNp: "प्लम्बिङ",
    date: "2024-01-20",
    time: "10:00 AM",
    address: "Baluwatar, Kathmandu",
    status: "confirmed",
    price: 550,
    description: "Kitchen sink pipe leaking",
  },
  {
    id: "DN-2024-DEF456",
    professional: {
      name: "Sita Kumari Sharma",
      nameNp: "सीता कुमारी शर्मा",
      photo: "/placeholder.svg?height=100&width=100",
      phone: "+977 9851234567",
      rating: 4.8,
    },
    service: "Cleaning",
    serviceNp: "सफाई",
    date: "2024-01-22",
    time: "02:00 PM",
    address: "Patan, Lalitpur",
    status: "pending",
    price: 800,
    description: "Full house deep cleaning",
  },
  {
    id: "DN-2024-GHI789",
    professional: {
      name: "Krishna Prasad Adhikari",
      nameNp: "कृष्ण प्रसाद अधिकारी",
      photo: "/placeholder.svg?height=100&width=100",
      phone: "+977 9861234567",
      rating: 4.7,
    },
    service: "Electrical",
    serviceNp: "बिजुली",
    date: "2024-01-15",
    time: "11:00 AM",
    address: "Bhaktapur",
    status: "completed",
    price: 650,
    description: "Wiring repair in bedroom",
  },
  {
    id: "DN-2024-JKL012",
    professional: {
      name: "Maya Devi Gurung",
      nameNp: "माया देवी गुरुङ",
      photo: "/placeholder.svg?height=100&width=100",
      phone: "+977 9871234567",
      rating: 4.9,
    },
    service: "Beauty",
    serviceNp: "सौन्दर्य",
    date: "2024-01-10",
    time: "03:00 PM",
    address: "Thamel, Kathmandu",
    status: "cancelled",
    price: 1200,
    description: "Bridal makeup session",
  },
];

const statusConfig = {
  pending: {
    label: "Pending",
    labelNp: "बाँकी",
    color: "bg-yellow-100 text-yellow-800",
    icon: AlertCircle,
  },
  confirmed: {
    label: "Confirmed",
    labelNp: "पुष्टि भयो",
    color: "bg-blue-100 text-blue-800",
    icon: CheckCircle,
  },
  completed: {
    label: "Completed",
    labelNp: "सम्पन्न",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
  },
  cancelled: {
    label: "Cancelled",
    labelNp: "रद्द",
    color: "bg-red-100 text-red-800",
    icon: XCircle,
  },
};

export default function BookingsPage() {
  const { t, locale } = useI18n();
  const [activeTab, setActiveTab] = useState("all");
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const filteredBookings =
    activeTab === "all"
      ? bookings
      : bookings.filter((b) => b.status === activeTab);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">{t("myBookings")}</h1>
        <p className="text-muted-foreground">{t("manageYourBookings")}</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 flex-wrap h-auto gap-2">
          <TabsTrigger value="all">{t("all")}</TabsTrigger>
          <TabsTrigger value="pending">{t("pending")}</TabsTrigger>
          <TabsTrigger value="confirmed">{t("confirmed")}</TabsTrigger>
          <TabsTrigger value="completed">{t("completed")}</TabsTrigger>
          <TabsTrigger value="cancelled">{t("cancelled")}</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredBookings.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">{t("noBookingsFound")}</p>
                <Link href="/services">
                  <Button className="mt-4">{t("browseServices")}</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            filteredBookings.map((booking) => {
              const status =
                statusConfig[booking.status as keyof typeof statusConfig];
              const StatusIcon = status.icon;

              return (
                <Card key={booking.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col lg:flex-row">
                      {/* Professional Info */}
                      <div className="p-4 sm:p-6 flex-1">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-16 h-16 relative rounded-lg overflow-hidden shrink-0">
                            <Image
                              src={booking.professional.photo || "/placeholder.svg"}
                              alt={booking.professional.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h3 className="font-semibold text-foreground">
                                  {locale === "ne"
                                    ? booking.professional.nameNp
                                    : booking.professional.name}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {locale === "ne"
                                    ? booking.serviceNp
                                    : booking.service}
                                </p>
                              </div>
                              <Badge className={status.color}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {locale === "ne" ? status.labelNp : status.label}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm">
                                {booking.professional.rating}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            {new Date(booking.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            {booking.time}
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground sm:col-span-2">
                            <MapPin className="w-4 h-4 shrink-0" />
                            {booking.address}
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mt-3 p-3 bg-muted/50 rounded-lg">
                          {booking.description}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="p-4 sm:p-6 lg:w-64 border-t lg:border-t-0 lg:border-l border-border bg-muted/30 flex flex-col justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            {t("bookingId")}
                          </p>
                          <p className="font-mono text-sm font-medium mb-4">
                            {booking.id}
                          </p>
                          <p className="text-2xl font-bold text-primary">
                            Rs. {booking.price}
                          </p>
                        </div>

                        <div className="flex flex-col gap-2 mt-4">
                          {(booking.status === "pending" ||
                            booking.status === "confirmed") && (
                            <>
                              <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                                <Phone className="w-4 h-4" />
                                {t("call")}
                              </Button>
                              <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                                <MessageSquare className="w-4 h-4" />
                                {t("message")}
                              </Button>
                              {booking.status === "pending" && (
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  className="gap-2"
                                >
                                  <XCircle className="w-4 h-4" />
                                  {t("cancel")}
                                </Button>
                              )}
                            </>
                          )}

                          {booking.status === "completed" && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" className="gap-2">
                                  <Star className="w-4 h-4" />
                                  {t("writeReview")}
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>{t("rateYourExperience")}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="flex justify-center gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <button
                                        key={star}
                                        type="button"
                                        onClick={() => setReviewRating(star)}
                                        className="p-1"
                                      >
                                        <Star
                                          className={`w-8 h-8 ${
                                            star <= reviewRating
                                              ? "fill-yellow-400 text-yellow-400"
                                              : "text-muted-foreground"
                                          }`}
                                        />
                                      </button>
                                    ))}
                                  </div>
                                  <Textarea
                                    placeholder={t("shareYourExperience")}
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                    rows={4}
                                  />
                                  <Button className="w-full">
                                    {t("submitReview")}
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}

                          {booking.status === "cancelled" && (
                            <Link href="/services">
                              <Button size="sm" className="w-full">
                                {t("bookAgain")}
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
