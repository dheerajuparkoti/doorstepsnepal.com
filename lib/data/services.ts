// export interface ServiceCategory {
//   id: string;
//   name: string;
//   nameNe: string;
//   description: string;
//   descriptionNe: string;
//   image: string;
//   icon: string;
//   subcategories: ServiceSubcategory[];
// }

// export interface ServiceSubcategory {
//   id: string;
//   categoryId: string;
//   name: string;
//   nameNe: string;
//   description: string;
//   descriptionNe: string;
//   image: string;
//   services: Service[];
// }

// export interface Service {
//   id: string;
//   subcategoryId: string;
//   name: string;
//   nameNe: string;
//   description: string;
//   descriptionNe: string;
//   image: string;
//   price: number;
//   priceUnit: string;
//   duration: string;
//   rating: number;
//   reviewCount: number;
// }

// export interface Professional {
//   id: string;
//   name: string;
//   nameNe: string;
//   avatar: string;
//   skills: string[];
//   rating: number;
//   totalJobs: number;
//   verified: boolean;
//   location: string;
//   locationNe: string;
//   services: string[];
// }

// export const serviceCategories: ServiceCategory[] = [
//   {
//     id: "electrical",
//     name: "Electrician",
//     nameNe: "इलेक्ट्रिसियन",
//     description: "Professional electrical services for your home",
//     descriptionNe: "तपाईंको घरको लागि व्यावसायिक बिजुली सेवाहरू",
//     image: "/images/services/electrical.jpg",
//     icon: "Zap",
//     subcategories: [
//       {
//         id: "wiring",
//         categoryId: "electrical",
//         name: "Wiring & Installation",
//         nameNe: "वायरिङ र स्थापना",
//         description: "Complete electrical wiring solutions",
//         descriptionNe: "पूर्ण विद्युत वायरिङ समाधानहरू",
//         image: "/images/services/wiring.jpg",
//         services: [
//           {
//             id: "new-wiring",
//             subcategoryId: "wiring",
//             name: "New House Wiring",
//             nameNe: "नयाँ घर वायरिङ",
//             description: "Complete wiring for new construction",
//             descriptionNe: "नयाँ निर्माणको लागि पूर्ण वायरिङ",
//             image: "/images/services/new-wiring.jpg",
//             price: 5000,
//             priceUnit: "per room",
//             duration: "1-2 days",
//             rating: 4.8,
//             reviewCount: 124,
//           },
//           {
//             id: "rewiring",
//             subcategoryId: "wiring",
//             name: "Rewiring Service",
//             nameNe: "पुनः वायरिङ सेवा",
//             description: "Replace old and damaged wiring",
//             descriptionNe: "पुरानो र क्षतिग्रस्त वायरिङ बदल्नुहोस्",
//             image: "/images/services/rewiring.jpg",
//             price: 3500,
//             priceUnit: "per room",
//             duration: "4-6 hours",
//             rating: 4.7,
//             reviewCount: 89,
//           },
//         ],
//       },
//       {
//         id: "repairs",
//         categoryId: "electrical",
//         name: "Electrical Repairs",
//         nameNe: "विद्युत मर्मत",
//         description: "Fix electrical issues quickly",
//         descriptionNe: "विद्युत समस्याहरू छिटो समाधान गर्नुहोस्",
//         image: "/images/services/electrical-repairs.jpg",
//         services: [
//           {
//             id: "switch-repair",
//             subcategoryId: "repairs",
//             name: "Switch & Socket Repair",
//             nameNe: "स्विच र सकेट मर्मत",
//             description: "Repair or replace faulty switches",
//             descriptionNe: "खराब स्विचहरू मर्मत वा बदल्नुहोस्",
//             image: "/images/services/switch-repair.jpg",
//             price: 300,
//             priceUnit: "per unit",
//             duration: "30 mins",
//             rating: 4.9,
//             reviewCount: 256,
//           },
//         ],
//       },
//     ],
//   },
//   {
//     id: "plumbing",
//     name: "Plumbing",
//     nameNe: "प्लम्बिङ",
//     description: "Expert plumbing services",
//     descriptionNe: "विशेषज्ञ प्लम्बिङ सेवाहरू",
//     image: "/images/services/plumbing.jpg",
//     icon: "Droplets",
//     subcategories: [
//       {
//         id: "pipe-work",
//         categoryId: "plumbing",
//         name: "Pipe Installation & Repair",
//         nameNe: "पाइप स्थापना र मर्मत",
//         description: "All pipe related services",
//         descriptionNe: "सबै पाइप सम्बन्धित सेवाहरू",
//         image: "/images/services/pipe-work.jpg",
//         services: [
//           {
//             id: "pipe-leak",
//             subcategoryId: "pipe-work",
//             name: "Pipe Leak Repair",
//             nameNe: "पाइप लिक मर्मत",
//             description: "Fix leaking pipes quickly",
//             descriptionNe: "चुहावट पाइपहरू छिटो ठीक गर्नुहोस्",
//             image: "/images/services/pipe-leak.jpg",
//             price: 500,
//             priceUnit: "per service",
//             duration: "1-2 hours",
//             rating: 4.8,
//             reviewCount: 198,
//           },
//         ],
//       },
//       {
//         id: "bathroom",
//         categoryId: "plumbing",
//         name: "Bathroom Services",
//         nameNe: "बाथरुम सेवाहरू",
//         description: "Complete bathroom plumbing",
//         descriptionNe: "पूर्ण बाथरुम प्लम्बिङ",
//         image: "/images/services/bathroom.jpg",
//         services: [
//           {
//             id: "toilet-repair",
//             subcategoryId: "bathroom",
//             name: "Toilet Repair",
//             nameNe: "शौचालय मर्मत",
//             description: "Fix toilet issues",
//             descriptionNe: "शौचालय समस्याहरू समाधान गर्नुहोस्",
//             image: "/images/services/toilet-repair.jpg",
//             price: 800,
//             priceUnit: "per service",
//             duration: "1-3 hours",
//             rating: 4.7,
//             reviewCount: 145,
//           },
//         ],
//       },
//     ],
//   },
//   {
//     id: "cleaning",
//     name: "Cleaning",
//     nameNe: "सफाई",
//     description: "Professional cleaning services",
//     descriptionNe: "व्यावसायिक सफाई सेवाहरू",
//     image: "/images/services/cleaning.jpg",
//     icon: "Sparkles",
//     subcategories: [
//       {
//         id: "home-cleaning",
//         categoryId: "cleaning",
//         name: "Home Cleaning",
//         nameNe: "घर सफाई",
//         description: "Complete home cleaning solutions",
//         descriptionNe: "पूर्ण घर सफाई समाधानहरू",
//         image: "/images/services/home-cleaning.jpg",
//         services: [
//           {
//             id: "deep-cleaning",
//             subcategoryId: "home-cleaning",
//             name: "Deep Cleaning",
//             nameNe: "गहिरो सफाई",
//             description: "Thorough deep cleaning of your home",
//             descriptionNe: "तपाईंको घरको पूर्ण गहिरो सफाई",
//             image: "/images/services/deep-cleaning.jpg",
//             price: 3000,
//             priceUnit: "per room",
//             duration: "3-4 hours",
//             rating: 4.9,
//             reviewCount: 312,
//           },
//           {
//             id: "regular-cleaning",
//             subcategoryId: "home-cleaning",
//             name: "Regular Cleaning",
//             nameNe: "नियमित सफाई",
//             description: "Daily or weekly cleaning service",
//             descriptionNe: "दैनिक वा साप्ताहिक सफाई सेवा",
//             image: "/images/services/regular-cleaning.jpg",
//             price: 1500,
//             priceUnit: "per visit",
//             duration: "2-3 hours",
//             rating: 4.8,
//             reviewCount: 267,
//           },
//         ],
//       },
//     ],
//   },
//   {
//     id: "beauty",
//     name: "Beauty & Wellness",
//     nameNe: "सौन्दर्य र कल्याण",
//     description: "Beauty services at your doorstep",
//     descriptionNe: "तपाईंको ढोकामा सौन्दर्य सेवाहरू",
//     image: "/images/services/beauty.jpg",
//     icon: "Scissors",
//     subcategories: [
//       {
//         id: "salon-at-home",
//         categoryId: "beauty",
//         name: "Salon at Home",
//         nameNe: "घरमा सैलून",
//         description: "Professional salon services at home",
//         descriptionNe: "घरमा व्यावसायिक सैलून सेवाहरू",
//         image: "/images/services/salon-home.jpg",
//         services: [
//           {
//             id: "haircut",
//             subcategoryId: "salon-at-home",
//             name: "Haircut",
//             nameNe: "कपाल काट्ने",
//             description: "Professional haircut at home",
//             descriptionNe: "घरमा व्यावसायिक कपाल काट्ने",
//             image: "/images/services/haircut.jpg",
//             price: 500,
//             priceUnit: "per person",
//             duration: "30-45 mins",
//             rating: 4.8,
//             reviewCount: 423,
//           },
//           {
//             id: "facial",
//             subcategoryId: "salon-at-home",
//             name: "Facial",
//             nameNe: "फेसियल",
//             description: "Rejuvenating facial treatments",
//             descriptionNe: "पुनर्जीवन फेसियल उपचारहरू",
//             image: "/images/services/facial.jpg",
//             price: 1200,
//             priceUnit: "per session",
//             duration: "1 hour",
//             rating: 4.9,
//             reviewCount: 289,
//           },
//         ],
//       },
//     ],
//   },
//   {
//     id: "repairs",
//     name: "Repairs",
//     nameNe: "मर्मत",
//     description: "General repair services",
//     descriptionNe: "सामान्य मर्मत सेवाहरू",
//     image: "/images/services/repairs.jpg",
//     icon: "Wrench",
//     subcategories: [
//       {
//         id: "appliance-repair",
//         categoryId: "repairs",
//         name: "Appliance Repair",
//         nameNe: "उपकरण मर्मत",
//         description: "Fix home appliances",
//         descriptionNe: "घरेलु उपकरणहरू मर्मत गर्नुहोस्",
//         image: "/images/services/appliance-repair.jpg",
//         services: [
//           {
//             id: "ac-repair",
//             subcategoryId: "appliance-repair",
//             name: "AC Repair & Service",
//             nameNe: "एसी मर्मत र सेवा",
//             description: "AC installation, repair and servicing",
//             descriptionNe: "एसी स्थापना, मर्मत र सर्भिसिङ",
//             image: "/images/services/ac-repair.jpg",
//             price: 1500,
//             priceUnit: "per unit",
//             duration: "1-2 hours",
//             rating: 4.7,
//             reviewCount: 178,
//           },
//           {
//             id: "refrigerator-repair",
//             subcategoryId: "appliance-repair",
//             name: "Refrigerator Repair",
//             nameNe: "रेफ्रिजरेटर मर्मत",
//             description: "Fix refrigerator issues",
//             descriptionNe: "रेफ्रिजरेटर समस्याहरू समाधान गर्नुहोस्",
//             image: "/images/services/refrigerator-repair.jpg",
//             price: 1000,
//             priceUnit: "per service",
//             duration: "1-3 hours",
//             rating: 4.6,
//             reviewCount: 134,
//           },
//         ],
//       },
//     ],
//   },
//   {
//     id: "helpers",
//     name: "Helpers",
//     nameNe: "सहायकहरू",
//     description: "Household helpers and assistants",
//     descriptionNe: "घरेलु सहायकहरू र सहायकहरू",
//     image: "/images/services/helpers.jpg",
//     icon: "Users",
//     subcategories: [
//       {
//         id: "domestic-help",
//         categoryId: "helpers",
//         name: "Domestic Help",
//         nameNe: "घरेलु मद्दत",
//         description: "Household assistance services",
//         descriptionNe: "घरेलु सहायता सेवाहरू",
//         image: "/images/services/domestic-help.jpg",
//         services: [
//           {
//             id: "cook",
//             subcategoryId: "domestic-help",
//             name: "Cook",
//             nameNe: "खाना पकाउने",
//             description: "Professional cooking services",
//             descriptionNe: "व्यावसायिक खाना पकाउने सेवाहरू",
//             image: "/images/services/cook.jpg",
//             price: 15000,
//             priceUnit: "per month",
//             duration: "Daily",
//             rating: 4.8,
//             reviewCount: 156,
//           },
//           {
//             id: "housekeeper",
//             subcategoryId: "domestic-help",
//             name: "Housekeeper",
//             nameNe: "घरेलु सहायक",
//             description: "Full-time housekeeping service",
//             descriptionNe: "पूर्ण-समय घरेलु सेवा",
//             image: "/images/services/housekeeper.jpg",
//             price: 18000,
//             priceUnit: "per month",
//             duration: "Daily",
//             rating: 4.7,
//             reviewCount: 198,
//           },
//         ],
//       },
//     ],
//   },
// ];

// export const professionals: Professional[] = [
//   {
//     id: "pro-1",
//     name: "Ram Bahadur Thapa",
//     nameNe: "राम बहादुर थापा",
//     avatar: "/images/professionals/pro-1.jpg",
//     skills: ["Electrician", "Wiring"],
//     rating: 4.9,
//     totalJobs: 245,
//     verified: true,
//     location: "Kathmandu",
//     locationNe: "काठमाडौं",
//     services: ["electrical", "wiring"],
//   },
//   {
//     id: "pro-2",
//     name: "Sita Kumari Sharma",
//     nameNe: "सीता कुमारी शर्मा",
//     avatar: "/images/professionals/pro-2.jpg",
//     skills: ["Cleaning", "Home Care"],
//     rating: 4.8,
//     totalJobs: 312,
//     verified: true,
//     location: "Lalitpur",
//     locationNe: "ललितपुर",
//     services: ["cleaning", "home-cleaning"],
//   },
//   {
//     id: "pro-3",
//     name: "Krishna Prasad Adhikari",
//     nameNe: "कृष्ण प्रसाद अधिकारी",
//     avatar: "/images/professionals/pro-3.jpg",
//     skills: ["Plumbing", "Pipe Work"],
//     rating: 4.7,
//     totalJobs: 189,
//     verified: true,
//     location: "Bhaktapur",
//     locationNe: "भक्तपुर",
//     services: ["plumbing", "pipe-work"],
//   },
//   {
//     id: "pro-4",
//     name: "Anita Gurung",
//     nameNe: "अनिता गुरुङ",
//     avatar: "/images/professionals/pro-4.jpg",
//     skills: ["Beauty", "Makeup"],
//     rating: 4.9,
//     totalJobs: 567,
//     verified: true,
//     location: "Pokhara",
//     locationNe: "पोखरा",
//     services: ["beauty", "salon-at-home"],
//   },
//   {
//     id: "pro-5",
//     name: "Bijay Kumar Rai",
//     nameNe: "बिजय कुमार राई",
//     avatar: "/images/professionals/pro-5.jpg",
//     skills: ["AC Repair", "Appliances"],
//     rating: 4.6,
//     totalJobs: 134,
//     verified: true,
//     location: "Kathmandu",
//     locationNe: "काठमाडौं",
//     services: ["repairs", "appliance-repair"],
//   },
//   {
//     id: "pro-6",
//     name: "Maya Devi Tamang",
//     nameNe: "माया देवी तामाङ",
//     avatar: "/images/professionals/pro-6.jpg",
//     skills: ["Cooking", "Housekeeping"],
//     rating: 4.8,
//     totalJobs: 423,
//     verified: true,
//     location: "Kathmandu",
//     locationNe: "काठमाडौं",
//     services: ["helpers", "domestic-help"],
//   },
// ];

// export const promotions = [
//   {
//     id: "promo-1",
//     title: "First Service Discount",
//     titleNe: "पहिलो सेवामा छुट",
//     description: "Get 20% off on your first booking",
//     descriptionNe: "तपाईंको पहिलो बुकिङमा २०% छुट पाउनुहोस्",
//     discount: 20,
//     image: "/images/promotions/first-service.jpg",
//     validUntil: "2024-12-31",
//   },
//   {
//     id: "promo-2",
//     title: "Cleaning Special",
//     titleNe: "सफाई विशेष",
//     description: "Up to 30% off on all cleaning services",
//     descriptionNe: "सबै सफाई सेवाहरूमा ३०% सम्म छुट",
//     discount: 30,
//     image: "/images/promotions/cleaning-special.jpg",
//     validUntil: "2024-12-31",
//   },
//   {
//     id: "promo-3",
//     title: "Festive Offer",
//     titleNe: "चाडपर्व अफर",
//     description: "Special discounts during festivals",
//     descriptionNe: "चाडपर्वमा विशेष छुटहरू",
//     discount: 25,
//     image: "/images/promotions/festive-offer.jpg",
//     validUntil: "2024-12-31",
//   },
// ];

// export function getServicesByCategory(categoryId: string) {
//   const category = serviceCategories.find((c) => c.id === categoryId);
//   if (!category) return [];
//   return category.subcategories.flatMap((sub) => sub.services);
// }

// export function getAllServices() {
//   return serviceCategories.flatMap((cat) =>
//     cat.subcategories.flatMap((sub) => sub.services)
//   );
// }

// export function getProfessionalsByService(serviceId: string) {
//   return professionals.filter((p) => p.services.includes(serviceId));
// }




export interface Service {
  id: number;
  name_en: string;
  name_np: string;
  description_en: string;
  description_np: string;
  image: string | null;
  category_id: number;
  sub_category_id: number;
}

export interface ServicesResponse {
  services: Service[];
  total: number;
  page: number;
  size: number;
  pages: number;
}
