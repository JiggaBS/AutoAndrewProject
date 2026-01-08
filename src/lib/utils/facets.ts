import { Vehicle } from "@/data/sampleVehicles";
import type { FacetCounts } from "@/components/filters/filter-sidebar";
import type { FilterState } from "@/lib/stores/filter-store";

export function computeFacetsFromVehicles(
  vehicles: Vehicle[],
  currentFilters?: Partial<FilterState>
): FacetCounts {
  // For makes, use all vehicles (so you can see all available makes)
  // For other facets, apply filters (excluding the facet being computed)
  let filteredVehicles = vehicles;

  if (currentFilters) {
    // Don't filter by make when computing make counts
    // Don't filter by model when computing model counts
    if (currentFilters.model) {
      filteredVehicles = filteredVehicles.filter((v) => v.model === currentFilters.model);
    }
    if (currentFilters.priceMin) {
      filteredVehicles = filteredVehicles.filter((v) => v.price >= currentFilters.priceMin!);
    }
    if (currentFilters.priceMax) {
      filteredVehicles = filteredVehicles.filter((v) => v.price <= currentFilters.priceMax!);
    }
    if (currentFilters.yearFrom) {
      filteredVehicles = filteredVehicles.filter((v) => {
        const match = v.first_registration_date?.match(/(\d{4})/);
        if (match) {
          return parseInt(match[1]) >= currentFilters.yearFrom!;
        }
        return false;
      });
    }
    if (currentFilters.yearTo) {
      filteredVehicles = filteredVehicles.filter((v) => {
        const match = v.first_registration_date?.match(/(\d{4})/);
        if (match) {
          return parseInt(match[1]) <= currentFilters.yearTo!;
        }
        return false;
      });
    }
    if (currentFilters.fuels.length > 0) {
      filteredVehicles = filteredVehicles.filter((v) =>
        currentFilters.fuels.includes(v.fuel_type || "")
      );
    }
    if (currentFilters.categories.length > 0) {
      filteredVehicles = filteredVehicles.filter((v) =>
        currentFilters.categories.includes(v.vehicle_category || "")
      );
    }
    if (currentFilters.transmissions.length > 0) {
      filteredVehicles = filteredVehicles.filter((v) => {
        const normalized = v.gearbox?.toLowerCase().includes("auto") ? "Automatico" : "Manuale";
        return currentFilters.transmissions.includes(normalized);
      });
    }
  }

  // Aggregate counts
  const makeCounts = new Map<string, number>();
  const modelCounts = new Map<string, number>();
  const fuelCounts = new Map<string, number>();
  const categoryCounts = new Map<string, number>();
  const transmissionCounts = new Map<string, number>();
  const doorCounts = new Map<number, number>();
  const emissionsCounts = new Map<string, number>();
  const colorCounts = new Map<string, number>();

  // Compute makes from ALL vehicles (not filtered)
  vehicles.forEach((v) => {
    if (v.make) makeCounts.set(v.make, (makeCounts.get(v.make) || 0) + 1);
  });

  // Compute models from filtered vehicles, but if make is selected, only show models for that make
  filteredVehicles.forEach((v) => {
    if (v.model) {
      // If a make is selected, only count models for that make
      if (currentFilters?.make) {
        if (v.make === currentFilters.make) {
          modelCounts.set(v.model, (modelCounts.get(v.model) || 0) + 1);
        }
      } else {
        // If no make is selected, count all models from filtered vehicles
        modelCounts.set(v.model, (modelCounts.get(v.model) || 0) + 1);
      }
    }
    if (v.fuel_type) fuelCounts.set(v.fuel_type, (fuelCounts.get(v.fuel_type) || 0) + 1);
    if (v.vehicle_category) {
      categoryCounts.set(v.vehicle_category, (categoryCounts.get(v.vehicle_category) || 0) + 1);
    }
    if (v.gearbox) {
      const normalized = v.gearbox.toLowerCase().includes("auto") ? "Automatico" : "Manuale";
      transmissionCounts.set(normalized, (transmissionCounts.get(normalized) || 0) + 1);
    }
    // Extract doors from version or use default
    const versionMatch = v.version?.match(/(\d+)\s*port[ei]/i);
    if (versionMatch) {
      const doors = parseInt(versionMatch[1]);
      doorCounts.set(doors, (doorCounts.get(doors) || 0) + 1);
    } else {
      // Default mapping
      const categoryDoors: Record<string, number> = {
        Berlina: 4,
        SUV: 5,
        "City car": 3,
        Coupé: 2,
        Coupe: 2,
        Cabrio: 2,
      };
      const defaultDoors = categoryDoors[v.vehicle_category || ""] || 5;
      doorCounts.set(defaultDoors, (doorCounts.get(defaultDoors) || 0) + 1);
    }
    if (v.emissions_class) {
      emissionsCounts.set(v.emissions_class, (emissionsCounts.get(v.emissions_class) || 0) + 1);
    }
    if (v.color) {
      const color = v.color.charAt(0).toUpperCase() + v.color.slice(1).toLowerCase();
      colorCounts.set(color, (colorCounts.get(color) || 0) + 1);
    }
  });

  // Get color hex codes (you might want to create a color mapping)
  const colorHexMap = new Map<string, string>([
    ["Bianco", "#FFFFFF"],
    ["Nero", "#000000"],
    ["Grigio", "#808080"],
    ["Rosso", "#FF0000"],
    ["Blu", "#0000FF"],
    ["Verde", "#008000"],
    ["Giallo", "#FFFF00"],
    ["Argento", "#C0C0C0"],
  ]);

  return {
    makes: Array.from(makeCounts.entries())
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => a.value.localeCompare(b.value)),
    models: Array.from(modelCounts.entries())
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => a.value.localeCompare(b.value)),
    fuels: Array.from(fuelCounts.entries())
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => b.count - a.count),
    categories: Array.from(categoryCounts.entries())
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => b.count - a.count),
    transmissions: Array.from(transmissionCounts.entries())
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => b.count - a.count),
    doors: Array.from(doorCounts.entries())
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => a.value - b.value),
    emissionsClasses: Array.from(emissionsCounts.entries())
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => a.value.localeCompare(b.value)),
    colors: Array.from(colorCounts.entries())
      .map(([value, count]) => ({ value, count, hex: colorHexMap.get(value) }))
      .sort((a, b) => b.count - a.count),
  };
}
