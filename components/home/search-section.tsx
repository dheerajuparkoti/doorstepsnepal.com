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

  // Filter services and find related ones via shared subcategory
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return { direct: allServices.slice(0, 8), related: [] as typeof allServices };
    }

    const query = searchQuery.toLowerCase();

    // Direct matches — name contains query
    const direct = allServices
      .filter(s =>
        s.name_en.toLowerCase().includes(query) ||
        s.name_np.toLowerCase().includes(query)
      )
      .slice(0, 6);

    // Collect unique subcategory IDs from direct matches
    const matchedSubCatIds = new Set(
      direct.filter(s => s.sub_category?.id).map(s => s.sub_category!.id)
    );

    // Related: same subcategory, not already in direct matches
    const directIds = new Set(direct.map(s => s.id));
    const related = matchedSubCatIds.size > 0
      ? allServices
          .filter(s =>
            s.sub_category?.id &&
            matchedSubCatIds.has(s.sub_category.id) &&
            !directIds.has(s.id)
          )
          .slice(0, 8)
      : [];

    return { direct, related };
  }, [searchQuery, allServices]);

  // Group related services by subcategory name for display
  const relatedBySubCategory = useMemo(() => {
    const map = new Map<string, { subCatName: string; subCatName_np: string; services: typeof allServices }>();
    for (const s of searchResults.related) {
      if (!s.sub_category) continue;
      const key = String(s.sub_category.id);
      if (!map.has(key)) {
        map.set(key, {
          subCatName: s.sub_category.name_en,
          subCatName_np: s.sub_category.name_np,
          services: [],
        });
      }
      map.get(key)!.services.push(s);
    }
    return Array.from(map.values());
  }, [searchResults.related]);

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
                  {showServiceSuggestions && (searchResults.direct.length > 0 || searchResults.related.length > 0) && (
                    <div className="absolute top-full left-0 right-0 mt-1 z-50">
                      <div className="rounded-lg border bg-popover shadow-lg max-h-96 overflow-y-auto">

                        {/* Direct matches */}
                        {searchQuery.trim() && searchResults.direct.length > 0 && (
                          <div className="px-3 py-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide bg-muted/40 border-b">
                            {language === 'ne' ? 'मिल्दो सेवाहरू' : 'Matching Services'}
                          </div>
                        )}
                        {searchResults.direct.map((service) => (
                          <div
                            key={service.id}
                            className="px-4 py-3 hover:bg-accent hover:text-accent-foreground cursor-pointer border-b last:border-b-0 transition-colors flex items-center gap-3"
                            onMouseDown={() => handleServiceSelect(service)}
                          >
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

                        {/* Related services grouped by subcategory */}
                        {relatedBySubCategory.map((group) => (
                          <div key={group.subCatName}>
                            <div className="px-3 py-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide bg-muted/40 border-y">
                              {language === 'ne'
                                ? `${group.subCatName_np} मा सम्बन्धित`
                                : `Related in ${group.subCatName}`}
                            </div>
                            {group.services.map((service) => (
                              <div
                                key={service.id}
                                className="px-4 py-2.5 hover:bg-accent hover:text-accent-foreground cursor-pointer border-b last:border-b-0 transition-colors flex items-center gap-3"
                                onMouseDown={() => handleServiceSelect(service)}
                              >
                                <div className="flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden bg-muted">
                                  {service.image ? (
                                    <Image
                                      src={service.image}
                                      alt={service.name_en}
                                      width={40}
                                      height={40}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-primary/10">
                                      <ImageIcon className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <span className="font-medium text-sm block truncate">{service.name_en}</span>
                                      <span className="text-xs text-muted-foreground block truncate">{service.name_np}</span>
                                    </div>
                                    <ChevronRight className="h-4 w-4 opacity-50 flex-shrink-0 ml-2" />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ))}

                        {/* "Search for" free-text fallback */}
                        {searchQuery.trim() && !searchResults.direct.some((s) =>
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