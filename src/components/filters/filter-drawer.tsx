import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FilterSection } from "./filter-section";
import { CheckboxFilter } from "./checkbox-filter";
import { SelectFilter } from "./select-filter";
import { RangeFilterNew } from "./range-filter-new";
import { ColorFilter } from "./color-filter";
import { useFilterStore, countActiveFilters } from "@/lib/stores/filter-store";
import type { FacetCounts } from "./filter-sidebar";
import { 
  Car, 
  Euro, 
  CarFront, 
  Fuel, 
  Settings, 
  Calendar, 
  Gauge, 
  Zap, 
  Palette 
} from "lucide-react";

interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  facets: FacetCounts;
  translations?: {
    filters?: string;
    resetFilters?: string;
    applyFilters?: string;
    make?: string;
    model?: string;
    price?: string;
    priceMin?: string;
    priceMax?: string;
    bodyType?: string;
    fuel?: string;
    transmission?: string;
    year?: string;
    yearFrom?: string;
    yearTo?: string;
    mileage?: string;
    mileageMin?: string;
    mileageMax?: string;
    power?: string;
    powerMin?: string;
    powerMax?: string;
    doors?: string;
    colors?: string;
  };
}

// Price options
const priceOptions = [
  { value: 5000, label: "€ 5.000" },
  { value: 10000, label: "€ 10.000" },
  { value: 15000, label: "€ 15.000" },
  { value: 20000, label: "€ 20.000" },
  { value: 30000, label: "€ 30.000" },
  { value: 40000, label: "€ 40.000" },
  { value: 50000, label: "€ 50.000" },
  { value: 75000, label: "€ 75.000" },
  { value: 100000, label: "€ 100.000" },
];

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 25 }, (_, i) => ({
  value: currentYear - i,
  label: (currentYear - i).toString(),
}));

const mileageOptions = [
  { value: 10000, label: "10.000 km" },
  { value: 20000, label: "20.000 km" },
  { value: 30000, label: "30.000 km" },
  { value: 50000, label: "50.000 km" },
  { value: 75000, label: "75.000 km" },
  { value: 100000, label: "100.000 km" },
  { value: 150000, label: "150.000 km" },
  { value: 200000, label: "200.000 km" },
];

const powerOptions = [
  { value: 100, label: "100 CV" },
  { value: 150, label: "150 CV" },
  { value: 200, label: "200 CV" },
  { value: 250, label: "250 CV" },
  { value: 300, label: "300 CV" },
  { value: 400, label: "400 CV" },
  { value: 500, label: "500 CV" },
];

export function FilterDrawer({ open, onClose, facets, translations = {} }: FilterDrawerProps) {
  const t = translations;
  const filters = useFilterStore();
  const activeFilterCount = countActiveFilters(filters);

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent 
        side="left" 
        className="w-full sm:max-w-md p-0 bg-white dark:bg-card border-gray-200 dark:border-[#2a2a2a] [&>button]:text-black dark:[&>button]:text-white [&>button]:hover:bg-gray-100 dark:[&>button]:hover:bg-[#2a2a2a] flex flex-col"
      >
        <SheetHeader className="p-4 pr-14 border-b border-gray-200 dark:border-[#2a2a2a] flex-shrink-0">
          <div className="flex items-center justify-between gap-3">
            <SheetTitle className="text-black dark:text-white flex-shrink-0">{t.filters || "Filtri"}</SheetTitle>
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => filters.resetFilters()}
                className="text-[#ff6b35] hover:text-[#ff5722] hover:bg-gray-100 dark:hover:bg-[#2a2a2a] flex-shrink-0 text-xs sm:text-sm"
              >
                {t.resetFilters || "Reset filtri"}
              </Button>
            )}
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 min-h-0">
          <div className="p-4 space-y-1">
            {/* Make */}
            <FilterSection
              title={t.make || "Marca"}
              count={filters.make ? 1 : 0}
              onClear={() => filters.clearSection("make")}
              defaultOpen={true}
              icon={Car}
            >
              <SelectFilter
                placeholder={t.make || "Marca"}
                value={filters.make}
                onChange={filters.setMake}
                options={facets.makes.map((m) => ({
                  value: m.value,
                  label: `${m.value} (${m.count})`,
                  count: m.count,
                }))}
              />
            </FilterSection>

            {/* Model */}
            {filters.make && (
              <FilterSection
                title={t.model || "Modello"}
                count={filters.model ? 1 : 0}
                onClear={() => filters.setModel(null)}
                defaultOpen={false}
                icon={CarFront}
              >
                <SelectFilter
                  placeholder={t.model || "Modello"}
                  value={filters.model}
                  onChange={filters.setModel}
                  options={facets.models.map((m) => ({
                    value: m.value,
                    label: `${m.value} (${m.count})`,
                    count: m.count,
                  }))}
                />
              </FilterSection>
            )}

            {/* Body Type */}
            <FilterSection
              title={t.bodyType || "Tipo di veicolo"}
              count={filters.categories.length}
              onClear={() => filters.clearSection("category")}
              defaultOpen={false}
              icon={CarFront}
            >
              <CheckboxFilter
                options={facets.categories.map((c) => ({
                  value: c.value,
                  label: c.value,
                  count: c.count,
                }))}
                selected={filters.categories}
                onToggle={filters.toggleCategory}
              />
            </FilterSection>

            {/* Fuel */}
            <FilterSection
              title={t.fuel || "Alimentazione"}
              count={filters.fuels.length}
              onClear={() => filters.clearSection("fuel")}
              defaultOpen={false}
              icon={Fuel}
            >
              <CheckboxFilter
                options={facets.fuels.map((f) => ({
                  value: f.value,
                  label: f.value,
                  count: f.count,
                }))}
                selected={filters.fuels}
                onToggle={filters.toggleFuel}
              />
            </FilterSection>

            {/* Transmission */}
            <FilterSection
              title={t.transmission || "Trasmissione"}
              count={filters.transmissions.length}
              onClear={() => filters.clearSection("transmission")}
              defaultOpen={false}
              icon={Settings}
            >
              <CheckboxFilter
                options={facets.transmissions.map((t) => ({
                  value: t.value,
                  label: t.value,
                  count: t.count,
                }))}
                selected={filters.transmissions}
                onToggle={filters.toggleTransmission}
              />
            </FilterSection>

            {/* Price */}
            <FilterSection
              title={t.price || "Prezzo"}
              count={filters.priceMin || filters.priceMax ? 1 : 0}
              onClear={() => filters.clearSection("price")}
              defaultOpen={false}
              icon={Euro}
            >
              <RangeFilterNew
                minPlaceholder={t.priceMin || "Prezzo minimo"}
                maxPlaceholder={t.priceMax || "Prezzo massimo"}
                minValue={filters.priceMin}
                maxValue={filters.priceMax}
                onChange={(min, max) => filters.setPriceRange(min, max)}
                options={priceOptions}
              />
            </FilterSection>

            {/* Year */}
            <FilterSection
              title={t.year || "Anno"}
              count={filters.yearFrom || filters.yearTo ? 1 : 0}
              onClear={() => filters.clearSection("year")}
              defaultOpen={false}
              icon={Calendar}
            >
              <RangeFilterNew
                minPlaceholder={t.yearFrom || "Da anno"}
                maxPlaceholder={t.yearTo || "A anno"}
                minValue={filters.yearFrom}
                maxValue={filters.yearTo}
                onChange={(min, max) => filters.setYearRange(min, max)}
                options={yearOptions}
              />
            </FilterSection>

            {/* Mileage */}
            <FilterSection
              title={t.mileage || "Chilometraggio"}
              count={filters.mileageMin || filters.mileageMax ? 1 : 0}
              onClear={() => filters.clearSection("mileage")}
              defaultOpen={false}
              icon={Gauge}
            >
              <RangeFilterNew
                minPlaceholder={t.mileageMin || "Chilometraggio minimo"}
                maxPlaceholder={t.mileageMax || "Chilometraggio massimo"}
                minValue={filters.mileageMin}
                maxValue={filters.mileageMax}
                onChange={(min, max) => filters.setMileageRange(min, max)}
                options={mileageOptions}
              />
            </FilterSection>

            {/* Power */}
            <FilterSection
              title={t.power || "Potenza"}
              count={filters.powerMin || filters.powerMax ? 1 : 0}
              onClear={() => filters.clearSection("power")}
              defaultOpen={false}
              icon={Zap}
            >
              <div className="space-y-3">
                <div className="flex gap-2 bg-gray-100 dark:bg-[#2a2a2a] p-1 rounded-md">
                  <button
                    onClick={() => filters.setPowerUnit("cv")}
                    className={`flex-1 text-xs font-medium py-1 rounded-sm transition-all ${
                      filters.powerUnit === "cv" 
                        ? "bg-white dark:bg-[#ff6b35] text-black dark:text-white shadow-sm" 
                        : "text-gray-600 dark:text-[#888] hover:text-black dark:hover:text-white"
                    }`}
                  >
                    CV
                  </button>
                  <button
                    onClick={() => filters.setPowerUnit("kw")}
                    className={`flex-1 text-xs font-medium py-1 rounded-sm transition-all ${
                      filters.powerUnit === "kw" 
                        ? "bg-white dark:bg-[#ff6b35] text-black dark:text-white shadow-sm" 
                        : "text-gray-600 dark:text-[#888] hover:text-black dark:hover:text-white"
                    }`}
                  >
                    kW
                  </button>
                </div>
                <RangeFilterNew
                  minPlaceholder={t.powerMin || "Potenza minima"}
                  maxPlaceholder={t.powerMax || "Potenza massima"}
                  minValue={filters.powerMin}
                  maxValue={filters.powerMax}
                  onChange={(min, max) => filters.setPowerRange(min, max)}
                  options={powerOptions}
                />
              </div>
            </FilterSection>

            {/* Colors */}
            <FilterSection
              title={t.colors || "Colori"}
              count={filters.colors.length}
              onClear={() => filters.clearSection("color")}
              defaultOpen={false}
              icon={Palette}
            >
              <ColorFilter
                options={facets.colors}
                selected={filters.colors}
                onToggle={filters.toggleColor}
              />
            </FilterSection>
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 pb-[max(1rem,env(safe-area-inset-bottom,0px)+1rem)] border-t border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-card flex-shrink-0">
          <Button 
            onClick={onClose} 
            className="w-full bg-[#ff6b35] hover:bg-[#ff5722] text-white"
          >
            {t.applyFilters || "Applica filtri"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
