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
  const { locale } = useI18n();
  const ne = locale === "ne";
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const txt = {
    savedAddresses: ne ? "बचत गरिएका ठेगानाहरू" : "Saved Addresses",
    manageYourAddresses: ne ? "आफ्नो डेलिभरी ठेगानाहरू व्यवस्थापन गर्नुहोस्" : "Manage your delivery addresses",
    addNew: ne ? "नयाँ थप्नुहोस्" : "Add New",
    addNewAddress: ne ? "नयाँ ठेगाना थप्नुहोस्" : "Add New Address",
    addressLabel: ne ? "ठेगाना लेबल" : "Address Label",
    addressType: ne ? "ठेगाना प्रकार" : "Address Type",
    selectType: ne ? "प्रकार छान्नुहोस्" : "Select type",
    home: ne ? "घर" : "Home",
    office: ne ? "कार्यालय" : "Office",
    other: ne ? "अन्य" : "Other",
    fullAddress: ne ? "पूरा ठेगाना" : "Full Address",
    enterFullAddress: ne ? "पूरा ठेगाना प्रविष्ट गर्नुहोस्" : "Enter full address",
    province: ne ? "प्रदेश" : "Province",
    selectProvince: ne ? "प्रदेश छान्नुहोस्" : "Select province",
    district: ne ? "जिल्ला" : "District",
    selectDistrict: ne ? "जिल्ला छान्नुहोस्" : "Select district",
    landmark: ne ? "स्थलचिह्न" : "Landmark",
    nearbyLandmark: ne ? "नजिकको स्थलचिह्न" : "Nearby landmark",
    contactPhone: ne ? "सम्पर्क फोन" : "Contact Phone",
    saveAddress: ne ? "ठेगाना बचत गर्नुहोस्" : "Save Address",
    default: ne ? "पूर्वनिर्धारित" : "Default",
    setAsDefault: ne ? "पूर्वनिर्धारित बनाउनुहोस्" : "Set as Default",
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {txt.savedAddresses}
          </h1>
          <p className="text-muted-foreground">{txt.manageYourAddresses}</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              {txt.addNew}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{txt.addNewAddress}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{txt.addressLabel}</Label>
                  <Input placeholder="Home, Office, etc." />
                </div>
                <div>
                  <Label>{txt.addressType}</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder={txt.selectType} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="home">{txt.home}</SelectItem>
                      <SelectItem value="office">{txt.office}</SelectItem>
                      <SelectItem value="other">{txt.other}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>{txt.fullAddress}</Label>
                <Input placeholder={txt.enterFullAddress} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{txt.province}</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder={txt.selectProvince} />
                    </SelectTrigger>
                    <SelectContent>
                      {nepalLocations.provinces.map((province) => (
                        <SelectItem key={province.name} value={province.name}>
                          {ne ? province.nameNp : province.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{txt.district}</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder={txt.selectDistrict} />
                    </SelectTrigger>
                    <SelectContent>
                      {nepalLocations.provinces[0].districts.map((district) => (
                        <SelectItem key={district.name} value={district.name}>
                          {ne ? district.nameNp : district.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>{txt.landmark}</Label>
                <Input placeholder={txt.nearbyLandmark} />
              </div>

              <div>
                <Label>{txt.contactPhone}</Label>
                <Input placeholder="+977 98XXXXXXXX" />
              </div>

              <Button className="w-full">{txt.saveAddress}</Button>
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
                      {ne ? address.labelNp : address.label}
                    </h3>
                    {address.isDefault && (
                      <Badge variant="secondary" className="text-xs">
                        {txt.default}
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
                  {ne ? address.cityNp : address.city}
                </p>
                <p className="text-muted-foreground">{address.landmark}</p>
                <p className="text-muted-foreground">{address.phone}</p>
              </div>

              {!address.isDefault && (
                <Button variant="outline" size="sm" className="w-full mt-4 bg-transparent">
                  {txt.setAsDefault}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
