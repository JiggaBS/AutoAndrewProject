import { useState, useEffect, useMemo, forwardRef } from "react";
import { Header } from "@/components/Header";
import { ListingsHero } from "@/components/ListingsHero";
import { FilterSidebar } from "@/components/filters/filter-sidebar";
import { FilterDrawer } from "@/components/filters/filter-drawer";
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
import { useFilterStore } from "@/lib/stores/filter-store";
import { computeFacetsFromVehicles } from "@/lib/utils/facets";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, ArrowUp, ArrowDown } from "lucide-react";
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
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const filters = useFilterStore();

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

  // Compute facets from vehicles
  const facets = useMemo(() => {
    return computeFacetsFromVehicles(allVehicles, filters);
  }, [allVehicles, filters]);

  // Filter vehicles based on filter store
  const filteredVehicles = useMemo(() => {
    let result = allVehicles;

    // Filter by make
    if (filters.make) {
      result = result.filter((v) => v.make === filters.make);
    }

    // Filter by model
    if (filters.model) {
      result = result.filter((v) => v.model === filters.model);
    }

    // Filter by price range
    if (filters.priceMin !== null) {
      result = result.filter((v) => v.price >= filters.priceMin!);
    }
    if (filters.priceMax !== null) {
      result = result.filter((v) => v.price <= filters.priceMax!);
    }

    // Filter by year
    if (filters.yearFrom !== null) {
      result = result.filter((v) => {
        const match = v.first_registration_date?.match(/(\d{4})/);
        if (match) {
          return parseInt(match[1]) >= filters.yearFrom!;
        }
        return false;
      });
    }
    if (filters.yearTo !== null) {
      result = result.filter((v) => {
        const match = v.first_registration_date?.match(/(\d{4})/);
        if (match) {
          return parseInt(match[1]) <= filters.yearTo!;
        }
        return false;
      });
    }

    // Filter by fuel types
    if (filters.fuels.length > 0) {
      result = result.filter((v) => filters.fuels.includes(v.fuel_type || ""));
    }

    // Filter by categories
    if (filters.categories.length > 0) {
      result = result.filter((v) => filters.categories.includes(v.vehicle_category || ""));
    }

    // Filter by transmissions
    if (filters.transmissions.length > 0) {
      result = result.filter((v) => {
        const normalized = v.gearbox?.toLowerCase().includes("auto") 
          ? (language === "it" ? "Automatico" : "Automatic")
          : (language === "it" ? "Manuale" : "Manual");
        return filters.transmissions.includes(normalized);
      });
    }

    // Filter by mileage
    if (filters.mileageMin !== null) {
      result = result.filter((v) => {
        const mileage = parseInt(v.mileage?.replace(/\D/g, "") || "0");
        return mileage >= filters.mileageMin!;
      });
    }
    if (filters.mileageMax !== null) {
      result = result.filter((v) => {
        const mileage = parseInt(v.mileage?.replace(/\D/g, "") || "0");
        return mileage <= filters.mileageMax!;
      });
    }

    // Filter by emissions class
    if (filters.emissionsClasses.length > 0) {
      result = result.filter((v) => filters.emissionsClasses.includes(v.emissions_class || ""));
    }

    // Filter by colors
    if (filters.colors.length > 0) {
      result = result.filter((v) => {
        const vehicleColor = v.color?.charAt(0).toUpperCase() + v.color?.slice(1).toLowerCase();
        return filters.colors.includes(vehicleColor || "");
      });
    }

    // Filter by power range
    if (filters.powerMin !== null) {
      const column = filters.powerUnit === "kw" ? "power_kw" : "power_cv";
      result = result.filter((v) => {
        const power = column === "power_kw" ? v.power_kw : v.power_cv;
        return power >= filters.powerMin!;
      });
    }
    if (filters.powerMax !== null) {
      const column = filters.powerUnit === "kw" ? "power_kw" : "power_cv";
      result = result.filter((v) => {
        const power = column === "power_kw" ? v.power_kw : v.power_cv;
        return power <= filters.powerMax!;
      });
    }

    // Filter by doors
    if (filters.doors.length > 0) {
      result = result.filter((v) => {
        const versionMatch = v.version?.match(/(\d+)\s*port[ei]/i);
        if (versionMatch) {
          return filters.doors.includes(parseInt(versionMatch[1]));
        }
        const categoryDoors: Record<string, number> = {
          Berlina: 4,
          SUV: 5,
          "City car": 3,
          Coupé: 2,
          Coupe: 2,
          Cabrio: 2,
        };
        const defaultDoors = categoryDoors[v.vehicle_category || ""] || 5;
        return filters.doors.includes(defaultDoors);
      });
    }

    // Filter by displacement
    if (filters.displacementMin !== null || filters.displacementMax !== null) {
      result = result.filter((v) => {
        const displacementLiters = v.cubic_capacity ? v.cubic_capacity / 1000 : null;
        if (displacementLiters === null) return false;
        if (filters.displacementMin !== null && displacementLiters < filters.displacementMin) return false;
        if (filters.displacementMax !== null && displacementLiters > filters.displacementMax) return false;
        return true;
      });
    }

    return result;
  }, [filters, allVehicles]);

  // Sort filtered vehicles (vehicles without photos always last)
  const sortedVehicles = useMemo(() => {
    const sorted = [...filteredVehicles];
    
    const hasPhotos = (v: Vehicle) => v.images && v.images.length > 0;
    
    sorted.sort((a, b) => {
      // First: vehicles without photos go to the end
      const aHasPhotos = hasPhotos(a);
      const bHasPhotos = hasPhotos(b);
      if (aHasPhotos && !bHasPhotos) return -1;
      if (!aHasPhotos && bHasPhotos) return 1;
      
      // Then apply sorting from filter store or current sort
      const sortBy = filters.sortBy || "insertion_date";
      const sortOrder = filters.sortOrder || "desc";
      
      let aVal: number, bVal: number;
      
      switch (sortBy) {
        case "price":
          aVal = a.price;
          bVal = b.price;
          break;
        case "mileage":
          aVal = parseInt(a.mileage?.replace(/\D/g, "") || "0");
          bVal = parseInt(b.mileage?.replace(/\D/g, "") || "0");
          break;
        case "insertion_date":
        default:
          aVal = a.ad_number;
          bVal = b.ad_number;
      }
      
      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    });
    
    return sorted;
  }, [filteredVehicles, filters.sortBy, filters.sortOrder]);

  // Reset to page 1 when filters or sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, currentSort]);

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

  const handleSortChange = (sort: SortOption) => {
    setCurrentSort(sort.value);
    // Map sort option to filter store format
    const sortMap: Record<string, { sortBy: string; sortOrder: "asc" | "desc" }> = {
      newest: { sortBy: "insertion_date", sortOrder: "desc" },
      price_asc: { sortBy: "price", sortOrder: "asc" },
      price_desc: { sortBy: "price", sortOrder: "desc" },
      mileage_asc: { sortBy: "mileage", sortOrder: "asc" },
      mileage_desc: { sortBy: "mileage", sortOrder: "desc" },
      year_asc: { sortBy: "first_registration_date", sortOrder: "asc" },
      year_desc: { sortBy: "first_registration_date", sortOrder: "desc" },
    };
    const mappedSort = sortMap[sort.value];
    if (mappedSort) {
      filters.setSort(mappedSort.sortBy, mappedSort.sortOrder);
    }
  };

  const handleToggleSortDirection = () => {
    const current = sortOptions.find(s => s.value === currentSort) || sortOptions[0];
    // Don't toggle for "newest" (ad_number field)
    if (current.field === "ad_number") return;
    
    // Find the opposite direction option
    const oppositeOption = sortOptions.find(
      opt => opt.field === current.field && opt.direction !== current.direction
    );
    
    if (oppositeOption) {
      handleSortChange(oppositeOption);
    }
  };

  const getGridTitle = () => {
    const parts: string[] = [];
    if (filters.make) parts.push(filters.make);
    if (filters.model) parts.push(filters.model);

    if (parts.length > 0) {
      return `${parts.join(" ")}`;
    }
    return language === "it" ? "Tutti i veicoli disponibili" : "All available vehicles";
  };

  const getSEOTitle = () => {
    const parts: string[] = [];
    if (filters.make) parts.push(filters.make);
    if (filters.model) parts.push(filters.model);
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
    if (filters.make) parts.push(filters.make);
    if (filters.model) parts.push(filters.model);
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
    if (filters.make) parts.push(`${filters.make} usate`);
    if (filters.model) parts.push(`${filters.make} ${filters.model}`);
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

        {/* Main Content with Sidebar Layout */}
        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          {/* Left Sidebar - Filters (Desktop) */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 bg-white dark:bg-card rounded-xl shadow-sm border border-gray-200 dark:border-[#2a2a2a] p-4 max-h-[calc(100vh-8rem)] overflow-y-auto">
              <FilterSidebar 
                facets={facets}
                translations={{
                  filters: t("filters.label"),
                  resetFilters: t("listings.filters.reset"),
                  make: t("listings.filters.brand"),
                  model: t("listings.filters.model"),
                  price: t("listings.filters.price"),
                  priceMin: t("filters.priceMin"),
                  priceMax: t("filters.priceMax"),
                  bodyType: t("filters.bodyType"),
                  fuel: t("listings.filters.fuel"),
                  transmission: t("filters.transmission"),
                  year: t("listings.filters.year"),
                  yearFrom: t("filters.yearFrom"),
                  yearTo: t("filters.yearTo"),
                  mileage: t("listings.filters.km"),
                  mileageMin: t("filters.mileageMin"),
                  mileageMax: t("filters.mileageMax"),
                  power: t("filters.power"),
                  powerMin: t("filters.powerMin"),
                  powerMax: t("filters.powerMax"),
                  doors: t("filters.doors"),
                  colors: t("filters.colors"),
                }}
              />
            </div>
          </aside>

          {/* Right Content Area */}
          <div className="flex-1 min-w-0">
            {/* Top Bar with Results Count and Sort */}
            <div className="bg-white dark:bg-card rounded-xl shadow-sm border border-gray-200 dark:border-[#2a2a2a] p-3 md:p-4 mb-6">
              {/* Mobile Layout - 2 Rows */}
              <div className="flex flex-col gap-3 md:hidden">
                {/* Row 1: Filtri Button (left) + Vehicle Count (right) */}
                <div className="flex items-center justify-between gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setMobileFiltersOpen(true)}
                    className="flex-shrink-0 min-h-[44px]"
                  >
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    {t("filters.label")}
                  </Button>
                  <span className="text-sm text-muted-foreground dark:text-[#888] truncate">
                    {sortedVehicles.length} {language === "it" ? "veicoli" : "vehicles"}
                  </span>
                </div>
                {/* Row 2: Ordina Label + Sort Dropdown (left) + Direction Toggle (right) */}
                <div className="flex items-center justify-between gap-3">
                  <SortSelector 
                    currentSort={currentSort} 
                    onSortChange={handleSortChange} 
                    resultCount={sortedVehicles.length}
                    showDirectionToggle={false}
                  />
                  {(() => {
                    const current = sortOptions.find(s => s.value === currentSort) || sortOptions[0];
                    const canToggle = current.field !== "ad_number";
                    if (!canToggle) return null;
                    return (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleToggleSortDirection}
                        className="bg-white dark:bg-card border-gray-200 dark:border-[#2a2a2a] text-black dark:text-white hover:bg-gray-50 dark:hover:bg-[#2a2a2a] min-h-[44px] min-w-[44px] flex-shrink-0"
                        aria-label={current.direction === "asc" 
                          ? (language === "it" ? "Ordina decrescente" : "Sort descending")
                          : (language === "it" ? "Ordina crescente" : "Sort ascending")
                        }
                      >
                        {current.direction === "asc" ? (
                          <ArrowDown className="w-4 h-4" />
                        ) : (
                          <ArrowUp className="w-4 h-4" />
                        )}
                      </Button>
                    );
                  })()}
                </div>
              </div>

              {/* Desktop Layout - Single Row */}
              <div className="hidden md:flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    className="lg:hidden"
                    onClick={() => setMobileFiltersOpen(true)}
                  >
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    {t("filters.label")}
                  </Button>
                  <h1 className="text-lg font-bold text-black dark:text-white">
                    {sortedVehicles.length} {language === "it" ? "veicoli" : "vehicles"}
                  </h1>
                </div>
                <SortSelector 
                  currentSort={currentSort} 
                  onSortChange={handleSortChange} 
                  resultCount={sortedVehicles.length}
                  showDirectionToggle={false}
                />
              </div>
            </div>

            {/* Vehicle Grid */}
            {isLoading ? (
              <VehicleGridSkeleton count={16} />
            ) : sortedVehicles.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-lg text-muted-foreground">{t("listings.noResults")}</p>
              </div>
            ) : (
              <>
                <VehicleGrid 
                  vehicles={paginatedVehicles} 
                  title={getGridTitle()}
                  showCompare={true}
                  compareVehicles={selectedVehicles}
                  onToggleCompare={handleToggleCompare}
                  sortProps={undefined}
                />

                {totalPages > 1 && (
                  <div className="pb-10 mt-8">
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
          </div>
        </div>

        {/* Mobile Filter Drawer */}
        <FilterDrawer
          open={mobileFiltersOpen}
          onClose={() => setMobileFiltersOpen(false)}
          facets={facets}
          translations={{
            filters: t("filters.label"),
            resetFilters: t("listings.filters.reset"),
            applyFilters: t("listings.filters.apply"),
            make: t("listings.filters.brand"),
            model: t("listings.filters.model"),
            price: t("listings.filters.price"),
            priceMin: t("filters.priceMin"),
            priceMax: t("filters.priceMax"),
            bodyType: t("filters.bodyType"),
            fuel: t("listings.filters.fuel"),
            transmission: t("filters.transmission"),
            year: t("listings.filters.year"),
            yearFrom: t("filters.yearFrom"),
            yearTo: t("filters.yearTo"),
            mileage: t("listings.filters.km"),
            mileageMin: t("filters.mileageMin"),
            mileageMax: t("filters.mileageMax"),
            power: t("filters.power"),
            powerMin: t("filters.powerMin"),
            powerMax: t("filters.powerMax"),
            doors: t("filters.doors"),
            colors: t("filters.colors"),
          }}
        />
      </main>

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
