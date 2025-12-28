import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

/**
 * Validates and retrieves required environment variables
 * Shows helpful error message in development, throws in production
 */
function requireEnv(key: string): string {
  const value = import.meta.env[key];
  if (!value || typeof value !== "string") {
    const errorMessage = `Missing required environment variable: ${key}. Please set it in your .env file or deployment platform.`;
    
    // In development, show error in console and on page
    if (import.meta.env.DEV) {
      console.error(`❌ ${errorMessage}`);
      if (typeof window !== "undefined") {
        const errorDiv = document.createElement("div");
        errorDiv.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: #dc2626;
          color: white;
          padding: 16px;
          z-index: 9999;
          font-family: system-ui, sans-serif;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        `;
        errorDiv.innerHTML = `
          <strong>⚠️ Configuration Error</strong><br>
          ${errorMessage}<br>
          <small>Create a .env file in the project root with: ${key}=your-value</small>
        `;
        document.body.appendChild(errorDiv);
      }
    }
    
    throw new Error(errorMessage);
  }
  return value;
}

// Get env vars with validation
// In development, show helpful error but allow app to load with placeholder values
// In production, fail fast for security
let supabaseUrl: string;
let supabaseKey: string;

const isDev = import.meta.env.DEV;
const url = import.meta.env.VITE_SUPABASE_URL;
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url) {
  if (isDev) {
    console.warn("⚠️ VITE_SUPABASE_URL not set. App will not function correctly. Create a .env file with your Supabase URL.");
    supabaseUrl = "https://placeholder.supabase.co"; // Placeholder for dev
  } else {
    throw new Error("Missing required environment variable: VITE_SUPABASE_URL");
  }
} else {
  supabaseUrl = url;
}

supabaseKey = publishableKey || anonKey || "";

if (!supabaseKey) {
  if (isDev) {
    console.warn("⚠️ VITE_SUPABASE_PUBLISHABLE_KEY or VITE_SUPABASE_ANON_KEY not set. App will not function correctly. Create a .env file with your Supabase key.");
    supabaseKey = "placeholder-key"; // Placeholder for dev
  } else {
    throw new Error("Missing required environment variable: VITE_SUPABASE_PUBLISHABLE_KEY or VITE_SUPABASE_ANON_KEY");
  }
}

// Create client with sessionStorage for better security (tokens cleared on tab close)
export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    storage: typeof window !== "undefined" ? window.sessionStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
  },
});

export type { Database };

