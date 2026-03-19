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
  Heart,
  AlertOctagon,
  Users2,
  Building2,
  GraduationCap,
  Home,
  Sparkles,
  Ambulance,
  Gavel,
  ClipboardCheck,
  FileWarning,
  Scale,
  Calendar,
  HelpCircle,
  DollarSign,
  CreditCard,
  CalendarClock,
  XCircle,
  CheckCircle2,
  AlertCircleIcon,
  Smartphone,
  Landmark,
  Receipt,
  Scale3D,
  ShieldAlert,
  HelpCircleIcon,
  Edit3,
  PhoneCall,
  Truck,
  Package,
  Timer,
  Ban as BanIcon,
  RefreshCcw,
  Wallet,
  Clock3,
  CalendarDays,
  AlertTriangle as AlertTriangleIcon,
  FileSearch,
  MessageCircle,
  Phone,
  MailQuestion,
  PenTool
} from "lucide-react";
import { useI18n } from '@/lib/i18n/context';
import { Footer } from "@/components/layout/footer";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";

export default function CancellationRefundPolicyPage() {
  const { locale } = useI18n();
  const pathname = usePathname();
  const router = useRouter();

  // Function to handle scroll to section
  const scrollToSection = (sectionId: string) => {
    if (pathname === "/about") {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      router.push(`/about#${sectionId}`);
    }
  };

  // Bilingual content for cancellation and refund policy
  const content = {
    en: {
      hero: {
        title: "Cancellation & Refund Policy",
        subtitle: "Clear guidelines for cancellations, refunds, and dispute resolution for Door Steps Nepal services",
        lastUpdated: "Last Updated: December 2023",
        version: "Version 1.5"
      },
      introduction: {
        title: "Understanding Our Refund & Cancellation Policy",
        description: `This Refund & Cancellation Policy applies to all service bookings made through Doorsteps Nepal (the "Platform"), including bookings placed via the website, mobile application, or any other official booking channel operated by Doorsteps Nepal.`,
        note: "This policy governs cancellations, rescheduling, and refund eligibility for customers and applies only to services booked and paid for through the Platform. Services arranged outside the Platform or payments made directly to service professionals may not be covered under this policy."
      },
      sections: {
        "1": {
          title: "Scope",
          description: "Applicability of this policy:",
          points: [
            { 
              title: "Platform Bookings", 
              desc: "This policy applies to all service bookings made through Doorsteps Nepal's website, mobile application, or any other official booking channel.",
              neDesc: "यो नीति Doorsteps Nepal को वेबसाइट, मोबाइल एप्लिकेशन, वा कुनै अन्य आधिकारिक बुकिङ च्यानल मार्फत गरिएका सबै सेवा बुकिङहरूमा लागू हुन्छ।"
            },
            { 
              title: "Covered Services", 
              desc: "Only services booked and paid for through the Platform are covered under this policy.",
              neDesc: "प्लेटफर्म मार्फत बुक र भुक्तानी गरिएका सेवाहरू मात्र यस नीति अन्तर्गत कभर हुन्छन्।"
            },
            { 
              title: "Exclusions", 
              desc: "Services arranged outside the Platform or payments made directly to service professionals may not be covered under this policy.",
              neDesc: "प्लेटफर्म बाहिर व्यवस्था गरिएका सेवाहरू वा सिधै सेवा प्रदायकलाई गरिएको भुक्तानी यस नीति अन्तर्गत कभर नहुन सक्छ।"
            }
          ]
        },
        "2": {
          title: "Definitions",
          description: "Key terms explained:",
          points: [
            { 
              title: "Booking", 
              desc: "Scheduled service confirmed by the customer on the Platform.",
              neDesc: "प्लेटफर्ममा ग्राहकद्वारा पुष्टि गरिएको अनुसूचित सेवा।"
            },
            { 
              title: "Service Professional", 
              desc: "The individual or team assigned to perform the booked service.",
              neDesc: "बुक गरिएको सेवा प्रदर्शन गर्न तोकिएको व्यक्ति वा टोली।"
            },
            { 
              title: "Service Fee", 
              desc: "Total amount paid by customer for the booking (service charge + taxes + add-ons).",
              neDesc: "बुकिङको लागि ग्राहकद्वारा भुक्तान गरिएको कुल रकम (सेवा शुल्क + कर + एड-अनहरू)।"
            },
            { 
              title: "Marketplace Fee", 
              desc: "Portion retained by Doorsteps Nepal as facilitation/administration fee.",
              neDesc: "Doorsteps Nepal द्वारा सहजीकरण/प्रशासन शुल्कको रूपमा राखिएको भाग।"
            }
          ]
        },
        "3": {
          title: "Cancellation by Customer",
          description: "Refund eligibility based on cancellation timing:",
          points: [
            { 
              title: "Full Refund (≥24 hours)", 
              desc: "If a customer cancels ≥ 24 hours before the scheduled start time, they will receive a full refund of the Service Fee, minus any non-refundable third-party costs (e.g., pre-purchased parts).",
              neDesc: "यदि ग्राहकले तोकिएको सुरु हुने समय भन्दा २४ घण्टा अघि रद्द गरेमा, उसले सेवा शुल्कको पूर्ण फिर्ता पाउनेछ, कुनै पनि गैर-फिर्ता योग्य तेस्रो-पक्ष लागतहरू (जस्तै, पूर्व-खरीद गरिएका पार्ट्स) घटाएर।"
            },
            { 
              title: "Partial Refund (6-24 hours)", 
              desc: "If a customer cancels between 6 to 24 hours before the scheduled start time, they will receive a 50% refund of the Service Fee (the remaining 50% covers professional cancellation and scheduling loss).",
              neDesc: "यदि ग्राहकले तोकिएको सुरु हुने समय भन्दा ६ देखि २४ घण्टा बीचमा रद्द गरेमा, उसले सेवा शुल्कको ५०% फिर्ता पाउनेछ (बाँकी ५०% प्रोफेशनल रद्द र तालिकीकरण हानि कभर गर्दछ)।"
            },
            { 
              title: "No Refund (≤6 hours)", 
              desc: "If a customer cancels ≤ 6 hours before the scheduled start or does not answer the phone when the professional arrives (no-show), no monetary refund will be issued. The customer may receive a booking credit valid for 90 days if requested within 48 hours and at Doorsteps Nepal's discretion.",
              neDesc: "यदि ग्राहकले तोकिएको सुरु हुने समय भन्दा ६ घण्टा भित्र रद्द गरेमा वा प्रोफेशनल आउँदा फोन नउठाएमा (अनुपस्थित), कुनै आर्थिक फिर्ता जारी गरिने छैन। ग्राहकले ४८ घण्टा भित्र अनुरोध गरेमा र Doorsteps Nepal को विवेकमा ९० दिनको लागि मान्य बुकिङ क्रेडिट प्राप्त गर्न सक्छ।"
            },
            { 
              title: "Same-day Bookings", 
              desc: "For bookings made less than 12 hours before service time, cancellations are eligible only for partial refund or credit as described above.",
              neDesc: "सेवा समय भन्दा १२ घण्टा भन्दा कम अघि गरिएका बुकिङहरूको लागि, रद्दहरू माथि वर्णन गरिए अनुसार आंशिक फिर्ता वा क्रेडिटको लागि मात्र योग्य छन्।"
            }
          ]
        },
        "4": {
          title: "Cancellation by Service Professional or Doorsteps Nepal",
          description: "When we or professionals cancel:",
          points: [
            { 
              title: "Professional Cancellation", 
              desc: "If a Service Professional cancels before arrival, the customer will be offered: (a) a full refund, or (b) the option to rebook another professional at no extra rebooking charge.",
              neDesc: "यदि सेवा प्रदायक आगमन अघि रद्द गरेमा, ग्राहकलाई प्रस्ताव गरिनेछ: (क) पूर्ण फिर्ता, वा (ख) कुनै अतिरिक्त पुन: बुकिङ शुल्क बिना अर्को प्रोफेशनल पुन: बुक गर्ने विकल्प।"
            },
            { 
              title: "Platform Cancellation", 
              desc: "If Doorsteps Nepal cancels due to unforeseen circumstances (e.g., extreme weather, legal restriction), the customer will be offered a full refund or a reschedule.",
              neDesc: "यदि Doorsteps Nepal ले अप्रत्याशित परिस्थितिहरू (जस्तै, चरम मौसम, कानुनी प्रतिबन्ध) को कारण रद्द गरेमा, ग्राहकलाई पूर्ण फिर्ता वा पुन: तालिकीकरणको प्रस्ताव गरिनेछ।"
            }
          ]
        },
        "5": {
          title: "Failed or Unsatisfactory Service",
          description: "When service quality doesn't meet expectations:",
          points: [
            { 
              title: "Reporting Window", 
              desc: "If service is not completed satisfactorily, the customer must notify Doorsteps Nepal within 48 hours via doorstepnepal@gmail.com or phone.",
              neDesc: "यदि सेवा सन्तोषजनक रूपमा पूरा भएन भने, ग्राहकले ४८ घण्टा भित्र doorstepnepal@gmail.com वा फोन मार्फत Doorsteps Nepal लाई सूचित गर्नुपर्छ।"
            },
            { 
              title: "Investigation & Remedies", 
              desc: "Doorsteps Nepal will investigate and may offer: (a) repeat service at no extra charge, (b) partial refund proportional to unperformed or unsatisfactory portion, or (c) full refund where appropriate. Investigation normally completes within 5 business days.",
              neDesc: "Doorsteps Nepal ले अनुसन्धान गर्नेछ र प्रस्ताव गर्न सक्छ: (क) कुनै अतिरिक्त शुल्क बिना पुन: सेवा, (ख) नगरिएको वा असन्तोषजनक भागको अनुपातमा आंशिक फिर्ता, वा (ग) उपयुक्त ठाउँमा पूर्ण फिर्ता। अनुसन्धान सामान्यतया ५ कार्य दिन भित्र पूरा हुन्छ।"
            }
          ]
        },
        "6": {
          title: "No-Shows & Access Issues",
          description: "When customer isn't available for service:",
          points: [
            { 
              title: "Customer No-Show", 
              desc: "If the customer is not present or does not provide access at the scheduled time and the professional waits and then leaves, the booking is considered a no-show. No refund will be issued.",
              neDesc: "यदि ग्राहक उपस्थित छैन वा तोकिएको समयमा पहुँच प्रदान गर्दैन र प्रोफेशनल पर्खन्छ र त्यसपछि जान्छ भने, बुकिङलाई अनुपस्थित मानिन्छ। कुनै फिर्ता जारी गरिने छैन।"
            },
            { 
              title: "Delayed Access", 
              desc: "If the professional waits and later completes the job, normal charges apply.",
              neDesc: "यदि प्रोफेशनल पर्खन्छ र पछि काम पूरा गर्दछ भने, सामान्य शुल्क लागू हुन्छ।"
            }
          ]
        },
        "7": {
          title: "Add-on Products & Parts",
          description: "Refund rules for purchased materials:",
          points: [
            { 
              title: "Non-Refundable Parts", 
              desc: "Charges for consumables or parts purchased specifically for a booking are non-refundable once the parts are purchased.",
              neDesc: "एक बुकिङको लागि विशेष रूपमा खरीद गरिएका उपभोग्य वस्तुहरू वा पार्ट्सको शुल्क पार्ट्स खरीद गरिसकेपछि फिर्ता योग्य हुँदैन।"
            },
            { 
              title: "Returnable Items", 
              desc: "If the part is unused and returnable, refunds may be processed after provider confirmation and any supplier restocking fees.",
              neDesc: "यदि पार्ट प्रयोग नगरिएको र फिर्ता योग्य छ भने, प्रदायक पुष्टि र कुनै आपूर्तिकर्ता पुन: स्टकिङ शुल्क पछि फिर्ता प्रक्रिया हुन सक्छ।"
            }
          ]
        },
        "8": {
          title: "How refunds are processed & timelines",
          description: "Refund methods and expected timeframes:",
          points: [
            { 
              title: "Same Method", 
              desc: "Refunds will be issued back to the original payment method whenever possible.",
              neDesc: "फिर्ता सम्भव भएसम्म मूल भुक्तानी विधिमा फिर्ता जारी गरिनेछ।"
            },
            { 
              title: "E-wallets", 
              desc: "eSewa/Khalti/IME Pay: refunds processed within 48–72 hours business days.",
              neDesc: "eSewa/Khalti/IME Pay: फिर्ता ४८-७२ कार्य घण्टा भित्र प्रक्रिया गरिन्छ।"
            },
            { 
              title: "Bank Transfer", 
              desc: "Bank transfer / debit-card: refunds processed within 3–7 business days depending on bank.",
              neDesc: "बैंक ट्रान्सफर / डेबिट-कार्ड: फिर्ता बैंकमा निर्भर गर्दै ३-७ कार्य दिन भित्र प्रक्रिया गरिन्छ।"
            },
            { 
              title: "Cash Payments", 
              desc: "Cash payments: refunds will be issued as bank transfer or e-wallet credit after verification; please allow 3–7 business days.",
              neDesc: "नगद भुक्तानी: फिर्ता प्रमाणीकरण पछि बैंक ट्रान्सफर वा ई-वालेट क्रेडिटको रूपमा जारी गरिनेछ; कृपया ३-७ कार्य दिन दिनुहोस्।"
            },
            { 
              title: "Notification", 
              desc: "Doorsteps Nepal will notify customers by email/SMS when refund is initiated.",
              neDesc: "Doorsteps Nepal ले फिर्ता सुरु गर्दा ग्राहकहरूलाई इमेल/एसएमएस द्वारा सूचित गर्नेछ।"
            }
          ]
        },
        "9": {
          title: "Marketplace Fee & Taxes",
          description: "Understanding non-refundable portions:",
          points: [
            { 
              title: "Non-Refundable Fees", 
              desc: "Marketplace facilitation fees and applicable taxes may be non-refundable if the service professional already performed work or Doorsteps Nepal already disbursed funds to the professional.",
              neDesc: "बजार सहजीकरण शुल्क र लागू करहरू गैर-फिर्ता योग्य हुन सक्छन् यदि सेवा प्रदायकले पहिले नै काम गरेको छ वा Doorsteps Nepal ले पहिले नै प्रोफेशनललाई रकम भुक्तान गरेको छ।"
            },
            { 
              title: "Refund Calculation", 
              desc: "The policy above explains which portion is refundable in each cancellation window.",
              neDesc: "माथिको नीतिले प्रत्येक रद्द विन्डोमा कुन भाग फिर्ता योग्य छ भनेर व्याख्या गर्दछ।"
            }
          ]
        },
        "10": {
          title: "Disputes",
          description: "Process for disputing refund decisions:",
          points: [
            { 
              title: "Escalation Process", 
              desc: "If the customer disagrees with the refund decision, they may escalate by emailing doorstepnepal@gmail.com with booking ID and supporting photos/receipts within 7 days of the incident.",
              neDesc: "यदि ग्राहक फिर्ता निर्णयसँग असहमत छ भने, उनीहरूले घटनाको ७ दिन भित्र बुकिङ आईडी र समर्थन फोटो/रसिदहरू सहित doorstepnepal@gmail.com मा इमेल गरेर विवाद बढाउन सक्छन्।"
            },
            { 
              title: "Resolution Timeline", 
              desc: "Doorsteps Nepal will respond within 5 business days with a final resolution.",
              neDesc: "Doorsteps Nepal ले ५ कार्य दिन भित्र अन्तिम समाधानको साथ जवाफ दिनेछ।"
            }
          ]
        },
        "11": {
          title: "Exceptions & Emergencies",
          description: "Special circumstances:",
          points: [
            { 
              title: "Case-by-Case Handling", 
              desc: "Medical emergencies, natural disasters, or government restrictions will be handled case-by-case and Doorsteps Nepal may waive fees/refund fully at its discretion.",
              neDesc: "चिकित्सा आपतकालिन, प्राकृतिक प्रकोप, वा सरकारी प्रतिबन्धहरू केस-दर-केस ह्यान्डल गरिनेछ र Doorsteps Nepal ले आफ्नो विवेकमा शुल्क माफ गर्न/पूर्ण रूपमा फिर्ता गर्न सक्छ।"
            }
          ]
        },
        "12": {
          title: "Fraud prevention",
          description: "Protecting against abuse:",
          points: [
            { 
              title: "Verification Hold", 
              desc: "Refunds may be withheld pending verification if Doorsteps Nepal suspects fraud or abuse.",
              neDesc: "यदि Doorsteps Nepal ले धोखाधडी वा दुरुपयोगको शंका गरेमा फिर्ता प्रमाणीकरणको लागि रोकिन सक्छ।"
            },
            { 
              title: "Account Suspension", 
              desc: "Any fraudulent activity may lead to account suspension.",
              neDesc: "कुनै पनि धोखाधडी गतिविधिले खाता निलम्बन हुन सक्छ।"
            }
          ]
        },
        "13": {
          title: "How to request a refund",
          description: "Contact information for refund requests:",
          points: [
            { 
              title: "Email", 
              desc: "doorstepnepal@gmail.com (subject: Refund Request – Booking #XXXXX)",
              neDesc: "doorstepnepal@gmail.com (विषय: फिर्ता अनुरोध – बुकिङ #XXXXX)"
            },
            { 
              title: "Phone / WhatsApp", 
              desc: "9851407706 / 9851407707",
              neDesc: "९८५१४०७७०६ / ९८५१४०७७०७"
            },
            { 
              title: "Required Information", 
              desc: "Include booking ID, date/time, reason, and photos if relevant.",
              neDesc: "बुकिङ आईडी, मिति/समय, कारण, र सान्दर्भिक भएमा फोटोहरू समावेश गर्नुहोस्।"
            }
          ]
        },
        "14": {
          title: "Changes to this policy",
          description: "How updates are handled:",
          points: [
            { 
              title: "Official Version", 
              desc: "Doorsteps Nepal may update this policy. The version published on the website is authoritative.",
              neDesc: "Doorsteps Nepal ले यो नीति अद्यावधिक गर्न सक्छ। वेबसाइटमा प्रकाशित संस्करण आधिकारिक छ।"
            },
            { 
              title: "Notification", 
              desc: "We will notify registered customers by email of material changes.",
              neDesc: "हामी दर्ता ग्राहकहरूलाई इमेल द्वारा महत्वपूर्ण परिवर्तनहरूको सूचना दिनेछौं।"
            }
          ]
        }
      },
      tableOfContents: [
        { num: "1", title: "Scope", icon: Globe },
        { num: "2", title: "Definitions", icon: FileText },
        { num: "3", title: "Cancellation by Customer", icon: XCircle },
        { num: "4", title: "Cancellation by Professional/Platform", icon: BanIcon },
        { num: "5", title: "Failed or Unsatisfactory Service", icon: AlertCircleIcon },
        { num: "6", title: "No-Shows & Access Issues", icon: PhoneCall },
        { num: "7", title: "Add-on Products & Parts", icon: Package },
        { num: "8", title: "Refund Processing & Timelines", icon: Timer },
        { num: "9", title: "Marketplace Fee & Taxes", icon: Receipt },
        { num: "10", title: "Disputes", icon: Scale3D },
        { num: "11", title: "Exceptions & Emergencies", icon: AlertTriangleIcon },
        { num: "12", title: "Fraud Prevention", icon: ShieldAlert },
        { num: "13", title: "How to Request a Refund", icon: MailQuestion },
        { num: "14", title: "Policy Updates", icon: RefreshCcw }
      ],
      footer: {
        title: "Questions About Refunds or Cancellations?",
        subtitle: "Contact our customer support team for assistance with any refund or cancellation requests",
        button: "Contact Support Team"
      },
      backToTop: "Back to Top",
      grievance: {
        title: "Refund & Cancellation Support",
        email: "refunds@doorstepsnepal.com",
        response: "We aim to respond to all refund inquiries within 24 hours",
        support: [
          { title: "Refund Requests", email: "refunds@doorstepsnepal.com" },
          { title: "Cancellation Issues", email: "cancellations@doorstepsnepal.com" },
          { title: "Dispute Resolution", email: "disputes@doorstepsnepal.com" },
          { title: "General Support", email: "support@doorstepsnepal.com" }
        ]
      }
    },
    ne: {
      hero: {
        title: "रद्द र फिर्ता नीति",
        subtitle: "Door Steps Nepal सेवाहरूको लागि रद्द, फिर्ता, र विवाद समाधान सम्बन्धी स्पष्ट दिशानिर्देशहरू",
        lastUpdated: "अन्तिम अद्यावधिक: डिसेम्बर २०२३",
        version: "संस्करण १.५"
      },
      introduction: {
        title: "हाम्रो फिर्ता र रद्द नीति बुझ्दै",
        description: `यो फिर्ता र रद्द नीति Doorsteps Nepal ( "प्लेटफर्म") मार्फत गरिएका सबै सेवा बुकिङहरूमा लागू हुन्छ, जसमा वेबसाइट, मोबाइल एप्लिकेशन, वा Doorsteps Nepal द्वारा संचालित कुनै अन्य आधिकारिक बुकिङ च्यानल मार्फत गरिएका बुकिङहरू समावेश छन्।`,
        note: "यो नीतिले ग्राहकहरूको लागि रद्द, पुन: तालिकीकरण, र फिर्ता योग्यता नियन्त्रण गर्दछ र प्लेटफर्म मार्फत बुक र भुक्तानी गरिएका सेवाहरूमा मात्र लागू हुन्छ। प्लेटफर्म बाहिर व्यवस्था गरिएका सेवाहरू वा सिधै सेवा प्रदायकलाई गरिएको भुक्तानी यस नीति अन्तर्गत कभर नहुन सक्छ।"
      },
      sections: {
        "1": {
          title: "दायरा",
          description: "यस नीतिको प्रयोज्यता:",
          points: [
            { 
              title: "प्लेटफर्म बुकिङहरू", 
              desc: "यो नीति Doorsteps Nepal को वेबसाइट, मोबाइल एप्लिकेशन, वा कुनै अन्य आधिकारिक बुकिङ च्यानल मार्फत गरिएका सबै सेवा बुकिङहरूमा लागू हुन्छ।",
              neDesc: "यो नीति Doorsteps Nepal को वेबसाइट, मोबाइल एप्लिकेशन, वा कुनै अन्य आधिकारिक बुकिङ च्यानल मार्फत गरिएका सबै सेवा बुकिङहरूमा लागू हुन्छ।"
            },
            { 
              title: "कभर गरिएका सेवाहरू", 
              desc: "प्लेटफर्म मार्फत बुक र भुक्तानी गरिएका सेवाहरू मात्र यस नीति अन्तर्गत कभर हुन्छन्।",
              neDesc: "प्लेटफर्म मार्फत बुक र भुक्तानी गरिएका सेवाहरू मात्र यस नीति अन्तर्गत कभर हुन्छन्।"
            },
            { 
              title: "बहिष्करणहरू", 
              desc: "प्लेटफर्म बाहिर व्यवस्था गरिएका सेवाहरू वा सिधै सेवा प्रदायकलाई गरिएको भुक्तानी यस नीति अन्तर्गत कभर नहुन सक्छ।",
              neDesc: "प्लेटफर्म बाहिर व्यवस्था गरिएका सेवाहरू वा सिधै सेवा प्रदायकलाई गरिएको भुक्तानी यस नीति अन्तर्गत कभर नहुन सक्छ।"
            }
          ]
        },
        "2": {
          title: "परिभाषाहरू",
          description: "मुख्य शर्तहरू व्याख्या गरियो:",
          points: [
            { 
              title: "बुकिङ", 
              desc: "प्लेटफर्ममा ग्राहकद्वारा पुष्टि गरिएको अनुसूचित सेवा।",
              neDesc: "प्लेटफर्ममा ग्राहकद्वारा पुष्टि गरिएको अनुसूचित सेवा।"
            },
            { 
              title: "सेवा प्रदायक", 
              desc: "बुक गरिएको सेवा प्रदर्शन गर्न तोकिएको व्यक्ति वा टोली।",
              neDesc: "बुक गरिएको सेवा प्रदर्शन गर्न तोकिएको व्यक्ति वा टोली।"
            },
            { 
              title: "सेवा शुल्क", 
              desc: "बुकिङको लागि ग्राहकद्वारा भुक्तान गरिएको कुल रकम (सेवा शुल्क + कर + एड-अनहरू)।",
              neDesc: "बुकिङको लागि ग्राहकद्वारा भुक्तान गरिएको कुल रकम (सेवा शुल्क + कर + एड-अनहरू)।"
            },
            { 
              title: "बजार शुल्क", 
              desc: "Doorsteps Nepal द्वारा सहजीकरण/प्रशासन शुल्कको रूपमा राखिएको भाग।",
              neDesc: "Doorsteps Nepal द्वारा सहजीकरण/प्रशासन शुल्कको रूपमा राखिएको भाग।"
            }
          ]
        },
        "3": {
          title: "ग्राहकद्वारा रद्द",
          description: "रद्द समयको आधारमा फिर्ता योग्यता:",
          points: [
            { 
              title: "पूर्ण फिर्ता (≥२४ घण्टा)", 
              desc: "यदि ग्राहकले तोकिएको सुरु हुने समय भन्दा २४ घण्टा अघि रद्द गरेमा, उसले सेवा शुल्कको पूर्ण फिर्ता पाउनेछ, कुनै पनि गैर-फिर्ता योग्य तेस्रो-पक्ष लागतहरू (जस्तै, पूर्व-खरीद गरिएका पार्ट्स) घटाएर।",
              neDesc: "यदि ग्राहकले तोकिएको सुरु हुने समय भन्दा २४ घण्टा अघि रद्द गरेमा, उसले सेवा शुल्कको पूर्ण फिर्ता पाउनेछ, कुनै पनि गैर-फिर्ता योग्य तेस्रो-पक्ष लागतहरू (जस्तै, पूर्व-खरीद गरिएका पार्ट्स) घटाएर।"
            },
            { 
              title: "आंशिक फिर्ता (६-२४ घण्टा)", 
              desc: "यदि ग्राहकले तोकिएको सुरु हुने समय भन्दा ६ देखि २४ घण्टा बीचमा रद्द गरेमा, उसले सेवा शुल्कको ५०% फिर्ता पाउनेछ (बाँकी ५०% प्रोफेशनल रद्द र तालिकीकरण हानि कभर गर्दछ)।",
              neDesc: "यदि ग्राहकले तोकिएको सुरु हुने समय भन्दा ६ देखि २४ घण्टा बीचमा रद्द गरेमा, उसले सेवा शुल्कको ५०% फिर्ता पाउनेछ (बाँकी ५०% प्रोफेशनल रद्द र तालिकीकरण हानि कभर गर्दछ)।"
            },
            { 
              title: "कुनै फिर्ता छैन (≤६ घण्टा)", 
              desc: "यदि ग्राहकले तोकिएको सुरु हुने समय भन्दा ६ घण्टा भित्र रद्द गरेमा वा प्रोफेशनल आउँदा फोन नउठाएमा (अनुपस्थित), कुनै आर्थिक फिर्ता जारी गरिने छैन। ग्राहकले ४८ घण्टा भित्र अनुरोध गरेमा र Doorsteps Nepal को विवेकमा ९० दिनको लागि मान्य बुकिङ क्रेडिट प्राप्त गर्न सक्छ।",
              neDesc: "यदि ग्राहकले तोकिएको सुरु हुने समय भन्दा ६ घण्टा भित्र रद्द गरेमा वा प्रोफेशनल आउँदा फोन नउठाएमा (अनुपस्थित), कुनै आर्थिक फिर्ता जारी गरिने छैन। ग्राहकले ४८ घण्टा भित्र अनुरोध गरेमा र Doorsteps Nepal को विवेकमा ९० दिनको लागि मान्य बुकिङ क्रेडिट प्राप्त गर्न सक्छ।"
            },
            { 
              title: "सोही-दिन बुकिङहरू", 
              desc: "सेवा समय भन्दा १२ घण्टा भन्दा कम अघि गरिएका बुकिङहरूको लागि, रद्दहरू माथि वर्णन गरिए अनुसार आंशिक फिर्ता वा क्रेडिटको लागि मात्र योग्य छन्।",
              neDesc: "सेवा समय भन्दा १२ घण्टा भन्दा कम अघि गरिएका बुकिङहरूको लागि, रद्दहरू माथि वर्णन गरिए अनुसार आंशिक फिर्ता वा क्रेडिटको लागि मात्र योग्य छन्।"
            }
          ]
        },
        "4": {
          title: "सेवा प्रदायक वा Doorsteps Nepal द्वारा रद्द",
          description: "जब हामी वा प्रोफेशनलहरू रद्द गर्छन्:",
          points: [
            { 
              title: "प्रोफेशनल रद्द", 
              desc: "यदि सेवा प्रदायक आगमन अघि रद्द गरेमा, ग्राहकलाई प्रस्ताव गरिनेछ: (क) पूर्ण फिर्ता, वा (ख) कुनै अतिरिक्त पुन: बुकिङ शुल्क बिना अर्को प्रोफेशनल पुन: बुक गर्ने विकल्प।",
              neDesc: "यदि सेवा प्रदायक आगमन अघि रद्द गरेमा, ग्राहकलाई प्रस्ताव गरिनेछ: (क) पूर्ण फिर्ता, वा (ख) कुनै अतिरिक्त पुन: बुकिङ शुल्क बिना अर्को प्रोफेशनल पुन: बुक गर्ने विकल्प।"
            },
            { 
              title: "प्लेटफर्म रद्द", 
              desc: "यदि Doorsteps Nepal ले अप्रत्याशित परिस्थितिहरू (जस्तै, चरम मौसम, कानुनी प्रतिबन्ध) को कारण रद्द गरेमा, ग्राहकलाई पूर्ण फिर्ता वा पुन: तालिकीकरणको प्रस्ताव गरिनेछ।",
              neDesc: "यदि Doorsteps Nepal ले अप्रत्याशित परिस्थितिहरू (जस्तै, चरम मौसम, कानुनी प्रतिबन्ध) को कारण रद्द गरेमा, ग्राहकलाई पूर्ण फिर्ता वा पुन: तालिकीकरणको प्रस्ताव गरिनेछ।"
            }
          ]
        },
        "5": {
          title: "असफल वा असन्तोषजनक सेवा",
          description: "जब सेवा गुणस्तर अपेक्षा अनुसार हुँदैन:",
          points: [
            { 
              title: "रिपोर्टिङ विन्डो", 
              desc: "यदि सेवा सन्तोषजनक रूपमा पूरा भएन भने, ग्राहकले ४८ घण्टा भित्र doorstepnepal@gmail.com वा फोन मार्फत Doorsteps Nepal लाई सूचित गर्नुपर्छ।",
              neDesc: "यदि सेवा सन्तोषजनक रूपमा पूरा भएन भने, ग्राहकले ४८ घण्टा भित्र doorstepnepal@gmail.com वा फोन मार्फत Doorsteps Nepal लाई सूचित गर्नुपर्छ।"
            },
            { 
              title: "अनुसन्धान र उपचार", 
              desc: "Doorsteps Nepal ले अनुसन्धान गर्नेछ र प्रस्ताव गर्न सक्छ: (क) कुनै अतिरिक्त शुल्क बिना पुन: सेवा, (ख) नगरिएको वा असन्तोषजनक भागको अनुपातमा आंशिक फिर्ता, वा (ग) उपयुक्त ठाउँमा पूर्ण फिर्ता। अनुसन्धान सामान्यतया ५ कार्य दिन भित्र पूरा हुन्छ।",
              neDesc: "Doorsteps Nepal ले अनुसन्धान गर्नेछ र प्रस्ताव गर्न सक्छ: (क) कुनै अतिरिक्त शुल्क बिना पुन: सेवा, (ख) नगरिएको वा असन्तोषजनक भागको अनुपातमा आंशिक फिर्ता, वा (ग) उपयुक्त ठाउँमा पूर्ण फिर्ता। अनुसन्धान सामान्यतया ५ कार्य दिन भित्र पूरा हुन्छ।"
            }
          ]
        },
        "6": {
          title: "अनुपस्थिति र पहुँच समस्याहरू",
          description: "जब ग्राहक सेवाको लागि उपलब्ध हुँदैन:",
          points: [
            { 
              title: "ग्राहक अनुपस्थित", 
              desc: "यदि ग्राहक उपस्थित छैन वा तोकिएको समयमा पहुँच प्रदान गर्दैन र प्रोफेशनल पर्खन्छ र त्यसपछि जान्छ भने, बुकिङलाई अनुपस्थित मानिन्छ। कुनै फिर्ता जारी गरिने छैन।",
              neDesc: "यदि ग्राहक उपस्थित छैन वा तोकिएको समयमा पहुँच प्रदान गर्दैन र प्रोफेशनल पर्खन्छ र त्यसपछि जान्छ भने, बुकिङलाई अनुपस्थित मानिन्छ। कुनै फिर्ता जारी गरिने छैन।"
            },
            { 
              title: "ढिलो पहुँच", 
              desc: "यदि प्रोफेशनल पर्खन्छ र पछि काम पूरा गर्दछ भने, सामान्य शुल्क लागू हुन्छ।",
              neDesc: "यदि प्रोफेशनल पर्खन्छ र पछि काम पूरा गर्दछ भने, सामान्य शुल्क लागू हुन्छ।"
            }
          ]
        },
        "7": {
          title: "एड-अन उत्पादनहरू र पार्ट्स",
          description: "खरीद गरिएका सामग्रीहरूको लागि फिर्ता नियमहरू:",
          points: [
            { 
              title: "गैर-फिर्ता योग्य पार्ट्स", 
              desc: "एक बुकिङको लागि विशेष रूपमा खरीद गरिएका उपभोग्य वस्तुहरू वा पार्ट्सको शुल्क पार्ट्स खरीद गरिसकेपछि फिर्ता योग्य हुँदैन।",
              neDesc: "एक बुकिङको लागि विशेष रूपमा खरीद गरिएका उपभोग्य वस्तुहरू वा पार्ट्सको शुल्क पार्ट्स खरीद गरिसकेपछि फिर्ता योग्य हुँदैन।"
            },
            { 
              title: "फिर्ता योग्य वस्तुहरू", 
              desc: "यदि पार्ट प्रयोग नगरिएको र फिर्ता योग्य छ भने, प्रदायक पुष्टि र कुनै आपूर्तिकर्ता पुन: स्टकिङ शुल्क पछि फिर्ता प्रक्रिया हुन सक्छ।",
              neDesc: "यदि पार्ट प्रयोग नगरिएको र फिर्ता योग्य छ भने, प्रदायक पुष्टि र कुनै आपूर्तिकर्ता पुन: स्टकिङ शुल्क पछि फिर्ता प्रक्रिया हुन सक्छ।"
            }
          ]
        },
        "8": {
          title: "फिर्ता कसरी प्रक्रिया गरिन्छ र समयसीमा",
          description: "फिर्ता विधिहरू र अपेक्षित समय सीमा:",
          points: [
            { 
              title: "उही विधि", 
              desc: "फिर्ता सम्भव भएसम्म मूल भुक्तानी विधिमा फिर्ता जारी गरिनेछ।",
              neDesc: "फिर्ता सम्भव भएसम्म मूल भुक्तानी विधिमा फिर्ता जारी गरिनेछ।"
            },
            { 
              title: "ई-वालेटहरू", 
              desc: "eSewa/Khalti/IME Pay: फिर्ता ४८-७२ कार्य घण्टा भित्र प्रक्रिया गरिन्छ।",
              neDesc: "eSewa/Khalti/IME Pay: फिर्ता ४८-७२ कार्य घण्टा भित्र प्रक्रिया गरिन्छ।"
            },
            { 
              title: "बैंक ट्रान्सफर", 
              desc: "बैंक ट्रान्सफर / डेबिट-कार्ड: फिर्ता बैंकमा निर्भर गर्दै ३-७ कार्य दिन भित्र प्रक्रिया गरिन्छ।",
              neDesc: "बैंक ट्रान्सफर / डेबिट-कार्ड: फिर्ता बैंकमा निर्भर गर्दै ३-७ कार्य दिन भित्र प्रक्रिया गरिन्छ।"
            },
            { 
              title: "नगद भुक्तानी", 
              desc: "नगद भुक्तानी: फिर्ता प्रमाणीकरण पछि बैंक ट्रान्सफर वा ई-वालेट क्रेडिटको रूपमा जारी गरिनेछ; कृपया ३-७ कार्य दिन दिनुहोस्।",
              neDesc: "नगद भुक्तानी: फिर्ता प्रमाणीकरण पछि बैंक ट्रान्सफर वा ई-वालेट क्रेडिटको रूपमा जारी गरिनेछ; कृपया ३-७ कार्य दिन दिनुहोस्।"
            },
            { 
              title: "सूचना", 
              desc: "Doorsteps Nepal ले फिर्ता सुरु गर्दा ग्राहकहरूलाई इमेल/एसएमएस द्वारा सूचित गर्नेछ।",
              neDesc: "Doorsteps Nepal ले फिर्ता सुरु गर्दा ग्राहकहरूलाई इमेल/एसएमएस द्वारा सूचित गर्नेछ।"
            }
          ]
        },
        "9": {
          title: "बजार शुल्क र कर",
          description: "गैर-फिर्ता योग्य भागहरू बुझ्दै:",
          points: [
            { 
              title: "गैर-फिर्ता योग्य शुल्क", 
              desc: "बजार सहजीकरण शुल्क र लागू करहरू गैर-फिर्ता योग्य हुन सक्छन् यदि सेवा प्रदायकले पहिले नै काम गरेको छ वा Doorsteps Nepal ले पहिले नै प्रोफेशनललाई रकम भुक्तान गरेको छ।",
              neDesc: "बजार सहजीकरण शुल्क र लागू करहरू गैर-फिर्ता योग्य हुन सक्छन् यदि सेवा प्रदायकले पहिले नै काम गरेको छ वा Doorsteps Nepal ले पहिले नै प्रोफेशनललाई रकम भुक्तान गरेको छ।"
            },
            { 
              title: "फिर्ता गणना", 
              desc: "माथिको नीतिले प्रत्येक रद्द विन्डोमा कुन भाग फिर्ता योग्य छ भनेर व्याख्या गर्दछ।",
              neDesc: "माथिको नीतिले प्रत्येक रद्द विन्डोमा कुन भाग फिर्ता योग्य छ भनेर व्याख्या गर्दछ।"
            }
          ]
        },
        "10": {
          title: "विवादहरू",
          description: "फिर्ता निर्णयहरूमा विवाद गर्ने प्रक्रिया:",
          points: [
            { 
              title: "विवाद बढाउने प्रक्रिया", 
              desc: "यदि ग्राहक फिर्ता निर्णयसँग असहमत छ भने, उनीहरूले घटनाको ७ दिन भित्र बुकिङ आईडी र समर्थन फोटो/रसिदहरू सहित doorstepnepal@gmail.com मा इमेल गरेर विवाद बढाउन सक्छन्।",
              neDesc: "यदि ग्राहक फिर्ता निर्णयसँग असहमत छ भने, उनीहरूले घटनाको ७ दिन भित्र बुकिङ आईडी र समर्थन फोटो/रसिदहरू सहित doorstepnepal@gmail.com मा इमेल गरेर विवाद बढाउन सक्छन्।"
            },
            { 
              title: "समाधान समयसीमा", 
              desc: "Doorsteps Nepal ले ५ कार्य दिन भित्र अन्तिम समाधानको साथ जवाफ दिनेछ।",
              neDesc: "Doorsteps Nepal ले ५ कार्य दिन भित्र अन्तिम समाधानको साथ जवाफ दिनेछ।"
            }
          ]
        },
        "11": {
          title: "अपवाद र आपतकालिन",
          description: "विशेष परिस्थितिहरू:",
          points: [
            { 
              title: "केस-दर-केस व्यवस्थापन", 
              desc: "चिकित्सा आपतकालिन, प्राकृतिक प्रकोप, वा सरकारी प्रतिबन्धहरू केस-दर-केस ह्यान्डल गरिनेछ र Doorsteps Nepal ले आफ्नो विवेकमा शुल्क माफ गर्न/पूर्ण रूपमा फिर्ता गर्न सक्छ।",
              neDesc: "चिकित्सा आपतकालिन, प्राकृतिक प्रकोप, वा सरकारी प्रतिबन्धहरू केस-दर-केस ह्यान्डल गरिनेछ र Doorsteps Nepal ले आफ्नो विवेकमा शुल्क माफ गर्न/पूर्ण रूपमा फिर्ता गर्न सक्छ।"
            }
          ]
        },
        "12": {
          title: "धोखाधडी रोकथाम",
          description: "दुरुपयोग विरुद्ध सुरक्षा:",
          points: [
            { 
              title: "प्रमाणीकरण रोक", 
              desc: "यदि Doorsteps Nepal ले धोखाधडी वा दुरुपयोगको शंका गरेमा फिर्ता प्रमाणीकरणको लागि रोकिन सक्छ।",
              neDesc: "यदि Doorsteps Nepal ले धोखाधडी वा दुरुपयोगको शंका गरेमा फिर्ता प्रमाणीकरणको लागि रोकिन सक्छ।"
            },
            { 
              title: "खाता निलम्बन", 
              desc: "कुनै पनि धोखाधडी गतिविधिले खाता निलम्बन हुन सक्छ।",
              neDesc: "कुनै पनि धोखाधडी गतिविधिले खाता निलम्बन हुन सक्छ।"
            }
          ]
        },
        "13": {
          title: "फिर्ता कसरी अनुरोध गर्ने",
          description: "फिर्ता अनुरोधहरूको लागि सम्पर्क जानकारी:",
          points: [
            { 
              title: "इमेल", 
              desc: "doorstepnepal@gmail.com (विषय: फिर्ता अनुरोध – बुकिङ #XXXXX)",
              neDesc: "doorstepnepal@gmail.com (विषय: फिर्ता अनुरोध – बुकिङ #XXXXX)"
            },
            { 
              title: "फोन / व्हाट्सएप", 
              desc: "९८५१४०७७०६ / ९८५१४०७७०७",
              neDesc: "९८५१४०७७०६ / ९८५१४०७७०७"
            },
            { 
              title: "आवश्यक जानकारी", 
              desc: "बुकिङ आईडी, मिति/समय, कारण, र सान्दर्भिक भएमा फोटोहरू समावेश गर्नुहोस्।",
              neDesc: "बुकिङ आईडी, मिति/समय, कारण, र सान्दर्भिक भएमा फोटोहरू समावेश गर्नुहोस्।"
            }
          ]
        },
        "14": {
          title: "यस नीतिमा परिवर्तनहरू",
          description: "अद्यावधिकहरू कसरी ह्यान्डल गरिन्छ:",
          points: [
            { 
              title: "आधिकारिक संस्करण", 
              desc: "Doorsteps Nepal ले यो नीति अद्यावधिक गर्न सक्छ। वेबसाइटमा प्रकाशित संस्करण आधिकारिक छ।",
              neDesc: "Doorsteps Nepal ले यो नीति अद्यावधिक गर्न सक्छ। वेबसाइटमा प्रकाशित संस्करण आधिकारिक छ।"
            },
            { 
              title: "सूचना", 
              desc: "हामी दर्ता ग्राहकहरूलाई इमेल द्वारा महत्वपूर्ण परिवर्तनहरूको सूचना दिनेछौं।",
              neDesc: "हामी दर्ता ग्राहकहरूलाई इमेल द्वारा महत्वपूर्ण परिवर्तनहरूको सूचना दिनेछौं।"
            }
          ]
        }
      },
      tableOfContents: [
        { num: "१", title: "दायरा", icon: Globe },
        { num: "२", title: "परिभाषाहरू", icon: FileText },
        { num: "३", title: "ग्राहकद्वारा रद्द", icon: XCircle },
        { num: "४", title: "प्रोफेशनल/प्लेटफर्मद्वारा रद्द", icon: BanIcon },
        { num: "५", title: "असफल वा असन्तोषजनक सेवा", icon: AlertCircleIcon },
        { num: "६", title: "अनुपस्थिति र पहुँच समस्याहरू", icon: PhoneCall },
        { num: "७", title: "एड-अन उत्पादनहरू र पार्ट्स", icon: Package },
        { num: "८", title: "फिर्ता प्रक्रिया र समयसीमा", icon: Timer },
        { num: "९", title: "बजार शुल्क र कर", icon: Receipt },
        { num: "१०", title: "विवादहरू", icon: Scale3D },
        { num: "११", title: "अपवाद र आपतकालिन", icon: AlertTriangleIcon },
        { num: "१२", title: "धोखाधडी रोकथाम", icon: ShieldAlert },
        { num: "१३", title: "फिर्ता अनुरोध कसरी गर्ने", icon: MailQuestion },
        { num: "१४", title: "नीति अद्यावधिकहरू", icon: RefreshCcw }
      ],
      footer: {
        title: "फिर्ता वा रद्द बारे प्रश्नहरू?",
        subtitle: "कुनै फिर्ता वा रद्द अनुरोधहरूमा सहायताको लागि हाम्रो ग्राहक समर्थन टीमलाई सम्पर्क गर्नुहोस्",
        button: "समर्थन टीमलाई सम्पर्क गर्नुहोस्"
      },
      backToTop: "माथि जानुहोस्",
      grievance: {
        title: "फिर्ता र रद्द समर्थन",
        email: "refunds@doorstepsnepal.com",
        response: "हामी सबै फिर्ता अनुरोधहरू २४ घण्टा भित्र जवाफ दिने लक्ष्य राख्छौं",
        support: [
          { title: "फिर्ता अनुरोधहरू", email: "refunds@doorstepsnepal.com" },
          { title: "रद्द समस्याहरू", email: "cancellations@doorstepsnepal.com" },
          { title: "विवाद समाधान", email: "disputes@doorstepsnepal.com" },
          { title: "सामान्य समर्थन", email: "support@doorstepsnepal.com" }
        ]
      }
    }
  };

  // Get current content based on locale
  const current = locale === 'ne' ? content.ne : content.en;

  return (
    <>
          <Navbar />

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        
        {/* Hero Section */}
        <section className="py-12 md:py-16 bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/20 mb-6">
                <RefreshCcw className="h-8 w-8 text-blue-600" />
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
              <Card className="mb-8 border-blue-500/20 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <FileText className="h-6 w-6 text-blue-600" />
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
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {current.tableOfContents.map((item) => {
                    const IconComponent = item.icon as React.ElementType;
                    return (
                      <a 
                        key={item.num} 
                        href={`#section-${item.num}`}
                        className="group flex items-center gap-4 p-4 rounded-lg border hover:border-blue-500 hover:bg-blue-500/5 transition-all"
                      >
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/10 group-hover:bg-blue-500/20">
                          <IconComponent className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm text-blue-600 font-medium">
                            {locale === "en" ? `Section ${item.num}` : `धारा ${item.num}`}
                          </div>
                          <div className="font-medium group-hover:text-blue-600">{item.title}</div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>

              <Separator className="my-12" />

              <div className="space-y-6">
                {/* Policy Sections */}
                <div className="space-y-12">
                  {/* Dynamic Sections */}
                  {Object.keys(current.sections).map((sectionKey) => (
                    <section key={sectionKey} id={`section-${sectionKey}`} className="scroll-mt-24">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/10">
                          <span className="font-bold text-blue-600">
                            {locale === 'en' ? sectionKey : 
                              sectionKey === '1' ? '१' :
                              sectionKey === '2' ? '२' :
                              sectionKey === '3' ? '३' :
                              sectionKey === '4' ? '४' :
                              sectionKey === '5' ? '५' :
                              sectionKey === '6' ? '६' :
                              sectionKey === '7' ? '७' :
                              sectionKey === '8' ? '८' :
                              sectionKey === '9' ? '९' :
                              sectionKey === '10' ? '१०' :
                              sectionKey === '11' ? '११' :
                              sectionKey === '12' ? '१२' :
                              sectionKey === '13' ? '१३' : '१४'
                            }
                          </span>
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
                              <div key={index} className="border-l-4 border-blue-500/30 pl-4 py-2">
                                <h3 className="font-bold text-lg mb-2 text-blue-600">
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
                <Card className="border-blue-500/20">
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-3">
                      <Mail className="h-6 w-6 text-blue-600" />
                      {current.grievance.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <Mail className="h-6 w-6 text-blue-600 mt-1" />
                        <div>
                          <p className="text-muted-foreground mb-4">
                            {locale === "en" 
                              ? "For any questions or concerns regarding refunds or cancellations, please contact our support team:" 
                              : "फिर्ता वा रद्द सम्बन्धी कुनै प्रश्न वा चिन्ताको लागि, कृपया हाम्रो समर्थन टीमलाई सम्पर्क गर्नुहोस्:"}
                          </p>
                          <div className="space-y-3">
                            <div className="p-4 bg-blue-500/5 rounded-lg">
                              <div className="font-medium mb-1">
                                {locale === "en" ? "Primary Email" : "प्राथमिक इमेल"}
                              </div>
                              <code className="text-blue-600 font-medium">{current.grievance.email}</code>
                            </div>
                            <div className="p-4 bg-blue-500/5 rounded-lg">
                              <div className="font-medium mb-1">
                                {locale === "en" ? "Emergency Phone" : "आपतकालीन फोन"}
                              </div>
                              <p className="text-muted-foreground font-medium">9851407706 / 9851407707</p>
                            </div>
                            <div className="p-4 bg-blue-500/5 rounded-lg">
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
                            <div key={index} className="p-4 rounded-lg border hover:border-blue-500 transition-colors">
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
              <div className="mt-12 p-6 rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-lg mb-1">{current.footer.title}</h3>
                    <p className="text-sm text-muted-foreground">{current.footer.subtitle}</p>
                  </div>
                  <button
                    onClick={() => scrollToSection("contact")}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
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
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-blue-600 transition-colors"
                >
                  <ArrowUp className="h-4 w-4" />
                  {current.backToTop}
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}

// Helper Components
const ArrowUp = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
  </svg>
);