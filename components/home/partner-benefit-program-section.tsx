"use client";

import { useI18n } from "@/lib/i18n/context";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingDown, 
  Wallet, 
  Shield, 
  Headphones, 
  Megaphone, 
  RefreshCw,
  Info,
  Calculator,
  Sparkles,
  Award,
  CheckCircle,
  ArrowRight,
  TrendingUp
} from "lucide-react";
import type { CommissionSlab } from "@/lib/data/commission-slabs";
import Link from "next/link";

interface PartnerBenefitProgramProps {
  commissionSlabs: CommissionSlab[];
}

export function PartnerBenefitProgramSection({
  commissionSlabs,
}: PartnerBenefitProgramProps) {
  const { language } = useI18n();

  // Progressive commission structure
  const progressiveFees = [
    { service: language === "ne" ? "पहिलो सेवा" : "First Service", fee: "10%", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100" },
    { service: language === "ne" ? "दोस्रो सेवा" : "Second Service", fee: "9%", color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100" },
    { service: language === "ne" ? "तेस्रो सेवा" : "Third Service", fee: "8%", color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100" },
    { service: language === "ne" ? "चौथो सेवा" : "Fourth Service", fee: "7%", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100" },
    { service: language === "ne" ? "पाँचौं सेवा" : "Fifth Service", fee: "6%", color: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-100" },
    { service: language === "ne" ? "पछिल्ला सेवाहरू" : "Subsequent Services", fee: "5%", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" },
  ];

  // Platform usage benefits
  const usageBenefits = [
    {
      icon: Shield,
      title: language === "ne" ? "सुरक्षित भुक्तानी" : "Secure Payment",
      description: language === "ne" ? "सुरक्षित लेनदेन र धोखाधडी संरक्षण" : "Secure transactions and fraud protection"
    },
    {
      icon: Headphones,
      title: language === "ne" ? "ग्राहक सहयोग" : "Customer Support",
      description: language === "ne" ? "२४/७ ग्राहक सेवा र समस्या समाधान" : "24/7 customer service and issue resolution"
    },
    {
      icon: Megaphone,
      title: language === "ne" ? "विपणन अधिग्रहण" : "Marketing Acquisition",
      description: language === "ne" ? "व्यापक विपणन र ग्राहक अधिग्रहण" : "Extensive marketing and customer acquisition"
    },
    {
      icon: RefreshCw,
      title: language === "ne" ? "प्लेटफर्म मर्मतसम्भार" : "Platform Maintenance",
      description: language === "ne" ? "निरन्तर अपडेट र प्रणाली मर्मतसम्भार" : "Continuous updates and system maintenance"
    }
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 mb-4">
            <Award className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              {language === "ne" ? "भागीदार लाभ कार्यक्रम" : "Partner Benefit Program"}
            </span>
          </div>
          
          <h2 className="text-3xl font-bold md:text-4xl mb-4">
            {language === "ne" ? "आफ्नो आय बढाउनुहोस्" : "Maximize Your Earnings"}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {language === "ne" 
              ? "हाम्रो प्रगतिशील कमिसन प्रणाली सँगै आफ्नो सेवाहरू बढाउनुहोस् र अधिक आर्जन गर्नुहोस्"
              : "Scale your services with our progressive commission system and earn more"}
          </p>
        </div>

        {/* Main Program Card */}
        <Card className="mb-12 overflow-hidden border-primary/20">
          <div className="bg-gradient-to-br from-primary to-primary/80 p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {language === "ne" ? "भागीदार लाभ कार्यक्रम" : "Partner Benefit Program"}
                </h3>
                <p className="text-white/90 mb-4">
                  {language === "ne" 
                    ? "दैनिक रिसेट हुने प्रगतिशील कमिसन प्रणाली। अधिक सेवाहरू प्रदान गर्नुहोस्, कम कमिसन तिर्नुहोस्।"
                    : "Daily reset progressive commission system. Provide more services, pay less commission."}
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-white" />
                    <span className="text-sm text-white/90">
                      {language === "ne" ? "दैनिक रिसेट" : "Daily Reset"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-white" />
                    <span className="text-sm text-white/90">
                      {language === "ne" ? "न्यूनतम शुल्क" : "Minimum Fees"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-white" />
                    <span className="text-sm text-white/90">
                      {language === "ne" ? "उच्च कमाई" : "Higher Earnings"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Progressive Commission Table - First Row */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <TrendingDown className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">
              {language === "ne" ? "दैनिक प्रगतिशील शुल्क" : "Daily Progressive Fees"}
            </h3>
          </div>

          <Card className="overflow-hidden mb-12">
            <div className="bg-primary/5 p-4 border-b">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-primary">
                  {language === "ne" ? "सेवा संख्या" : "Service Count"}
                </span>
                <span className="font-semibold text-primary">
                  {language === "ne" ? "प्लेटफर्म शुल्क" : "Platform Fee"}
                </span>
              </div>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x">
              {progressiveFees.map((item, index) => (
                <div key={index} className="p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${item.color}`}>
                        {index + 1}
                      </div>
                      <span className="font-medium text-center sm:text-left flex-1">{item.service}</span>
                    </div>
                    <Badge variant="secondary" className={`${item.color} whitespace-nowrap`}>
                      {item.fee}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-muted/30 p-4 border-t">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Info className="h-4 w-4" />
                <span>
                  {language === "ne" 
                    ? "मध्यरातमा रिसेट हुन्छ - प्रत्येक दिन नयाँ सुरुवात"
                    : "Resets at midnight - fresh start every day"}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Fixed Commission Slabs - Second Row */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <Wallet className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">
              {language === "ne" ? "मानक शुल्क तहहरू" : "Standard Fee Slabs"}
            </h3>
          </div>

          <Card className="overflow-hidden">
            <div className="bg-primary/5 p-4 border-b">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-primary">
                  {language === "ne" ? "सेवा मूल्य दायरा" : "Service Value Range"}
                </span>
                <span className="font-semibold text-primary">
                  {language === "ne" ? "निश्चित प्लेटफर्म शुल्क" : "Fixed Platform Fee"}
                </span>
              </div>
            </div>
            
            <div className="divide-y">
              {commissionSlabs.map((slab) => (
                <div key={slab.id} className="p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <span className="font-semibold text-lg">
                          Rs. {slab.min_price.toLocaleString()} - Rs. {slab.max_price.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {language === "ne" 
                          ? `रु. ${slab.min_price.toLocaleString()} देखि रु. ${slab.max_price.toLocaleString()} सम्म`
                          : `From Rs. ${slab.min_price.toLocaleString()} to Rs. ${slab.max_price.toLocaleString()}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-xl text-primary">
                        Rs. {slab.max_commission.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {language === "ne" ? "अधिकतम शुल्क" : "Maximum Fee"}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-muted/30 p-4 border-t">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calculator className="h-4 w-4" />
                <span>
                  {language === "ne" 
                    ? "प्रत्येक तहको लागि अधिकतम शुल्क - अधिक मूल्य, न्यूनतम शुल्क"
                    : "Maximum fee per slab - Higher value, lower percentage fee"}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Platform Usage Benefits */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-3">
              {language === "ne" ? "हामी तपाईंको शुल्क प्रयोग गर्दछौं" : "How We Use Your Fees"}
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {language === "ne" 
                ? "तपाईंको प्लेटफर्म शुल्कले सुरक्षा, सहयोग, र विकासमा योगदान पुर्याउँछ"
                : "Your platform fees contribute to security, support, and growth"}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {usageBenefits.map((benefit, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-bold text-lg mb-2">{benefit.title}</h4>
                  <p className="text-muted-foreground text-sm">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">
              {language === "ne" ? "आज नै भागीदार बन्नुहोस्" : "Become a Partner Today"}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              {language === "ne" 
                ? "हाम्रो प्रगतिशील कमिसन प्रणाली सँग जोडिनुहोस् र आफ्नो कमाई बढाउनुहोस्। कम सेवाहरूमा उच्च कमाई, धेरै सेवाहरूमा कम शुल्क।"
                : "Join our progressive commission system and maximize your earnings. Higher earnings on fewer services, lower fees on more services."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/login" 
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
              >
                {language === "ne" ? "पेशेवर बन्नुहोस्" : "Become a Professional"}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link 
                href="https://www.doorstepsnepal.com/privacy_policy/professionals"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-input bg-background font-medium rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                {language === "ne" ? "अधिक जान्नुहोस्" : "Learn More"}
                <Info className="h-4 w-4" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}