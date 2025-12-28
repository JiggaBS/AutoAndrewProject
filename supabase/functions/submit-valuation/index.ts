import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

// Get CORS headers with origin validation
function getCorsHeaders(req: Request): Record<string, string> {
  const allowedOrigins = Deno.env.get("ALLOWED_ORIGINS")?.split(",").map(o => o.trim()) || [];
  const origin = req.headers.get("origin");
  
  // Security: Never use wildcard in production
  // Only allow configured origins or fail
  let corsOrigin: string | null = null;
  
  if (allowedOrigins.length > 0) {
    // Check if origin is in allowed list
    if (origin && allowedOrigins.includes(origin)) {
      corsOrigin = origin;
    } else if (allowedOrigins.length === 1) {
      // Single allowed origin - use it even if origin header doesn't match
      corsOrigin = allowedOrigins[0];
    }
  }
  
  // If no valid origin found, return minimal headers (will reject request)
  if (!corsOrigin) {
    return {
      "Access-Control-Allow-Origin": "null", // Explicitly reject
      "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    };
  }
  
  return {
    "Access-Control-Allow-Origin": corsOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Max-Age": "86400", // 24 hours
  };
}

// Escape HTML to prevent XSS in email templates
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

// Helpers to accept numeric strings (e.g. "12.333") as integers
const preprocessInt = (v: unknown) => {
  if (typeof v === "string") {
    const cleaned = v.replace(/[^\d-]/g, "");
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : v;
  }
  return v;
};

const preprocessOptionalNullableInt = (v: unknown) => {
  if (v === "") return null;
  if (v === null) return null;
  if (v === undefined) return undefined;
  return preprocessInt(v);
};

// Zod validation schema
const valuationRequestSchema = z.object({
  make: z.string().min(1).max(50),
  model: z.string().min(1).max(50),
  year: z.preprocess(
    preprocessInt,
    z.number().int().min(1900).max(new Date().getFullYear() + 1),
  ),
  fuel_type: z.enum(["Benzina", "Diesel", "GPL", "Metano", "Elettrica", "Ibrida"]),
  mileage: z.preprocess(preprocessInt, z.number().int().min(0).max(10000000)),
  condition: z.enum(["excellent", "good", "fair", "poor"]),
  price: z
    .preprocess(
      preprocessOptionalNullableInt,
      z.number().int().min(0).max(10000000).nullable(),
    )
    .optional(),
  name: z.string().min(2).max(100),
  email: z.string().email().max(255),
  phone: z.string().min(9).max(20).regex(/^[\d\s\+\-\(\)]+$/),
  notes: z.string().max(500).optional().nullable(),
  estimated_value: z
    .preprocess(
      preprocessOptionalNullableInt,
      z.number().int().min(0).max(10000000).nullable(),
    )
    .optional(),
  images: z.array(z.string()).max(10).optional(),
  user_id: z.string().uuid().optional().nullable(),
});

interface ValuationRequest {
  make: string;
  model: string;
  year: number;
  fuel_type: string;
  mileage: number;
  condition: string;
  price?: number | null;
  name: string;
  email: string;
  phone: string;
  notes?: string;
  estimated_value?: number;
  images?: string[];
  user_id?: string | null; // Optional user ID if logged in
}

const handler = async (req: Request): Promise<Response> => {
  const corsHeaders = getCorsHeaders(req);
  
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error("RESEND_API_KEY not configured");
    }
    const resend = resendApiKey ? new Resend(resendApiKey) : null;

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY", { supabaseUrl: !!supabaseUrl, supabaseKey: !!supabaseKey });
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const rawData = await req.json();

    // Validate with Zod schema
    const validationResult = valuationRequestSchema.safeParse(rawData);
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          error: "Validation failed",
          details: validationResult.error.errors.map((e) => ({
            path: e.path.join("."),
            message: e.message,
          })),
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }
    const data = validationResult.data;

    // Prepare the insert object
    const insertObject = {
      make: data.make,
      model: data.model,
      year: data.year,
      fuel_type: data.fuel_type,
      mileage: data.mileage,
      condition: data.condition,
      price: data.price ?? null,
      name: data.name,
      email: data.email,
      phone: data.phone,
      notes: data.notes ?? null,
      estimated_value: data.estimated_value ?? null,
      images: data.images ?? [],
      status: "pending",
    };

    // Save to database
    const { data: insertedData, error: dbError } = await supabase
      .from("valuation_requests")
      .insert(insertObject)
      .select()
      .maybeSingle();

    if (dbError) {
      console.error("Database error:", dbError);
      throw new Error("Errore salvataggio richiesta");
    }

    if (!insertedData) {
      console.error("Database error: insert returned no row");
      throw new Error("Errore salvataggio richiesta");
    }

    // Format condition label
    const conditionLabels: Record<string, string> = {
      excellent: "Ottime condizioni",
      good: "Buone condizioni",
      fair: "Condizioni discrete",
      poor: "Da revisionare",
    };

    // Send notification email to dealer (with HTML escaping)
    const dealerEmailHtml = `
      <h1>Nuova Richiesta di Valutazione Auto</h1>
      <h2>Dati Veicolo</h2>
      <ul>
        <li><strong>Marca:</strong> ${escapeHtml(data.make)}</li>
        <li><strong>Modello:</strong> ${escapeHtml(data.model)}</li>
        <li><strong>Anno:</strong> ${data.year}</li>
        <li><strong>Carburante:</strong> ${escapeHtml(data.fuel_type)}</li>
        <li><strong>Chilometraggio:</strong> ${data.mileage.toLocaleString("it-IT")} km</li>
        <li><strong>Condizioni:</strong> ${escapeHtml(conditionLabels[data.condition] || data.condition)}</li>
      </ul>
      ${data.price ? `<p><strong>Prezzo Desiderato:</strong> €${data.price.toLocaleString("it-IT")}</p>` : ""}
      ${data.estimated_value ? `<p><strong>Stima Automatica:</strong> €${data.estimated_value.toLocaleString("it-IT")}</p>` : ""}
      
      <h2>Dati Contatto</h2>
      <ul>
        <li><strong>Nome:</strong> ${escapeHtml(data.name)}</li>
        <li><strong>Email:</strong> ${escapeHtml(data.email)}</li>
        <li><strong>Telefono:</strong> ${escapeHtml(data.phone)}</li>
      </ul>
      ${data.notes ? `<p><strong>Note:</strong> ${escapeHtml(data.notes)}</p>` : ""}
      ${data.images && data.images.length > 0 ? `<p><strong>Foto allegate:</strong> ${data.images.length}</p>` : ""}
      
      <p style="margin-top: 20px; color: #666;">
        ID Richiesta: ${insertedData.id}
      </p>
    `;

    // Send confirmation email to customer (with HTML escaping)
    const customerEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1a1a1a;">Grazie per la tua richiesta!</h1>
        <p>Ciao ${escapeHtml(data.name)},</p>
        <p>Abbiamo ricevuto la tua richiesta di valutazione per:</p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <strong>${escapeHtml(data.make)} ${escapeHtml(data.model)}</strong><br>
          Anno: ${data.year}<br>
          Km: ${data.mileage.toLocaleString("it-IT")}
        </div>
        ${data.estimated_value ? `<p>La tua stima indicativa: <strong>€${data.estimated_value.toLocaleString("it-IT")}</strong></p>` : ""}
        <p>Ti contatteremo entro <strong>24 ore</strong> con la nostra valutazione definitiva.</p>
        <p style="margin-top: 30px;">A presto,<br><strong>AutoAndrew</strong></p>
      </div>
    `;

    // Send emails (only if resend is configured)
    if (resend) {
      try {
        const dealerEmail = Deno.env.get("DEALER_EMAIL") || "gajanovsa@gmail.com";
        await Promise.all([
          // Email to dealer
          resend.emails.send({
            from: "AutoAndrew <onboarding@resend.dev>",
            to: [dealerEmail],
            subject: `Nuova valutazione: ${data.make} ${data.model} ${data.year}`,
            html: dealerEmailHtml,
          }),
          // Confirmation to customer
          resend.emails.send({
            from: "AutoAndrew <onboarding@resend.dev>",
            to: [data.email],
            subject: "Abbiamo ricevuto la tua richiesta di valutazione",
            html: customerEmailHtml,
          }),
        ]);
      } catch (emailError) {
        console.error("Email error:", emailError);
        // Don't fail the request if email fails - data is saved
      }
    } else {
      console.warn("Resend not configured - skipping email notifications");
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Richiesta inviata con successo",
        id: insertedData.id,
        savedPrice: insertedData.price,  // Debug: return saved price
        debug: { priceReceived: rawData.price, priceSaved: insertedData.price }
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in submit-valuation:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Errore interno" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
