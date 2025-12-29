import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown, Shield, Award, CreditCard, RefreshCw } from "lucide-react";
import heroBgDark from "@/assets/hero-bg.webp";
import heroBgLight from "@/assets/hero-bg-light.jpg";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "next-themes";

const trustBadges = [
  { icon: Shield, label: "Garanzia 12 mesi" },
  { icon: Award, label: "Auto certificate" },
  { icon: CreditCard, label: "Finanziamenti" },
  { icon: RefreshCw, label: "Ritiro usato" },
];

export const HeroSection = forwardRef<HTMLElement>((props, ref) => {
  const { t, language } = useLanguage();
  const { resolvedTheme } = useTheme();
  
  const heroBg = resolvedTheme === "light" ? heroBgLight : heroBgDark;
  
  const scrollToContent = () => {
    window.scrollTo({ top: window.innerHeight - 100, behavior: "smooth" });
  };

  return (
    <section ref={ref} className="relative min-h-[75vh] md:min-h-[88vh] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-no-repeat scale-105 animate-[pulse_20s_ease-in-out_infinite] bg-[position:70%_center] md:bg-center"
        style={{
          backgroundImage: `url(${heroBg})`,
          animationName: "subtle-zoom",
        }}
      />
      
      {/* Enhanced Overlay for better text readability */}
      {/* Dark mode overlay - lighter gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/20 dark:block hidden" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/30 dark:block hidden" />
      
      {/* Light mode overlay - lighter for better visibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent dark:hidden" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent dark:hidden" />

      {/* Animated Accent Lines */}
      <div className="absolute top-1/4 left-0 w-1 h-40 bg-gradient-to-b from-transparent via-primary to-transparent opacity-70" />
      <div className="absolute top-1/3 left-4 w-0.5 h-24 bg-gradient-to-b from-transparent via-primary/50 to-transparent opacity-50" />

      {/* Content */}
      <div className="container relative z-10 py-8 md:py-20">
        <div className="max-w-2xl space-y-8">
          {/* Brand Tag */}
          <span
            className="inline-block text-primary font-semibold text-sm uppercase tracking-[0.2em] opacity-0 animate-fade-in"
            style={{ animationDelay: "100ms", animationFillMode: "forwards" }}
          >
            AutoAndrew
          </span>

          {/* Main Headline - Improved Typography */}
          <h1
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white dark:text-foreground leading-[1.1] tracking-tight opacity-0 animate-fade-in"
            style={{ animationDelay: "200ms", animationFillMode: "forwards" }}
          >
            {language === "it" ? (
              <>
                Trova la tua
                <br />
                <span className="text-primary relative inline-block mt-1">
                  Auto Perfetta
                  <svg className="absolute -bottom-2 left-0 w-full h-2" viewBox="0 0 200 8" fill="none" preserveAspectRatio="none">
                    <path
                      d="M0 4C50 0 150 8 200 4"
                      stroke="hsl(var(--primary))"
                      strokeWidth="3"
                      strokeLinecap="round"
                      className="opacity-70"
                    />
                  </svg>
                </span>
              </>
            ) : (
              <>
                Find Your
                <br />
                <span className="text-primary relative inline-block mt-1">
                  Perfect Car
                  <svg className="absolute -bottom-2 left-0 w-full h-2" viewBox="0 0 200 8" fill="none" preserveAspectRatio="none">
                    <path
                      d="M0 4C50 0 150 8 200 4"
                      stroke="hsl(var(--primary))"
                      strokeWidth="3"
                      strokeLinecap="round"
                      className="opacity-70"
                    />
                  </svg>
                </span>
              </>
            )}
          </h1>

          {/* Subtitle - Improved Contrast and Line Height */}
          <p
            className="text-slate-200 dark:text-muted-foreground text-lg sm:text-xl md:text-[22px] max-w-xl leading-relaxed opacity-0 animate-fade-in"
            style={{ animationDelay: "300ms", animationFillMode: "forwards" }}
          >
            {t("hero.subtitle")}
          </p>

          {/* CTA Buttons - Clear Hierarchy */}
          <div
            className="flex flex-col sm:flex-row gap-4 pt-2 opacity-0 animate-fade-in"
            style={{ animationDelay: "400ms", animationFillMode: "forwards" }}
          >
            {/* Primary CTA - Solid Orange */}
            <Button 
              asChild 
              size="lg" 
              className="text-base font-semibold group h-12 px-8 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <Link to="/listings">
                {t("hero.cta.browse")}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            
            {/* Secondary CTA - Ghost/Outline */}
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="text-base font-semibold h-12 px-8 bg-white/10 border border-white/30 text-white backdrop-blur-sm hover:bg-white/20 hover:border-white/50 dark:bg-foreground/5 dark:border-foreground/20 dark:text-foreground dark:hover:bg-foreground/10 dark:hover:border-foreground/40 transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <Link to="/valutiamo">{t("hero.cta.valuation")}</Link>
            </Button>
          </div>

          {/* Trust Badges */}
          <div
            className="hidden flex flex-wrap gap-3 pt-4 opacity-0 animate-fade-in"
            style={{ animationDelay: "500ms", animationFillMode: "forwards" }}
          >
            {trustBadges.map((badge, index) => (
              <div
                key={badge.label}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 dark:bg-foreground/5 backdrop-blur-sm border border-white/20 dark:border-foreground/10 text-white dark:text-muted-foreground text-sm font-medium"
              >
                <badge.icon className="w-4 h-4 text-primary" />
                <span className="text-xs sm:text-sm">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-0 right-0 flex justify-center z-10">
        <button
          onClick={scrollToContent}
          className="flex flex-col items-center gap-2 text-slate-400 hover:text-white dark:text-muted-foreground dark:hover:text-foreground transition-colors cursor-pointer opacity-0 animate-fade-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg p-2"
          style={{ animationDelay: "700ms", animationFillMode: "forwards" }}
          aria-label="Scroll to content"
        >
          <span className="text-xs uppercase tracking-widest font-medium">
            {language === "it" ? "Scopri" : "Discover"}
          </span>
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </button>
      </div>

      {/* Decorative gradient at bottom - smooth multi-stop transition */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-[linear-gradient(to_top,hsl(var(--background))_0%,hsl(var(--background)/0.85)_35%,hsl(var(--background)/0.4)_65%,transparent_100%)]" />
    </section>
  );
});

HeroSection.displayName = "HeroSection";
