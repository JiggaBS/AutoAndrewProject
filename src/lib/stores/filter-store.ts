import { create } from "zustand";

export interface FilterState {
  make: string | null;
  model: string | null;
  fuels: string[];
  priceMin: number | null;
  priceMax: number | null;
  yearFrom: number | null;
  yearTo: number | null;
  mileageMin: number | null;
  mileageMax: number | null;
  powerMin: number | null;
  powerMax: number | null;
  powerUnit: "cv" | "kw";
  displacementMin: number | null;
  displacementMax: number | null;
  categories: string[];
  transmissions: string[];
  doors: number[];
  emissionsClasses: string[];
  colors: string[];
  sortBy: string;
  sortOrder: "asc" | "desc";
}

interface FilterActions {
  setMake: (make: string | null) => void;
  setModel: (model: string | null) => void;
  toggleFuel: (fuel: string) => void;
  setPriceRange: (min: number | null, max: number | null) => void;
  setYearRange: (from: number | null, to: number | null) => void;
  setMileageRange: (min: number | null, max: number | null) => void;
  setPowerRange: (min: number | null, max: number | null) => void;
  setPowerUnit: (unit: "cv" | "kw") => void;
  setDisplacementRange: (min: number | null, max: number | null) => void;
  toggleCategory: (category: string) => void;
  toggleTransmission: (transmission: string) => void;
  toggleDoors: (doors: number) => void;
  toggleEmissionsClass: (emissionsClass: string) => void;
  toggleColor: (color: string) => void;
  setSort: (sortBy: string, sortOrder: "asc" | "desc") => void;
  resetFilters: () => void;
  clearSection: (section: string) => void;
}

const initialState: FilterState = {
  make: null,
  model: null,
  fuels: [],
  priceMin: null,
  priceMax: null,
  yearFrom: null,
  yearTo: null,
  mileageMin: null,
  mileageMax: null,
  powerMin: null,
  powerMax: null,
  powerUnit: "cv",
  displacementMin: null,
  displacementMax: null,
  categories: [],
  transmissions: [],
  doors: [],
  emissionsClasses: [],
  colors: [],
  sortBy: "insertion_date",
  sortOrder: "desc",
};

export const useFilterStore = create<FilterState & FilterActions>((set) => ({
  ...initialState,

  setMake: (make) => set({ make, model: null }),
  setModel: (model) => set({ model }),
  
  toggleFuel: (fuel) =>
    set((state) => ({
      fuels: state.fuels.includes(fuel)
        ? state.fuels.filter((f) => f !== fuel)
        : [...state.fuels, fuel],
    })),

  setPriceRange: (min, max) => set({ priceMin: min, priceMax: max }),
  setYearRange: (from, to) => set({ yearFrom: from, yearTo: to }),
  setMileageRange: (min, max) => set({ mileageMin: min, mileageMax: max }),
  setPowerRange: (min, max) => set({ powerMin: min, powerMax: max }),
  setPowerUnit: (unit) => set({ powerUnit: unit }),
  setDisplacementRange: (min, max) => set({ displacementMin: min, displacementMax: max }),

  toggleCategory: (category) =>
    set((state) => ({
      categories: state.categories.includes(category)
        ? state.categories.filter((c) => c !== category)
        : [...state.categories, category],
    })),

  toggleTransmission: (transmission) =>
    set((state) => ({
      transmissions: state.transmissions.includes(transmission)
        ? state.transmissions.filter((t) => t !== transmission)
        : [...state.transmissions, transmission],
    })),

  toggleDoors: (doors) =>
    set((state) => ({
      doors: state.doors.includes(doors)
        ? state.doors.filter((d) => d !== doors)
        : [...state.doors, doors],
    })),

  toggleEmissionsClass: (emissionsClass) =>
    set((state) => ({
      emissionsClasses: state.emissionsClasses.includes(emissionsClass)
        ? state.emissionsClasses.filter((e) => e !== emissionsClass)
        : [...state.emissionsClasses, emissionsClass],
    })),

  toggleColor: (color) =>
    set((state) => ({
      colors: state.colors.includes(color)
        ? state.colors.filter((c) => c !== color)
        : [...state.colors, color],
    })),

  setSort: (sortBy, sortOrder) => set({ sortBy, sortOrder }),

  resetFilters: () => set(initialState),

  clearSection: (section) => {
    switch (section) {
      case "make":
        set({ make: null, model: null });
        break;
      case "fuel":
        set({ fuels: [] });
        break;
      case "price":
        set({ priceMin: null, priceMax: null });
        break;
      case "year":
        set({ yearFrom: null, yearTo: null });
        break;
      case "mileage":
        set({ mileageMin: null, mileageMax: null });
        break;
      case "power":
        set({ powerMin: null, powerMax: null });
        break;
      case "displacement":
        set({ displacementMin: null, displacementMax: null });
        break;
      case "category":
        set({ categories: [] });
        break;
      case "transmission":
        set({ transmissions: [] });
        break;
      case "doors":
        set({ doors: [] });
        break;
      case "emissions":
        set({ emissionsClasses: [] });
        break;
      case "color":
        set({ colors: [] });
        break;
    }
  },
}));

// Helper to count active filters
export function countActiveFilters(state: FilterState): number {
  let count = 0;
  if (state.make) count++;
  if (state.model) count++;
  count += state.fuels.length;
  if (state.priceMin || state.priceMax) count++;
  if (state.yearFrom || state.yearTo) count++;
  if (state.mileageMin || state.mileageMax) count++;
  if (state.powerMin || state.powerMax) count++;
  if (state.displacementMin || state.displacementMax) count++;
  count += state.categories.length;
  count += state.transmissions.length;
  count += state.doors.length;
  count += state.emissionsClasses.length;
  count += state.colors.length;
  return count;
}
