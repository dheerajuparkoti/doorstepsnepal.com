"use client";

import { useState } from "react";
import Image from "next/image";
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
  CheckCircle,
  XCircle,
  AlertCircle,
  Navigation,
  IndianRupee,
} from "lucide-react";

const jobs = [
  {
    id: "DN-2024-ABC123",
    customer: {
      name: "Bikram Shrestha",
      nameNp: "बिक्रम श्रेष्ठ",
      photo: "/placeholder.svg?height=100&width=100",
      phone: "+977 9841234567",
    },
    service: "Pipe Repair",
    serviceNp: "पाइप मर्मत",
    date: "2024-01-20",
    time: "10:00 AM",
    address: "House No. 45, Baluwatar, Kathmandu",
    landmark: "Near Baluwatar Chowk",
    status: "new",
    price: 500,
    description: "Kitchen sink pipe is leaking badly. Need urgent repair.",
    urgency: "urgent",
  },
  {
    id: "DN-2024-DEF456",
    customer: {
      name: "Sunita Maharjan",
      nameNp: "सुनिता महर्जन",
      photo: "/placeholder.svg?height=100&width=100",
      phone: "+977 9851234567",
    },
    service: "Installation",
    serviceNp: "स्थापना",
    date: "2024-01-22",
    time: "02:00 PM",
    address: "Patan Durbar Square Area, Lalitpur",
    landmark: "Near Patan Museum",
    status: "accepted",
    price: 1200,
    description: "New bathroom tap and shower installation.",
    urgency: "normal",
  },
  {
    id: "DN-2024-GHI789",
    customer: {
      name: "Rajesh Tamang",
      nameNp: "राजेश तामाङ",
      photo: "/placeholder.svg?height=100&width=100",
      phone: "+977 9861234567",
    },
    service: "Maintenance",
    serviceNp: "मर्मत",
    date: "2024-01-15",
    time: "11:00 AM",
    address: "Bhaktapur Durbar Square",
    landmark: "Near 55 Window Palace",
    status: "completed",
    price: 800,
    description: "Annual plumbing maintenance checkup.",
    urgency: "normal",
  },
];

const statusConfig = {
  new: {
    label: "New Request",
    labelNp: "नयाँ अनुरोध",
    color: "bg-blue-100 text-blue-800",
    icon: AlertCircle,
  },
  accepted: {
    label: "Accepted",
    labelNp: "स्वीकृत",
    color: "bg-yellow-100 text-yellow-800",
    icon: CheckCircle,
  },
  inProgress: {
    label: "In Progress",
    labelNp: "प्रगतिमा",
    color: "bg-purple-100 text-purple-800",
    icon: Clock,
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

export default function JobsPage() {
  const { t, locale } = useI18n();
  const [activeTab, setActiveTab] = useState("new");

  const filteredJobs =
    activeTab === "all" ? jobs : jobs.filter((j) => j.status === activeTab);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">{("jobRequests")}</h1>
        <p className="text-muted-foreground">{("manageJobRequests")}</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 flex-wrap h-auto gap-2">
          <TabsTrigger value="new">
            {("newRequests")}
            <Badge variant="secondary" className="ml-2">
              {jobs.filter((j) => j.status === "new").length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="accepted">{("accepted")}</TabsTrigger>
          <TabsTrigger value="inProgress">{("inProgress")}</TabsTrigger>
          <TabsTrigger value="completed">{("completed")}</TabsTrigger>
          <TabsTrigger value="all">{("all")}</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredJobs.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">{("noJobsFound")}</p>
              </CardContent>
            </Card>
          ) : (
            filteredJobs.map((job) => {
              const status = statusConfig[job.status as keyof typeof statusConfig];
              const StatusIcon = status.icon;

              return (
                <Card key={job.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col lg:flex-row">
                      {/* Job Info */}
                      <div className="p-4 sm:p-6 flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start gap-4">
                            <div className="w-14 h-14 relative rounded-full overflow-hidden shrink-0">
                              <Image
                                src={job.customer.photo || "/placeholder.svg"}
                                alt={job.customer.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground">
                                {locale === "ne"
                                  ? job.customer.nameNp
                                  : job.customer.name}
                              </h3>
                              <p className="text-sm text-primary font-medium">
                                {locale === "ne" ? job.serviceNp : job.service}
                              </p>
                              {job.urgency === "urgent" && (
                                <Badge variant="destructive" className="mt-1">
                                  {("urgent")}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Badge className={status.color}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {locale === "ne" ? status.labelNp : status.label}
                          </Badge>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-3 text-sm mb-4">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            {new Date(job.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            {job.time}
                          </div>
                          <div className="flex items-start gap-2 text-muted-foreground sm:col-span-2">
                            <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                            <div>
                              <p>{job.address}</p>
                              <p className="text-xs">{job.landmark}</p>
                            </div>
                          </div>
                        </div>

                        <div className="p-3 bg-muted/50 rounded-lg">
                          <p className="text-sm font-medium mb-1">
                            {("description")}:
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {job.description}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="p-4 sm:p-6 lg:w-64 border-t lg:border-t-0 lg:border-l border-border bg-muted/30 flex flex-col justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            {("bookingId")}
                          </p>
                          <p className="font-mono text-sm font-medium mb-4">
                            {job.id}
                          </p>
                          <div className="flex items-center gap-2">
                            <IndianRupee className="w-5 h-5 text-primary" />
                            <span className="text-2xl font-bold text-primary">
                              {job.price}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 mt-4">
                          {job.status === "new" && (
                            <>
                              <Button size="sm" className="gap-2">
                                <CheckCircle className="w-4 h-4" />
                                {("acceptJob")}
                              </Button>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="gap-2 bg-transparent"
                                  >
                                    <XCircle className="w-4 h-4" />
                                    {("decline")}
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>
                                      {("declineReason")}
                                    </DialogTitle>
                                  </DialogHeader>
                                  <Textarea
                                    placeholder={("enterDeclineReason")}
                                    rows={4}
                                  />
                                  <Button variant="destructive">
                                    {("confirmDecline")}
                                  </Button>
                                </DialogContent>
                              </Dialog>
                            </>
                          )}

                          {job.status === "accepted" && (
                            <>
                              <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                                <Phone className="w-4 h-4" />
                                {("callCustomer")}
                              </Button>
                              <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                                <Navigation className="w-4 h-4" />
                                {("getDirections")}
                              </Button>
                              <Button size="sm" className="gap-2">
                                <Clock className="w-4 h-4" />
                                {("startJob")}
                              </Button>
                            </>
                          )}

                          {job.status === "inProgress" && (
                            <Button size="sm" className="gap-2">
                              <CheckCircle className="w-4 h-4" />
                              {("completeJob")}
                            </Button>
                          )}

                          {job.status === "completed" && (
                            <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                              <MessageSquare className="w-4 h-4" />
                              {("viewReview")}
                            </Button>
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
