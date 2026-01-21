"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useI18n } from "@/lib/i18n/context";
import { nepalLocations } from "@/lib/data/nepal-locations";
import { Camera, Save, Bell, Lock, Globe } from "lucide-react";

export default function ProfilePage() {
  const { t, locale, setLocale } = useI18n();
  const [profile, setProfile] = useState({
    name: "Bikram Shrestha",
    email: "bikram@example.com",
    phone: "+977 9841234567",
    address: "Baluwatar, Kathmandu",
    province: "Bagmati",
    district: "Kathmandu",
  });

  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    push: true,
    promotional: false,
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">{t("myProfile")}</h1>
        <p className="text-muted-foreground">{t("manageProfile")}</p>
      </div>

      <div className="space-y-6">
        {/* Profile Photo */}
        <Card>
          <CardHeader>
            <CardTitle>{t("profilePhoto")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-muted">
                  <Image
                    src="/placeholder.svg?height=100&width=100"
                    alt="Profile"
                    width={96}
                    height={96}
                    className="object-cover"
                  />
                </div>
                <button
                  type="button"
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div>
                <Button variant="outline" size="sm">
                  {t("uploadNew")}
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  JPG, PNG {t("maxSize")} 2MB
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>{t("personalInfo")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">{t("fullName")}</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="email">{t("email")}</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">{t("phoneNumber")}</Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile({ ...profile, phone: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="address">{t("address")}</Label>
                <Input
                  id="address"
                  value={profile.address}
                  onChange={(e) =>
                    setProfile({ ...profile, address: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>{t("province")}</Label>
                <Select
                  value={profile.province}
                  onValueChange={(value) =>
                    setProfile({ ...profile, province: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {nepalLocations.provinces.map((province) => (
                      <SelectItem key={province.name} value={province.name}>
                        {locale === "ne" ? province.nameNp : province.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{t("district")}</Label>
                <Select
                  value={profile.district}
                  onValueChange={(value) =>
                    setProfile({ ...profile, district: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {nepalLocations.provinces
                      .find((p) => p.name === profile.province)
                      ?.districts.map((district) => (
                        <SelectItem key={district.name} value={district.name}>
                          {locale === "ne" ? district.nameNp : district.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button className="gap-2">
              <Save className="w-4 h-4" />
              {t("saveChanges")}
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              {t("notifications")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{t("emailNotifications")}</p>
                <p className="text-sm text-muted-foreground">
                  {t("receiveEmailUpdates")}
                </p>
              </div>
              <Switch
                checked={notifications.email}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, email: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{t("smsNotifications")}</p>
                <p className="text-sm text-muted-foreground">
                  {t("receiveSmsUpdates")}
                </p>
              </div>
              <Switch
                checked={notifications.sms}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, sms: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{t("pushNotifications")}</p>
                <p className="text-sm text-muted-foreground">
                  {t("receivePushUpdates")}
                </p>
              </div>
              <Switch
                checked={notifications.push}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, push: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{t("promotionalEmails")}</p>
                <p className="text-sm text-muted-foreground">
                  {t("receivePromotions")}
                </p>
              </div>
              <Switch
                checked={notifications.promotional}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, promotional: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Language & Security */}
        <div className="grid sm:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                {t("language")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={locale}
                onValueChange={(value) => setLocale(value as "en" | "ne")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ne">नेपाली</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                {t("security")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full bg-transparent">
                {t("changePassword")}
              </Button>
              <Button
                variant="outline"
                className="w-full text-destructive hover:text-destructive bg-transparent"
              >
                {t("deleteAccount")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
