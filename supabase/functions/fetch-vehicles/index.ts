import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Get CORS headers with origin validation
function getCorsHeaders(req: Request): Record<string, string> {
  const allowedOrigins = Deno.env.get("ALLOWED_ORIGINS")?.split(",").map(o => o.trim()) || [];
  const origin = req.headers.get("origin");
  
  // Security: Never use wildcard in production
  // Only allow configured origins or fail
  let corsOrigin: string | null = null;
  
  // Allow localhost for development (when ALLOWED_ORIGINS is not set or empty)
  const isLocalhost = origin && (
    origin.startsWith("http://localhost:") || 
    origin.startsWith("http://127.0.0.1:")
  );
  
  if (allowedOrigins.length > 0) {
    // Check if origin is in allowed list
    if (origin && allowedOrigins.includes(origin)) {
      corsOrigin = origin;
    } else if (allowedOrigins.length === 1) {
      // Single allowed origin - use it even if origin header doesn't match
      corsOrigin = allowedOrigins[0];
    } else if (isLocalhost) {
      // Allow localhost if explicitly in allowed list
      if (allowedOrigins.some(o => o.includes("localhost") || o.includes("127.0.0.1"))) {
        corsOrigin = origin;
      }
    }
  } else {
    // No ALLOWED_ORIGINS configured - allow localhost for development
    if (isLocalhost) {
      corsOrigin = origin;
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

interface Vehicle {
  ad_number: number;
  vehicle_type: string;
  title: string;
  make: string;
  model: string;
  version: string;
  vehicle_class: string;
  vehicle_category: string;
  damaged: boolean;
  first_registration_date: string;
  mileage: string;
  power_kw: number;
  power_cv: number;
  transmission_type: string;
  gearbox: string;
  fuel_type: string;
  color: string;
  color_type: string;
  price: number;
  vat_reclaimable: boolean;
  description: string;
  company_logo: string;
  images_number: number;
  images: string[];
  dealer_name?: string;
  dealer_city?: string;
  dealer_region?: string;
  dealer_phone?: string;
  is_new?: boolean;
  combined_consumption?: string;
  emissions_class?: string;
  warranty?: number;
  num_seats?: number;
  owners_count?: number;
  doors_count?: number;
  weight?: number;
  cubic_capacity?: number; // Engine displacement in cubic centimeters (cc)
}

function stripCDATA(text: string): string {
  // Remove CDATA wrapper: <![CDATA[content]]> -> content
  return text.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, '$1').trim();
}

function getTagContent(xml: string, tagName: string): string {
  const regex = new RegExp(`<${tagName}>([\\s\\S]*?)</${tagName}>`, 'i');
  const match = xml.match(regex);
  if (!match) return '';
  // Strip CDATA and clean the content
  return stripCDATA(match[1].trim());
}

function parseIntOrUndefined(value: string): number | undefined {
  if (!value || value.trim() === '') return undefined;
  const parsed = parseInt(value);
  return isNaN(parsed) ? undefined : parsed;
}

function getImagesArray(elementXml: string): string[] {
  const images: string[] = [];
  const imagesMatch = elementXml.match(/<images>([\s\S]*?)<\/images>/i);

  if (!imagesMatch) return images;

  const imagesContent = stripCDATA(imagesMatch[1]);

  // Preferred: <images><element>URL</element>...</images>
  const elementRegex = /<element>([\s\S]*?)<\/element>/gi;
  let match;
  while ((match = elementRegex.exec(imagesContent)) !== null) {
    let imgUrl = stripCDATA(match[1]).replace(/\s+/g, '');
    imgUrl = imgUrl.replace(/&amp;/g, '&').replace(/&#38;/g, '&');

    if (imgUrl && imgUrl.startsWith('http')) {
      images.push(imgUrl);
    }
  }

  // Fallback: if provider uses different tags, extract all http(s) URLs inside <images>...
  if (images.length === 0) {
    const urls = imagesContent.match(/https?:\/\/[^\s<>"']+/g) ?? [];
    for (const raw of urls) {
      let imgUrl = stripCDATA(raw).replace(/\s+/g, '');
      imgUrl = imgUrl.replace(/&amp;/g, '&').replace(/&#38;/g, '&');
      if (imgUrl.startsWith('http')) images.push(imgUrl);
    }
  }

  // Dedupe
  return Array.from(new Set(images));
}

function extractTopLevelElements(xmlText: string): string[] {
  // Extract contents of <root> if present
  const rootMatch = xmlText.match(/<root>([\s\S]*)<\/root>/i);
  const content = rootMatch ? rootMatch[1] : xmlText;

  const elements: string[] = [];
  const tagRegex = /<\/?element>/gi;

  let depth = 0;
  let startIndex = -1;
  let match: RegExpExecArray | null;

  while ((match = tagRegex.exec(content)) !== null) {
    const tag = match[0].toLowerCase();

    if (tag === '<element>') {
      if (depth === 0) startIndex = match.index;
      depth += 1;
      continue;
    }

    // </element>
    depth = Math.max(0, depth - 1);

    if (depth === 0 && startIndex >= 0) {
      const endIndex = match.index + match[0].length;
      elements.push(content.slice(startIndex, endIndex));
      startIndex = -1;
    }
  }

  return elements;
}

function parseXmlToVehicles(xmlText: string): Vehicle[] {
  const vehicles: Vehicle[] = [];

  const topLevelElements = extractTopLevelElements(xmlText);

  for (const elementXml of topLevelElements) {
    // Vehicle entries have an ad_number
    if (!elementXml.includes('<ad_number>')) continue;

    const images = getImagesArray(elementXml);
    const companyLogo = getTagContent(elementXml, 'company_logo');

    const vehicle: Vehicle = {
      ad_number: parseInt(getTagContent(elementXml, 'ad_number')) || 0,
      vehicle_type: getTagContent(elementXml, 'vehicle_type'),
      title: getTagContent(elementXml, 'title'),
      make: getTagContent(elementXml, 'make'),
      model: getTagContent(elementXml, 'model'),
      version: getTagContent(elementXml, 'version'),
      vehicle_class: getTagContent(elementXml, 'vehicle_class'),
      vehicle_category: getTagContent(elementXml, 'vehicle_category'),
      damaged:
        getTagContent(elementXml, 'damaged').toLowerCase() === 'true' ||
        getTagContent(elementXml, 'damaged') === '1',
      first_registration_date: getTagContent(elementXml, 'first_registration_date'),
      mileage: getTagContent(elementXml, 'mileage'),
      power_kw: parseInt(getTagContent(elementXml, 'power_kw')) || 0,
      power_cv: parseInt(getTagContent(elementXml, 'power_cv')) || 0,
      transmission_type:
        getTagContent(elementXml, 'transmission_type') || getTagContent(elementXml, 'gearbox'),
      gearbox: getTagContent(elementXml, 'gearbox'),
      fuel_type: getTagContent(elementXml, 'fuel_type'),
      color: getTagContent(elementXml, 'color'),
      color_type: getTagContent(elementXml, 'color_type'),
      price:
        parseFloat(getTagContent(elementXml, 'price').replace(/\./g, '').replace(',', '.')) || 0,
      vat_reclaimable:
        getTagContent(elementXml, 'vat_reclaimable').toLowerCase() === 'true' ||
        getTagContent(elementXml, 'vat_reclaimable') === '1',
      description: getTagContent(elementXml, 'description')
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim(),
      company_logo: companyLogo,
      images_number: parseInt(getTagContent(elementXml, 'images_number')) || images.length,
      images: images.length > 0 ? images : (companyLogo ? [companyLogo] : []),
      dealer_name: getTagContent(elementXml, 'name'),
      dealer_city: getTagContent(elementXml, 'city'),
      dealer_region: getTagContent(elementXml, 'region'),
      dealer_phone: getTagContent(elementXml, 'phone'),
      is_new: getTagContent(elementXml, 'vehicle_class').toLowerCase().includes('nuov'),
      combined_consumption: getTagContent(elementXml, 'combined_consumption'),
      emissions_class: getTagContent(elementXml, 'emissions_class'),
      warranty: parseInt(getTagContent(elementXml, 'warranty')) || 0,
      num_seats: parseIntOrUndefined(getTagContent(elementXml, 'num_seats')),
      owners_count: parseIntOrUndefined(getTagContent(elementXml, 'owners_count')),
      doors_count: parseIntOrUndefined(getTagContent(elementXml, 'doors_count')),
      weight: parseIntOrUndefined(getTagContent(elementXml, 'weight')),
      cubic_capacity: parseIntOrUndefined(getTagContent(elementXml, 'cubic_capacity')),
    };

    if (vehicle.ad_number > 0) vehicles.push(vehicle);
  }

  return vehicles;
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('MULTIGESTIONALE_API_KEY');
    
    if (!apiKey) {
      console.error('MULTIGESTIONALE_API_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body for filters
    let filters: Record<string, string | number> = {};
    try {
      if (req.method === 'POST') {
        filters = await req.json();
      }
    } catch (_e) {
      // No body or invalid JSON, use defaults
    }

    // Build API URL with parameters
    const baseUrl = 'https://motori.multigestionale.com/api/xml/';
    const params = new URLSearchParams({
      cc: apiKey,
      engine: (filters.engine as string) || 'car',
      show: 'all',
      dealer_info: '1',
    });

    // Add optional filters
    if (filters.make) params.append('make', String(filters.make));
    if (filters.model) params.append('model', String(filters.model));
    if (filters.vehicle_class) params.append('vehicle_class', String(filters.vehicle_class));
    if (filters.category) params.append('category', String(filters.category));
    if (filters.limit) params.append('limit', String(filters.limit));
    if (filters.sort) params.append('sort', String(filters.sort));
    if (filters.invert) params.append('invert', String(filters.invert));

    const apiUrl = `${baseUrl}?${params.toString()}`;

    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds

    let response;
    try {
      response = await fetch(apiUrl, { signal: controller.signal });
      clearTimeout(timeoutId);
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('Request timeout after 10 seconds');
        return new Response(
          JSON.stringify({ success: false, error: 'Request timeout - API non disponibile' }),
          { status: 504, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw error;
    }
    
    if (!response.ok) {
      console.error('API response not OK:', response.status, response.statusText);
      return new Response(
        JSON.stringify({ success: false, error: `API returned ${response.status}` }),
        // Return 200 so the frontend can handle it via { success: false } without throwing
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const xmlText = await response.text();

    if (!xmlText || xmlText.trim().length === 0) {
      console.error("Empty upstream response body");
      return new Response(
        JSON.stringify({
          success: false,
          error: "Risposta vuota da Multigestionale (chiave non valida, IP non autorizzato o endpoint non disponibile).",
        }),
        // Return 200 so the frontend can handle it via { success: false } without throwing
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check for error in response
    if (xmlText.includes('<error>')) {
      const errorCode = getTagContent(xmlText, 'error');
      console.error('API returned error:', errorCode);
      return new Response(
        JSON.stringify({ success: false, error: `API error: ${errorCode}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const vehicles = parseXmlToVehicles(xmlText);

    return new Response(
      JSON.stringify({ success: true, data: vehicles, count: vehicles.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('Error fetching vehicles:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
