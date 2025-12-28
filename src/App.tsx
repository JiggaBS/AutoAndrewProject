// App entry point
import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "next-themes";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Skeleton } from "@/components/ui/skeleton";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { PageTracker } from "@/components/PageTracker";
import { CookieConsent } from "@/components/CookieConsent";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { EnvWarning } from "@/components/EnvWarning";
import { SentryUserTracker } from "@/components/SentryUserTracker";
import { validateProductionEnv } from "@/lib/production-check";

// Lazy load routes for code splitting
const Index = lazy(() => import("./pages/Index"));
const Listings = lazy(() => import("./pages/Listings"));
const VehicleDetail = lazy(() => import("./pages/VehicleDetail"));
const Valutiamo = lazy(() => import("./pages/Valutiamo"));
const Contatti = lazy(() => import("./pages/Contatti"));
const Blog = lazy(() => import("./pages/Blog"));
const Auth = lazy(() => import("./pages/Auth"));
const Admin = lazy(() => import("./pages/Admin"));
const CustomerArea = lazy(() => import("./pages/CustomerArea"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));
const TermsConditions = lazy(() => import("./pages/TermsConditions"));
const FAQ = lazy(() => import("./pages/FAQ"));
const TrackRequest = lazy(() => import("./pages/TrackRequest"));

// Configure React Query with proper caching strategy
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Skeleton className="h-8 w-64" />
  </div>
);

// Production environment validator component
const ProductionValidator = () => {
  useEffect(() => {
    try {
      validateProductionEnv();
    } catch (error) {
      // In production, this will prevent the app from loading
      // In development, it just logs a warning
      console.error('Production validation failed:', error);
      if (import.meta.env.PROD) {
        // Security: Use safe DOM manipulation instead of innerHTML
        const container = document.createElement("div");
        container.style.cssText = "display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; text-align: center; font-family: system-ui, sans-serif;";
        
        const content = document.createElement("div");
        content.style.cssText = "max-width: 600px;";
        
        const heading = document.createElement("h1");
        heading.style.cssText = "color: #dc2626; margin-bottom: 20px;";
        heading.textContent = "Configuration Error";
        content.appendChild(heading);
        
        const errorMsg = document.createElement("p");
        errorMsg.style.cssText = "color: #666; margin-bottom: 20px;";
        errorMsg.textContent = error instanceof Error ? error.message : 'Application configuration is invalid';
        content.appendChild(errorMsg);
        
        const contactMsg = document.createElement("p");
        contactMsg.style.cssText = "color: #999; font-size: 14px;";
        contactMsg.textContent = "Please contact the administrator.";
        content.appendChild(contactMsg);
        
        container.appendChild(content);
        document.body.appendChild(container);
      }
    }
  }, []);
  return null;
};

const App = () => (
  <ErrorBoundary>
    <HelmetProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <LanguageProvider>
          <ProductionValidator />
          <GoogleAnalytics />
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <SentryUserTracker />
                <EnvWarning />
                <PageTracker />
                <CookieConsent />
                <Suspense fallback={<LoadingFallback />}>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/listings" element={<Listings />} />
                    <Route path="/vehicle/:id" element={<VehicleDetail />} />
                    <Route path="/valutiamo" element={<Valutiamo />} />
                    <Route path="/contatti" element={<Contatti />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/dashboard" element={<CustomerArea />} />
                    <Route path="/profile" element={<CustomerArea />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/cookie-policy" element={<CookiePolicy />} />
                    <Route path="/terms" element={<TermsConditions />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/traccia-richiesta" element={<TrackRequest />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </BrowserRouter>
            </TooltipProvider>
          </QueryClientProvider>
        </LanguageProvider>
      </ThemeProvider>
    </HelmetProvider>
  </ErrorBoundary>
);

export default App;
