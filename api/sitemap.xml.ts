import type { VercelRequest, VercelResponse } from '@vercel/node';

// Static routes that should always be in the sitemap
const staticRoutes = [
  { path: '/', priority: 1.0, changefreq: 'daily' },
  { path: '/listings', priority: 0.9, changefreq: 'daily' },
  { path: '/valutiamo', priority: 0.8, changefreq: 'weekly' },
  { path: '/contatti', priority: 0.7, changefreq: 'monthly' },
  { path: '/blog', priority: 0.7, changefreq: 'weekly' },
  { path: '/faq', priority: 0.6, changefreq: 'monthly' },
  { path: '/privacy-policy', priority: 0.3, changefreq: 'yearly' },
  { path: '/cookie-policy', priority: 0.3, changefreq: 'yearly' },
  { path: '/terms', priority: 0.3, changefreq: 'yearly' },
];

interface Vehicle {
  ad_number: number;
  images?: string[];
  [key: string]: unknown; // Allow other properties
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    const siteUrl = process.env.VITE_SITE_URL || 'https://automarket.it';
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      // If Supabase is not configured, return sitemap with only static routes
      const sitemap = generateSitemap(staticRoutes, [], siteUrl);
      res.setHeader('Content-Type', 'application/xml');
      res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
      return res.status(200).send(sitemap);
    }

    // Fetch vehicles via Supabase Edge Function (which proxies to MULTIGESTIONALE API)
    // This uses the same endpoint as the frontend to ensure consistency
    let vehicles: Vehicle[] = [];
    try {
      // Call Supabase Edge Function that proxies to MULTIGESTIONALE API
      const functionsUrl = supabaseUrl.replace(/\/$/, '');
      const vehiclesResponse = await fetch(`${functionsUrl}/functions/v1/fetch-vehicles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({ limit: 1000 }), // Get up to 1000 vehicles for sitemap
      });

      if (vehiclesResponse.ok) {
        const data = await vehiclesResponse.json();
        if (data.success && data.data && Array.isArray(data.data)) {
          vehicles = data.data;
        }
      } else {
        console.error('Failed to fetch vehicles:', vehiclesResponse.status, await vehiclesResponse.text());
      }
    } catch (error) {
      console.error('Error fetching vehicles for sitemap:', error);
      // Continue with static routes only if vehicle fetch fails
    }

    // Generate vehicle routes
    const vehicleRoutes = vehicles.map((vehicle) => ({
      path: `/vehicle/${vehicle.ad_number}`,
      priority: 0.8,
      changefreq: 'weekly' as const,
    }));

    // Combine all routes
    const allRoutes = [...staticRoutes, ...vehicleRoutes];

    // Generate sitemap XML
    const sitemap = generateSitemap(allRoutes, vehicles, siteUrl);

    // Set headers for caching
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');

    return res.status(200).send(sitemap);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return basic sitemap with static routes only
    const siteUrl = process.env.VITE_SITE_URL || 'https://automarket.it';
    const sitemap = generateSitemap(staticRoutes, [], siteUrl);
    res.setHeader('Content-Type', 'application/xml');
    return res.status(200).send(sitemap);
  }
}

function generateSitemap(
  routes: Array<{ path: string; priority: number; changefreq: string }>,
  vehicles: Vehicle[],
  siteUrl: string
): string {
  const now = new Date().toISOString();
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  xml += '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n';

  for (const route of routes) {
    const fullUrl = `${siteUrl}${route.path}`;
    const lastmod = route.path.startsWith('/vehicle/') 
      ? getVehicleLastmod(route.path, vehicles)
      : now;

    xml += '  <url>\n';
    xml += `    <loc>${escapeXml(fullUrl)}</loc>\n`;
    xml += `    <lastmod>${lastmod}</lastmod>\n`;
    xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
    xml += `    <priority>${route.priority.toFixed(1)}</priority>\n`;
    
    // Add image for vehicle pages
    if (route.path.startsWith('/vehicle/')) {
      const vehicleId = route.path.split('/').pop();
      const vehicle = vehicles.find(v => v.ad_number.toString() === vehicleId);
      if (vehicle && vehicle.images && Array.isArray(vehicle.images) && vehicle.images.length > 0) {
        const imageUrl = vehicle.images[0].startsWith('http') 
          ? vehicle.images[0] 
          : `${siteUrl}${vehicle.images[0].startsWith('/') ? '' : '/'}${vehicle.images[0]}`;
        xml += `    <image:image>\n`;
        xml += `      <image:loc>${escapeXml(imageUrl)}</image:loc>\n`;
        xml += `    </image:image>\n`;
      }
    }
    
    xml += '  </url>\n';
  }

  xml += '</urlset>';
  return xml;
}

function getVehicleLastmod(path: string, vehicles: Vehicle[]): string {
  // Try to get the vehicle's last modified date if available
  // For now, use current date
  return new Date().toISOString();
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

