"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useI18n } from "@/lib/i18n/context";
import { nepalLocations } from "@/lib/data/nepal-locations";
import { MapPin, Home, Building, Plus, Edit, Trash2 } from "lucide-react";

const addresses = [
  {
    id: "1",
    label: "Home",
    labelNp: "घर",
    address: "House No. 45, Baluwatar",
    city: "Kathmandu",
    cityNp: "काठमाडौं",
    landmark: "Near Baluwatar Chowk",
    phone: "+977 9841234567",
    isDefault: true,
    type: "home",
  },
  {
    id: "2",
    label: "Office",
    labelNp: "कार्यालय",
    address: "Durbar Marg, Floor 3",
    city: "Kathmandu",
    cityNp: "काठमाडौं",
    landmark: "Near Hotel Annapurna",
    phone: "+977 9851234567",
    isDefault: false,
    type: "office",
  },
];

export default function AddressesPage() {
  const { t, locale } = useI18n();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {t("savedAddresses")}
          </h1>
          <p className="text-muted-foreground">{t("manageYourAddresses")}</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              {t("addNew")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t("addNewAddress")}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{t("addressLabel")}</Label>
                  <Input placeholder="Home, Office, etc." />
                </div>
                <div>
                  <Label>{t("addressType")}</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectType")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="home">{t("home")}</SelectItem>
                      <SelectItem value="office">{t("office")}</SelectItem>
                      <SelectItem value="other">{t("other")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>{t("fullAddress")}</Label>
                <Input placeholder={t("enterFullAddress")} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{t("province")}</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectProvince")} />
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
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectDistrict")} />
                    </SelectTrigger>
                    <SelectContent>
                      {nepalLocations.provinces[0].districts.map((district) => (
                        <SelectItem key={district.name} value={district.name}>
                          {locale === "ne" ? district.nameNp : district.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>{t("landmark")}</Label>
                <Input placeholder={t("nearbyLandmark")} />
              </div>

              <div>
                <Label>{t("contactPhone")}</Label>
                <Input placeholder="+977 98XXXXXXXX" />
              </div>

              <Button className="w-full">{t("saveAddress")}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {addresses.map((address) => (
          <Card
            key={address.id}
            className={`overflow-hidden ${address.isDefault ? "ring-2 ring-primary" : ""}`}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {address.type === "home" ? (
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Home className="w-5 h-5 text-primary" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Building className="w-5 h-5 text-blue-600" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {locale === "ne" ? address.labelNp : address.label}
                    </h3>
                    {address.isDefault && (
                      <Badge variant="secondary" className="text-xs">
                        {t("default")}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <p className="text-foreground">{address.address}</p>
                <p className="text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {locale === "ne" ? address.cityNp : address.city}
                </p>
                <p className="text-muted-foreground">{address.landmark}</p>
                <p className="text-muted-foreground">{address.phone}</p>
              </div>

              {!address.isDefault && (
                <Button variant="outline" size="sm" className="w-full mt-4 bg-transparent">
                  {t("setAsDefault")}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
