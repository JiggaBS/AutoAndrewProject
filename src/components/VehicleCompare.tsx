import { useState } from "react";
import { X, Plus, ArrowLeftRight, Fuel, Gauge, Calendar, Settings2 } from "lucide-react";
import { Vehicle } from "@/data/sampleVehicles";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface VehicleCompareProps {
  vehicles: Vehicle[];
  selectedVehicles: Vehicle[];
  onAddVehicle: (vehicle: Vehicle) => void;
  onRemoveVehicle: (adNumber: number) => void;
  onClear: () => void;
}

export function VehicleCompare({
  vehicles,
  selectedVehicles,
  onAddVehicle,
  onRemoveVehicle,
  onClear,
}: VehicleCompareProps) {
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const availableVehicles = vehicles.filter(
    (v) => !selectedVehicles.find((sv) => sv.ad_number === v.ad_number)
  );

  if (selectedVehicles.length === 0) {
    return null;
  }

  return (
    <>
      {/* Floating Compare Bar */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 animate-fade-in">
        <div className="bg-card border border-border rounded-2xl shadow-2xl shadow-primary/20 p-4 flex items-center gap-4">
          {/* Selected Vehicles Preview */}
          <div className="flex items-center gap-2">
            {selectedVehicles.map((vehicle) => (
              <div
                key={vehicle.ad_number}
                className="relative group"
              >
                <img
                  src={vehicle.images[0]}
                  alt={vehicle.title}
                  className="w-14 h-10 rounded-lg object-cover border-2 border-border"
                />
                <button
                  onClick={() => onRemoveVehicle(vehicle.ad_number)}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            {/* Add More Button */}
            {selectedVehicles.length < 3 && (
              <Dialog open={isSelectOpen} onOpenChange={setIsSelectOpen}>
                <DialogTrigger asChild>
                  <button className="w-14 h-10 rounded-lg border-2 border-dashed border-border hover:border-primary flex items-center justify-center transition-colors">
                    <Plus className="w-5 h-5 text-muted-foreground" />
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Aggiungi veicolo al confronto</DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="grid grid-cols-2 gap-3">
                      {availableVehicles.map((vehicle) => (
                        <button
                          key={vehicle.ad_number}
                          onClick={() => {
                            onAddVehicle(vehicle);
                            setIsSelectOpen(false);
                          }}
                          className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all text-left"
                        >
                          <img
                            src={vehicle.images[0]}
                            alt={vehicle.title}
                            className="w-16 h-12 rounded object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-foreground truncate">
                              {vehicle.make} {vehicle.model}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatPrice(vehicle.price)}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* Divider */}
          <div className="w-px h-8 bg-border" />

          {/* Actions */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {selectedVehicles.length}/3
            </span>

            <Dialog open={isCompareOpen} onOpenChange={setIsCompareOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                  <ArrowLeftRight className="w-4 h-4" />
                  Confronta
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <ArrowLeftRight className="w-5 h-5 text-primary" />
                    Confronto Veicoli
                  </DialogTitle>
                </DialogHeader>
                <CompareTable vehicles={selectedVehicles} formatPrice={formatPrice} />
              </DialogContent>
            </Dialog>

            <Button variant="ghost" size="sm" onClick={onClear}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

function CompareTable({
  vehicles,
  formatPrice,
}: {
  vehicles: Vehicle[];
  formatPrice: (price: number) => string;
}) {
  const specs = [
    { key: "price", label: "Prezzo", render: (v: Vehicle) => formatPrice(v.price) },
    { key: "year", label: "Immatricolazione", render: (v: Vehicle) => v.first_registration_date },
    { key: "mileage", label: "Chilometraggio", render: (v: Vehicle) => `${v.mileage} km` },
    { key: "fuel", label: "Alimentazione", render: (v: Vehicle) => v.fuel_type },
    { key: "power", label: "Potenza", render: (v: Vehicle) => `${v.power_cv} CV (${v.power_kw} kW)` },
    { key: "gearbox", label: "Cambio", render: (v: Vehicle) => v.gearbox },
    { key: "color", label: "Colore", render: (v: Vehicle) => `${v.color} ${v.color_type}` },
    { key: "category", label: "Categoria", render: (v: Vehicle) => v.vehicle_category },
    { key: "consumption", label: "Consumo", render: (v: Vehicle) => v.combined_consumption || "N/D" },
    { key: "emissions", label: "Classe Emissioni", render: (v: Vehicle) => v.emissions_class || "N/D" },
    { key: "warranty", label: "Garanzia", render: (v: Vehicle) => v.warranty ? `${v.warranty} mesi` : "N/D" },
  ];

  return (
    <div className="mt-4">
      {/* Vehicle Headers */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${vehicles.length}, 1fr)` }}>
        <div /> {/* Empty corner cell */}
        {vehicles.map((vehicle) => (
          <div key={vehicle.ad_number} className="text-center">
            <img
              src={vehicle.images[0]}
              alt={vehicle.title}
              className="w-full aspect-[4/3] object-cover rounded-lg mb-3"
            />
            <h3 className="font-semibold text-foreground">
              {vehicle.make} {vehicle.model}
            </h3>
            <p className="text-sm text-muted-foreground">{vehicle.version}</p>
          </div>
        ))}
      </div>

      {/* Specs Table */}
      <div className="mt-6 space-y-1">
        {specs.map((spec, index) => (
          <div
            key={spec.key}
            className={cn(
              "grid gap-4 py-3 px-4 rounded-lg",
              index % 2 === 0 ? "bg-secondary/50" : ""
            )}
            style={{ gridTemplateColumns: `200px repeat(${vehicles.length}, 1fr)` }}
          >
            <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              {spec.key === "fuel" && <Fuel className="w-4 h-4" />}
              {spec.key === "mileage" && <Gauge className="w-4 h-4" />}
              {spec.key === "year" && <Calendar className="w-4 h-4" />}
              {spec.key === "gearbox" && <Settings2 className="w-4 h-4" />}
              {spec.label}
            </span>
            {vehicles.map((vehicle) => (
              <span
                key={vehicle.ad_number}
                className={cn(
                  "text-sm text-center",
                  spec.key === "price" ? "font-bold text-primary" : "text-foreground"
                )}
              >
                {spec.render(vehicle)}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// Hook for managing compare state
export function useVehicleCompare() {
  const [selectedVehicles, setSelectedVehicles] = useState<Vehicle[]>([]);

  const addVehicle = (vehicle: Vehicle) => {
    if (selectedVehicles.length < 3 && !selectedVehicles.find((v) => v.ad_number === vehicle.ad_number)) {
      setSelectedVehicles([...selectedVehicles, vehicle]);
    }
  };

  const removeVehicle = (adNumber: number) => {
    setSelectedVehicles(selectedVehicles.filter((v) => v.ad_number !== adNumber));
  };

  const clearAll = () => {
    setSelectedVehicles([]);
  };

  const isSelected = (adNumber: number) => {
    return selectedVehicles.some((v) => v.ad_number === adNumber);
  };

  return {
    selectedVehicles,
    addVehicle,
    removeVehicle,
    clearAll,
    isSelected,
  };
}
