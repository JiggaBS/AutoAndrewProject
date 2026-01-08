import { FilterSection } from "./filter-section";
import { CheckboxFilter } from "./checkbox-filter";
import { SelectFilter } from "./select-filter";
import { RangeFilterNew } from "./range-filter-new";
import { ColorFilter } from "./color-filter";
import { Button } from "@/components/ui/button";
import { useFilterStore, countActiveFilters } from "@/lib/stores/filter-store";
import { 
  Car, 
  Euro, 
  CarFront, 
  Fuel, 
  Settings, 
  Calendar, 
  Gauge, 
  Zap, 
  DoorOpen, 
  Palette 
} from "lucide-react";

export interface FacetCounts {
  makes: { value: string; count: number }[];
  models: { value: string; count: number }[];
  fuels: { value: string; count: number }[];
  categories: { value: string; count: number }[];
  transmissions: { value: string; count: number }[];
  doors: { value: number; count: number }[];
  emissionsClasses: { value: string; count: number }[];
  colors: { value: string; count: number; hex?: string }[];
}

interface FilterSidebarProps {
  facets: FacetCounts;
  translations?: {
    filters?: string;
    resetFilters?: string;
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
  { value: 150000, label: "€ 150.000" },
  { value: 200000, label: "€ 200.000" },
];

// Year options (dynamic)
const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 30 }, (_, i) => ({
  value: currentYear - i,
  label: (currentYear - i).toString(),
}));

// Mileage options
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

// Power options (CV)
const powerOptions = [
  { value: 100, label: "100 CV" },
  { value: 150, label: "150 CV" },
  { value: 200, label: "200 CV" },
  { value: 300, label: "300 CV" },
  { value: 400, label: "400 CV" },
  { value: 500, label: "500 CV" },
  { value: 600, label: "600 CV" },
];

export function FilterSidebar({ facets, translations = {} }: FilterSidebarProps) {
  const t = translations;
  const filters = useFilterStore();
  const activeFilterCount = countActiveFilters(filters);

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="font-heading font-semibold text-lg text-black dark:text-white">{t.filters || "Filtri"}</h2>
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => filters.resetFilters()}
            className="text-[#ff6b35] hover:text-[#ff5722] hover:bg-gray-100 dark:hover:bg-[#2a2a2a] h-auto py-1 px-2 text-xs"
          >
            {t.resetFilters || "Reset filtri"}
          </Button>
        )}
      </div>

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

      {/* Model (dependent on Make) */}
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

      {/* Doors */}
      <FilterSection
        title={t.doors || "Porte"}
        count={filters.doors.length}
        onClear={() => filters.clearSection("doors")}
        defaultOpen={false}
        icon={DoorOpen}
      >
        <CheckboxFilter
          options={facets.doors.map((d) => ({
            value: d.value.toString(),
            label: `${d.value} ${t.doors || "porte"}`,
            count: d.count,
          }))}
          selected={filters.doors.map((d) => d.toString())}
          onToggle={(value) => filters.toggleDoors(parseInt(value, 10))}
        />
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
  );
}
