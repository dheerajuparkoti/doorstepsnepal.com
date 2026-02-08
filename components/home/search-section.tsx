'use client';

import { useState, useMemo, useEffect, useCallback } from "react";
import { useI18n } from "@/lib/i18n/context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Search, MapPin, SlidersHorizontal, X, Filter, ChevronRight } from "lucide-react";
import {
  provinces,
  getDistrictsByProvince,
  getMunicipalitiesByDistrict,
} from "@/lib/data/nepal-locations";


interface LocationFilter {
  provinceId: string;
  districtId: string;
  municipalityId: string;
  wardNo: string;
  street: string;
}

interface SearchSectionProps {
  professionalsData?: any[];
}

export function SearchSection({ professionalsData = [] }: SearchSectionProps) {
  const { t, language } = useI18n();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<"service" | "location">("service");
  const [locationFilter, setLocationFilter] = useState<LocationFilter>({
    provinceId: "",
    districtId: "",
    municipalityId: "",
    wardNo: "",
    street: "",
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showServiceSuggestions, setShowServiceSuggestions] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);

  // Get all unique services from professionals data
  const allServices = useMemo(() => {
    const servicesSet = new Set<string>();
    
    professionalsData.forEach((professional) => {
      if (professional.services) {
        professional.services.forEach((service: any) => {
          const serviceName = service.service?.name_en || service.name;
          if (serviceName) {
            servicesSet.add(serviceName);
          }
        });
      }
      if (professional.service_name) {
        professional.service_name.split(', ').forEach((service: string) => {
          if (service.trim()) servicesSet.add(service.trim());
        });
      }
    });
    
    return Array.from(servicesSet).sort();
  }, [professionalsData]);

  // Get all unique service areas from professionals data
  const allServiceAreas = useMemo(() => {
    const areasSet = new Set<string>();
    
    professionalsData.forEach((professional) => {
      if (professional.service_areas_full && professional.service_areas_full.length > 0) {
        professional.service_areas_full.forEach((area: any) => {
          if (area.name) {
            areasSet.add(area.name);
          }
        });
      }
      if (professional.service_areas_display) {
        professional.service_areas_display.split(', ').forEach((area: string) => {
          if (area.trim() && area.trim() !== 'No service areas listed') {
            areasSet.add(area.trim().replace('...', ''));
          }
        });
      }
    });
    
    return Array.from(areasSet).sort();
  }, [professionalsData]);

  // Filter services based on search query
  const filteredServices = useMemo(() => {
    if (!searchQuery.trim()) return allServices.slice(0, 10); // Show top 10 when empty
    
    const query = searchQuery.toLowerCase();
    return allServices
      .filter(service => service.toLowerCase().includes(query))
      .slice(0, 10); // Limit to 10 results
  }, [searchQuery, allServices]);

  // Filter service areas based on search query
  const filteredServiceAreas = useMemo(() => {
    if (!searchQuery.trim()) return allServiceAreas.slice(0, 10); // Show top 10 when empty
    
    const query = searchQuery.toLowerCase();
    return allServiceAreas
      .filter(area => area.toLowerCase().includes(query))
      .slice(0, 10); 
  }, [searchQuery, allServiceAreas]);


  const filteredDistricts = locationFilter.provinceId
    ? getDistrictsByProvince(Number(locationFilter.provinceId))
    : [];
  const filteredMunicipalities = locationFilter.districtId
    ? getMunicipalitiesByDistrict(Number(locationFilter.districtId))
    : [];


  const handleSearchFocus = () => {
    if (searchType === "service") {
      setShowServiceSuggestions(true);
    } else {
      setShowLocationSuggestions(true);
    }
  };


  const handleSearchBlur = () => {
    setTimeout(() => {
      setShowServiceSuggestions(false);
      setShowLocationSuggestions(false);
    }, 200);
  };


  const handleServiceSelect = (service: string) => {
    setSearchQuery(service);
    setShowServiceSuggestions(false);

    handleSearch(service);
  };

 
  const handleLocationSelect = (area: string) => {
    setSearchQuery(area);
    setShowLocationSuggestions(false);

    handleLocationSearch(area);
  };


  const clearFilters = () => {
    setLocationFilter({
      provinceId: "",
      districtId: "",
      municipalityId: "",
      wardNo: "",
      street: "",
    });
    setSearchQuery("");
    setSearchType("service");
  };

  const hasActiveFilters = Object.values(locationFilter).some((v) => v !== "") || searchQuery;
  const hasLocationSelected = Object.values(locationFilter).some(v => v !== "");


  // Handle service search
const handleSearch = (selectedService?: string) => {
  const serviceToSearch = selectedService || searchQuery;
  if (!serviceToSearch.trim()) return;


  let foundServiceId: number | null = null;

  for (const professional of professionalsData) {
    if (professional.services) {
      const match = professional.services.find((service: any) => {
        const serviceName = service.service?.name_en || service.name || service.service_name;
        return serviceName?.toLowerCase().includes(serviceToSearch.toLowerCase());
      });
      
      if (match) {
        foundServiceId = match.service_id || match.service?.id;
        break;
      }
    }
  }

  if (foundServiceId) {
 
    router.push(`/services/${foundServiceId}/professionals?search=${encodeURIComponent(serviceToSearch)}`);
  } else {

    router.push(`/services/0/professionals?service=${encodeURIComponent(serviceToSearch)}`);
  }
};

// Handle location search
const handleLocationSearch = (selectedArea?: string) => {
  const areaToSearch = selectedArea || searchQuery;
  

  let foundServiceId: number | null = null;
  
  if (searchType === "service" && searchQuery.trim()) {
    for (const professional of professionalsData) {
      if (professional.services) {
        const match = professional.services.find((service: any) => {
          const serviceName = service.service?.name_en || service.name || service.service_name;
          return serviceName?.toLowerCase().includes(searchQuery.toLowerCase());
        });
        
        if (match) {
          foundServiceId = match.service_id || match.service?.id;
          break;
        }
      }
    }
  }
  
  const params = new URLSearchParams();
  
  if (hasLocationSelected) {
    // Add location filters
    if (locationFilter.provinceId) {
      const province = provinces.find(p => p.id === Number(locationFilter.provinceId));
      if (province) {
        params.append("province", language === "ne" ? province.nameNe : province.name);
      }
    }
    
    if (locationFilter.districtId && filteredDistricts.length > 0) {
      const district = filteredDistricts.find(d => d.id === Number(locationFilter.districtId));
      if (district) {
        params.append("district", language === "ne" ? district.nameNe : district.name);
      }
    }
    
    if (locationFilter.municipalityId && filteredMunicipalities.length > 0) {
      const municipality = filteredMunicipalities.find(m => m.id === Number(locationFilter.municipalityId));
      if (municipality) {
        params.append("municipality", language === "ne" ? municipality.nameNe : municipality.name);
      }
    }
    
    if (locationFilter.wardNo) {
      params.append("ward", locationFilter.wardNo);
    }
    
    if (locationFilter.street) {
      params.append("street", locationFilter.street);
    }
    
    params.append("filterType", "address");
  } else if (areaToSearch.trim()) {
    // Simple area search
    params.append("address", areaToSearch);
    params.append("filterType", "address");
  }
  

  if (searchType === "service" && searchQuery.trim()) {
    params.append("service", searchQuery);
  }
  
  const serviceId = foundServiceId || 0;
  

  router.push(`/services/${serviceId}/professionals?${params.toString()}`);
};

  // Handle province change
  const handleProvinceChange = (value: string) => {
    setLocationFilter({
      ...locationFilter,
      provinceId: value,
      districtId: "",
      municipalityId: "",
    });
  };

  // Handle district change
  const handleDistrictChange = (value: string) => {
    setLocationFilter({
      ...locationFilter,
      districtId: value,
      municipalityId: "",
    });
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (searchType === "service") {
        handleSearch();
      } else {
        handleLocationSearch();
      }
    }
  };

  return (
    <section className="relative -mt-10 z-30 px-4">
      <div className="container mx-auto">
        {/* MAIN GLASS CONTAINER */}
        <div className="mx-auto max-w-4xl rounded-2xl border border-white/20 bg-white/70 p-3 shadow-2xl backdrop-blur-md md:p-5 dark:border-white/10 dark:bg-slate-900/60">
          <div className="flex flex-col gap-3">
            {/* Search Type Selector */}
            <div className="flex items-center gap-2 mb-2">
              <Button
                variant={searchType === "service" ? "default" : "outline"}
                size="sm"
                className={`flex-1 ${searchType === "service" ? "bg-primary" : "bg-transparent"}`}
                onClick={() => {
                  setSearchType("service");
                  setSearchQuery("");
                }}
              >
                <Search className="mr-2 h-4 w-4" />
                {t.search.byService || "By Service"}
              </Button>
              <Button
                variant={searchType === "location" ? "default" : "outline"}
                size="sm"
                className={`flex-1 ${searchType === "location" ? "bg-primary" : "bg-transparent"}`}
                onClick={() => {
                  setSearchType("location");
                  setSearchQuery("");
                }}
              >
                <MapPin className="mr-2 h-4 w-4" />
                {t.search.byLocation || "By Location"}
              </Button>
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              
              {/* Search Input with Suggestions Dropdown */}
              <div className="relative flex-1">
                {searchType === "service" ? (
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
                    
                    {/* Service Suggestions Dropdown */}
                    {showServiceSuggestions && filteredServices.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 z-50">
                        <div className="rounded-lg border bg-popover shadow-lg max-h-60 overflow-y-auto">
                          {filteredServices.map((service, index) => (
                            <div
                              key={index}
                              className="px-4 py-3 hover:bg-accent hover:text-accent-foreground cursor-pointer border-b last:border-b-0 transition-colors"
                              onMouseDown={() => handleServiceSelect(service)}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-medium">{service}</span>
                                <ChevronRight className="h-4 w-4 opacity-50" />
                              </div>
                            </div>
                          ))}
                          {searchQuery.trim() && !filteredServices.some(s => s.toLowerCase() === searchQuery.toLowerCase()) && (
                            <div
                              className="px-4 py-3 hover:bg-accent hover:text-accent-foreground cursor-pointer border-t bg-muted/50"
                              onMouseDown={() => handleServiceSelect(searchQuery)}
                            >
                              <div className="flex items-center justify-between">
                                <span>Search for "{searchQuery}"</span>
                                <Search className="h-4 w-4" />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors" />
                    <Input
                      type="text"
                      placeholder={t.search.locationPlaceholder || "Enter area name (e.g., Kathmandu, Pokhara)"}
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowLocationSuggestions(true);
                      }}
                      onFocus={handleSearchFocus}
                      onBlur={handleSearchBlur}
                      onKeyDown={handleKeyPress}
                      className="h-14 pl-12 text-base border-none bg-background/40 backdrop-blur-sm rounded-xl focus-visible:ring-2 focus-visible:ring-primary/40 shadow-inner"
                    />
                    
                    {/* Location Suggestions Dropdown */}
                    {showLocationSuggestions && filteredServiceAreas.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 z-50">
                        <div className="rounded-lg border bg-popover shadow-lg max-h-60 overflow-y-auto">
                          {filteredServiceAreas.map((area, index) => (
                            <div
                              key={index}
                              className="px-4 py-3 hover:bg-accent hover:text-accent-foreground cursor-pointer border-b last:border-b-0 transition-colors"
                              onMouseDown={() => handleLocationSelect(area)}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-medium">{area}</span>
                                <ChevronRight className="h-4 w-4 opacity-50" />
                              </div>
                            </div>
                          ))}
                          {searchQuery.trim() && !filteredServiceAreas.some(a => a.toLowerCase() === searchQuery.toLowerCase()) && (
                            <div
                              className="px-4 py-3 hover:bg-accent hover:text-accent-foreground cursor-pointer border-t bg-muted/50"
                              onMouseDown={() => handleLocationSelect(searchQuery)}
                            >
                              <div className="flex items-center justify-between">
                                <span>Search for "{searchQuery}"</span>
                                <Search className="h-4 w-4" />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Location Filter Popover - Only show for location search */}
              {searchType === "location" && (
                <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`h-14 gap-3 px-5 rounded-xl transition-all hover:bg-background/80 ${
                        hasLocationSelected ? "border-primary text-primary bg-primary/5" : "border-border/40 bg-background/40"
                      }`}
                    >
                      <Filter className="h-5 w-5 opacity-70" />
                      <span className="hidden lg:inline font-medium">
                        {hasLocationSelected ? t.search.filterActive || "Filtered" : t.search.advancedFilter || "Advanced Filter"}
                      </span>
                      <SlidersHorizontal className="h-5 w-5 lg:hidden" />
                      {hasLocationSelected && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground animate-in zoom-in">
                          {Object.values(locationFilter).filter(v => v !== "").length}
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  
                  <PopoverContent className="w-85 p-5 rounded-2xl shadow-2xl border-border/40 backdrop-blur-xl bg-card/95" align="end">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-border/40">
                        <h4 className="font-semibold text-foreground tracking-tight">{t.search.filterByLocation || "Filter by Location"}</h4>
                        {hasLocationSelected && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearFilters}
                            className="h-8 text-xs text-destructive hover:bg-destructive/10"
                          >
                            <X className="mr-1 h-3 w-3" />
                            {t.search.clear || "Clear"}
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        {/* Province Select */}
                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold uppercase tracking-wider opacity-60">{t.search.province || "Province"}</Label>
                          <Select value={locationFilter.provinceId} onValueChange={handleProvinceChange}>
                            <SelectTrigger className="bg-background/50">
                              <SelectValue placeholder={t.search.province || "Select Province"} />
                            </SelectTrigger>
                            <SelectContent>
                              {provinces.map((p) => (
                                <SelectItem key={p.id} value={String(p.id)}>
                                  {language === "ne" ? p.nameNe : p.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* District Select */}
                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold opacity-60">{t.search.district || "District"}</Label>
                          <Select 
                            value={locationFilter.districtId} 
                            onValueChange={handleDistrictChange}
                            disabled={!locationFilter.provinceId}
                          >
                            <SelectTrigger className="bg-background/50 disabled:opacity-30">
                              <SelectValue placeholder={t.search.district || "Select District"} />
                            </SelectTrigger>
                            <SelectContent>
                              {filteredDistricts.map((d) => (
                                <SelectItem key={d.id} value={String(d.id)}>
                                  {language === "ne" ? d.nameNe : d.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Municipality Select */}
                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold opacity-60">{t.search.municipality || "Municipality"}</Label>
                          <Select 
                            value={locationFilter.municipalityId} 
                            onValueChange={(v: any) => setLocationFilter({ ...locationFilter, municipalityId: v })}
                            disabled={!locationFilter.districtId}
                          >
                            <SelectTrigger className="bg-background/50 disabled:opacity-30">
                              <SelectValue placeholder={t.search.municipality || "Select Municipality"} />
                            </SelectTrigger>
                            <SelectContent>
                              {filteredMunicipalities.map((m) => (
                                <SelectItem key={m.id} value={String(m.id)}>
                                  {language === "ne" ? m.nameNe : m.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Ward Select */}
                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold opacity-60">{t.search.wardNo || "Ward No."}</Label>
                          <Select 
                            value={locationFilter.wardNo} 
                            onValueChange={(v: any) => setLocationFilter({ ...locationFilter, wardNo: v })}
                          >
                            <SelectTrigger className="bg-background/50">
                              <SelectValue placeholder={t.search.wardNo || "Select Ward"} />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 32 }, (_, i) => i + 1).map((ward) => (
                                <SelectItem key={ward} value={String(ward)}>
                                  {ward}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Street Input */}
                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold opacity-60">{t.search.street || "Street/Tole"}</Label>
                          <Input
                            placeholder={t.search.street || "Enter street name"}
                            value={locationFilter.street}
                            onChange={(e) => setLocationFilter({ ...locationFilter, street: e.target.value })}
                          />
                        </div>
                      </div>

                      {/* Apply Button */}
                      <Button 
                        className="w-full mt-2 shadow-lg shadow-primary/20" 
                        onClick={() => {
                          setIsFilterOpen(false);
                          handleLocationSearch();
                        }}
                      >
                        {t.search.apply || "Apply Filter"}
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              )}

              {/* Search Button */}
              <Button 
                className="h-14 px-8 rounded-xl font text-base shadow-xl transition-all hover:scale-[1.02] active:scale-95 bg-gradient-to-br from-primary to-primary/80"
                onClick={() => {
                  if (searchType === "service") {
                    handleSearch();
                  } else {
                    handleLocationSearch();
                  }
                }}
                disabled={searchType === "service" && !searchQuery.trim()}
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

