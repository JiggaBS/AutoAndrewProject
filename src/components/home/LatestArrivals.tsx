import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { Vehicle } from "@/data/sampleVehicles";
import { VehicleCard } from "@/components/VehicleCard";
import { VehicleCardSkeleton } from "@/components/VehicleCardSkeleton";
import { Button } from "@/components/ui/button";
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
    <section ref={ref} className="py-20 md:py-28 relative">
      {/* Subtle background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent pointer-events-none" />
      
      <div className="container relative">
        {/* Section Header - Enhanced */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
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
          
          <Button 
            asChild 
            variant="outline" 
            size="default"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground self-start sm:self-auto h-10 px-4 font-semibold transition-all focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Link to="/listings">
              {t("arrivals.viewAll")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Vehicle Grid with Skeleton Loading */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[...Array(8)].map((_, i) => (
              <VehicleCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {latestVehicles.map((vehicle, index) => (
              <VehicleCard key={vehicle.ad_number || index} vehicle={vehicle} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
});

LatestArrivals.displayName = "LatestArrivals";
