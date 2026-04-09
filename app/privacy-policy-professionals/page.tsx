"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Shield, 
  Mail, 
  Lock, 
  Eye, 
  Globe, 
  RefreshCw, 
  Users, 
  Cookie, 
  AlertCircle, 
  FileText, 
  Wrench,  
  Clock, 
  Award, 
  MessageSquare,
  Briefcase,
  ShieldCheck,
  UserCheck,
  AlertTriangle,
  Handshake,
  FileCheck,
  Ban,
  Contact2Icon,
} from "lucide-react";
import { useI18n } from '@/lib/i18n/context';
import { Footer } from "@/components/layout/footer";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";



export default function ProfessionalsPrivacyPolicyPage() {
  const { locale } = useI18n();
        const pathname = usePathname();
        const router = useRouter();


          // Function to handle scroll to section
  const scrollToSection = (sectionId: string) => {
    // If we're already on the about page
    if (pathname === "/about") {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // Navigate to about page with hash
      router.push(`/about#${sectionId}`);
    }
  };

  // Bilingual content for professionals
  const content = {
    en: {
      hero: {
        title: "Professionals Privacy Policy",
        subtitle: "Terms, conditions, and code of conduct for Door Steps Nepal service professionals",
        lastUpdated: "Last Updated: December 2023",
        version: "Version 1.0"
      },
      introduction: {
        title: "Welcome to Door Steps Nepal's Professional Guidelines",
        description: `This document outlines the terms, conditions, and code of conduct that all service professionals ("Professionals," "you," or "your") must adhere to when registering and providing services through the Door Steps Nepal platform. By accepting these terms, you agree to comply with all rules and regulations set forth herein.`,
        note: "Note: By registering as a professional on our platform, you acknowledge that you have read, understood, and agree to be bound by all the terms and conditions outlined in this policy."
      },
      sections: {
        "1": {
          title: "Documentation & Verification",
          description: "All professionals must maintain valid and genuine documentation:",
          points: [
            { 
              title: "Document Authenticity", 
              desc: "I/We confirm that all information provided in this document is true and correct to the best of my/our knowledge.",
              neDesc: "म/हामीले यस कागजातमा भरेका सबै विवरणहरू हाम्रो जानकारी अनुसार सही र सत्य छन् भन्ने पुष्टि गर्दछु/गर्दछौँ।"
            },
            { 
              title: "Genuine Documents", 
              desc: "All documents submitted by me/us are genuine. If any document is found to be fake, I/we agree to face action as per company rules.",
              neDesc: "मैले/हामीले पेश गरेका सबै कागजातहरू सहि तथा सक्कली हुन्। नक्कली ठहरेमा कम्पनीको नियम अनुसार कारबाही भोग्न तयार छु/छौँ।"
            },
            { 
              title: "Valid ID Maintenance", 
              desc: "The professional must maintain a valid identification document and update or renew it whenever required by the company.",
              neDesc: "वैध परिचयपत्र राख्नुपर्नेछ र कम्पनीले मागेको अवस्थामा समयमै अद्यावधिक वा नवीकरण गर्नुपर्नेछ।"
            }
          ]
        },
        "2": {
          title: "Work Scope & Payment",
          description: "Clear guidelines for work determination and payment processes:",
          points: [
            { 
              title: "Scope Determination", 
              desc: "Professionals must clearly determine the scope of work and payment before starting the job.",
              neDesc: "काम सुरु गर्नु अघि कामको क्षेत्र तथा भुक्तानी दुवै स्पष्ट रूपमा निर्धारण गर्नुपर्नेछ।"
            },
            { 
              title: "Bill-Based Payment", 
              desc: "Payment should be made on the basis of the bill raised in the application. If there is less or more, the information should be updated immediately through the application.",
              neDesc: "भुक्तानी लिँदा एप्लिकेशनमा उठेको बिलको आधारमा लिनुपर्ने छ। यदि घटी अथवा बढी भएको अवस्थामा तुरुन्तै एप्लिकेशन मार्फत जानकारी update गराउनुपर्नेछ।"
            },
            { 
              title: "Payment Compliance", 
              desc: "After the work, if it is found that the payment process is not done according to the company's rules or if it is found to be contrary to the company's rules, action will be taken immediately according to the company's rules.",
              neDesc: "काम गरेपश्चात् भुक्तानी प्रक्रिया कम्पनीको नियमअनुसार नगरेको पाइएमा अथवा कम्पनीको नियम विपरीत गरेको पाइएमा तुरुन्तै कम्पनीको नियमअनुसार कारबाही हुनेछ।"
            }
          ]
        },
        "3": {
          title: "Safety & Liability",
          description: "Safety protocols and liability distribution:",
          points: [
            { 
              title: "Physical & Mental Fitness", 
              desc: "Work must be performed only when physically and mentally fit.",
              neDesc: "काम गर्ने समयमा पूर्ण सचेत तथा होसमा भई मात्र काम गर्नुपर्नेछ।"
            },
            { 
              title: "Company Non-Liability", 
              desc: "The company will not be responsible for damage to any goods or other items knowingly or unknowingly due to the carelessness of the workers.",
              neDesc: "कामदारको लापरवाहीले जानी तथा अनजानमा कुनै जिन्सी सरसामान तथा अन्य वस्तुमा क्षति हुँदा कम्पनी जिम्मेवार हुने छैन।"
            },
            { 
              title: "Customer Loss Prevention", 
              desc: "Causing any loss or damage to the customer is strictly prohibited. If any damage occurs, the professional shall bear full responsibility.",
              neDesc: "ग्राहकलाई कुनै हानी नोक्सानी पुर्याउन पाइने छैन। भएको खण्डमा पूर्ण जिम्मेवारी कामदारकै हुनेछ।"
            },
            { 
              title: "Safe Tools & Products", 
              desc: "All tools, equipment, and products used must be safe. Any direct or indirect harm to the consumer shall be the worker's responsibility.",
              neDesc: "काम गर्दा प्रयोग गरिने सामान वा प्रोडक्ट सुरक्षित हुनुपर्नेछ। उपभोक्तालाई प्रत्यक्ष/अप्रत्यक्ष हानी भएमा सोको जिम्मेवारी कामदारकै हुनेछ।"
            },
            { 
              title: "Safety Protocols", 
              desc: "All safety protocols must be strictly followed.",
              neDesc: "सुरक्षा प्रोटोकलहरूको पूर्ण पालना गर्नुपर्नेछ।"
            },
            { 
              title: "Insurance Responsibility", 
              desc: "The company will not be responsible for any injury, accident, or loss suffered by the professional unless officially insured under the company's policy.",
              neDesc: "कम्पनीको नीति अनुसार आधिकारिक रूपमा बिमा नभएसम्म कामदारले पाएको चोटपटक, दुर्घटना वा क्षतिको जिम्मेवार कम्पनी रहनेछैन।"
            }
          ]
        },
        "4": {
          title: "Tools & Equipment",
          description: "Professional tool requirements and responsibilities:",
          points: [
            { 
              title: "Personal Tools", 
              desc: "Professionals must bring their own required tools and take full responsibility for their safety.",
              neDesc: "कामका लागि आवश्यक सबै सामान आफै लिएर जानुपर्नेछ र तिनको सुरक्षा स्वयंले गर्नुपर्नेछ।"
            }
          ]
        },
        "5": {
          title: "Customer Interaction",
          description: "Guidelines for professional customer communication:",
          points: [
            { 
              title: "Booking Cancellation", 
              desc: "If a customer cancels the booking, it must be accepted as cancellation. No abusive phone calls or messages are allowed.",
              neDesc: "ग्राहकले बुकिङ क्यान्सिल गरेको खण्डमा त्यसलाई रद्द गरेकै बुझ्नुपर्नेछ फोन अथवा मेसेज गरेर गालीगलोज गर्न पाइने छैन।"
            },
            { 
              title: "Ratings & Feedback", 
              desc: "Customer ratings and feedback are considered as positive (high rating) or negative (low rating) for performance evaluation.",
              neDesc: "ग्राहकद्वारा कामको प्रोत्साहनका निम्ति दर्जा तथा प्रतिक्रिया दिँदा त्यसलाई धेरै दर्जा अर्थात् सकारात्मक र थोरै दर्जा अर्थात् नकारात्मक भन्ने बुझिन्छ।"
            },
            { 
              title: "Timely Arrival", 
              desc: "The professional must reach the work location on time. In case of unavoidable delay, the professional must inform the customer or company immediately.",
              neDesc: "काम स्थलमा समयमा पुग्नुपर्नेछ। कुनै अपरिहार्य कारणले ढिलो हुने अवस्थाहरूमा तुरुन्तै ग्राहक वा कंपनीलाई जानकारी गराउनुपर्नेछ।"
            }
          ]
        },
        "6": {
          title: "Confidentiality & Conduct",
          description: "Professional conduct and information handling:",
          points: [
            { 
              title: "Confidentiality", 
              desc: "The professional must keep all customer information strictly confidential and must not disclose it to any unauthorized person or party.",
              neDesc: "ग्राहकको सम्पूर्ण जानकारी गोप्य राख्नुपर्नेछ र कुनै पनि अनधिकृत व्यक्ति वा पक्षलाई खुलाउन पाइने छैन।"
            },
            { 
              title: "Professional Conduct", 
              desc: "The professional must maintain proper behavior and must not engage in any form of harassment, abuse, or discriminatory conduct while performing duties.",
              neDesc: "आफ्नो कर्तव्य निर्वाह गर्दा कुनै पनि प्रकारको दुर्व्यवहार, दुरुपयोग वा भेदभावपूर्ण व्यवहार गर्न पाइने छैन।"
            }
          ]
        },
        "7": {
          title: "Platform Usage",
          description: "Rules for using the Door Steps Nepal platform:",
          points: [
            { 
              title: "Company Terms Compliance", 
              desc: "While working through this company, you have to work within the terms and conditions of the company.",
              neDesc: "यो कम्पनी मार्फत काम गर्दा कम्पनीको शर्त तथा नियमावलीभित्र रहेर काम गर्नुपर्नेछ।"
            },
            { 
              title: "Dispute Resolution", 
              desc: "In case of any dispute or misunderstanding, the mediators of the company should be contacted.",
              neDesc: "कुनै कुराको विवाद भएमा अथवा कुरा नबुझेमा कम्पनीको मध्यस्थकर्ताहरूसँग सम्पर्क राख्नुपर्नेछ।"
            },
            { 
              title: "Platform-Only Transactions", 
              desc: "While using this application, the professional must conduct all customer communication and service transactions only through the company's platform, and making any direct deals or providing services to customers outside the platform is strictly prohibited.",
              neDesc: "यो एप प्रयोग गर्ने क्रममा पेशावरले सबै ग्राहकसम्बन्धी सम्पर्क र सेवा लेनदेन कम्पनीको प्लेटफर्म मार्फत मात्र गर्नुपर्नेछ, र प्लेटफर्म बाहिर ग्राहकसँग प्रत्यक्ष कारोबार गर्नु वा सेवा प्रदान गर्नु कडाइका साथ निषेध गरिएको छ।"
            }
          ]
        },
        "8": {
          title: "Policy Compliance & Updates",
          description: "Acceptance of company policies and updates:",
          points: [
            { 
              title: "Policy Violations", 
              desc: "If found acting against company policies, the professional may be suspended or permanently dismissed.",
              neDesc: "कम्पनीको नियम विपरीत कार्य गरेको पाइएमा निलम्बन वा बर्खास्त गरिनेछ।"
            },
            { 
              title: "Accept Updates", 
              desc: "Professionals must accept updates, new rules, and changes introduced by the company.",
              neDesc: "कम्पनीले ल्याएका नियम, अपडेट तथा परिवर्तन आत्मसात् गर्नुपर्नेछ।"
            },
            { 
              title: "Future Changes", 
              desc: "Note: We may change our policies in future, please keep yourself updated.",
              neDesc: "नोट: हामी भविष्यमा हाम्रा नीतिहरू परिवर्तन गर्न सक्छौं, कृपया आफैलाई अद्यावधिक राख्नुहोस्।"
            }
          ]
        }
      },
      tableOfContents: [
        { num: "1", title: "Documentation & Verification", icon: FileCheck },
        { num: "2", title: "Work Scope & Payment", icon: Briefcase },
        { num: "3", title: "Safety & Liability", icon: ShieldCheck },
        { num: "4", title: "Tools & Equipment", icon: Wrench },
        { num: "5", title: "Customer Interaction", icon: MessageSquare },
        { num: "6", title: "Confidentiality & Conduct", icon: UserCheck },
        { num: "7", title: "Platform Usage", icon: Globe },
        { num: "8", title: "Policy Compliance & Updates", icon: RefreshCw }
      ],
      footer: {
        title: "Questions About Professional Guidelines?",
        subtitle: "Contact our professional support team for clarification on any aspect of this policy",
        button: "Contact Support Team"
      },
      backToTop: "Back to Top",
      grievance: {
        title: "Grievance & Support Contact",
        email: "professionals@doorstepsnepal.com",
        response: "We aim to respond to all professional inquiries within 24 hours",
        support: [
          { title: "Technical Support", email: "tech.support@doorstepsnepal.com" },
          { title: "Payment Issues", email: "payments@doorstepsnepal.com" },
          { title: "Policy Clarification", email: "policy@doorstepsnepal.com" },
          { title: "Emergency", email: "emergency@doorstepsnepal.com" }
        ]
      }
    },
    ne: {
      hero: {
        title: "प्रोफेशनल गोपनीयता नीति",
        subtitle: "Door Steps Nepal का सेवा प्रोफेशनलहरूको लागि सर्तहरू, नियमहरू, र आचार संहिता",
        lastUpdated: "अन्तिम अद्यावधिक: डिसेम्बर २०२३",
        version: "संस्करण १.०"
      },
      introduction: {
        title: "Door Steps Nepal को प्रोफेशनल दिशानिर्देशहरूमा स्वागत छ",
        description: `यो कागजातले सबै सेवा प्रोफेशनलहरू ("प्रोफेशनलहरू," "तपाईं," वा "तपाईंको") ले Door Steps Nepal प्लेटफर्म मार्फत दर्ता र सेवा प्रदान गर्दा पालना गर्नुपर्ने सर्तहरू, नियमहरू, र आचार संहिता रेखांकित गर्दछ। यी सर्तहरू स्वीकार गरेर, तपाईं यहाँ उल्लिखित सबै नियमहरू र विनियमहरू पालना गर्न सहमत हुनुहुन्छ।`,
        note: "नोट: हाम्रो प्लेटफर्ममा प्रोफेशनलको रूपमा दर्ता गरेर, तपाईंले यो नीतिमा उल्लिखित सबै सर्तहरू पढ्नुभएको, बुझ्नुभएको, र ती अनुसार बाध्य हुन सहमत हुनुहुन्छ भनी स्वीकार गर्नुहुन्छ।"
      },
      sections: {
        "1": {
          title: "कागजात र प्रमाणीकरण",
          description: "सबै प्रोफेशनलहरूले वैध र सक्कली कागजातहरू राख्नुपर्छ:",
          points: [
            { 
              title: "कागजात प्रामाणिकता", 
              desc: "म/हामीले यस कागजातमा भरेका सबै विवरणहरू हाम्रो जानकारी अनुसार सही र सत्य छन् भन्ने पुष्टि गर्दछु/गर्दछौँ।",
              neDesc: "म/हामीले यस कागजातमा भरेका सबै विवरणहरू हाम्रो जानकारी अनुसार सही र सत्य छन् भन्ने पुष्टि गर्दछु/गर्दछौँ।"
            },
            { 
              title: "सक्कली कागजात", 
              desc: "मैले/हामीले पेश गरेका सबै कागजातहरू सहि तथा सक्कली हुन्। नक्कली ठहरेमा कम्पनीको नियम अनुसार कारबाही भोग्न तयार छु/छौँ।",
              neDesc: "मैले/हामीले पेश गरेका सबै कागजातहरू सहि तथा सक्कली हुन्। नक्कली ठहरेमा कम्पनीको नियम अनुसार कारबाही भोग्न तयार छु/छौँ।"
            },
            { 
              title: "वैध परिचयपत्र", 
              desc: "वैध परिचयपत्र राख्नुपर्नेछ र कम्पनीले मागेको अवस्थामा समयमै अद्यावधिक वा नवीकरण गर्नुपर्नेछ।",
              neDesc: "वैध परिचयपत्र राख्नुपर्नेछ र कम्पनीले मागेको अवस्थामा समयमै अद्यावधिक वा नवीकरण गर्नुपर्नेछ।"
            }
          ]
        },
        "2": {
          title: "कामको क्षेत्र र भुक्तानी",
          description: "काम निर्धारण र भुक्तानी प्रक्रियाको लागि स्पष्ट दिशानिर्देशहरू:",
          points: [
            { 
              title: "क्षेत्र निर्धारण", 
              desc: "काम सुरु गर्नु अघि कामको क्षेत्र तथा भुक्तानी दुवै स्पष्ट रूपमा निर्धारण गर्नुपर्नेछ।",
              neDesc: "काम सुरु गर्नु अघि कामको क्षेत्र तथा भुक्तानी दुवै स्पष्ट रूपमा निर्धारण गर्नुपर्नेछ।"
            },
            { 
              title: "बिल-आधारित भुक्तानी", 
              desc: "भुक्तानी लिँदा एप्लिकेशनमा उठेको बिलको आधारमा लिनुपर्ने छ। यदि घटी अथवा बढी भएको अवस्थामा तुरुन्तै एप्लिकेशन मार्फत जानकारी update गराउनुपर्नेछ।",
              neDesc: "भुक्तानी लिँदा एप्लिकेशनमा उठेको बिलको आधारमा लिनुपर्ने छ। यदि घटी अथवा बढी भएको अवस्थामा तुरुन्तै एप्लिकेशन मार्फत जानकारी update गराउनुपर्नेछ।"
            },
            { 
              title: "भुक्तानी अनुपालन", 
              desc: "काम गरेपश्चात् भुक्तानी प्रक्रिया कम्पनीको नियमअनुसार नगरेको पाइएमा अथवा कम्पनीको नियम विपरीत गरेको पाइएमा तुरुन्तै कम्पनीको नियमअनुसार कारबाही हुनेछ।",
              neDesc: "काम गरेपश्चात् भुक्तानी प्रक्रिया कम्पनीको नियमअनुसार नगरेको पाइएमा अथवा कम्पनीको नियम विपरीत गरेको पाइएमा तुरुन्तै कम्पनीको नियमअनुसार कारबाही हुनेछ।"
            }
          ]
        },
        "3": {
          title: "सुरक्षा र दायित्व",
          description: "सुरक्षा प्रोटोकल र दायित्व वितरण:",
          points: [
            { 
              title: "शारीरिक र मानसिक तन्दुरुस्ती", 
              desc: "काम गर्ने समयमा पूर्ण सचेत तथा होसमा भई मात्र काम गर्नुपर्नेछ।",
              neDesc: "काम गर्ने समयमा पूर्ण सचेत तथा होसमा भई मात्र काम गर्नुपर्नेछ।"
            },
            { 
              title: "कम्पनी गैर-दायित्व", 
              desc: "कामदारको लापरवाहीले जानी तथा अनजानमा कुनै जिन्सी सरसामान तथा अन्य वस्तुमा क्षति हुँदा कम्पनी जिम्मेवार हुने छैन।",
              neDesc: "कामदारको लापरवाहीले जानी तथा अनजानमा कुनै जिन्सी सरसामान तथा अन्य वस्तुमा क्षति हुँदा कम्पनी जिम्मेवार हुने छैन।"
            },
            { 
              title: "ग्राहक हानि रोकथाम", 
              desc: "ग्राहकलाई कुनै हानी नोक्सानी पुर्याउन पाइने छैन। भएको खण्डमा पूर्ण जिम्मेवारी कामदारकै हुनेछ।",
              neDesc: "ग्राहकलाई कुनै हानी नोक्सानी पुर्याउन पाइने छैन। भएको खण्डमा पूर्ण जिम्मेवारी कामदारकै हुनेछ।"
            },
            { 
              title: "सुरक्षित उपकरण र उत्पादन", 
              desc: "काम गर्दा प्रयोग गरिने सामान वा प्रोडक्ट सुरक्षित हुनुपर्नेछ। उपभोक्तालाई प्रत्यक्ष/अप्रत्यक्ष हानी भएमा सोको जिम्मेवारी कामदारकै हुनेछ।",
              neDesc: "काम गर्दा प्रयोग गरिने सामान वा प्रोडक्ट सुरक्षित हुनुपर्नेछ। उपभोक्तालाई प्रत्यक्ष/अप्रत्यक्ष हानी भएमा सोको जिम्मेवारी कामदारकै हुनेछ।"
            },
            { 
              title: "सुरक्षा प्रोटोकल", 
              desc: "सुरक्षा प्रोटोकलहरूको पूर्ण पालना गर्नुपर्नेछ।",
              neDesc: "सुरक्षा प्रोटोकलहरूको पूर्ण पालना गर्नुपर्नेछ।"
            },
            { 
              title: "बिमा जिम्मेवारी", 
              desc: "कम्पनीको नीति अनुसार आधिकारिक रूपमा बिमा नभएसम्म कामदारले पाएको चोटपटक, दुर्घटना वा क्षतिको जिम्मेवार कम्पनी रहनेछैन।",
              neDesc: "कम्पनीको नीति अनुसार आधिकारिक रूपमा बिमा नभएसम्म कामदारले पाएको चोटपटक, दुर्घटना वा क्षतिको जिम्मेवार कम्पनी रहनेछैन।"
            }
          ]
        },
        "4": {
          title: "उपकरण र सामग्री",
          description: "प्रोफेशनल उपकरण आवश्यकताहरू र जिम्मेवारीहरू:",
          points: [
            { 
              title: "व्यक्तिगत उपकरण", 
              desc: "कामका लागि आवश्यक सबै सामान आफै लिएर जानुपर्नेछ र तिनको सुरक्षा स्वयंले गर्नुपर्नेछ।",
              neDesc: "कामका लागि आवश्यक सबै सामान आफै लिएर जानुपर्नेछ र तिनको सुरक्षा स्वयंले गर्नुपर्नेछ।"
            }
          ]
        },
        "5": {
          title: "ग्राहक अन्तरक्रिया",
          description: "प्रोफेशनल ग्राहक संचारको लागि दिशानिर्देशहरू:",
          points: [
            { 
              title: "बुकिंग रद्द", 
              desc: "ग्राहकले बुकिङ क्यान्सिल गरेको खण्डमा त्यसलाई रद्द गरेकै बुझ्नुपर्नेछ फोन अथवा मेसेज गरेर गालीगलोज गर्न पाइने छैन।",
              neDesc: "ग्राहकले बुकिङ क्यान्सिल गरेको खण्डमा त्यसलाई रद्द गरेकै बुझ्नुपर्नेछ फोन अथवा मेसेज गरेर गालीगलोज गर्न पाइने छैन।"
            },
            { 
              title: "रेटिङ र प्रतिक्रिया", 
              desc: "ग्राहकद्वारा कामको प्रोत्साहनका निम्ति दर्जा तथा प्रतिक्रिया दिँदा त्यसलाई धेरै दर्जा अर्थात् सकारात्मक र थोरै दर्जा अर्थात् नकारात्मक भन्ने बुझिन्छ।",
              neDesc: "ग्राहकद्वारा कामको प्रोत्साहनका निम्ति दर्जा तथा प्रतिक्रिया दिँदा त्यसलाई धेरै दर्जा अर्थात् सकारात्मक र थोरै दर्जा अर्थात् नकारात्मक भन्ने बुझिन्छ।"
            },
            { 
              title: "समयमा पुग्ने", 
              desc: "काम स्थलमा समयमा पुग्नुपर्नेछ। कुनै अपरिहार्य कारणले ढिलो हुने अवस्थाहरूमा तुरुन्तै ग्राहक वा कंपनीलाई जानकारी गराउनुपर्नेछ।",
              neDesc: "काम स्थलमा समयमा पुग्नुपर्नेछ। कुनै अपरिहार्य कारणले ढिलो हुने अवस्थाहरूमा तुरुन्तै ग्राहक वा कंपनीलाई जानकारी गराउनुपर्नेछ।"
            }
          ]
        },
        "6": {
          title: "गोपनीयता र आचरण",
          description: "प्रोफेशनल आचरण र जानकारी व्यवस्थापन:",
          points: [
            { 
              title: "गोपनीयता", 
              desc: "ग्राहकको सम्पूर्ण जानकारी गोप्य राख्नुपर्नेछ र कुनै पनि अनधिकृत व्यक्ति वा पक्षलाई खुलाउन पाइने छैन।",
              neDesc: "ग्राहकको सम्पूर्ण जानकारी गोप्य राख्नुपर्नेछ र कुनै पनि अनधिकृत व्यक्ति वा पक्षलाई खुलाउन पाइने छैन।"
            },
            { 
              title: "प्रोफेशनल आचरण", 
              desc: "आफ्नो कर्तव्य निर्वाह गर्दा कुनै पनि प्रकारको दुर्व्यवहार, दुरुपयोग वा भेदभावपूर्ण व्यवहार गर्न पाइने छैन।",
              neDesc: "आफ्नो कर्तव्य निर्वाह गर्दा कुनै पनि प्रकारको दुर्व्यवहार, दुरुपयोग वा भेदभावपूर्ण व्यवहार गर्न पाइने छैन।"
            }
          ]
        },
        "7": {
          title: "प्लेटफर्म प्रयोग",
          description: "Door Steps Nepal प्लेटफर्म प्रयोग गर्ने नियमहरू:",
          points: [
            { 
              title: "कम्पनी सर्तहरू अनुपालन", 
              desc: "यो कम्पनी मार्फत काम गर्दा कम्पनीको शर्त तथा नियमावलीभित्र रहेर काम गर्नुपर्नेछ।",
              neDesc: "यो कम्पनी मार्फत काम गर्दा कम्पनीको शर्त तथा नियमावलीभित्र रहेर काम गर्नुपर्नेछ।"
            },
            { 
              title: "विवाद समाधान", 
              desc: "कुनै कुराको विवाद भएमा अथवा कुरा नबुझेमा कम्पनीको मध्यस्थकर्ताहरूसँग सम्पर्क राख्नुपर्नेछ।",
              neDesc: "कुनै कुराको विवाद भएमा अथवा कुरा नबुझेमा कम्पनीको मध्यस्थकर्ताहरूसँग सम्पर्क राख्नुपर्नेछ।"
            },
            { 
              title: "प्लेटफर्म-मात्र लेनदेन", 
              desc: "यो एप प्रयोग गर्ने क्रममा पेशावरले सबै ग्राहकसम्बन्धी सम्पर्क र सेवा लेनदेन कम्पनीको प्लेटफर्म मार्फत मात्र गर्नुपर्नेछ, र प्लेटफर्म बाहिर ग्राहकसँग प्रत्यक्ष कारोबार गर्नु वा सेवा प्रदान गर्नु कडाइका साथ निषेध गरिएको छ।",
              neDesc: "यो एप प्रयोग गर्ने क्रममा पेशावरले सबै ग्राहकसम्बन्धी सम्पर्क र सेवा लेनदेन कम्पनीको प्लेटफर्म मार्फत मात्र गर्नुपर्नेछ, र प्लेटफर्म बाहिर ग्राहकसँग प्रत्यक्ष कारोबार गर्नु वा सेवा प्रदान गर्नु कडाइका साथ निषेध गरिएको छ।"
            }
          ]
        },
        "8": {
          title: "नीति अनुपालन र अद्यावधिक",
          description: "कम्पनी नीतिहरू र अद्यावधिकहरूको स्वीकृति:",
          points: [
            { 
              title: "नीति उल्लंघन", 
              desc: "कम्पनीको नियम विपरीत कार्य गरेको पाइएमा निलम्बन वा बर्खास्त गरिनेछ।",
              neDesc: "कम्पनीको नियम विपरीत कार्य गरेको पाइएमा निलम्बन वा बर्खास्त गरिनेछ।"
            },
            { 
              title: "अद्यावधिक स्वीकार", 
              desc: "कम्पनीले ल्याएका नियम, अपडेट तथा परिवर्तन आत्मसात् गर्नुपर्नेछ।",
              neDesc: "कम्पनीले ल्याएका नियम, अपडेट तथा परिवर्तन आत्मसात् गर्नुपर्नेछ।"
            },
            { 
              title: "भविष्यका परिवर्तनहरू", 
              desc: "नोट: हामी भविष्यमा हाम्रा नीतिहरू परिवर्तन गर्न सक्छौं, कृपया आफैलाई अद्यावधिक राख्नुहोस्।",
              neDesc: "नोट: हामी भविष्यमा हाम्रा नीतिहरू परिवर्तन गर्न सक्छौं, कृपया आफैलाई अद्यावधिक राख्नुहोस्।"
            }
          ]
        }
      },
      tableOfContents: [
        { num: "1", title: "कागजात र प्रमाणीकरण", icon: FileCheck },
        { num: "2", title: "कामको क्षेत्र र भुक्तानी", icon: Briefcase },
        { num: "3", title: "सुरक्षा र दायित्व", icon: ShieldCheck },
        { num: "4", title: "उपकरण र सामग्री", icon: Wrench },
        { num: "5", title: "ग्राहक अन्तरक्रिया", icon: MessageSquare },
        { num: "6", title: "गोपनीयता र आचरण", icon: UserCheck },
        { num: "7", title: "प्लेटफर्म प्रयोग", icon: Globe },
        { num: "8", title: "नीति अनुपालन र अद्यावधिक", icon: RefreshCw }
      ],
      footer: {
        title: "प्रोफेशनल दिशानिर्देशहरू बारे प्रश्नहरू?",
        subtitle: "यस नीतिको कुनै पनि पक्षको स्पष्टीकरणको लागि हाम्रो प्रोफेशनल समर्थन टीमलाई सम्पर्क गर्नुहोस्",
        button: "समर्थन टीमलाई सम्पर्क गर्नुहोस्"
      },
      backToTop: "माथि जानुहोस्",
      grievance: {
        title: "शिकायत र समर्थन सम्पर्क",
        email: "professionals@doorstepsnepal.com",
        response: "हामी सबै प्रोफेशनल अनुरोधहरू २४ घण्टा भित्र जवाफ दिने लक्ष्य राख्छौं",
        support: [
          { title: "प्राविधिक समर्थन", email: "tech.support@doorstepsnepal.com" },
          { title: "भुक्तानी समस्याहरू", email: "payments@doorstepsnepal.com" },
          { title: "नीति स्पष्टीकरण", email: "policy@doorstepsnepal.com" },
          { title: "आपतकालिन", email: "emergency@doorstepsnepal.com" }
        ]
      }
    }
  };
  
  // Get current content based on locale
  const current = locale === 'ne' ? content.ne : content.en;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        
        {/* Hero Section */}
        <section className="py-12 md:py-16 bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-6">
                <Briefcase className="h-8 w-8 text-primary" />
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
            {/* <div className="max-w-6xl mx-auto"> */}
              {/* Introduction Card */}
              <Card className="mb-8 border-primary/20 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <Handshake className="h-6 w-6 text-primary" />
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
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
  {current.tableOfContents.map((item) => {
  const IconComponent = item.icon as React.ElementType;
  return (
    <a 
      key={item.num} 
      href={`#section-${item.num}`}
      className="group flex items-center gap-4 p-4 rounded-lg border hover:border-primary hover:bg-primary/5 transition-all"
    >
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 group-hover:bg-primary/20">
        <IconComponent className="h-5 w-5 text-primary" />
      </div>
      <div>
        <div className="text-sm text-primary font-medium">
          {locale === "en" ? `Section ${item.num}` : `धारा ${item.num}`}
        </div>
        <div className="font-medium group-hover:text-primary">{item.title}</div>
      </div>
    </a>
  );
})}
              </div>

              <Separator className="my-12" />

        <div className="space-y-6">

  {/* Policy Sections */}
  <div className="space-y-12">
    {/* Dynamic Sections */}
    {Object.keys(current.sections).map((sectionKey) => (
      <section key={sectionKey} id={`section-${sectionKey}`} className="scroll-mt-24">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
            <span className="font-bold text-primary">{sectionKey}</span>
          </div>
          <h2 className="text-2xl font-bold">{(current.sections as any)[sectionKey].title}</h2>
        </div>
        <Card>
          <CardContent className="pt-6">
            {(current.sections as any)[sectionKey].description && (
              <p className="mb-6 text-muted-foreground">
                {(current.sections as any)[sectionKey].description}
              </p>
            )}
            <div className="space-y-6">
              {(current.sections as any)[sectionKey].points.map((point: any, index: number) => (
                <div key={index} className="border-l-4 border-primary/30 pl-4 py-2">
                  <h3 className="font-bold text-lg mb-2 text-primary">
                    {point.title}
                  </h3>
                  <p className="text-muted-foreground mb-3">
                    {point.desc}
                  </p>
                  <div className="bg-muted/30 p-3 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      {point.neDesc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    ))}
  </div>
</div>

              {/* Grievance Section */}
              <section className="mt-12">
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-3">
                      <Mail className="h-6 w-6 text-primary" />
                      {current.grievance.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <Mail className="h-6 w-6 text-primary mt-1" />
                        <div>
                          <p className="text-muted-foreground mb-4">
                            {locale === "en" 
                              ? "For any questions or concerns regarding these professional guidelines, please contact our support team:" 
                              : "यी प्रोफेशनल दिशानिर्देशहरूको बारेमा कुनै प्रश्न वा चिन्ताको लागि, कृपया हाम्रो समर्थन टीमलाई सम्पर्क गर्नुहोस्:"}
                          </p>
                          <div className="space-y-3">
                            <div className="p-4 bg-primary/5 rounded-lg">
                              <div className="font-medium mb-1">
                                {locale === "en" ? "Primary Email" : "प्राथमिक इमेल"}
                              </div>
                              <code className="text-primary font-medium">{current.grievance.email}</code>
                            </div>
                            <div className="p-4 bg-primary/5 rounded-lg">
                              <div className="font-medium mb-1">
                                {locale === "en" ? "Response Time" : "प्रतिक्रिया समय"}
                              </div>
                              <p className="text-muted-foreground">{current.grievance.response}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t pt-6">
                        <h4 className="font-bold mb-3">
                          {locale === "en" ? "Departmental Support" : "विभागीय समर्थन"}
                        </h4>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          {current.grievance.support.map((item, index) => (
                            <div key={index} className="p-4 rounded-lg border hover:border-primary transition-colors">
                              <div className="font-medium mb-1 text-sm">{item.title}</div>
                              <code className="text-xs text-muted-foreground break-all">{item.email}</code>
                            </div>
                          ))}
                        </div>
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
                  {/* <a 
                    href={`mailto:${current.grievance.email}`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors whitespace-nowrap"
                  >
                    <Mail className="h-4 w-4" />
                    {current.footer.button}
                  </a> */}
                        <button
                  onClick={() => scrollToSection("contact")}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                    <Contact2Icon className="h-4 w-4" />
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
      
    </>
  );
}

// Helper Components
const ArrowUp = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
  </svg>
);