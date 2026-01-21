"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n/context";
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
import { Search, MapPin, SlidersHorizontal, X } from "lucide-react";
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

export function SearchSection() {
  const { t, language } = useI18n();
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState<LocationFilter>({
    provinceId: "",
    districtId: "",
    municipalityId: "",
    wardNo: "",
    street: "",
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filtered lists
  const filteredDistricts = locationFilter.provinceId
    ? getDistrictsByProvince(Number(locationFilter.provinceId))
    : [];
  const filteredMunicipalities = locationFilter.districtId
    ? getMunicipalitiesByDistrict(Number(locationFilter.districtId))
    : [];

  // Handlers
  const handleProvinceChange = (value: string) => {
    setLocationFilter({
      ...locationFilter,
      provinceId: value,
      districtId: "",
      municipalityId: "",
    });
  };

  const handleDistrictChange = (value: string) => {
    setLocationFilter({
      ...locationFilter,
      districtId: value,
      municipalityId: "",
    });
  };

  const clearFilters = () => {
    setLocationFilter({
      provinceId: "",
      districtId: "",
      municipalityId: "",
      wardNo: "",
      street: "",
    });
  };

  const hasActiveFilters = Object.values(locationFilter).some((v) => v !== "");

  return (
    <section className="relative -mt-10 z-20 px-4">
      <div className="container mx-auto">
        {/* MAIN GLASS CONTAINER */}
        <div className="mx-auto max-w-4xl rounded-2xl border border-white/20 bg-white/70 p-3 shadow-2xl backdrop-blur-md md:p-5 dark:border-white/10 dark:bg-slate-900/60">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            
            {/* Search Input Box */}
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                type="text"
                placeholder={t.search.placeholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 pl-12 text-base border-none bg-background/40 backdrop-blur-sm rounded-xl focus-visible:ring-2 focus-visible:ring-primary/40 shadow-inner"
              />
            </div>

            {/* Location Filter Popover */}
            <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`h-14 gap-3 px-5 rounded-xl transition-all hover:bg-background/80 ${
                    hasActiveFilters ? "border-primary text-primary bg-primary/5" : "border-border/40 bg-background/40"
                  }`}
                >
                  <MapPin className="h-5 w-5 opacity-70" />
                  <span className="hidden lg:inline font-medium">
                    {hasActiveFilters ? t.search.filterActive : t.search.filterByLocation}
                  </span>
                  <SlidersHorizontal className="h-5 w-5 lg:hidden" />
                  {hasActiveFilters && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground animate-in zoom-in">
                      {Object.values(locationFilter).filter(v => v !== "").length}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              
              <PopoverContent className="w-85 p-5 rounded-2xl shadow-2xl border-border/40 backdrop-blur-xl bg-card/95" align="end">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-border/40">
                    <h4 className="font-semibold text-foreground tracking-tight">{t.search.filterByLocation}</h4>
                    {hasActiveFilters && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="h-8 text-xs text-destructive hover:bg-destructive/10"
                      >
                        <X className="mr-1 h-3 w-3" />
                        {t.search.clear}
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {/* Province Select */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold uppercase tracking-wider opacity-60">{t.search.province}</Label>
                      <Select value={locationFilter.provinceId} onValueChange={handleProvinceChange}>
                        <SelectTrigger className="bg-background/50">
                          <SelectValue placeholder={t.search.province} />
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
                      <Label className="text-xs font-semibold opacity-60">{t.search.district}</Label>
                      <Select 
                        value={locationFilter.districtId} 
                        onValueChange={handleDistrictChange}
                        disabled={!locationFilter.provinceId}
                      >
                        <SelectTrigger className="bg-background/50 disabled:opacity-30">
                          <SelectValue placeholder={t.search.district} />
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
                      <Label className="text-xs font-semibold opacity-60">{t.search.municipality}</Label>
                      <Select 
                        value={locationFilter.municipalityId} 
                        onValueChange={(v: any) => setLocationFilter({ ...locationFilter, municipalityId: v })}
                        disabled={!locationFilter.districtId}
                      >
                        <SelectTrigger className="bg-background/50 disabled:opacity-30">
                          <SelectValue placeholder={t.search.municipality} />
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
                      <Label className="text-xs font-semibold opacity-60">{t.search.wardNo}</Label>
                      <Select 
                        value={locationFilter.wardNo} 
                        onValueChange={(v: any) => setLocationFilter({ ...locationFilter, wardNo: v })}
                      >
                        <SelectTrigger className="bg-background/50">
                          <SelectValue placeholder={t.search.wardNo} />
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
                      <Label className="text-xs font-semibold opacity-60">{t.search.street}</Label>
                      <Input
                        placeholder={t.search.street}
                        value={locationFilter.street}
                        onChange={(e) => setLocationFilter({ ...locationFilter, street: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Apply Button */}
                  <Button className="w-full mt-2 shadow-lg shadow-primary/20" onClick={() => setIsFilterOpen(false)}>
                    {t.search.apply}
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            {/* Action Button */}
            <Button className="h-14 px-8 rounded-xl font-bold text-base shadow-xl transition-all hover:scale-[1.02] active:scale-95 bg-gradient-to-br from-primary to-primary/80">
              <Search className="mr-2 h-5 w-5" />
              {t.search.searchButton}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
