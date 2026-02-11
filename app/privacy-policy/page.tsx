"use client";

import { Navbar } from "@/components/layout/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Shield, Mail, Lock, Eye, Globe, RefreshCw, Users, Cookie, AlertCircle, FileText, Languages, } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { useI18n } from '@/lib/i18n/context';
import { Footer } from "@/components/layout/footer";

// export const metadata: Metadata = {
//   title: "Privacy Policy | Door Steps Nepal",
//   description: "Privacy Policy for Door Steps Nepal - Learn how we collect, use, and protect your personal data.",
// };

export default function PrivacyPolicyPage() {
  const { locale } = useI18n();
  
 
  // Bilingual content
  const content = {
    en: {
      hero: {
        title: "Privacy Policy",
        subtitle: "Door Steps Nepal's commitment to protecting your personal information",
        lastUpdated: "Last Updated: December 2023",
        version: "Version 2.0"
      },
      introduction: {
        title: "Welcome to Door Steps Nepal's Privacy Policy",
        description: `Door Steps Nepal and its affiliates ("Door Steps Nepal," "we," or "us") are dedicated to connecting customers with service professionals through our web-based solutions. This Policy outlines how we collect, use, store, and disclose your personal data when you access or use our website or mobile application (collectively, "Platform"), and when you use our products and services (collectively, "Services"). Services offered by service professionals through the Platform are referred to as "Professional Services."`,
        note: "Note: By using our Platform, you agree to the collection and use of information in accordance with this Privacy Policy."
      },
      sections: {
        "1": {
          title: "Information We Collect",
          description: "We collect various types of personal data to provide you with a smooth and personalized experience. This information includes:",
          points: [
            { title: "Contact Data", desc: "Mailing addresses, email addresses, phone numbers, and location information" },
            { title: "Identity & Profile Data", desc: "Names, usernames, photographs, gender, and profile information" },
            { title: "Technical Data", desc: "IP addresses, browser types, device information, and operating system details" },
            { title: "Transaction Data", desc: "Details about services requested, payments made, and service history" },
            { title: "Usage Data", desc: "Information about how you use our Platform and services" },
            { title: "Marketing Data", desc: "Your preferences in receiving marketing from us and your communication preferences" }
          ]
        },
        "2": {
          title: "How We Collect Your Data",
          description: "",
          methods: [
            { title: "Direct Interactions", icon: Users, desc: "When you create an account, request services, contact our support, or subscribe to our newsletter" },
            { title: "Automated Technologies", icon: Eye, desc: "Cookies, web beacons, and similar technologies that track usage patterns and improve your experience" },
            { title: "Third Parties", icon: Globe, desc: "Analytics providers, service professionals, advertising networks, and publicly available sources" }
          ]
        },
        "3": {
          title: "Use of Your Personal Data",
          description: "We use your personal data for the following purposes:",
          purposes: [
            "To fulfill and manage your service requests",
            "To provide and improve Professional Services",
            "To personalize your experience on our Platform",
            "To send marketing materials and updates",
            "To communicate important service information",
            "For legal compliance and protection of rights",
            "To prevent fraud and ensure security",
            "To analyze and improve our services"
          ]
        },
        "4": {
          title: "Sharing Your Personal Data",
          description: "Your personal data may be shared with:",
          shares: [
            { title: "Service Professionals", desc: "To deliver the Professional Services you request through our Platform" },
            { title: "Internal & External Third Parties", desc: "Including hosting providers, marketing partners, analytics services, and payment processors" },
            { title: "Legal Authorities", desc: "When required by law, regulation, or legal process to protect our rights and comply with obligations" }
          ]
        },
        "5": {
          title: "Cookies and Tracking Technologies",
          description: "We use cookies and similar technologies to enhance your experience on our Platform:",
          cookies: [
            { name: "Essential Cookies", desc: "Required for basic functionality" },
            { name: "Analytics Cookies", desc: "Track website usage and performance" },
            { name: "Marketing Cookies", desc: "Personalize advertising content" }
          ],
          note: "Note: You can control cookie preferences through your browser settings. Disabling cookies may affect your experience on our Platform."
        },
        "6": {
          title: "Data Security",
          description: "",
          security: [
            { title: "Industry-Standard Protection", icon: Lock, desc: "We implement robust security measures including encryption, firewalls, and secure servers to protect your personal data from unauthorized access." },
            { title: "Your Responsibilities", icon: AlertCircle, desc: "You are responsible for keeping your account password confidential. Never share your login credentials with anyone. If you suspect any unauthorized access to your account, please notify us immediately at security@doorstepsnepal.com." }
          ]
        },
        "7": {
          title: "Your Rights",
          rights: [
            {
              title: "Access & Correction",
              icon: Shield,
              description: "You have the right to access and correct your personal data at any time by:",
              points: [
                "Contacting us at privacy@doorstepsnepal.com",
                "Using your account settings on our Platform",
                "Requesting a copy of your data"
              ]
            },
            {
              title: "Marketing Preferences",
              icon: Mail,
              description: "You can control your marketing preferences:",
              points: [
                "Opt-out using the unsubscribe link in emails",
                "Adjust preferences in your account settings",
                "Contact us directly at privacy@doorstepsnepal.com"
              ]
            }
          ]
        },
        "8": {
          title: "Data Deletion",
          description: "",
          deletion: {
            request: "You may request the deletion of your account and personal data by emailing us at:",
            processing: { title: "Processing Time", desc: "We will process your deletion request within 7 working days of receipt." },
            retention: { title: "Data Retention", desc: "Some data may be retained as required by law, including transaction records for legal compliance." }
          }
        },
        "9": {
          title: "Data Transfers",
          description: "Your data may be transferred to and stored in countries other than where you reside. By using our Platform, you consent to such transfers of your data.",
          note: "International Standards: We ensure that international data transfers comply with applicable data protection laws and implement appropriate safeguards."
        },
        "10": {
          title: "Business Transitions",
          description: "In the event of a merger, acquisition, or other business transition, your personal data may be transferred as part of the assets involved. We will notify you of any such change in ownership or control of your personal data."
        },
        "11": {
          title: "User-Generated Content",
          description: "Any content you post on our Platform (reviews, comments, photos) may be visible to other users. We are not responsible for the misuse of such content by third parties.",
          note: "Important: We encourage you to comply with applicable laws and respect the privacy of others when sharing information on our Platform."
        },
        "12": {
          title: "Policy Updates",
          description: "We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons.",
          changes: [
            "Updates will be posted on this page",
            "Email notifications for significant changes",
            "In-app notifications when applicable"
          ],
          finalNote: "Continued use of our Platform after changes constitutes acceptance of the revised Policy."
        },
        "13": {
          title: "Grievance Officer",
          description: "If you have any questions or concerns about this Privacy Policy or how we handle your data, please contact our Grievance Officer:",
          contact: {
            email: "privacy@doorstepsnepal.com",
            response: "We aim to respond to all inquiries within 48 hours"
          },
          support: [
            { title: "General Support", email: "support@doorstepsnepal.com" },
            { title: "Security Concerns", email: "security@doorstepsnepal.com" }
          ]
        }
      },
      tableOfContents: [
        { num: "1", title: "Information We Collect", icon: Shield },
        { num: "2", title: "How We Collect Your Data", icon: Eye },
        { num: "3", title: "Use of Your Personal Data", icon: RefreshCw },
        { num: "4", title: "Sharing Your Personal Data", icon: Users },
        { num: "5", title: "Cookies & Tracking Technologies", icon: Cookie },
        { num: "6", title: "Data Security", icon: Lock },
        { num: "7", title: "Your Rights", icon: Shield },
        { num: "8", title: "Data Deletion", icon: RefreshCw },
        { num: "9", title: "Data Transfers", icon: Globe },
        { num: "10", title: "Business Transitions", icon: RefreshCw },
        { num: "11", title: "User-Generated Content", icon: Users },
        { num: "12", title: "Policy Updates", icon: AlertCircle },
        { num: "13", title: "Grievance Officer", icon: Mail },
      ],
      footer: {
        title: "Need Help Understanding Our Policy?",
        subtitle: "Contact our privacy team for clarification on any aspect of this policy",
        button: "Contact Privacy Team"
      },
      backToTop: "Back to Top"
    },
    ne: {
      hero: {
        title: "गोपनीयता नीति",
        subtitle: "तपाईंको व्यक्तिगत जानकारी सुरक्षित गर्ने Door Steps Nepal को प्रतिबद्धता",
        lastUpdated: "अन्तिम अद्यावधिक: डिसेम्बर २०२३",
        version: "संस्करण २.०"
      },
      introduction: {
        title: "Door Steps Nepal को गोपनीयता नीतिमा स्वागत छ",
        description: `Door Steps Nepal र यसका सहायक कम्पनीहरू ("Door Steps Nepal," "हामी," वा "हाम्रो") वेब-आधारित समाधानहरू मार्फत ग्राहकहरूलाई सेवा पेशेवरहरूसँग जोड्न समर्पित छौं। यो नीतिले हामीले तपाईंको व्यक्तिगत डाटा कसरी सङ्कलन गर्छौं, प्रयोग गर्छौं, भण्डारण गर्छौं, र खुलाउँछौं भन्ने कुरा रेखाङ्कन गर्दछ जब तपाईंले हाम्रो वेबसाइट वा मोबाइल अनुप्रयोग (सामूहिक रूपमा, "प्लेटफर्म") पहुँच गर्नुहुन्छ वा प्रयोग गर्नुहुन्छ, र जब तपाईंले हाम्रो उत्पादनहरू र सेवाहरू (सामूहिक रूपमा, "सेवाहरू") प्रयोग गर्नुहुन्छ। प्लेटफर्म मार्फत सेवा पेशेवरहरूले प्रदान गर्ने सेवाहरूलाई "पेशेवर सेवाहरू" भनिन्छ।`,
        note: "नोट: हाम्रो प्लेटफर्म प्रयोग गरेर, तपाईं यस गोपनीयता नीति अनुसार जानकारी सङ्कलन र प्रयोग गर्न सहमत हुनुहुन्छ।"
      },
      sections: {
        "1": {
          title: "हामीले सङ्कलन गर्ने जानकारी",
          description: "हामी तपाईंलाई सहज र व्यक्तिगत अनुभव प्रदान गर्न विभिन्न प्रकारका व्यक्तिगत डाटा सङ्कलन गर्छौं। यो जानकारीमा यी समावेश छन्:",
          points: [
            { title: "सम्पर्क डाटा", desc: "डाक ठेगानाहरू, इमेल ठेगानाहरू, फोन नम्बरहरू, र स्थान जानकारी" },
            { title: "पहिचान र प्रोफाइल डाटा", desc: "नामहरू, प्रयोगकर्ता नामहरू, फोटोग्राफहरू, लिङ्ग, र प्रोफाइल जानकारी" },
            { title: "प्राविधिक डाटा", desc: "आइपी ठेगानाहरू, ब्राउजर प्रकारहरू, उपकरण जानकारी, र अपरेटिङ सिस्टम विवरणहरू" },
            { title: "लेनदेन डाटा", desc: "अनुरोध गरिएका सेवाहरूको विवरण, गरिएका भुक्तानीहरू, र सेवा इतिहास" },
            { title: "प्रयोग डाटा", desc: "तपाईंले हाम्रो प्लेटफर्म र सेवाहरू कसरी प्रयोग गर्नुहुन्छ भन्ने जानकारी" },
            { title: "विपणन डाटा", desc: "हामीबाट विपणन प्राप्त गर्ने तपाईंको रुचि र तपाईंको सञ्चार प्राथमिकताहरू" }
          ]
        },
        "2": {
          title: "हामीले तपाईंको डाटा कसरी सङ्कलन गर्छौं",
          description: "",
          methods: [
            { title: "प्रत्यक्ष अन्तरक्रिया", icon: Users, desc: "जब तपाईंले खाता सिर्जना गर्नुहुन्छ, सेवा अनुरोध गर्नुहुन्छ, हाम्रो समर्थनसँग सम्पर्क गर्नुहुन्छ, वा हाम्रो न्यूजलेटर सदस्यता लिनुहुन्छ" },
            { title: "स्वचालित प्रविधिहरू", icon: Eye, desc: "कुकीहरू, वेब बीकनहरू, र समान प्रविधिहरू जसले प्रयोग प्रवृत्तिहरू ट्र्याक गर्दछ र तपाईंको अनुभव सुधार्दछ" },
            { title: "तेस्रो पक्ष", icon: Globe, desc: "विश्लेषण प्रदायकहरू, सेवा पेशेवरहरू, विज्ञापन नेटवर्कहरू, र सार्वजनिक रूपमा उपलब्ध स्रोतहरू" }
          ]
        },
        "3": {
          title: "तपाईंको व्यक्तिगत डाटाको प्रयोग",
          description: "हामी तपाईंको व्यक्तिगत डाटा निम्न उद्देश्यहरूका लागि प्रयोग गर्छौं:",
          purposes: [
            "तपाईंको सेवा अनुरोधहरू पूरा र व्यवस्थापन गर्न",
            "पेशेवर सेवाहरू प्रदान र सुधार गर्न",
            "हाम्रो प्लेटफर्ममा तपाईंको अनुभव व्यक्तिगत बनाउन",
            "विपणन सामग्री र अद्यावधिकहरू पठाउन",
            "महत्वपूर्ण सेवा जानकारी सञ्चार गर्न",
            "कानूनी अनुपालन र अधिकारहरूको संरक्षणको लागि",
            "धोखाधडी रोक्न र सुरक्षा सुनिश्चित गर्न",
            "हाम्रो सेवाहरू विश्लेषण र सुधार गर्न"
          ]
        },
        "4": {
          title: "तपाईंको व्यक्तिगत डाटा साझेदारी",
          description: "तपाईंको व्यक्तिगत डाटा यी संग साझा हुन सक्छ:",
          shares: [
            { title: "सेवा पेशेवरहरू", desc: "तपाईंले हाम्रो प्लेटफर्म मार्फत अनुरोध गर्नुभएका पेशेवर सेवाहरू वितरण गर्न" },
            { title: "आन्तरिक र बाह्य तेस्रो पक्षहरू", desc: "होस्टिंग प्रदायकहरू, विपणन साझेदारहरू, विश्लेषण सेवाहरू, र भुक्तानी प्रक्रियाकर्ताहरू समावेश" },
            { title: "कानूनी प्राधिकरणहरू", desc: "कानून, नियमन, वा कानूनी प्रक्रिया अनुसार आवश्यक हुँदा हाम्रो अधिकारहरू संरक्षण गर्न र दायित्वहरू पालना गर्न" }
          ]
        },
        "5": {
          title: "कुकीहरू र ट्र्याकिंग प्रविधिहरू",
          description: "हामी हाम्रो प्लेटफर्ममा तपाईंको अनुभव बढाउन कुकीहरू र समान प्रविधिहरू प्रयोग गर्छौं:",
          cookies: [
            { name: "आवश्यक कुकीहरू", desc: "आधारभूत कार्यक्षमताका लागि आवश्यक" },
            { name: "विश्लेषण कुकीहरू", desc: "वेबसाइट प्रयोग र प्रदर्शन ट्र्याक गर्दछ" },
            { name: "विपणन कुकीहरू", desc: "विज्ञापन सामग्री व्यक्तिगत बनाउँछ" }
          ],
          note: "नोट: तपाईंले आफ्नो ब्राउजर सेटिङहरू मार्फत कुकी प्राथमिकताहरू नियन्त्रण गर्न सक्नुहुन्छ। कुकीहरू निष्क्रिय गर्दा हाम्रो प्लेटफर्ममा तपाईंको अनुभव प्रभावित हुन सक्छ।"
        },
        "6": {
          title: "डाटा सुरक्षा",
          description: "",
          security: [
            { title: "उद्योग-मानक संरक्षण", icon: Lock, desc: "हामी एन्क्रिप्सन, फायरवलहरू, र सुरक्षित सर्भरहरू समावेश गरी मजबुत सुरक्षा उपायहरू लागू गर्छौं तपाईंको व्यक्तिगत डाटा अनधिकृत पहुँचबाट सुरक्षित गर्न।" },
            { title: "तपाईंको जिम्मेवारीहरू", icon: AlertCircle, desc: "तपाईं आफ्नो खाता पासवर्ड गोप्य राख्न जिम्मेवार हुनुहुन्छ। आफ्नो लगइन क्रेडेन्सियल कसैसँग साझा नगर्नुहोस्। यदि तपाईंले आफ्नो खातामा कुनै अनधिकृत पहुँच संदेह गर्नुहुन्छ भने, कृपया हामीलाई तुरुन्तै security@doorstepsnepal.com मा जानकारी गर्नुहोस्।" }
          ]
        },
        "7": {
          title: "तपाईंको अधिकारहरू",
          rights: [
            {
              title: "पहुँच र सच्याइ",
              icon: Shield,
              description: "तपाईंसँग कुनै पनि समय आफ्नो व्यक्तिगत डाटा पहुँच र सच्याउने अधिकार छ:",
              points: [
                "privacy@doorstepsnepal.com मा हामीलाई सम्पर्क गरेर",
                "हाम्रो प्लेटफर्ममा आफ्नो खाता सेटिङहरू प्रयोग गरेर",
                "आफ्नो डाटाको प्रतिलिपि अनुरोध गरेर"
              ]
            },
            {
              title: "विपणन प्राथमिकताहरू",
              icon: Mail,
              description: "तपाईंले आफ्नो विपणन प्राथमिकताहरू नियन्त्रण गर्न सक्नुहुन्छ:",
              points: [
                "इमेलहरूमा उनसब्स्क्राइब लिङ्क प्रयोग गरेर",
                "आफ्नो खाता सेटिङहरूमा प्राथमिकताहरू समायोजन गरेर",
                "प्रत्यक्ष रूपमा privacy@doorstepsnepal.com मा हामीलाई सम्पर्क गरेर"
              ]
            }
          ]
        },
        "8": {
          title: "डाटा मेटाइ",
          description: "",
          deletion: {
            request: "तपाईंले आफ्नो खाता र व्यक्तिगत डाटा मेटाउने अनुरोध यस ईमेलमा गर्न सक्नुहुन्छ:",
            processing: { title: "प्रक्रिया समय", desc: "हामी तपाईंको मेटाइ अनुरोध प्राप्त भएपछि ७ कार्य दिन भित्र प्रक्रिया गर्नेछौं।" },
            retention: { title: "डाटा रिटेन्सन", desc: "कानून अनुसार आवश्यक केही डाटा राख्न सकिन्छ, कानूनी अनुपालनको लागि लेनदेन रेकर्डहरू समावेश।" }
          }
        },
        "9": {
          title: "डाटा स्थानान्तरण",
          description: "तपाईंको डाटा तपाईं बस्नुभएको देश भन्दा फरक देशहरूमा स्थानान्तरण र भण्डारण गर्न सकिन्छ। हाम्रो प्लेटफर्म प्रयोग गरेर, तपाईं यस्तो डाटा स्थानान्तरणहरूमा सहमत हुनुहुन्छ।",
          note: "अन्तर्राष्ट्रिय मानकहरू: हामी अन्तर्राष्ट्रिय डाटा स्थानान्तरणहरू लागू डाटा संरक्षण कानूनहरू अनुपालन गर्छन् र उपयुक्त सुरक्षा उपायहरू लागू गर्छौं भन्ने सुनिश्चित गर्छौं।"
        },
        "10": {
          title: "व्यापार संक्रमण",
          description: "एक विलय, अधिग्रहण, वा अन्य व्यापार संक्रमणको घटनामा, तपाईंको व्यक्तिगत डाटा सम्बन्धित सम्पत्तिहरूको भागको रूपमा स्थानान्तरण हुन सक्छ। तपाईंको व्यक्तिगत डाटाको कुनै पनि यस्तो स्वामित्व वा नियन्त्रण परिवर्तनको बारेमा हामी तपाईंलाई जानकारी गर्नेछौं।"
        },
        "11": {
          title: "प्रयोगकर्ता-सिर्जित सामग्री",
          description: "तपाईंले हाम्रो प्लेटफर्ममा पोस्ट गर्नुभएको कुनै पनि सामग्री (समीक्षाहरू, टिप्पणीहरू, फोटोहरू) अन्य प्रयोगकर्ताहरूलाई दृश्यात्मक हुन सक्छ। तेस्रो पक्षहरूद्वारा यस्तो सामग्रीको दुरुपयोगको लागि हामी जिम्मेवार छैनौं।",
          note: "महत्वपूर्ण: हामी तपाईंलाई हाम्रो प्लेटफर्ममा जानकारी साझा गर्दा लागू हुने कानूनहरू पालना गर्न र अरूको गोपनीयताको सम्मान गर्न प्रोत्साहित गर्छौं।"
        },
        "12": {
          title: "नीति अद्यावधिक",
          description: "हामीले हाम्रो अभ्यासहरूमा परिवर्तनहरू प्रतिबिम्बित गर्न वा अन्य परिचालन, कानूनी, वा नियामक कारणहरूको लागि समय-समयमा यो गोपनीयता नीति अद्यावधिक गर्न सक्छौं।",
          changes: [
            "अद्यावधिकहरू यस पृष्ठमा पोस्ट गरिनेछ",
            "महत्वपूर्ण परिवर्तनहरूको लागि इमेल सूचनाहरू",
            "लागू हुँदा इन-एप सूचनाहरू"
          ],
          finalNote: "परिवर्तनहरू पछि हाम्रो प्लेटफर्मको निरन्तर प्रयोगले संशोधित नीति स्वीकार गरेको मानिन्छ।"
        },
        "13": {
          title: "शिकायत अधिकृत",
          description: "यदि तपाईंसँग यस गोपनीयता नीति वा हामीले कसरी तपाईंको डाटा ह्याण्डल गर्छौं भन्ने बारेमा कुनै प्रश्न वा चिन्ता छ भने, कृपया हाम्रो शिकायत अधिकृतलाई सम्पर्क गर्नुहोस्:",
          contact: {
            email: "privacy@doorstepsnepal.com",
            response: "हामी सबै अनुरोधहरू ४८ घण्टा भित्र जवाफ दिने लक्ष्य राख्छौं"
          },
          support: [
            { title: "सामान्य समर्थन", email: "support@doorstepsnepal.com" },
            { title: "सुरक्षा चिन्ताहरू", email: "security@doorstepsnepal.com" }
          ]
        }
      },
      tableOfContents: [
        { num: "1", title: "हामीले सङ्कलन गर्ने जानकारी", icon: Shield },
        { num: "2", title: "हामीले डाटा कसरी सङ्कलन गर्छौं", icon: Eye },
        { num: "3", title: "व्यक्तिगत डाटाको प्रयोग", icon: RefreshCw },
        { num: "4", title: "व्यक्तिगत डाटा साझेदारी", icon: Users },
        { num: "5", title: "कुकीहरू र ट्र्याकिंग प्रविधिहरू", icon: Cookie },
        { num: "6", title: "डाटा सुरक्षा", icon: Lock },
        { num: "7", title: "तपाईंको अधिकारहरू", icon: Shield },
        { num: "8", title: "डाटा मेटाइ", icon: RefreshCw },
        { num: "9", title: "डाटा स्थानान्तरण", icon: Globe },
        { num: "10", title: "व्यापार संक्रमण", icon: RefreshCw },
        { num: "11", title: "प्रयोगकर्ता-सिर्जित सामग्री", icon: Users },
        { num: "12", title: "नीति अद्यावधिक", icon: AlertCircle },
        { num: "13", title: "शिकायत अधिकृत", icon: Mail },
      ],
      footer: {
        title: "हाम्रो नीति बुझ्न मद्दत चाहिन्छ?",
        subtitle: "यस नीतिको कुनै पनि पक्षको स्पष्टीकरणको लागि हाम्रो गोपनीयता टीमलाई सम्पर्क गर्नुहोस्",
        button: "गोपनीयता टीमलाई सम्पर्क गर्नुहोस्"
      },
      backToTop: "माथि जानुहोस्"
    }
    
  };
 // Get current content based on locale
  const current = locale === 'ne' ? content.ne : content.en;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        
        {/* Hero Section */}
        <section className="py-12 md:py-16 bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-6">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
                {current.hero.title}
              </h1>
              <p className="text-xl text-muted-foreground">
                {current.hero.subtitle}
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <Eye className="h-4 w-4 text-primary" />
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

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              {/* Introduction Card */}
              <Card className="mb-8 border-primary/20 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <Shield className="h-6 w-6 text-primary" />
                    {current.introduction.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {current.introduction.description}
                  </p>
                  <div className="bg-muted/30 p-4 rounded-lg mt-4">
                    <p className="text-sm text-muted-foreground">
                      <strong>{locale === "en" ? "Note:" : "नोट:"}</strong> {current.introduction.note}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Table of Contents */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <FileText className="h-6 w-6 text-primary" />
                  {locale === "en" ? "Table of Contents" : "विषयसूची"}
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                          {locale === "en" ? `Section ${item.num}` : `धारा ${item.num}`}
                        </div>
                        <div className="font-medium group-hover:text-primary">{item.title}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <Separator className="my-12" />

              {/* Policy Sections */}
              <div className="space-y-12">
                {/* Section 1 */}
                <section id="section-1" className="scroll-mt-24">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                      <span className="font-bold text-primary">1</span>
                    </div>
                    <h2 className="text-2xl font-bold">{current.sections["1"].title}</h2>
                  </div>
                  <Card>
                    <CardContent className="pt-6">
                      <p className="mb-4">
                        {current.sections["1"].description}
                      </p>
                      <ul className="space-y-3 mb-4">
                        {current.sections["1"].points.map((point, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                            <span><strong>{point.title}:</strong> {point.desc}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </section>

                {/* Section 2 */}
                <section id="section-2" className="scroll-mt-24">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                      <span className="font-bold text-primary">2</span>
                    </div>
                    <h2 className="text-2xl font-bold">{current.sections["2"].title}</h2>
                  </div>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="grid md:grid-cols-3 gap-6">
                        {current.sections["2"].methods.map((method, index) => (
                          <div key={index} className="space-y-4">
                            <div className="p-4 rounded-lg bg-primary/5">
                              <h3 className="font-bold mb-2 flex items-center gap-2">
                                <method.icon className="h-4 w-4 text-primary" />
                                {method.title}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {method.desc}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </section>

                {/* Section 3 */}
                <section id="section-3" className="scroll-mt-24">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                      <span className="font-bold text-primary">3</span>
                    </div>
                    <h2 className="text-2xl font-bold">{current.sections["3"].title}</h2>
                  </div>
                  <Card>
                    <CardContent className="pt-6">
                      <p className="mb-4">
                        {current.sections["3"].description}
                      </p>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {current.sections["3"].purposes.map((item, index) => (
                          <div key={index} className="flex items-start gap-2 p-3 rounded-lg bg-muted/30">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                            <span className="text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </section>

                {/* Section 4 */}
                <section id="section-4" className="scroll-mt-24">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                      <span className="font-bold text-primary">4</span>
                    </div>
                    <h2 className="text-2xl font-bold">{current.sections["4"].title}</h2>
                  </div>
                  <Card>
                    <CardContent className="pt-6">
                      <p className="mb-4">
                        {current.sections["4"].description}
                      </p>
                      <div className="space-y-4">
                        {current.sections["4"].shares.map((share, index) => (
                          <div key={index} className="p-4 border rounded-lg">
                            <h3 className="font-bold mb-2 text-primary">{share.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {share.desc}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </section>

                {/* Section 5 */}
                <section id="section-5" className="scroll-mt-24">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                      <span className="font-bold text-primary">5</span>
                    </div>
                    <h2 className="text-2xl font-bold">{current.sections["5"].title}</h2>
                  </div>
                  <Card>
                    <CardContent className="pt-6">
                      <p className="mb-4">
                        {current.sections["5"].description}
                      </p>
                      <div className="space-y-3">
                        {current.sections["5"].cookies.map((cookie, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <span className="font-medium">{cookie.name}</span>
                            <span className="text-sm text-muted-foreground">{cookie.desc}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          <strong>{locale === "en" ? "Note:" : "नोट:"}</strong> {current.sections["5"].note}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </section>

                {/* Section 6 */}
                <section id="section-6" className="scroll-mt-24">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                      <span className="font-bold text-primary">6</span>
                    </div>
                    <h2 className="text-2xl font-bold">{current.sections["6"].title}</h2>
                  </div>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        {current.sections["6"].security.map((item, index) => (
                          <div key={index} className="flex items-start gap-4">
                            <item.icon className="h-6 w-6 text-primary mt-1" />
                            <div>
                              <h3 className="font-bold mb-2">{item.title}</h3>
                              <p className="text-muted-foreground">
                                {item.desc}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </section>

                {/* Section 7 */}
                <section id="section-7" className="scroll-mt-24">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                      <span className="font-bold text-primary">7</span>
                    </div>
                    <h2 className="text-2xl font-bold">{current.sections["7"].title}</h2>
                  </div>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="grid sm:grid-cols-2 gap-6">
                        {current.sections["7"].rights.map((right, index) => (
                          <div key={index} className="space-y-3">
                            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                              <right.icon className="h-5 w-5 text-primary" />
                              {right.title}
                            </h3>
                            <p className="text-muted-foreground">
                              {right.description}
                            </p>
                            <ul className="space-y-2">
                              {right.points.map((point, pointIndex) => (
                                <li key={pointIndex} className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                                  <span className="text-sm">{point}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </section>

                {/* Section 8 */}
                <section id="section-8" className="scroll-mt-24">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                      <span className="font-bold text-primary">8</span>
                    </div>
                    <h2 className="text-2xl font-bold">{current.sections["8"].title}</h2>
                  </div>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-6">
                        <div>
                          <h3 className="font-bold text-lg mb-2">
                            {locale === "en" ? "Requesting Deletion" : "मेटाइ अनुरोध"}
                          </h3>
                          <p className="text-muted-foreground mb-3">
                            {current.sections["8"].deletion.request}
                          </p>
                          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-lg">
                            <Mail className="h-4 w-4 text-primary" />
                            <code className="text-primary font-medium">{current.sections["13"].contact.email}</code>
                          </div>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                            <h4 className="font-bold mb-2 text-green-700 dark:text-green-300">
                              {current.sections["8"].deletion.processing.title}
                            </h4>
                            <p className="text-sm text-green-600 dark:text-green-400">
                              {current.sections["8"].deletion.processing.desc}
                            </p>
                          </div>
                          <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                            <h4 className="font-bold mb-2 text-amber-700 dark:text-amber-300">
                              {current.sections["8"].deletion.retention.title}
                            </h4>
                            <p className="text-sm text-amber-600 dark:text-amber-400">
                              {current.sections["8"].deletion.retention.desc}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </section>

                {/* Section 9 */}
                <section id="section-9" className="scroll-mt-24">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                      <span className="font-bold text-primary">9</span>
                    </div>
                    <h2 className="text-2xl font-bold">{current.sections["9"].title}</h2>
                  </div>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <Globe className="h-6 w-6 text-primary mt-1" />
                        <div>
                          <p className="text-muted-foreground mb-3">
                            {current.sections["9"].description}
                          </p>
                          <div className="p-4 bg-muted/30 rounded-lg">
                            <p className="text-sm">
                              <strong>{locale === "en" ? "International Standards:" : "अन्तर्राष्ट्रिय मानकहरू:"}</strong> {current.sections["9"].note}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </section>

                {/* Section 10 */}
                <section id="section-10" className="scroll-mt-24">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                      <span className="font-bold text-primary">10</span>
                    </div>
                    <h2 className="text-2xl font-bold">{current.sections["10"].title}</h2>
                  </div>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <RefreshCw className="h-6 w-6 text-primary mt-1" />
                        <div>
                          <p className="text-muted-foreground">
                            {current.sections["10"].description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </section>

                {/* Section 11 */}
                <section id="section-11" className="scroll-mt-24">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                      <span className="font-bold text-primary">11</span>
                    </div>
                    <h2 className="text-2xl font-bold">{current.sections["11"].title}</h2>
                  </div>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <Users className="h-6 w-6 text-primary mt-1" />
                        <div>
                          <p className="text-muted-foreground mb-3">
                            {current.sections["11"].description}
                          </p>
                          <div className="p-4 bg-muted/30 rounded-lg">
                            <p className="text-sm">
                              <strong>{locale === "en" ? "Important:" : "महत्वपूर्ण:"}</strong> {current.sections["11"].note}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </section>

                {/* Section 12 */}
                <section id="section-12" className="scroll-mt-24">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                      <span className="font-bold text-primary">12</span>
                    </div>
                    <h2 className="text-2xl font-bold">{current.sections["12"].title}</h2>
                  </div>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <AlertCircle className="h-6 w-6 text-primary mt-1" />
                        <div className="space-y-3">
                          <p className="text-muted-foreground">
                            {current.sections["12"].description}
                          </p>
                          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <h4 className="font-bold mb-2 text-blue-700 dark:text-blue-300">
                              {locale === "en" ? "Notification of Changes" : "परिवर्तनको सूचना"}
                            </h4>
                            <ul className="space-y-2 text-sm text-blue-600 dark:text-blue-400">
                              {current.sections["12"].changes.map((change, index) => (
                                <li key={index} className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                  <span>{change}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {current.sections["12"].finalNote}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </section>

                {/* Section 13 */}
                <section id="section-13" className="scroll-mt-24">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                      <span className="font-bold text-primary">13</span>
                    </div>
                    <h2 className="text-2xl font-bold">{current.sections["13"].title}</h2>
                  </div>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-6">
                        <div className="flex items-start gap-4">
                          <Mail className="h-6 w-6 text-primary mt-1" />
                          <div>
                            <h3 className="font-bold text-lg mb-2">
                              {locale === "en" ? "Contact Information" : "सम्पर्क जानकारी"}
                            </h3>
                            <p className="text-muted-foreground mb-4">
                              {current.sections["13"].description}
                            </p>
                            <div className="space-y-3">
                              <div className="p-4 bg-primary/5 rounded-lg">
                                <div className="font-medium mb-1">
                                  {locale === "en" ? "Email Address" : "इमेल ठेगाना"}
                                </div>
                                <code className="text-primary font-medium">{current.sections["13"].contact.email}</code>
                              </div>
                              <div className="p-4 bg-primary/5 rounded-lg">
                                <div className="font-medium mb-1">
                                  {locale === "en" ? "Response Time" : "प्रतिक्रिया समय"}
                                </div>
                                <p className="text-muted-foreground">{current.sections["13"].contact.response}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="border-t pt-6">
                          <h4 className="font-bold mb-3">
                            {locale === "en" ? "Additional Support" : "अतिरिक्त समर्थन"}
                          </h4>
                          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {current.sections["13"].support.map((item, index) => (
                              <div key={index} className="p-4 rounded-lg border">
                                <div className="font-medium mb-1">{item.title}</div>
                                <code className="text-sm text-muted-foreground">{item.email}</code>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </section>
              </div>

              {/* Footer Note */}
              <div className="mt-12 p-6 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-lg mb-1">{current.footer.title}</h3>
                    <p className="text-sm text-muted-foreground">{current.footer.subtitle}</p>
                  </div>
                  <a 
                    href={`mailto:${current.sections["13"].contact.email}`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Mail className="h-4 w-4" />
                    {current.footer.button}
                  </a>
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
          <Footer/>
    </>

  );
}

// Helper Components
const CheckCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const ArrowUp = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
  </svg>
);