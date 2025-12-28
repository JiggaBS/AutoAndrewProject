import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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

interface NotificationRequest {
  type: "new_valuation";
  data: {
    name: string;
    email: string;
    phone: string;
    make: string;
    model: string;
    year: number;
    estimated_value: number | null;
  };
}

const handler = async (req: Request): Promise<Response> => {
  const corsHeaders = getCorsHeaders(req);
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, data }: NotificationRequest = await req.json();

    const adminEmail = Deno.env.get("ADMIN_EMAIL") || "admin@example.com";

    if (type === "new_valuation") {
      const emailResponse = await resend.emails.send({
        from: "AutoValutazioni <onboarding@resend.dev>",
        to: [adminEmail],
        subject: `Nuova Valutazione: ${escapeHtml(data.make)} ${escapeHtml(data.model)}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #f97316;">Nuova Richiesta di Valutazione</h1>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="margin-top: 0;">${escapeHtml(data.make)} ${escapeHtml(data.model)} (${data.year})</h2>
              ${data.estimated_value ? `<p style="font-size: 24px; color: #22c55e; font-weight: bold;">Stima: €${data.estimated_value.toLocaleString()}</p>` : ""}
            </div>
            <h3>Contatto:</h3>
            <ul>
              <li><strong>Nome:</strong> ${escapeHtml(data.name)}</li>
              <li><strong>Email:</strong> <a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></li>
              <li><strong>Telefono:</strong> <a href="tel:${escapeHtml(data.phone)}">${escapeHtml(data.phone)}</a></li>
            </ul>
            <p style="margin-top: 30px;">
              <a href="https://tuodominio.com/admin" style="background: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                Vai al Pannello Admin
              </a>
            </p>
          </div>
        `,
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in notify-admin function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
