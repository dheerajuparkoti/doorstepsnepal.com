"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n/context";
import { Star, MapPin, Shield, Heart, Calendar } from "lucide-react";

const favorites = [
  {
    id: "1",
    name: "Ram Bahadur Thapa",
    nameNp: "राम बहादुर थापा",
    photo: "/placeholder.svg?height=200&width=200",
    rating: 4.9,
    reviews: 156,
    service: "Plumbing",
    serviceNp: "प्लम्बिङ",
    location: "Kathmandu",
    locationNp: "काठमाडौं",
    verified: true,
    price: 500,
  },
  {
    id: "2",
    name: "Maya Devi Gurung",
    nameNp: "माया देवी गुरुङ",
    photo: "/placeholder.svg?height=200&width=200",
    rating: 4.9,
    reviews: 203,
    service: "Beauty",
    serviceNp: "सौन्दर्य",
    location: "Kathmandu",
    locationNp: "काठमाडौं",
    verified: true,
    price: 800,
  },
  {
    id: "3",
    name: "Krishna Prasad Adhikari",
    nameNp: "कृष्ण प्रसाद अधिकारी",
    photo: "/placeholder.svg?height=200&width=200",
    rating: 4.7,
    reviews: 112,
    service: "Electrical",
    serviceNp: "बिजुली",
    location: "Bhaktapur",
    locationNp: "भक्तपुर",
    verified: true,
    price: 600,
  },
];

export default function FavoritesPage() {
  const { t, locale } = useI18n();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">
          {t("favoriteProf")}
        </h1>
        <p className="text-muted-foreground">{t("savedProfessionals")}</p>
      </div>

      {favorites.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">{t("noFavorites")}</p>
            <Link href="/services">
              <Button>{t("browseServices")}</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((professional) => (
            <Card
              key={professional.id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48">
                <Image
                  src={professional.photo || "/placeholder.svg"}
                  alt={professional.name}
                  fill
                  className="object-cover"
                />
                {professional.verified && (
                  <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground gap-1">
                    <Shield className="w-3 h-3" />
                    {t("verified")}
                  </Badge>
                )}
                <button
                  type="button"
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                >
                  <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                </button>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-foreground mb-1">
                  {locale === "ne" ? professional.nameNp : professional.name}
                </h3>
                <p className="text-sm text-primary mb-2">
                  {locale === "ne"
                    ? professional.serviceNp
                    : professional.service}
                </p>

                <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    {professional.rating} ({professional.reviews})
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {locale === "ne"
                      ? professional.locationNp
                      : professional.location}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <p className="font-semibold text-primary">
                    Rs. {professional.price}
                    <span className="text-xs text-muted-foreground font-normal">
                      /hr
                    </span>
                  </p>
                  <Link href={`/booking/${professional.id}?service=plumbing`}>
                    <Button size="sm" className="gap-2">
                      <Calendar className="w-4 h-4" />
                      {t("book")}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
