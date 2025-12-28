// Google Analytics utility functions

declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string | Date,
      config?: Record<string, unknown>
    ) => void;
    dataLayer?: unknown[];
    __GA_MEASUREMENT_ID?: string;
  }
}

// Google Analytics Measurement ID
// - Prefer build-time env when available
// - Fallback to runtime value set by GoogleAnalytics component / localStorage
const getGaMeasurementId = () => {
  const envId = (import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined) || "";
  if (envId) return envId;

  if (typeof window === "undefined") return "";
  return (
    window.__GA_MEASUREMENT_ID ||
    localStorage.getItem("ga_measurement_id") ||
    ""
  );
};

/**
 * Initialize Google Analytics
 * Note: This is now handled by GoogleAnalytics component
 * Keeping for backwards compatibility
 */
export const initGA = () => {
  // Initialization is handled by GoogleAnalytics component
  // This function is kept for backwards compatibility
};

/**
 * Track page views
 */
export const trackPageView = (path: string, title?: string) => {
  const GA_MEASUREMENT_ID = getGaMeasurementId();
  if (!GA_MEASUREMENT_ID || typeof window === "undefined" || !window.gtag) {
    return;
  }

  window.gtag("config", GA_MEASUREMENT_ID, {
    page_path: path,
    page_title: title,
  });
};

/**
 * Track custom events
 */
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  const GA_MEASUREMENT_ID = getGaMeasurementId();
  if (!GA_MEASUREMENT_ID || typeof window === "undefined" || !window.gtag) {
    return;
  }

  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

/**
 * Track vehicle views
 */
export const trackVehicleView = (vehicleId: string, vehicleName: string) => {
  trackEvent("view_item", "vehicle", vehicleName, undefined);
  trackEvent("view_item_details", "vehicle", vehicleId);
};

/**
 * Track search events
 */
export const trackSearch = (searchTerm: string, resultsCount: number) => {
  trackEvent("search", "search", searchTerm, resultsCount);
};

/**
 * Track filter usage
 */
export const trackFilter = (filterName: string, filterValue: string) => {
  trackEvent("filter", "search", `${filterName}: ${filterValue}`);
};

/**
 * Track contact form submissions
 */
export const trackContactForm = (formType: string) => {
  trackEvent("form_submit", "contact", formType);
};

/**
 * Track WhatsApp clicks
 */
export const trackWhatsAppClick = (context?: string) => {
  trackEvent("click", "whatsapp", context);
};

/**
 * Track save vehicle actions
 */
export const trackSaveVehicle = (vehicleId: string, action: "save" | "unsave") => {
  trackEvent(action === "save" ? "save_vehicle" : "unsave_vehicle", "vehicle", vehicleId);
};

/**
 * Track share actions
 */
export const trackShare = (method: string, contentType: string) => {
  trackEvent("share", "engagement", `${method}: ${contentType}`);
};

