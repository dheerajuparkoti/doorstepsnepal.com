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
  HelpCircle
} from "lucide-react";
import { useI18n } from '@/lib/i18n/context';
import { Footer } from "@/components/layout/footer";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";

export default function SafetyPolicyPage() {
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

  // Bilingual content for safety policy
  const content = {
    en: {
      hero: {
        title: "Safety Policy",
        subtitle: "Comprehensive safety guidelines for Customers, Professionals, and Employees of Door Steps Nepal",
        lastUpdated: "Last Updated: December 2023",
        version: "Version 2.0"
      },
      introduction: {
        title: "Our Commitment to Safety",
        description: `Doorsteps Nepal is committed to providing safe, secure, and professional doorstep services for customers, service professionals, employees, and partners. This Safety Policy outlines the standards, responsibilities, and procedures to ensure safety before, during, and after every service.`,
        note: "Safety is not just a priority - it's our core value. Every stakeholder in the Doorsteps Nepal ecosystem shares the responsibility of maintaining a safe environment."
      },
      sections: {
        "1": {
          title: "Purpose",
          description: "Foundation of our safety commitment:",
          points: [
            { 
              title: "Safety First", 
              desc: "Doorsteps Nepal is committed to providing safe, secure, and professional doorstep services for customers, service professionals, employees, and partners.",
              neDesc: "Doorsteps Nepal ग्राहक, सेवा प्रदायक, कर्मचारी र साझेदारहरूको लागि सुरक्षित, भरपर्दो र व्यावसायिक डोरस्टेप सेवाहरू प्रदान गर्न प्रतिबद्ध छ।"
            },
            { 
              title: "Comprehensive Standards", 
              desc: "This Safety Policy outlines the standards, responsibilities, and procedures to ensure safety before, during, and after every service.",
              neDesc: "यो सुरक्षा नीतिले प्रत्येक सेवा अघि, समयमा र पछि सुरक्षा सुनिश्चित गर्न मापदण्डहरू, जिम्मेवारीहरू र प्रक्रियाहरू उल्लिखित गर्दछ।"
            }
          ]
        },
        "2": {
          title: "Professional Verification & Training",
          description: "Ensuring qualified and vetted professionals:",
          points: [
            { 
              title: "Identity Verification", 
              desc: "All Service Professionals must provide valid government-issued ID and complete basic background verification.",
              neDesc: "सबै सेवा प्रदायकहरूले सरकारद्वारा जारी गरिएको वैध परिचयपत्र प्रदान गर्नुपर्दछ र आधारभूत पृष्ठभूमि जाँच पूरा गर्नुपर्दछ।"
            },
            { 
              title: "Skills Assessment", 
              desc: "Professionals must submit skill and experience details for service-appropriate placement.",
              neDesc: "प्रोफेशनलहरूले सेवा-उपयुक्त स्थानको लागि आफ्नो सीप र अनुभव विवरणहरू पेश गर्नुपर्दछ।"
            },
            { 
              title: "Safety Orientation", 
              desc: "Professionals receive orientation on customer conduct, hygiene and safety standards, and emergency handling procedures.",
              neDesc: "प्रोफेशनलहरूले ग्राहक व्यवहार, सरसफाइ र सुरक्षा मापदण्डहरू, र आपतकालीन व्यवस्थापन प्रक्रियाहरूमा अभिमुखीकरण प्राप्त गर्दछन्।"
            },
            { 
              title: "Enforcement", 
              desc: "Doorsteps Nepal reserves the right to suspend or terminate any professional violating safety rules.",
              neDesc: "Doorsteps Nepal ले सुरक्षा नियमहरू उल्लङ्घन गर्ने कुनै पनि प्रोफेशनललाई निलम्बन वा हटाउने अधिकार सुरक्षित राख्दछ।"
            }
          ]
        },
        "3": {
          title: "Customer Safety & Home Entry Rules",
          description: "Guidelines for safe service delivery at customer premises:",
          points: [
            { 
              title: "Professional Conduct", 
              desc: "Professionals must arrive in a professional manner, clearly introduce themselves, and perform only the booked service.",
              neDesc: "प्रोफेशनलहरूले व्यावसायिक तरिकाले आइपुग्नुपर्दछ, स्पष्ट रूपमा आफ्नो परिचय दिनुपर्दछ, र बुक गरिएको सेवा मात्र प्रदान गर्नुपर्दछ।"
            },
            { 
              title: "Privacy Respect", 
              desc: "Professionals must respect customer privacy and property at all times.",
              neDesc: "प्रोफेशनलहरूले सधैं ग्राहकको गोपनीयता र सम्पत्तिको सम्मान गर्नुपर्दछ।"
            },
            { 
              title: "Strict Prohibitions", 
              desc: "Professionals are strictly prohibited from entering restricted areas without permission, requesting personal favors, loans, or unrelated work, or bringing unauthorized persons.",
              neDesc: "प्रोफेशनलहरूलाई अनुमति बिना प्रतिबन्धित क्षेत्रहरूमा प्रवेश गर्न, व्यक्तिगत सहयोग, ऋण, वा असम्बन्धित कामको लागि अनुरोध गर्न, वा अनाधिकृत व्यक्तिहरू ल्याउन कडाइका साथ निषेध गरिएको छ।"
            },
            { 
              title: "Customer Precautions", 
              desc: "Customers are encouraged to ensure at least one adult is present during service and keep children and pets away from work areas.",
              neDesc: "ग्राहकहरूलाई सेवाको समयमा कम्तिमा एक वयस्क उपस्थित रहेको सुनिश्चित गर्न र बालबालिका र घरपालुवा जनावरहरूलाई कार्य क्षेत्रबाट टाढा राख्न प्रोत्साहित गरिन्छ।"
            }
          ]
        },
        "4": {
          title: "Health, Hygiene & Cleanliness",
          description: "Maintaining highest hygiene standards:",
          points: [
            { 
              title: "Personal Hygiene", 
              desc: "Professionals must use clean tools and equipment, follow personal hygiene standards, and use protective gear when required (gloves, masks).",
              neDesc: "प्रोफेशनलहरूले सफा उपकरणहरू प्रयोग गर्नुपर्दछ, व्यक्तिगत सरसफाइ मापदण्डहरू पालना गर्नुपर्दछ, र आवश्यक पर्दा सुरक्षात्मक गियर (पन्जा, मास्क) प्रयोग गर्नुपर्दछ।"
            },
            { 
              title: "Beauty Services Standards", 
              desc: "Beauty & wellness services must use sanitized tools. Single-use or properly disinfected items only.",
              neDesc: "सौन्दर्य र कल्याण सेवाहरूले कीटाणुरहित उपकरणहरू प्रयोग गर्नुपर्दछ। एकल-प्रयोग वा राम्ररी कीटाणुरहित वस्तुहरू मात्र।"
            },
            { 
              title: "Compliance", 
              desc: "Doorsteps Nepal may suspend services if hygiene standards are not met.",
              neDesc: "सरसफाइ मापदण्डहरू पूरा नभएमा Doorsteps Nepal ले सेवाहरू स्थगित गर्न सक्दछ।"
            }
          ]
        },
        "5": {
          title: "Emergency Situations",
          description: "Protocols for handling emergencies:",
          points: [
            { 
              title: "Immediate Action", 
              desc: "Professionals must immediately stop work if a safety risk arises.",
              neDesc: "सुरक्षा जोखिम उत्पन्न भएमा प्रोफेशनलहरूले तुरुन्तै काम रोक्नुपर्दछ।"
            },
            { 
              title: "Emergency Contacts", 
              desc: "Customers and professionals should contact local emergency services when required and inform Doorsteps Nepal support as soon as possible.",
              neDesc: "ग्राहक र प्रोफेशनलहरूले आवश्यक पर्दा स्थानीय आपतकालीन सेवाहरूमा सम्पर्क गर्नुपर्दछ र सकेसम्म चाँडो Doorsteps Nepal समर्थनलाई जानकारी गराउनुपर्दछ।"
            },
            { 
              title: "Service Adjustment", 
              desc: "Doorsteps Nepal may cancel or reschedule services due to safety concerns without penalty.",
              neDesc: "Doorsteps Nepal ले सुरक्षा चिन्ताको कारणले सेवाहरू रद्द वा पुन: तालिकीकरण गर्न सक्दछ, कुनै दण्ड शुल्क बिना।"
            }
          ]
        },
        "6": {
          title: "Zero-Tolerance Policy",
          description: "Strict enforcement of professional conduct:",
          points: [
            { 
              title: "Prohibited Behaviors", 
              desc: "Doorsteps Nepal maintains zero tolerance for: Physical or verbal abuse, Harassment or discrimination, Alcohol or drug use during service, Theft, intimidation, or threats, Unsafe behavior endangering people or property.",
              neDesc: "Doorsteps Nepal निम्न कुराहरूको लागि शून्य सहनशीलता कायम राख्दछ: शारीरिक वा मौखिक दुर्व्यवहार, उत्पीडन वा भेदभाव, सेवाको समयमा मदिरा वा लागूपदार्थको प्रयोग, चोरी, धम्की, वा डर धाक, व्यक्ति वा सम्पत्तिलाई जोखिममा पार्ने असुरक्षित व्यवहार।"
            },
            { 
              title: "Consequences", 
              desc: "Violation may result in: Immediate service termination, Account suspension or permanent ban, Legal action if necessary.",
              neDesc: "उल्लङ्घनले निम्न परिणाम ल्याउन सक्दछ: तुरुन्त सेवा समाप्ति, खाता निलम्बन वा स्थायी प्रतिबन्ध, आवश्यक परेमा कानुनी कारबाही।"
            }
          ]
        },
        "7": {
          title: "Customer Responsibilities",
          description: "Customer obligations for safe service:",
          points: [
            { 
              title: "Accurate Information", 
              desc: "Customers must provide accurate service details and address.",
              neDesc: "ग्राहकहरूले सही सेवा विवरण र ठेगाना प्रदान गर्नुपर्दछ।"
            },
            { 
              title: "Safe Access", 
              desc: "Ensure safe access to the service location.",
              neDesc: "सेवा स्थलमा सुरक्षित पहुँच सुनिश्चित गर्नुहोस्।"
            },
            { 
              title: "Respectful Behavior", 
              desc: "Maintain respectful behavior toward professionals.",
              neDesc: "प्रोफेशनलहरूप्रति सम्मानजनक व्यवहार कायम राख्नुहोस्।"
            },
            { 
              title: "Scope Adherence", 
              desc: "Avoid unsafe requests beyond the booked service scope.",
              neDesc: "बुक गरिएको सेवाको दायराभन्दा बाहिरका असुरक्षित अनुरोधहरू नगर्नुहोस्।"
            },
            { 
              title: "Service Refusal", 
              desc: "Doorsteps Nepal may refuse service if customer behavior is unsafe.",
              neDesc: "ग्राहकको व्यवहार असुरक्षित भएमा Doorsteps Nepal ले सेवा अस्वीकार गर्न सक्दछ।"
            }
          ]
        },
        "8": {
          title: "Professional & Employee Responsibilities",
          description: "Duties of service providers and staff:",
          points: [
            { 
              title: "Safety Compliance", 
              desc: "Follow all safety instructions and report hazards, incidents, or customer misconduct.",
              neDesc: "सबै सुरक्षा निर्देशनहरू पालना गर्नुहोस् र जोखिम, घटना, वा ग्राहकको दुर्व्यवहार रिपोर्ट गर्नुहोस्।"
            },
            { 
              title: "Risk Avoidance", 
              desc: "Avoid risky shortcuts or unauthorized modifications.",
              neDesc: "जोखिमपूर्ण छोटो बाटो वा अनधिकृत परिमार्जनहरू नगर्नुहोस्।"
            },
            { 
              title: "Professionalism", 
              desc: "Maintain professionalism at all times.",
              neDesc: "सधैं व्यावसायिकता कायम राख्नुहोस्।"
            },
            { 
              title: "Disciplinary Action", 
              desc: "Failure to comply may lead to disciplinary action.",
              neDesc: "पालना नगर्दा अनुशासनात्मक कारबाही हुन सक्दछ।"
            }
          ]
        },
        "9": {
          title: "Incident Reporting & Investigation",
          description: "Procedures for handling safety incidents:",
          points: [
            { 
              title: "Reporting Channels", 
              desc: "Report immediately to: Email: doorstepnepal@gmail.com, Phone: 9851407706 / 9851407707",
              neDesc: "तुरुन्त रिपोर्ट गर्नुहोस्: इमेल: doorstepnepal@gmail.com, फोन: ९८५१४०७७०६ / ९८५१४०७७०७"
            },
            { 
              title: "Investigation Process", 
              desc: "Doorsteps Nepal will record the incident, conduct internal investigation, and take corrective action where required.",
              neDesc: "Doorsteps Nepal ले घटना रेकर्ड गर्नेछ, आन्तरिक अनुसन्धान सञ्चालन गर्नेछ, र आवश्यक परेको ठाउँमा सुधारात्मक कारबाही गर्नेछ।"
            }
          ]
        },
        "10": {
          title: "Insurance & Liability Disclaimer",
          description: "Understanding liability limitations:",
          points: [
            { 
              title: "Service Facilitation", 
              desc: "Doorsteps Nepal facilitates service connections between customers and professionals.",
              neDesc: "Doorsteps Nepal ले ग्राहक र प्रोफेशनलहरू बीच सेवा जडान सहज बनाउँदछ।"
            },
            { 
              title: "Liability Limitations", 
              desc: "While safety measures are enforced, Doorsteps Nepal is not liable for undisclosed risks at service locations or misuse of repaired or installed equipment.",
              neDesc: "सुरक्षा उपायहरू लागू गरिए तापनि, Doorsteps Nepal सेवा स्थलहरूमा अज्ञात जोखिमहरू वा मर्मत वा स्थापित उपकरणको दुरुपयोगको लागि उत्तरदायी हुने छैन।"
            },
            { 
              title: "Legal Limit", 
              desc: "Liability, if any, is limited as per applicable laws of Nepal.",
              neDesc: "कुनै दायित्व भएमा, नेपालको लागू कानून अनुसार सीमित हुनेछ।"
            }
          ]
        },
        "11": {
          title: "Policy Updates",
          description: "Keeping policy current and relevant:",
          points: [
            { 
              title: "Periodic Review", 
              desc: "Doorsteps Nepal may update this Safety Policy periodically.",
              neDesc: "Doorsteps Nepal ले यो सुरक्षा नीति आवधिक रूपमा अद्यावधिक गर्न सक्दछ।"
            },
            { 
              title: "Official Version", 
              desc: "The latest version published on the website shall be considered official.",
              neDesc: "वेबसाइटमा प्रकाशित नवीनतम संस्करण आधिकारिक मानिनेछ।"
            }
          ]
        }
      },
      tableOfContents: [
        { num: "1", title: "Purpose", icon: Heart },
        { num: "2", title: "Professional Verification & Training", icon: GraduationCap },
        { num: "3", title: "Customer Safety & Home Entry", icon: Home },
        { num: "4", title: "Health, Hygiene & Cleanliness", icon: Sparkles },
        { num: "5", title: "Emergency Situations", icon: Ambulance },
        { num: "6", title: "Zero-Tolerance Policy", icon: Gavel },
        { num: "7", title: "Customer Responsibilities", icon: Users },
        { num: "8", title: "Professional & Employee Responsibilities", icon: Briefcase },
        { num: "9", title: "Incident Reporting", icon: ClipboardCheck },
        { num: "10", title: "Insurance & Liability", icon: Scale },
        { num: "11", title: "Policy Updates", icon: RefreshCw }
      ],
      footer: {
        title: "Questions About Safety Guidelines?",
        subtitle: "Contact our safety team for clarification on any aspect of this policy",
        button: "Contact Safety Team"
      },
      backToTop: "Back to Top",
      grievance: {
        title: "Safety Incident & Support Contact",
        email: "safety@doorstepsnepal.com",
        response: "We aim to respond to all safety concerns within 2 hours",
        support: [
          { title: "Emergency Reporting", email: "emergency@doorstepsnepal.com" },
          { title: "Safety Concerns", email: "safety@doorstepsnepal.com" },
          { title: "Incident Report", email: "incidents@doorstepsnepal.com" },
          { title: "General Support", email: "support@doorstepsnepal.com" }
        ]
      }
    },
    ne: {
      hero: {
        title: "सुरक्षा नीति",
        subtitle: "Door Steps Nepal का ग्राहक, प्रोफेशनल र कर्मचारीहरूको लागि व्यापक सुरक्षा दिशानिर्देशहरू",
        lastUpdated: "अन्तिम अद्यावधिक: डिसेम्बर २०२३",
        version: "संस्करण २.०"
      },
      introduction: {
        title: "सुरक्षाप्रति हाम्रो प्रतिबद्धता",
        description: `Doorsteps Nepal ग्राहक, सेवा प्रदायक, कर्मचारी र साझेदारहरूको लागि सुरक्षित, भरपर्दो र व्यावसायिक डोरस्टेप सेवाहरू प्रदान गर्न प्रतिबद्ध छ। यो सुरक्षा नीतिले प्रत्येक सेवा अघि, समयमा र पछि सुरक्षा सुनिश्चित गर्न मापदण्डहरू, जिम्मेवारीहरू र प्रक्रियाहरू उल्लिखित गर्दछ।`,
        note: "सुरक्षा केवल प्राथमिकता मात्र होइन - यो हाम्रो मूल मान्यता हो। Doorsteps Nepal पारिस्थितिकी प्रणालीका प्रत्येक सरोकारवालाले सुरक्षित वातावरण कायम राख्ने जिम्मेवारी साझा गर्दछन्।"
      },
      sections: {
        "1": {
          title: "उद्देश्य",
          description: "हाम्रो सुरक्षा प्रतिबद्धताको आधार:",
          points: [
            { 
              title: "सुरक्षा पहिलो", 
              desc: "Doorsteps Nepal ग्राहक, सेवा प्रदायक, कर्मचारी र साझेदारहरूको लागि सुरक्षित, भरपर्दो र व्यावसायिक डोरस्टेप सेवाहरू प्रदान गर्न प्रतिबद्ध छ।",
              neDesc: "Doorsteps Nepal ग्राहक, सेवा प्रदायक, कर्मचारी र साझेदारहरूको लागि सुरक्षित, भरपर्दो र व्यावसायिक डोरस्टेप सेवाहरू प्रदान गर्न प्रतिबद्ध छ।"
            },
            { 
              title: "व्यापक मापदण्डहरू", 
              desc: "यो सुरक्षा नीतिले प्रत्येक सेवा अघि, समयमा र पछि सुरक्षा सुनिश्चित गर्न मापदण्डहरू, जिम्मेवारीहरू र प्रक्रियाहरू उल्लिखित गर्दछ।",
              neDesc: "यो सुरक्षा नीतिले प्रत्येक सेवा अघि, समयमा र पछि सुरक्षा सुनिश्चित गर्न मापदण्डहरू, जिम्मेवारीहरू र प्रक्रियाहरू उल्लिखित गर्दछ।"
            }
          ]
        },
        "2": {
          title: "प्रोफेशनल प्रमाणीकरण र तालिम",
          description: "योग्य र जाँचिएका प्रोफेशनलहरू सुनिश्चित गर्दै:",
          points: [
            { 
              title: "पहिचान प्रमाणीकरण", 
              desc: "सबै सेवा प्रदायकहरूले सरकारद्वारा जारी गरिएको वैध परिचयपत्र प्रदान गर्नुपर्दछ र आधारभूत पृष्ठभूमि जाँच पूरा गर्नुपर्दछ।",
              neDesc: "सबै सेवा प्रदायकहरूले सरकारद्वारा जारी गरिएको वैध परिचयपत्र प्रदान गर्नुपर्दछ र आधारभूत पृष्ठभूमि जाँच पूरा गर्नुपर्दछ।"
            },
            { 
              title: "सीप मूल्यांकन", 
              desc: "प्रोफेशनलहरूले सेवा-उपयुक्त स्थानको लागि आफ्नो सीप र अनुभव विवरणहरू पेश गर्नुपर्दछ।",
              neDesc: "प्रोफेशनलहरूले सेवा-उपयुक्त स्थानको लागि आफ्नो सीप र अनुभव विवरणहरू पेश गर्नुपर्दछ।"
            },
            { 
              title: "सुरक्षा अभिमुखीकरण", 
              desc: "प्रोफेशनलहरूले ग्राहक व्यवहार, सरसफाइ र सुरक्षा मापदण्डहरू, र आपतकालीन व्यवस्थापन प्रक्रियाहरूमा अभिमुखीकरण प्राप्त गर्दछन्।",
              neDesc: "प्रोफेशनलहरूले ग्राहक व्यवहार, सरसफाइ र सुरक्षा मापदण्डहरू, र आपतकालीन व्यवस्थापन प्रक्रियाहरूमा अभिमुखीकरण प्राप्त गर्दछन्।"
            },
            { 
              title: "कारबाही", 
              desc: "Doorsteps Nepal ले सुरक्षा नियमहरू उल्लङ्घन गर्ने कुनै पनि प्रोफेशनललाई निलम्बन वा हटाउने अधिकार सुरक्षित राख्दछ।",
              neDesc: "Doorsteps Nepal ले सुरक्षा नियमहरू उल्लङ्घन गर्ने कुनै पनि प्रोफेशनललाई निलम्बन वा हटाउने अधिकार सुरक्षित राख्दछ।"
            }
          ]
        },
        "3": {
          title: "ग्राहक सुरक्षा र गृह प्रवेश नियमहरू",
          description: "ग्राहक परिसरमा सुरक्षित सेवा प्रदानको लागि दिशानिर्देशहरू:",
          points: [
            { 
              title: "व्यावसायिक आचरण", 
              desc: "प्रोफेशनलहरूले व्यावसायिक तरिकाले आइपुग्नुपर्दछ, स्पष्ट रूपमा आफ्नो परिचय दिनुपर्दछ, र बुक गरिएको सेवा मात्र प्रदान गर्नुपर्दछ।",
              neDesc: "प्रोफेशनलहरूले व्यावसायिक तरिकाले आइपुग्नुपर्दछ, स्पष्ट रूपमा आफ्नो परिचय दिनुपर्दछ, र बुक गरिएको सेवा मात्र प्रदान गर्नुपर्दछ।"
            },
            { 
              title: "गोपनीयताको सम्मान", 
              desc: "प्रोफेशनलहरूले सधैं ग्राहकको गोपनीयता र सम्पत्तिको सम्मान गर्नुपर्दछ।",
              neDesc: "प्रोफेशनलहरूले सधैं ग्राहकको गोपनीयता र सम्पत्तिको सम्मान गर्नुपर्दछ।"
            },
            { 
              title: "कडा निषेधहरू", 
              desc: "प्रोफेशनलहरूलाई अनुमति बिना प्रतिबन्धित क्षेत्रहरूमा प्रवेश गर्न, व्यक्तिगत सहयोग, ऋण, वा असम्बन्धित कामको लागि अनुरोध गर्न, वा अनाधिकृत व्यक्तिहरू ल्याउन कडाइका साथ निषेध गरिएको छ।",
              neDesc: "प्रोफेशनलहरूलाई अनुमति बिना प्रतिबन्धित क्षेत्रहरूमा प्रवेश गर्न, व्यक्तिगत सहयोग, ऋण, वा असम्बन्धित कामको लागि अनुरोध गर्न, वा अनाधिकृत व्यक्तिहरू ल्याउन कडाइका साथ निषेध गरिएको छ।"
            },
            { 
              title: "ग्राहक सावधानीहरू", 
              desc: "ग्राहकहरूलाई सेवाको समयमा कम्तिमा एक वयस्क उपस्थित रहेको सुनिश्चित गर्न र बालबालिका र घरपालुवा जनावरहरूलाई कार्य क्षेत्रबाट टाढा राख्न प्रोत्साहित गरिन्छ।",
              neDesc: "ग्राहकहरूलाई सेवाको समयमा कम्तिमा एक वयस्क उपस्थित रहेको सुनिश्चित गर्न र बालबालिका र घरपालुवा जनावरहरूलाई कार्य क्षेत्रबाट टाढा राख्न प्रोत्साहित गरिन्छ।"
            }
          ]
        },
        "4": {
          title: "स्वास्थ्य, सरसफाइ र सफाई",
          description: "उच्च सरसफाइ मापदण्डहरू कायम राख्दै:",
          points: [
            { 
              title: "व्यक्तिगत सरसफाइ", 
              desc: "प्रोफेशनलहरूले सफा उपकरणहरू प्रयोग गर्नुपर्दछ, व्यक्तिगत सरसफाइ मापदण्डहरू पालना गर्नुपर्दछ, र आवश्यक पर्दा सुरक्षात्मक गियर (पन्जा, मास्क) प्रयोग गर्नुपर्दछ।",
              neDesc: "प्रोफेशनलहरूले सफा उपकरणहरू प्रयोग गर्नुपर्दछ, व्यक्तिगत सरसफाइ मापदण्डहरू पालना गर्नुपर्दछ, र आवश्यक पर्दा सुरक्षात्मक गियर (पन्जा, मास्क) प्रयोग गर्नुपर्दछ।"
            },
            { 
              title: "सौन्दर्य सेवा मापदण्डहरू", 
              desc: "सौन्दर्य र कल्याण सेवाहरूले कीटाणुरहित उपकरणहरू प्रयोग गर्नुपर्दछ। एकल-प्रयोग वा राम्ररी कीटाणुरहित वस्तुहरू मात्र।",
              neDesc: "सौन्दर्य र कल्याण सेवाहरूले कीटाणुरहित उपकरणहरू प्रयोग गर्नुपर्दछ। एकल-प्रयोग वा राम्ररी कीटाणुरहित वस्तुहरू मात्र।"
            },
            { 
              title: "अनुपालन", 
              desc: "सरसफाइ मापदण्डहरू पूरा नभएमा Doorsteps Nepal ले सेवाहरू स्थगित गर्न सक्दछ।",
              neDesc: "सरसफाइ मापदण्डहरू पूरा नभएमा Doorsteps Nepal ले सेवाहरू स्थगित गर्न सक्दछ।"
            }
          ]
        },
        "5": {
          title: "आपतकालीन परिस्थितिहरू",
          description: "आपतकालिन अवस्था व्यवस्थापनका लागि प्रोटोकलहरू:",
          points: [
            { 
              title: "तुरुन्त कारबाही", 
              desc: "सुरक्षा जोखिम उत्पन्न भएमा प्रोफेशनलहरूले तुरुन्तै काम रोक्नुपर्दछ।",
              neDesc: "सुरक्षा जोखिम उत्पन्न भएमा प्रोफेशनलहरूले तुरुन्तै काम रोक्नुपर्दछ।"
            },
            { 
              title: "आपतकालीन सम्पर्कहरू", 
              desc: "ग्राहक र प्रोफेशनलहरूले आवश्यक पर्दा स्थानीय आपतकालीन सेवाहरूमा सम्पर्क गर्नुपर्दछ र सकेसम्म चाँडो Doorsteps Nepal समर्थनलाई जानकारी गराउनुपर्दछ।",
              neDesc: "ग्राहक र प्रोफेशनलहरूले आवश्यक पर्दा स्थानीय आपतकालीन सेवाहरूमा सम्पर्क गर्नुपर्दछ र सकेसम्म चाँडो Doorsteps Nepal समर्थनलाई जानकारी गराउनुपर्दछ।"
            },
            { 
              title: "सेवा समायोजन", 
              desc: "Doorsteps Nepal ले सुरक्षा चिन्ताको कारणले सेवाहरू रद्द वा पुन: तालिकीकरण गर्न सक्दछ, कुनै दण्ड शुल्क बिना।",
              neDesc: "Doorsteps Nepal ले सुरक्षा चिन्ताको कारणले सेवाहरू रद्द वा पुन: तालिकीकरण गर्न सक्दछ, कुनै दण्ड शुल्क बिना।"
            }
          ]
        },
        "6": {
          title: "शून्य-सहनशीलता नीति",
          description: "व्यावसायिक आचरणको कडा कार्यान्वयन:",
          points: [
            { 
              title: "निषेधित व्यवहारहरू", 
              desc: "Doorsteps Nepal निम्न कुराहरूको लागि शून्य सहनशीलता कायम राख्दछ: शारीरिक वा मौखिक दुर्व्यवहार, उत्पीडन वा भेदभाव, सेवाको समयमा मदिरा वा लागूपदार्थको प्रयोग, चोरी, धम्की, वा डर धाक, व्यक्ति वा सम्पत्तिलाई जोखिममा पार्ने असुरक्षित व्यवहार।",
              neDesc: "Doorsteps Nepal निम्न कुराहरूको लागि शून्य सहनशीलता कायम राख्दछ: शारीरिक वा मौखिक दुर्व्यवहार, उत्पीडन वा भेदभाव, सेवाको समयमा मदिरा वा लागूपदार्थको प्रयोग, चोरी, धम्की, वा डर धाक, व्यक्ति वा सम्पत्तिलाई जोखिममा पार्ने असुरक्षित व्यवहार।"
            },
            { 
              title: "परिणामहरू", 
              desc: "उल्लङ्घनले निम्न परिणाम ल्याउन सक्दछ: तुरुन्त सेवा समाप्ति, खाता निलम्बन वा स्थायी प्रतिबन्ध, आवश्यक परेमा कानुनी कारबाही।",
              neDesc: "उल्लङ्घनले निम्न परिणाम ल्याउन सक्दछ: तुरुन्त सेवा समाप्ति, खाता निलम्बन वा स्थायी प्रतिबन्ध, आवश्यक परेमा कानुनी कारबाही।"
            }
          ]
        },
        "7": {
          title: "ग्राहक जिम्मेवारीहरू",
          description: "सुरक्षित सेवाको लागि ग्राहक दायित्वहरू:",
          points: [
            { 
              title: "सटीक जानकारी", 
              desc: "ग्राहकहरूले सही सेवा विवरण र ठेगाना प्रदान गर्नुपर्दछ।",
              neDesc: "ग्राहकहरूले सही सेवा विवरण र ठेगाना प्रदान गर्नुपर्दछ।"
            },
            { 
              title: "सुरक्षित पहुँच", 
              desc: "सेवा स्थलमा सुरक्षित पहुँच सुनिश्चित गर्नुहोस्।",
              neDesc: "सेवा स्थलमा सुरक्षित पहुँच सुनिश्चित गर्नुहोस्।"
            },
            { 
              title: "सम्मानजनक व्यवहार", 
              desc: "प्रोफेशनलहरूप्रति सम्मानजनक व्यवहार कायम राख्नुहोस्।",
              neDesc: "प्रोफेशनलहरूप्रति सम्मानजनक व्यवहार कायम राख्नुहोस्।"
            },
            { 
              title: "दायरा पालना", 
              desc: "बुक गरिएको सेवाको दायराभन्दा बाहिरका असुरक्षित अनुरोधहरू नगर्नुहोस्।",
              neDesc: "बुक गरिएको सेवाको दायराभन्दा बाहिरका असुरक्षित अनुरोधहरू नगर्नुहोस्।"
            },
            { 
              title: "सेवा अस्वीकार", 
              desc: "ग्राहकको व्यवहार असुरक्षित भएमा Doorsteps Nepal ले सेवा अस्वीकार गर्न सक्दछ।",
              neDesc: "ग्राहकको व्यवहार असुरक्षित भएमा Doorsteps Nepal ले सेवा अस्वीकार गर्न सक्दछ।"
            }
          ]
        },
        "8": {
          title: "प्रोफेशनल र कर्मचारी जिम्मेवारीहरू",
          description: "सेवा प्रदायक र कर्मचारीहरूको कर्तव्यहरू:",
          points: [
            { 
              title: "सुरक्षा अनुपालन", 
              desc: "सबै सुरक्षा निर्देशनहरू पालना गर्नुहोस् र जोखिम, घटना, वा ग्राहकको दुर्व्यवहार रिपोर्ट गर्नुहोस्।",
              neDesc: "सबै सुरक्षा निर्देशनहरू पालना गर्नुहोस् र जोखिम, घटना, वा ग्राहकको दुर्व्यवहार रिपोर्ट गर्नुहोस्।"
            },
            { 
              title: "जोखिम न्यूनीकरण", 
              desc: "जोखिमपूर्ण छोटो बाटो वा अनधिकृत परिमार्जनहरू नगर्नुहोस्।",
              neDesc: "जोखिमपूर्ण छोटो बाटो वा अनधिकृत परिमार्जनहरू नगर्नुहोस्।"
            },
            { 
              title: "व्यावसायिकता", 
              desc: "सधैं व्यावसायिकता कायम राख्नुहोस्।",
              neDesc: "सधैं व्यावसायिकता कायम राख्नुहोस्।"
            },
            { 
              title: "अनुशासनात्मक कारबाही", 
              desc: "पालना नगर्दा अनुशासनात्मक कारबाही हुन सक्दछ।",
              neDesc: "पालना नगर्दा अनुशासनात्मक कारबाही हुन सक्दछ।"
            }
          ]
        },
        "9": {
          title: "घटना रिपोर्टिङ र अनुसन्धान",
          description: "सुरक्षा घटनाहरू व्यवस्थापनका लागि प्रक्रियाहरू:",
          points: [
            { 
              title: "रिपोर्टिङ च्यानलहरू", 
              desc: "तुरुन्त रिपोर्ट गर्नुहोस्: इमेल: doorstepnepal@gmail.com, फोन: ९८५१४०७७०६ / ९८५१४०७७०७",
              neDesc: "तुरुन्त रिपोर्ट गर्नुहोस्: इमेल: doorstepnepal@gmail.com, फोन: ९८५१४०७७०६ / ९८५१४०७७०७"
            },
            { 
              title: "अनुसन्धान प्रक्रिया", 
              desc: "Doorsteps Nepal ले घटना रेकर्ड गर्नेछ, आन्तरिक अनुसन्धान सञ्चालन गर्नेछ, र आवश्यक परेको ठाउँमा सुधारात्मक कारबाही गर्नेछ।",
              neDesc: "Doorsteps Nepal ले घटना रेकर्ड गर्नेछ, आन्तरिक अनुसन्धान सञ्चालन गर्नेछ, र आवश्यक परेको ठाउँमा सुधारात्मक कारबाही गर्नेछ।"
            }
          ]
        },
        "10": {
          title: "बिमा र दायित्व अस्वीकरण",
          description: "दायित्व सीमाहरू बुझ्दै:",
          points: [
            { 
              title: "सेवा सहजीकरण", 
              desc: "Doorsteps Nepal ले ग्राहक र प्रोफेशनलहरू बीच सेवा जडान सहज बनाउँदछ।",
              neDesc: "Doorsteps Nepal ले ग्राहक र प्रोफेशनलहरू बीच सेवा जडान सहज बनाउँदछ।"
            },
            { 
              title: "दायित्व सीमाहरू", 
              desc: "सुरक्षा उपायहरू लागू गरिए तापनि, Doorsteps Nepal सेवा स्थलहरूमा अज्ञात जोखिमहरू वा मर्मत वा स्थापित उपकरणको दुरुपयोगको लागि उत्तरदायी हुने छैन।",
              neDesc: "सुरक्षा उपायहरू लागू गरिए तापनि, Doorsteps Nepal सेवा स्थलहरूमा अज्ञात जोखिमहरू वा मर्मत वा स्थापित उपकरणको दुरुपयोगको लागि उत्तरदायी हुने छैन।"
            },
            { 
              title: "कानुनी सीमा", 
              desc: "कुनै दायित्व भएमा, नेपालको लागू कानून अनुसार सीमित हुनेछ।",
              neDesc: "कुनै दायित्व भएमा, नेपालको लागू कानून अनुसार सीमित हुनेछ।"
            }
          ]
        },
        "11": {
          title: "नीति अद्यावधिकहरू",
          description: "नीति वर्तमान र सान्दर्भिक राख्दै:",
          points: [
            { 
              title: "आवधिक समीक्षा", 
              desc: "Doorsteps Nepal ले यो सुरक्षा नीति आवधिक रूपमा अद्यावधिक गर्न सक्दछ।",
              neDesc: "Doorsteps Nepal ले यो सुरक्षा नीति आवधिक रूपमा अद्यावधिक गर्न सक्दछ।"
            },
            { 
              title: "आधिकारिक संस्करण", 
              desc: "वेबसाइटमा प्रकाशित नवीनतम संस्करण आधिकारिक मानिनेछ।",
              neDesc: "वेबसाइटमा प्रकाशित नवीनतम संस्करण आधिकारिक मानिनेछ।"
            }
          ]
        }
      },
      tableOfContents: [
        { num: "१", title: "उद्देश्य", icon: Heart },
        { num: "२", title: "प्रोफेशनल प्रमाणीकरण र तालिम", icon: GraduationCap },
        { num: "३", title: "ग्राहक सुरक्षा र गृह प्रवेश", icon: Home },
        { num: "४", title: "स्वास्थ्य, सरसफाइ र सफाई", icon: Sparkles },
        { num: "५", title: "आपतकालीन परिस्थितिहरू", icon: Ambulance },
        { num: "६", title: "शून्य-सहनशीलता नीति", icon: Gavel },
        { num: "७", title: "ग्राहक जिम्मेवारीहरू", icon: Users },
        { num: "८", title: "प्रोफेशनल र कर्मचारी जिम्मेवारीहरू", icon: Briefcase },
        { num: "९", title: "घटना रिपोर्टिङ", icon: ClipboardCheck },
        { num: "१०", title: "बिमा र दायित्व", icon: Scale },
        { num: "११", title: "नीति अद्यावधिकहरू", icon: RefreshCw }
      ],
      footer: {
        title: "सुरक्षा दिशानिर्देशहरू बारे प्रश्नहरू?",
        subtitle: "यस नीतिको कुनै पनि पक्षको स्पष्टीकरणको लागि हाम्रो सुरक्षा टीमलाई सम्पर्क गर्नुहोस्",
        button: "सुरक्षा टीमलाई सम्पर्क गर्नुहोस्"
      },
      backToTop: "माथि जानुहोस्",
      grievance: {
        title: "सुरक्षा घटना र समर्थन सम्पर्क",
        email: "safety@doorstepsnepal.com",
        response: "हामी सबै सुरक्षा चिन्ताहरू २ घण्टा भित्र जवाफ दिने लक्ष्य राख्छौं",
        support: [
          { title: "आपतकालिन रिपोर्टिङ", email: "emergency@doorstepsnepal.com" },
          { title: "सुरक्षा चिन्ताहरू", email: "safety@doorstepsnepal.com" },
          { title: "घटना रिपोर्ट", email: "incidents@doorstepsnepal.com" },
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
        <section className="py-12 md:py-16 bg-gradient-to-r from-red-500/10 to-orange-500/10">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20 mb-6">
                <ShieldCheck className="h-8 w-8 text-red-600" />
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
              <Card className="mb-8 border-red-500/20 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <Heart className="h-6 w-6 text-red-500" />
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
                        className="group flex items-center gap-4 p-4 rounded-lg border hover:border-red-500 hover:bg-red-500/5 transition-all"
                      >
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500/10 group-hover:bg-red-500/20">
                          <IconComponent className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <div className="text-sm text-red-600 font-medium">
                            {locale === "en" ? `Section ${item.num}` : `धारा ${item.num}`}
                          </div>
                          <div className="font-medium group-hover:text-red-600">{item.title}</div>
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
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10">
                          <span className="font-bold text-red-600">
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
                              sectionKey === '10' ? '१०' : '११'
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
                              <div key={index} className="border-l-4 border-red-500/30 pl-4 py-2">
                                <h3 className="font-bold text-lg mb-2 text-red-600">
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
                <Card className="border-red-500/20">
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-3">
                      <Mail className="h-6 w-6 text-red-500" />
                      {current.grievance.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <Mail className="h-6 w-6 text-red-500 mt-1" />
                        <div>
                          <p className="text-muted-foreground mb-4">
                            {locale === "en" 
                              ? "For any questions or concerns regarding safety, please contact our safety team:" 
                              : "सुरक्षाको बारेमा कुनै प्रश्न वा चिन्ताको लागि, कृपया हाम्रो सुरक्षा टीमलाई सम्पर्क गर्नुहोस्:"}
                          </p>
                          <div className="space-y-3">
                            <div className="p-4 bg-red-500/5 rounded-lg">
                              <div className="font-medium mb-1">
                                {locale === "en" ? "Primary Email" : "प्राथमिक इमेल"}
                              </div>
                              <code className="text-red-600 font-medium">{current.grievance.email}</code>
                            </div>
                            <div className="p-4 bg-red-500/5 rounded-lg">
                              <div className="font-medium mb-1">
                                {locale === "en" ? "Emergency Phone" : "आपतकालीन फोन"}
                              </div>
                              <p className="text-muted-foreground font-medium">9851407706 / 9851407707</p>
                            </div>
                            <div className="p-4 bg-red-500/5 rounded-lg">
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
                            <div key={index} className="p-4 rounded-lg border hover:border-red-500 transition-colors">
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
              <div className="mt-12 p-6 rounded-lg bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-lg mb-1">{current.footer.title}</h3>
                    <p className="text-sm text-muted-foreground">{current.footer.subtitle}</p>
                  </div>
                  <button
                    onClick={() => scrollToSection("contact")}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap"
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
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-red-600 transition-colors"
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