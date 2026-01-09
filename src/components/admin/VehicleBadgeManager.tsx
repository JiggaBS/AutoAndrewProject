import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { 
  Car, 
  Sparkles, 
  Search, 
  RefreshCw,
  Loader2
} from "lucide-react";
import { fetchVehicles } from "@/lib/api/vehicles";
import { Vehicle } from "@/data/sampleVehicles";
import { 
  addInArrivoBadge, 
  removeInArrivoBadge, 
  getInArrivoVehicles 
} from "@/lib/api/vehicleBadges";
import { supabase } from "@/integrations/supabase/client";

interface VehicleBadgeManagerProps {
  userId: string;
}

export function VehicleBadgeManager({ userId }: VehicleBadgeManagerProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [inArrivoAdNumbers, setInArrivoAdNumbers] = useState<Set<number>>(new Set());
  const [updating, setUpdating] = useState<number | null>(null);

  const loadVehicles = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchVehicles({ limit: 200 });
      if (response.success && response.data) {
        setVehicles(response.data);
      }
    } catch (error) {
      console.error("Error loading vehicles:", error);
      toast({
        title: "Errore",
        description: "Impossibile caricare i veicoli",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const loadBadges = useCallback(async () => {
    try {
      const adNumbers = await getInArrivoVehicles();
      setInArrivoAdNumbers(new Set(adNumbers));
    } catch (error) {
      console.error("Error loading badges:", error);
    }
  }, []);

  useEffect(() => {
    loadVehicles();
    loadBadges();
  }, [loadVehicles, loadBadges]);

  const handleToggleBadge = async (adNumber: number, hasBadge: boolean) => {
    setUpdating(adNumber);
    try {
      let success = false;
      
      if (hasBadge) {
        success = await removeInArrivoBadge(adNumber);
        if (success) {
          setInArrivoAdNumbers(prev => {
            const newSet = new Set(prev);
            newSet.delete(adNumber);
            return newSet;
          });
          toast({
            title: "Badge rimosso",
            description: `Il badge "In arrivo" è stato rimosso dal veicolo`,
          });
        }
      } else {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");
        
        success = await addInArrivoBadge(adNumber, user.id);
        if (success) {
          setInArrivoAdNumbers(prev => new Set(prev).add(adNumber));
          toast({
            title: "Badge aggiunto",
            description: `Il badge "In arrivo" è stato aggiunto al veicolo`,
          });
        }
      }

      if (!success) {
        throw new Error("Failed to update badge");
      }
    } catch (error) {
      console.error("Error toggling badge:", error);
      toast({
        title: "Errore",
        description: "Impossibile aggiornare il badge",
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      vehicle.make.toLowerCase().includes(search) ||
      vehicle.model.toLowerCase().includes(search) ||
      vehicle.ad_number.toString().includes(search) ||
      vehicle.version?.toLowerCase().includes(search)
    );
  });

  const vehiclesWithBadge = filteredVehicles.filter(v => 
    inArrivoAdNumbers.has(v.ad_number)
  ).length;

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Gestione Badge "In Arrivo"
            </CardTitle>
            <CardDescription>
              Seleziona i veicoli che devono mostrare il badge "In Arrivo"
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => {
            loadVehicles();
            loadBadges();
          }} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Aggiorna
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Stats */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cerca per marca, modello o numero annuncio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Badge variant="outline" className="text-sm shrink-0">
            {vehiclesWithBadge} con badge / {filteredVehicles.length} veicoli
          </Badge>
        </div>

        {/* Vehicles List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Car className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Nessun veicolo trovato</p>
            {searchTerm && (
              <Button 
                variant="link" 
                onClick={() => setSearchTerm("")}
                className="mt-2"
              >
                Pulisci ricerca
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {filteredVehicles.map((vehicle) => {
              const hasBadge = inArrivoAdNumbers.has(vehicle.ad_number);
              const isUpdating = updating === vehicle.ad_number;

              return (
                <div
                  key={vehicle.ad_number}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors gap-4"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                      <Car className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-sm">
                          {vehicle.make} {vehicle.model}
                        </p>
                        {hasBadge && (
                          <Badge variant="default" className="text-xs">
                            <Sparkles className="w-3 h-3 mr-1" />
                            In Arrivo
                          </Badge>
                        )}
                      </div>
                      {vehicle.version && (
                        <p className="text-xs text-muted-foreground truncate">
                          {vehicle.version}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Annuncio #{vehicle.ad_number}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 shrink-0">
                    {isUpdating ? (
                      <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                    ) : (
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`badge-${vehicle.ad_number}`} className="text-sm cursor-pointer">
                          {hasBadge ? "Rimuovi" : "Aggiungi"}
                        </Label>
                        <Switch
                          id={`badge-${vehicle.ad_number}`}
                          checked={hasBadge}
                          onCheckedChange={() => handleToggleBadge(vehicle.ad_number, hasBadge)}
                          disabled={isUpdating}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
