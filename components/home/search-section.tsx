'use client';

import { useState, useMemo, useEffect } from "react";
import { useI18n } from "@/lib/i18n/context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChevronRight, ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import { fetchServices } from "@/lib/api/service";

interface ServiceItem {
  id: number;
  name_en: string;
  name_np: string;
  image: string | null;
  description_en?: string;
  description_np?: string;
  category?: { id: number; name_en: string; name_np: string };
  sub_category?: { id: number; name_en: string; name_np: string };
}

interface SearchSectionProps {
  servicesData?: ServiceItem[];
}

export function SearchSection({ servicesData = [] }: SearchSectionProps) {
  const { t, language } = useI18n();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [serverResults, setServerResults] = useState<ServiceItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Debounced server search — fires 350ms after the user stops typing
  useEffect(() => {
    const query = searchQuery.trim();
    if (!query) {
      setServerResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetchServices(1, 10, undefined, undefined, query);
        setServerResults(res?.services ?? []);
      } catch {
        setServerResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // What to show in the dropdown
  const displayItems: ServiceItem[] = useMemo(() => {
    if (searchQuery.trim()) return serverResults;
    // No query — show initial popular services
    return servicesData.slice(0, 8);
  }, [searchQuery, serverResults, servicesData]);

  const toDisplayName = (s: ServiceItem) =>
    language === "ne" ? s.name_np : s.name_en;

  const handleServiceSelect = (service: ServiceItem) => {
    setSearchQuery(toDisplayName(service));
    setShowSuggestions(false);
    router.push(`/services/${service.id}/professionals`);
  };

  const handleSearch = () => {
    const text = searchQuery.trim();
    if (!text) return;

    const exact = displayItems.find(
      (s) =>
        s.name_en.toLowerCase() === text.toLowerCase() ||
        s.name_np.toLowerCase() === text.toLowerCase()
    );

    if (exact) {
      router.push(`/services/${exact.id}/professionals`);
    } else {
      router.push(`/services/0/professionals?service=${encodeURIComponent(text)}`);
    }
  };

  return (
    <section className="relative -mt-10 z-30 px-4">
      <div className="container mx-auto">
        <div className="mx-auto max-w-4xl rounded-2xl border border-white/20 bg-white/70 p-3 shadow-2xl backdrop-blur-md md:p-5 dark:border-white/10 dark:bg-slate-900/60">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">

              {/* Search Input */}
              <div className="relative flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder={t.search.placeholder || "Search for services (e.g., plumbing, electrician)"}
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="h-14 pl-12 text-base border-none bg-background/40 backdrop-blur-sm rounded-xl focus-visible:ring-2 focus-visible:ring-primary/40 shadow-inner"
                  />

                  {/* Dropdown */}
                  {showSuggestions && (displayItems.length > 0 || isSearching) && (
                    <div className="absolute top-full left-0 right-0 mt-1 z-50">
                      <div className="rounded-lg border bg-popover shadow-lg max-h-96 overflow-y-auto">

                        {/* Loading indicator */}
                        {isSearching && (
                          <div className="flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground border-b">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Searching...
                          </div>
                        )}

                        {/* Section header */}
                        {!isSearching && displayItems.length > 0 && (
                          <div className="px-3 py-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide bg-muted/40 border-b">
                            {searchQuery.trim()
                              ? language === "ne" ? "मिल्दो सेवाहरू" : "Matching Services"
                              : language === "ne" ? "लोकप्रिय सेवाहरू" : "Popular Services"}
                          </div>
                        )}

                        {/* Results */}
                        {!isSearching && displayItems.map((service) => (
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

                        {/* Free-text fallback */}
                        {searchQuery.trim() && !isSearching && !displayItems.some(
                          (s) =>
                            s.name_en.toLowerCase() === searchQuery.toLowerCase() ||
                            s.name_np.toLowerCase() === searchQuery.toLowerCase()
                        ) && (
                          <div
                            className="px-4 py-3 hover:bg-accent hover:text-accent-foreground cursor-pointer border-t bg-muted/50 flex items-center gap-3"
                            onMouseDown={handleSearch}
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
                className="h-14 px-8 rounded-xl text-base shadow-xl transition-all hover:scale-[1.02] active:scale-95 bg-gradient-to-br from-primary to-primary/80"
                onClick={handleSearch}
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
