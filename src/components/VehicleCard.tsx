import { useState, useEffect, forwardRef } from "react";
import { Star, Sparkles, ArrowLeftRight } from "lucide-react";
import { Vehicle } from "@/data/sampleVehicles";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LazyImage } from "./LazyImage";
import { saveVehicle, unsaveVehicle, isVehicleSaved } from "@/lib/api/savedVehicles";

interface VehicleCardProps {
  vehicle: Vehicle;
  index?: number;
  showCompare?: boolean;
  isInCompare?: boolean;
  onToggleCompare?: (vehicle: Vehicle) => void;
}

export const VehicleCard = forwardRef<HTMLElement, VehicleCardProps>(({ 
  vehicle, 
  index = 0, 
  showCompare = false,
  isInCompare = false,
  onToggleCompare 
}, ref) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Check if vehicle is saved when component mounts
  useEffect(() => {
    checkIfSaved();
  }, [vehicle]);

  const checkIfSaved = async () => {
    const saved = await isVehicleSaved(vehicle);
    setIsSaved(saved);
  };

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isSaving) return;

    setIsSaving(true);
    if (isSaved) {
      const success = await unsaveVehicle(vehicle);
      if (success) {
        setIsSaved(false);
      }
    } else {
      const success = await saveVehicle(vehicle);
      if (success) {
        setIsSaved(true);
      } else {
        // If user is not logged in, redirect to auth page
        // The saveVehicle function already shows a toast
      }
    }
    setIsSaving(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Check if vehicle is "new arrival" (within first 4 items or has is_new flag)
  const isNewArrival = vehicle.is_new || index < 4;

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleCompare?.(vehicle);
  };

  return (
    <Link to={`/vehicle/${vehicle.ad_number}`}>
      <article
        ref={ref} 
        className={cn(
          "vehicle-card group cursor-pointer",
          "opacity-0 animate-fade-in"
        )}
        style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
      >
        {/* Image Container with Lazy Loading */}
        <div className="relative">
          <LazyImage
            src={vehicle.images[0]}
            alt={vehicle.title}
            aspectRatio="aspect-[4/3]"
            className="group-hover:scale-105 transition-transform duration-500"
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Gradient Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* New Arrival Badge */}
          {isNewArrival && (
            <span className="absolute top-2 left-2 inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold bg-primary text-primary-foreground shadow-lg">
              <Sparkles className="w-3 h-3" />
              IN ARRIVO
            </span>
          )}

          {/* Action Buttons */}
          <div className="absolute top-2 right-2 flex flex-col gap-2">
            {/* Compare Button */}
            {showCompare && (
              <button
                className={cn(
                  "p-2 backdrop-blur-sm rounded-full transition-all duration-200 hover:scale-110",
                  isInCompare 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30" 
                    : "bg-card/80 hover:bg-primary hover:text-primary-foreground"
                )}
                onClick={handleCompareClick}
                title={isInCompare ? "Rimuovi dal confronto" : "Aggiungi al confronto"}
              >
                <ArrowLeftRight className="w-4 h-4" />
              </button>
            )}

            {/* Favorite Button */}
            <button
              className={cn(
                "p-2 backdrop-blur-sm rounded-full transition-all duration-200 hover:scale-110",
                isSaved 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30" 
                  : "bg-card/80 hover:bg-primary hover:text-primary-foreground"
              )}
              onClick={handleFavoriteClick}
              disabled={isSaving}
              title={isSaved ? "Rimuovi dai preferiti" : "Salva nei preferiti"}
            >
              <Star className={cn("w-4 h-4", isSaved && "fill-current")} />
            </button>
          </div>

          {/* Price Badge on Image */}
          <div className={cn(
            "absolute bottom-2 right-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg font-bold text-sm shadow-lg transition-opacity duration-300",
            imageLoaded ? "opacity-100" : "opacity-0"
          )}>
            {formatPrice(vehicle.price)}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors duration-200">
            {vehicle.make} {vehicle.model}{" "}
            <span className="font-normal text-muted-foreground">
              {vehicle.version}
            </span>
          </h3>

          {/* Specs Grid */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-muted-foreground mb-3">
            <span>{vehicle.first_registration_date}</span>
            <span>{vehicle.mileage} km</span>
            <span>{vehicle.fuel_type}</span>
            <span>{vehicle.gearbox?.split(" ")[0]}</span>
          </div>
        </div>
      </article>
    </Link>
  );
});

VehicleCard.displayName = "VehicleCard";
