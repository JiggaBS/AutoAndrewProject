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
} from "lucide-react";
import { Vehicle } from "@/data/sampleVehicles";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { t, translateFuelType } = useLanguage();

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
    <div className="bg-card rounded-lg border border-border p-4 md:p-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {specs.map((spec, index) => {
          const Icon = spec.icon;
          return (
            <div key={index} className="spec-item flex-col items-start gap-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Icon className="w-4 h-4" />
                <span className="text-xs">{spec.label}</span>
              </div>
              <p className="font-medium text-foreground text-sm md:text-base pl-6">
                {spec.value}
              </p>
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
        <div className="mt-6 pt-4 border-t border-border">
          <h4 className="font-medium text-foreground mb-3">{t("specs.additionalDetails")}</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {vehicle.emissions_class && (
              <div className="spec-item flex-col items-start gap-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Leaf className="w-4 h-4" />
                  <span className="text-xs">{t("specs.emissionClass")}</span>
                </div>
                <p className="font-medium text-foreground text-sm pl-6">
                  {vehicle.emissions_class}
                </p>
              </div>
            )}
            {vehicle.combined_consumption && (
              <div className="spec-item flex-col items-start gap-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Droplets className="w-4 h-4" />
                  <span className="text-xs">{t("specs.combinedConsumption")}</span>
                </div>
                <p className="font-medium text-foreground text-sm pl-6">
                  {vehicle.combined_consumption}
                </p>
              </div>
            )}
            {vehicle.warranty && (
              <div className="spec-item flex-col items-start gap-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Shield className="w-4 h-4" />
                  <span className="text-xs">{t("specs.warranty")}</span>
                </div>
                <p className="font-medium text-foreground text-sm pl-6">
                  {vehicle.warranty} {t("specs.months")}
                </p>
              </div>
            )}
            {vehicle.num_seats !== undefined && vehicle.num_seats !== null && (
              <div className="spec-item flex-col items-start gap-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span className="text-xs">{t("specs.numSeats")}</span>
                </div>
                <p className="font-medium text-foreground text-sm pl-6">
                  {vehicle.num_seats}
                </p>
              </div>
            )}
            {vehicle.owners_count !== undefined && vehicle.owners_count !== null && (
              <div className="spec-item flex-col items-start gap-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span className="text-xs">{t("specs.ownersCount")}</span>
                </div>
                <p className="font-medium text-foreground text-sm pl-6">
                  {vehicle.owners_count}
                </p>
              </div>
            )}
            {vehicle.doors_count !== undefined && vehicle.doors_count !== null && (
              <div className="spec-item flex-col items-start gap-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <DoorOpen className="w-4 h-4" />
                  <span className="text-xs">{t("specs.doorsCount")}</span>
                </div>
                <p className="font-medium text-foreground text-sm pl-6">
                  {vehicle.doors_count}
                </p>
              </div>
            )}
            {vehicle.weight !== undefined && vehicle.weight !== null && (
              <div className="spec-item flex-col items-start gap-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Weight className="w-4 h-4" />
                  <span className="text-xs">{t("specs.weight")}</span>
                </div>
                <p className="font-medium text-foreground text-sm pl-6">
                  {vehicle.weight} {t("specs.kg")}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}