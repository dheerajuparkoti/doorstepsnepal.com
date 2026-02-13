// "use client";

// import React, { Suspense } from "react";
// import { useState, useMemo } from "react";
// import Link from "next/link";
// import { useI18n } from "@/lib/i18n/context";
// import { useSearchParams } from "next/navigation";
// import { Navbar } from "@/components/layout/navbar";
// import { Footer } from "@/components/layout/footer";
// import { ServiceCard } from "@/components/services/service-card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent } from "@/components/ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/ui/sheet";
// import { Slider } from "@/components/ui/slider";
// import { Badge } from "@/components/ui/badge";
// import {
//   // serviceCategories,
//   // professionals,
//   // getAllServices,
// } from "@/lib/data/services";
// import {
//   provinces,
//   getDistrictsByProvince,
//   getMunicipalitiesByDistrict,
// } from "@/lib/data/nepal-locations";
// import {
//   Search,
//   SlidersHorizontal,
//   X,
//   Zap,
//   Droplets,
//   Sparkles,
//   Scissors,
//   Wrench,
//   Users,
// } from "lucide-react";

// const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
//   Zap,
//   Droplets,
//   Sparkles,
//   Scissors,
//   Wrench,
//   Users,
// };

// interface Filters {
//   category: string;
//   search: string;
//   minPrice: number;
//   maxPrice: number;
//   minRating: number;
//   provinceId: string;
//   districtId: string;
//   municipalityId: string;
//   wardNo: string;
// }

// const Loading = () => null;

// export default function ServicesPage() {
//   const { t, language } = useI18n();
//   const searchParams = useSearchParams();
//   const [filters, setFilters] = useState<Filters>({
//     category: "",
//     search: "",
//     minPrice: 0,
//     maxPrice: 50000,
//     minRating: 0,
//     provinceId: "",
//     districtId: "",
//     municipalityId: "",
//     wardNo: "",
//   });
//   const [isFilterOpen, setIsFilterOpen] = useState(false);

//   const allServices = useMemo(() => getAllServices(), []);

//   const filteredServices = useMemo(() => {
//     return allServices.filter((service) => {
//       // Category filter
//       if (filters.category) {
//         const category = serviceCategories.find((c) => c.id === filters.category);
//         if (category) {
//           const serviceInCategory = category.subcategories.some((sub) =>
//             sub.services.some((s) => s.id === service.id)
//           );
//           if (!serviceInCategory) return false;
//         }
//       }

//       // Search filter
//       if (filters.search) {
//         const searchLower = filters.search.toLowerCase();
//         const matchesName =
//           service.name.toLowerCase().includes(searchLower) ||
//           service.nameNe.includes(filters.search);
//         const matchesDesc =
//           service.description.toLowerCase().includes(searchLower) ||
//           service.descriptionNe.includes(filters.search);
//         if (!matchesName && !matchesDesc) return false;
//       }

//       // Price filter
//       if (service.price < filters.minPrice || service.price > filters.maxPrice) {
//         return false;
//       }

//       // Rating filter
//       if (service.rating < filters.minRating) {
//         return false;
//       }

//       return true;
//     });
//   }, [allServices, filters]);

//   const filteredDistricts = filters.provinceId
//     ? getDistrictsByProvince(Number(filters.provinceId))
//     : [];

//   const filteredMunicipalities = filters.districtId
//     ? getMunicipalitiesByDistrict(Number(filters.districtId))
//     : [];

//   const clearFilters = () => {
//     setFilters({
//       category: "",
//       search: "",
//       minPrice: 0,
//       maxPrice: 50000,
//       minRating: 0,
//       provinceId: "",
//       districtId: "",
//       municipalityId: "",
//       wardNo: "",
//     });
//   };

//   const hasActiveFilters =
//     filters.category ||
//     filters.search ||
//     filters.minPrice > 0 ||
//     filters.maxPrice < 50000 ||
//     filters.minRating > 0 ||
//     filters.provinceId;

//   const getProfessionalForService = (serviceId: string) => {
//     return professionals.find((p) => p.services.includes(serviceId));
//   };

//   return (
//     <div className="flex min-h-screen flex-col">
//       <Navbar />
//       <main className="flex-1">
//         {/* Header */}
//         <div className="bg-gradient-to-br from-primary/5 via-background to-accent/10 py-12">
//           <div className="container mx-auto px-4">
//             <h1 className="text-3xl font-bold text-foreground md:text-4xl">
//               {t.services.popular}
//             </h1>
//             <p className="mt-2 text-muted-foreground">
//               {language === "ne"
//                 ? "तपाईंको घरेलु आवश्यकताहरूको लागि विश्वसनीय सेवाहरू खोज्नुहोस्"
//                 : "Find reliable services for all your home needs"}
//             </p>

//             {/* Search Bar */}
//             <div className="mt-6 flex flex-col gap-3 sm:flex-row">
//               <div className="relative flex-1">
//                 <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
//                 <Input
//                   placeholder={t.search.placeholder}
//                   value={filters.search}
//                   onChange={(e) => setFilters({ ...filters, search: e.target.value })}
//                   className="h-12 pl-10"
//                 />
//               </div>
//               <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
//                 <SheetTrigger asChild>
//                   <Button variant="outline" className="h-12 gap-2 bg-transparent">
//                     <SlidersHorizontal className="h-4 w-4" />
//                     {language === "ne" ? "फिल्टर" : "Filters"}
//                     {hasActiveFilters && (
//                       <Badge className="ml-1 h-5 w-5 rounded-full p-0 text-xs">!</Badge>
//                     )}
//                   </Button>
//                 </SheetTrigger>
//                 <SheetContent className="w-full overflow-y-auto sm:max-w-md">
//                   <SheetHeader>
//                     <SheetTitle className="flex items-center justify-between">
//                       {language === "ne" ? "फिल्टरहरू" : "Filters"}
//                       {hasActiveFilters && (
//                         <Button variant="ghost" size="sm" onClick={clearFilters}>
//                           <X className="mr-1 h-4 w-4" />
//                           {t.search.clear}
//                         </Button>
//                       )}
//                     </SheetTitle>
//                   </SheetHeader>
//                   <div className="mt-6 space-y-6">
//                     {/* Category */}
//                     <div className="space-y-2">
//                       <Label>{language === "ne" ? "श्रेणी" : "Category"}</Label>
//                       <Select
//                         value={filters.category}
//                         onValueChange={(v) => setFilters({ ...filters, category: v })}
//                       >
//                         <SelectTrigger>
//                           <SelectValue placeholder={language === "ne" ? "सबै श्रेणीहरू" : "All Categories"} />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="all">
//                             {language === "ne" ? "सबै श्रेणीहरू" : "All Categories"}
//                           </SelectItem>
//                           {serviceCategories.map((cat) => (
//                             <SelectItem key={cat.id} value={cat.id}>
//                               {language === "ne" ? cat.nameNe : cat.name}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </div>

//                     {/* Price Range */}
//                     <div className="space-y-4">
//                       <Label>{language === "ne" ? "मूल्य दायरा" : "Price Range"}</Label>
//                       <div className="px-2">
//                         <Slider
//                           value={[filters.minPrice, filters.maxPrice]}
//                           max={50000}
//                           step={500}
//                           onValueChange={([min, max]) =>
//                             setFilters({ ...filters, minPrice: min, maxPrice: max })
//                           }
//                         />
//                       </div>
//                       <div className="flex justify-between text-sm text-muted-foreground">
//                         <span>Rs. {filters.minPrice.toLocaleString()}</span>
//                         <span>Rs. {filters.maxPrice.toLocaleString()}</span>
//                       </div>
//                     </div>

//                     {/* Minimum Rating */}
//                     <div className="space-y-2">
//                       <Label>{language === "ne" ? "न्यूनतम रेटिङ" : "Minimum Rating"}</Label>
//                       <Select
//                         value={String(filters.minRating)}
//                         onValueChange={(v) => setFilters({ ...filters, minRating: Number(v) })}
//                       >
//                         <SelectTrigger>
//                           <SelectValue />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="0">{language === "ne" ? "सबै" : "All Ratings"}</SelectItem>
//                           <SelectItem value="3">3+ Stars</SelectItem>
//                           <SelectItem value="4">4+ Stars</SelectItem>
//                           <SelectItem value="4.5">4.5+ Stars</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>

//                     {/* Location Filters */}
//                     <div className="space-y-4">
//                       <Label className="text-base font-semibold">
//                         {t.search.filterByLocation}
//                       </Label>

//                       {/* Province */}
//                       <div className="space-y-2">
//                         <Label className="text-sm">{t.search.province}</Label>
//                         <Select
//                           value={filters.provinceId}
//                           onValueChange={(v) =>
//                             setFilters({
//                               ...filters,
//                               provinceId: v,
//                               districtId: "",
//                               municipalityId: "",
//                             })
//                           }
//                         >
//                           <SelectTrigger>
//                             <SelectValue placeholder={t.search.province} />
//                           </SelectTrigger>
//                           <SelectContent>
//                             {provinces.map((province) => (
//                               <SelectItem key={province.id} value={String(province.id)}>
//                                 {language === "ne" ? province.nameNe : province.name}
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                       </div>

//                       {/* District */}
//                       <div className="space-y-2">
//                         <Label className="text-sm">{t.search.district}</Label>
//                         <Select
//                           value={filters.districtId}
//                           onValueChange={(v) =>
//                             setFilters({ ...filters, districtId: v, municipalityId: "" })
//                           }
//                           disabled={!filters.provinceId}
//                         >
//                           <SelectTrigger>
//                             <SelectValue placeholder={t.search.district} />
//                           </SelectTrigger>
//                           <SelectContent>
//                             {filteredDistricts.map((district) => (
//                               <SelectItem key={district.id} value={String(district.id)}>
//                                 {language === "ne" ? district.nameNe : district.name}
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                       </div>

//                       {/* Municipality */}
//                       <div className="space-y-2">
//                         <Label className="text-sm">{t.search.municipality}</Label>
//                         <Select
//                           value={filters.municipalityId}
//                           onValueChange={(v) => setFilters({ ...filters, municipalityId: v })}
//                           disabled={!filters.districtId}
//                         >
//                           <SelectTrigger>
//                             <SelectValue placeholder={t.search.municipality} />
//                           </SelectTrigger>
//                           <SelectContent>
//                             {filteredMunicipalities.map((muni) => (
//                               <SelectItem key={muni.id} value={String(muni.id)}>
//                                 {language === "ne" ? muni.nameNe : muni.name}
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                       </div>

//                       {/* Ward No */}
//                       <div className="space-y-2">
//                         <Label className="text-sm">{t.search.wardNo}</Label>
//                         <Select
//                           value={filters.wardNo}
//                           onValueChange={(v) => setFilters({ ...filters, wardNo: v })}
//                         >
//                           <SelectTrigger>
//                             <SelectValue placeholder={t.search.wardNo} />
//                           </SelectTrigger>
//                           <SelectContent>
//                             {Array.from({ length: 32 }, (_, i) => i + 1).map((ward) => (
//                               <SelectItem key={ward} value={String(ward)}>
//                                 {ward}
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                       </div>
//                     </div>

//                     <Button className="w-full" onClick={() => setIsFilterOpen(false)}>
//                       {t.search.apply}
//                     </Button>
//                   </div>
//                 </SheetContent>
//               </Sheet>
//             </div>
//           </div>
//         </div>

//         {/* Categories */}
//         <div className="border-b border-border bg-card">
//           <div className="container mx-auto px-4">
//             <div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide">
//               <Button
//                 variant={filters.category === "" ? "default" : "outline"}
//                 size="sm"
//                 onClick={() => setFilters({ ...filters, category: "" })}
//               >
//                 {language === "ne" ? "सबै" : "All"}
//               </Button>
//               {serviceCategories.map((category) => {
//                 const Icon = iconMap[category.icon] || Wrench;
//                 return (
//                   <Button
//                     key={category.id}
//                     variant={filters.category === category.id ? "default" : "outline"}
//                     size="sm"
//                     className="gap-2 whitespace-nowrap"
//                     onClick={() => setFilters({ ...filters, category: category.id })}
//                   >
//                     <Icon className="h-4 w-4" />
//                     {language === "ne" ? category.nameNe : category.name}
//                   </Button>
//                 );
//               })}
//             </div>
//           </div>
//         </div>

//         {/* Services Grid */}
//         <div className="container mx-auto px-4 py-8">
//           {/* Results Count */}
//           <div className="mb-6 flex items-center justify-between">
//             <p className="text-muted-foreground">
//               {filteredServices.length}{" "}
//               {language === "ne" ? "सेवाहरू फेला पर्यो" : "services found"}
//             </p>
//             {hasActiveFilters && (
//               <Button variant="ghost" size="sm" onClick={clearFilters}>
//                 <X className="mr-1 h-4 w-4" />
//                 {language === "ne" ? "सबै खाली गर्नुहोस्" : "Clear all"}
//               </Button>
//             )}
//           </div>

//           {filteredServices.length > 0 ? (
//             <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//               {filteredServices.map((service) => (
//                 <ServiceCard
//                   key={service.id}
//                   service={service}
//                   professional={getProfessionalForService(service.subcategoryId)}
//                 />
//               ))}
//             </div>
//           ) : (
//             <Card>
//               <CardContent className="py-12 text-center">
//                 <Search className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
//                 <h3 className="font-semibold">
//                   {language === "ne" ? "कुनै सेवा फेला परेन" : "No services found"}
//                 </h3>
//                 <p className="mt-2 text-muted-foreground">
//                   {language === "ne"
//                     ? "कृपया फरक खोज शब्द वा फिल्टरहरू प्रयास गर्नुहोस्"
//                     : "Try different search terms or filters"}
//                 </p>
//                 <Button className="mt-4" onClick={clearFilters}>
//                   {language === "ne" ? "फिल्टरहरू खाली गर्नुहोस्" : "Clear Filters"}
//                 </Button>
//               </CardContent>
//             </Card>
//           )}
//         </div>
//       </main>
//       <Footer />
//     </div>
//   );
// }

// export { Loading };


import { Suspense } from 'react';
import { ServicesSection } from './ssr/services-section-ssr';
import { ServicesSkeleton } from './skeleton/services-skeleton';
import Loading from '../loading';

export const metadata = {
  title: 'Services | DoorStep',
  description: 'Browse all professional services',
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      <Suspense fallback={<ServicesSkeleton />}>
        <ServicesSection />
      </Suspense>
    </div>
  );
}

export { Loading };