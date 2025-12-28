import { Vehicle } from "@/data/sampleVehicles";
import { VehicleCard } from "./VehicleCard";

interface VehicleGridProps {
  vehicles: Vehicle[];
  title?: string;
  showCompare?: boolean;
  compareVehicles?: Vehicle[];
  onToggleCompare?: (vehicle: Vehicle) => void;
}

export function VehicleGrid({ 
  vehicles, 
  title = "I modelli più richiesti",
  showCompare = false,
  compareVehicles = [],
  onToggleCompare
}: VehicleGridProps) {
  const isInCompare = (vehicle: Vehicle) => 
    compareVehicles.some(v => v.ad_number === vehicle.ad_number);

  return (
    <section className="py-8">
      <div className="container">
        <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-6 relative inline-block">
          {title}
          <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-primary rounded-full" />
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {vehicles.map((vehicle, index) => (
            <VehicleCard 
              key={vehicle.ad_number} 
              vehicle={vehicle} 
              index={index}
              showCompare={showCompare}
              isInCompare={isInCompare(vehicle)}
              onToggleCompare={onToggleCompare}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
