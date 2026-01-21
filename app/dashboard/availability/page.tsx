"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useI18n } from "@/lib/i18n/context";
import { Clock, MapPin, Calendar, Save, Plus, Trash2 } from "lucide-react";

const days = [
  { id: "sunday", label: "Sunday", labelNp: "आइतबार" },
  { id: "monday", label: "Monday", labelNp: "सोमबार" },
  { id: "tuesday", label: "Tuesday", labelNp: "मंगलबार" },
  { id: "wednesday", label: "Wednesday", labelNp: "बुधबार" },
  { id: "thursday", label: "Thursday", labelNp: "बिहीबार" },
  { id: "friday", label: "Friday", labelNp: "शुक्रबार" },
  { id: "saturday", label: "Saturday", labelNp: "शनिबार" },
];

const timeOptions = [
  "06:00 AM",
  "07:00 AM",
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
  "08:00 PM",
  "09:00 PM",
];

export default function AvailabilityPage() {
  const { t, locale } = useI18n();
  const [isOnline, setIsOnline] = useState(true);
  const [acceptingEmergency, setAcceptingEmergency] = useState(true);
  const [schedule, setSchedule] = useState<
    Record<string, { enabled: boolean; start: string; end: string }>
  >({
    sunday: { enabled: false, start: "09:00 AM", end: "05:00 PM" },
    monday: { enabled: true, start: "09:00 AM", end: "06:00 PM" },
    tuesday: { enabled: true, start: "09:00 AM", end: "06:00 PM" },
    wednesday: { enabled: true, start: "09:00 AM", end: "06:00 PM" },
    thursday: { enabled: true, start: "09:00 AM", end: "06:00 PM" },
    friday: { enabled: true, start: "09:00 AM", end: "06:00 PM" },
    saturday: { enabled: true, start: "10:00 AM", end: "04:00 PM" },
  });

  const [serviceAreas, setServiceAreas] = useState([
    "Kathmandu",
    "Lalitpur",
    "Bhaktapur",
  ]);

  const toggleDay = (dayId: string) => {
    setSchedule((prev) => ({
      ...prev,
      [dayId]: { ...prev[dayId], enabled: !prev[dayId].enabled },
    }));
  };

  const updateTime = (
    dayId: string,
    field: "start" | "end",
    value: string
  ) => {
    setSchedule((prev) => ({
      ...prev,
      [dayId]: { ...prev[dayId], [field]: value },
    }));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">
          {t("availability")}
        </h1>
        <p className="text-muted-foreground">{t("manageAvailability")}</p>
      </div>

      <div className="space-y-6">
        {/* Online Status */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    isOnline ? "bg-green-100" : "bg-muted"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full ${
                      isOnline ? "bg-green-500" : "bg-muted-foreground"
                    }`}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {isOnline ? t("youAreOnline") : t("youAreOffline")}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isOnline
                      ? t("acceptingNewRequests")
                      : t("notAcceptingRequests")}
                  </p>
                </div>
              </div>
              <Switch checked={isOnline} onCheckedChange={setIsOnline} />
            </div>
          </CardContent>
        </Card>

        {/* Emergency Services */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">
                  {t("emergencyServices")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t("acceptEmergencyDesc")}
                </p>
              </div>
              <Switch
                checked={acceptingEmergency}
                onCheckedChange={setAcceptingEmergency}
              />
            </div>
            {acceptingEmergency && (
              <Badge className="mt-3 bg-red-100 text-red-800">
                {t("emergencyAvailable")} (+Rs. 500)
              </Badge>
            )}
          </CardContent>
        </Card>

        {/* Weekly Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              {t("weeklySchedule")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {days.map((day) => (
              <div
                key={day.id}
                className="flex flex-col sm:flex-row sm:items-center gap-4 p-3 rounded-lg bg-muted/30"
              >
                <div className="flex items-center gap-3 sm:w-40">
                  <Switch
                    checked={schedule[day.id].enabled}
                    onCheckedChange={() => toggleDay(day.id)}
                  />
                  <Label
                    className={
                      schedule[day.id].enabled
                        ? "font-medium"
                        : "text-muted-foreground"
                    }
                  >
                    {locale === "ne" ? day.labelNp : day.label}
                  </Label>
                </div>

                {schedule[day.id].enabled ? (
                  <div className="flex items-center gap-2 flex-1">
                    <Select
                      value={schedule[day.id].start}
                      onValueChange={(value) =>
                        updateTime(day.id, "start", value)
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span className="text-muted-foreground">{t("to")}</span>
                    <Select
                      value={schedule[day.id].end}
                      onValueChange={(value) =>
                        updateTime(day.id, "end", value)
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    {t("notAvailable")}
                  </span>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Service Areas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              {t("serviceAreas")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {serviceAreas.map((area) => (
                <Badge
                  key={area}
                  variant="secondary"
                  className="gap-2 py-1.5 px-3"
                >
                  {area}
                  <button
                    type="button"
                    onClick={() =>
                      setServiceAreas(serviceAreas.filter((a) => a !== area))
                    }
                    className="hover:text-destructive"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Plus className="w-4 h-4" />
              {t("addArea")}
            </Button>
          </CardContent>
        </Card>

        {/* Vacation Mode */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {t("vacationMode")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {t("vacationModeDesc")}
            </p>
            <Button variant="outline">{t("setVacationDates")}</Button>
          </CardContent>
        </Card>

        <Button className="w-full sm:w-auto gap-2">
          <Save className="w-4 h-4" />
          {t("saveChanges")}
        </Button>
      </div>
    </div>
  );
}
