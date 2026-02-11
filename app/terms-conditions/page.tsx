 "use client";

import { Navbar } from "@/components/layout/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Shield, Mail, Lock, Eye, Globe, RefreshCw, Users, FileText, AlertCircle, BookOpen, DollarSign, UserCheck, Scale, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useI18n } from '@/lib/i18n/context';
import { Footer } from "@/components/layout/footer";

export default function TermsAndConditionsPage() {
  const { locale } = useI18n();
  


  // Bilingual content - with consistent point structure
  const content = {
    en: {
      hero: {
        title: "Terms and Conditions",
        subtitle: "Terms governing your use of Door Steps Nepal services and platform",
        lastUpdated: "Last Updated: December 2023",
        version: "Version 2.0"
      },
      introduction: {
        title: "Welcome to Door Steps Nepal's Terms and Conditions",
        description: `These terms and conditions ("Terms") govern your use of the services provided through https://www.doorstepsnepal.com and the Doorsteps Nepal mobile app (collectively referred to as the "Platform," and together with the services provided through the Platform, the "Services"). These Terms also incorporate our Privacy Policy, available at https://www.doorstepsnepal.com/privacy-policy ("Privacy Policy"), along with any guidelines, additional or supplemental terms, policies, and disclaimers that we may issue or make available from time to time ("Supplemental Terms"). The Privacy Policy and Supplemental Terms are integral components of these Terms. In the event of any conflict between these Terms and the Supplemental Terms concerning specific Services, the Supplemental Terms shall take precedence.`,
        note: "Note: By using our Platform, you agree to the collection and use of information in accordance with this Privacy Policy."
      },
      bindingAgreement: {
        title: "Binding Agreement",
        description: `The Terms constitute a binding and enforceable legal contract between Tech Reeva Enterprise Private Limited (referred to as "Doorsteps Nepal", "we", "us", or "our"), and you, a user of the Services, or any legal entity that books services on behalf of end-users ("you" or "Customer"). By using the Services, you represent and warrant that you have full legal capacity and authority to agree to and bind yourself to these Terms. If you represent any other person, you confirm and represent that you have the necessary power and authority to bind such person to these Terms.`,
        acceptance: "By engaging with the Services, you confirm that you have read and understood these Terms, which may be updated from time to time, and that you agree to adhere to the requirements set forth. These Terms override any previous written agreements with you. If you do not accept these Terms or are unable to comply with the requirements, we ask that you do not use the Services."
      },
      sections: {
        "1": {
          title: "Services",
          description: "",
          points: [
            {
              title: "Platform Services",
              desc: "The Services consist of offering a Platform that enables you to coordinate and schedule a range of home-based services with independent third-party service providers, known as 'Service Professionals.' Doorsteps Nepal facilitates the transfer of payments to Service Professionals for the services they deliver to you, as well as collecting payments on their behalf."
            },
            {
              title: "Pro Services",
              desc: "The term 'Pro Services' refers to the services offered by Service Professionals. Doorsteps Nepal does not provide Pro Services and is not accountable for their delivery. Service Professionals are exclusively responsible for the Pro Services they offer through the Platform."
            },
            {
              title: "Personal Use",
              desc: "The Platform is designated solely for your personal and non-commercial use, unless a different arrangement is established through a separate agreement. The Platform is intended for use exclusively within Nepal."
            },
            {
              title: "Communications",
              desc: "Doorsteps Nepal may send you communications through text messages, email, or messaging applications regarding your bookings, engagement with Services, or promotional initiatives. You may opt-out by contacting privacy@doorstepsnepal.com or modifying Platform settings."
            },
            {
              title: "Doorsteps Nepal Credits",
              desc: "Doorsteps Nepal may provide promotional codes ('Credits') at its discretion, subject to specific terms and conditions. Credits cannot be exchanged for cash and may be disabled at any time."
            }
          ]
        },
        "2": {
          title: "User Content",
          description: "",
          points: [
            {
              title: "Content Submission",
              desc: "Our Platform includes interactive features that allow users to post, upload, publish, display, transmit, or submit comments, reviews, suggestions, feedback, ideas, or other content."
            },
            {
              title: "Reviews",
              desc: "We may request reviews regarding Service Professionals. All reviews must be honest and not knowingly false, inaccurate, or misleading. Reviews are used for quality control purposes."
            },
            {
              title: "License Grant",
              desc: "By posting User Content, you grant Doorsteps Nepal a non-exclusive, worldwide, perpetual, irrevocable, transferable, sublicensable, and royalty-free licence to use your content for Service functionality and advertising."
            },
            {
              title: "Content Removal",
              desc: "Doorsteps Nepal may, without prior notice, remove or restrict access to any User Content that violates these Terms."
            }
          ]
        },
        "3": {
          title: "Account Creation and Responsibility",
          description: "",
          points: [
            {
              title: "Account Requirements",
              desc: "To use the Services, you must create an account on the Platform. You must be at least 18 years old and provide accurate information."
            },
            {
              title: "Account Security",
              desc: "You are responsible for keeping your Account secure and confidential. Notify us immediately if your Account details are compromised."
            },
            {
              title: "Account Activities",
              desc: "You are responsible for all activities carried out through your Account. Doorsteps Nepal will not be liable for any unauthorized access or misuse."
            },
            {
              title: "Communications",
              desc: "By creating an Account, you agree to receive communications regarding payments, updates, promotional offers, and other Service-related information."
            }
          ]
        },
        "4": {
          title: "Consent to Use Data",
          description: "",
          points: [
            {
              title: "Data Collection",
              desc: "You agree that Doorsteps Nepal may collect and use your personal data in accordance with our Privacy Policy."
            },
            {
              title: "Data Sharing",
              desc: "You consent to Doorsteps Nepal sharing your information with affiliates or third-party service providers for delivering Services, analytics, and improving your experience."
            },
            {
              title: "Legal Compliance",
              desc: "We may be obligated to share your data with law enforcement agencies, government authorities, or related bodies in connection with criminal or civil proceedings."
            }
          ]
        },
        "5": {
          title: "Bookings",
          description: "",
          points: [
            {
              title: "Placing a Booking",
              desc: "The Platform allows you to request various Pro Services based on available slots. We will make every effort to find a Service Professional for your chosen time."
            },
            {
              title: "Confirmation",
              desc: "Once you place a booking request, you will receive confirmation via SMS, email, phone call or push notification. Payment must be made as per Platform terms."
            },
            {
              title: "Cancellations",
              desc: "If you cancel a booking before confirmation, no charges apply. Cancellation policy outlines fees for cancellations made after confirmation."
            },
            {
              title: "Substitution",
              desc: "If the selected Service Professional is unavailable, we will provide a substitute from our registered Service Professionals."
            }
          ]
        },
        "6": {
          title: "Pricing, Fees, and Payment Terms",
          description: "",
          points: [
            {
              title: "Service Charges",
              desc: "Doorsteps Nepal reserves the right to apply charges for services and additional features through the Platform."
            },
            {
              title: "Pro Services Fees",
              desc: "When availing Pro Services, you pay Service Professionals the specified amount, plus any additional services, expenses, and goods costs."
            },
            {
              title: "Convenience Fee",
              desc: "Doorsteps Nepal may levy a convenience fee for facilitating bookings and transferring payments to Service Professionals."
            },
            {
              title: "Payment Methods",
              desc: "Payments are accepted via credit/debit cards, Internet banking, mobile banking, digital wallets, or cash upon service completion."
            },
            {
              title: "Taxes Included",
              desc: "All Charges and Fees include applicable taxes."
            },
            {
              title: "Price Variations",
              desc: "Charges and Fees may vary in specific geographical areas or during periods of high demand."
            }
          ]
        },
        "7": {
          title: "Customer Conduct",
          description: "",
          points: [
            {
              title: "Non-Discrimination",
              desc: "Doorsteps Nepal maintains a strict policy against discrimination towards Service Professionals based on protected characteristics."
            },
            {
              title: "Respectful Treatment",
              desc: "Customers must treat all Service Professionals with respect and courtesy, providing a safe and suitable environment."
            },
            {
              title: "Accountability",
              desc: "Customers are accountable for discriminatory behavior or failing to provide appropriate working conditions."
            },
            {
              title: "Reporting",
              desc: "Report inappropriate behavior by Service Professionals to doorstepsnepal@gmail.com within 48 hours."
            }
          ]
        },
        "8": {
          title: "Third Party Services",
          description: "",
          points: [
            {
              title: "Third-Party Content",
              desc: "The Platform may feature services, content, or links owned by third parties. Use of these services is at your own risk."
            },
            {
              title: "No Endorsement",
              desc: "Doorsteps Nepal makes no representations, warranties, or guarantees regarding Third-Party Services."
            },
            {
              title: "Third-Party Terms",
              desc: "By using Third-Party Services, you agree to be bound by their respective terms and conditions."
            }
          ]
        },
        "9": {
          title: "Your Responsibilities",
          description: "",
          points: [
            {
              title: "Accurate Information",
              desc: "You represent that all information provided is accurate, complete, and truthful, and will update it promptly if changes occur."
            },
            {
              title: "Cooperation",
              desc: "You consent to collaborate with Doorsteps Nepal in addressing any claims or disputes arising from violations of these Terms."
            },
            {
              title: "Content Ownership",
              desc: "You warrant that you own or have necessary permissions for all User Content you provide."
            },
            {
              title: "Prohibited Activities",
              desc: "You agree not to misuse Services, violate rights, upload harmful code, or engage in unlawful activities."
            }
          ]
        },
        "10": {
          title: "Our Intellectual Property",
          description: "",
          points: [
            {
              title: "Ownership",
              desc: "All rights in the Services are owned by or licensed to Doorsteps Nepal. You receive a limited license to use the Services."
            },
            {
              title: "Feedback",
              desc: "By providing feedback, you agree that Doorsteps Nepal may freely use, disclose, and exploit it without obligation."
            },
            {
              title: "Reserved Rights",
              desc: "Any rights not expressly granted herein are reserved by Doorsteps Nepal or its licensors."
            }
          ]
        },
        "11": {
          title: "Term and Termination",
          description: "",
          points: [
            {
              title: "Term Duration",
              desc: "These Terms remain in effect unless terminated according to their provisions."
            },
            {
              title: "Termination by Doorsteps Nepal",
              desc: "We may restrict, suspend, or terminate access for breach of obligations, legal violations, or legitimate business reasons."
            },
            {
              title: "Termination by You",
              desc: "You may terminate these Terms at any time by notifying Doorsteps Nepal."
            },
            {
              title: "Post-Termination",
              desc: "Upon termination, your account will be deactivated and access to Services revoked."
            }
          ]
        },
        "12": {
          title: "Disclaimers and Warranties",
          description: "",
          points: [
            {
              title: "As-Is Service",
              desc: "Services are delivered 'as is' without any express or implied warranties."
            },
            {
              title: "Platform Role",
              desc: "Doorsteps Nepal acts as a platform connecting users with service providers and is not liable for their performance."
            },
            {
              title: "No Guarantees",
              desc: "Doorsteps Nepal does not guarantee reliability, quality, or suitability of service providers."
            },
            {
              title: "Liability Limitation",
              desc: "Our liability shall not exceed the commission received for a specific booking, with a maximum cap of NPR 10,000."
            }
          ]
        },
        "13": {
          title: "Indemnity",
          description: "You agree to indemnify and hold Doorsteps Nepal harmless from any claims, losses, damages, liabilities, or costs arising out of:",
          points: [
            {
              title: "Your use of the Services",
              desc: ""
            },
            {
              title: "Violation of these Terms",
              desc: ""
            },
            {
              title: "Third-party claims resulting from your actions",
              desc: ""
            }
          ]
        },
        "14": {
          title: "Jurisdiction and Dispute Resolution",
          description: "",
          points: [
            {
              title: "Governing Law",
              desc: "These Terms shall be governed by and construed in accordance with the laws of Nepal."
            },
            {
              title: "Jurisdiction",
              desc: "Courts in Kathmandu shall have exclusive jurisdiction over disputes arising under these Terms."
            },
            {
              title: "Arbitration",
              desc: "Disputes shall be resolved through arbitration in Kathmandu in accordance with Nepal's prevailing arbitration laws."
            }
          ]
        },
        "15": {
          title: "Grievance Redressal",
          description: "Doorsteps Nepal will strive to resolve complaints within the timeframes prescribed by applicable laws.",
          points: []
        },
        "16": {
          title: "Miscellaneous Provisions",
          description: "",
          points: [
            {
              title: "Changes to Terms",
              desc: "Doorsteps Nepal reserves the right to amend these Terms at any time, with changes effective upon posting."
            },
            {
              title: "Service Modification",
              desc: "Doorsteps Nepal may modify or discontinue Services at its discretion without liability."
            },
            {
              title: "Severability",
              desc: "If any provision is found unlawful or unenforceable, remaining provisions shall remain in effect."
            },
            {
              title: "Assignment",
              desc: "You cannot assign your rights without our prior written consent. We may assign our rights without notice."
            },
            {
              title: "Force Majeure",
              desc: "Our liability is nullified if we cannot perform obligations due to circumstances outside our reasonable control."
            }
          ]
        }
      },
      tableOfContents: [
        { num: "1", title: "Services", icon: BookOpen },
        { num: "2", title: "User Content", icon: MessageSquare },
        { num: "3", title: "Account Creation", icon: UserCheck },
        { num: "4", title: "Data Consent", icon: Shield },
        { num: "5", title: "Bookings", icon: FileText },
        { num: "6", title: "Pricing & Payments", icon: DollarSign },
        { num: "7", title: "Customer Conduct", icon: Users },
        { num: "8", title: "Third Party Services", icon: Globe },
        { num: "9", title: "Your Responsibilities", icon: AlertCircle },
        { num: "10", title: "Intellectual Property", icon: Shield },
        { num: "11", title: "Term & Termination", icon: RefreshCw },
        { num: "12", title: "Disclaimers", icon: AlertCircle },
        { num: "13", title: "Indemnity", icon: Shield },
        { num: "14", title: "Jurisdiction", icon: Scale },
        { num: "15", title: "Grievance Redressal", icon: Mail },
        { num: "16", title: "Miscellaneous", icon: FileText },
      ],
      footer: {
        title: "Need Help Understanding Our Terms?",
        subtitle: "Contact our legal team for clarification on any aspect of these terms and conditions",
        button: "Contact Legal Team"
      },
      backToTop: "Back to Top"
    },
 
 ne: {
      hero: {
        title: "सर्त र शर्तहरू",
        subtitle: "Door Steps Nepal सेवा र प्लेटफर्म प्रयोग गर्दा लागू हुने सर्तहरू",
        lastUpdated: "अन्तिम अद्यावधिक: डिसेम्बर २०२३",
        version: "संस्करण २.०"
      },
      introduction: {
        title: "Door Steps Nepal को सर्त र शर्तहरूमा स्वागत छ",
        description: `यी सर्त र शर्तहरू ("सर्तहरू") तपाईंले https://www.doorstepsnepal.com र Doorsteps Nepal मोबाइल एप (सामूहिक रूपमा "प्लेटफर्म" भनिन्छ, र प्लेटफर्म मार्फत प्रदान गरिएका सेवाहरूसँग मिलेर "सेवाहरू") मार्फत प्रदान गरिएका सेवाहरूको प्रयोग नियमन गर्दछ। यी सर्तहरूमा हाम्रो गोपनीयता नीति, https://www.doorstepsnepal.com/privacy-policy मा उपलब्ध ("गोपनीयता नीति"), साथै कुनै पनि दिशानिर्देशहरू, थप वा पूरक सर्तहरू, नीतिहरू, र अस्वीकरणहरू समावेश छन् जुन हामीले समय-समयमा जारी गर्न सक्छौं वा उपलब्ध गराउन सक्छौं ("पूरक सर्तहरू")। गोपनीयता नीति र पूरक सर्तहरू यी सर्तहरूको अभिन्न अंग हुन्। विशिष्ट सेवाहरू सम्बन्धी यी सर्तहरू र पूरक सर्तहरूबीच कुनै विरोधाभास हुँदा, पूरक सर्तहरू प्राथमिकता पाउनेछन्।`,
        note: "नोट: हाम्रो प्लेटफर्म प्रयोग गरेर, तपाईं यस गोपनीयता नीति अनुसार जानकारी सङ्कलन र प्रयोग गर्न सहमत हुनुहुन्छ।"
      },
      bindingAgreement: {
        title: "बाध्यकारी सम्झौता",
        description: `सर्तहरूले टेक रीभा एन्टरप्राइज प्राइभेट लिमिटेड ("Doorsteps Nepal", "हामी", "हाम्रो" भनिन्छ) र तपाईं, सेवाहरूको प्रयोगकर्ता, वा अन्त्य-प्रयोगकर्ताहरूको तर्फबाट सेवाहरू बुक गर्ने कुनै पनि कानूनी इकाई ("तपाईं" वा "ग्राहक") बीच बाध्यकारी र लागू गर्न योग्य कानूनी सम्झौता गर्दछ। सेवाहरू प्रयोग गरेर, तपाईंले प्रतिनिधित्व र वारेन्टी गर्नुहुन्छ कि तपाईंसँग यी सर्तहरूमा सहमत हुन र आफूलाई बाँध्न पूर्ण कानूनी क्षमता र अधिकार छ। यदि तपाईंले कुनै अन्य व्यक्तिको प्रतिनिधित्व गर्नुहुन्छ भने, तपाईंले पुष्टि र प्रतिनिधित्व गर्नुहुन्छ कि तपाईंसँग त्यस्तो व्यक्तिलाई यी सर्तहरूमा बाँध्न आवश्यक शक्ति र अधिकार छ।`,
        acceptance: "सेवाहरूसँग संलग्न हुँदा, तपाईंले पुष्टि गर्नुहुन्छ कि तपाईंले यी सर्तहरू पढ्नुभएको र बुझ्नुभएको छ, जुन समय-समयमा अद्यावधिक हुन सक्छ, र तपाईंले निर्धारित गरिएका आवश्यकताहरू पालना गर्न सहमत हुनुहुन्छ। यी सर्तहरूले तपाईंसँगको कुनै पनि पूर्व लिखित सम्झौताहरू माथि प्राथमिकता पाउनेछ। यदि तपाईंले यी सर्तहरू स्वीकार गर्नुहुन्न वा आवश्यकताहरू पूरा गर्न असमर्थ हुनुहुन्छ भने, हामी अनुरोध गर्छौं कि तपाईंले सेवाहरू प्रयोग नगर्नुहोस्।"
      },
      sections: {
        "1": {
          title: "सेवाहरू",
          description: "",
          points: [
            {
              title: "प्लेटफर्म सेवाहरू",
              desc: "सेवाहरूले प्लेटफर्म प्रदान गर्दछ जसले तपाईंलाई स्वतन्त्र तेस्रो पक्ष सेवा प्रदायकहरू, जसलाई 'सेवा पेशेवरहरू' भनिन्छ, संग घर-आधारित सेवाहरूको शृंखला समन्वय र समय तालिका बनाउन सक्षम बनाउँछ। Doorsteps Nepal ले सेवा पेशेवरहरूलाई तिनीहरूले तपाईंलाई प्रदान गर्ने सेवाहरूको लागि भुक्तानी स्थानान्तरण गर्न, साथै तिनीहरूको तर्फबाट भुक्तानी संकलन गर्न सहज बनाउँछ।"
            },
            {
              title: "प्रो सेवाहरू",
              desc: "'प्रो सेवाहरू' शब्दले सेवा पेशेवरहरूले प्रदान गर्ने सेवाहरूलाई जनाउँछ। Doorsteps Nepal ले प्रो सेवाहरू प्रदान गर्दैन र तिनीहरूको वितरणको लागि जिम्मेवार हुँदैन। सेवा पेशेवरहरू प्लेटफर्म मार्फत तिनीहरूले प्रदान गर्ने प्रो सेवाहरूको लागि विशेष रूपमा जिम्मेवार हुन्छन्।"
            },
            {
              title: "व्यक्तिगत प्रयोग",
              desc: "प्लेटफर्म विशेष रूपमा तपाईंको व्यक्तिगत र गैर-वाणिज्यिक प्रयोगको लागि नियुक्त गरिएको छ, जबसम्म कि छुट्टै सम्झौताको माध्यमबाट फरक व्यवस्था स्थापित गरिएको छैन। प्लेटफर्म विशेष रूपमा नेपाल भित्र प्रयोगको लागि अभिप्रेत छ।"
            },
            {
              title: "सञ्चार",
              desc: "Doorsteps Nepal ले तपाईंलाई पाठ सन्देशहरू, इमेल, वा सन्देश पठाउने अनुप्रयोगहरू मार्फत तपाईंको बुकिङहरू, सेवाहरूसँग संलग्नता, वा प्रचारात्मक पहलहरू सम्बन्धी सञ्चार पठाउन सक्छ। तपाईंले privacy@doorstepsnepal.com मा सम्पर्क गरेर वा प्लेटफर्म सेटिङहरू समायोजन गरेर बाहिर निस्कन सक्नुहुन्छ।"
            },
            {
              title: "Doorsteps Nepal क्रेडिटहरू",
              desc: "Doorsteps Nepal ले आफ्नो विवेक अनुसार प्रचारात्मक कोडहरू ('क्रेडिटहरू') प्रदान गर्न सक्छ, जुन विशिष्ट सर्त र शर्तहरूको अधीनमा हुन्छन्। क्रेडिटहरू नगदको लागि विनिमय गर्न सकिदैनन् र कुनै पनि समयमा निष्क्रिय गर्न सकिन्छ।"
            }
          ]
        },
        "2": {
          title: "प्रयोगकर्ता सामग्री",
          description: "",
          points: [
            {
              title: "सामग्री पेश गर्ने",
              desc: "हाम्रो प्लेटफर्ममा अन्तरक्रियात्मक विशेषताहरू समावेश छन् जसले प्रयोगकर्ताहरूलाई टिप्पणीहरू, समीक्षाहरू, सुझावहरू, प्रतिक्रियाहरू, विचारहरू, वा अन्य सामग्रीहरू पोस्ट गर्न, अपलोड गर्न, प्रकाशित गर्न, प्रदर्शन गर्न, सञ्चार गर्न, वा पेश गर्न अनुमति दिन्छ।"
            },
            {
              title: "समीक्षाहरू",
              desc: "हामीले तपाईंबाट सेवा पेशेवरहरू सम्बन्धी समीक्षाहरू अनुरोध गर्न सक्छौं। सबै समीक्षाहरू ईमानदार हुनुपर्छ र जानीजानी झूटा, गलत, वा भ्रमित गर्ने हुनु हुँदैन। समीक्षाहरू गुणस्तर नियन्त्रणको लागि प्रयोग गरिन्छ।"
            },
            {
              title: "लाइसेन्स अनुदान",
              desc: "प्रयोगकर्ता सामग्री पोस्ट गरेर, तपाईंले Doorsteps Nepal लाई तपाईंको सामग्री सेवा कार्यक्षमता र विज्ञापनको लागि प्रयोग गर्न गैर-विशिष्ट, विश्वव्यापी, स्थायी, अपरिवर्तनीय, हस्तान्तरण योग्य, उप-लाइसेन्स गर्न योग्य, र रॉयल्टी-मुक्त लाइसेन्स प्रदान गर्नुहुन्छ।"
            },
            {
              title: "सामग्री हटाउने",
              desc: "Doorsteps Nepal ले पूर्व सूचना बिना यी सर्तहरू उल्लंघन गर्ने कुनै पनि प्रयोगकर्ता सामग्री हटाउन वा पहुँच प्रतिबन्धित गर्न सक्छ।"
            }
          ]
        },
        "3": {
          title: "खाता सिर्जना र जिम्मेवारी",
          description: "",
          points: [
            {
              title: "खाता आवश्यकताहरू",
              desc: "सेवाहरू प्रयोग गर्न, तपाईंले प्लेटफर्ममा खाता सिर्जना गर्नुपर्छ। तपाईं कम्तिमा १८ वर्षको हुनुपर्छ र सही जानकारी प्रदान गर्नुपर्छ।"
            },
            {
              title: "खाता सुरक्षा",
              desc: "तपाईं आफ्नो खाता सुरक्षित र गोप्य राख्न जिम्मेवार हुनुहुन्छ। यदि तपाईंको खाता विवरणहरू समझौता भएमा हामीलाई तुरुन्तै जानकारी गर्नुहोस्।"
            },
            {
              title: "खाता गतिविधिहरू",
              desc: "तपाईं आफ्नो खाता मार्फत गरिएका सबै गतिविधिहरूको लागि जिम्मेवार हुनुहुन्छ। Doorsteps Nepal ले कुनै पनि अनधिकृत पहुँच वा दुरुपयोगको लागि जिम्मेवार हुने छैन।"
            },
            {
              title: "सञ्चार",
              desc: "खाता सिर्जना गरेर, तपाईं भुक्तानीहरू, अपडेटहरू, प्रचारात्मक प्रस्तावहरू, र अन्य सेवा-सम्बन्धी जानकारी सम्बन्धी सञ्चार प्राप्त गर्न सहमत हुनुहुन्छ।"
            }
          ]
        },
        "4": {
          title: "डाटा प्रयोग गर्न सहमति",
          description: "",
          points: [
            {
              title: "डाटा संकलन",
              desc: "तपाईं सहमत हुनुहुन्छ कि Doorsteps Nepal ले हाम्रो गोपनीयता नीति अनुसार तपाईंको व्यक्तिगत डाटा संकलन र प्रयोग गर्न सक्छ।"
            },
            {
              title: "डाटा साझेदारी",
              desc: "तपाईं Doorsteps Nepal लाई सेवाहरू वितरण, विश्लेषण, र तपाईंको अनुभव सुधार गर्न सहायक कम्पनीहरू वा तेस्रो पक्ष सेवा प्रदायकहरूसँग तपाईंको जानकारी साझा गर्न सहमति दिनुहुन्छ।"
            },
            {
              title: "कानूनी अनुपालन",
              desc: "हामी आपराधिक वा नागरिक कार्यवाही सम्बन्धमा कानून प्रवर्तन एजेन्सीहरू, सरकारी प्राधिकरणहरू, वा सम्बन्धित निकायहरूसँग तपाईंको डाटा साझा गर्न बाध्य हुन सक्छौं।"
            }
          ]
        },
        "5": {
          title: "बुकिङहरू",
          description: "",
          points: [
            {
              title: "बुकिङ राख्ने",
              desc: "प्लेटफर्मले तपाईंलाई उपलब्ध स्लटहरूको आधारमा विभिन्न प्रो सेवाहरू अनुरोध गर्न अनुमति दिन्छ। हामीले तपाईंको छनौट गरिएको समयको लागि सेवा पेशेवर भेट्टाउन पूरा प्रयास गर्नेछौं।"
            },
            {
              title: "पुष्टिकरण",
              desc: "एकपटक तपाईंले बुकिङ अनुरोध राख्नुहुन्छ, तपाईंले एसएमएस, इमेल, फोन कल वा पुश सूचना मार्फत पुष्टिकरण प्राप्त गर्नुहुनेछ। भुक्तानी प्लेटफर्म सर्तहरू अनुसार गर्नुपर्छ।"
            },
            {
              title: "रद्द गर्ने",
              desc: "यदि तपाईंले बुकिङ पुष्टि हुनु अघि रद्द गर्नुहुन्छ भने, कुनै शुल्क लाग्दैन। रद्द गर्ने नीतिले पुष्टि पछि गरिएका रद्दीकरणहरूको लागि लागू शुल्कहरू रेखाङ्कन गर्दछ।"
            },
            {
              title: "प्रतिस्थापन",
              desc: "यदि चयन गरिएको सेवा पेशेवर उपलब्ध हुँदैन भने, हामीले तपाईंको बुकिङ पूरा गर्न हाम्रा दर्ता गरिएका सेवा पेशेवरहरूमध्येबाट प्रतिस्थापन प्रदान गर्नेछौं।"
            }
          ]
        },
        "6": {
          title: "मूल्य निर्धारण, शुल्क, र भुक्तानी सर्तहरू",
          description: "",
          points: [
            {
              title: "सेवा शुल्क",
              desc: "Doorsteps Nepal ले प्लेटफर्म मार्फत सेवाहरू र थप विशेषताहरूको लागि शुल्क लागू गर्ने अधिकार सुरक्षित राख्छ।"
            },
            {
              title: "प्रो सेवा शुल्क",
              desc: "प्रो सेवाहरू प्राप्त गर्दा, तपाईंले सेवा पेशेवरहरूलाई निर्दिष्ट रकम, साथै कुनै पनि थप सेवाहरू, खर्चहरू, र सामान खर्चहरू तिर्नुपर्छ।"
            },
            {
              title: "सुविधा शुल्क",
              desc: "Doorsteps Nepal ले बुकिङहरू सहज बनाउन र सेवा पेशेवरहरूलाई भुक्तानी स्थानान्तरण गर्न सुविधा शुल्क लगाउन सक्छ।"
            },
            {
              title: "भुक्तानी विधिहरू",
              desc: "भुक्तानीहरू क्रेडिट/डेबिट कार्डहरू, इन्टरनेट बैंकिङ, मोबाइल बैंकिङ, डिजिटल वालेटहरू, वा सेवा पूरा भएपछि नगद मार्फत स्वीकार गरिन्छ।"
            },
            {
              title: "कर समावेश",
              desc: "सबै शुल्क र शुल्कहरूमा लागू करहरू समावेश छन्।"
            },
            {
              title: "मूल्य भिन्नता",
              desc: "शुल्क र शुल्कहरू विशिष्ट भौगोलिक क्षेत्रहरू वा उच्च मागको अवधिहरूमा महत्त्वपूर्ण रूपमा फरक हुन सक्छन्।"
            }
          ]
        },
        "7": {
          title: "ग्राहक व्यवहार",
          description: "",
          points: [
            {
              title: "गैर-भेदभाव",
              desc: "Doorsteps Nepal ले संरक्षित विशेषताहरूको आधारमा सेवा पेशेवरहरू प्रति भेदभावको विरुद्ध कडा नीति कायम राख्छ।"
            },
            {
              title: "आदरपूर्ण व्यवहार",
              desc: "ग्राहकहरूले सबै सेवा पेशेवरहरूसँग आदर र शिष्टताको साथ व्यवहार गर्नुपर्छ, सुरक्षित र उपयुक्त वातावरण प्रदान गर्नुपर्छ।"
            },
            {
              title: "जवाफदेही",
              desc: "ग्राहकहरू भेदभावपूर्ण व्यवहार वा उचित कार्य स्थितिहरू प्रदान गर्न असफल हुनुको लागि जवाफदेही हुन्छन्।"
            },
            {
              title: "रिपोर्टिङ",
              desc: "सेवा पेशेवरहरूद्वारा अनुचित व्यवहार doorstepsnepal@gmail.com मा ४८ घण्टा भित्र रिपोर्ट गर्नुहोस्।"
            }
          ]
        },
        "8": {
          title: "तेस्रो पक्ष सेवाहरू",
          description: "",
          points: [
            {
              title: "तेस्रो पक्ष सामग्री",
              desc: "प्लेटफर्ममा तेस्रो पक्षहरूको स्वामित्वमा रहेका सेवाहरू, सामग्री, वा लिङ्कहरू हुन सक्छन्। यी सेवाहरूको प्रयोग तपाईंको आफ्नै जोखिममा हुन्छ।"
            },
            {
              title: "कुनै समर्थन नभएको",
              desc: "Doorsteps Nepal ले तेस्रो पक्ष सेवाहरू सम्बन्धी कुनै पनि प्रतिनिधित्व, वारेन्टी, वा ग्यारेन्टी दिदैन।"
            },
            {
              title: "तेस्रो पक्ष सर्तहरू",
              desc: "तेस्रो पक्ष सेवाहरू प्रयोग गरेर, तपाईं तिनीहरूका सम्बन्धित सर्त र शर्तहरूमा बाध्य हुन सहमत हुनुहुन्छ।"
            }
          ]
        },
        "9": {
          title: "तपाईंको जिम्मेवारीहरू",
          description: "",
          points: [
            {
              title: "सही जानकारी",
              desc: "तपाईंले प्रतिनिधित्व गर्नुहुन्छ कि प्रदान गरिएको सबै जानकारी सही, पूर्ण, र सत्य हो, र यदि परिवर्तनहरू आउँछ भने तुरुन्तै अद्यावधिक गर्नुहुनेछ।"
            },
            {
              title: "सहयोग",
              desc: "तपाईं यी सर्तहरू उल्लंघनबाट उत्पन्न हुने कुनै पनि दावी वा विवादहरूको सम्बोधनमा Doorsteps Nepal संग सहयोग गर्न सहमत हुनुहुन्छ।"
            },
            {
              title: "सामग्री स्वामित्व",
              desc: "तपाईंले वारेन्टी गर्नुहुन्छ कि तपाईंले प्रदान गर्नुभएको सबै प्रयोगकर्ता सामग्रीको स्वामित्व वा आवश्यक अनुमतिहरू छन्।"
            },
            {
              title: "निषेधित गतिविधिहरू",
              desc: "तपाईं सेवाहरू दुरुपयोग नगर्न, अधिकार उल्लंघन नगर्न, हानिकारक कोड अपलोड नगर्न, वा गैरकानूनी गतिविधिहरूमा संलग्न नहुन सहमत हुनुहुन्छ।"
            }
          ]
        },
        "10": {
          title: "हाम्रो बौद्धिक सम्पत्ति",
          description: "",
          points: [
            {
              title: "स्वामित्व",
              desc: "सेवाहरूमा सबै अधिकारहरू Doorsteps Nepal को स्वामित्वमा छन् वा लाइसेन्स प्राप्त छन्। तपाईंले सेवाहरू प्रयोग गर्न सीमित लाइसेन्स प्राप्त गर्नुहुन्छ।"
            },
            {
              title: "प्रतिक्रिया",
              desc: "प्रतिक्रिया प्रदान गरेर, तपाईं सहमत हुनुहुन्छ कि Doorsteps Nepal ले कुनै बाध्यता बिना स्वतन्त्र रूपमा यसलाई प्रयोग, खुलासा, र शोषण गर्न सक्छ।"
            },
            {
              title: "सुरक्षित अधिकार",
              desc: "यहाँ स्पष्ट रूपमा प्रदान नगरिएको कुनै पनि अधिकार Doorsteps Nepal वा यसका लाइसेन्सकर्ताहरूद्वारा सुरक्षित राखिएको छ।"
            }
          ]
        },
        "11": {
          title: "अवधि र समाप्ति",
          description: "",
          points: [
            {
              title: "अवधि काल",
              desc: "यी सर्तहरू यसको प्रावधान अनुसार समाप्त नहुँदासम्म लागू रहनेछ।"
            },
            {
              title: "Doorsteps Nepal द्वारा समाप्ति",
              desc: "हामीले कर्तव्य उल्लंघन, कानून उल्लंघन, वा वैध व्यवसायिक कारणहरूको लागि पहुँच प्रतिबन्धित, निलम्बित, वा समाप्त गर्न सक्छौं।"
            },
            {
              title: "तपाईंद्वारा समाप्ति",
              desc: "तपाईंले Doorsteps Nepal लाई सूचित गरेर कुनै पनि समयमा यी सर्तहरू समाप्त गर्न सक्नुहुन्छ।"
            },
            {
              title: "समाप्ति पछि",
              desc: "समाप्ति पछि, तपाईंको खाता निष्क्रिय गरिनेछ र सेवाहरूमा पहुँच रद्द गरिनेछ।"
            }
          ]
        },
        "12": {
          title: "अस्वीकरणहरू र वारेन्टीहरू",
          description: "",
          points: [
            {
              title: "जस्तो छ वस्तु",
              desc: "सेवाहरू कुनै पनि स्पष्ट वा निहित वारेन्टी बिना 'जस्तो छ' उपलब्ध गराइन्छ।"
            },
            {
              title: "प्लेटफर्म भूमिका",
              desc: "Doorsteps Nepal ले प्रयोगकर्ताहरूलाई सेवा प्रदायकहरूसँग जोड्ने प्लेटफर्मको रूपमा काम गर्दछ र तिनीहरूको प्रदर्शनको लागि जिम्मेवार हुँदैन।"
            },
            {
              title: "कुनै ग्यारेन्टी छैन",
              desc: "Doorsteps Nepal ले सेवा प्रदायकहरूको विश्वसनीयता, गुणस्तर, वा उपयुक्तताको ग्यारेन्टी दिदैन।"
            },
            {
              title: "दायित्व सीमा",
              desc: "हाम्रो दायित्व कुनै विशिष्ट बुकिङको लागि प्राप्त कमिसन भन्दा बढी हुने छैन, अधिकतम सीमा रु. १०,००० को छ।"
            }
          ]
        },
   "13": {
  title: "क्षतिपूर्ति",
  description: "तपाईं Doorsteps Nepal लाई निम्नबाट उत्पन्न हुने कुनै पनि दावी, हानि, क्षति, दायित्व, वा लागतबाट मुक्त र क्षतिपूर्ति गर्न सहमत हुनुहुन्छ:",
  points: [
    {
      title: "सेवाहरूको तपाईंको प्रयोग",
      desc: ""
    },
    {
      title: "यी सर्तहरूको उल्लंघन",
      desc: ""
    },
    {
      title: "तपाईंको कार्यहरूको परिणामस्वरूप तेस्रो पक्ष दावीहरू",
      desc: ""
    }
  ]
},
        "14": {
          title: "अधिकार क्षेत्र र विवाद समाधान",
          description: "",
          points: [
            {
              title: "शासन कानून",
              desc: "यी सर्तहरू नेपालको कानून अनुसार शासित र व्याख्या गरिनेछ।"
            },
            {
              title: "अधिकार क्षेत्र",
              desc: "काठमाडौंको अदालतहरूमा यी सर्तहरू अन्तर्गत उत्पन्न हुने विवादहरूमा विशेष अधिकार क्षेत्र हुनेछ।"
            },
            {
              title: "मध्यस्थता",
              desc: "विवादहरू नेपालको प्रचलित मध्यस्थता कानून अनुसार काठमाडौंमा मध्यस्थता मार्फत समाधान गरिनेछ।"
            }
          ]
        },
        "15": {
          title: "शिकायत समाधान",
          description: "Doorsteps Nepal ले लागू कानूनद्वारा निर्धारित समय सीमा भित्र शिकायतहरू समाधान गर्न प्रयास गर्नेछ।",
          points: []
        },
        "16": {
          title: "विविध प्रावधानहरू",
          description: "",
          points: [
            {
              title: "सर्तहरूमा परिवर्तन",
              desc: "Doorsteps Nepal ले कुनै पनि समयमा यी सर्तहरू संशोधन गर्ने अधिकार सुरक्षित राख्छ, परिवर्तनहरू पोस्ट हुँदा प्रभावी हुनेछ।"
            },
            {
              title: "सेवा संशोधन",
              desc: "Doorsteps Nepal ले आफ्नो विवेक अनुसार सेवाहरू संशोधन वा समाप्त गर्न सक्छ कुनै दायित्व बिना।"
            },
            {
              title: "पृथक्करण",
              desc: "यदि कुनै प्रावधान गैरकानूनी वा लागू गर्न योग्य भेटिन्छ भने, बाँकी प्रावधानहरू प्रभावमा रहनेछन्।"
            },
            {
              title: "हस्तान्तरण",
              desc: "तपाईंले हाम्रो पूर्व लिखित सहमति बिना आफ्नो अधिकार हस्तान्तरण गर्न सक्नुहुन्न। हामी सूचना बिना आफ्नो अधिकार हस्तान्तरण गर्न सक्छौं।"
            },
            {
              title: "अप्रत्याशित परिस्थिति",
              desc: "यदि हामी हाम्रो वाजवे नियन्त्रण बाहिरको परिस्थितिहरूको कारण कर्तव्यहरू पूरा गर्न असमर्थ छौं भने हाम्रो दायित्व रद्द हुनेछ।"
            }
          ]
        }
      },
      tableOfContents: [
        { num: "1", title: "सेवाहरू", icon: BookOpen },
        { num: "2", title: "प्रयोगकर्ता सामग्री", icon: MessageSquare },
        { num: "3", title: "खाता सिर्जना", icon: UserCheck },
        { num: "4", title: "डाटा सहमति", icon: Shield },
        { num: "5", title: "बुकिङहरू", icon: FileText },
        { num: "6", title: "मूल्य निर्धारण र भुक्तानी", icon: DollarSign },
        { num: "7", title: "ग्राहक व्यवहार", icon: Users },
        { num: "8", title: "तेस्रो पक्ष सेवाहरू", icon: Globe },
        { num: "9", title: "तपाईंको जिम्मेवारी", icon: AlertCircle },
        { num: "10", title: "बौद्धिक सम्पत्ति", icon: Shield },
        { num: "11", title: "अवधि र समाप्ति", icon: RefreshCw },
        { num: "12", title: "अस्वीकरणहरू", icon: AlertCircle },
        { num: "13", title: "क्षतिपूर्ति", icon: Shield },
        { num: "14", title: "अधिकार क्षेत्र", icon: Scale },
        { num: "15", title: "शिकायत समाधान", icon: Mail },
        { num: "16", title: "विविध", icon: FileText },
      ],
      footer: {
        title: "हाम्रा सर्तहरू बुझ्न मद्दत चाहिन्छ?",
        subtitle: "यी सर्त र शर्तहरूको कुनै पनि पक्षको स्पष्टीकरणको लागि हाम्रो कानूनी टीमलाई सम्पर्क गर्नुहोस्",
        button: "कानूनी टीमलाई सम्पर्क गर्नुहोस्"
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
                <BookOpen className="h-8 w-8 text-primary" />
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
                    <BookOpen className="h-6 w-6 text-primary" />
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

              {/* Binding Agreement Card */}
              <Card className="mb-8 border-blue-200 dark:border-blue-800 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <Scale className="h-6 w-6 text-blue-600" />
                    {current.bindingAgreement.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {current.bindingAgreement.description}
                  </p>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mt-4">
                    <p className="text-blue-700 dark:text-blue-300">
                      {current.bindingAgreement.acceptance}
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

              {/* Terms Sections */}
              <div className="space-y-12">
                {Object.entries(current.sections).map(([sectionNum, section]) => (
                  <section key={sectionNum} id={`section-${sectionNum}`} className="scroll-mt-24">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                        <span className="font-bold text-primary">{sectionNum}</span>
                      </div>
                      <h2 className="text-2xl font-bold">{section.title}</h2>
                    </div>
                    <Card>
                      <CardContent className="pt-6">
                        {section.description && (
                          <p className="mb-4 text-muted-foreground">
                            {section.description}
                          </p>
                        )}
                        
                        {Array.isArray(section.points) && section.points.length > 0 && (
                          <div className="space-y-4">
                            {section.points.map((point, index) => (
                              <div key={index} className="flex items-start gap-3">
                                <div className="w-2 h-2 rounded-full bg-primary mt-2.5 flex-shrink-0"></div>
                                <div>
                                  <strong className="font-semibold">{point.title}:</strong>{" "}
                                  <span className="text-muted-foreground">{point.desc}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </section>
                ))}
              </div>

              {/* Footer Note */}
              <div className="mt-12 p-6 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-lg mb-1">{current.footer.title}</h3>
                    <p className="text-sm text-muted-foreground">{current.footer.subtitle}</p>
                  </div>
                  <a 
                    href={`mailto:legal@doorstepsnepal.com`}
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
 
 
 