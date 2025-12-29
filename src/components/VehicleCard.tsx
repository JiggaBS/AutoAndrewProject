import { useState, useEffect, useCallback, forwardRef } from "react";
import { Sparkles, ArrowLeftRight, Heart, Calendar, Gauge, Fuel, Settings2, Eye } from "lucide-react";
import { Vehicle } from "@/data/sampleVehicles";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LazyImage } from "./LazyImage";
import { Chip } from "./ui/chip";
import { Button } from "./ui/button";
import { saveVehicle, unsaveVehicle, isVehicleSaved } from "@/lib/api/savedVehicles";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { translateFuelType } = useLanguage();
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const checkIfSaved = useCallback(async () => {
    const saved = await isVehicleSaved(vehicle);
    setIsSaved(saved);
  }, [vehicle]);

  // Check if vehicle is saved when component mounts
  useEffect(() => {
    checkIfSaved();
  }, [checkIfSaved]);

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
      }
    }
    setIsSaving(false);
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleCompare?.(vehicle);
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

  // Get year from registration date
  const getYear = (dateStr: string) => {
    const parts = dateStr.split('-');
    return parts.length >= 3 ? parts[2] : dateStr;
  };

  // Format mileage for display
  const formatMileage = (mileage: number | string) => {
    const num = typeof mileage === 'string' ? parseInt(mileage.replace(/\D/g, '')) : mileage;
    if (num >= 1000) {
      return `${Math.round(num / 1000)}k`;
    }
    return num.toString();
  };

  // Get gearbox type shortened
  const getGearboxShort = (gearbox: string | undefined) => {
    if (!gearbox) return '';
    const lower = gearbox.toLowerCase();
    if (lower.includes('automatico')) return 'Automatico';
    if (lower.includes('manual')) return 'Manuale';
    return gearbox.split(' ')[0];
  };

  // Extract "NEOPATENTATI" from version/description and create clean version text
  const extractNeopatentati = (text: string | undefined): { hasNeopatentati: boolean; cleanText: string } => {
    if (!text) return { hasNeopatentati: false, cleanText: '' };
    const hasNeopatentati = /neopatentati/i.test(text);
    const cleanText = text.replace(/neopatentati/gi, '').trim();
    return { hasNeopatentati, cleanText };
  };

  const versionInfo = extractNeopatentati(vehicle.version);
  const descriptionInfo = extractNeopatentati(vehicle.description);
  const hasNeopatentati = versionInfo.hasNeopatentati || descriptionInfo.hasNeopatentati;
  const cleanVersion = versionInfo.cleanText || vehicle.version;

  return (
    <Link to={`/vehicle/${vehicle.ad_number}`}>
      <article
        ref={ref} 
        className={cn(
          "group cursor-pointer bg-card rounded-xl overflow-hidden",
          "border transition-all duration-300",
          "opacity-0 animate-fade-in",
          // Subtle border by default, orange accent on hover
          "border-border/30 hover:border-primary/60",
          // Premium hover effect: subtle lift + shadow
          "hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5"
        )}
        style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container with Lazy Loading */}
        <div className="relative">
          <LazyImage
            src={vehicle.images[0]}
            alt={vehicle.title}
            aspectRatio="aspect-[4/3]"
            className="group-hover:scale-[1.02] transition-transform duration-500"
          />
          
          {/* Subtle gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          {/* New Arrival Badge - Smaller, chip style */}
          {isNewArrival && (
            <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-primary/85 text-primary-foreground backdrop-blur-sm">
              <Sparkles className="w-2.5 h-2.5" />
              IN ARRIVO
            </span>
          )}

          {/* Favorite Button - Single minimal action on photo (outline/ghost style) */}
          <button
            className={cn(
              "absolute top-2.5 right-2.5 p-1.5 rounded-full transition-all duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card",
              "backdrop-blur-sm border",
              isSaved 
                ? "bg-primary/90 text-primary-foreground border-primary/50 shadow-md" 
                : "bg-card/70 text-foreground/70 hover:bg-card/90 hover:text-primary border-border/40 hover:border-primary/50"
            )}
            onClick={handleFavoriteClick}
            disabled={isSaving}
            title={isSaved ? "Rimuovi dai preferiti" : "Salva nei preferiti"}
            aria-label={isSaved ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className={cn("w-3.5 h-3.5", isSaved && "fill-current")} />
          </button>

          {/* Hover-only "Dettagli" pill (desktop) - appears on image hover */}
          <div className={cn(
            "absolute bottom-2.5 left-1/2 -translate-x-1/2 transition-all duration-300 pointer-events-none",
            "md:block hidden",
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
          )}>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-card/95 backdrop-blur-md border border-border/50 text-foreground shadow-lg">
              <Eye className="w-3 h-3" />
              Dettagli
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 pt-4 pb-3">
          {/* Title Row with Compare Button */}
          <div className="mb-2 flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              {/* Primary Title - Stronger weight */}
              <h3 className="font-bold text-foreground text-lg leading-tight group-hover:text-primary transition-colors duration-200">
                {vehicle.make} {vehicle.model}
              </h3>
              
              {/* Description/Version - Lighter, better line-height */}
              {cleanVersion && (
                <p className="text-muted-foreground text-sm leading-relaxed mt-1 font-light">
                  {cleanVersion}
                </p>
              )}
              
              {/* NEOPATENTATI Badge - Small chip near title */}
              {hasNeopatentati && (
                <div className="mt-1.5">
                  <Chip variant="primary" size="sm" className="text-[10px]">
                    NEOPATENTATI
                  </Chip>
                </div>
              )}
            </div>

            {/* Compare Button - Moved to content area */}
            {showCompare && (
              <button
                className={cn(
                  "flex-shrink-0 p-1.5 rounded-md transition-all duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                  "hover:bg-muted/50",
                  isInCompare 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={handleCompareClick}
                title={isInCompare ? "Rimuovi dal confronto" : "Aggiungi al confronto"}
                aria-label={isInCompare ? "Remove from comparison" : "Add to comparison"}
              >
                <ArrowLeftRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Specs Row - Consistent icon size and spacing */}
          <div className="flex flex-wrap gap-2.5 mb-2.5">
            <Chip variant="muted" size="sm" icon={<Calendar className="w-3.5 h-3.5" />}>
              {getYear(vehicle.first_registration_date)}
            </Chip>
            <Chip variant="muted" size="sm" icon={<Gauge className="w-3.5 h-3.5" />}>
              {formatMileage(vehicle.mileage)} km
            </Chip>
            <Chip variant="muted" size="sm" icon={<Fuel className="w-3.5 h-3.5" />}>
              {translateFuelType(vehicle.fuel_type)}
            </Chip>
            {vehicle.gearbox && (
              <Chip variant="muted" size="sm" icon={<Settings2 className="w-3.5 h-3.5" />}>
                {getGearboxShort(vehicle.gearbox)}
              </Chip>
            )}
          </div>

          {/* Price and CTA Row */}
          <div className="pt-2 pb-0 border-t border-border/30 flex items-center justify-between gap-3">
            <span className="text-2xl font-bold text-primary">
              {formatPrice(vehicle.price)}
            </span>
            
            {/* Dettagli CTA - Always visible on mobile, shown in content area */}
            <span className="md:hidden inline-flex items-center gap-1.5 h-8 px-3 text-xs font-medium rounded-lg border border-border/50 text-foreground/70 group-hover:border-primary/50 group-hover:text-foreground transition-colors">
              <Eye className="w-3 h-3" />
              Dettagli
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
});

VehicleCard.displayName = "VehicleCard";
