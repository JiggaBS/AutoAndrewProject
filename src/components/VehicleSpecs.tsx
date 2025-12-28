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
} from "lucide-react";
import { Vehicle } from "@/data/sampleVehicles";
import { useLanguage } from "@/contexts/LanguageContext";

interface VehicleSpecsProps {
  vehicle: Vehicle;
}

export function VehicleSpecs({ vehicle }: VehicleSpecsProps) {
  const { t } = useLanguage();

  const specs = [
    {
      icon: Gauge,
      label: t("specs.mileage"),
      value: `${vehicle.mileage} km`,
    },
    {
      icon: Settings,
      label: t("specs.transmission"),
      value: vehicle.transmission_type || vehicle.gearbox,
    },
    {
      icon: Calendar,
      label: t("specs.year"),
      value: vehicle.first_registration_date,
    },
    {
      icon: Fuel,
      label: t("specs.fuel"),
      value: vehicle.fuel_type,
    },
    {
      icon: Zap,
      label: t("specs.power"),
      value: `${vehicle.power_kw} kW (${vehicle.power_cv} CV)`,
    },
    {
      icon: User,
      label: t("specs.seller"),
      value: t("specs.dealer"),
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
      {(vehicle.emissions_class || vehicle.combined_consumption || vehicle.warranty) && (
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
          </div>
        </div>
      )}
    </div>
  );
}