import { useState, useMemo } from "react";
import { Search, RotateCcw } from "lucide-react";
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
  const { t, language } = useLanguage();
  const [vehicleType, setVehicleType] = useState("car");
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [showMoreFilters, setShowMoreFilters] = useState(false);

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
    setFilters(defaultFilters);
    setVehicleType("car");
    onSearch(defaultFilters);
  };

  return (
    <div className="filter-section max-w-5xl mx-auto animate-fade-in">
      {/* Title */}
      <h2 className="text-lg font-medium text-foreground mb-4 text-center md:text-left">
        {t("filters.title")}
      </h2>

      {/* Main Filters Row - Mobile: Only Marca, Modello, Tipo Di carrozeria, Colore */}
      {/* Desktop: All main filters */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-3">
        {/* Make - Always visible */}
        <Select value={filters.make || undefined} onValueChange={value => handleFilterChange("make", value === "_clear" ? "" : value)}>
          <SelectTrigger className="w-full bg-card">
            <SelectValue placeholder={t("filters.brand")} />
          </SelectTrigger>
          <SelectContent className="bg-popover z-50">
            <SelectItem value="_clear" className="text-muted-foreground">{t("filters.removeFilter")}</SelectItem>
            {availableMakes.map(make => (
              <SelectItem key={make} value={make}>
                {make}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Model - Always visible */}
        <Select value={filters.model || undefined} onValueChange={value => handleFilterChange("model", value === "_clear" ? "" : value)} disabled={!filters.make || availableModels.length === 0}>
          <SelectTrigger className="w-full bg-card">
            <SelectValue placeholder={filters.make ? t("filters.model") : t("filters.selectBrand")} />
          </SelectTrigger>
          <SelectContent className="bg-popover z-50">
            <SelectItem value="_clear" className="text-muted-foreground">{t("filters.removeFilter")}</SelectItem>
            {availableModels.map(model => (
              <SelectItem key={model} value={model}>
                {model}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Body Type - Mobile only (visible), Desktop visible in main row */}
        <div className="md:hidden">
          <Select value={filters.bodyType || undefined} onValueChange={value => handleFilterChange("bodyType", value === "_clear" ? "" : value)}>
            <SelectTrigger className="w-full bg-card">
              <SelectValue placeholder={t("filters.bodyType")} />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              <SelectItem value="_clear" className="text-muted-foreground">{t("filters.removeFilter")}</SelectItem>
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
        </div>

        {/* Body Type - Desktop only */}
        <div className="hidden md:block">
          <Select value={filters.bodyType || undefined} onValueChange={value => handleFilterChange("bodyType", value === "_clear" ? "" : value)}>
            <SelectTrigger className="w-full bg-card">
              <SelectValue placeholder={t("filters.bodyType")} />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              <SelectItem value="_clear" className="text-muted-foreground">{t("filters.removeFilter")}</SelectItem>
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
        </div>

        {/* Color - Mobile only (visible), Desktop visible in main row */}
        <div className="md:hidden">
          <Select value={filters.color || undefined} onValueChange={value => handleFilterChange("color", value === "_clear" ? "" : value)}>
            <SelectTrigger className="w-full bg-card">
              <SelectValue placeholder={t("filters.color")} />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              <SelectItem value="_clear" className="text-muted-foreground">{t("filters.removeFilter")}</SelectItem>
              {availableColors.map(color => (
                <SelectItem key={color} value={color}>
                  {color}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Year From - Desktop only */}
        <div className="hidden md:block">
          <Select value={filters.yearFrom || undefined} onValueChange={value => handleFilterChange("yearFrom", value === "_clear" ? "" : value)}>
            <SelectTrigger className="w-full bg-card">
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
        </div>

        {/* Price Min - Desktop only */}
        <div className="hidden md:block">
          <Select value={filters.priceMin || undefined} onValueChange={value => handleFilterChange("priceMin", value === "_clear" ? "" : value)}>
            <SelectTrigger className="w-full bg-card">
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
        </div>
      </div>

      {/* Second Row of Main Filters - Desktop only */}
      <div className="hidden md:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-3">
        {/* Price Max */}
        <Select value={filters.priceMax || undefined} onValueChange={value => handleFilterChange("priceMax", value === "_clear" ? "" : value)}>
          <SelectTrigger className="w-full bg-card">
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

        {/* Power Min */}
        <Select value={filters.powerMin || undefined} onValueChange={value => handleFilterChange("powerMin", value === "_clear" ? "" : value)}>
          <SelectTrigger className="w-full bg-card">
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

        {/* Power Max */}
        <Select value={filters.powerMax || undefined} onValueChange={value => handleFilterChange("powerMax", value === "_clear" ? "" : value)}>
          <SelectTrigger className="w-full bg-card">
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

        {/* Mileage Max */}
        <Select value={filters.mileageMax || undefined} onValueChange={value => handleFilterChange("mileageMax", value === "_clear" ? "" : value)}>
          <SelectTrigger className="w-full bg-card">
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

        {/* Color - Desktop */}
        <Select value={filters.color || undefined} onValueChange={value => handleFilterChange("color", value === "_clear" ? "" : value)}>
          <SelectTrigger className="w-full bg-card">
            <SelectValue placeholder={t("filters.color")} />
          </SelectTrigger>
          <SelectContent className="bg-popover z-50">
            <SelectItem value="_clear" className="text-muted-foreground">{t("filters.removeFilter")}</SelectItem>
            {availableColors.map(color => (
              <SelectItem key={color} value={color}>
                {color}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Desktop Search Button Row */}
      <div className="hidden md:block mb-3">
        <Button onClick={() => onSearch(filters)} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
          <Search className="w-4 h-4 mr-2" />
          {resultCount.toLocaleString(language === "it" ? "it-IT" : "en-US")} {t("filters.results")}
        </Button>
      </div>

      {/* More Filters Toggle - Centered */}
      <Collapsible open={showMoreFilters} onOpenChange={setShowMoreFilters} className="w-full">
        <div className="flex justify-center mb-3">
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
            <div className="md:hidden">
              <Select value={filters.yearFrom || undefined} onValueChange={value => handleFilterChange("yearFrom", value === "_clear" ? "" : value)}>
                <SelectTrigger className="w-full bg-card">
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
            </div>

            {/* Price Min - Mobile only (in advanced), Desktop visible in main */}
            <div className="md:hidden">
              <Select value={filters.priceMin || undefined} onValueChange={value => handleFilterChange("priceMin", value === "_clear" ? "" : value)}>
                <SelectTrigger className="w-full bg-card">
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
            </div>

            {/* Price Max - Mobile only (in advanced), Desktop visible in main */}
            <div className="md:hidden">
              <Select value={filters.priceMax || undefined} onValueChange={value => handleFilterChange("priceMax", value === "_clear" ? "" : value)}>
                <SelectTrigger className="w-full bg-card">
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
            </div>

            {/* Power Min - Mobile only (in advanced), Desktop visible in main */}
            <div className="md:hidden">
              <Select value={filters.powerMin || undefined} onValueChange={value => handleFilterChange("powerMin", value === "_clear" ? "" : value)}>
                <SelectTrigger className="w-full bg-card">
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
            </div>

            {/* Power Max - Mobile only (in advanced), Desktop visible in main */}
            <div className="md:hidden">
              <Select value={filters.powerMax || undefined} onValueChange={value => handleFilterChange("powerMax", value === "_clear" ? "" : value)}>
                <SelectTrigger className="w-full bg-card">
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
            </div>

            {/* Mileage Max - Mobile only (in advanced), Desktop visible in main */}
            <div className="md:hidden">
              <Select value={filters.mileageMax || undefined} onValueChange={value => handleFilterChange("mileageMax", value === "_clear" ? "" : value)}>
                <SelectTrigger className="w-full bg-card">
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
            </div>

            {/* Fuel Type - Always in advanced */}
            <Select value={filters.fuelType || undefined} onValueChange={value => handleFilterChange("fuelType", value === "_clear" ? "" : value)}>
              <SelectTrigger className="w-full bg-card">
                <SelectValue placeholder={t("filters.fuel")} />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                <SelectItem value="_clear" className="text-muted-foreground">{t("filters.removeFilter")}</SelectItem>
                {availableFuelTypes.map(fuel => (
                  <SelectItem key={fuel} value={fuel}>
                    {fuel}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Gearbox - Always in advanced */}
            <Select value={filters.gearbox || undefined} onValueChange={value => handleFilterChange("gearbox", value === "_clear" ? "" : value)}>
              <SelectTrigger className="w-full bg-card">
                <SelectValue placeholder={t("filters.gearbox")} />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                <SelectItem value="_clear" className="text-muted-foreground">{t("filters.removeFilter")}</SelectItem>
                {availableGearboxes.map(gearbox => (
                  <SelectItem key={gearbox} value={gearbox}>
                    {gearbox}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Condition - Hidden (not used) */}
            <div className="hidden">
              <Select value={filters.condition || undefined} onValueChange={value => handleFilterChange("condition", value === "_clear" ? "" : value)}>
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
            <Select value={filters.emissionsClass || undefined} onValueChange={value => handleFilterChange("emissionsClass", value === "_clear" ? "" : value)}>
              <SelectTrigger className="w-full bg-card">
                <SelectValue placeholder={t("filters.euroClass")} />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                <SelectItem value="_clear" className="text-muted-foreground">{t("filters.removeFilter")}</SelectItem>
                {availableEmissionsClasses.map(ec => (
                  <SelectItem key={ec} value={ec}>
                    {ec}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Doors - Always in advanced */}
            <Select value={filters.doors || undefined} onValueChange={value => handleFilterChange("doors", value === "_clear" ? "" : value)}>
              <SelectTrigger className="w-full bg-card">
                <SelectValue placeholder={t("filters.doors")} />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                <SelectItem value="_clear" className="text-muted-foreground">{t("filters.removeFilter")}</SelectItem>
                {availableDoors.map(doors => (
                  <SelectItem key={doors} value={doors}>
                    {doors} {language === "it" ? "porte" : "doors"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Second Row of Advanced Filters */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-3">
            {/* Engine Displacement Min - Always in advanced */}
            <Select value={filters.engineDisplacementMin || undefined} onValueChange={value => handleFilterChange("engineDisplacementMin", value === "_clear" ? "" : value)}>
              <SelectTrigger className="w-full bg-card">
                <SelectValue placeholder={t("filters.engineFrom")} />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                <SelectItem value="_clear" className="text-muted-foreground">{t("filters.removeFilter")}</SelectItem>
                {engineDisplacementMinRanges.map(range => (
                  <SelectItem key={range.key} value={range.key}>
                    {range.value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Engine Displacement Max - Always in advanced */}
            <Select value={filters.engineDisplacementMax || undefined} onValueChange={value => handleFilterChange("engineDisplacementMax", value === "_clear" ? "" : value)}>
              <SelectTrigger className="w-full bg-card">
                <SelectValue placeholder={t("filters.engineTo")} />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                <SelectItem value="_clear" className="text-muted-foreground">{t("filters.removeFilter")}</SelectItem>
                {engineDisplacementMaxRanges.map(range => (
                  <SelectItem key={range.key} value={range.key}>
                    {range.value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Empty space for alignment */}
            <div></div>
            <div></div>
            <div></div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Mobile Search Button */}
      <div className="md:hidden">
        <Button onClick={() => onSearch(filters)} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
          <Search className="w-4 h-4 mr-2" />
          {resultCount.toLocaleString(language === "it" ? "it-IT" : "en-US")} {t("filters.results")}
        </Button>
      </div>
    </div>
  );
}
