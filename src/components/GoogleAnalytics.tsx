import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Component to initialize Google Analytics
 * Should be placed in the root of the app
 */
export const GoogleAnalytics = () => {
  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      const envId = (import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined) || "";
      const cachedId = typeof window !== "undefined" ? localStorage.getItem("ga_measurement_id") : null;

      let measurementId = envId || cachedId || "";

      // If not available at build-time, fetch from backend config (public) and cache it
      if (!measurementId) {
        try {
          const { data, error } = await supabase.functions.invoke("public-config");
          if (!error && data) {
            measurementId = (data as any)?.gaMeasurementId || "";
            if (measurementId && typeof window !== "undefined") {
              localStorage.setItem("ga_measurement_id", measurementId);
            }
          }
        } catch (err) {
          console.warn("Failed to fetch GA config from backend:", err);
        }
      }

      if (cancelled) return;

      if (!measurementId) {
        console.warn("Google Analytics Measurement ID non configurato (VITE_GA_MEASUREMENT_ID).");
        return;
      }

      (window as any).__GA_MEASUREMENT_ID = measurementId;

      // Check if already initialized
      if (window.gtag && window.dataLayer) {
        return;
      }

      // Load Google Analytics script
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      document.head.appendChild(script);

      // Initialize dataLayer and gtag
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () {
        window.dataLayer.push(arguments);
      };
      window.gtag("js", new Date());
      window.gtag("config", measurementId, {
        page_path: window.location.pathname,
      });
    };

    void init();

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
};


