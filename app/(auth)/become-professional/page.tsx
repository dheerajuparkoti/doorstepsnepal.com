"use client";

import React from "react"

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useI18n } from "@/lib/i18n/context";
import { serviceCategories } from "@/lib/data/services";
import { nepalLocations } from "@/lib/data/nepal-locations";
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  Check,
  Shield,
  Wallet,
  Users,
  Clock,
} from "lucide-react";

const benefits = [
  {
    icon: Users,
    title: "Access to Customers",
    titleNp: "ग्राहकहरूमा पहुँच",
    description: "Connect with thousands of customers looking for your services",
    descriptionNp: "तपाईंको सेवा खोज्ने हजारौं ग्राहकहरूसँग जोडिनुहोस्",
  },
  {
    icon: Wallet,
    title: "Earn More",
    titleNp: "बढी कमाउनुहोस्",
    description: "Set your own rates and earn competitive income",
    descriptionNp: "आफ्नो दर सेट गर्नुहोस् र प्रतिस्पर्धी आय कमाउनुहोस्",
  },
  {
    icon: Clock,
    title: "Flexible Schedule",
    titleNp: "लचिलो तालिका",
    description: "Work when you want, accept jobs that fit your schedule",
    descriptionNp: "जब चाहानुहुन्छ काम गर्नुहोस्, तपाईंको तालिकामा फिट हुने कामहरू स्वीकार गर्नुहोस्",
  },
  {
    icon: Shield,
    title: "Verified Badge",
    titleNp: "प्रमाणित ब्याज",
    description: "Get verified status to build trust with customers",
    descriptionNp: "ग्राहकहरूसँग विश्वास निर्माण गर्न प्रमाणित स्थिति प्राप्त गर्नुहोस्",
  },
];

export default function BecomeProfessionalPage() {
  const { t, locale } = useI18n();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    province: "",
    district: "",
    category: "",
    experience: "",
    hourlyRate: "",
    bio: "",
    skills: [] as string[],
    agreeTerms: false,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    setStep(4);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      {step === 1 && (
        <div className="bg-primary text-primary-foreground py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              {locale === "ne"
                ? "Doorsteps Nepal मा पेशेवर बन्नुहोस्"
                : "Become a Professional on Doorsteps Nepal"}
            </h1>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              {locale === "ne"
                ? "हजारौं ग्राहकहरूसँग जोडिनुहोस् र आफ्नो सीप प्रयोग गरेर कमाउनुहोस्"
                : "Connect with thousands of customers and earn using your skills"}
            </p>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => setStep(2)}
              className="gap-2"
            >
              {t("startRegistration")}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-12">
        {step === 1 && (
          <>
            {/* Benefits */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-center text-foreground mb-8">
                {locale === "ne" ? "किन हामीसँग जोडिनुहोस्?" : "Why Join Us?"}
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {benefits.map((benefit) => (
                  <Card key={benefit.title}>
                    <CardContent className="p-6 text-center">
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <benefit.icon className="w-7 h-7 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">
                        {locale === "ne" ? benefit.titleNp : benefit.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {locale === "ne"
                          ? benefit.descriptionNp
                          : benefit.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* How it works */}
            <div>
              <h2 className="text-2xl font-bold text-center text-foreground mb-8">
                {locale === "ne" ? "यसले कसरी काम गर्छ" : "How It Works"}
              </h2>
              <div className="max-w-3xl mx-auto">
                <div className="flex flex-col gap-6">
                  {[
                    {
                      step: 1,
                      title: "Register",
                      titleNp: "दर्ता गर्नुहोस्",
                      desc: "Fill out the registration form with your details",
                      descNp: "आफ्नो विवरणहरूसँग दर्ता फारम भर्नुहोस्",
                    },
                    {
                      step: 2,
                      title: "Get Verified",
                      titleNp: "प्रमाणित हुनुहोस्",
                      desc: "Our team will verify your documents and skills",
                      descNp: "हाम्रो टोलीले तपाईंको कागजातहरू र सीपहरू प्रमाणित गर्नेछ",
                    },
                    {
                      step: 3,
                      title: "Start Earning",
                      titleNp: "कमाउन सुरु गर्नुहोस्",
                      desc: "Accept job requests and earn money",
                      descNp: "काम अनुरोधहरू स्वीकार गर्नुहोस् र पैसा कमाउनुहोस्",
                    },
                  ].map((item) => (
                    <div key={item.step} className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                        {item.step}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {locale === "ne" ? item.titleNp : item.title}
                        </h3>
                        <p className="text-muted-foreground">
                          {locale === "ne" ? item.descNp : item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Registration Form */}
        {step > 1 && step < 4 && (
          <div className="max-w-2xl mx-auto">
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setStep(step - 1);
              }}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("back")}
            </Link>

            {/* Progress */}
            <div className="flex items-center justify-center mb-8">
              {[2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      step >= s
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step > s ? <Check className="w-5 h-5" /> : s - 1}
                  </div>
                  {s < 3 && (
                    <div
                      className={`w-16 sm:w-24 h-1 mx-2 ${
                        step > s ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>{t("personalInformation")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">{t("fullName")}</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder={t("enterFullName")}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">{t("phoneNumber")}</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+977 98XXXXXXXX"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">{t("email")}</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="email@example.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">{t("address")}</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder={t("enterAddress")}
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label>{t("province")}</Label>
                      <Select
                        value={formData.province}
                        onValueChange={(value) =>
                          setFormData({ ...formData, province: value })
                        }
                      >
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
                      <Select
                        value={formData.district}
                        onValueChange={(value) =>
                          setFormData({ ...formData, district: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t("selectDistrict")} />
                        </SelectTrigger>
                        <SelectContent>
                          {formData.province &&
                            nepalLocations.provinces
                              .find((p) => p.name === formData.province)
                              ?.districts.map((district) => (
                                <SelectItem
                                  key={district.name}
                                  value={district.name}
                                >
                                  {locale === "ne"
                                    ? district.nameNp
                                    : district.name}
                                </SelectItem>
                              ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>{t("uploadPhoto")}</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center mt-2">
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        {t("uploadProfilePhoto")}
                      </p>
                      <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                        {t("browseFiles")}
                      </Button>
                    </div>
                  </div>

                  <Button className="w-full" onClick={() => setStep(3)}>
                    {t("continue")}
                  </Button>
                </CardContent>
              </Card>
            )}

            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>{t("professionalDetails")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>{t("serviceCategory")}</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData({ ...formData, category: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectCategory")} />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceCategories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.icon} {locale === "ne" ? cat.nameNp : cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="experience">{t("yearsOfExperience")}</Label>
                      <Input
                        id="experience"
                        name="experience"
                        type="number"
                        value={formData.experience}
                        onChange={handleInputChange}
                        placeholder="5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="hourlyRate">{t("hourlyRate")} (NPR)</Label>
                      <Input
                        id="hourlyRate"
                        name="hourlyRate"
                        type="number"
                        value={formData.hourlyRate}
                        onChange={handleInputChange}
                        placeholder="500"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bio">{t("aboutYou")}</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder={t("describeProfessionalExperience")}
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label>{t("uploadDocuments")}</Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      {t("uploadCertificates")}
                    </p>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        {t("citizenshipTrainingCerts")}
                      </p>
                      <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                        {t("browseFiles")}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Checkbox
                      id="terms"
                      checked={formData.agreeTerms}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          agreeTerms: checked as boolean,
                        })
                      }
                    />
                    <label htmlFor="terms" className="text-sm cursor-pointer">
                      {t("agreeTermsConditions")}
                    </label>
                  </div>

                  <Button
                    className="w-full"
                    disabled={!formData.agreeTerms}
                    onClick={handleSubmit}
                  >
                    {t("submitApplication")}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Success */}
        {step === 4 && (
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {locale === "ne"
                ? "आवेदन पेश गरियो!"
                : "Application Submitted!"}
            </h2>
            <p className="text-muted-foreground mb-8">
              {locale === "ne"
                ? "तपाईंको आवेदन समीक्षाको लागि पेश गरिएको छ। हामी २-३ कार्य दिन भित्र तपाईंलाई सम्पर्क गर्नेछौं।"
                : "Your application has been submitted for review. We will contact you within 2-3 business days."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full bg-transparent">
                  {t("backToHome")}
                </Button>
              </Link>
              <Link href="/login" className="flex-1">
                <Button className="w-full">{t("login")}</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
