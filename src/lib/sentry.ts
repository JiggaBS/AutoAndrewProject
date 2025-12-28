import * as Sentry from "@sentry/react";

/**
 * Initialize Sentry for error tracking
 * Only initializes if VITE_SENTRY_DSN is provided
 * This makes Sentry optional - the app will work without it
 */
export function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN;

  if (!dsn) {
    return;
  }

  const environment = import.meta.env.MODE || "development";
  const release = import.meta.env.VITE_APP_VERSION || undefined;

  Sentry.init({
    dsn,
    environment,
    release,
    
    // Performance Monitoring
    tracesSampleRate: environment === "production" ? 0.1 : 1.0, // 10% in prod, 100% in dev
    
    // Session Replay (optional, can be enabled if needed)
    replaysSessionSampleRate: environment === "production" ? 0.1 : 1.0,
    replaysOnErrorSampleRate: 1.0,
    
    // Filter out common non-critical errors
    ignoreErrors: [
      // Browser extensions
      "top.GLOBALS",
      "originalCreateNotification",
      "canvas.contentDocument",
      "MyApp_RemoveAllHighlights",
      "atomicFindClose",
      // Network errors that are often not actionable
      "NetworkError",
      "Network request failed",
      // Third-party scripts
      "fb_xd_fragment",
      "bmi_SafeAddOnload",
      "EBCallBackMessageReceived",
      // Chrome extensions
      "chrome-extension://",
    ],
    
    // Filter out URLs that shouldn't be tracked
    denyUrls: [
      // Browser extensions
      /extensions\//i,
      /^chrome:\/\//i,
      /^chrome-extension:\/\//i,
    ],
    
    // Additional context
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    
    // Only send errors in production, or if explicitly enabled in dev
    beforeSend(event, hint) {
      // In development, you might want to see all errors
      // In production, Sentry will automatically filter
      if (environment === "development" && !import.meta.env.VITE_SENTRY_ENABLE_IN_DEV) {
        return null; // Don't send in dev unless explicitly enabled
      }
      return event;
    },
  });
}

/**
 * Set user context for Sentry
 * Call this after user authentication
 */
export function setSentryUser(user: { id: string; email?: string; username?: string }) {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.username,
  });
}

/**
 * Clear user context (e.g., on logout)
 */
export function clearSentryUser() {
  Sentry.setUser(null);
}

