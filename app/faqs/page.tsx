"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Mail, 
  Eye, 
  FileText, 
  HelpCircle,
  BookOpen,
  Calendar,
  Clock,
  DollarSign,
  CreditCard,
  Shield,
  User,
  AlertCircle,
  Globe,
  Lock,
  Phone,
  XCircle,
  AlertTriangle,
  Smartphone,
  Wallet,
  Timer,
  UserPlus,
  UserMinus,
  MessageCircle,
  Headphones,
  MapPin,
  Edit3,
 
} from "lucide-react";
import { useI18n } from '@/lib/i18n/context';
import { Footer } from "@/components/layout/footer";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";

export default function FAQPage() {
  const { locale } = useI18n();
  const pathname = usePathname();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

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

  // Bilingual content for FAQ page
  const content = {
    en: {
      hero: {
        title: "Frequently Asked Questions",
        subtitle: "Find answers to common questions about Doorsteps Nepal services, bookings, payments, and more",
        lastUpdated: "Last Updated: December 2023",
        version: "Version 3.0"
      },
      introduction: {
        title: "How Can We Help You?",
        description: `Welcome to Doorsteps Nepal Help Center. Here you'll find answers to the most frequently asked questions about our platform, services, bookings, payments, and policies.`,
        note: "Can't find what you're looking for? Contact our support team directly and we'll be happy to assist you."
      },
      search: {
        placeholder: "Search your question...",
        button: "Search",
        noResults: "No questions found matching your search."
      },
      categories: {
        all: "All Questions",
        general: "General Questions",
        booking: "Booking & Services",
        pricing: "Pricing & Payments",
        cancellation: "Cancellation & Refunds",
        safety: "Safety & Quality",
        account: "Account & Technical Help",
        professional: "For Service Professionals",
        complaints: "Complaints & Disputes",
        legal: "Website & Legal"
      },
      faqs: [
        // General Questions
        {
          id: 1,
          category: "general",
          question: "What is Doorsteps Nepal?",
          answer: "Doorsteps Nepal is a Nepal-based digital service platform that operates as a marketplace connecting customers with independent, verified professionals for the delivery of home and personal services at the customer's location. The platform facilitates service discovery, booking, scheduling, and quality assurance while promoting safety, professionalism, and accountability. Doorsteps Nepal also supports local economic empowerment by enabling professionals to access structured work opportunities through technology.",
          icon: Globe
        },
        {
          id: 2,
          category: "general",
          question: "Where are your services available?",
          answer: "Currently, our services are available only within Kathmandu Valley. Service availability may vary by location and category.",
          icon: MapPin
        },
        {
          id: 3,
          category: "general",
          question: "How do I contact Doorsteps Nepal?",
          answer: "Email: doorstepnepal@gmail.com\nPhone / WhatsApp: 9851407706, 9851407707\nAddress: Kathmandu, Nepal",
          icon: Phone
        },
        
        // Booking & Services
        {
          id: 4,
          category: "booking",
          question: "How do I book a service?",
          answer: "Select a service, select the best professional, choose your preferred date and time, provide your address, and confirm the booking online.",
          icon: Calendar
        },
        {
          id: 5,
          category: "booking",
          question: "Can I book services for the same day?",
          answer: "Yes, same-day booking is available for selected services, subject to professional availability.",
          icon: Clock
        },
        {
          id: 6,
          category: "booking",
          question: "Can I modify my booking after confirmation?",
          answer: "Yes, bookings can be modified before service start time, subject to availability. Changes may affect pricing.",
          icon: Edit3
        },
        
        // Pricing & Payments
        {
          id: 7,
          category: "pricing",
          question: "Are prices fixed or estimated?",
          answer: "Prices displayed are either fixed or starting from amounts. Final prices may vary based on service complexity or additional requirements.",
          icon: DollarSign
        },
        {
          id: 8,
          category: "pricing",
          question: "What payment methods do you accept?",
          answer: "We accept: Cash on service completion, Digital wallets (eSewa, Khalti, IME Pay etc.), Bank transfer (for selected services).",
          icon: CreditCard
        },
        {
          id: 9,
          category: "pricing",
          question: "Are there any hidden charges?",
          answer: "No. Any additional cost will be explained and approved by the customer before work begins.",
          icon: Eye
        },
        
        // Cancellation & Refunds
        {
          id: 10,
          category: "cancellation",
          question: "Can I cancel my booking?",
          answer: "Yes. You can cancel as per our Refund & Cancellation Policy. Refund eligibility depends on how early you cancel.",
          icon: XCircle
        },
        {
          id: 11,
          category: "cancellation",
          question: "How long does a refund take?",
          answer: "Refunds are processed within 3–7 working days, depending on your payment method.",
          icon: Timer
        },
        
        // Safety & Quality
        {
          id: 12,
          category: "safety",
          question: "Are service professionals verified?",
          answer: "Yes. All professionals go through ID verification and basic background checks before onboarding.",
          icon: Shield
        },
        {
          id: 13,
          category: "safety",
          question: "What if I feel unsafe or unhappy with the service?",
          answer: "Stop the service immediately and contact Doorsteps Nepal support. We take safety and quality issues seriously.",
          icon: AlertTriangle
        },
        
        // Account & Technical Help
        {
          id: 14,
          category: "account",
          question: "Do I need an account to book a service?",
          answer: "Yes. Creating an account helps manage bookings, payments, and support.",
          icon: User
        },
        {
          id: 15,
          category: "account",
          question: "I forgot my password. What should I do?",
          answer: "Use the 'Forgot Password' option on the login page or contact support.",
          icon: Lock
        },
        {
          id: 16,
          category: "account",
          question: "Why am I not receiving OTP or confirmation messages?",
          answer: "Check your network, spam folder, or ensure your phone number/email is correct. Contact support if the issue continues.",
          icon: Smartphone
        },
        
        // For Service Professionals
        {
          id: 17,
          category: "professional",
          question: "How can I join as a service professional?",
          answer: "Visit the Join as Professional page and submit the application form.",
          icon: UserPlus
        },
        {
          id: 18,
          category: "professional",
          question: "How do professionals get paid?",
          answer: "Payments are made via bank transfer or digital wallets based on the agreed payout cycle.",
          icon: Wallet
        },
        {
          id: 19,
          category: "professional",
          question: "Can professionals cancel a job?",
          answer: "Yes, but frequent cancellations may affect ratings or result in penalties as per platform policy.",
          icon: UserMinus
        },
        
        // Complaints & Disputes
        {
          id: 20,
          category: "complaints",
          question: "How do I raise a complaint?",
          answer: "Email: doorstepnepal@gmail.com with your booking ID and details. Our team will respond within 24–48 hours.",
          icon: MessageCircle
        },
        {
          id: 21,
          category: "complaints",
          question: "What if I disagree with the resolution?",
          answer: "You can escalate your issue by emailing doorstepnepal@gmail.com. A final decision will be provided after review.",
          icon: AlertCircle
        },
        
        // Website & Legal
        {
          id: 22,
          category: "legal",
          question: "Is my personal information safe?",
          answer: "Yes. We follow strict data protection practices as outlined in our Privacy Policy.",
          icon: Lock
        },
        {
          id: 23,
          category: "legal",
          question: "Can Doorsteps Nepal change prices or policies?",
          answer: "Yes. Prices, services, and policies may change. The latest version on the website is always applicable.",
          icon: FileText
        }
      ],
      footer: {
        title: "Still Have Questions?",
        subtitle: "Our support team is here to help you with any questions or concerns",
        button: "Contact Support"
      },
      backToTop: "Back to Top",
      grievance: {
        title: "Need Immediate Assistance?",
        email: "support@doorstepsnepal.com",
        response: "We aim to respond to all inquiries within 24 hours",
        support: [
          { title: "General Support", email: "support@doorstepsnepal.com" },
          { title: "Technical Support", email: "tech@doorstepsnepal.com" },
          { title: "Billing Support", email: "billing@doorstepsnepal.com" },
          { title: "Emergency", email: "emergency@doorstepsnepal.com" }
        ]
      }
    },
    ne: {
      hero: {
        title: "बारम्बार सोधिने प्रश्नहरू",
        subtitle: "Doorsteps Nepal सेवाहरू, बुकिङ, भुक्तानी, र थप बारे सामान्य प्रश्नहरूको जवाफ खोज्नुहोस्",
        lastUpdated: "अन्तिम अद्यावधिक: डिसेम्बर २०२३",
        version: "संस्करण ३.०"
      },
      introduction: {
        title: "हामी तपाईंलाई कसरी मद्दत गर्न सक्छौं?",
        description: `Doorsteps Nepal सहायता केन्द्रमा स्वागत छ। यहाँ तपाईंले हाम्रो प्लेटफर्म, सेवाहरू, बुकिङ, भुक्तानी, र नीतिहरू बारे बारम्बार सोधिने प्रश्नहरूको जवाफ पाउनुहुनेछ।`,
        note: "तपाईंले खोजिरहनुभएको कुरा फेला पार्न सक्नुभएन? हाम्रो समर्थन टोलीलाई सिधै सम्पर्क गर्नुहोस् र हामी तपाईंलाई सहायता गर्न खुसी हुनेछौं।"
      },
      search: {
        placeholder: "आफ्नो प्रश्न खोज्नुहोस्...",
        button: "खोजी गर्नुहोस्",
        noResults: "तपाईंको खोजीसँग मेल खाने कुनै प्रश्न फेला परेन।"
      },
      categories: {
        all: "सबै प्रश्नहरू",
        general: "सामान्य प्रश्नहरू",
        booking: "बुकिङ र सेवाहरू",
        pricing: "मूल्य निर्धारण र भुक्तानी",
        cancellation: "रद्द र फिर्ता",
        safety: "सुरक्षा र गुणस्तर",
        account: "खाता र प्राविधिक सहायता",
        professional: "सेवा प्रदायकहरूको लागि",
        complaints: "उजुरी र विवादहरू",
        legal: "वेबसाइट र कानूनी"
      },
      faqs: [
        // General Questions
        {
          id: 1,
          category: "general",
          question: "Doorsteps Nepal के हो?",
          answer: "Doorsteps Nepal नेपाल-आधारित डिजिटल सेवा प्लेटफर्म हो जसले ग्राहकहरूलाई उनीहरूको स्थानमा घर र व्यक्तिगत सेवाहरूको डेलिभरीको लागि स्वतन्त्र, प्रमाणित प्रोफेशनलहरूसँग जोड्ने बजारको रूपमा सञ्चालन गर्दछ। प्लेटफर्मले सेवा खोज, बुकिङ, तालिकीकरण, र गुणस्तर आश्वासन सहज बनाउँदछ साथै सुरक्षा, व्यावसायिकता, र जवाफदेहिता प्रवर्द्धन गर्दछ। Doorsteps Nepal ले प्रोफेशनलहरूलाई प्रविधि मार्फत संरचित काम अवसरहरू पहुँच गर्न सक्षम बनाएर स्थानीय आर्थिक सशक्तिकरणलाई पनि समर्थन गर्दछ।",
          icon: Globe
        },
        {
          id: 2,
          category: "general",
          question: "तपाईंको सेवाहरू कहाँ उपलब्ध छन्?",
          answer: "हाल, हाम्रा सेवाहरू काठमाडौं उपत्यका भित्र मात्र उपलब्ध छन्। सेवा उपलब्धता स्थान र श्रेणी अनुसार फरक हुन सक्छ।",
          icon: MapPin
        },
        {
          id: 3,
          category: "general",
          question: "म कसरी Doorsteps Nepal सम्पर्क गर्न सक्छु?",
          answer: "इमेल: doorstepnepal@gmail.com\nफोन / व्हाट्सएप: ९८५१४०७७०६, ९८५१४०७७०७\nठेगाना: काठमाडौं, नेपाल",
          icon: Phone
        },
        
        // Booking & Services
        {
          id: 4,
          category: "booking",
          question: "म कसरी सेवा बुक गर्न सक्छु?",
          answer: "एउटा सेवा चयन गर्नुहोस्, उत्तम प्रोफेशनल चयन गर्नुहोस्, आफ्नो मनपर्ने मिति र समय रोज्नुहोस्, आफ्नो ठेगाना प्रदान गर्नुहोस्, र अनलाइन बुकिङ पुष्टि गर्नुहोस्।",
          icon: Calendar
        },
        {
          id: 5,
          category: "booking",
          question: "के म सोही दिनको लागि सेवाहरू बुक गर्न सक्छु?",
          answer: "हो, सोही-दिन बुकिङ चयन गरिएका सेवाहरूको लागि उपलब्ध छ, प्रोफेशनल उपलब्धताको अधीनमा।",
          icon: Clock
        },
        {
          id: 6,
          category: "booking",
          question: "के म पुष्टि पछि आफ्नो बुकिङ परिमार्जन गर्न सक्छु?",
          answer: "हो, बुकिङहरू सेवा सुरु हुने समय अघि परिमार्जन गर्न सकिन्छ, उपलब्धताको अधीनमा। परिवर्तनहरूले मूल्य निर्धारणलाई असर गर्न सक्छ।",
          icon: Edit3
        },
        
        // Pricing & Payments
        {
          id: 7,
          category: "pricing",
          question: "मूल्यहरू निश्चित छन् वा अनुमानित?",
          answer: "प्रदर्शित मूल्यहरू या त निश्चित छन् वा रकमबाट सुरु हुने। अन्तिम मूल्यहरू सेवा जटिलता वा अतिरिक्त आवश्यकताहरूको आधारमा फरक हुन सक्छ।",
          icon: DollarSign
        },
        {
          id: 8,
          category: "pricing",
          question: "तपाईं कस्तो भुक्तानी विधिहरू स्वीकार गर्नुहुन्छ?",
          answer: "हामी स्वीकार गर्दछौं: सेवा पूरा भएपछि नगद, डिजिटल वालेट (eSewa, Khalti, IME Pay आदि), बैंक ट्रान्सफर (चयन गरिएका सेवाहरूको लागि)।",
          icon: CreditCard
        },
        {
          id: 9,
          category: "pricing",
          question: "के कुनै लुकेको शुल्कहरू छन्?",
          answer: "छैनन्। कुनै पनि अतिरिक्त लागत काम सुरु हुनु अघि ग्राहकलाई व्याख्या गरिनेछ र स्वीकृत गरिनेछ।",
          icon: Eye
        },
        
        // Cancellation & Refunds
        {
          id: 10,
          category: "cancellation",
          question: "के म आफ्नो बुकिङ रद्द गर्न सक्छु?",
          answer: "हो। तपाईं हाम्रो फिर्ता र रद्द नीति अनुसार रद्द गर्न सक्नुहुन्छ। फिर्ता योग्यता तपाईंले कति चाँडो रद्द गर्नुहुन्छ भन्ने कुरामा निर्भर गर्दछ।",
          icon: XCircle
        },
        {
          id: 11,
          category: "cancellation",
          question: "फिर्ता हुन कति समय लाग्छ?",
          answer: "फिर्ता ३-७ कार्य दिन भित्र प्रक्रिया गरिन्छ, तपाईंको भुक्तानी विधिमा निर्भर गर्दछ।",
          icon: Timer
        },
        
        // Safety & Quality
        {
          id: 12,
          category: "safety",
          question: "के सेवा प्रोफेशनलहरू प्रमाणित छन्?",
          answer: "हो। सबै प्रोफेशनलहरू अनबोर्डिङ अघि परिचयपत्र प्रमाणीकरण र आधारभूत पृष्ठभूमि जाँचबाट गुज्रन्छन्।",
          icon: Shield
        },
        {
          id: 13,
          category: "safety",
          question: "यदि म सेवासँग असुरक्षित वा असन्तुष्ट महसुस गर्छु भने के गर्ने?",
          answer: "सेवा तुरुन्त रोक्नुहोस् र Doorsteps Nepal समर्थनलाई सम्पर्क गर्नुहोस्। हामी सुरक्षा र गुणस्तर मुद्दाहरू गम्भीरतापूर्वक लिन्छौं।",
          icon: AlertTriangle
        },
        
        // Account & Technical Help
        {
          id: 14,
          category: "account",
          question: "के मलाई सेवा बुक गर्न खाता चाहिन्छ?",
          answer: "हो। खाता सिर्जना गर्नाले बुकिङ, भुक्तानी, र समर्थन व्यवस्थापन गर्न मद्दत गर्दछ।",
          icon: User
        },
        {
          id: 15,
          category: "account",
          question: "मैले पासवर्ड बिर्सें। मैले के गर्नुपर्छ?",
          answer: "लगइन पृष्ठमा 'पासवर्ड बिर्सनुभयो' विकल्प प्रयोग गर्नुहोस् वा समर्थनलाई सम्पर्क गर्नुहोस्।",
          icon: Lock
        },
        {
          id: 16,
          category: "account",
          question: "मैले OTP वा पुष्टि सन्देशहरू किन प्राप्त गरिरहेको छैन?",
          answer: "आफ्नो नेटवर्क, स्प्याम फोल्डर जाँच गर्नुहोस्, वा आफ्नो फोन नम्बर/इमेल सही छ भनी सुनिश्चित गर्नुहोस्। समस्या जारी रहेमा समर्थनलाई सम्पर्क गर्नुहोस्।",
          icon: Smartphone
        },
        
        // For Service Professionals
        {
          id: 17,
          category: "professional",
          question: "म सेवा प्रोफेशनलको रूपमा कसरी सामेल हुन सक्छु?",
          answer: "प्रोफेशनलको रूपमा सामेल हुनुहोस् पृष्ठमा जानुहोस् र आवेदन फारम पेश गर्नुहोस्।",
          icon: UserPlus
        },
        {
          id: 18,
          category: "professional",
          question: "प्रोफेशनलहरूले कसरी भुक्तानी पाउँछन्?",
          answer: "भुक्तानी सहमत भुक्तानी चक्रको आधारमा बैंक ट्रान्सफर वा डिजिटल वालेट मार्फत गरिन्छ।",
          icon: Wallet
        },
        {
          id: 19,
          category: "professional",
          question: "के प्रोफेशनलहरूले काम रद्द गर्न सक्छन्?",
          answer: "हो, तर बारम्बार रद्द गर्नाले मूल्यांकनलाई असर गर्न सक्छ वा प्लेटफर्म नीति अनुसार दण्डको परिणाम हुन सक्छ।",
          icon: UserMinus
        },
        
        // Complaints & Disputes
        {
          id: 20,
          category: "complaints",
          question: "म कसरी उजुरी दर्ता गर्न सक्छु?",
          answer: "आफ्नो बुकिङ आईडी र विवरणहरू सहित doorstepnepal@gmail.com मा इमेल गर्नुहोस्। हाम्रो टोलीले २४-४८ घण्टा भित्र जवाफ दिनेछ।",
          icon: MessageCircle
        },
        {
          id: 21,
          category: "complaints",
          question: "यदि म समाधानसँग असहमत छु भने के गर्ने?",
          answer: "तपाईं doorstepnepal@gmail.com मा इमेल गरेर आफ्नो मुद्दा बढाउन सक्नुहुन्छ। समीक्षा पछि अन्तिम निर्णय प्रदान गरिनेछ।",
          icon: AlertCircle
        },
        
        // Website & Legal
        {
          id: 22,
          category: "legal",
          question: "के मेरो व्यक्तिगत जानकारी सुरक्षित छ?",
          answer: "हो। हामी हाम्रो गोपनीयता नीतिमा उल्लिखित अनुसार कडा डाटा सुरक्षा अभ्यासहरू पालना गर्दछौं।",
          icon: Lock
        },
        {
          id: 23,
          category: "legal",
          question: "के Doorsteps Nepal ले मूल्य वा नीतिहरू परिवर्तन गर्न सक्छ?",
          answer: "हो। मूल्य, सेवा, र नीतिहरू परिवर्तन हुन सक्छन्। वेबसाइटमा नवीनतम संस्करण सधैं लागू हुन्छ।",
          icon: FileText
        }
      ],
      footer: {
        title: "अझै प्रश्नहरू छन्?",
        subtitle: "हाम्रो समर्थन टोली कुनै पनि प्रश्न वा चिन्तामा तपाईंलाई मद्दत गर्न यहाँ छ",
        button: "समर्थनलाई सम्पर्क गर्नुहोस्"
      },
      backToTop: "माथि जानुहोस्",
      grievance: {
        title: "तत्काल सहायता चाहिन्छ?",
        email: "support@doorstepsnepal.com",
        response: "हामी सबै जिज्ञासाहरू २४ घण्टा भित्र जवाफ दिने लक्ष्य राख्छौं",
        support: [
          { title: "सामान्य समर्थन", email: "support@doorstepsnepal.com" },
          { title: "प्राविधिक समर्थन", email: "tech@doorstepsnepal.com" },
          { title: "बिलिङ समर्थन", email: "billing@doorstepsnepal.com" },
          { title: "आपतकालिन", email: "emergency@doorstepsnepal.com" }
        ]
      }
    }
  };

  // Get current content based on locale
  const current = locale === 'ne' ? content.ne : content.en;

  // Filter FAQs based on search and category
  const filteredFaqs = current.faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Get category counts
  const categoryCounts = current.faqs.reduce((acc: any, faq) => {
    acc[faq.category] = (acc[faq.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <>
    <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        
        {/* Hero Section */}
        <section className="py-12 md:py-16 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/20 mb-6">
                <HelpCircle className="h-8 w-8 text-purple-600" />
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
              <Card className="mb-8 border-purple-500/20 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <BookOpen className="h-6 w-6 text-purple-600" />
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

              {/* Search Bar */}
              <div className="mb-8">
                <div className="flex gap-2 max-w-2xl mx-auto">
                  <div className="relative flex-1">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder={current.search.placeholder}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    {current.search.button}
                  </button>
                </div>
              </div>

              {/* Category Filters */}
              <div className="mb-8 overflow-x-auto">
                <div className="flex gap-2 min-w-max pb-2">
                  <button
                    onClick={() => setActiveCategory("all")}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      activeCategory === "all"
                        ? "bg-purple-600 text-white"
                        : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    {current.categories.all} ({current.faqs.length})
                  </button>
                  {Object.entries(current.categories).map(([key, value]) => {
                    if (key === "all") return null;
                    const count = categoryCounts[key] || 0;
                    if (count === 0) return null;
                    return (
                      <button
                        key={key}
                        onClick={() => setActiveCategory(key)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                          activeCategory === key
                            ? "bg-purple-600 text-white"
                            : "bg-muted hover:bg-muted/80"
                        }`}
                      >
                        {value} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* FAQ List */}
              <div className="space-y-4 mb-12">
                {filteredFaqs.length > 0 ? (
                  filteredFaqs.map((faq) => {
                    const IconComponent = faq.icon as React.ElementType;
                    return (
                      <Card key={faq.id} className="hover:border-purple-500 transition-all">
                        <CardContent className="pt-6">
                          <div className="flex gap-4">
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                                <IconComponent className="h-5 w-5 text-purple-600" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                              <p className="text-muted-foreground whitespace-pre-line">{faq.answer}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                ) : (
                  <Card className="text-center py-12">
                    <CardContent>
                      <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">{current.search.noResults}</p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Still Have Questions Section */}
              <section className="mt-12">
                <Card className="border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-3">
                      <Headphones className="h-6 w-6 text-purple-600" />
                      {current.footer.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-6">
                      {current.footer.subtitle}
                    </p>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <Mail className="h-5 w-5 text-purple-600 mt-1" />
                          <div>
                            <p className="font-medium">Email</p>
                            <a href="mailto:support@doorstepsnepal.com" className="text-purple-600 hover:underline">
                              support@doorstepsnepal.com
                            </a>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Phone className="h-5 w-5 text-purple-600 mt-1" />
                          <div>
                            <p className="font-medium">Phone / WhatsApp</p>
                            <p className="text-purple-600">9851407706, 9851407707</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <Clock className="h-5 w-5 text-purple-600 mt-1" />
                          <div>
                            <p className="font-medium">Response Time</p>
                            <p className="text-muted-foreground">{current.grievance.response}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <MapPin className="h-5 w-5 text-purple-600 mt-1" />
                          <div>
                            <p className="font-medium">Address</p>
                            <p className="text-muted-foreground">Kathmandu, Nepal</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Footer Note */}
              <div className="mt-12 p-6 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-lg mb-1">{current.footer.title}</h3>
                    <p className="text-sm text-muted-foreground">{current.footer.subtitle}</p>
                  </div>
                  <button
                    onClick={() => window.location.href = 'mailto:support@doorstepsnepal.com'}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors whitespace-nowrap"
                  >
                    <Mail className="h-4 w-4" />
                    {current.footer.button}
                  </button>
                </div>
              </div>

              {/* Back to Top */}
              <div className="mt-8 text-center">
                <a 
                  href="#" 
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-purple-600 transition-colors"
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

const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);