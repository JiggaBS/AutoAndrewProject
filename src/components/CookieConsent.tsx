import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { X, Settings, Cookie } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type CookiePreferences = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
};

const COOKIE_CONSENT_KEY = "cookie_consent";
const COOKIE_PREFERENCES_KEY = "cookie_preferences";

export const CookieConsent = () => {
  const { t } = useLanguage();
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Small delay to avoid flash
      const timer = setTimeout(() => setShowBanner(true), 500);
      return () => clearTimeout(timer);
    } else {
      const savedPrefs = localStorage.getItem(COOKIE_PREFERENCES_KEY);
      if (savedPrefs) {
        setPreferences(JSON.parse(savedPrefs));
      }
    }
  }, []);

  const saveConsent = (prefs: CookiePreferences) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "true");
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(prefs));
    setPreferences(prefs);
    setShowBanner(false);
    setShowSettings(false);

    // Enable/disable analytics based on preference
    if (prefs.analytics && window.gtag) {
      window.gtag("consent", "update", {
        analytics_storage: "granted",
      });
    }
  };

  const acceptAll = () => {
    saveConsent({ necessary: true, analytics: true, marketing: true });
  };

  const acceptNecessary = () => {
    saveConsent({ necessary: true, analytics: false, marketing: false });
  };

  const savePreferences = () => {
    saveConsent(preferences);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 pointer-events-none">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/60 backdrop-blur-sm pointer-events-auto"
        onClick={() => setShowSettings(false)}
      />
      
      {/* Banner */}
      <div className="relative w-full max-w-4xl bg-card border border-border rounded-xl shadow-2xl pointer-events-auto animate-in slide-in-from-bottom-4 duration-300">
        {showSettings ? (
          // Settings Panel
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Settings className="w-5 h-5" />
                {t("cookies.settings.title")}
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSettings(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {/* Necessary */}
              <div className="flex items-start justify-between p-4 bg-secondary/50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{t("cookies.necessary.title")}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t("cookies.necessary.desc")}
                  </p>
                </div>
                <div className="ml-4">
                  <div className="w-12 h-6 bg-primary rounded-full relative">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-primary-foreground rounded-full" />
                  </div>
                </div>
              </div>

              {/* Analytics */}
              <div className="flex items-start justify-between p-4 bg-secondary/50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{t("cookies.analytics.title")}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t("cookies.analytics.desc")}
                  </p>
                </div>
                <button
                  onClick={() => setPreferences(p => ({ ...p, analytics: !p.analytics }))}
                  className={`ml-4 w-12 h-6 rounded-full relative transition-colors ${
                    preferences.analytics ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <div 
                    className={`absolute top-1 w-4 h-4 bg-primary-foreground rounded-full transition-all ${
                      preferences.analytics ? "right-1" : "left-1"
                    }`} 
                  />
                </button>
              </div>

              {/* Marketing */}
              <div className="flex items-start justify-between p-4 bg-secondary/50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{t("cookies.marketing.title")}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t("cookies.marketing.desc")}
                  </p>
                </div>
                <button
                  onClick={() => setPreferences(p => ({ ...p, marketing: !p.marketing }))}
                  className={`ml-4 w-12 h-6 rounded-full relative transition-colors ${
                    preferences.marketing ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <div 
                    className={`absolute top-1 w-4 h-4 bg-primary-foreground rounded-full transition-all ${
                      preferences.marketing ? "right-1" : "left-1"
                    }`} 
                  />
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
              <Button variant="outline" onClick={acceptNecessary}>
                {t("cookies.acceptNecessary")}
              </Button>
              <Button onClick={savePreferences}>
                {t("cookies.save")}
              </Button>
            </div>
          </div>
        ) : (
          // Main Banner
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Cookie className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {t("cookies.title")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t("cookies.description")}{" "}
                  {t("cookies.learnMore")}{" "}
                  <Link to="/cookie-policy" className="text-primary hover:underline">
                    {t("footer.cookies")}
                  </Link>{" "}
                  {t("cookies.and")}{" "}
                  <Link to="/privacy-policy" className="text-primary hover:underline">
                    {t("footer.privacy")}
                  </Link>.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 pt-4 border-t border-border">
              <Button
                variant="ghost"
                onClick={() => setShowSettings(true)}
                className="order-3 sm:order-1"
              >
                <Settings className="w-4 h-4 mr-2" />
                {t("cookies.customize")}
              </Button>
              <Button
                variant="outline"
                onClick={acceptNecessary}
                className="order-2"
              >
                {t("cookies.acceptNecessary")}
              </Button>
              <Button onClick={acceptAll} className="order-1 sm:order-3">
                {t("cookies.acceptAll")}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
