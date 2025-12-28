import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { Vehicle } from "@/data/sampleVehicles";
import { VehicleCard } from "@/components/VehicleCard";
import { VehicleCardSkeleton } from "@/components/VehicleCardSkeleton";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
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
    <section ref={ref} className="py-16 md:py-24">
      <div className="container">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground relative">
              {t("arrivals.title")}
              <span className="absolute -bottom-2 left-0 w-16 h-1 bg-primary rounded-full" />
            </h2>
            <p className="text-muted-foreground mt-4">
              {t("arrivals.subtitle")}
            </p>
          </div>
          <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground self-start sm:self-auto">
            <Link to="/listings">
              {t("arrivals.viewAll")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Vehicle Grid with Skeleton Loading */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <VehicleCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
