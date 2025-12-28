import { useState, useEffect, useMemo, forwardRef } from "react";
import { Header } from "@/components/Header";
import { ListingsHero } from "@/components/ListingsHero";
import { SearchFilters, FilterState } from "@/components/SearchFilters";
import { BodyTypeSelector } from "@/components/BodyTypeSelector";
import { VehicleGrid } from "@/components/VehicleGrid";
import { VehicleGridSkeleton } from "@/components/VehicleCardSkeleton";
import { SortSelector, SortOption, sortOptions } from "@/components/SortSelector";
import { Footer } from "@/components/home/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { VehicleCompare, useVehicleCompare } from "@/components/VehicleCompare";
import { SEO } from "@/components/SEO";
import { VehicleListSchema, BreadcrumbSchema } from "@/components/SchemaOrg";
import { sampleVehicles, Vehicle } from "@/data/sampleVehicles";
import { fetchVehicles } from "@/lib/api/vehicles";
import { trackSearch, trackFilter } from "@/lib/analytics";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 16;

// Map UI body-type IDs to vehicle_category values from the API
const bodyTypeToCategoryMap: Record<string, string[]> = {
  city_car: ["City car", "Utilitaria"],
  suv: ["SUV", "Fuoristrada", "Pick-up", "SUV / Fuoristrada"],
  van: ["Furgone", "Van", "Furgoni", "Veicolo commerciale"],
  cabrio: ["Cabrio", "Cabriolet", "Spider"],
  monovolume: ["Monovolume", "MPV"],
  berlina: ["Berlina", "Sedan"],
  station_wagon: ["Station Wagon", "SW"],
  coupe: ["Coupé", "Coupe"],
};

const Listings = forwardRef<HTMLDivElement>((props, ref) => {
  const { t, language } = useLanguage();
  const [allVehicles, setAllVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSort, setCurrentSort] = useState<string>("newest");
  const [selectedBodyType, setSelectedBodyType] = useState<string>();
  const [activeFilters, setActiveFilters] = useState<FilterState>({
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
  });

  // Compare functionality
  const { selectedVehicles, addVehicle, removeVehicle, clearAll, isSelected } = useVehicleCompare();

  const handleToggleCompare = (vehicle: Vehicle) => {
    if (isSelected(vehicle.ad_number)) {
      removeVehicle(vehicle.ad_number);
    } else {
      addVehicle(vehicle);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    setIsLoading(true);
    try {
      const response = await fetchVehicles({ limit: 200 });
      if (response.success && response.data && response.data.length > 0) {
        const sorted = [...response.data].sort((a, b) => b.ad_number - a.ad_number);
        setAllVehicles(sorted);
      } else {
        setAllVehicles(sampleVehicles);
      }
    } catch (error) {
      console.error("Error loading vehicles:", error);
      setAllVehicles(sampleVehicles);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter vehicles based on all active filters
  const filteredVehicles = useMemo(() => {
    let result = allVehicles;

    // Filter by body type
    if (selectedBodyType) {
      const categories = bodyTypeToCategoryMap[selectedBodyType] || [];
      result = result.filter((v) =>
        categories.some((cat) =>
          v.vehicle_category?.toLowerCase().includes(cat.toLowerCase())
        )
      );
    }

    // Filter by make
    if (activeFilters.make) {
      result = result.filter((v) => v.make === activeFilters.make);
    }

    // Filter by model
    if (activeFilters.model) {
      result = result.filter((v) => v.model === activeFilters.model);
    }

    // Filter by price range
    if (activeFilters.priceMin || activeFilters.priceMax) {
      const minPrice = activeFilters.priceMin ? parseInt(activeFilters.priceMin) : 0;
      const maxPrice = activeFilters.priceMax ? parseInt(activeFilters.priceMax) : 999999;
      result = result.filter((v) => v.price >= minPrice && v.price <= maxPrice);
    }

    // Filter by year
    if (activeFilters.yearFrom) {
      const yearFrom = parseInt(activeFilters.yearFrom);
      result = result.filter((v) => {
        const match = v.first_registration_date?.match(/(\d{4})/);
        if (match) {
          const vehicleYear = parseInt(match[1]);
          return vehicleYear >= yearFrom;
        }
        return true;
      });
    }

    // Filter by fuel type
    if (activeFilters.fuelType) {
      result = result.filter((v) => v.fuel_type === activeFilters.fuelType);
    }

    // Filter by gearbox
    if (activeFilters.gearbox) {
      result = result.filter((v) => {
        const normalized = v.gearbox?.toLowerCase().includes("auto") ? "Automatico" : "Manuale";
        return normalized === activeFilters.gearbox;
      });
    }

    // Filter by mileage
    if (activeFilters.mileageMax) {
      const maxMileage = parseInt(activeFilters.mileageMax);
      result = result.filter((v) => {
        const mileage = parseInt(v.mileage?.replace(/\D/g, "") || "0");
        return mileage <= maxMileage;
      });
    }

    // Filter by condition
    if (activeFilters.condition) {
      result = result.filter((v) => v.vehicle_class === activeFilters.condition);
    }

    // Filter by emissions class
    if (activeFilters.emissionsClass) {
      result = result.filter((v) => v.emissions_class === activeFilters.emissionsClass);
    }

    // Filter by color
    if (activeFilters.color) {
      result = result.filter((v) => 
        v.color?.toLowerCase().includes(activeFilters.color.toLowerCase())
      );
    }

    // Filter by power range (CV) - use power_cv from vehicle
    if (activeFilters.powerMin || activeFilters.powerMax) {
      const minPower = activeFilters.powerMin ? parseInt(activeFilters.powerMin) : 0;
      const maxPower = activeFilters.powerMax ? parseInt(activeFilters.powerMax) : 9999;
      result = result.filter((v) => v.power_cv >= minPower && v.power_cv <= maxPower);
    }

    // Filter by doors - extract from vehicle_category or version
    if (activeFilters.doors) {
      const doorsFilter = activeFilters.doors;
      result = result.filter((v) => {
        // Check if version contains door info like "5 porte"
        const versionMatch = v.version?.match(/(\d+)\s*port[ei]/i);
        if (versionMatch) {
          return versionMatch[1] === doorsFilter;
        }
        // Default mapping based on category
        const categoryDoors: Record<string, string> = {
          "Berlina": "4",
          "SUV": "5",
          "City car": "3",
          "Coupé": "2",
          "Cabrio": "2",
        };
        const defaultDoors = categoryDoors[v.vehicle_category || ""] || "5";
        return defaultDoors === doorsFilter;
      });
    }

    return result;
  }, [selectedBodyType, activeFilters, allVehicles]);

  // Sort filtered vehicles (vehicles without photos always last)
  const sortedVehicles = useMemo(() => {
    const sort = sortOptions.find(s => s.value === currentSort) || sortOptions[0];
    const sorted = [...filteredVehicles];
    
    const hasPhotos = (v: Vehicle) => v.images && v.images.length > 0;
    
    sorted.sort((a, b) => {
      // First: vehicles without photos go to the end
      const aHasPhotos = hasPhotos(a);
      const bHasPhotos = hasPhotos(b);
      if (aHasPhotos && !bHasPhotos) return -1;
      if (!aHasPhotos && bHasPhotos) return 1;
      
      // Then apply normal sorting
      let aVal: number, bVal: number;
      
      switch (sort.field) {
        case "price":
          aVal = a.price;
          bVal = b.price;
          break;
        case "mileage":
          aVal = parseInt(a.mileage?.replace(/\D/g, "") || "0");
          bVal = parseInt(b.mileage?.replace(/\D/g, "") || "0");
          break;
        case "first_registration_date":
          const aMatch = a.first_registration_date?.match(/(\d{4})/);
          const bMatch = b.first_registration_date?.match(/(\d{4})/);
          aVal = aMatch ? parseInt(aMatch[1]) : 0;
          bVal = bMatch ? parseInt(bMatch[1]) : 0;
          break;
        case "ad_number":
        default:
          aVal = a.ad_number;
          bVal = b.ad_number;
      }
      
      return sort.direction === "asc" ? aVal - bVal : bVal - aVal;
    });
    
    return sorted;
  }, [filteredVehicles, currentSort]);

  // Reset to page 1 when filters or sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedBodyType, activeFilters, currentSort]);

  const totalPages = Math.ceil(sortedVehicles.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedVehicles = sortedVehicles.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getPageNumbers = () => {
    const pages: number[] = [];
    let start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + 4);
    start = Math.max(1, end - 4);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const handleBodyTypeSelect = (type: string) => {
    setSelectedBodyType((prev) => (prev === type ? undefined : type));
  };

  const handleFiltersChange = (filters: FilterState) => {
    setActiveFilters(filters);
    // Track filter usage
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== activeFilters[key as keyof FilterState]) {
        trackFilter(key, value.toString());
      }
    });
    // Track search if make or model is set
    if (filters.make || filters.model) {
      const searchTerm = [filters.make, filters.model].filter(Boolean).join(" ");
      trackSearch(searchTerm, filteredVehicles.length);
    }
  };

  const handleSortChange = (sort: SortOption) => {
    setCurrentSort(sort.value);
  };

  const getGridTitle = () => {
    const parts: string[] = [];
    if (activeFilters.make) parts.push(activeFilters.make);
    if (activeFilters.model) parts.push(activeFilters.model);
    if (selectedBodyType) parts.push(bodyTypeToCategoryMap[selectedBodyType]?.[0] || "");

    if (parts.length > 0) {
      return `${parts.join(" ")}`;
    }
    return language === "it" ? "Tutti i veicoli disponibili" : "All available vehicles";
  };

  const getSEOTitle = () => {
    const parts: string[] = [];
    if (activeFilters.make) parts.push(activeFilters.make);
    if (activeFilters.model) parts.push(activeFilters.model);
    if (selectedBodyType) {
      const category = bodyTypeToCategoryMap[selectedBodyType]?.[0] || "";
      if (category) parts.push(category);
    }
    return parts.length > 0 
      ? language === "it" 
        ? `${parts.join(" ")} Usate Italia | Concessionaria AutoAndrew`
        : `Used ${parts.join(" ")} Italy | AutoAndrew Dealership`
      : language === "it" 
        ? "Auto Usate Italia | Listino Veicoli Garantiti - AutoAndrew"
        : "Used Cars Italy | Guaranteed Vehicles Listing - AutoAndrew";
  };

  const getSEODescription = () => {
    const parts: string[] = [];
    if (activeFilters.make) parts.push(activeFilters.make);
    if (activeFilters.model) parts.push(activeFilters.model);
    if (selectedBodyType) {
      const category = bodyTypeToCategoryMap[selectedBodyType]?.[0] || "";
      if (category) parts.push(category);
    }
    const base = parts.length > 0 
      ? language === "it"
        ? `Cerchi ${parts.join(" ")} usate in Italia? Scopri ${filteredVehicles.length} veicoli selezionati e garantiti. Prezzi competitivi, finanziamenti disponibili.`
        : `Looking for used ${parts.join(" ")} in Italy? Discover ${filteredVehicles.length} selected and guaranteed vehicles. Competitive prices, financing available.`
      : language === "it"
        ? `Listino completo auto usate in Italia. ${filteredVehicles.length} veicoli certificati e garantiti. Concessionaria AutoAndrew: prezzi trasparenti, finanziamenti e permute.`
        : `Complete used car listing in Italy. ${filteredVehicles.length} certified and guaranteed vehicles. AutoAndrew dealership: transparent prices, financing and trade-ins.`;
    return base;
  };

  const getSEOKeywords = () => {
    const baseKeywords = language === "it"
      ? "auto usate Italia, concessionaria auto, veicoli garantiti, auto certificate"
      : "used cars Italy, car dealership, guaranteed vehicles, certified cars";
    const parts: string[] = [baseKeywords];
    if (activeFilters.make) parts.push(`${activeFilters.make} usate`);
    if (activeFilters.model) parts.push(`${activeFilters.make} ${activeFilters.model}`);
    if (selectedBodyType) {
      const category = bodyTypeToCategoryMap[selectedBodyType]?.[0] || "";
      if (category) parts.push(`${category} usate Italia`);
    }
    return parts.join(", ");
  };

  return (
    <div ref={ref} className="min-h-screen bg-background">
      <SEO
        title={getSEOTitle()}
        description={getSEODescription()}
        keywords={getSEOKeywords()}
        url="/listings"
      />
      {sortedVehicles.length > 0 && <VehicleListSchema vehicles={sortedVehicles} />}
      <BreadcrumbSchema
        items={[
          { name: language === "it" ? "Home" : "Home", url: "/" },
          { name: language === "it" ? "Listino Auto Usate" : "Used Cars Listing", url: "/listings" },
        ]}
      />
      <Header />
      
      <main className="container py-8 md:py-12">
        {/* Hero Section */}
        <ListingsHero />

        {/* Filters Section */}
        <section className="px-4">
          <SearchFilters
            onSearch={handleFiltersChange}
            resultCount={filteredVehicles.length}
            vehicles={allVehicles}
          />
          <BodyTypeSelector selected={selectedBodyType} onSelect={handleBodyTypeSelect} />
        </section>
      </main>

      {/* Vehicle Grid */}
      {isLoading ? (
        <VehicleGridSkeleton count={16} />
      ) : sortedVehicles.length === 0 ? (
        <div className="container py-12 text-center">
          <p className="text-lg text-muted-foreground">{t("listings.noResults")}</p>
        </div>
      ) : (
        <>
          <div className="container">
            <SortSelector 
              currentSort={currentSort} 
              onSortChange={handleSortChange} 
              resultCount={sortedVehicles.length} 
            />
          </div>
          <VehicleGrid 
            vehicles={paginatedVehicles} 
            title={getGridTitle()}
            showCompare={true}
            compareVehicles={selectedVehicles}
            onToggleCompare={handleToggleCompare}
          />

          {totalPages > 1 && (
            <div className="container pb-10">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(currentPage - 1)}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>

                  {getPageNumbers().map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => handlePageChange(page)}
                        isActive={page === currentPage}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(currentPage + 1)}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}

      <Footer />
      <WhatsAppButton />
      
      {/* Compare Bar */}
      <VehicleCompare
        vehicles={allVehicles}
        selectedVehicles={selectedVehicles}
        onAddVehicle={addVehicle}
        onRemoveVehicle={removeVehicle}
        onClear={clearAll}
      />
    </div>
  );
});

Listings.displayName = "Listings";

export default Listings;
