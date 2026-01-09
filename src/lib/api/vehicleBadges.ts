import { supabase } from "@/integrations/supabase/client";

/**
 * Check if a vehicle has the "in_arrivo" badge
 */
export async function hasInArrivoBadge(adNumber: number): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("vehicle_badges")
      .select("id")
      .eq("ad_number", adNumber)
      .eq("badge_type", "in_arrivo")
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error("Error checking badge:", error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error("Error checking badge:", error);
    return false;
  }
}

/**
 * Get all vehicles with the "in_arrivo" badge
 */
export async function getInArrivoVehicles(): Promise<number[]> {
  try {
    const { data, error } = await supabase
      .from("vehicle_badges")
      .select("ad_number")
      .eq("badge_type", "in_arrivo");

    if (error) throw error;

    return data?.map(item => item.ad_number) || [];
  } catch (error) {
    console.error("Error fetching in_arrivo vehicles:", error);
    return [];
  }
}

/**
 * Add "in_arrivo" badge to a vehicle (admin only)
 */
export async function addInArrivoBadge(adNumber: number, userId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("vehicle_badges")
      .upsert({
        ad_number: adNumber,
        badge_type: "in_arrivo",
        created_by: userId,
        updated_at: new Date().toISOString()
      }, {
        onConflict: "ad_number"
      });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error adding badge:", error);
    return false;
  }
}

/**
 * Remove "in_arrivo" badge from a vehicle (admin only)
 */
export async function removeInArrivoBadge(adNumber: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("vehicle_badges")
      .delete()
      .eq("ad_number", adNumber)
      .eq("badge_type", "in_arrivo");

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error removing badge:", error);
    return false;
  }
}

/**
 * Batch check which vehicles have badges
 * Returns a Set of ad_numbers that have the badge
 */
export async function batchCheckBadges(adNumbers: number[]): Promise<Set<number>> {
  try {
    if (adNumbers.length === 0) return new Set();

    const { data, error } = await supabase
      .from("vehicle_badges")
      .select("ad_number")
      .eq("badge_type", "in_arrivo")
      .in("ad_number", adNumbers);

    if (error) throw error;

    return new Set(data?.map(item => item.ad_number) || []);
  } catch (error) {
    console.error("Error batch checking badges:", error);
    return new Set();
  }
}
