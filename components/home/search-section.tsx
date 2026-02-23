// 'use client';

// import { useState, useMemo, useEffect, useCallback } from "react";
// import { useI18n } from "@/lib/i18n/context";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Search, ChevronRight } from "lucide-react";

// interface SearchSectionProps {
//   professionalsData?: any[];
// }

// export function SearchSection({ professionalsData = [] }: SearchSectionProps) {
//   const { t, language } = useI18n();
//   const router = useRouter();
//   const [searchQuery, setSearchQuery] = useState("");
//   const [showServiceSuggestions, setShowServiceSuggestions] = useState(false);

//   // Get all unique services from professionals data
//   const allServices = useMemo(() => {
//     const servicesSet = new Set<string>();
    
//     professionalsData.forEach((professional) => {
//       if (professional.services) {
//         professional.services.forEach((service: any) => {
//           const serviceName = service.service?.name_en || service.name;
//           if (serviceName) {
//             servicesSet.add(serviceName);
//           }
//         });
//       }
//       if (professional.service_name) {
//         professional.service_name.split(', ').forEach((service: string) => {
//           if (service.trim()) servicesSet.add(service.trim());
//         });
//       }
//     });
    
//     return Array.from(servicesSet).sort();
//   }, [professionalsData]);

//   // Filter services based on search query
//   const filteredServices = useMemo(() => {
//     if (!searchQuery.trim()) return allServices.slice(0, 10); // Show top 10 when empty
    
//     const query = searchQuery.toLowerCase();
//     return allServices
//       .filter(service => service.toLowerCase().includes(query))
//       .slice(0, 10); // Limit to 10 results
//   }, [searchQuery, allServices]);

//   const handleSearchFocus = () => {
//     setShowServiceSuggestions(true);
//   };

//   const handleSearchBlur = () => {
//     setTimeout(() => {
//       setShowServiceSuggestions(false);
//     }, 200);
//   };

//   const handleServiceSelect = (service: string) => {
//     setSearchQuery(service);
//     setShowServiceSuggestions(false);
//     handleSearch(service);
//   };

//   // Handle service search
//   const handleSearch = (selectedService?: string) => {
//     const serviceToSearch = selectedService || searchQuery;
//     if (!serviceToSearch.trim()) return;

//     let foundServiceId: number | null = null;

//     for (const professional of professionalsData) {
//       if (professional.services) {
//         const match = professional.services.find((service: any) => {
//           const serviceName = service.service?.name_en || service.name || service.service_name;
//           return serviceName?.toLowerCase().includes(serviceToSearch.toLowerCase());
//         });
        
//         if (match) {
//           foundServiceId = match.service_id || match.service?.id;
//           break;
//         }
//       }
//     }

//     if (foundServiceId) {
//       router.push(`/services/${foundServiceId}/professionals?search=${encodeURIComponent(serviceToSearch)}`);
//     } else {
//       router.push(`/services/0/professionals?service=${encodeURIComponent(serviceToSearch)}`);
//     }
//   };

//   // Handle Enter key press
//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter') {
//       handleSearch();
//     }
//   };

//   return (
//     <section className="relative -mt-10 z-30 px-4">
//       <div className="container mx-auto">
//         {/* MAIN GLASS CONTAINER */}
//         <div className="mx-auto max-w-4xl rounded-2xl border border-white/20 bg-white/70 p-3 shadow-2xl backdrop-blur-md md:p-5 dark:border-white/10 dark:bg-slate-900/60">
//           <div className="flex flex-col gap-3">
//             <div className="flex flex-col gap-3 md:flex-row md:items-center">
//               {/* Search Input with Suggestions Dropdown */}
//               <div className="relative flex-1">
//                 <div className="relative">
//                   <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors" />
//                   <Input
//                     type="text"
//                     placeholder={t.search.placeholder || "Search for services (e.g., plumbing, electrician)"}
//                     value={searchQuery}
//                     onChange={(e) => {
//                       setSearchQuery(e.target.value);
//                       setShowServiceSuggestions(true);
//                     }}
//                     onFocus={handleSearchFocus}
//                     onBlur={handleSearchBlur}
//                     onKeyDown={handleKeyPress}
//                     className="h-14 pl-12 text-base border-none bg-background/40 backdrop-blur-sm rounded-xl focus-visible:ring-2 focus-visible:ring-primary/40 shadow-inner"
//                   />
                  
//                   {/* Service Suggestions Dropdown */}
//                   {showServiceSuggestions && filteredServices.length > 0 && (
//                     <div className="absolute top-full left-0 right-0 mt-1 z-50">
//                       <div className="rounded-lg border bg-popover shadow-lg max-h-60 overflow-y-auto">
//                         {filteredServices.map((service, index) => (
//                           <div
//                             key={index}
//                             className="px-4 py-3 hover:bg-accent hover:text-accent-foreground cursor-pointer border-b last:border-b-0 transition-colors"
//                             onMouseDown={() => handleServiceSelect(service)}
//                           >
//                             <div className="flex items-center justify-between">
//                               <span className="font-medium">{service}</span>
//                               <ChevronRight className="h-4 w-4 opacity-50" />
//                             </div>
//                           </div>
//                         ))}
//                         {searchQuery.trim() && !filteredServices.some(s => s.toLowerCase() === searchQuery.toLowerCase()) && (
//                           <div
//                             className="px-4 py-3 hover:bg-accent hover:text-accent-foreground cursor-pointer border-t bg-muted/50"
//                             onMouseDown={() => handleServiceSelect(searchQuery)}
//                           >
//                             <div className="flex items-center justify-between">
//                               <span>Search for "{searchQuery}"</span>
//                               <Search className="h-4 w-4" />
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Search Button */}
//               <Button 
//                 className="h-14 px-8 rounded-xl font text-base shadow-xl transition-all hover:scale-[1.02] active:scale-95 bg-gradient-to-br from-primary to-primary/80"
//                 onClick={() => handleSearch()}
//                 disabled={!searchQuery.trim()}
//               >
//                 <Search className="mr-2 h-5 w-5" />
//                 {t.search.searchButton || "Search Now"}
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }



// search section using services only
'use client';

import { useState, useMemo } from "react";
import { useI18n } from "@/lib/i18n/context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChevronRight, ImageIcon } from "lucide-react";
import Image from "next/image";

interface SearchSectionProps {
  servicesData?: Array<{
    id: number;
    name_en: string;
    name_np: string;
    image: string | null;
    description_en?: string;
    description_np?: string;
    category?: {
      id: number;
      name_en: string;
      name_np: string;
    };
    sub_category?: {
      id: number;
      name_en: string;
      name_np: string;
    };
  }>;
}

export function SearchSection({ servicesData = [] }: SearchSectionProps) {
  const { t, language } = useI18n();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showServiceSuggestions, setShowServiceSuggestions] = useState(false);

  // Get all service names from services data
  const allServices = useMemo(() => {
    return servicesData.map(service => ({
      id: service.id,
      name_en: service.name_en,
      name_np: service.name_np,
      image: service.image,
      category: service.category,
      sub_category: service.sub_category,
      displayName: language === 'ne' ? service.name_np : service.name_en
    }));
  }, [servicesData, language]);

  // Filter services based on search query
  const filteredServices = useMemo(() => {
    if (!searchQuery.trim()) return allServices.slice(0, 10); // Show top 10 when empty
    
    const query = searchQuery.toLowerCase();
    return allServices
      .filter(service => 
        service.name_en.toLowerCase().includes(query) || 
        service.name_np.toLowerCase().includes(query)
      )
      .slice(0, 10); // Limit to 10 results
  }, [searchQuery, allServices]);

  const handleSearchFocus = () => {
    setShowServiceSuggestions(true);
  };

  const handleSearchBlur = () => {
    setTimeout(() => {
      setShowServiceSuggestions(false);
    }, 200);
  };

  const handleServiceSelect = (service: { 
    id: number; 
    name_en: string; 
    name_np: string;
    image: string | null;
  }) => {
    setSearchQuery(language === 'ne' ? service.name_np : service.name_en);
    setShowServiceSuggestions(false);
    handleSearch(service);
  };

  // Handle service search
  const handleSearch = (selectedService?: { id: number; name_en: string; name_np: string }) => {
    if (selectedService) {
   
      router.push(`/services/${selectedService.id}/professionals`);
    } else {
      // If it's a free text search, find matching service or go to search results
      const searchText = searchQuery.trim();
      if (!searchText) return;

      // Try to find an exact match first
      const exactMatch = allServices.find(service => 
        service.name_en.toLowerCase() === searchText.toLowerCase() ||
        service.name_np.toLowerCase() === searchText.toLowerCase()
      );

      if (exactMatch) {
         router.push(`/services/${exactMatch.id}/professionals`);
  
      } else {
        // If no exact match, go to search results page
 
        router.push(`/services/0/professionals?service=${encodeURIComponent(searchText)}`);
      }
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section className="relative -mt-10 z-30 px-4">
      <div className="container mx-auto">
        {/* MAIN GLASS CONTAINER */}
        <div className="mx-auto max-w-4xl rounded-2xl border border-white/20 bg-white/70 p-3 shadow-2xl backdrop-blur-md md:p-5 dark:border-white/10 dark:bg-slate-900/60">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              {/* Search Input with Suggestions Dropdown */}
              <div className="relative flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors" />
                  <Input
                    type="text"
                    placeholder={t.search.placeholder || "Search for services (e.g., plumbing, electrician)"}
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowServiceSuggestions(true);
                    }}
                    onFocus={handleSearchFocus}
                    onBlur={handleSearchBlur}
                    onKeyDown={handleKeyPress}
                    className="h-14 pl-12 text-base border-none bg-background/40 backdrop-blur-sm rounded-xl focus-visible:ring-2 focus-visible:ring-primary/40 shadow-inner"
                  />
                  
                  {/* Service Suggestions Dropdown with Images */}
                  {showServiceSuggestions && filteredServices.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 z-50">
                      <div className="rounded-lg border bg-popover shadow-lg max-h-96 overflow-y-auto">
                        {filteredServices.map((service) => (
                          <div
                            key={service.id}
                            className="px-4 py-3 hover:bg-accent hover:text-accent-foreground cursor-pointer border-b last:border-b-0 transition-colors flex items-center gap-3"
                            onMouseDown={() => handleServiceSelect(service)}
                          >
                            {/* Service Image */}
                            <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-muted">
                              {service.image ? (
                                <Image
                                  src={service.image}
                                  alt={service.name_en}
                                  width={48}
                                  height={48}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-primary/10">
                                  <ImageIcon className="h-6 w-6 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            
                            {/* Service Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="font-medium block truncate">{service.name_en}</span>
                                  <span className="text-sm text-muted-foreground block truncate">{service.name_np}</span>
                                  {(service.category || service.sub_category) && (
                                    <span className="text-xs text-muted-foreground block truncate mt-0.5">
                                      {service.category?.name_en}
                                      {service.sub_category && ` • ${service.sub_category.name_en}`}
                                    </span>
                                  )}
                                </div>
                                <ChevronRight className="h-4 w-4 opacity-50 flex-shrink-0 ml-2" />
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {/* "Search for" option */}
                        {searchQuery.trim() && !filteredServices.some(s => 
                          s.name_en.toLowerCase() === searchQuery.toLowerCase() ||
                          s.name_np.toLowerCase() === searchQuery.toLowerCase()
                        ) && (
                          <div
                            className="px-4 py-3 hover:bg-accent hover:text-accent-foreground cursor-pointer border-t bg-muted/50 flex items-center gap-3"
                            onMouseDown={() => {
                              setSearchQuery(searchQuery);
                              handleSearch();
                            }}
                          >
                            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Search className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="font-medium">Search for "{searchQuery}"</span>
                                <Search className="h-4 w-4 opacity-50" />
                              </div>
                              <span className="text-xs text-muted-foreground">View all results</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Search Button */}
              <Button 
                className="h-14 px-8 rounded-xl font text-base shadow-xl transition-all hover:scale-[1.02] active:scale-95 bg-gradient-to-br from-primary to-primary/80"
                onClick={() => handleSearch()}
                disabled={!searchQuery.trim()}
              >
                <Search className="mr-2 h-5 w-5" />
                {t.search.searchButton || "Search Now"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}