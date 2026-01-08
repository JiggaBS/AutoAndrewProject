import { useState, useMemo } from "react";
import { Search, RotateCcw, Car, FileText, Fuel, Calendar, Euro, Gauge, Zap, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { RangeFilterDark } from "./RangeFilterDark";
import { useFilterStore } from "@/lib/stores/filter-store";
import { cn } from "@/lib/utils";
import type { FacetCounts } from "./filter-sidebar";

interface FilterCardDarkProps {
  facets: FacetCounts;
  resultCount?: number;
  onSearch?: () => void;
  translations?: {
    searchPlaceholder?: string;
    make?: string;
    model?: string;
    fuel?: string;
    price?: string;
    year?: string;
    mileage?: string;
    power?: string;
    displacement?: string;
    advancedSearch?: string;
    resetFilters?: string;
    results?: string;
  };
}

export function FilterCardDark({ 
  facets, 
  resultCount = 0,
  onSearch,
  translations = {} 
}: FilterCardDarkProps) {
  const t = translations;
  const filters = useFilterStore();
  const [searchQuery, setSearchQuery] = useState("");

  // Compute ranges from facets or use defaults
  const priceRange = useMemo(() => {
    // You can compute this from actual vehicle data
    return { min: 0, max: 200000 };
  }, []);

  const yearRange = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return { min: 2000, max: currentYear };
  }, []);

  const mileageRange = useMemo(() => {
    return { min: 0, max: 300000 };
  }, []);

  const powerRange = useMemo(() => {
    return { min: 50, max: 600 };
  }, []);

  const displacementRange = useMemo(() => {
    return { min: 0.9, max: 3.0 };
  }, []);


  return (
    <div className="bg-[#1a1a1a] rounded-xl p-6 shadow-lg border border-[#2a2a2a]">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#888]" />
          <Input
            type="text"
            placeholder={t.searchPlaceholder || "Trova veicoli usati e nuovi"}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-[#2a2a2a] border-[#3a3a3a] text-white placeholder:text-[#888] focus:border-[#ff6b35] focus:ring-[#ff6b35]"
          />
        </div>
      </div>

      {/* First Row: Dropdowns + Price Slider */}
      <div className="grid grid-cols-12 gap-4 mb-6">
        {/* Make */}
        <div className="col-span-12 md:col-span-3">
          <Select
            value={filters.make || undefined}
            onValueChange={(v) => filters.setMake(v)}
          >
            <SelectTrigger className="bg-[#2a2a2a] border-[#3a3a3a] text-white hover:border-[#ff6b35]">
              <div className="flex items-center gap-2">
                <Car className="h-4 w-4 text-[#ff6b35]" />
                <SelectValue placeholder={t.make || "Marca"} />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-[#2a2a2a] border-[#3a3a3a]">
              {facets.makes.map((m) => (
                <SelectItem 
                  key={m.value} 
                  value={m.value}
                  className="text-white focus:bg-[#ff6b35] focus:text-white"
                >
                  {m.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Model */}
        <div className="col-span-12 md:col-span-3">
          <Select
            value={filters.model || undefined}
            onValueChange={(v) => filters.setModel(v)}
            disabled={!filters.make}
          >
            <SelectTrigger className="bg-[#2a2a2a] border-[#3a3a3a] text-white hover:border-[#ff6b35] disabled:opacity-50">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#ff6b35]" />
                <SelectValue placeholder={t.model || "Modello"} />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-[#2a2a2a] border-[#3a3a3a]">
              {facets.models.map((m) => (
                <SelectItem 
                  key={m.value} 
                  value={m.value}
                  className="text-white focus:bg-[#ff6b35] focus:text-white"
                >
                  {m.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Fuel */}
        <div className="col-span-12 md:col-span-3">
          <Select
            value={filters.fuels[0] || undefined}
            onValueChange={(v) => {
              filters.toggleFuel(v);
            }}
          >
            <SelectTrigger className="bg-[#2a2a2a] border-[#3a3a3a] text-white hover:border-[#ff6b35]">
              <div className="flex items-center gap-2">
                <Fuel className="h-4 w-4 text-[#ff6b35]" />
                <SelectValue placeholder={t.fuel || "Carburante"} />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-[#2a2a2a] border-[#3a3a3a]">
              {facets.fuels.map((f) => (
                <SelectItem 
                  key={f.value} 
                  value={f.value}
                  className="text-white focus:bg-[#ff6b35] focus:text-white"
                >
                  {f.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Slider */}
        <div className="col-span-12 md:col-span-3">
          <RangeFilterDark
            label={t.price || "Prezzo"}
            icon={<Euro className="h-4 w-4" />}
            min={priceRange.min}
            max={priceRange.max}
            step={500}
            unit="€"
            minValue={filters.priceMin?.toString() || priceRange.min.toString()}
            maxValue={filters.priceMax?.toString() || priceRange.max.toString()}
            onChange={(min, max) => {
              const minVal = min === priceRange.min.toString() ? null : parseInt(min);
              const maxVal = max === priceRange.max.toString() ? null : parseInt(max);
              filters.setPriceRange(minVal, maxVal);
            }}
          />
        </div>
      </div>

      {/* Second Row: Range Sliders */}
      <div className="grid grid-cols-12 gap-4 mb-6">
        {/* Year */}
        <div className="col-span-12 md:col-span-3">
          <RangeFilterDark
            label={t.year || "Anno"}
            icon={<Calendar className="h-4 w-4" />}
            min={yearRange.min}
            max={yearRange.max}
            step={1}
            minValue={filters.yearFrom?.toString() || yearRange.min.toString()}
            maxValue={filters.yearTo?.toString() || yearRange.max.toString()}
            onChange={(min, max) => {
              const minVal = min === yearRange.min.toString() ? null : parseInt(min);
              const maxVal = max === yearRange.max.toString() ? null : parseInt(max);
              filters.setYearRange(minVal, maxVal);
            }}
          />
        </div>

        {/* Mileage */}
        <div className="col-span-12 md:col-span-3">
          <RangeFilterDark
            label={t.mileage || "Chilometraggio"}
            icon={<Gauge className="h-4 w-4" />}
            min={mileageRange.min}
            max={mileageRange.max}
            step={1000}
            unit="km"
            minValue={filters.mileageMin?.toString() || mileageRange.min.toString()}
            maxValue={filters.mileageMax?.toString() || mileageRange.max.toString()}
            onChange={(min, max) => {
              const minVal = min === mileageRange.min.toString() ? null : parseInt(min);
              const maxVal = max === mileageRange.max.toString() ? null : parseInt(max);
              filters.setMileageRange(minVal, maxVal);
            }}
          />
        </div>

        {/* Power */}
        <div className="col-span-12 md:col-span-3">
          <RangeFilterDark
            label={t.power || "Potenza"}
            icon={<Zap className="h-4 w-4" />}
            min={powerRange.min}
            max={powerRange.max}
            step={10}
            unit="CV"
            minValue={filters.powerMin?.toString() || powerRange.min.toString()}
            maxValue={filters.powerMax?.toString() || powerRange.max.toString()}
            onChange={(min, max) => {
              const minVal = min === powerRange.min.toString() ? null : parseInt(min);
              const maxVal = max === powerRange.max.toString() ? null : parseInt(max);
              filters.setPowerRange(minVal, maxVal);
            }}
          />
        </div>

        {/* Displacement */}
        <div className="col-span-12 md:col-span-3">
          <RangeFilterDark
            label={t.displacement || "Cilindrata"}
            icon={<Gauge className="h-4 w-4" />}
            min={displacementRange.min}
            max={displacementRange.max}
            step={0.1}
            unit="L"
            minValue={filters.displacementMin?.toString() || displacementRange.min.toString()}
            maxValue={filters.displacementMax?.toString() || displacementRange.max.toString()}
            onChange={(min, max) => {
              const minVal = min === displacementRange.min.toString() ? null : parseFloat(min);
              const maxVal = max === displacementRange.max.toString() ? null : parseFloat(max);
              filters.setDisplacementRange(minVal, maxVal);
            }}
          />
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:text-[#ff6b35] hover:bg-[#2a2a2a]"
          >
            <ChevronDown className="h-4 w-4 mr-2" />
            {t.advancedSearch || "RICERCA AVANZATA"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => filters.resetFilters()}
            className="text-white hover:text-[#ff6b35] hover:bg-[#2a2a2a]"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            {t.resetFilters || "Resetta Filtri"}
          </Button>
        </div>
        <Button
          onClick={onSearch}
          className="bg-[#ff6b35] hover:bg-[#ff5722] text-white font-semibold px-6"
        >
          {resultCount} {t.results || "risultati"}
        </Button>
      </div>
    </div>
  );
}
