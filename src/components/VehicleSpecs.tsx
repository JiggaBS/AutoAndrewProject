import { useState } from "react";
import {
  Gauge,
  Settings,
  Calendar,
  Fuel,
  Zap,
  User,
  Shield,
  Leaf,
  Droplets,
  Users,
  DoorOpen,
  Weight,
  Car,
  Plus,
  Minus,
} from "lucide-react";
import { Vehicle } from "@/data/sampleVehicles";
import { useLanguage } from "@/contexts/LanguageContext";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface VehicleSpecsProps {
  vehicle: Vehicle;
}

// Helper function to detect if a value is a drive type (trazione)
function isDriveType(value: string | undefined): boolean {
  if (!value) return false;
  const driveTypes = [
    "anteriore",
    "posteriore",
    "integrale",
    "front",
    "rear",
    "all-wheel",
    "awd",
    "4wd",
    "fwd",
    "rwd",
  ];
  const lowerValue = value.toLowerCase().trim();
  return driveTypes.some((type) => lowerValue.includes(type));
}

export function VehicleSpecs({ vehicle }: VehicleSpecsProps) {
  const { t, translateFuelType, language } = useLanguage();
  const [isAdditionalDetailsOpen, setIsAdditionalDetailsOpen] = useState(false);

  // Check if transmission_type is actually a drive type
  const transmissionValue = vehicle.transmission_type || vehicle.gearbox;
  const isTransmissionDriveType = isDriveType(vehicle.transmission_type);

  const specs = [
    {
      icon: Gauge,
      label: t("specs.mileage"),
      value: `${vehicle.mileage} km`,
    },
    {
      icon: isTransmissionDriveType ? Car : Settings,
      label: isTransmissionDriveType ? t("specs.driveType") : t("specs.transmission"),
      value: transmissionValue,
    },
    {
      icon: Calendar,
      label: t("specs.year"),
      value: vehicle.first_registration_date,
    },
    {
      icon: Fuel,
      label: t("specs.fuel"),
      value: translateFuelType(vehicle.fuel_type),
    },
    {
      icon: Zap,
      label: t("specs.power"),
      value: `${vehicle.power_kw} kW (${vehicle.power_cv} CV)`,
    },
    {
      icon: Settings,
      label: t("specs.gearbox"),
      value: vehicle.gearbox || vehicle.transmission_type,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Main Specs - Card Style */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {specs.map((spec, index) => {
          const Icon = spec.icon;
          return (
            <div
              key={index}
              className="bg-white dark:bg-card rounded-lg border border-border/50 p-4 flex flex-col items-start gap-2"
            >
              <Icon className="w-5 h-5 text-foreground" />
              <p className="font-bold text-foreground text-base leading-tight">
                {spec.value}
              </p>
              <span className="text-xs text-muted-foreground">
                {spec.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Additional Specs */}
      {(vehicle.emissions_class || vehicle.combined_consumption || vehicle.warranty || 
        (vehicle.num_seats !== undefined && vehicle.num_seats !== null) ||
        (vehicle.owners_count !== undefined && vehicle.owners_count !== null) ||
        (vehicle.doors_count !== undefined && vehicle.doors_count !== null) ||
        (vehicle.weight !== undefined && vehicle.weight !== null)) && (
        <Collapsible open={isAdditionalDetailsOpen} onOpenChange={setIsAdditionalDetailsOpen}>
          <div>
            <div className="border-t border-border/50"></div>
            <CollapsibleTrigger className="w-full py-4 flex items-center justify-between hover:opacity-80 transition-opacity">
              <h4 className="font-bold text-foreground uppercase tracking-wide text-sm">
                {t("specs.additionalDetails")}
              </h4>
              {isAdditionalDetailsOpen ? (
                <Minus className="w-5 h-5 text-foreground" />
              ) : (
                <Plus className="w-5 h-5 text-foreground" />
              )}
            </CollapsibleTrigger>
            <div className="border-b border-border/50"></div>
            <CollapsibleContent className="pt-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {vehicle.emissions_class && (
              <div className="bg-white dark:bg-card rounded-lg border border-border/50 p-4 flex flex-col items-start gap-2">
                <Leaf className="w-5 h-5 text-foreground" />
                <p className="font-bold text-foreground text-base leading-tight">
                  {vehicle.emissions_class}
                </p>
                <span className="text-xs text-muted-foreground">
                  {t("specs.emissionClass")}
                </span>
              </div>
            )}
            {vehicle.combined_consumption && (
              <div className="bg-white dark:bg-card rounded-lg border border-border/50 p-4 flex flex-col items-start gap-2">
                <Droplets className="w-5 h-5 text-foreground" />
                <p className="font-bold text-foreground text-base leading-tight">
                  {vehicle.combined_consumption}
                </p>
                <span className="text-xs text-muted-foreground">
                  {t("specs.combinedConsumption")}
                </span>
              </div>
            )}
            {vehicle.warranty && (
              <div className="bg-white dark:bg-card rounded-lg border border-border/50 p-4 flex flex-col items-start gap-2">
                <Shield className="w-5 h-5 text-foreground" />
                <p className="font-bold text-foreground text-base leading-tight">
                  {vehicle.warranty} {t("specs.months")}
                </p>
                <span className="text-xs text-muted-foreground">
                  {t("specs.warranty")}
                </span>
              </div>
            )}
            {vehicle.num_seats !== undefined && vehicle.num_seats !== null && (
              <div className="bg-white dark:bg-card rounded-lg border border-border/50 p-4 flex flex-col items-start gap-2">
                <Users className="w-5 h-5 text-foreground" />
                <p className="font-bold text-foreground text-base leading-tight">
                  {vehicle.num_seats}
                </p>
                <span className="text-xs text-muted-foreground">
                  {t("specs.numSeats")}
                </span>
              </div>
            )}
            {vehicle.owners_count !== undefined && vehicle.owners_count !== null && (
              <div className="bg-white dark:bg-card rounded-lg border border-border/50 p-4 flex flex-col items-start gap-2">
                <User className="w-5 h-5 text-foreground" />
                <p className="font-bold text-foreground text-base leading-tight">
                  {vehicle.owners_count}
                </p>
                <span className="text-xs text-muted-foreground">
                  {t("specs.ownersCount")}
                </span>
              </div>
            )}
            {vehicle.doors_count !== undefined && vehicle.doors_count !== null && (
              <div className="bg-white dark:bg-card rounded-lg border border-border/50 p-4 flex flex-col items-start gap-2">
                <DoorOpen className="w-5 h-5 text-foreground" />
                <p className="font-bold text-foreground text-base leading-tight">
                  {vehicle.doors_count}
                </p>
                <span className="text-xs text-muted-foreground">
                  {t("specs.doorsCount")}
                </span>
              </div>
            )}
            {vehicle.weight !== undefined && vehicle.weight !== null && (
              <div className="bg-white dark:bg-card rounded-lg border border-border/50 p-4 flex flex-col items-start gap-2">
                <Weight className="w-5 h-5 text-foreground" />
                <p className="font-bold text-foreground text-base leading-tight">
                  {vehicle.weight} {t("specs.kg")}
                </p>
                <span className="text-xs text-muted-foreground">
                  {t("specs.weight")}
                </span>
              </div>
            )}
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      )}
    </div>
  );
}