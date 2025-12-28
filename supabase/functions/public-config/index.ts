import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Get CORS headers with origin validation
function getCorsHeaders(req: Request): Record<string, string> {
  const allowedOrigins = Deno.env.get("ALLOWED_ORIGINS")?.split(",").map(o => o.trim()) || [];
  const origin = req.headers.get("origin");
  
  // In development, allow all origins if ALLOWED_ORIGINS is not set
  // In production, only allow configured origins
  const corsOrigin = allowedOrigins.length > 0 && origin && allowedOrigins.includes(origin)
    ? origin
    : allowedOrigins.length > 0
    ? allowedOrigins[0] // Fallback to first allowed origin
    : "*"; // Development fallback
  
  return {
    "Access-Control-Allow-Origin": corsOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Credentials": "true",
  };
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Public, safe-to-expose config for the frontend
    const gaMeasurementId = Deno.env.get("VITE_GA_MEASUREMENT_ID") ?? null;

    const supabaseUrl =
      Deno.env.get("VITE_SUPABASE_URL") ??
      Deno.env.get("SUPABASE_URL") ??
      null;

    const supabasePublishableKey =
      Deno.env.get("VITE_SUPABASE_PUBLISHABLE_KEY") ??
      Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ??
      Deno.env.get("SUPABASE_ANON_KEY") ??
      null;

    if (!gaMeasurementId) console.warn("VITE_GA_MEASUREMENT_ID not configured");
    if (!supabaseUrl) console.warn("SUPABASE_URL not configured");
    if (!supabasePublishableKey) console.warn("SUPABASE_PUBLISHABLE_KEY not configured");

    return new Response(
      JSON.stringify({ gaMeasurementId, supabaseUrl, supabasePublishableKey }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in public-config:", error);
    return new Response(
      JSON.stringify({ gaMeasurementId: null, supabaseUrl: null, supabasePublishableKey: null }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
