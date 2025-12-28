import { supabase } from "@/integrations/supabase/client";
import { Vehicle } from "@/data/sampleVehicles";

interface FetchVehiclesOptions {
  engine?: string;
  make?: string;
  model?: string;
  vehicle_class?: string;
  category?: string;
  limit?: number;
  sort?: string;
  invert?: string;
}

interface FetchVehiclesResponse {
  success: boolean;
  data?: Vehicle[];
  count?: number;
  error?: string;
}

export async function fetchVehicles(options: FetchVehiclesOptions = {}): Promise<FetchVehiclesResponse> {
  try {
    const { data, error } = await supabase.functions.invoke("fetch-vehicles", {
      body: options,
    });

    // If the function returns non-2xx, Supabase will surface it here.
    // Always return a safe shape to avoid UI crashes.
    if (error) {
      console.error("Error invoking fetch-vehicles:", error);
      return { success: false, data: [], count: 0, error: error.message };
    }

    const payload = (data as FetchVehiclesResponse) || { success: false };

    return {
      success: !!payload.success,
      data: payload.data ?? [],
      count: payload.count ?? (payload.data?.length ?? 0),
      error: payload.error,
    };
  } catch (err) {
    console.error("Error fetching vehicles:", err);
    return {
      success: false,
      data: [],
      count: 0,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

export async function fetchVehicleById(id: number): Promise<Vehicle | null> {
  const response = await fetchVehicles({ limit: 100 });
  
  if (!response.success || !response.data) {
    return null;
  }

  return response.data.find((v) => v.ad_number === id) || null;
}
