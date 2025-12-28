// App entry point
import { lazy, Suspense } from "react";
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

const App = () => (
  <ErrorBoundary>
    <HelmetProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <LanguageProvider>
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
