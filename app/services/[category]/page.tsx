"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useI18n } from "@/lib/i18n/context";
import { serviceCategories } from "@/lib/data/services";
import { nepalLocations } from "@/lib/data/nepal-locations";
import {
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  Shield,
  Filter,
  Search,
  ChevronDown,
  Heart,
  Phone,
  Calendar,
} from "lucide-react";

const mockProfessionals = [
  {
    id: "1",
    name: "Ram Bahadur Thapa",
    nameNp: "राम बहादुर थापा",
    photo: "/placeholder.svg?height=200&width=200",
    rating: 4.9,
    reviews: 156,
    experience: 8,
    location: "Kathmandu",
    locationNp: "काठमाडौं",
    verified: true,
    price: 500,
    priceUnit: "per hour",
    skills: ["Pipe Repair", "Installation", "Maintenance"],
    completedJobs: 234,
    responseTime: "15 min",
    available: true,
  },
  {
    id: "2",
    name: "Sita Kumari Sharma",
    nameNp: "सीता कुमारी शर्मा",
    photo: "/placeholder.svg?height=200&width=200",
    rating: 4.8,
    reviews: 89,
    experience: 5,
    location: "Lalitpur",
    locationNp: "ललितपुर",
    verified: true,
    price: 450,
    priceUnit: "per hour",
    skills: ["Deep Cleaning", "Kitchen", "Bathroom"],
    completedJobs: 167,
    responseTime: "20 min",
    available: true,
  },
  {
    id: "3",
    name: "Krishna Prasad Adhikari",
    nameNp: "कृष्ण प्रसाद अधिकारी",
    photo: "/placeholder.svg?height=200&width=200",
    rating: 4.7,
    reviews: 112,
    experience: 10,
    location: "Bhaktapur",
    locationNp: "भक्तपुर",
    verified: true,
    price: 600,
    priceUnit: "per hour",
    skills: ["Wiring", "Repair", "Installation"],
    completedJobs: 312,
    responseTime: "30 min",
    available: false,
  },
  {
    id: "4",
    name: "Maya Devi Gurung",
    nameNp: "माया देवी गुरुङ",
    photo: "/placeholder.svg?height=200&width=200",
    rating: 4.9,
    reviews: 203,
    experience: 7,
    location: "Kathmandu",
    locationNp: "काठमाडौं",
    verified: true,
    price: 800,
    priceUnit: "per session",
    skills: ["Facial", "Hair Care", "Makeup"],
    completedJobs: 456,
    responseTime: "10 min",
    available: true,
  },
  {
    id: "5",
    name: "Bikash Tamang",
    nameNp: "बिकास तामाङ",
    photo: "/placeholder.svg?height=200&width=200",
    rating: 4.6,
    reviews: 78,
    experience: 4,
    location: "Pokhara",
    locationNp: "पोखरा",
    verified: false,
    price: 400,
    priceUnit: "per hour",
    skills: ["AC Repair", "Refrigerator", "Washing Machine"],
    completedJobs: 98,
    responseTime: "45 min",
    available: true,
  },
  {
    id: "6",
    name: "Sunita Rai",
    nameNp: "सुनिता राई",
    photo: "/placeholder.svg?height=200&width=200",
    rating: 4.8,
    reviews: 145,
    experience: 6,
    location: "Lalitpur",
    locationNp: "ललितपुर",
    verified: true,
    price: 550,
    priceUnit: "per hour",
    skills: ["Painting", "Wall Design", "Texture"],
    completedJobs: 189,
    responseTime: "25 min",
    available: true,
  },
];

const Loading = () => null;

export default function CategoryPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { t, locale } = useI18n();
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [sortBy, setSortBy] = useState("rating");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [availableNow, setAvailableNow] = useState(false);

  const category = serviceCategories.find((c) => c.id === params.category);

  const filteredProfessionals = mockProfessionals
    .filter((p) => {
      if (verifiedOnly && !p.verified) return false;
      if (availableNow && !p.available) return false;
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
      if (selectedLocation !== "all" && p.location !== selectedLocation)
        return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "experience") return b.experience - a.experience;
      return 0;
    });

  if (!category) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">
              Category not found
            </h1>
            <Link href="/services">
              <Button className="mt-4">Back to Services</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20">
        {/* Header */}
        <div className="bg-primary/5 border-b border-border">
          <div className="container mx-auto px-4 py-8">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("backToServices")}
            </Link>

            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                style={{ backgroundColor: `${category.color}20` }}
              >
                {category.icon}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  {locale === "ne" ? category.nameNp : category.name}
                </h1>
                <p className="text-muted-foreground">
                  {filteredProfessionals.length} {t("professionalsAvailable")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:w-72 shrink-0">
              <div className="lg:hidden mb-4">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="w-full justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    {t("filters")}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`}
                  />
                </Button>
              </div>

              <Card
                className={`${showFilters ? "block" : "hidden"} lg:block sticky top-24`}
              >
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">
                      {t("searchProfessional")}
                    </h3>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder={t("searchByName")}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground mb-3">
                      {t("location")}
                    </h3>
                    <Select
                      value={selectedLocation}
                      onValueChange={setSelectedLocation}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectLocation")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t("allLocations")}</SelectItem>
                        {nepalLocations.provinces
                          .flatMap((p) => p.districts)
                          .slice(0, 10)
                          .map((d) => (
                            <SelectItem key={d.name} value={d.name}>
                              {locale === "ne" ? d.nameNp : d.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground mb-3">
                      {t("priceRange")} (NPR)
                    </h3>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      min={0}
                      max={2000}
                      step={50}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Rs. {priceRange[0]}</span>
                      <span>Rs. {priceRange[1]}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="verified"
                        checked={verifiedOnly}
                        onCheckedChange={(checked) =>
                          setVerifiedOnly(checked as boolean)
                        }
                      />
                      <label
                        htmlFor="verified"
                        className="text-sm cursor-pointer"
                      >
                        {t("verifiedOnly")}
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="available"
                        checked={availableNow}
                        onCheckedChange={(checked) =>
                          setAvailableNow(checked as boolean)
                        }
                      />
                      <label
                        htmlFor="available"
                        className="text-sm cursor-pointer"
                      >
                        {t("availableNow")}
                      </label>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => {
                      setPriceRange([0, 2000]);
                      setSelectedLocation("all");
                      setVerifiedOnly(false);
                      setAvailableNow(false);
                    }}
                  >
                    {t("clearFilters")}
                  </Button>
                </CardContent>
              </Card>
            </aside>

            {/* Results */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <p className="text-muted-foreground">
                  {t("showing")} {filteredProfessionals.length} {t("results")}
                </p>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder={t("sortBy")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">{t("highestRated")}</SelectItem>
                    <SelectItem value="price-low">
                      {t("priceLowHigh")}
                    </SelectItem>
                    <SelectItem value="price-high">
                      {t("priceHighLow")}
                    </SelectItem>
                    <SelectItem value="experience">
                      {t("mostExperienced")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4">
                {filteredProfessionals.map((professional) => (
                  <Card
                    key={professional.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="p-0">
                      <div className="flex flex-col sm:flex-row">
                        <div className="sm:w-48 h-48 sm:h-auto relative shrink-0">
                          <Image
                            src={professional.photo || "/placeholder.svg"}
                            alt={professional.name}
                            fill
                            className="object-cover"
                          />
                          {professional.verified && (
                            <div className="absolute top-2 left-2">
                              <Badge className="bg-primary text-primary-foreground gap-1">
                                <Shield className="w-3 h-3" />
                                {t("verified")}
                              </Badge>
                            </div>
                          )}
                          <button
                            type="button"
                            className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                          >
                            <Heart className="w-4 h-4 text-muted-foreground" />
                          </button>
                        </div>

                        <div className="flex-1 p-4 sm:p-6">
                          <div className="flex flex-col sm:flex-row justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-lg font-semibold text-foreground">
                                  {locale === "ne"
                                    ? professional.nameNp
                                    : professional.name}
                                </h3>
                                {professional.available && (
                                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                                )}
                              </div>

                              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
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
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {professional.responseTime}
                                </span>
                              </div>

                              <div className="flex flex-wrap gap-2 mb-3">
                                {professional.skills.map((skill) => (
                                  <Badge
                                    key={skill}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {skill}
                                  </Badge>
                                ))}
                              </div>

                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span>
                                  {professional.experience} {t("yearsExp")}
                                </span>
                                <span>
                                  {professional.completedJobs} {t("jobsDone")}
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-col items-end justify-between">
                              <div className="text-right">
                                <p className="text-2xl font-bold text-primary">
                                  Rs. {professional.price}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {professional.priceUnit}
                                </p>
                              </div>

                              <div className="flex gap-2 mt-4">
                                <Button variant="outline" size="sm">
                                  <Phone className="w-4 h-4" />
                                </Button>
                                <Link
                                  href={`/booking/${professional.id}?service=${category.id}`}
                                >
                                  <Button size="sm" className="gap-2">
                                    <Calendar className="w-4 h-4" />
                                    {t("bookNow")}
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredProfessionals.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">
                    {t("noProfessionalsFound")}
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setPriceRange([0, 2000]);
                      setSelectedLocation("all");
                      setVerifiedOnly(false);
                      setAvailableNow(false);
                    }}
                  >
                    {t("clearFilters")}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export { Loading };
