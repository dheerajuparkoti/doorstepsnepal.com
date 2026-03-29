"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Mail, 
  Eye, 
  Users, 
  FileText, 
  Briefcase,
  Users2,
  Building2,
  Home,
  Sparkles,
  ClipboardCheck,
  HelpCircle,
  CheckCircle2,
  Scale3D,
  PenTool,
  UsersRound,
  UserRoundPlus,
  Laptop,
  Camera,
  Hammer,
  Zap,
  BookOpen,
  Award as AwardIcon,
  CircleCheckBig} from "lucide-react";
import { useI18n } from '@/lib/i18n/context';
import { Footer } from "@/components/layout/footer";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { Nav } from "react-day-picker";
import { Navbar } from "@/components/layout/navbar";

export default function CareersPage() {
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

  // Bilingual content for careers page
  const content = {
    en: {
      hero: {
        title: "Careers & Join as Professional",
        subtitle: "Join Doorsteps Nepal - Grow your career with Nepal's leading doorstep service platform",
        lastUpdated: "Last Updated: December 2023",
        version: "Version 2.1"
      },
      introduction: {
        title: "Welcome to Doorsteps Nepal Careers",
        description: `Doorsteps Nepal is growing rapidly and we are always looking for skilled, reliable, and customer-focused individuals to join our team — either as employees or independent service professionals.`,
        note: "We offer flexible opportunities, fair earnings, and a respectful work environment where your skills are valued and your growth is supported."
      },
      paths: {
        title: "Two Clear Paths",
        professional: {
          title: "Join as Service Professional",
          subtitle: "Independent Contractor",
          description: "For skilled service providers such as:",
          roles: [
            "Electricians", "Plumbers", "Technicians", "Beauticians", "Therapists",
            "Photographers", "Videographers", "Editors", "Painters", "Carpenters",
            "Construction Workers", "House Workers", "Drivers", "Teachers & Trainers",
            "Writers", "IT & Digital Service Providers", "Designers", "and other service experts"
          ]
        },
        employee: {
          title: "Careers at Doorsteps Nepal",
          subtitle: "Employee",
          description: "For office staff, customer support, operations, marketing, HR, IT, and management roles."
        }
      },
      sections: {
        "1": {
          title: "Overview",
          description: "About Doorsteps Nepal opportunities:",
          points: [
            { 
              title: "Growing Platform", 
              desc: "Doorsteps Nepal is growing rapidly and we are always looking for skilled, reliable, and customer-focused individuals to join our team.",
              neDesc: "Doorsteps Nepal द्रुत रूपमा बढिरहेको छ र हामी सधैं हाम्रो टोलीमा सामेल हुन कुशल, भरपर्दो र ग्राहक-केन्द्रित व्यक्तिहरू खोजिरहेका छौं।"
            },
            { 
              title: "Two Paths", 
              desc: "Join either as employees or independent service professionals based on your preference and qualifications.",
              neDesc: "आफ्नो प्राथमिकता र योग्यताको आधारमा कर्मचारी वा स्वतन्त्र सेवा प्रदायकको रूपमा सामेल हुनुहोस्।"
            },
            { 
              title: "Work Environment", 
              desc: "We offer flexible opportunities, fair earnings, and a respectful work environment.",
              neDesc: "हामी लचिलो अवसरहरू, उचित कमाई, र सम्मानजनक कार्य वातावरण प्रदान गर्दछौं।"
            }
          ]
        },
        "2": {
          title: "Two Clear Paths",
          description: "Choose your journey with Doorsteps Nepal:",
          points: [
            { 
              title: "Service Professional (Independent)", 
              desc: "For skilled service providers such as: Electricians, Plumbers, Technicians, Beauticians, Therapists, Photographers, Videographers, Editors, Painters, Carpenters, Construction Workers, House Workers, Drivers, Teachers & Trainers, Writers, IT & Digital Service Providers, Designers and other service experts.",
              neDesc: "कुशल सेवा प्रदायकहरूको लागि जस्तै: इलेक्ट्रिशियन, प्लम्बर, टेक्निसियन, ब्युटिसियन, थेरापिस्ट, फोटोग्राफर, भिडियोग्राफर, सम्पादक, चित्रकार, बढई, निर्माण कामदार, गृह कामदार, चालक, शिक्षक र प्रशिक्षक, लेखक, आईटी र डिजिटल सेवा प्रदायक, डिजाइनर र अन्य सेवा विशेषज्ञहरू।"
            },
            { 
              title: "Careers as Employee", 
              desc: "For office staff, customer support, operations, marketing, HR, IT, and management roles.",
              neDesc: "कार्यालय कर्मचारी, ग्राहक समर्थन, सञ्चालन, मार्केटिंग, मानव संसाधन, आईटी, र व्यवस्थापन भूमिकाहरूको लागि।"
            }
          ]
        },
        "3": {
          title: "Join as Service Professional",
          description: "Requirements and process for professionals:",
          points: [
            { 
              title: "Who Can Apply", 
              desc: "Skilled individuals or teams with relevant experience. Freelancers or small service businesses. Legally eligible to work in Nepal.",
              neDesc: "सान्दर्भिक अनुभव भएका कुशल व्यक्ति वा टोलीहरू। फ्रीलान्सर वा साना सेवा व्यवसायहरू। नेपालमा काम गर्न कानूनी रूपमा योग्य।"
            },
            { 
              title: "Basic Requirements", 
              desc: "Valid government ID (Citizenship/License or equivalent). Minimum experience or skill proof. Smartphone with internet access. Willingness to follow Doorsteps Nepal policies.",
              neDesc: "वैध सरकारी परिचयपत्र (नागरिकता/लाइसेन्स वा सो सरह)। न्यूनतम अनुभव वा सीप प्रमाण। इन्टरनेट पहुँच भएको स्मार्टफोन। Doorsteps Nepal नीतिहरू पालना गर्न इच्छुकता।"
            },
            { 
              title: "Verification Process", 
              desc: "ID & document verification. Skill assessment or interview (if required). Background check (basic). Policy acceptance (Safety, Code of Conduct, Pricing).",
              neDesc: "परिचयपत्र र कागजात प्रमाणीकरण। सीप मूल्यांकन वा अन्तरवार्ता (आवश्यक परेमा)। पृष्ठभूमि जाँच (आधारभूत)। नीति स्वीकृति (सुरक्षा, आचार संहिता, मूल्य निर्धारण)।"
            },
            { 
              title: "Earnings & Payments", 
              desc: "Transparent commission structure. Payments after service completion: daily, weekly, or bi-weekly, subject to verification and payout policy. Performance-based incentives. Tips received directly from customers (if applicable).",
              neDesc: "पारदर्शी कमिशन संरचना। सेवा पूरा भएपछि भुक्तानी: दैनिक, साप्ताहिक, वा द्वि-साप्ताहिक, प्रमाणीकरण र भुक्तानी नीतिको अधीनमा। प्रदर्शन-आधारित प्रोत्साहन। ग्राहकहरूबाट सिधै प्राप्त टिप्स (लागू भएमा)।"
            }
          ]
        },
        "4": {
          title: "Professional Responsibilities",
          description: "Commitments required from all professionals:",
          points: [
            { 
              title: "Policy Compliance", 
              desc: "Follow Safety & Hygiene Policy.",
              neDesc: "सुरक्षा र सरसफाइ नीति पालना गर्नुहोस्।"
            },
            { 
              title: "Professional Conduct", 
              desc: "Arrive on time and behave professionally.",
              neDesc: "समयमा आइपुग्नुहोस् र व्यावसायिक व्यवहार गर्नुहोस्।"
            },
            { 
              title: "Service Scope", 
              desc: "Perform only booked services.",
              neDesc: "बुक गरिएका सेवाहरू मात्र प्रदर्शन गर्नुहोस्।"
            },
            { 
              title: "Privacy Respect", 
              desc: "Respect customer privacy and property.",
              neDesc: "ग्राहकको गोपनीयता र सम्पत्तिको सम्मान गर्नुहोस्।"
            },
            { 
              title: "Platform Compliance", 
              desc: "Avoid direct off-platform transactions without prior written approval.",
              neDesc: "पूर्व लिखित स्वीकृति बिना प्लेटफर्म बाहिर प्रत्यक्ष लेनदेन नगर्नुहोस्।"
            },
            { 
              title: "Consequences", 
              desc: "Violation may result in suspension or termination.",
              neDesc: "उल्लङ्घनले निलम्बन वा समाप्ति हुन सक्छ।"
            }
          ]
        },
        "5": {
          title: "Benefits of Joining Doorsteps Nepal",
          description: "What you gain by joining us:",
          points: [
            { 
              title: "Regular Work", 
              desc: "Regular job requests (subject to availability).",
              neDesc: "नियमित काम अनुरोधहरू (उपलब्धताको अधीनमा)।"
            },
            { 
              title: "Flexible Hours", 
              desc: "Flexible working hours.",
              neDesc: "लचिलो काम गर्ने घण्टा।"
            },
            { 
              title: "No Marketing Cost", 
              desc: "No marketing or advertising cost.",
              neDesc: "कुनै मार्केटिंग वा विज्ञापन लागत छैन।"
            },
            { 
              title: "Support Team", 
              desc: "Support team assistance.",
              neDesc: "समर्थन टोली सहायता।"
            },
            { 
              title: "Fair Earnings", 
              desc: "Fair earning opportunities.",
              neDesc: "उचित कमाई अवसरहरू।"
            },
            { 
              title: "Reputation Growth", 
              desc: "Opportunity to grow reputation and ratings.",
              neDesc: "प्रतिष्ठा र मूल्यांकन बढाउने अवसर।"
            },
            { 
              title: "Training", 
              desc: "Training and skill-development opportunities (when available).",
              neDesc: "प्रशिक्षण र सीप-विकास अवसरहरू (उपलब्ध हुँदा)।"
            },
            { 
              title: "Long-term Growth", 
              desc: "Long-term growth and career opportunities.",
              neDesc: "दीर्घकालीन वृद्धि र क्यारियर अवसरहरू।"
            },
            { 
              title: "Policy Modification", 
              desc: "Doorsteps Nepal reserves the right to modify eligibility criteria, policies, benefits, and processes at any time without prior notice.",
              neDesc: "Doorsteps Nepal ले पात्रता मापदण्ड, नीतिहरू, लाभहरू, र प्रक्रियाहरू कुनै पनि समय पूर्व सूचना बिना परिमार्जन गर्ने अधिकार सुरक्षित राख्दछ।"
            }
          ]
        },
        "6": {
          title: "How to Apply",
          description: "Application process for both paths:",
          points: [
            { 
              title: "For Service Professionals", 
              desc: "Fill out the 'Register as Professional' form. Upload required documents. Our team will contact you within 1–3 working days.",
              neDesc: "'प्रोफेशनलको रूपमा दर्ता गर्नुहोस्' फारम भर्नुहोस्। आवश्यक कागजातहरू अपलोड गर्नुहोस्। हाम्रो टोलीले १-३ कार्य दिन भित्र सम्पर्क गर्नेछ।"
            },
            { 
              title: "For Careers (Employees)", 
              desc: "Email your CV to: doorstepnepal@gmail.com. Subject: Position Name – Full Name",
              neDesc: "आफ्नो CV इमेल गर्नुहोस्: doorstepnepal@gmail.com। विषय: पदको नाम – पूरा नाम"
            }
          ]
        },
        "7": {
          title: "Legal Clarification",
          description: "Nepal-specific legal framework:",
          points: [
            { 
              title: "Independent Contractor Status", 
              desc: "Service Professionals engaged through the Doorsteps Nepal platform are independent contractors operating under a contract for services in accordance with the Contract Act, 2056 (2000) and shall not be deemed employees under the Labor Act, 2074 (2017) of Nepal.",
              neDesc: "Doorsteps Nepal प्लेटफर्म मार्फत संलग्न सेवा प्रदायकहरू कन्ट्र्याक्ट ऐन, २०५६ (२०००) अनुसार सेवाको लागि सम्झौता अन्तर्गत सञ्चालन हुने स्वतन्त्र ठेकेदार हुन् र नेपालको श्रम ऐन, २०७४ (२०१७) अन्तर्गत कर्मचारी मानिने छैनन्।"
            },
            { 
              title: "No Employment Relationship", 
              desc: "Doorsteps Nepal does not establish an employer–employee relationship, nor does it create any agency, partnership, joint venture, or representative relationship with Service Professionals.",
              neDesc: "Doorsteps Nepal ले रोजगारदाता-कर्मचारी सम्बन्ध स्थापित गर्दैन, न त यसले सेवा प्रदायकहरूसँग कुनै एजेन्सी, साझेदारी, संयुक्त उद्यम, वा प्रतिनिधि सम्बन्ध सिर्जना गर्दछ।"
            },
            { 
              title: "No Guaranteed Income", 
              desc: "Doorsteps Nepal does not guarantee any minimum number of service requests, working hours, or income to Service Professionals.",
              neDesc: "Doorsteps Nepal ले सेवा प्रदायकहरूलाई कुनै न्यूनतम सेवा अनुरोधहरू, काम गर्ने घण्टा, वा आयको ग्यारेन्टी गर्दैन।"
            },
            { 
              title: "Technology Platform", 
              desc: "Doorsteps Nepal operates solely as a technology-based facilitation platform and does not itself provide the underlying services.",
              neDesc: "Doorsteps Nepal विशेष रूपमा प्रविधि-आधारित सहजीकरण प्लेटफर्मको रूपमा सञ्चालन हुन्छ र आफैले अन्तर्निहित सेवाहरू प्रदान गर्दैन।"
            },
            { 
              title: "Professional Autonomy", 
              desc: "Service Professionals retain full control over the manner, method, timing, and execution of their services, subject only to platform policies, service standards, and customer requirements.",
              neDesc: "सेवा प्रदायकहरूले आफ्नो सेवाहरूको तरिका, विधि, समय, र कार्यान्वयनमा पूर्ण नियन्त्रण राख्दछन्, केवल प्लेटफर्म नीतिहरू, सेवा मापदण्डहरू, र ग्राहक आवश्यकताहरूको अधीनमा।"
            },
            { 
              title: "Professional Responsibility", 
              desc: "Service Professionals are solely responsible for their professional conduct, service quality, tools, equipment, materials, licenses, permits, taxes, social security contributions (if applicable), and compliance with all applicable laws and regulations of Nepal.",
              neDesc: "सेवा प्रदायकहरू आफ्नो व्यावसायिक आचरण, सेवा गुणस्तर, उपकरण, सामग्री, लाइसेन्स, अनुमतिपत्र, कर, सामाजिक सुरक्षा योगदान (लागू भएमा), र नेपालका सबै लागू कानून र नियमहरूको अनुपालनको लागि एक्लै जिम्मेवार छन्।"
            },
            { 
              title: "Liability Limitation", 
              desc: "Doorsteps Nepal shall not be responsible or liable for any acts, omissions, negligence, injuries, losses, damages, or disputes arising from services performed by Service Professionals, except to the extent required by applicable law.",
              neDesc: "Doorsteps Nepal सेवा प्रदायकहरूद्वारा प्रदर्शन गरिएका सेवाहरूबाट उत्पन्न हुने कुनै पनि कार्य, चूक, लापरवाही, चोटपटक, हानि, क्षति, वा विवादहरूको लागि जिम्मेवार वा उत्तरदायी हुने छैन, लागू कानून द्वारा आवश्यक हद सम्म बाहेक।"
            },
            { 
              title: "Employee Contracts", 
              desc: "Any individuals engaged directly by Doorsteps Nepal in administrative, technical, or operational roles shall be governed by separate written employment contracts executed in compliance with the Labor Act, 2074, related labor regulations, and Social Security Fund requirements.",
              neDesc: "प्रशासनिक, प्राविधिक, वा परिचालन भूमिकाहरूमा Doorsteps Nepal द्वारा सिधै संलग्न कुनै पनि व्यक्तिहरू श्रम ऐन, २०७४, सम्बन्धित श्रम नियमहरू, र सामाजिक सुरक्षा कोष आवश्यकताहरूको अनुपालनमा कार्यान्वयन गरिएका छुट्टै लिखित रोजगार सम्झौताहरूद्वारा नियन्त्रित हुनेछन्।"
            },
            { 
              title: "No Employment Benefits", 
              desc: "Nothing contained in these Terms shall be interpreted as creating rights to employment benefits, including but not limited to minimum wage, overtime, leave, gratuity, provident fund, or social security benefits, for Service Professionals.",
              neDesc: "यी सर्तहरूमा रहेको केहि पनि सेवा प्रदायकहरूको लागि रोजगार लाभहरूको अधिकार सिर्जना गर्ने रूपमा व्याख्या गरिने छैन, जसमा न्यूनतम ज्याला, ओभरटाइम, बिदा, ग्राच्युटी, भविष्य कोष, वा सामाजिक सुरक्षा लाभहरू सीमित छैनन्।"
            }
          ]
        },
        "8": {
          title: "Safety & Equal Opportunity Statement",
          description: "Our commitment to fairness and safety:",
          points: [
            { 
              title: "Equal Opportunity", 
              desc: "Doorsteps Nepal is an equal opportunity platform. We do not discriminate based on gender, caste, religion, ethnicity, or background.",
              neDesc: "Doorsteps Nepal एक समान अवसर प्लेटफर्म हो। हामी लिङ्ग, जात, धर्म, जातीयता, वा पृष्ठभूमिको आधारमा भेदभाव गर्दैनौं।"
            },
            { 
              title: "Zero Tolerance", 
              desc: "Harassment, abuse, or unsafe behavior will not be tolerated.",
              neDesc: "उत्पीडन, दुर्व्यवहार, वा असुरक्षित व्यवहार सहन गरिने छैन।"
            }
          ]
        },
        "9": {
          title: "FAQ Snippet",
          description: "Frequently asked questions:",
          points: [
            { 
              title: "Registration Fee?", 
              desc: "No hidden fees. Any onboarding cost (if applicable) will be clearly communicated.",
              neDesc: "कुनै लुकेको शुल्क छैन। कुनै पनि अनबोर्डिङ लागत (लागू भएमा) स्पष्ट रूपमा सूचित गरिनेछ।"
            },
            { 
              title: "Part-time Work?", 
              desc: "Yes, professionals can choose flexible hours.",
              neDesc: "हो, प्रोफेशनलहरूले लचिलो घण्टा रोज्न सक्छन्।"
            },
            { 
              title: "Payment Method?", 
              desc: "Payments are made via bank transfer or digital wallets as per payout cycle.",
              neDesc: "भुक्तानी भुक्तानी चक्र अनुसार बैंक ट्रान्सफर वा डिजिटल वालेट मार्फत गरिन्छ।"
            }
          ]
        }
      },
      tableOfContents: [
        { num: "1", title: "Overview", icon: Briefcase },
        { num: "2", title: "Two Clear Paths", icon: UsersRound },
        { num: "3", title: "Join as Service Professional", icon: UserRoundPlus },
        { num: "4", title: "Professional Responsibilities", icon: ClipboardCheck },
        { num: "5", title: "Benefits", icon: AwardIcon },
        { num: "6", title: "How to Apply", icon: PenTool },
        { num: "7", title: "Legal Clarification", icon: Scale3D },
        { num: "8", title: "Equal Opportunity", icon: Users2 },
        { num: "9", title: "FAQ", icon: HelpCircle }
      ],
      footer: {
        title: "Ready to Join Doorsteps Nepal?",
        subtitle: "Take the next step in your career - apply today and become part of our growing family",
        button: "Apply Now"
      },
      backToTop: "Back to Top",
      grievance: {
        title: "Careers & Recruitment Support",
        email: "careers@doorstepsnepal.com",
        response: "We aim to respond to all applications within 1-3 working days",
        support: [
          { title: "Professional Registration", email: "professionals@doorstepsnepal.com" },
          { title: "Career Applications", email: "careers@doorstepsnepal.com" },
          { title: "General Inquiries", email: "info@doorstepsnepal.com" },
          { title: "HR Department", email: "hr@doorstepsnepal.com" }
        ]
      },
      professionalRoles: {
        title: "In-Demand Professional Categories",
        categories: [
          { name: "Electrical & Plumbing", icon: Zap, roles: ["Electricians", "Plumbers", "Technicians"] },
          { name: "Beauty & Wellness", icon: Sparkles, roles: ["Beauticians", "Therapists", "Massage Specialists"] },
          { name: "Media & Creative", icon: Camera, roles: ["Photographers", "Videographers", "Editors", "Designers"] },
          { name: "Home Improvement", icon: Hammer, roles: ["Painters", "Carpenters", "Construction Workers"] },
          { name: "Domestic Services", icon: Home, roles: ["House Workers", "Drivers", "Cooks"] },
          { name: "Education", icon: BookOpen, roles: ["Teachers", "Trainers", "Tutors"] },
          { name: "IT & Digital", icon: Laptop, roles: ["Writers", "IT Professionals", "Digital Marketers"] }
        ]
      }
    },
    ne: {
      hero: {
        title: "करियर र प्रोफेशनलको रूपमा सामेल हुनुहोस्",
        subtitle: "Doorsteps Nepal मा सामेल हुनुहोस् - नेपालको अग्रणी डोरस्टेप सेवा प्लेटफर्मसँग आफ्नो करियर बढाउनुहोस्",
        lastUpdated: "अन्तिम अद्यावधिक: डिसेम्बर २०२३",
        version: "संस्करण २.१"
      },
      introduction: {
        title: "Doorsteps Nepal करियरमा स्वागत छ",
        description: `Doorsteps Nepal द्रुत रूपमा बढिरहेको छ र हामी सधैं हाम्रो टोलीमा सामेल हुन कुशल, भरपर्दो र ग्राहक-केन्द्रित व्यक्तिहरू खोजिरहेका छौं - कर्मचारी वा स्वतन्त्र सेवा प्रदायकको रूपमा।`,
        note: "हामी लचिलो अवसरहरू, उचित कमाई, र सम्मानजनक कार्य वातावरण प्रदान गर्दछौं जहाँ तपाईंको सीपहरू मूल्यवान छन् र तपाईंको वृद्धिलाई समर्थन गरिन्छ।"
      },
      paths: {
        title: "दुई स्पष्ट मार्गहरू",
        professional: {
          title: "सेवा प्रोफेशनलको रूपमा सामेल हुनुहोस्",
          subtitle: "स्वतन्त्र ठेकेदार",
          description: "कुशल सेवा प्रदायकहरूको लागि जस्तै:",
          roles: [
            "इलेक्ट्रिशियन", "प्लम्बर", "टेक्निसियन", "ब्युटिसियन", "थेरापिस्ट",
            "फोटोग्राफर", "भिडियोग्राफर", "सम्पादक", "चित्रकार", "बढई",
            "निर्माण कामदार", "गृह कामदार", "चालक", "शिक्षक र प्रशिक्षक",
            "लेखक", "आईटी र डिजिटल सेवा प्रदायक", "डिजाइनर", "र अन्य सेवा विशेषज्ञहरू"
          ]
        },
        employee: {
          title: "Doorsteps Nepal मा करियर",
          subtitle: "कर्मचारी",
          description: "कार्यालय कर्मचारी, ग्राहक समर्थन, सञ्चालन, मार्केटिंग, मानव संसाधन, आईटी, र व्यवस्थापन भूमिकाहरूको लागि।"
        }
      },
      sections: {
        "1": {
          title: "सिंहावलोकन",
          description: "Doorsteps Nepal अवसरहरूको बारेमा:",
          points: [
            { 
              title: "बढ्दो प्लेटफर्म", 
              desc: "Doorsteps Nepal द्रुत रूपमा बढिरहेको छ र हामी सधैं हाम्रो टोलीमा सामेल हुन कुशल, भरपर्दो र ग्राहक-केन्द्रित व्यक्तिहरू खोजिरहेका छौं।",
              neDesc: "Doorsteps Nepal द्रुत रूपमा बढिरहेको छ र हामी सधैं हाम्रो टोलीमा सामेल हुन कुशल, भरपर्दो र ग्राहक-केन्द्रित व्यक्तिहरू खोजिरहेका छौं।"
            },
            { 
              title: "दुई मार्गहरू", 
              desc: "आफ्नो प्राथमिकता र योग्यताको आधारमा कर्मचारी वा स्वतन्त्र सेवा प्रदायकको रूपमा सामेल हुनुहोस्।",
              neDesc: "आफ्नो प्राथमिकता र योग्यताको आधारमा कर्मचारी वा स्वतन्त्र सेवा प्रदायकको रूपमा सामेल हुनुहोस्।"
            },
            { 
              title: "कार्य वातावरण", 
              desc: "हामी लचिलो अवसरहरू, उचित कमाई, र सम्मानजनक कार्य वातावरण प्रदान गर्दछौं।",
              neDesc: "हामी लचिलो अवसरहरू, उचित कमाई, र सम्मानजनक कार्य वातावरण प्रदान गर्दछौं।"
            }
          ]
        },
        "2": {
          title: "दुई स्पष्ट मार्गहरू",
          description: "Doorsteps Nepal सँग आफ्नो यात्रा रोज्नुहोस्:",
          points: [
            { 
              title: "सेवा प्रोफेशनल (स्वतन्त्र)", 
              desc: "कुशल सेवा प्रदायकहरूको लागि जस्तै: इलेक्ट्रिशियन, प्लम्बर, टेक्निसियन, ब्युटिसियन, थेरापिस्ट, फोटोग्राफर, भिडियोग्राफर, सम्पादक, चित्रकार, बढई, निर्माण कामदार, गृह कामदार, चालक, शिक्षक र प्रशिक्षक, लेखक, आईटी र डिजिटल सेवा प्रदायक, डिजाइनर र अन्य सेवा विशेषज्ञहरू।",
              neDesc: "कुशल सेवा प्रदायकहरूको लागि जस्तै: इलेक्ट्रिशियन, प्लम्बर, टेक्निसियन, ब्युटिसियन, थेरापिस्ट, फोटोग्राफर, भिडियोग्राफर, सम्पादक, चित्रकार, बढई, निर्माण कामदार, गृह कामदार, चालक, शिक्षक र प्रशिक्षक, लेखक, आईटी र डिजिटल सेवा प्रदायक, डिजाइनर र अन्य सेवा विशेषज्ञहरू।"
            },
            { 
              title: "कर्मचारीको रूपमा करियर", 
              desc: "कार्यालय कर्मचारी, ग्राहक समर्थन, सञ्चालन, मार्केटिंग, मानव संसाधन, आईटी, र व्यवस्थापन भूमिकाहरूको लागि।",
              neDesc: "कार्यालय कर्मचारी, ग्राहक समर्थन, सञ्चालन, मार्केटिंग, मानव संसाधन, आईटी, र व्यवस्थापन भूमिकाहरूको लागि।"
            }
          ]
        },
        "3": {
          title: "सेवा प्रोफेशनलको रूपमा सामेल हुनुहोस्",
          description: "प्रोफेशनलहरूको लागि आवश्यकताहरू र प्रक्रिया:",
          points: [
            { 
              title: "कसले आवेदन दिन सक्छ", 
              desc: "सान्दर्भिक अनुभव भएका कुशल व्यक्ति वा टोलीहरू। फ्रीलान्सर वा साना सेवा व्यवसायहरू। नेपालमा काम गर्न कानूनी रूपमा योग्य।",
              neDesc: "सान्दर्भिक अनुभव भएका कुशल व्यक्ति वा टोलीहरू। फ्रीलान्सर वा साना सेवा व्यवसायहरू। नेपालमा काम गर्न कानूनी रूपमा योग्य।"
            },
            { 
              title: "आधारभूत आवश्यकताहरू", 
              desc: "वैध सरकारी परिचयपत्र (नागरिकता/लाइसेन्स वा सो सरह)। न्यूनतम अनुभव वा सीप प्रमाण। इन्टरनेट पहुँच भएको स्मार्टफोन। Doorsteps Nepal नीतिहरू पालना गर्न इच्छुकता।",
              neDesc: "वैध सरकारी परिचयपत्र (नागरिकता/लाइसेन्स वा सो सरह)। न्यूनतम अनुभव वा सीप प्रमाण। इन्टरनेट पहुँच भएको स्मार्टफोन। Doorsteps Nepal नीतिहरू पालना गर्न इच्छुकता।"
            },
            { 
              title: "प्रमाणीकरण प्रक्रिया", 
              desc: "परिचयपत्र र कागजात प्रमाणीकरण। सीप मूल्यांकन वा अन्तरवार्ता (आवश्यक परेमा)। पृष्ठभूमि जाँच (आधारभूत)। नीति स्वीकृति (सुरक्षा, आचार संहिता, मूल्य निर्धारण)।",
              neDesc: "परिचयपत्र र कागजात प्रमाणीकरण। सीप मूल्यांकन वा अन्तरवार्ता (आवश्यक परेमा)। पृष्ठभूमि जाँच (आधारभूत)। नीति स्वीकृति (सुरक्षा, आचार संहिता, मूल्य निर्धारण)।"
            },
            { 
              title: "कमाई र भुक्तानी", 
              desc: "पारदर्शी कमिशन संरचना। सेवा पूरा भएपछि भुक्तानी: दैनिक, साप्ताहिक, वा द्वि-साप्ताहिक, प्रमाणीकरण र भुक्तानी नीतिको अधीनमा। प्रदर्शन-आधारित प्रोत्साहन। ग्राहकहरूबाट सिधै प्राप्त टिप्स (लागू भएमा)।",
              neDesc: "पारदर्शी कमिशन संरचना। सेवा पूरा भएपछि भुक्तानी: दैनिक, साप्ताहिक, वा द्वि-साप्ताहिक, प्रमाणीकरण र भुक्तानी नीतिको अधीनमा। प्रदर्शन-आधारित प्रोत्साहन। ग्राहकहरूबाट सिधै प्राप्त टिप्स (लागू भएमा)।"
            }
          ]
        },
        "4": {
          title: "प्रोफेशनल जिम्मेवारीहरू",
          description: "सबै प्रोफेशनलहरूबाट आवश्यक प्रतिबद्धताहरू:",
          points: [
            { 
              title: "नीति अनुपालन", 
              desc: "सुरक्षा र सरसफाइ नीति पालना गर्नुहोस्।",
              neDesc: "सुरक्षा र सरसफाइ नीति पालना गर्नुहोस्।"
            },
            { 
              title: "व्यावसायिक आचरण", 
              desc: "समयमा आइपुग्नुहोस् र व्यावसायिक व्यवहार गर्नुहोस्।",
              neDesc: "समयमा आइपुग्नुहोस् र व्यावसायिक व्यवहार गर्नुहोस्।"
            },
            { 
              title: "सेवा दायरा", 
              desc: "बुक गरिएका सेवाहरू मात्र प्रदर्शन गर्नुहोस्।",
              neDesc: "बुक गरिएका सेवाहरू मात्र प्रदर्शन गर्नुहोस्।"
            },
            { 
              title: "गोपनीयता सम्मान", 
              desc: "ग्राहकको गोपनीयता र सम्पत्तिको सम्मान गर्नुहोस्।",
              neDesc: "ग्राहकको गोपनीयता र सम्पत्तिको सम्मान गर्नुहोस्।"
            },
            { 
              title: "प्लेटफर्म अनुपालन", 
              desc: "पूर्व लिखित स्वीकृति बिना प्लेटफर्म बाहिर प्रत्यक्ष लेनदेन नगर्नुहोस्।",
              neDesc: "पूर्व लिखित स्वीकृति बिना प्लेटफर्म बाहिर प्रत्यक्ष लेनदेन नगर्नुहोस्।"
            },
            { 
              title: "परिणामहरू", 
              desc: "उल्लङ्घनले निलम्बन वा समाप्ति हुन सक्छ।",
              neDesc: "उल्लङ्घनले निलम्बन वा समाप्ति हुन सक्छ।"
            }
          ]
        },
        "5": {
          title: "Doorsteps Nepal मा सामेल हुने लाभहरू",
          description: "हामीसँग सामेल भएर तपाईं के प्राप्त गर्नुहुन्छ:",
          points: [
            { 
              title: "नियमित काम", 
              desc: "नियमित काम अनुरोधहरू (उपलब्धताको अधीनमा)।",
              neDesc: "नियमित काम अनुरोधहरू (उपलब्धताको अधीनमा)।"
            },
            { 
              title: "लचिलो घण्टा", 
              desc: "लचिलो काम गर्ने घण्टा।",
              neDesc: "लचिलो काम गर्ने घण्टा।"
            },
            { 
              title: "कुनै मार्केटिंग लागत छैन", 
              desc: "कुनै मार्केटिंग वा विज्ञापन लागत छैन।",
              neDesc: "कुनै मार्केटिंग वा विज्ञापन लागत छैन।"
            },
            { 
              title: "समर्थन टोली", 
              desc: "समर्थन टोली सहायता।",
              neDesc: "समर्थन टोली सहायता।"
            },
            { 
              title: "उचित कमाई", 
              desc: "उचित कमाई अवसरहरू।",
              neDesc: "उचित कमाई अवसरहरू।"
            },
            { 
              title: "प्रतिष्ठा वृद्धि", 
              desc: "प्रतिष्ठा र मूल्यांकन बढाउने अवसर।",
              neDesc: "प्रतिष्ठा र मूल्यांकन बढाउने अवसर।"
            },
            { 
              title: "प्रशिक्षण", 
              desc: "प्रशिक्षण र सीप-विकास अवसरहरू (उपलब्ध हुँदा)।",
              neDesc: "प्रशिक्षण र सीप-विकास अवसरहरू (उपलब्ध हुँदा)।"
            },
            { 
              title: "दीर्घकालीन वृद्धि", 
              desc: "दीर्घकालीन वृद्धि र करियर अवसरहरू।",
              neDesc: "दीर्घकालीन वृद्धि र करियर अवसरहरू।"
            },
            { 
              title: "नीति परिमार्जन", 
              desc: "Doorsteps Nepal ले पात्रता मापदण्ड, नीतिहरू, लाभहरू, र प्रक्रियाहरू कुनै पनि समय पूर्व सूचना बिना परिमार्जन गर्ने अधिकार सुरक्षित राख्दछ।",
              neDesc: "Doorsteps Nepal ले पात्रता मापदण्ड, नीतिहरू, लाभहरू, र प्रक्रियाहरू कुनै पनि समय पूर्व सूचना बिना परिमार्जन गर्ने अधिकार सुरक्षित राख्दछ।"
            }
          ]
        },
        "6": {
          title: "कसरी आवेदन दिने",
          description: "दुवै मार्गहरूको लागि आवेदन प्रक्रिया:",
          points: [
            { 
              title: "सेवा प्रोफेशनलहरूको लागि", 
              desc: "'प्रोफेशनलको रूपमा दर्ता गर्नुहोस्' फारम भर्नुहोस्। आवश्यक कागजातहरू अपलोड गर्नुहोस्। हाम्रो टोलीले १-३ कार्य दिन भित्र सम्पर्क गर्नेछ।",
              neDesc: "'प्रोफेशनलको रूपमा दर्ता गर्नुहोस्' फारम भर्नुहोस्। आवश्यक कागजातहरू अपलोड गर्नुहोस्। हाम्रो टोलीले १-३ कार्य दिन भित्र सम्पर्क गर्नेछ।"
            },
            { 
              title: "करियर (कर्मचारीहरू) को लागि", 
              desc: "आफ्नो CV इमेल गर्नुहोस्: doorstepnepal@gmail.com। विषय: पदको नाम – पूरा नाम",
              neDesc: "आफ्नो CV इमेल गर्नुहोस्: doorstepnepal@gmail.com। विषय: पदको नाम – पूरा नाम"
            }
          ]
        },
        "7": {
          title: "कानूनी स्पष्टीकरण",
          description: "नेपाल-विशिष्ट कानूनी ढाँचा:",
          points: [
            { 
              title: "स्वतन्त्र ठेकेदार स्थिति", 
              desc: "Doorsteps Nepal प्लेटफर्म मार्फत संलग्न सेवा प्रदायकहरू कन्ट्र्याक्ट ऐन, २०५६ (२०००) अनुसार सेवाको लागि सम्झौता अन्तर्गत सञ्चालन हुने स्वतन्त्र ठेकेदार हुन् र नेपालको श्रम ऐन, २०७४ (२०१७) अन्तर्गत कर्मचारी मानिने छैनन्।",
              neDesc: "Doorsteps Nepal प्लेटफर्म मार्फत संलग्न सेवा प्रदायकहरू कन्ट्र्याक्ट ऐन, २०५६ (२०००) अनुसार सेवाको लागि सम्झौता अन्तर्गत सञ्चालन हुने स्वतन्त्र ठेकेदार हुन् र नेपालको श्रम ऐन, २०७४ (२०१७) अन्तर्गत कर्मचारी मानिने छैनन्।"
            },
            { 
              title: "कुनै रोजगार सम्बन्ध छैन", 
              desc: "Doorsteps Nepal ले रोजगारदाता-कर्मचारी सम्बन्ध स्थापित गर्दैन, न त यसले सेवा प्रदायकहरूसँग कुनै एजेन्सी, साझेदारी, संयुक्त उद्यम, वा प्रतिनिधि सम्बन्ध सिर्जना गर्दछ।",
              neDesc: "Doorsteps Nepal ले रोजगारदाता-कर्मचारी सम्बन्ध स्थापित गर्दैन, न त यसले सेवा प्रदायकहरूसँग कुनै एजेन्सी, साझेदारी, संयुक्त उद्यम, वा प्रतिनिधि सम्बन्ध सिर्जना गर्दछ।"
            },
            { 
              title: "कुनै ग्यारेन्टी गरिएको आय छैन", 
              desc: "Doorsteps Nepal ले सेवा प्रदायकहरूलाई कुनै न्यूनतम सेवा अनुरोधहरू, काम गर्ने घण्टा, वा आयको ग्यारेन्टी गर्दैन।",
              neDesc: "Doorsteps Nepal ले सेवा प्रदायकहरूलाई कुनै न्यूनतम सेवा अनुरोधहरू, काम गर्ने घण्टा, वा आयको ग्यारेन्टी गर्दैन।"
            },
            { 
              title: "प्रविधि प्लेटफर्म", 
              desc: "Doorsteps Nepal विशेष रूपमा प्रविधि-आधारित सहजीकरण प्लेटफर्मको रूपमा सञ्चालन हुन्छ र आफैले अन्तर्निहित सेवाहरू प्रदान गर्दैन।",
              neDesc: "Doorsteps Nepal विशेष रूपमा प्रविधि-आधारित सहजीकरण प्लेटफर्मको रूपमा सञ्चालन हुन्छ र आफैले अन्तर्निहित सेवाहरू प्रदान गर्दैन।"
            },
            { 
              title: "प्रोफेशनल स्वायत्तता", 
              desc: "सेवा प्रदायकहरूले आफ्नो सेवाहरूको तरिका, विधि, समय, र कार्यान्वयनमा पूर्ण नियन्त्रण राख्दछन्, केवल प्लेटफर्म नीतिहरू, सेवा मापदण्डहरू, र ग्राहक आवश्यकताहरूको अधीनमा।",
              neDesc: "सेवा प्रदायकहरूले आफ्नो सेवाहरूको तरिका, विधि, समय, र कार्यान्वयनमा पूर्ण नियन्त्रण राख्दछन्, केवल प्लेटफर्म नीतिहरू, सेवा मापदण्डहरू, र ग्राहक आवश्यकताहरूको अधीनमा।"
            },
            { 
              title: "प्रोफेशनल जिम्मेवारी", 
              desc: "सेवा प्रदायकहरू आफ्नो व्यावसायिक आचरण, सेवा गुणस्तर, उपकरण, सामग्री, लाइसेन्स, अनुमतिपत्र, कर, सामाजिक सुरक्षा योगदान (लागू भएमा), र नेपालका सबै लागू कानून र नियमहरूको अनुपालनको लागि एक्लै जिम्मेवार छन्।",
              neDesc: "सेवा प्रदायकहरू आफ्नो व्यावसायिक आचरण, सेवा गुणस्तर, उपकरण, सामग्री, लाइसेन्स, अनुमतिपत्र, कर, सामाजिक सुरक्षा योगदान (लागू भएमा), र नेपालका सबै लागू कानून र नियमहरूको अनुपालनको लागि एक्लै जिम्मेवार छन्।"
            },
            { 
              title: "दायित्व सीमा", 
              desc: "Doorsteps Nepal सेवा प्रदायकहरूद्वारा प्रदर्शन गरिएका सेवाहरूबाट उत्पन्न हुने कुनै पनि कार्य, चूक, लापरवाही, चोटपटक, हानि, क्षति, वा विवादहरूको लागि जिम्मेवार वा उत्तरदायी हुने छैन, लागू कानून द्वारा आवश्यक हद सम्म बाहेक।",
              neDesc: "Doorsteps Nepal सेवा प्रदायकहरूद्वारा प्रदर्शन गरिएका सेवाहरूबाट उत्पन्न हुने कुनै पनि कार्य, चूक, लापरवाही, चोटपटक, हानि, क्षति, वा विवादहरूको लागि जिम्मेवार वा उत्तरदायी हुने छैन, लागू कानून द्वारा आवश्यक हद सम्म बाहेक।"
            },
            { 
              title: "कर्मचारी सम्झौताहरू", 
              desc: "प्रशासनिक, प्राविधिक, वा परिचालन भूमिकाहरूमा Doorsteps Nepal द्वारा सिधै संलग्न कुनै पनि व्यक्तिहरू श्रम ऐन, २०७४, सम्बन्धित श्रम नियमहरू, र सामाजिक सुरक्षा कोष आवश्यकताहरूको अनुपालनमा कार्यान्वयन गरिएका छुट्टै लिखित रोजगार सम्झौताहरूद्वारा नियन्त्रित हुनेछन्।",
              neDesc: "प्रशासनिक, प्राविधिक, वा परिचालन भूमिकाहरूमा Doorsteps Nepal द्वारा सिधै संलग्न कुनै पनि व्यक्तिहरू श्रम ऐन, २०७४, सम्बन्धित श्रम नियमहरू, र सामाजिक सुरक्षा कोष आवश्यकताहरूको अनुपालनमा कार्यान्वयन गरिएका छुट्टै लिखित रोजगार सम्झौताहरूद्वारा नियन्त्रित हुनेछन्।"
            },
            { 
              title: "कुनै रोजगार लाभहरू छैनन्", 
              desc: "यी सर्तहरूमा रहेको केहि पनि सेवा प्रदायकहरूको लागि रोजगार लाभहरूको अधिकार सिर्जना गर्ने रूपमा व्याख्या गरिने छैन, जसमा न्यूनतम ज्याला, ओभरटाइम, बिदा, ग्राच्युटी, भविष्य कोष, वा सामाजिक सुरक्षा लाभहरू सीमित छैनन्।",
              neDesc: "यी सर्तहरूमा रहेको केहि पनि सेवा प्रदायकहरूको लागि रोजगार लाभहरूको अधिकार सिर्जना गर्ने रूपमा व्याख्या गरिने छैन, जसमा न्यूनतम ज्याला, ओभरटाइम, बिदा, ग्राच्युटी, भविष्य कोष, वा सामाजिक सुरक्षा लाभहरू सीमित छैनन्।"
            }
          ]
        },
        "8": {
          title: "सुरक्षा र समान अवसर कथन",
          description: "निष्पक्षता र सुरक्षाप्रति हाम्रो प्रतिबद्धता:",
          points: [
            { 
              title: "समान अवसर", 
              desc: "Doorsteps Nepal एक समान अवसर प्लेटफर्म हो। हामी लिङ्ग, जात, धर्म, जातीयता, वा पृष्ठभूमिको आधारमा भेदभाव गर्दैनौं।",
              neDesc: "Doorsteps Nepal एक समान अवसर प्लेटफर्म हो। हामी लिङ्ग, जात, धर्म, जातीयता, वा पृष्ठभूमिको आधारमा भेदभाव गर्दैनौं।"
            },
            { 
              title: "शून्य सहनशीलता", 
              desc: "उत्पीडन, दुर्व्यवहार, वा असुरक्षित व्यवहार सहन गरिने छैन।",
              neDesc: "उत्पीडन, दुर्व्यवहार, वा असुरक्षित व्यवहार सहन गरिने छैन।"
            }
          ]
        },
        "9": {
          title: "FAQ अंश",
          description: "बारम्बार सोधिने प्रश्नहरू:",
          points: [
            { 
              title: "दर्ता शुल्क?", 
              desc: "कुनै लुकेको शुल्क छैन। कुनै पनि अनबोर्डिङ लागत (लागू भएमा) स्पष्ट रूपमा सूचित गरिनेछ।",
              neDesc: "कुनै लुकेको शुल्क छैन। कुनै पनि अनबोर्डिङ लागत (लागू भएमा) स्पष्ट रूपमा सूचित गरिनेछ।"
            },
            { 
              title: "अंशकालिक काम?", 
              desc: "हो, प्रोफेशनलहरूले लचिलो घण्टा रोज्न सक्छन्।",
              neDesc: "हो, प्रोफेशनलहरूले लचिलो घण्टा रोज्न सक्छन्।"
            },
            { 
              title: "भुक्तानी विधि?", 
              desc: "भुक्तानी भुक्तानी चक्र अनुसार बैंक ट्रान्सफर वा डिजिटल वालेट मार्फत गरिन्छ।",
              neDesc: "भुक्तानी भुक्तानी चक्र अनुसार बैंक ट्रान्सफर वा डिजिटल वालेट मार्फत गरिन्छ।"
            }
          ]
        }
      },
      tableOfContents: [
        { num: "१", title: "सिंहावलोकन", icon: Briefcase },
        { num: "२", title: "दुई स्पष्ट मार्गहरू", icon: UsersRound },
        { num: "३", title: "सेवा प्रोफेशनलको रूपमा सामेल हुनुहोस्", icon: UserRoundPlus },
        { num: "४", title: "प्रोफेशनल जिम्मेवारीहरू", icon: ClipboardCheck },
        { num: "५", title: "लाभहरू", icon: AwardIcon },
        { num: "६", title: "कसरी आवेदन दिने", icon: PenTool },
        { num: "७", title: "कानूनी स्पष्टीकरण", icon: Scale3D },
        { num: "८", title: "समान अवसर", icon: Users2 },
        { num: "९", title: "FAQ", icon: HelpCircle }
      ],
      footer: {
        title: "Doorsteps Nepal मा सामेल हुन तयार हुनुहुन्छ?",
        subtitle: "आफ्नो करियरमा अर्को कदम चाल्नुहोस् - आजै आवेदन दिनुहोस् र हाम्रो बढ्दो परिवारको हिस्सा बन्नुहोस्",
        button: "अहिले नै आवेदन दिनुहोस्"
      },
      backToTop: "माथि जानुहोस्",
      grievance: {
        title: "करियर र भर्ती समर्थन",
        email: "careers@doorstepsnepal.com",
        response: "हामी सबै आवेदनहरू १-३ कार्य दिन भित्र जवाफ दिने लक्ष्य राख्छौं",
        support: [
          { title: "प्रोफेशनल दर्ता", email: "professionals@doorstepsnepal.com" },
          { title: "करियर आवेदनहरू", email: "careers@doorstepsnepal.com" },
          { title: "सामान्य जिज्ञासा", email: "info@doorstepsnepal.com" },
          { title: "मानव संसाधन विभाग", email: "hr@doorstepsnepal.com" }
        ]
      },
      professionalRoles: {
        title: "माग भएका प्रोफेशनल श्रेणीहरू",
        categories: [
          { name: "विद्युत र प्लम्बिंग", icon: Zap, roles: ["इलेक्ट्रिशियन", "प्लम्बर", "टेक्निसियन"] },
          { name: "सौन्दर्य र कल्याण", icon: Sparkles, roles: ["ब्युटिसियन", "थेरापिस्ट", "मसाज विशेषज्ञ"] },
          { name: "मिडिया र क्रिएटिव", icon: Camera, roles: ["फोटोग्राफर", "भिडियोग्राफर", "सम्पादक", "डिजाइनर"] },
          { name: "गृह सुधार", icon: Hammer, roles: ["चित्रकार", "बढई", "निर्माण कामदार"] },
          { name: "घरेलु सेवाहरू", icon: Home, roles: ["गृह कामदार", "चालक", "भान्से"] },
          { name: "शिक्षा", icon: BookOpen, roles: ["शिक्षक", "प्रशिक्षक", "ट्यूटर"] },
          { name: "आईटी र डिजिटल", icon: Laptop, roles: ["लेखक", "आईटी पेशेवर", "डिजिटल मार्केटर"] }
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
        <section className="py-12 md:py-16 bg-gradient-to-r from-green-500/10 to-emerald-500/10">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-6">
                <UserRoundPlus className="h-8 w-8 text-green-600" />
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
                 <div className="px-4 md:px-8 lg:px-12">
              {/* Introduction Card */}
              <Card className="mb-8 border-green-500/20 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <Briefcase className="h-6 w-6 text-green-600" />
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

              {/* Two Paths Highlight */}
              <div className="grid md:grid-cols-2 gap-6 mb-12">
                <Card className="border-2 border-green-500/20 hover:border-green-500/40 transition-all">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserRoundPlus className="h-6 w-6 text-green-600" />
                      {current.paths.professional.title}
                    </CardTitle>
                    <p className="text-sm text-green-600 font-medium">{current.paths.professional.subtitle}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{current.paths.professional.description}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {current.paths.professional.roles.slice(0, 8).map((role, idx) => (
                        <div key={idx} className="text-sm flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span>{role}</span>
                        </div>
                      ))}
                      {current.paths.professional.roles.length > 8 && (
                        <div className="text-sm text-muted-foreground col-span-2 mt-2">
                          + {current.paths.professional.roles.length - 8} more
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-blue-500/20 hover:border-blue-500/40 transition-all">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-6 w-6 text-blue-600" />
                      {current.paths.employee.title}
                    </CardTitle>
                    <p className="text-sm text-blue-600 font-medium">{current.paths.employee.subtitle}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{current.paths.employee.description}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Professional Roles Grid */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <Users className="h-6 w-6 text-primary" />
                  {current.professionalRoles.title}
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {current.professionalRoles.categories.map((category, idx) => {
                    const IconComponent = category.icon as React.ElementType;
                    return (
                      <Card key={idx} className="hover:border-green-500 transition-all">
                        <CardContent className="pt-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-green-500/10 rounded-lg">
                              <IconComponent className="h-5 w-5 text-green-600" />
                            </div>
                            <h3 className="font-semibold">{category.name}</h3>
                          </div>
                          <div className="space-y-1">
                            {category.roles.map((role, roleIdx) => (
                              <div key={roleIdx} className="text-sm text-muted-foreground flex items-center gap-2">
                                <CircleCheckBig className="h-3 w-3 text-green-500" />
                                <span>{role}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Table of Contents */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <FileText className="h-6 w-6 text-primary" />
                  {locale === "en" ? "Table of Contents" : "विषयसूची"}
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {current.tableOfContents.map((item) => {
                    const IconComponent = item.icon as React.ElementType;
                    return (
                      <a 
                        key={item.num} 
                        href={`#section-${item.num}`}
                        className="group flex items-center gap-4 p-4 rounded-lg border hover:border-green-500 hover:bg-green-500/5 transition-all"
                      >
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500/10 group-hover:bg-green-500/20">
                          <IconComponent className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <div className="text-sm text-green-600 font-medium">
                            {locale === "en" ? `Section ${item.num}` : `धारा ${item.num}`}
                          </div>
                          <div className="font-medium group-hover:text-green-600">{item.title}</div>
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
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500/10">
                          <span className="font-bold text-green-600">
                            {locale === 'en' ? sectionKey : 
                              sectionKey === '1' ? '१' :
                              sectionKey === '2' ? '२' :
                              sectionKey === '3' ? '३' :
                              sectionKey === '4' ? '४' :
                              sectionKey === '5' ? '५' :
                              sectionKey === '6' ? '६' :
                              sectionKey === '7' ? '७' :
                              sectionKey === '8' ? '८' : '९'
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
                              <div key={index} className="border-l-4 border-green-500/30 pl-4 py-2">
                                <h3 className="font-bold text-lg mb-2 text-green-600">
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
                <Card className="border-green-500/20">
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-3">
                      <Mail className="h-6 w-6 text-green-600" />
                      {current.grievance.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <Mail className="h-6 w-6 text-green-600 mt-1" />
                        <div>
                          <p className="text-muted-foreground mb-4">
                            {locale === "en" 
                              ? "For any questions regarding careers or professional registration, please contact our recruitment team:" 
                              : "करियर वा प्रोफेशनल दर्ता सम्बन्धी कुनै प्रश्नको लागि, कृपया हाम्रो भर्ती टोलीलाई सम्पर्क गर्नुहोस्:"}
                          </p>
                          <div className="space-y-3">
                            <div className="p-4 bg-green-500/5 rounded-lg">
                              <div className="font-medium mb-1">
                                {locale === "en" ? "Primary Email" : "प्राथमिक इमेल"}
                              </div>
                              <code className="text-green-600 font-medium">{current.grievance.email}</code>
                            </div>
                            <div className="p-4 bg-green-500/5 rounded-lg">
                              <div className="font-medium mb-1">
                                {locale === "en" ? "Phone" : "फोन"}
                              </div>
                              <p className="text-muted-foreground font-medium">9851407706 / 9851407707</p>
                            </div>
                            <div className="p-4 bg-green-500/5 rounded-lg">
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
                            <div key={index} className="p-4 rounded-lg border hover:border-green-500 transition-colors">
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
              <div className="mt-12 p-6 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-lg mb-1">{current.footer.title}</h3>
                    <p className="text-sm text-muted-foreground">{current.footer.subtitle}</p>
                  </div>
                  <button
                    onClick={() => window.location.href = 'mailto:careers@doorstepsnepal.com'}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap"
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
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-green-600 transition-colors"
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