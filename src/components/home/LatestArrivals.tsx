import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { Vehicle } from "@/data/sampleVehicles";
import { VehicleCard } from "@/components/VehicleCard";
import { VehicleCardSkeleton } from "@/components/VehicleCardSkeleton";
import { ArrowRight, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface LatestArrivalsProps {
  vehicles: Vehicle[];
  isLoading?: boolean;
}

export const LatestArrivals = forwardRef<HTMLElement, LatestArrivalsProps>(({ vehicles, isLoading }, ref) => {
  const { t } = useLanguage();
  // Show only the 8 most recent vehicles
  const latestVehicles = vehicles.slice(0, 8);

  return (
    <section ref={ref} className="py-12 lg:py-24 relative">
      {/* Subtle background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent pointer-events-none" />
      
      <div className="container relative">
        {/* Section Header - Enhanced */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-6">
          <div>
            {/* Section Badge */}
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              {t("arrivals.badge") || "Nuovi Arrivi"}
            </span>
            
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
              {t("arrivals.title")}
            </h2>
            <p className="text-muted-foreground text-base md:text-lg mt-3 max-w-lg">
              {t("arrivals.subtitle")}
            </p>
          </div>
          
          <Link 
            to="/listings"
            className="group inline-flex items-center gap-1.5 text-primary hover:text-primary/80 font-medium text-sm transition-colors self-start sm:self-auto min-h-[44px] sm:min-h-0"
          >
            {t("arrivals.viewAll")}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Vehicle Grid with Skeleton Loading */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <VehicleCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
              {latestVehicles.map((vehicle, index) => (
                <VehicleCard key={vehicle.ad_number || index} vehicle={vehicle} index={index} />
              ))}
            </div>
            
            {/* Mobile: "View All" link below grid for better discoverability */}
            <div className="mt-6 sm:hidden flex justify-center">
              <Link 
                to="/listings"
                className="group inline-flex items-center gap-1.5 text-primary hover:text-primary/80 font-medium text-base min-h-[44px] px-6 py-2.5 rounded-lg border border-primary/30 hover:border-primary/50 hover:bg-primary/5 transition-all"
              >
                {t("arrivals.viewAll")}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
});

LatestArrivals.displayName = "LatestArrivals";
