import { supabase } from "@/integrations/supabase/client";
import { Vehicle } from "@/data/sampleVehicles";
import { toast } from "@/hooks/use-toast";

export async function saveVehicle(vehicle: Vehicle): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        description: "Devi effettuare il login per salvare i veicoli",
        variant: "destructive",
      });
      return false;
    }

    const { error } = await supabase
      .from("saved_vehicles")
      .insert({
        user_id: user.id,
        vehicle_data: vehicle as unknown as Record<string, unknown>,
      });

    if (error) {
      // If it's a duplicate, still consider it successful
      if (error.code === "23505") {
        toast({
          title: "Già salvato",
          description: "Questo veicolo è già nei tuoi preferiti",
        });
        return true;
      }
      throw error;
    }

    toast({
      title: "Salvato!",
      description: "Veicolo aggiunto ai preferiti",
    });
    return true;
  } catch (error) {
    console.error("Error saving vehicle:", error);
    toast({
      title: "Errore",
      description: "Impossibile salvare il veicolo",
      variant: "destructive",
    });
    return false;
  }
}

export async function unsaveVehicle(vehicle: Vehicle): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return false;
    }

    const result = await supabase
      .from("saved_vehicles")
      .delete()
      .eq("user_id", user.id)
      .eq("vehicle_data->>ad_number", vehicle.ad_number.toString());
    const { error } = result;

    if (error) throw error;

    toast({
      title: "Rimosso",
      description: "Veicolo rimosso dai preferiti",
    });
    return true;
  } catch (error) {
    console.error("Error unsaving vehicle:", error);
    toast({
      title: "Errore",
      description: "Impossibile rimuovere il veicolo",
      variant: "destructive",
    });
    return false;
  }
}

export async function isVehicleSaved(vehicle: Vehicle): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return false;
    }

    const result = await supabase
      .from("saved_vehicles")
      .select("id")
      .eq("user_id", user.id)
      .eq("vehicle_data->>ad_number", vehicle.ad_number.toString())
      .maybeSingle();
    const { data, error } = result;

    if (error && error.code !== "PGRST116") { // PGRST116 = no rows returned
      throw error;
    }

    return !!data;
  } catch (error) {
    console.error("Error checking if vehicle is saved:", error);
    return false;
  }
}

