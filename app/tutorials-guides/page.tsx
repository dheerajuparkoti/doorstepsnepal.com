"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Video,
  Users,
  Briefcase,
  Home,
  UserCheck,
  Wrench,
  Clock,
  Star,
  Bell,
  Mail,
  ChevronRight,
  Sparkles,
  Calendar,
  MessageCircle,
  ThumbsUp,
  AlertCircle,
  FileText,
  Shield,
  Eye,
  BookOpen,
  Smartphone,
  Zap,
  TrendingUp,
  Award,
  Target,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useI18n } from '@/lib/i18n/context';
import Link from "next/link";

export default function TutorialsGuidesPage() {
  const { locale } = useI18n();
  const [email, setEmail] = useState("");
  const [isNotified, setIsNotified] = useState(false);
  const [activeMode, setActiveMode] = useState<"customer" | "professional">("customer");

  const handleNotify = () => {
    if (email) {
      setIsNotified(true);
      setTimeout(() => setIsNotified(false), 3000);
      setEmail("");
    }
  };

  // Bilingual content
  const content = {
    en: {
      hero: {
        title: "Tutorials & Guides",
        subtitle: "Master Doorsteps Nepal with our comprehensive video tutorials and step-by-step guides",
        lastUpdated: "Coming Soon",
        version: "First Edition"
      },
      modeSelector: {
        customer: "Customer Mode",
        professional: "Professional Mode"
      },
      customerTutorials: {
        title: "Customer Tutorials",
        subtitle: "Learn how to book and manage home services",
        videos: [
          { title: "How to Book Your First Service", description: "Step-by-step guide to booking home services", duration: "5:30", icon: Calendar },
          { title: "Tracking Your Service Request", description: "Real-time updates and communication with professionals", duration: "3:45", icon: MessageCircle },
          { title: "Payment & Billing Guide", description: "Secure payment methods and understanding your bill", duration: "4:20", icon: ThumbsUp },
          { title: "Review & Rating System", description: "How to leave feedback for professionals", duration: "2:50", icon: Star },
        ]
      },
      professionalTutorials: {
        title: "Professional Tutorials",
        subtitle: "Grow your business with Doorsteps Nepal",
        videos: [
          { title: "Setting Up Your Professional Profile", description: "Complete your profile to attract more customers", duration: "6:15", icon: UserCheck },
          { title: "Managing Service Requests", description: "Accept, schedule, and complete jobs efficiently", duration: "5:45", icon: Briefcase },
          { title: "Earnings & Withdrawals", description: "Track your earnings and withdraw funds", duration: "4:30", icon: Wrench },
          { title: "Building Your Reputation", description: "Tips to get 5-star ratings and repeat customers", duration: "7:20", icon: Star },
        ]
      },
      comingSoon: {
        title: "Coming Soon Guides",
        guides: [
          { title: "Emergency Service Guide", description: "How to handle urgent home service needs", mode: "Both Modes", icon: AlertCircle },
          { title: "Subscription Plans Explained", description: "Regular maintenance and annual packages", mode: "Customer Mode", icon: TrendingUp },
          { title: "Professional Certification Guide", description: "How to get verified and certified", mode: "Professional Mode", icon: Award },
          { title: "Multi-Location Booking", description: "Managing services for different properties", mode: "Customer Mode", icon: Target },
        ]
      },
      interactiveGuides: {
        title: "Interactive Guides with Screenshots",
        subtitle: "Visual step-by-step guides coming soon with detailed screenshots",
        customer: {
          title: "Customer Mode Guide",
          steps: [
            "Sign up / Login to your account",
            "Browse available home services",
            "Select service and schedule time",
            "Choose professional based on ratings",
            "Make secure payment",
            "Track service in real-time",
            "Rate and review after completion"
          ]
        },
        professional: {
          title: "Professional Mode Guide",
          steps: [
            "Complete your professional profile",
            "Get verified and background checked",
            "Set your service areas and pricing",
            "Receive and accept service requests",
            "Communicate with customers",
            "Complete service and get paid",
            "Build ratings and earn badges"
          ]
        }
      },
      notification: {
        title: "Get Notified When Tutorials Launch",
        subtitle: "Be the first to access our video tutorials and guides",
        button: "Notify Me",
        placeholder: "Enter your email",
        success: "You're on the list!",
        successDetail: "We'll notify you when tutorials are ready"
      },
      tableOfContents: [
        { num: "1", title: "Video Tutorials", icon: Video },
        { num: "2", title: "Coming Soon Guides", icon: Sparkles },
        { num: "3", title: "Interactive Guides", icon: Smartphone },
        { num: "4", title: "Get Notified", icon: Bell },
      ],
      footer: {
        title: "Need Help?",
        subtitle: "Contact our support team for personalized assistance",
        button: "Contact Support"
      },
      backToTop: "Back to Top"
    },
    ne: {
      hero: {
        title: "ट्यूटोरियल र गाइडहरू",
        subtitle: "हाम्रो व्यापक भिडियो ट्यूटोरियल र चरण-दर-चरण गाइडहरूको साथ डोरस्टेप्स नेपाल मास्टर गर्नुहोस्",
        lastUpdated: "छिट्टै आउँदै",
        version: "पहिलो संस्करण"
      },
      modeSelector: {
        customer: "ग्राहक मोड",
        professional: "प्रोफेशनल मोड"
      },
      customerTutorials: {
        title: "ग्राहक ट्यूटोरियल",
        subtitle: "घर सेवाहरू बुक गर्न र व्यवस्थापन गर्न सिक्नुहोस्",
        videos: [
          { title: "तपाईंको पहिलो सेवा कसरी बुक गर्ने", description: "घर सेवाहरू बुक गर्न चरण-दर-चरण गाइड", duration: "५:३०", icon: Calendar },
          { title: "तपाईंको सेवा अनुरोध ट्र्याक गर्दै", description: "प्रोफेशनलहरूसँग वास्तविक-समय अद्यावधिक र सञ्चार", duration: "३:४५", icon: MessageCircle },
          { title: "भुक्तानी र बिलिङ गाइड", description: "सुरक्षित भुक्तानी विधिहरू र तपाईंको बिल बुझ्दै", duration: "४:२०", icon: ThumbsUp },
          { title: "समीक्षा र मूल्याङ्कन प्रणाली", description: "प्रोफेशनलहरूको लागि प्रतिक्रिया कसरी छोड्ने", duration: "२:५०", icon: Star },
        ]
      },
      professionalTutorials: {
        title: "प्रोफेशनल ट्यूटोरियल",
        subtitle: "डोरस्टेप्स नेपालसँग आफ्नो व्यवसाय बढाउनुहोस्",
        videos: [
          { title: "तपाईंको प्रोफेशनल प्रोफाइल सेट अप गर्दै", description: "अधिक ग्राहकहरूलाई आकर्षित गर्न आफ्नो प्रोफाइल पूरा गर्नुहोस्", duration: "६:१५", icon: UserCheck },
          { title: "सेवा अनुरोधहरू व्यवस्थापन गर्दै", description: "कुशलतापूर्वक जागिरहरू स्वीकार गर्नुहोस्, तालिका बनाउनुहोस् र पूरा गर्नुहोस्", duration: "५:४५", icon: Briefcase },
          { title: "कमाई र निकासी", description: "आफ्नो कमाई ट्र्याक गर्नुहोस् र रकम निकाल्नुहोस्", duration: "४:३०", icon: Wrench },
          { title: "तपाईंको प्रतिष्ठा निर्माण गर्दै", description: "५-स्टार रेटिङ र दोहोरिने ग्राहकहरू प्राप्त गर्न सुझावहरू", duration: "७:२०", icon: Star },
        ]
      },
      comingSoon: {
        title: "छिट्टै आउँदै गाइडहरू",
        guides: [
          { title: "आपातकालीन सेवा गाइड", description: "अत्यावश्यक घर सेवा आवश्यकताहरू कसरी ह्यान्डल गर्ने", mode: "दुवै मोड", icon: AlertCircle },
          { title: "सब्सक्रिप्सन योजनाहरू व्याख्या गरियो", description: "नियमित मर्मत र वार्षिक प्याकेजहरू", mode: "ग्राहक मोड", icon: TrendingUp },
          { title: "प्रोफेशनल प्रमाणीकरण गाइड", description: "कसरी प्रमाणित र प्रमाणित हुने", mode: "प्रोफेशनल मोड", icon: Award },
          { title: "बहु-स्थान बुकिंग", description: "विभिन्न सम्पत्तिहरूको लागि सेवाहरू व्यवस्थापन गर्दै", mode: "ग्राहक मोड", icon: Target },
        ]
      },
      interactiveGuides: {
        title: "स्क्रिनसटहरू सहित अन्तरक्रियात्मक गाइडहरू",
        subtitle: "विस्तृत स्क्रिनसटहरू सहित चरण-दर-चरण गाइडहरू छिट्टै आउँदै",
        customer: {
          title: "ग्राहक मोड गाइड",
          steps: [
            "साइन अप / लगइन गर्नुहोस्",
            "उपलब्ध घर सेवाहरू ब्राउज गर्नुहोस्",
            "सेवा चयन गर्नुहोस् र समय तालिका बनाउनुहोस्",
            "मूल्याङ्कनको आधारमा प्रोफेशनल छान्नुहोस्",
            "सुरक्षित भुक्तानी गर्नुहोस्",
            "वास्तविक-समयमा सेवा ट्र्याक गर्नुहोस्",
            "पूरा भएपछि मूल्याङ्कन र समीक्षा गर्नुहोस्"
          ]
        },
        professional: {
          title: "प्रोफेशनल मोड गाइड",
          steps: [
            "आफ्नो प्रोफेशनल प्रोफाइल पूरा गर्नुहोस्",
            "प्रमाणित र पृष्ठभूमि जाँच गर्नुहोस्",
            "आफ्नो सेवा क्षेत्रहरू र मूल्य निर्धारण सेट गर्नुहोस्",
            "सेवा अनुरोधहरू प्राप्त र स्वीकार गर्नुहोस्",
            "ग्राहकहरूसँग सञ्चार गर्नुहोस्",
            "सेवा पूरा गर्नुहोस् र भुक्तानी प्राप्त गर्नुहोस्",
            "मूल्याङ्कन निर्माण गर्नुहोस् र ब्याज कमाउनुहोस्"
          ]
        }
      },
      notification: {
        title: "ट्यूटोरियल लन्च हुँदा सूचित हुनुहोस्",
        subtitle: "हाम्रो भिडियो ट्यूटोरियल र गाइडहरू पहिलो पहुँच गर्नुहोस्",
        button: "मलाई सूचित गर्नुहोस्",
        placeholder: "तपाईंको इमेल प्रविष्ट गर्नुहोस्",
        success: "तपाईं सूचीमा हुनुहुन्छ!",
        successDetail: "ट्यूटोरियल तयार हुँदा हामी तपाईंलाई सूचित गर्नेछौं"
      },
      tableOfContents: [
        { num: "१", title: "भिडियो ट्यूटोरियल", icon: Video },
        { num: "२", title: "छिट्टै आउँदै गाइडहरू", icon: Sparkles },
        { num: "३", title: "अन्तरक्रियात्मक गाइडहरू", icon: Smartphone },
        { num: "४", title: "सूचित हुनुहोस्", icon: Bell },
      ],
      footer: {
        title: "मद्दत चाहिन्छ?",
        subtitle: "व्यक्तिगत सहायताको लागि हाम्रो समर्थन टोलीलाई सम्पर्क गर्नुहोस्",
        button: "समर्थनलाई सम्पर्क गर्नुहोस्"
      },
      backToTop: "माथि जानुहोस्"
    }
  };

  const current = locale === 'ne' ? content.ne : content.en;
  const tutorials = activeMode === "customer" ? current.customerTutorials.videos : current.professionalTutorials.videos;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        {/* Hero Section */}
        <section className="py-12 md:py-12 bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-6">
                <Video className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
                {current.hero.title}
              </h1>
              <p className="text-xl text-muted-foreground">
                {current.hero.subtitle}
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{current.hero.lastUpdated}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{current.hero.version}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-0">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            {/* <div className="max-w-6xl mx-auto"> */}
            <div className="px-4 md:px-8 lg:px-12">
              {/* Mode Selector Card */}
              <Card className="mb-8 border-primary/20 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <Users className="h-6 w-6 text-primary" />
                    {locale === "en" ? "Choose Your Mode" : "आफ्नो मोड छान्नुहोस्"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => setActiveMode("customer")}
                      className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
                        activeMode === "customer"
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "bg-muted hover:bg-muted/80"
                      }`}
                    >
                      <Home className="w-5 h-5" />
                      {current.modeSelector.customer}
                    </button>
                    <button
                      onClick={() => setActiveMode("professional")}
                      className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
                        activeMode === "professional"
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "bg-muted hover:bg-muted/80"
                      }`}
                    >
                      <Briefcase className="w-5 h-5" />
                      {current.modeSelector.professional}
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Table of Contents */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <FileText className="h-6 w-6 text-primary" />
                  {locale === "en" ? "What You'll Learn" : "तपाईं के सिक्नुहुनेछ"}
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {current.tableOfContents.map((item) => (
                    <Link 
                      key={item.num} 
                      href={`#section-${item.num}`}
                      className="group flex items-center gap-4 p-4 rounded-lg border hover:border-primary hover:bg-primary/5 transition-all"
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 group-hover:bg-primary/20">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-primary font-medium">
                          {locale === "en" ? `Section ${item.num}` : `भाग ${item.num}`}
                        </div>
                        <div className="font-medium group-hover:text-primary">{item.title}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <Separator className="my-12" />

              {/* Section 1 - Video Tutorials */}
              <section id="section-1" className="scroll-mt-24 mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                    <span className="font-bold text-primary">1</span>
                  </div>
                  <h2 className="text-2xl font-bold">
                    {activeMode === "customer" ? current.customerTutorials.title : current.professionalTutorials.title}
                  </h2>
                </div>
                <p className="text-muted-foreground mb-6">
                  {activeMode === "customer" ? current.customerTutorials.subtitle : current.professionalTutorials.subtitle}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {tutorials.map((tutorial, index) => {
                    const Icon = tutorial.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        whileHover={{ y: -5 }}
                        className="group cursor-pointer"
                      >
                        <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300">
                          <div className="relative h-48 bg-gradient-to-br from-primary/80 to-secondary/80 flex items-center justify-center">
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all" />
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg"
                            >
                              <Play className="w-8 h-8 text-primary ml-1" />
                            </motion.div>
                            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                              {tutorial.duration}
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3 mb-2">
                              <div className="p-2 bg-primary/10 rounded-lg">
                                <Icon className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <h3 className="font-semibold">{tutorial.title}</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {tutorial.description}
                                </p>
                              </div>
                            </div>
                            <div className="mt-3 pt-3 border-t flex items-center justify-between">
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {locale === "en" ? "Coming Soon" : "छिट्टै आउँदै"}
                              </span>
                              <motion.div
                                whileHover={{ x: 5 }}
                                className="text-primary text-sm font-medium flex items-center gap-1"
                              >
                                {locale === "en" ? "Get Notified" : "सूचित हुनुहोस्"}
                                <ChevronRight className="w-4 h-4" />
                              </motion.div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </section>

              {/* Section 2 - Coming Soon Guides */}
              <section id="section-2" className="scroll-mt-24 mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                    <span className="font-bold text-primary">2</span>
                  </div>
                  <h2 className="text-2xl font-bold">{current.comingSoon.title}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {current.comingSoon.guides.map((guide, index) => {
                    const Icon = guide.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <Card className="h-full">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="p-2 bg-primary/10 rounded-lg">
                                <Icon className="w-5 h-5 text-primary" />
                              </div>
                              <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                                {guide.mode}
                              </span>
                            </div>
                            <h3 className="font-semibold mb-1">{guide.title}</h3>
                            <p className="text-sm text-muted-foreground">{guide.description}</p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </section>

              {/* Section 3 - Interactive Guides */}
              <section id="section-3" className="scroll-mt-24 mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                    <span className="font-bold text-primary">3</span>
                  </div>
                  <h2 className="text-2xl font-bold">{current.interactiveGuides.title}</h2>
                </div>
                <p className="text-muted-foreground mb-6 text-center">
                  {current.interactiveGuides.subtitle}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Customer Mode Guide */}
                  <Card className="overflow-hidden">
                    <div className="bg-gradient-to-r from-primary to-primary/80 p-4">
                      <div className="flex items-center gap-2 text-primary-foreground">
                        <Home className="w-5 h-5" />
                        <h3 className="font-semibold">{current.interactiveGuides.customer.title}</h3>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {current.interactiveGuides.customer.steps.map((step, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * idx }}
                            className="flex items-center gap-3"
                          >
                            <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-primary text-sm font-bold">
                              {idx + 1}
                            </div>
                            <span className="text-muted-foreground">{step}</span>
                          </motion.div>
                        ))}
                      </div>
                      <div className="mt-6 pt-4 border-t">
                        <div className="bg-primary/5 rounded-lg p-3 flex items-center gap-2 text-sm text-primary">
                          <Camera className="w-4 h-4" />
                          <span>{locale === "en" ? "Screenshots and video demo coming in next update" : "स्क्रिनसटहरू र भिडियो डेमो अर्को अपडेटमा आउँदै"}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Professional Mode Guide */}
                  <Card className="overflow-hidden">
                    <div className="bg-gradient-to-r from-secondary to-secondary/80 p-4">
                      <div className="flex items-center gap-2 text-secondary-foreground">
                        <Briefcase className="w-5 h-5" />
                        <h3 className="font-semibold">{current.interactiveGuides.professional.title}</h3>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {current.interactiveGuides.professional.steps.map((step, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * idx }}
                            className="flex items-center gap-3"
                          >
                            <div className="w-6 h-6 bg-secondary/10 rounded-full flex items-center justify-center text-secondary text-sm font-bold">
                              {idx + 1}
                            </div>
                            <span className="text-muted-foreground">{step}</span>
                          </motion.div>
                        ))}
                      </div>
                      <div className="mt-6 pt-4 border-t">
                        <div className="bg-secondary/5 rounded-lg p-3 flex items-center gap-2 text-sm text-secondary">
                          <Camera className="w-4 h-4" />
                          <span>{locale === "en" ? "Screenshots and video demo coming in next update" : "स्क्रिनसटहरू र भिडियो डेमो अर्को अपडेटमा आउँदै"}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </section>

              {/* Section 4 - Notification Banner */}
              <section id="section-4" className="scroll-mt-24 mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                    <span className="font-bold text-primary">4</span>
                  </div>
                  <h2 className="text-2xl font-bold">{locale === "en" ? "Stay Updated" : "अद्यावधिक रहनुहोस्"}</h2>
                </div>
                <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
                  <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                          <Bell className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">{current.notification.title}</h3>
                          <p className="text-muted-foreground">
                            {current.notification.subtitle}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder={current.notification.placeholder}
                          className="px-4 py-2 rounded-lg border bg-background w-64 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={handleNotify}
                          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-shadow flex items-center gap-2"
                        >
                          <Mail className="w-4 h-4" />
                          {current.notification.button}
                        </motion.button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Footer Note */}
              <div className="mt-12 p-6 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-lg mb-1">{current.footer.title}</h3>
                    <p className="text-sm text-muted-foreground">{current.footer.subtitle}</p>
                  </div>
                  <button className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                    <Mail className="h-4 w-4" />
                    {current.footer.button}
                  </button>
                </div>
              </div>

              {/* Back to Top */}
              <div className="mt-8 text-center">
                <a 
                  href="#" 
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <ArrowUp className="h-4 w-4" />
                  {current.backToTop}
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {isNotified && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-8 right-8 bg-green-600 rounded-lg p-4 shadow-xl z-50"
          >
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-white" />
              <div>
                <p className="text-white font-medium">{current.notification.success}</p>
                <p className="text-green-200 text-sm">{current.notification.successDetail}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}

// Helper Components
const Camera = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const ArrowUp = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
  </svg>
);