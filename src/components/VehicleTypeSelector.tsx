import { Car, Bike, Truck, Bus, Tv } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface VehicleTypeSelectorProps {
  selected: string;
  onSelect: (type: string) => void;
}

export function VehicleTypeSelector({ selected, onSelect }: VehicleTypeSelectorProps) {
  const { t } = useLanguage();

  const vehicleTypes = [
    { id: "car", label: t("vehicleType.car"), icon: Car },
    { id: "motorcycle", label: t("vehicleType.motorcycle"), icon: Bike },
    { id: "camper", label: t("vehicleType.camper"), icon: Bus },
    { id: "truck", label: t("vehicleType.truck"), icon: Truck },
    { id: "caravan", label: t("vehicleType.caravan"), icon: Tv },
  ];
  return (
    <div className="flex items-center justify-center bg-secondary rounded-lg p-1 gap-0.5">
      {vehicleTypes.map((type) => {
        const Icon = type.icon;
        const isSelected = selected === type.id;
        
        return (
          <button
            key={type.id}
            onClick={() => onSelect(type.id)}
            className={cn(
              "flex items-center justify-center p-3 rounded-md transition-all duration-200",
              isSelected
                ? "bg-card shadow-sm border border-border"
                : "hover:bg-card/50"
            )}
            title={type.label}
          >
            <Icon
              className={cn(
                "w-5 h-5 transition-colors",
                isSelected ? "text-primary" : "text-muted-foreground"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
