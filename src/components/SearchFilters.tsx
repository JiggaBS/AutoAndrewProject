import { useState, useMemo, useEffect } from "react";
import { Search, RotateCcw, X, Car, FileText, Calendar, Euro, Zap, Gauge, Palette, Fuel, Settings, Leaf, DoorOpen, Activity, Filter, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Vehicle, years } from "@/data/sampleVehicles";
import { useLanguage } from "@/contexts/LanguageContext";
import { RangeFilter } from "./filters/RangeFilter";
import { ChipFilter } from "./filters/ChipFilter";
import { cn } from "@/lib/utils";

interface SearchFiltersProps {
  onSearch: (filters: FilterState) => void;
  resultCount?: number;
  vehicles?: Vehicle[];
}

export interface FilterState {
  vehicleType: string;
  make: string;
  model: string;
  priceMin: string;
  priceMax: string;
  yearFrom: string;
  yearTo: string;
  fuelType: string;
  gearbox: string;
  mileageMin: string;
  mileageMax: string;
  condition: string;
  emissionsClass: string;
  color: string;
  powerMin: string;
  powerMax: string;
  doors: string;
  engineDisplacementMin: string;
  engineDisplacementMax: string;
  bodyType: string;
}

const defaultFilters: FilterState = {
  vehicleType: "car",
  make: "",
  model: "",
  priceMin: "",
  priceMax: "",
  yearFrom: "",
  yearTo: "",
  fuelType: "",
  gearbox: "",
  mileageMin: "",
  mileageMax: "",
  condition: "",
  emissionsClass: "",
  color: "",
  powerMin: "",
  powerMax: "",
  doors: "",
  engineDisplacementMin: "",
  engineDisplacementMax: "",
  bodyType: "",
};

export function SearchFilters({
  onSearch,
  resultCount = 0,
  vehicles = []
}: SearchFiltersProps) {
  const { t, language, translateFuelType } = useLanguage();
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [debouncing, setDebouncing] = useState(false);

  // Debounce search
  useEffect(() => {
    setDebouncing(true);
    const timer = setTimeout(() => {
      onSearch(filters);
      setDebouncing(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [filters, onSearch]);

  // Derived Data
  const availableMakes = useMemo(() => {
    const makesSet = new Set<string>();
    vehicles.forEach(v => v.make && makesSet.add(v.make));
    return Array.from(makesSet).sort();
  }, [vehicles]);

  const availableModels = useMemo(() => {
    if (!filters.make) return [];
    const modelsSet = new Set<string>();
    vehicles.forEach(v => {
      if (v.make === filters.make && v.model) modelsSet.add(v.model);
    });
    return Array.from(modelsSet).sort();
  }, [filters.make, vehicles]);

  const availableFuelTypes = useMemo(() => Array.from(new Set(vehicles.map(v => v.fuel_type).filter(Boolean))).sort(), [vehicles]);
  
  const availableGearboxes = useMemo(() => {
    const set = new Set<string>();
    vehicles.forEach(v => {
      if (v.gearbox) {
        const normalized = v.gearbox.toLowerCase().includes("auto") 
          ? (language === "it" ? "Automatico" : "Automatic") 
          : (language === "it" ? "Manuale" : "Manual");
        set.add(normalized);
      }
    });
    return Array.from(set).sort();
  }, [vehicles, language]);

  const availableColors = useMemo(() => {
    const set = new Set<string>();
    vehicles.forEach(v => {
        if (v.color) set.add(v.color.charAt(0).toUpperCase() + v.color.slice(1).toLowerCase());
    });
    return Array.from(set).sort();
  }, [vehicles]);

  const colorOptions = useMemo(() => {
    const allColors = availableColors.map(c => ({ label: c, value: c }));
    // Prioritize "Bianco" and "Nero" - move them to the front
    const priority = ["Bianco", "Nero"];
    const priorityColors = allColors.filter(opt => priority.includes(opt.label));
    const otherColors = allColors.filter(opt => !priority.includes(opt.label));
    // If priority colors don't exist, just use first 2 from sorted list
    if (priorityColors.length === 0 && allColors.length > 0) {
      return allColors;
    }
    return [...priorityColors, ...otherColors];
  }, [availableColors]);

  const availableEmissions = useMemo(() => {
      const set = new Set<string>();
      vehicles.forEach(v => v.emissions_class && set.add(v.emissions_class));
      return Array.from(set).sort((a, b) => b.localeCompare(a));
  }, [vehicles]);

  const euroClassOptions = useMemo(() => {
    const allEmissions = availableEmissions.map(e => ({ label: e, value: e }));
    // Prioritize "Euro 6" and "Euro 5" - move them to the front
    const priority = ["Euro 6", "Euro 5"];
    const priorityEmissions = allEmissions.filter(opt => priority.includes(opt.label));
    const otherEmissions = allEmissions.filter(opt => !priority.includes(opt.label));
    // If priority emissions don't exist, just use first 2 from sorted list
    if (priorityEmissions.length === 0 && allEmissions.length > 0) {
      return allEmissions;
    }
    return [...priorityEmissions, ...otherEmissions];
  }, [availableEmissions]);

  // Compute real ranges from actual vehicle data
  const priceRange = useMemo(() => {
    if (vehicles.length === 0) return { min: 0, max: 100000 };
    const prices = vehicles.map(v => v.price).filter(p => p != null && p > 0);
    if (prices.length === 0) return { min: 0, max: 100000 };
    const min = Math.floor(Math.min(...prices) / 1000) * 1000; // Round down to nearest 1000
    const max = Math.ceil(Math.max(...prices) / 1000) * 1000; // Round up to nearest 1000
    return { min: Math.max(0, min), max: Math.max(min + 10000, max) }; // Ensure at least 10k range
  }, [vehicles]);

  const yearRange = useMemo(() => {
    if (vehicles.length === 0) return { min: 2000, max: new Date().getFullYear() };
    const years = vehicles
      .map(v => {
        if (!v.first_registration_date) return null;
        // Parse "05-2021" or "2021" format
        const parts = v.first_registration_date.split('-');
        const yearStr = parts.length > 1 ? parts[1] : parts[0];
        const year = parseInt(yearStr, 10);
        return isNaN(year) ? null : year;
      })
      .filter((y): y is number => y != null && y >= 2000);
    if (years.length === 0) return { min: 2000, max: new Date().getFullYear() };
    return { min: Math.min(...years), max: Math.max(...years, new Date().getFullYear()) };
  }, [vehicles]);

  const mileageRange = useMemo(() => {
    if (vehicles.length === 0) return { min: 0, max: 300000 };
    const mileages = vehicles
      .map(v => {
        if (!v.mileage) return null;
        // Parse "63.000" format (remove dots and parse)
        const cleaned = v.mileage.replace(/\./g, '');
        const mileage = parseInt(cleaned, 10);
        return isNaN(mileage) ? null : mileage;
      })
      .filter((m): m is number => m != null && m >= 0);
    if (mileages.length === 0) return { min: 0, max: 300000 };
    const min = Math.floor(Math.min(...mileages) / 1000) * 1000; // Round down to nearest 1000
    const max = Math.ceil(Math.max(...mileages) / 1000) * 1000; // Round up to nearest 1000
    return { min: Math.max(0, min), max: Math.max(min + 10000, max) }; // Ensure at least 10k range
  }, [vehicles]);

  const powerRange = useMemo(() => {
    if (vehicles.length === 0) return { min: 0, max: 600 };
    const powers = vehicles.map(v => v.power_cv).filter(p => p != null && p > 0);
    if (powers.length === 0) return { min: 0, max: 600 };
    const min = Math.floor(Math.min(...powers) / 10) * 10; // Round down to nearest 10
    const max = Math.ceil(Math.max(...powers) / 10) * 10; // Round up to nearest 10
    return { min: Math.max(0, min), max: Math.max(min + 50, max) }; // Ensure at least 50 CV range
  }, [vehicles]);

  const engineDisplacementRange = useMemo(() => {
    if (vehicles.length === 0) return { min: 0, max: 6.0 };
    const displacements = vehicles
      .map(v => {
        if (!v.cubic_capacity) return null;
        // Convert from cc to liters
        return v.cubic_capacity / 1000;
      })
      .filter((d): d is number => d != null && d > 0);
    if (displacements.length === 0) return { min: 0, max: 6.0 };
    const min = Math.floor(Math.min(...displacements) * 10) / 10; // Round down to nearest 0.1
    const max = Math.ceil(Math.max(...displacements) * 10) / 10; // Round up to nearest 0.1
    return { min: Math.max(0, min), max: Math.max(min + 0.5, max) }; // Ensure at least 0.5L range
  }, [vehicles]);

  // Map vehicle_category to bodyType filter values
  const categoryToBodyType: Record<string, string> = {
    "City car": "city_car",
    "SUV": "suv",
    "Pick-up": "suv",
    "Furgoni": "van",
    "Van": "van",
    "Cabrio": "cabrio",
    "Monovolume": "monovolume",
    "Berlina": "berlina",
    "Station Wagon": "station_wagon",
    "Coupé": "coupe",
    "Coupe": "coupe",
  };

  const availableBodyTypes = useMemo(() => {
    const bodyTypeSet = new Set<string>();
    vehicles.forEach(v => {
      if (v.vehicle_category) {
        const normalizedCategory = v.vehicle_category.trim();
        const bodyType = categoryToBodyType[normalizedCategory];
        if (bodyType) {
          bodyTypeSet.add(bodyType);
        }
      }
    });
    return Array.from(bodyTypeSet);
  }, [vehicles]);

  const bodyTypeOptions = useMemo(() => {
    const allOptions = [
      { value: "city_car", label: t("body.cityCar") },
      { value: "suv", label: t("body.suv") },
      { value: "van", label: t("body.van") },
      { value: "cabrio", label: t("body.cabrio") },
      { value: "monovolume", label: t("body.monovolume") },
      { value: "berlina", label: t("body.berlina") },
      { value: "station_wagon", label: t("body.stationWagon") },
      { value: "coupe", label: t("body.coupe") },
    ];
    // If no vehicles, show all options; otherwise filter to only available ones
    let filtered = vehicles.length === 0 || availableBodyTypes.length === 0
      ? allOptions
      : allOptions.filter(opt => availableBodyTypes.includes(opt.value));
    
    // Prioritize berlina and station_wagon - move them to the front
    const priority = ["berlina", "station_wagon"];
    const priorityOptions = filtered.filter(opt => priority.includes(opt.value));
    const otherOptions = filtered.filter(opt => !priority.includes(opt.value));
    return [...priorityOptions, ...otherOptions];
  }, [availableBodyTypes, vehicles.length, t]);

  const doorOptions = ["2", "3", "4", "5"];

  const doorFilterOptions = useMemo(() => {
    const allDoors = [
      { value: "", label: t("filters.any") },
      ...doorOptions.map(d => ({ value: d, label: d }))
    ];
    // Prioritize "Qualsiasi" and "4" - show them first, then others
    const priority = ["4"];
    const qualsiasi = allDoors.find(opt => opt.value === "");
    const priorityDoors = allDoors.filter(opt => priority.includes(opt.value));
    const otherDoors = allDoors.filter(opt => !priority.includes(opt.value) && opt.value !== "");
    // Show "Qualsiasi" first, then "4", then others
    return [qualsiasi, ...priorityDoors, ...otherDoors].filter(Boolean);
  }, [t]);

  // Handlers
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => {
      const next = { ...prev, [key]: value };
      if (key === "make") next.model = "";
      return next;
    });
  };

  const handleRangeChange = (minKey: keyof FilterState, maxKey: keyof FilterState, min: string, max: string) => {
    setFilters(prev => ({ ...prev, [minKey]: min, [maxKey]: max }));
  };

  const handleReset = () => {
    setFilters(defaultFilters);
  };

  const handleRemoveFilter = (key: keyof FilterState) => {
    handleFilterChange(key, "");
  };

  const isDefault = useMemo(() => {
      // Compare excluding objects/arrays if any (FilterState is flat strings)
      // Check each key against default
      return (Object.keys(defaultFilters) as Array<keyof FilterState>).every(k => filters[k] === defaultFilters[k]);
  }, [filters]);

  // Active Filters Component
  const ActiveFilters = () => {
    const activeKeys = (Object.keys(filters) as Array<keyof FilterState>).filter(k => {
       if (k === "vehicleType") return false;
       if (filters[k] === "") return false;
       if (k.endsWith("Min") || k.endsWith("Max") || k.endsWith("From") || k.endsWith("To")) return false;
       return true;
    });

    const hasActiveFilters = activeKeys.length > 0 || 
        filters.priceMin || filters.priceMax || 
        filters.yearFrom || filters.yearTo || 
        filters.mileageMin || filters.mileageMax || 
        filters.powerMin || filters.powerMax || 
        filters.engineDisplacementMin || filters.engineDisplacementMax;

    if (!hasActiveFilters) return null;

    return (
      <div className="flex flex-wrap gap-2 pt-2">
        {activeKeys.map(key => {
            let label = filters[key];
            if (key === "fuelType") label = translateFuelType(label);
            return (
                <Badge key={key} variant="secondary" className="flex items-center gap-1 h-6 px-2 text-[10px] font-normal border-border/50 hover:bg-destructive/10 hover:text-destructive cursor-pointer transition-colors" onClick={() => handleRemoveFilter(key)}>
                    {label} <X className="h-2.5 w-2.5" />
                </Badge>
            )
        })}
        {(filters.priceMin || filters.priceMax) && (
            <Badge variant="secondary" className="flex items-center gap-1 h-6 px-2 text-[10px] font-normal border-border/50 hover:bg-destructive/10 hover:text-destructive cursor-pointer" onClick={() => handleRangeChange("priceMin", "priceMax", "", "")}>
                {t("listings.filters.price")} <X className="h-2.5 w-2.5" />
            </Badge>
        )}
        {(filters.yearFrom || filters.yearTo) && (
             <Badge variant="secondary" className="flex items-center gap-1 h-6 px-2 text-[10px] font-normal border-border/50 hover:bg-destructive/10 hover:text-destructive cursor-pointer" onClick={() => handleRangeChange("yearFrom", "yearTo", "", "")}>
             {t("listings.filters.year")} <X className="h-2.5 w-2.5" />
         </Badge>
        )}
        {(filters.mileageMin || filters.mileageMax) && (
             <Badge variant="secondary" className="flex items-center gap-1 h-6 px-2 text-[10px] font-normal border-border/50 hover:bg-destructive/10 hover:text-destructive cursor-pointer" onClick={() => handleRangeChange("mileageMin", "mileageMax", "", "")}>
             {t("listings.filters.km")} <X className="h-2.5 w-2.5" />
         </Badge>
        )}
        {(filters.powerMin || filters.powerMax) && (
             <Badge variant="secondary" className="flex items-center gap-1 h-6 px-2 text-[10px] font-normal border-border/50 hover:bg-destructive/10 hover:text-destructive cursor-pointer" onClick={() => handleRangeChange("powerMin", "powerMax", "", "")}>
             {t("filters.power")} <X className="h-2.5 w-2.5" />
         </Badge>
        )}
        {(filters.engineDisplacementMin || filters.engineDisplacementMax) && (
             <Badge variant="secondary" className="flex items-center gap-1 h-6 px-2 text-[10px] font-normal border-border/50 hover:bg-destructive/10 hover:text-destructive cursor-pointer" onClick={() => handleRangeChange("engineDisplacementMin", "engineDisplacementMax", "", "")}>
             {t("filters.engineFrom").replace(" da", "")} <X className="h-2.5 w-2.5" />
         </Badge>
        )}
      </div>
    );
  };

  const FilterForm = () => (
    <div className="space-y-6">
      {/* Section: Base */}
      <div className="space-y-3">
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-12 md:col-span-4 lg:col-span-3">
            <Select value={filters.make || undefined} onValueChange={(v) => handleFilterChange("make", v)}>
              <SelectTrigger className="h-9 text-sm bg-card border-input/60">
                <div className="flex items-center gap-2 truncate">
                   <Car className="h-3.5 w-3.5 text-muted-foreground" />
                   <span className="truncate">{filters.make || t("filters.brand")}</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                  {availableMakes.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-12 md:col-span-4 lg:col-span-3">
            <Select value={filters.model || undefined} onValueChange={(v) => handleFilterChange("model", v)} disabled={!filters.make}>
              <SelectTrigger className="h-9 text-sm bg-card border-input/60">
                 <div className="flex items-center gap-2 truncate">
                   <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                   <span className="truncate">{filters.model || t("filters.model")}</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                  {availableModels.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-12 md:col-span-4 lg:col-span-3">
             <Select value={filters.fuelType || undefined} onValueChange={(v) => handleFilterChange("fuelType", v)}>
              <SelectTrigger className="h-9 text-sm bg-card border-input/60">
                 <div className="flex items-center gap-2 truncate">
                   <Fuel className="h-3.5 w-3.5 text-muted-foreground" />
                   <span className="truncate">{filters.fuelType ? translateFuelType(filters.fuelType) : t("filters.fuel")}</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                  {availableFuelTypes.map(f => <SelectItem key={f} value={f}>{translateFuelType(f)}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-12 md:col-span-4 lg:col-span-3">
             <RangeFilter
                label={t("listings.filters.price")}
                min={priceRange.min}
                max={priceRange.max}
                step={500}
                unit="€"
                minValue={filters.priceMin}
                maxValue={filters.priceMax}
                onChange={(min, max) => handleRangeChange("priceMin", "priceMax", min, max)}
            />
          </div>
        </div>
      </div>

      <Separator className="bg-border/40" />

      {/* Section: Range (Always Visible part) */}
      <div className="space-y-3">
        <div className="grid grid-cols-12 gap-x-4 gap-y-3">
          <div className="col-span-12 md:col-span-6 lg:col-span-3">
             <RangeFilter
                label={t("listings.filters.year")}
                min={yearRange.min}
                max={yearRange.max}
                step={1}
                minValue={filters.yearFrom}
                maxValue={filters.yearTo}
                onChange={(min, max) => handleRangeChange("yearFrom", "yearTo", min, max)}
            />
          </div>
          <div className="col-span-12 md:col-span-6 lg:col-span-3">
             <RangeFilter
                label={t("listings.filters.km")}
                min={mileageRange.min}
                max={mileageRange.max}
                step={1000}
                unit="km"
                minValue={filters.mileageMin}
                maxValue={filters.mileageMax}
                onChange={(min, max) => handleRangeChange("mileageMin", "mileageMax", min, max)}
            />
          </div>
          <div className="col-span-12 md:col-span-6 lg:col-span-3">
             <RangeFilter
                label={t("filters.power")}
                min={powerRange.min}
                max={powerRange.max}
                step={10}
                unit="CV"
                minValue={filters.powerMin}
                maxValue={filters.powerMax}
                onChange={(min, max) => handleRangeChange("powerMin", "powerMax", min, max)}
            />
          </div>
          <div className="col-span-12 md:col-span-6 lg:col-span-3">
             <RangeFilter
                label={t("filters.engineFrom").replace(" da", "")}
                min={engineDisplacementRange.min}
                max={engineDisplacementRange.max}
                step={0.1}
                unit="L"
                minValue={filters.engineDisplacementMin}
                maxValue={filters.engineDisplacementMax}
                onChange={(min, max) => handleRangeChange("engineDisplacementMin", "engineDisplacementMax", min, max)}
            />
          </div>
        </div>
      </div>

      <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced} className="w-full">
        {/* Advanced Filters Trigger */}
        <div className="flex items-center -mb-3 relative z-10">
            {!isMobileOpen && !showAdvanced && (
                <>
                    <div className="flex-1"></div>
                    <div className="inline-flex items-center justify-center bg-card border border-border rounded-full shadow-sm">
                        <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm" className="gap-1.5 h-6 text-[10px] font-medium uppercase tracking-wider rounded-full hover:bg-secondary/50 px-3 text-muted-foreground hover:text-primary">
                                <ChevronDown className="h-3 w-3" /> {t("filters.advancedSearch")}
                            </Button>
                        </CollapsibleTrigger>
                    </div>
                    <div className="flex-1 flex items-center justify-end gap-3">
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={handleReset} 
                            disabled={isDefault}
                            className="h-8 text-xs px-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        >
                            <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                            {t("listings.filters.reset")}
                        </Button>
                        <span className="text-sm font-semibold text-primary bg-primary/10 border border-primary/20 hidden md:inline-flex items-center px-3 py-1.5 rounded-full shadow-sm">
                            {resultCount} {t("filters.results")}
                        </span>
                    </div>
                </>
            )}
        </div>

        <CollapsibleContent className="space-y-6 pt-6 animate-slide-down">
           <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-border/40"></div>
                </div>
           </div>
           
           {/* Section: Caratteristiche */}
           <div className="space-y-4">
             <div className="text-xs font-semibold text-foreground/70 uppercase tracking-wider">Caratteristiche</div>
             
             <div className="grid grid-cols-12 gap-x-4 gap-y-4">
                 <div className="col-span-12 md:col-span-4 lg:col-span-3">
                    <ChipFilter
                        label={t("filters.bodyType")}
                        icon={<Car className="h-3.5 w-3.5" />}
                        options={bodyTypeOptions}
                        value={filters.bodyType}
                        onChange={(v) => handleFilterChange("bodyType", v)}
                        maxRows={2}
                    />
                 </div>
                 <div className="col-span-12 md:col-span-4 lg:col-span-3">
                    <ChipFilter
                        label={t("filters.gearbox")}
                        icon={<Settings className="h-3.5 w-3.5" />}
                        options={availableGearboxes.map(g => ({ label: g, value: g }))}
                        value={filters.gearbox}
                        onChange={(v) => handleFilterChange("gearbox", v)}
                     />
                 </div>

                 <div className="col-span-12 md:col-span-6 lg:col-span-3">
                    <ChipFilter
                        label={t("filters.doors")}
                        icon={<DoorOpen className="h-3.5 w-3.5" />}
                        options={doorFilterOptions}
                        value={filters.doors}
                        onChange={(v) => handleFilterChange("doors", v)}
                        maxRows={2}
                    />
                 </div>

                 <div className="col-span-12 md:col-span-6 lg:col-span-3">
                    <ChipFilter
                        label={t("filters.euroClass")}
                        icon={<Leaf className="h-3.5 w-3.5" />}
                        options={euroClassOptions}
                        value={filters.emissionsClass}
                        onChange={(v) => handleFilterChange("emissionsClass", v)}
                        maxRows={2}
                    />
                 </div>

                 <div className="col-span-12 md:col-span-6 lg:col-span-3">
                    <ChipFilter
                        label={t("filters.color")}
                        icon={<Palette className="h-3.5 w-3.5" />}
                        options={colorOptions}
                        value={filters.color}
                        onChange={(v) => handleFilterChange("color", v)}
                        maxRows={2}
                    />
                 </div>
             </div>
             
             {/* Close Button, Reset Button and Results Count */}
             <div className="flex items-center pt-2 border-t border-border/40">
                 <div className="flex-1"></div>
                 <div className="inline-flex items-center justify-center bg-card border border-border rounded-full shadow-sm">
                     <CollapsibleTrigger asChild>
                         <Button variant="ghost" size="sm" className="gap-1.5 h-6 text-[10px] font-medium uppercase tracking-wider rounded-full hover:bg-secondary/50 px-3 text-muted-foreground hover:text-primary">
                             <ChevronUp className="h-3 w-3" /> {t("filters.closeAdvanced")}
                         </Button>
                     </CollapsibleTrigger>
                 </div>
                 <div className="flex-1 flex items-center justify-end gap-3">
                     <Button 
                         variant="ghost" 
                         size="sm" 
                         onClick={handleReset} 
                         disabled={isDefault}
                         className="h-8 text-xs px-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                     >
                         <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                         {t("listings.filters.reset")}
                     </Button>
                     <span className="text-sm font-semibold text-primary bg-primary/10 border border-primary/20 hidden md:inline-flex items-center px-3 py-1.5 rounded-full shadow-sm">
                         {resultCount} {t("filters.results")}
                     </span>
                 </div>
             </div>
           </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 shadow-sm transition-all duration-200 hover:border-border/80 hover:shadow-md overflow-hidden">
      {/* Header */}
      <div className="flex flex-col gap-2 p-4 pb-2 md:p-5 md:pb-3 border-b border-border/40">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <h2 className="text-base font-semibold flex items-center gap-2 text-foreground/90">
                    <div className="p-1.5 bg-primary/10 rounded-md">
                        <Search className="h-4 w-4 text-primary" />
                    </div>
                    {t("filters.title")}
                </h2>
            </div>
        </div>
        
        {/* Active Filters Row */}
        <div className="hidden md:block min-h-[4px]">
            <ActiveFilters />
        </div>
      </div>

      {/* Desktop Content */}
      <div className="hidden md:block p-4 md:p-5 pt-3">
        <FilterForm />
      </div>

      {/* Mobile Trigger/View */}
      <div className="md:hidden p-4 pt-2">
         {/* Mobile Active Filters Summary */}
         <div className="mb-3">
             <ActiveFilters />
         </div>
         
         {/* Mobile: Visible Filters - Marca, Modello, Price */}
         <div className="space-y-4 mb-4">
             <Select value={filters.make || undefined} onValueChange={(v) => handleFilterChange("make", v)}>
                 <SelectTrigger className="h-10">
                     <div className="flex items-center gap-2 truncate">
                         <Car className="h-3.5 w-3.5 text-muted-foreground" />
                         <SelectValue placeholder={t("filters.brand")} />
                     </div>
                 </SelectTrigger>
                 <SelectContent>{availableMakes.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
             </Select>
             <Select value={filters.model || undefined} onValueChange={(v) => handleFilterChange("model", v)} disabled={!filters.make}>
                 <SelectTrigger className="h-10">
                     <div className="flex items-center gap-2 truncate">
                         <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                         <SelectValue placeholder={t("filters.model")} />
                     </div>
                 </SelectTrigger>
                 <SelectContent>{availableModels.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
             </Select>
             <RangeFilter 
                 label={t("listings.filters.price")} 
                 min={priceRange.min} 
                 max={priceRange.max} 
                 step={500} 
                 unit="€" 
                 minValue={filters.priceMin} 
                 maxValue={filters.priceMax} 
                 onChange={(min, max) => handleRangeChange("priceMin", "priceMax", min, max)} 
             />
         </div>
         
         <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
            <SheetTrigger asChild>
                <div className="w-full flex items-center justify-between gap-3">
                    <div className="inline-flex items-center justify-center bg-card border border-border rounded-full shadow-sm flex-1">
                        <Button variant="ghost" size="sm" className="gap-1.5 h-8 text-[10px] font-medium uppercase tracking-wider rounded-full hover:bg-secondary/50 px-3 text-muted-foreground hover:text-primary w-full">
                            <Filter className="h-3 w-3" />
                            {t("filters.advancedSearch")}
                        </Button>
                    </div>
                    <span className="text-sm font-semibold text-primary bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full shadow-sm">
                        {resultCount} {t("filters.results")}
                    </span>
                </div>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[92vh] flex flex-col p-0 rounded-t-[20px]">
                <SheetHeader className="p-4 border-b pr-12">
                    <SheetTitle className="flex items-center justify-between text-base">
                        {t("filters.title")}
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={handleReset} 
                            disabled={isDefault}
                            className="h-8 text-xs px-2 hover:bg-destructive/10 hover:text-destructive"
                        >
                            <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                            Reset
                        </Button>
                    </SheetTitle>
                </SheetHeader>
                <ScrollArea className="flex-1 p-4 bg-background/50">
                    <div className="pb-24">
                        <div className="space-y-6">
                             {/* Advanced Filters - Fuel Type */}
                             <div className="space-y-3">
                                <Select value={filters.fuelType || undefined} onValueChange={(v) => handleFilterChange("fuelType", v)}>
                                    <SelectTrigger className="h-10">
                                        <div className="flex items-center gap-2 truncate">
                                            <Fuel className="h-3.5 w-3.5 text-muted-foreground" />
                                            <SelectValue placeholder={t("filters.fuel")} />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>{availableFuelTypes.map(f => <SelectItem key={f} value={f}>{translateFuelType(f)}</SelectItem>)}</SelectContent>
                                </Select>
                             </div>
                             <Separator />
                             <div className="space-y-4">
                                <RangeFilter label={t("listings.filters.year")} min={yearRange.min} max={yearRange.max} step={1} minValue={filters.yearFrom} maxValue={filters.yearTo} onChange={(min, max) => handleRangeChange("yearFrom", "yearTo", min, max)} />
                                <RangeFilter label={t("listings.filters.km")} min={mileageRange.min} max={mileageRange.max} step={1000} unit="km" minValue={filters.mileageMin} maxValue={filters.mileageMax} onChange={(min, max) => handleRangeChange("mileageMin", "mileageMax", min, max)} />
                                <RangeFilter label={t("filters.power")} min={powerRange.min} max={powerRange.max} step={10} unit="CV" minValue={filters.powerMin} maxValue={filters.powerMax} onChange={(min, max) => handleRangeChange("powerMin", "powerMax", min, max)} />
                                <RangeFilter label={t("filters.engineFrom").replace(" da", "")} min={engineDisplacementRange.min} max={engineDisplacementRange.max} step={0.1} unit="L" minValue={filters.engineDisplacementMin} maxValue={filters.engineDisplacementMax} onChange={(min, max) => handleRangeChange("engineDisplacementMin", "engineDisplacementMax", min, max)} />
                             </div>
                             <Separator />
                             <div className="space-y-4">
                                <div className="text-xs font-semibold text-foreground/70 uppercase tracking-wider">Caratteristiche</div>
                                <ChipFilter label={t("filters.bodyType")} options={bodyTypeOptions} value={filters.bodyType} onChange={(v) => handleFilterChange("bodyType", v)} />
                                <ChipFilter
                                    label={t("filters.doors")}
                                    icon={<DoorOpen className="h-3.5 w-3.5" />}
                                    options={doorFilterOptions}
                                    value={filters.doors}
                                    onChange={(v) => handleFilterChange("doors", v)}
                                    maxRows={2}
                                />
                                <ChipFilter label={t("filters.gearbox")} options={availableGearboxes.map(g => ({ label: g, value: g }))} value={filters.gearbox} onChange={(v) => handleFilterChange("gearbox", v)} />
                                <ChipFilter label={t("filters.euroClass")} options={euroClassOptions} value={filters.emissionsClass} onChange={(v) => handleFilterChange("emissionsClass", v)} maxRows={2} />
                                <ChipFilter label={t("filters.color")} options={colorOptions} value={filters.color} onChange={(v) => handleFilterChange("color", v)} maxRows={2} />
                             </div>
                        </div>
                    </div>
                </ScrollArea>
                <div className="p-4 border-t bg-background sticky bottom-0 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                     <Button className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg" onClick={() => setIsMobileOpen(false)}>
                        {debouncing ? (
                            <span className="animate-pulse">Aggiornamento...</span>
                        ) : (
                            `Mostra ${resultCount} risultati`
                        )}
                     </Button>
                </div>
            </SheetContent>
         </Sheet>
      </div>
    </div>
  );
}
