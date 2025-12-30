import { useState, useMemo } from "react";
import { Search, RotateCcw, X, Car, FileText, Calendar, Euro, Zap, Gauge, Palette, Fuel, Settings, Leaf, DoorOpen, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VehicleTypeSelector } from "./VehicleTypeSelector";
import { Vehicle, priceMinRanges, priceMaxRanges, years } from "@/data/sampleVehicles";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useLanguage } from "@/contexts/LanguageContext";

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
  fuelType: string;
  gearbox: string;
  mileageMax: string;
  condition: string;
  emissionsClass: string;
  color: string;
  powerMin: string;
  powerMax: string;
  doors: string;
  engineDisplacementMin: string; // in liters (e.g., "1.3", "2.0")
  engineDisplacementMax: string; // in liters
  bodyType: string; // body type/carrozeria
}

const defaultFilters: FilterState = {
  vehicleType: "car",
  make: "",
  model: "",
  priceMin: "",
  priceMax: "",
  yearFrom: "",
  fuelType: "",
  gearbox: "",
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
  const [vehicleType, setVehicleType] = useState("car");
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const mileageRanges = [
    { key: "10000", value: `${t("filters.upTo")} 10.000 km` },
    { key: "30000", value: `${t("filters.upTo")} 30.000 km` },
    { key: "50000", value: `${t("filters.upTo")} 50.000 km` },
    { key: "75000", value: `${t("filters.upTo")} 75.000 km` },
    { key: "100000", value: `${t("filters.upTo")} 100.000 km` },
    { key: "150000", value: `${t("filters.upTo")} 150.000 km` },
    { key: "200000", value: `${t("filters.upTo")} 200.000 km` },
  ];

  const powerMinRanges = [
    { key: "0", value: t("filters.any") },
    { key: "100", value: `${t("filters.from")} 100 CV` },
    { key: "150", value: `${t("filters.from")} 150 CV` },
    { key: "200", value: `${t("filters.from")} 200 CV` },
    { key: "250", value: `${t("filters.from")} 250 CV` },
    { key: "300", value: `${t("filters.from")} 300 CV` },
    { key: "400", value: `${t("filters.from")} 400 CV` },
    { key: "500", value: `${t("filters.from")} 500 CV` },
  ];

  const powerMaxRanges = [
    { key: "100", value: `${t("filters.upTo")} 100 CV` },
    { key: "150", value: `${t("filters.upTo")} 150 CV` },
    { key: "200", value: `${t("filters.upTo")} 200 CV` },
    { key: "250", value: `${t("filters.upTo")} 250 CV` },
    { key: "300", value: `${t("filters.upTo")} 300 CV` },
    { key: "400", value: `${t("filters.upTo")} 400 CV` },
    { key: "500", value: `${t("filters.upTo")} 500 CV` },
    { key: "9999", value: t("filters.any") },
  ];

  const engineDisplacementMinRanges = [
    { key: "0", value: t("filters.any") },
    { key: "1.0", value: `${t("filters.from")} 1.0L` },
    { key: "1.2", value: `${t("filters.from")} 1.2L` },
    { key: "1.3", value: `${t("filters.from")} 1.3L` },
    { key: "1.4", value: `${t("filters.from")} 1.4L` },
    { key: "1.5", value: `${t("filters.from")} 1.5L` },
    { key: "1.6", value: `${t("filters.from")} 1.6L` },
    { key: "1.8", value: `${t("filters.from")} 1.8L` },
    { key: "2.0", value: `${t("filters.from")} 2.0L` },
    { key: "2.5", value: `${t("filters.from")} 2.5L` },
    { key: "3.0", value: `${t("filters.from")} 3.0L` },
    { key: "4.0", value: `${t("filters.from")} 4.0L` },
  ];

  const engineDisplacementMaxRanges = [
    { key: "1.0", value: `${t("filters.upTo")} 1.0L` },
    { key: "1.2", value: `${t("filters.upTo")} 1.2L` },
    { key: "1.3", value: `${t("filters.upTo")} 1.3L` },
    { key: "1.4", value: `${t("filters.upTo")} 1.4L` },
    { key: "1.5", value: `${t("filters.upTo")} 1.5L` },
    { key: "1.6", value: `${t("filters.upTo")} 1.6L` },
    { key: "1.8", value: `${t("filters.upTo")} 1.8L` },
    { key: "2.0", value: `${t("filters.upTo")} 2.0L` },
    { key: "2.5", value: `${t("filters.upTo")} 2.5L` },
    { key: "3.0", value: `${t("filters.upTo")} 3.0L` },
    { key: "4.0", value: `${t("filters.upTo")} 4.0L` },
    { key: "999", value: t("filters.any") },
  ];

  // Extract unique makes from vehicles
  const availableMakes = useMemo(() => {
    const makesSet = new Set<string>();
    vehicles.forEach(v => {
      if (v.make) makesSet.add(v.make);
    });
    return Array.from(makesSet).sort();
  }, [vehicles]);

  // Extract models for the selected make
  const availableModels = useMemo(() => {
    if (!filters.make) return [];
    const modelsSet = new Set<string>();
    vehicles.forEach(v => {
      if (v.make === filters.make && v.model) {
        modelsSet.add(v.model);
      }
    });
    return Array.from(modelsSet).sort();
  }, [filters.make, vehicles]);

  // Extract unique fuel types
  const availableFuelTypes = useMemo(() => {
    const set = new Set<string>();
    vehicles.forEach(v => {
      if (v.fuel_type) set.add(v.fuel_type);
    });
    return Array.from(set).sort();
  }, [vehicles]);

  // Extract unique gearbox types
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

  // Extract unique conditions (vehicle_class)
  const availableConditions = useMemo(() => {
    const set = new Set<string>();
    vehicles.forEach(v => {
      if (v.vehicle_class) set.add(v.vehicle_class);
    });
    return Array.from(set).sort();
  }, [vehicles]);

  // Extract unique emissions classes
  const availableEmissionsClasses = useMemo(() => {
    const set = new Set<string>();
    vehicles.forEach(v => {
      if (v.emissions_class) set.add(v.emissions_class);
    });
    return Array.from(set).sort((a, b) => {
      const numA = parseInt(a.replace(/\D/g, "")) || 0;
      const numB = parseInt(b.replace(/\D/g, "")) || 0;
      return numB - numA;
    });
  }, [vehicles]);

  // Extract unique colors
  const availableColors = useMemo(() => {
    const set = new Set<string>();
    vehicles.forEach(v => {
      if (v.color) {
        const normalized = v.color.charAt(0).toUpperCase() + v.color.slice(1).toLowerCase();
        set.add(normalized);
      }
    });
    return Array.from(set).sort();
  }, [vehicles]);

  // Extract unique door counts
  const availableDoors = useMemo(() => {
    return ["2", "3", "4", "5"];
  }, []);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = {
      ...filters,
      [key]: value
    };
    if (key === "make") {
      newFilters.model = "";
    }
    setFilters(newFilters);
    onSearch(newFilters);
  };

  const handleVehicleTypeChange = (type: string) => {
    setVehicleType(type);
    const newFilters = {
      ...filters,
      vehicleType: type
    };
    setFilters(newFilters);
    onSearch(newFilters);
  };

  const handleReset = () => {
    // Create a fresh copy of defaultFilters to ensure React detects the change
    const resetFilters: FilterState = {
      vehicleType: "car",
      make: "",
      model: "",
      priceMin: "",
      priceMax: "",
      yearFrom: "",
      fuelType: "",
      gearbox: "",
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
    setFilters(resetFilters);
    setVehicleType("car");
    setResetKey(prev => prev + 1); // Force remount of Select components
    onSearch(resetFilters);
  };

  const handleClearFilter = (key: keyof FilterState, e: React.MouseEvent) => {
    e.stopPropagation();
    handleFilterChange(key, "");
  };

  return (
    <div className="filter-section max-w-5xl mx-auto animate-fade-in" key={resetKey}>
      {/* Title */}
      <h2 className="text-lg font-medium text-foreground mb-4 text-center md:text-left">
        {t("filters.title")}
      </h2>

      {/* Main Filters Row - Mobile: Only Marca, Modello, Tipo Di carrozeria, Colore */}
      {/* Desktop: All main filters */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-3">
        {/* Make - Always visible */}
        <div className="relative">
          <Select 
            key={`make-select-${filters.make || 'empty'}`}
            value={filters.make || undefined}
            onValueChange={value => handleFilterChange("make", value)}
          >
            <SelectTrigger className={`relative w-full bg-card ${filters.make ? 'pr-10 [&>svg:last-child]:hidden' : 'pr-3'} pl-9`}>
              <Car className="absolute left-3 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder={t("filters.brand")} />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              {availableMakes.map(make => (
                <SelectItem key={make} value={make}>
                  {make}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {filters.make && (
            <button
              onClick={(e) => handleClearFilter("make", e)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 z-10"
              aria-label={t("filters.removeFilter")}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Model - Always visible */}
        <div className="relative">
          <Select key={`model-select-${filters.model || 'empty'}`} value={filters.model || undefined} onValueChange={value => handleFilterChange("model", value)} disabled={!filters.make || availableModels.length === 0}>
            <SelectTrigger className={`relative w-full bg-card ${filters.model ? 'pr-10 [&>svg:last-child]:hidden' : 'pr-3'} pl-9`}>
              <FileText className="absolute left-3 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder={filters.make ? t("filters.model") : t("filters.selectBrand")} />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              {availableModels.map(model => (
                <SelectItem key={model} value={model}>
                  {model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {filters.model && (
            <button
              onClick={(e) => handleClearFilter("model", e)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 z-10"
              aria-label={t("filters.removeFilter")}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Body Type - Mobile only (visible), Desktop visible in main row */}
        <div className="md:hidden relative">
              <Select key={`bodyType-select-${filters.bodyType || 'empty'}`} value={filters.bodyType || undefined} onValueChange={value => handleFilterChange("bodyType", value)}>
            <SelectTrigger className={`relative w-full bg-card ${filters.bodyType ? 'pr-10 [&>svg:last-child]:hidden' : 'pr-3'} pl-9`}>
              <Car className="absolute left-3 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder={t("filters.bodyType")} />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              <SelectItem value="city_car">{t("body.cityCar")}</SelectItem>
              <SelectItem value="suv">{t("body.suv")}</SelectItem>
              <SelectItem value="van">{t("body.van")}</SelectItem>
              <SelectItem value="cabrio">{t("body.cabrio")}</SelectItem>
              <SelectItem value="monovolume">{t("body.monovolume")}</SelectItem>
              <SelectItem value="berlina">{t("body.berlina")}</SelectItem>
              <SelectItem value="station_wagon">{t("body.stationWagon")}</SelectItem>
              <SelectItem value="coupe">{t("body.coupe")}</SelectItem>
            </SelectContent>
          </Select>
          {filters.bodyType && (
            <button
              onClick={(e) => handleClearFilter("bodyType", e)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 z-10"
              aria-label={t("filters.removeFilter")}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Body Type - Desktop only */}
        <div className="hidden md:block relative">
              <Select key={`bodyType-select-${filters.bodyType || 'empty'}`} value={filters.bodyType || undefined} onValueChange={value => handleFilterChange("bodyType", value)}>
            <SelectTrigger className={`relative w-full bg-card ${filters.bodyType ? 'pr-10 [&>svg:last-child]:hidden' : 'pr-3'} pl-9`}>
              <Car className="absolute left-3 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder={t("filters.bodyType")} />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              <SelectItem value="city_car">{t("body.cityCar")}</SelectItem>
              <SelectItem value="suv">{t("body.suv")}</SelectItem>
              <SelectItem value="van">{t("body.van")}</SelectItem>
              <SelectItem value="cabrio">{t("body.cabrio")}</SelectItem>
              <SelectItem value="monovolume">{t("body.monovolume")}</SelectItem>
              <SelectItem value="berlina">{t("body.berlina")}</SelectItem>
              <SelectItem value="station_wagon">{t("body.stationWagon")}</SelectItem>
              <SelectItem value="coupe">{t("body.coupe")}</SelectItem>
            </SelectContent>
          </Select>
          {filters.bodyType && (
            <button
              onClick={(e) => handleClearFilter("bodyType", e)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 z-10"
              aria-label={t("filters.removeFilter")}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Color - Mobile only (visible), Desktop visible in main row */}
        <div className="md:hidden relative">
              <Select key={`color-select-${filters.color || 'empty'}`} value={filters.color || undefined} onValueChange={value => handleFilterChange("color", value)}>
            <SelectTrigger className={`relative w-full bg-card ${filters.color ? 'pr-10 [&>svg:last-child]:hidden' : 'pr-3'} pl-9`}>
              <Palette className="absolute left-3 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder={t("filters.color")} />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              {availableColors.map(color => (
                <SelectItem key={color} value={color}>
                  {color}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {filters.color && (
            <button
              onClick={(e) => handleClearFilter("color", e)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 z-10"
              aria-label={t("filters.removeFilter")}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Year From - Desktop only */}
        <div className="hidden md:block relative">
          <Select value={filters.yearFrom || undefined} onValueChange={value => handleFilterChange("yearFrom", value)}>
            <SelectTrigger className={`relative w-full bg-card ${filters.yearFrom ? 'pr-10 [&>svg:last-child]:hidden' : 'pr-3'} pl-9`}>
              <Calendar className="absolute left-3 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder={t("filters.yearFrom")} />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              {years.map(year => (
                <SelectItem key={year.key} value={year.key.toString()}>
                  {year.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {filters.yearFrom && (
            <button
              onClick={(e) => handleClearFilter("yearFrom", e)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 z-10"
              aria-label={t("filters.removeFilter")}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Price Min - Desktop only */}
        <div className="hidden md:block relative">
          <Select value={filters.priceMin || undefined} onValueChange={value => handleFilterChange("priceMin", value)}>
            <SelectTrigger className={`relative w-full bg-card ${filters.priceMin ? 'pr-10 [&>svg:last-child]:hidden' : 'pr-3'} pl-9`}>
              <Euro className="absolute left-3 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder={t("filters.priceFrom")} />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              {priceMinRanges.map(range => (
                <SelectItem key={range.key} value={range.key.toString()}>
                  {range.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {filters.priceMin && (
            <button
              onClick={(e) => handleClearFilter("priceMin", e)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 z-10"
              aria-label={t("filters.removeFilter")}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Second Row of Main Filters - Desktop only */}
      <div className="hidden md:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-3">
        {/* Price Max */}
        <div className="relative">
          <Select value={filters.priceMax || undefined} onValueChange={value => handleFilterChange("priceMax", value)}>
            <SelectTrigger className={`relative w-full bg-card ${filters.priceMax ? 'pr-10 [&>svg:last-child]:hidden' : 'pr-3'} pl-9`}>
              <Euro className="absolute left-3 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder={t("filters.priceTo")} />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              {priceMaxRanges.map(range => (
                <SelectItem key={range.key} value={range.key.toString()}>
                  {range.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {filters.priceMax && (
            <button
              onClick={(e) => handleClearFilter("priceMax", e)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 z-10"
              aria-label={t("filters.removeFilter")}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Power Min */}
        <div className="relative">
          <Select value={filters.powerMin || undefined} onValueChange={value => handleFilterChange("powerMin", value)}>
            <SelectTrigger className={`relative w-full bg-card ${filters.powerMin ? 'pr-10 [&>svg:last-child]:hidden' : 'pr-3'} pl-9`}>
              <Zap className="absolute left-3 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder={t("filters.powerFrom")} />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              {powerMinRanges.map(range => (
                <SelectItem key={range.key} value={range.key}>
                  {range.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {filters.powerMin && (
            <button
              onClick={(e) => handleClearFilter("powerMin", e)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 z-10"
              aria-label={t("filters.removeFilter")}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Power Max */}
        <div className="relative">
          <Select value={filters.powerMax || undefined} onValueChange={value => handleFilterChange("powerMax", value)}>
            <SelectTrigger className={`relative w-full bg-card ${filters.powerMax ? 'pr-10 [&>svg:last-child]:hidden' : 'pr-3'} pl-9`}>
              <Zap className="absolute left-3 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder={t("filters.powerTo")} />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              {powerMaxRanges.map(range => (
                <SelectItem key={range.key} value={range.key}>
                  {range.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {filters.powerMax && (
            <button
              onClick={(e) => handleClearFilter("powerMax", e)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 z-10"
              aria-label={t("filters.removeFilter")}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Mileage Max */}
        <div className="relative">
          <Select value={filters.mileageMax || undefined} onValueChange={value => handleFilterChange("mileageMax", value)}>
            <SelectTrigger className={`relative w-full bg-card ${filters.mileageMax ? 'pr-10 [&>svg:last-child]:hidden' : 'pr-3'} pl-9`}>
              <Activity className="absolute left-3 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder={t("filters.maxKm")} />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              {mileageRanges.map(range => (
                <SelectItem key={range.key} value={range.key}>
                  {range.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {filters.mileageMax && (
            <button
              onClick={(e) => handleClearFilter("mileageMax", e)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 z-10"
              aria-label={t("filters.removeFilter")}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Color - Desktop */}
        <div className="relative">
              <Select key={`color-select-${filters.color || 'empty'}`} value={filters.color || undefined} onValueChange={value => handleFilterChange("color", value)}>
            <SelectTrigger className={`relative w-full bg-card ${filters.color ? 'pr-10 [&>svg:last-child]:hidden' : 'pr-3'} pl-9`}>
              <Palette className="absolute left-3 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder={t("filters.color")} />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              {availableColors.map(color => (
                <SelectItem key={color} value={color}>
                  {color}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {filters.color && (
            <button
              onClick={(e) => handleClearFilter("color", e)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 z-10"
              aria-label={t("filters.removeFilter")}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Desktop Search Button, Reset, and Advanced Search - Same row */}
      <Collapsible open={showMoreFilters} onOpenChange={setShowMoreFilters} className="w-full">
        <div className="hidden md:flex items-center gap-2 mb-3 relative">
          {/* Left side: empty space */}
          <div className="flex-1"></div>
          {/* Center: RICERCA AVANZATA button - Only shown when advanced search is closed */}
          {!showMoreFilters && (
            <div className="flex-1 flex justify-center">
              <CollapsibleTrigger asChild>
                <button
                  className="flex items-center justify-center gap-1.5 text-primary text-xs font-medium hover:opacity-80 transition-opacity py-1"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="4" y1="6" x2="20" y2="6" />
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <line x1="4" y1="18" x2="20" y2="18" />
                    <circle cx="8" cy="6" r="2" fill="currentColor" />
                    <circle cx="16" cy="12" r="2" fill="currentColor" />
                    <circle cx="10" cy="18" r="2" fill="currentColor" />
                  </svg>
                  {t("filters.advancedSearch")}
                </button>
              </CollapsibleTrigger>
            </div>
          )}
          {/* Right side: Risultati and Resetta filtri buttons - Only shown when advanced search is closed */}
          <div className="flex-1 flex justify-end gap-2">
            {!showMoreFilters && (
              <>
                <Button onClick={() => onSearch(filters)} className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
                  <Search className="w-4 h-4 mr-2" />
                  {resultCount.toLocaleString(language === "it" ? "it-IT" : "en-US")} {t("filters.results")}
                </Button>
                <Button onClick={handleReset} variant="outline" className="text-muted-foreground hover:text-foreground">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  {t("listings.filters.reset")}
                </Button>
              </>
            )}
          </div>
        </div>
        
        {/* Mobile: More Filters Toggle - Centered */}
        <div className="flex md:hidden justify-center mb-3">
          <CollapsibleTrigger asChild>
            <button
              className="flex items-center justify-center gap-1.5 text-primary text-xs font-medium hover:opacity-80 transition-opacity py-1"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="18" x2="20" y2="18" />
                <circle cx="8" cy="6" r="2" fill="currentColor" />
                <circle cx="16" cy="12" r="2" fill="currentColor" />
                <circle cx="10" cy="18" r="2" fill="currentColor" />
              </svg>
              {showMoreFilters ? t("filters.closeAdvanced") : t("filters.advancedSearch")}
            </button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent>
          {/* Mobile: All filters except Marca, Modello, Tipo Di carrozeria, Colore */}
          {/* Desktop: Only advanced filters (unchanged) */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-3">
            {/* Year From - Mobile only (in advanced), Desktop visible in main */}
            <div className="md:hidden relative">
              <Select key={`yearFrom-select-${filters.yearFrom || 'empty'}`} value={filters.yearFrom || undefined} onValueChange={value => handleFilterChange("yearFrom", value)}>
                <SelectTrigger className={`relative w-full bg-card ${filters.yearFrom ? 'pr-10 [&>svg:last-child]:hidden' : 'pr-3'} pl-9`}>
                  <Calendar className="absolute left-3 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder={t("filters.yearFrom")} />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  <SelectItem value="_clear" className="text-muted-foreground">{t("filters.removeFilter")}</SelectItem>
                  {years.map(year => (
                    <SelectItem key={year.key} value={year.key.toString()}>
                      {year.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {filters.yearFrom && (
                <button
                  onClick={(e) => handleClearFilter("yearFrom", e)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 z-10"
                  aria-label={t("filters.removeFilter")}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Price Min - Mobile only (in advanced), Desktop visible in main */}
            <div className="md:hidden relative">
              <Select key={`priceMin-select-${filters.priceMin || 'empty'}`} value={filters.priceMin || undefined} onValueChange={value => handleFilterChange("priceMin", value)}>
                <SelectTrigger className={`relative w-full bg-card ${filters.priceMin ? 'pr-10 [&>svg:last-child]:hidden' : 'pr-3'} pl-9`}>
                  <Euro className="absolute left-3 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder={t("filters.priceFrom")} />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  <SelectItem value="_clear" className="text-muted-foreground">{t("filters.removeFilter")}</SelectItem>
                  {priceMinRanges.map(range => (
                    <SelectItem key={range.key} value={range.key.toString()}>
                      {range.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {filters.priceMin && (
                <button
                  onClick={(e) => handleClearFilter("priceMin", e)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 z-10"
                  aria-label={t("filters.removeFilter")}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Price Max - Mobile only (in advanced), Desktop visible in main */}
            <div className="md:hidden relative">
              <Select key={`priceMax-select-${filters.priceMax || 'empty'}`} value={filters.priceMax || undefined} onValueChange={value => handleFilterChange("priceMax", value)}>
                <SelectTrigger className={`relative w-full bg-card ${filters.priceMax ? 'pr-10 [&>svg:last-child]:hidden' : 'pr-3'} pl-9`}>
                  <Euro className="absolute left-3 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder={t("filters.priceTo")} />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  <SelectItem value="_clear" className="text-muted-foreground">{t("filters.removeFilter")}</SelectItem>
                  {priceMaxRanges.map(range => (
                    <SelectItem key={range.key} value={range.key.toString()}>
                      {range.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {filters.priceMax && (
                <button
                  onClick={(e) => handleClearFilter("priceMax", e)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 z-10"
                  aria-label={t("filters.removeFilter")}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Power Min - Mobile only (in advanced), Desktop visible in main */}
            <div className="md:hidden relative">
              <Select key={`powerMin-select-${filters.powerMin || 'empty'}`} value={filters.powerMin || undefined} onValueChange={value => handleFilterChange("powerMin", value)}>
                <SelectTrigger className={`relative w-full bg-card ${filters.powerMin ? 'pr-10 [&>svg:last-child]:hidden' : 'pr-3'} pl-9`}>
                  <Zap className="absolute left-3 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder={t("filters.powerFrom")} />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  <SelectItem value="_clear" className="text-muted-foreground">{t("filters.removeFilter")}</SelectItem>
                  {powerMinRanges.map(range => (
                    <SelectItem key={range.key} value={range.key}>
                      {range.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {filters.powerMin && (
                <button
                  onClick={(e) => handleClearFilter("powerMin", e)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 z-10"
                  aria-label={t("filters.removeFilter")}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Power Max - Mobile only (in advanced), Desktop visible in main */}
            <div className="md:hidden relative">
              <Select key={`powerMax-select-${filters.powerMax || 'empty'}`} value={filters.powerMax || undefined} onValueChange={value => handleFilterChange("powerMax", value)}>
                <SelectTrigger className={`relative w-full bg-card ${filters.powerMax ? 'pr-10 [&>svg:last-child]:hidden' : 'pr-3'} pl-9`}>
                  <Zap className="absolute left-3 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder={t("filters.powerTo")} />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  <SelectItem value="_clear" className="text-muted-foreground">{t("filters.removeFilter")}</SelectItem>
                  {powerMaxRanges.map(range => (
                    <SelectItem key={range.key} value={range.key}>
                      {range.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {filters.powerMax && (
                <button
                  onClick={(e) => handleClearFilter("powerMax", e)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 z-10"
                  aria-label={t("filters.removeFilter")}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Mileage Max - Mobile only (in advanced), Desktop visible in main */}
            <div className="md:hidden relative">
              <Select key={`mileageMax-select-${filters.mileageMax || 'empty'}`} value={filters.mileageMax || undefined} onValueChange={value => handleFilterChange("mileageMax", value)}>
                <SelectTrigger className={`relative w-full bg-card ${filters.mileageMax ? 'pr-10 [&>svg:last-child]:hidden' : 'pr-3'} pl-9`}>
                  <Activity className="absolute left-3 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder={t("filters.maxKm")} />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  <SelectItem value="_clear" className="text-muted-foreground">{t("filters.removeFilter")}</SelectItem>
                  {mileageRanges.map(range => (
                    <SelectItem key={range.key} value={range.key}>
                      {range.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {filters.mileageMax && (
                <button
                  onClick={(e) => handleClearFilter("mileageMax", e)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 z-10"
                  aria-label={t("filters.removeFilter")}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Fuel Type - Always in advanced */}
            <div className="relative">
              <Select key={`fuelType-select-${filters.fuelType || 'empty'}`} value={filters.fuelType || undefined} onValueChange={value => handleFilterChange("fuelType", value)}>
                <SelectTrigger className={`relative w-full bg-card ${filters.fuelType ? 'pr-10 [&>svg:last-child]:hidden' : 'pr-3'} pl-9`}>
                  <Fuel className="absolute left-3 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder={t("filters.fuel")} />
                </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              {availableFuelTypes.map(fuel => (
                    <SelectItem key={fuel} value={fuel}>
                      {translateFuelType(fuel)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {filters.fuelType && (
                <button
                  onClick={(e) => handleClearFilter("fuelType", e)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 z-10"
                  aria-label={t("filters.removeFilter")}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Gearbox - Always in advanced */}
            <div className="relative">
              <Select key={`gearbox-select-${filters.gearbox || 'empty'}`} value={filters.gearbox || undefined} onValueChange={value => handleFilterChange("gearbox", value)}>
                <SelectTrigger className={`relative w-full bg-card ${filters.gearbox ? 'pr-10 [&>svg:last-child]:hidden' : 'pr-3'} pl-9`}>
                  <Settings className="absolute left-3 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder={t("filters.gearbox")} />
                </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              {availableGearboxes.map(gearbox => (
                    <SelectItem key={gearbox} value={gearbox}>
                      {gearbox}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {filters.gearbox && (
                <button
                  onClick={(e) => handleClearFilter("gearbox", e)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 z-10"
                  aria-label={t("filters.removeFilter")}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Condition - Hidden (not used) */}
            <div className="hidden">
              <Select key={`condition-select-${filters.condition || 'empty'}`} value={filters.condition || undefined} onValueChange={value => handleFilterChange("condition", value)}>
                <SelectTrigger className="w-full bg-card">
                  <SelectValue placeholder={t("filters.condition")} />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  <SelectItem value="_clear" className="text-muted-foreground">{t("filters.removeFilter")}</SelectItem>
                  {availableConditions.map(condition => (
                    <SelectItem key={condition} value={condition}>
                      {condition}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Emissions Class - Always in advanced */}
            <div className="relative">
              <Select key={`emissionsClass-select-${filters.emissionsClass || 'empty'}`} value={filters.emissionsClass || undefined} onValueChange={value => handleFilterChange("emissionsClass", value)}>
                <SelectTrigger className={`relative w-full bg-card ${filters.emissionsClass ? 'pr-10 [&>svg:last-child]:hidden' : 'pr-3'} pl-9`}>
                  <Leaf className="absolute left-3 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder={t("filters.euroClass")} />
                </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              {availableEmissionsClasses.map(ec => (
                    <SelectItem key={ec} value={ec}>
                      {ec}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {filters.emissionsClass && (
                <button
                  onClick={(e) => handleClearFilter("emissionsClass", e)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 z-10"
                  aria-label={t("filters.removeFilter")}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Engine Displacement Max - Always in advanced */}
            <div className="relative">
              <Select key={`engineDisplacementMax-select-${filters.engineDisplacementMax || 'empty'}`} value={filters.engineDisplacementMax || undefined} onValueChange={value => handleFilterChange("engineDisplacementMax", value)}>
                <SelectTrigger className={`relative w-full bg-card ${filters.engineDisplacementMax ? 'pr-10 [&>svg:last-child]:hidden' : 'pr-3'} pl-9`}>
                  <Gauge className="absolute left-3 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder={t("filters.engineTo")} />
                </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              {engineDisplacementMaxRanges.map(range => (
                    <SelectItem key={range.key} value={range.key}>
                      {range.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {filters.engineDisplacementMax && (
                <button
                  onClick={(e) => handleClearFilter("engineDisplacementMax", e)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 z-10"
                  aria-label={t("filters.removeFilter")}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Engine Displacement Min - Always in advanced */}
            <div className="relative">
              <Select key={`engineDisplacementMin-select-${filters.engineDisplacementMin || 'empty'}`} value={filters.engineDisplacementMin || undefined} onValueChange={value => handleFilterChange("engineDisplacementMin", value)}>
                <SelectTrigger className={`relative w-full bg-card ${filters.engineDisplacementMin ? 'pr-10 [&>svg:last-child]:hidden' : 'pr-3'} pl-9`}>
                  <Gauge className="absolute left-3 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder={t("filters.engineFrom")} />
                </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              {engineDisplacementMinRanges.map(range => (
                    <SelectItem key={range.key} value={range.key}>
                      {range.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {filters.engineDisplacementMin && (
                <button
                  onClick={(e) => handleClearFilter("engineDisplacementMin", e)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 z-10"
                  aria-label={t("filters.removeFilter")}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Second Row of Advanced Filters - N° Porte alone */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-3">
            {/* Doors - Always in advanced */}
            <div className="relative">
              <Select key={`doors-select-${filters.doors || 'empty'}`} value={filters.doors || undefined} onValueChange={value => handleFilterChange("doors", value)}>
                <SelectTrigger className={`relative w-full bg-card ${filters.doors ? 'pr-10 [&>svg:last-child]:hidden' : 'pr-3'} pl-9`}>
                  <DoorOpen className="absolute left-3 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder={t("filters.doors")} />
                </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              {availableDoors.map(doors => (
                    <SelectItem key={doors} value={doors}>
                      {doors} {language === "it" ? "porte" : "doors"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {filters.doors && (
                <button
                  onClick={(e) => handleClearFilter("doors", e)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 z-10"
                  aria-label={t("filters.removeFilter")}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
          
          {/* Desktop: RICERCA AVANZATA, Risultati and Resetta filtri buttons - Shown when advanced search is open */}
          <div className="hidden md:flex items-center gap-2 mt-3 relative">
            {/* Left side: empty space */}
            <div className="flex-1"></div>
            {/* Center: CHIUDI RICERCA AVANZATA button */}
            <div className="flex-1 flex justify-center">
              <CollapsibleTrigger asChild>
                <button
                  className="flex items-center justify-center gap-1.5 text-primary text-xs font-medium hover:opacity-80 transition-opacity py-1"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="4" y1="6" x2="20" y2="6" />
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <line x1="4" y1="18" x2="20" y2="18" />
                    <circle cx="8" cy="6" r="2" fill="currentColor" />
                    <circle cx="16" cy="12" r="2" fill="currentColor" />
                    <circle cx="10" cy="18" r="2" fill="currentColor" />
                  </svg>
                  {t("filters.closeAdvanced")}
                </button>
              </CollapsibleTrigger>
            </div>
            {/* Right side: Risultati and Resetta filtri buttons */}
            <div className="flex-1 flex justify-end gap-2">
              <Button onClick={() => onSearch(filters)} className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
                <Search className="w-4 h-4 mr-2" />
                {resultCount.toLocaleString(language === "it" ? "it-IT" : "en-US")} {t("filters.results")}
              </Button>
              <Button onClick={handleReset} variant="outline" className="text-muted-foreground hover:text-foreground">
                <RotateCcw className="w-4 h-4 mr-2" />
                {t("listings.filters.reset")}
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Mobile Search Button and Reset */}
      <div className="md:hidden flex gap-2">
        <Button onClick={() => onSearch(filters)} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
          <Search className="w-4 h-4 mr-2" />
          {resultCount.toLocaleString(language === "it" ? "it-IT" : "en-US")} {t("filters.results")}
        </Button>
        <Button onClick={handleReset} variant="outline" className="text-muted-foreground hover:text-foreground">
          <RotateCcw className="w-4 h-4 mr-2" />
          {t("listings.filters.reset")}
        </Button>
      </div>
    </div>
  );
}
