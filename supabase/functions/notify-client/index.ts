import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

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
      "Access-Control-Allow-Methods": "POST, OPTIONS",
    };
  }
  
  return {
    "Access-Control-Allow-Origin": corsOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
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

interface NotifyClientRequest {
  request_id: string;
  client_email: string;
  client_name: string;
  vehicle: string;
  tracking_code: string;
  final_offer?: number | null;
  appointment_date?: string | null;
  message?: string | null;
  site_url: string;
}

const handler = async (req: Request): Promise<Response> => {
  const corsHeaders = getCorsHeaders(req);
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error("RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const resend = new Resend(resendApiKey);
    const data: NotifyClientRequest = await req.json();

    const {
      client_email,
      client_name,
      vehicle,
      tracking_code,
      final_offer,
      appointment_date,
      message,
      site_url,
    } = data;

    if (!client_email || !client_name || !vehicle || !tracking_code) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const trackingUrl = `${site_url}/traccia-richiesta`;

    // Format appointment date if provided
    let appointmentText = "";
    if (appointment_date) {
      const date = new Date(appointment_date);
      appointmentText = date.toLocaleString("it-IT", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    // Format offer if provided
    let offerText = "";
    if (final_offer) {
      offerText = new Intl.NumberFormat("it-IT", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0,
      }).format(final_offer);
    }

    // Escape all user-provided data to prevent XSS
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #1a1a1a; margin-bottom: 20px;">Aggiornamento sulla tua richiesta</h1>
        
        <p>Ciao <strong>${escapeHtml(client_name)}</strong>,</p>
        
        <p>Abbiamo aggiornamenti riguardo alla tua richiesta di valutazione per:</p>
        
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <strong style="font-size: 18px;">${escapeHtml(vehicle)}</strong><br>
          <span style="color: #666;">Codice Pratica: <strong>${escapeHtml(tracking_code)}</strong></span>
        </div>

        ${offerText ? `
        <div style="background: #fff3e0; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ff9800;">
          <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">La Nostra Offerta:</p>
          <p style="margin: 0; font-size: 28px; font-weight: bold; color: #e65100;">${escapeHtml(offerText)}</p>
        </div>
        ` : ""}

        ${appointmentText ? `
        <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2196f3;">
          <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">📅 Appuntamento Fissato:</p>
          <p style="margin: 0; font-size: 18px; font-weight: bold; color: #1565c0;">${escapeHtml(appointmentText)}</p>
        </div>
        ` : ""}

        ${message ? `
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">💬 Messaggio dal Concessionario:</p>
          <p style="margin: 0; color: #333; line-height: 1.6;">${escapeHtml(message).replace(/\n/g, "<br>")}</p>
        </div>
        ` : ""}

        <div style="margin: 30px 0; text-align: center;">
          <a href="${escapeHtml(trackingUrl)}" style="display: inline-block; background: #ff6b00; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
            Controlla lo Stato della Pratica
          </a>
        </div>

        <p style="color: #666; font-size: 14px;">
          Puoi controllare lo stato della tua richiesta in qualsiasi momento inserendo il codice pratica 
          <strong>${escapeHtml(tracking_code)}</strong> nella pagina di tracking.
        </p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        
        <p style="color: #999; font-size: 12px;">
          Questa email è stata inviata automaticamente da AutoMarket.<br>
          Se hai domande, rispondi a questa email o contattaci direttamente.
        </p>
      </div>
    `;

    const { error: emailError } = await resend.emails.send({
      from: "AutoMarket <onboarding@resend.dev>",
      to: [client_email],
      subject: `Aggiornamento: ${vehicle} - Pratica #${tracking_code}`,
      html: emailHtml,
    });

    if (emailError) {
      console.error("Email send error:", emailError);
      throw new Error(emailError.message);
    }

    console.log(`Email sent to ${client_email} for request ${tracking_code}`);

    return new Response(
      JSON.stringify({ success: true, message: "Email sent successfully" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error in notify-client:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
