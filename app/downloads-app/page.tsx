"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Download, 
  Smartphone, 
  Apple, 
  Shield, 
  CheckCircle, 
  ArrowRight, 
  Star, 
  Users, 
  Clock, 
  Globe,
  QrCode,
  Share2,
  Heart,
  Sparkles,
  SmartphoneIcon as Phone,
  PhoneIcon,
  ArrowUp
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import Image from "next/image";
import { Footer } from "@/components/layout/footer";

export default function DownloadPage() {
  const { locale } = useI18n();
  const [activeTab, setActiveTab] = useState("android");

  // App features in both languages
  const features = {
    en: [
      {
        icon: Clock,
        title: "Quick Booking",
        description: "Book services in under 2 minutes"
      },
      {
        icon: Shield,
        title: "Secure Payments",
        description: "100% secure payment processing"
      },
      {
        icon: Users,
        title: "Verified Professionals",
        description: "Background-checked service providers"
      },
      {
        icon: Star,
        title: "Customer Reviews",
        description: "Real reviews from real customers"
      },
      {
        icon: Globe,
        title: "Multiple Services",
        description: "100+ home services available"
      },
      {
        icon: Heart,
        title: "Customer Support",
        description: "24/7 support for all queries"
      }
    ],
    ne: [
      {
        icon: Clock,
        title: "छिटो बुकिङ",
        description: "२ मिनेट भित्रमा सेवा बुक गर्नुहोस्"
      },
      {
        icon: Shield,
        title: "सुरक्षित भुक्तानी",
        description: "१००% सुरक्षित भुक्तानी प्रक्रिया"
      },
      {
        icon: Users,
        title: "प्रमाणित पेशेवर",
        description: "पृष्ठभूमि जाँच गरिएका सेवा प्रदायक"
      },
      {
        icon: Star,
        title: "ग्राहक समीक्षा",
        description: "वास्तविक ग्राहकहरूको वास्तविक समीक्षा"
      },
      {
        icon: Globe,
        title: "बहुविध सेवाहरू",
        description: "१००+ भन्दा बढी घरेलु सेवाहरू उपलब्ध"
      },
      {
        icon: Heart,
        title: "ग्राहक सहयोग",
        description: "सबै प्रश्नहरूको लागि २४/७ सहयोग"
      }
    ]
  };

  // App screenshots with descriptions
  const screenshots = [
    {
      id: 1,
      title: locale === "ne" ? "होमस्क्रिन" : "Home Screen",
      description: locale === "ne" ? "सबै सेवाहरू एकै ठाउँमा" : "All services in one place"
    },
    {
      id: 2,
      title: locale === "ne" ? "सेवा बुकिङ" : "Service Booking",
      description: locale === "ne" ? "सजिलो र छिटो बुकिङ" : "Easy and quick booking"
    },
    {
      id: 3,
      title: locale === "ne" ? "भुक्तानी" : "Payment",
      description: locale === "ne" ? "सुरक्षित भुक्तानी विकल्प" : "Secure payment options"
    },
    {
      id: 4,
      title: locale === "ne" ? "प्रोफाइल व्यवस्थापन" : "Profile Management",
      description: locale === "ne" ? "आफ्नो प्रोफाइल व्यवस्थापन" : "Manage your profile"
    },
    {
      id: 5,
      title: locale === "ne" ? "सेवा इतिहास" : "Service History",
      description: locale === "ne" ? "अघिल्ला सेवाहरूको विवरण" : "Details of previous services"
    },
    {
      id: 6,
      title: locale === "ne" ? "रियल टाइम ट्र्याकिङ" : "Real-time Tracking",
      description: locale === "ne" ? "सेवा प्रगति ट्र्याक गर्नुहोस्" : "Track service progress"
    }
  ];

  // Download stats
  const stats = [
    {
      value: "50K+",
      label: locale === "ne" ? "डाउनलोड" : "Downloads"
    },
    {
      value: "4.8",
      label: locale === "ne" ? "तारा दर्जा" : "Star Rating"
    },
    {
      value: "10K+",
      label: locale === "ne" ? "सक्रिय प्रयोगकर्ता" : "Active Users"
    },
    {
      value: "98%",
      label: locale === "ne" ? "सन्तुष्टि दर" : "Satisfaction Rate"
    }
  ];

  // Download links
  const downloadLinks = {
    android: "https://play.google.com/store/apps/details?id=com.techreva.doorsteps",
    ios: "https://apps.apple.com/np/app/doorsteps-nepal/id6479012345"
  };

  // App details
  const appDetails = {
    version: "2.5.1",
    size: locale === "ne" ? "४५ MB" : "45 MB",
    rating: "4.8",
    downloads: "50,000+",
    updated: locale === "ne" ? "जनवरी २०२४" : "January 2024",
    requirements: locale === "ne" ? "Android 8.0+ / iOS 14.0+" : "Android 8.0+ / iOS 14.0+"
  };

  const currentFeatures = locale === "ne" ? features.ne : features.en;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        {/* Hero Section */}
        <section className="py-12 md:py-20 bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Left Content */}
                <div className="space-y-8">
                  <div>
                    <Badge variant="secondary" className="mb-4">
                      <Sparkles className="h-3 w-3 mr-2" />
                      {locale === "ne" ? "नयाँ संस्करण उपलब्ध" : "New Version Available"}
                    </Badge>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
                      {locale === "ne" ? "Door Steps Nepal मोबाइल एप" : "Door Steps Nepal Mobile App"}
                    </h1>
                    <p className="text-xl text-muted-foreground mb-6">
                      {locale === "ne" 
                        ? "आफ्नो घरको लागि सबै सेवाहरू एकै ठाउँमा। डाउनलोड गर्नुहोस् र अहिले नै सेवा बुक गर्नुहोस्।"
                        : "All home services in one place. Download now and book services instantly."}
                    </p>
                  </div>

                  {/* App Store Badges */}
                  <div className="flex flex-wrap gap-4">
                    <a 
                      href={downloadLinks.android}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 bg-gray-900 hover:bg-gray-800 text-white px-6 py-4 rounded-xl transition-all hover:scale-105 active:scale-95"
                    >
                      <div className="bg-white/10 p-2 rounded-lg">
                        <PhoneIcon className="h-6 w-6" />
                      </div>
                      <div className="text-left">
                        <div className="text-sm opacity-80">
                          {locale === "ne" ? "Google Play मा उपलब्ध छ" : "Get it on"}
                        </div>
                        <div className="text-xl font-bold">Google Play</div>
                      </div>
                    </a>

                    <a 
                      href={downloadLinks.ios}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 bg-black hover:bg-gray-900 text-white px-6 py-4 rounded-xl transition-all hover:scale-105 active:scale-95"
                    >
                      <div className="bg-white/10 p-2 rounded-lg">
                        <Apple className="h-6 w-6" />
                      </div>
                      <div className="text-left">
                        <div className="text-sm opacity-80">
                          {locale === "ne" ? "App Store मा उपलब्ध छ" : "Download on the"}
                        </div>
                        <div className="text-xl font-bold">App Store</div>
                      </div>
                    </a>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
                    {stats.map((stat, index) => (
                      <div key={index} className="text-center">
                        <div className="text-2xl font-bold text-primary">{stat.value}</div>
                        <div className="text-sm text-muted-foreground">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right - Phone Mockup */}
                <div className="relative">
                  <div className="relative mx-auto max-w-md">
                    {/* Phone Frame */}
                    <div className="relative bg-gradient-to-b from-gray-900 to-black rounded-[3rem] p-6 shadow-2xl">
                      {/* Notch */}
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-10"></div>
                      
                      {/* Screen Content */}
                      <div className="relative bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl overflow-hidden h-[500px]">
                        {/* App screenshots carousel could go here */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center p-8">
                            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-6">
                              <Phone className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">
                              {locale === "ne" ? "Door Steps Nepal" : "Door Steps Nepal"}
                            </h3>
                            <p className="text-muted-foreground mb-6">
                              {locale === "ne" 
                                ? "घरको सबै आवश्यकता एकै ठाउँमा"
                                : "All home needs in one place"}
                            </p>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
                              <QrCode className="h-4 w-4" />
                              <span className="text-sm">
                                {locale === "ne" ? "QR स्क्यान गर्नुहोस्" : "Scan QR Code"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Home Button */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gray-800 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">
                  {locale === "ne" ? "एपका विशेषताहरू" : "App Features"}
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  {locale === "ne" 
                    ? "हाम्रो मोबाइल एपका विशेषताहरू जसले तपाईंको सेवा अनुभवलाई उत्कृष्ट बनाउँछ"
                    : "Features that make your service experience exceptional"}
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentFeatures.map((feature, index) => (
                  <Card key={index} className="hover:shadow-lg transition-all hover:-translate-y-1">
                    <CardContent className="p-6">
                      <div className="p-3 rounded-xl bg-primary/10 w-fit mb-4">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Screenshots Gallery */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">
                  {locale === "ne" ? "एप स्क्रिनसटहरू" : "App Screenshots"}
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  {locale === "ne" 
                    ? "हाम्रो एपको अद्वितीय डिजाइन र कार्यक्षमता हेर्नुहोस्"
                    : "See our app's unique design and functionality"}
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {screenshots.map((screenshot) => (
                  <Card key={screenshot.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300">
                    <div className="aspect-[9/16] bg-gradient-to-b from-primary/5 to-secondary/5 flex items-center justify-center p-8">
                      {/* Mock phone for screenshot */}
                      <div className="relative w-full h-full bg-gradient-to-b from-gray-900 to-black rounded-3xl p-4">
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-2 bg-gray-800 rounded-b-lg"></div>
                        <div className="h-full bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center">
                          <div className="text-center p-4">
                            <div className="text-lg font-semibold mb-2">{screenshot.title}</div>
                            <div className="text-sm text-muted-foreground">{screenshot.description}</div>
                          </div>
                        </div>
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gray-800 rounded-full"></div>
                      </div>
                    </div>
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg">{screenshot.title}</CardTitle>
                      <CardDescription>{screenshot.description}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Download Instructions */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">


              {/* QR Code Section */}
              <div className="mt-16">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-3">
                    {locale === "ne" ? "QR कोड स्क्यान गर्नुहोस्" : "Scan QR Code"}
                  </h3>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    {locale === "ne" 
                      ? "आफ्नो फोनको लागि उपयुक्त QR कोड स्क्यान गर्नुहोस्"
                      : "Scan the appropriate QR code for your phone"}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  {/* Android QR Code */}
                  <Card>
                    <CardContent className="p-8">
                      <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 mb-6 flex items-center justify-center">
                        {/* Android QR Code Image */}
                        <div className="relative w-48 h-48 bg-white p-4 rounded-lg shadow-sm">
                          <Image
                            src="/qr-codes/android-qr.png" // Path to your Android QR code image
                            alt="Android QR Code"
                            width={192}
                            height={192}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-center gap-3 mb-4">
                        <PhoneIcon className="h-6 w-6 text-green-600" />
                        <h4 className="text-xl font-bold">
                          {locale === "ne" ? "Android को लागि" : "For Android"}
                        </h4>
                      </div>
                      <p className="text-muted-foreground mb-6 text-center">
                        {locale === "ne" 
                          ? "Android फोनको क्यामेरा प्रयोग गर्नुहोस्"
                          : "Use Android phone camera"}
                      </p>
                      <a 
                        href={downloadLinks.android}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 text-sm text-green-600 hover:text-green-700 dark:text-green-400 w-full py-2 border border-green-200 dark:border-green-800 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                      >
                        {locale === "ne" ? "लिङ्क खोल्नुहोस्" : "Open link directly"}
                        <ArrowRight className="h-3 w-3" />
                      </a>
                    </CardContent>
                  </Card>

                  {/* iOS QR Code */}
                  <Card>
                    <CardContent className="p-8">
                      <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 mb-6 flex items-center justify-center">
                        {/* iOS QR Code Image */}
                        <div className="relative w-48 h-48 bg-white p-4 rounded-lg shadow-sm">
                          <Image
                            src="/qr-codes/ios-qr.png" // Path to your iOS QR code image
                            alt="iOS QR Code"
                            width={192}
                            height={192}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-center gap-3 mb-4">
                        <Apple className="h-6 w-6 text-blue-600" />
                        <h4 className="text-xl font-bold">
                          {locale === "ne" ? "iOS को लागि" : "For iOS"}
                        </h4>
                      </div>
                      <p className="text-muted-foreground mb-6 text-center">
                        {locale === "ne" 
                          ? "iPhone को क्यामेरा प्रयोग गर्नुहोस्"
                          : "Use iPhone camera"}
                      </p>
                      <a 
                        href={downloadLinks.ios}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 w-full py-2 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                      >
                        {locale === "ne" ? "लिङ्क खोल्नुहोस्" : "Open link directly"}
                        <ArrowRight className="h-3 w-3" />
                      </a>
                    </CardContent>
                  </Card>
                </div>

                {/* Instructions */}
                <div className="mt-8 text-center max-w-2xl mx-auto">
                  <p className="text-sm text-muted-foreground">
                    {locale === "ne" 
                      ? "सुझाव: आफ्नो फोनको क्यामेरा एप खोलेर QR कोड स्क्यान गर्नुहोस्। स्वतः तपाईंको फोनको लागि उपयुक्त डाउनलोड पेज खुल्नेछ।"
                      : "Tip: Open your phone's camera app and scan the QR code. The appropriate download page will open automatically for your device."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">
                  {locale === "ne" ? "बारम्बार सोधिने प्रश्नहरू" : "Frequently Asked Questions"}
                </h2>
              </div>

              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {locale === "ne" ? "एप डाउनलोड गर्न नि:शुल्क छ?" : "Is the app free to download?"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {locale === "ne" 
                        ? "हो, Door Steps Nepal एप पूर्ण रूपमा नि:शुल्क डाउनलोड गर्न सकिन्छ। सेवा बुक गर्दा मात्र शुल्क लाग्दछ।"
                        : "Yes, the Door Steps Nepal app is completely free to download. Only service bookings incur charges."}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {locale === "ne" ? "के मैले इन्टरनेट कनेक्सन चाहिन्छ?" : "Do I need internet connection?"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {locale === "ne" 
                        ? "एप प्रयोग गर्न र सेवा बुक गर्न इन्टरनेट कनेक्सन आवश्यक छ। तर सेवा विवरणहरू अफलाइन पनि हेर्न सकिन्छ।"
                        : "Internet connection is required to use the app and book services. However, service details can be viewed offline."}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {locale === "ne" ? "कस्ता भुक्तानी विधिहरू स्वीकार गरिन्छ?" : "What payment methods are accepted?"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {locale === "ne" 
                        ? "हामी क्रेडिट/डेबिट कार्ड, डिजिटल वालेटहरू, मोबाइल बैंकिङ, र नगद भुक्तानी स्वीकार गर्छौं।"
                        : "We accept credit/debit cards, digital wallets, mobile banking, and cash payments."}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {locale === "ne" ? "एप अपडेट कति चोटि आउँछ?" : "How often is the app updated?"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {locale === "ne" 
                        ? "हामी नियमित रूपमा नयाँ विशेषताहरू र सुरक्षा अपडेटहरू ल्याउँछौं। महिनामा कम्तिमा एक पटक अपडेट गरिन्छ।"
                        : "We regularly introduce new features and security updates. Updates are released at least once a month."}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="p-8 rounded-3xl bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 border-2 border-primary/20">
                <h2 className="text-3xl font-bold mb-4">
                  {locale === "ne" ? "अहिले नै डाउनलोड गर्नुहोस्" : "Download Now"}
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  {locale === "ne" 
                    ? "आफ्नो घरको सबै आवश्यकता एकै ठाउँमा पाउनुहोस्। Door Steps Nepal एप डाउनलोड गर्नुहोस् र अहिले नै सेवा बुक गर्नुहोस्।"
                    : "Get all your home needs in one place. Download the Door Steps Nepal app and start booking services today."}
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <a 
                    href={downloadLinks.android}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-xl text-lg font-medium transition-all hover:scale-105"
                  >
                    <PhoneIcon className="h-6 w-6" />
                    {locale === "ne" ? "Google Play" : "Google Play"}
                  </a>
                  <a 
                    href={downloadLinks.ios}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-black hover:bg-gray-900 text-white px-8 py-4 rounded-xl text-lg font-medium transition-all hover:scale-105"
                  >
                    <Apple className="h-6 w-6" />
                    {locale === "ne" ? "App Store" : "App Store"}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Back to Top */}
        <div className="container mx-auto px-4 pb-8">
          <div className="text-center">
            <a 
              href="#" 
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowUp className="h-4 w-4" />
              {locale === "ne" ? "माथि जानुहोस्" : "Back to Top"}
            </a>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
}