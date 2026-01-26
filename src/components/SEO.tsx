import { forwardRef } from "react";
import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  keywords?: string;
  noindex?: boolean;
  canonical?: string;
}

const defaultTitle = "AutoAndrew - Trova la tua Auto Perfetta";
const defaultDescription = "Vendita di auto usate selezionate e garantite. Scopri il nostro parco auto e trova il veicolo ideale per te.";
const defaultImage = "/placeholder.svg";
const siteUrl = import.meta.env.VITE_SITE_URL || "https://andrewauto.vercel.app";

export const SEO = forwardRef<HTMLDivElement, SEOProps>(({
  title,
  description,
  image,
  url,
  type = "website",
  keywords,
  noindex = false,
  canonical,
}: SEOProps) => {
  // Put site name first, then page title
  const fullTitle = title ? `AutoAndrew | ${title}` : defaultTitle;
  const fullDescription = description || defaultDescription;
  const fullImage = image ? (image.startsWith("http") ? image : `${siteUrl}${image}`) : `${siteUrl}${defaultImage}`;
  const fullUrl = url ? (url.startsWith("http") ? url : `${siteUrl}${url}`) : siteUrl;
  const canonicalUrl = canonical || fullUrl;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={fullDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}
      <meta name="author" content="AutoAndrew" />
      <meta name="language" content="Italian" />
      <meta name="geo.region" content="IT" />
      <meta name="referrer" content="strict-origin-when-cross-origin" />
      <meta name="format-detection" content="telephone=no" />

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:site_name" content="AutoAndrew" />
      <meta property="og:locale" content="it_IT" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={fullImage} />

      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#000000" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="application-name" content="AutoAndrew" />
    </Helmet>
  );
});

SEO.displayName = "SEO";

